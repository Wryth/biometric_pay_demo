var zoomRestEndpointBaseURL = "https://api.zoomauth.com/api/v1/biometrics";
var licenseKey = "dGfLBXdNbrodjpafesLXGGUzBM5FoolW";
var videoTrack;

var SampleAppState = {
  Idle: 1,
  CheckingLiveness: 2,
  Enrolling: 3,
  Authenticating: 4,
  CheckingEnrollment: 5,
  DeletingEnrollment: 6,
  Searching: 7
};

var lastAction = SampleAppState.Idle;
var lastAuditTrail = [];
var enableLowLightMode = false;

window.onload = function () {
  var zoomBrowserSupport = ZoomSDK.getBrowserSupport();
  if(!zoomBrowserSupport.supported) {
    handleUnsupportedBrowser();
    return;
  }

  $("#status").html("Initializing ZoOm...");
  ZoomSDK.initialize(licenseKey, function (initializationSuccessful) {
    if(initializationSuccessful === false) {
      handleFailedInit();
      return;
    }

    $("#status").html("Preloading ZoOm...");
    ZoomSDK.preload(function (preloadResult) {
      if(preloadResult !== ZoomSDK.ZoomTypes.ZoomPreloadResult.Success) {
        $("#status").html("Preload Unsuccessful");
        handleFailedPreload();
        return;
      }

      $("#status").html("Setting up Camera...");
      initializeZoomCamera(document.getElementById("zoom-parent-container"), document.getElementById("zoom-video-element"), 0, function(selectedTrack) {
        videoTrack = selectedTrack;
        $("#toggle-link").fadeIn(300);
        $("#error-overlay").fadeOut(300);
        $("#liveness-button").fadeTo(300, 1);
        $("#loading-overlay").fadeOut(300, function() {
          $("#loading-overlay").hide();
        });
        $(".container-for-developer-overlays-and-zoom").css("border", "3px solid white");
        $(".image-switch-container").css("width", $(".container-for-developer-overlays-and-zoom").width());
        $(".image-switch-container").css("right", $(".container-for-developer-overlays-and-zoom").position().left);
        
        /*
        var lowLightSwitch = document.getElementsByClassName("low-light-switch");
        lowLightSwitch[0].addEventListener("click", function() {
          toggleLowLightModeAnimation();
        });
        */  
        
        // Update set of things we may want to update after we know how big the camera is and its aspect ratio.
        updateZoomUIConstraintsAfterCameraSuccess();
        $(".image-switch-container").fadeIn(300);

      }, handleCameraAccessError);
    });
  });

  // See MobileDeviceHelpers.js for an example of how to set constraints on the ZoOm interface elements in order to get better UX across mobile devices.
  adjustZoomInterfaceForMobile();
};

// Called when we dont want to show the User Guide first - last button in User Guide, and from retry screens.
function initiateZoomSessionCapture() {
  appendLog("Preparing ZoOm interface...");


  ZoomSDK.prepareInterface("zoom-interface-container", "zoom-video-element", function (prepareInterfaceResult) {
    if (prepareInterfaceResult != ZoomSDK.ZoomTypes.ZoomPrepareInterfaceResult.Success) {
      appendLog("prepareInterface was not successful. prepareInterfaceResult: " + prepareInterfaceResult);
      handleFailedPrepareInterface(prepareInterfaceResult);
      return;
    }

    // Show ZoOm.
    hideDeveloperOverlays();
    $("#developer-overlay-semi-transparent-cover").fadeOut(300);
    $(".controls").hide(300);

    // Clear out last audit trail and record session.
    lastAuditTrail = [];

    // Start the capture.
    var zoomSession = new ZoomSDK.ZoomSession(onZoomSessionComplete, videoTrack);
    zoomSession.setOnZoomSessionProcessingStarted(onZoomSessionProcessingStarted);
    zoomSession.capture();
  });
}

// Called when ZoOm is completely done processing and has a result for the application to evaluate.
function onZoomSessionComplete(zoomResult) {
  console.log(zoomResult);
  // Handle cases where ZoOm exited early or otherwise a full session was not completed.
  // For instance, ZoOm will exit early and return FailedDueToTooMuchTimeToDetectFirstFace if
  // the user fails to place their face in the unzoomed oval in the first 7 seconds of the ZoOm capture.
  if (zoomResult.status === ZoomSDK.ZoomTypes.ZoomCaptureResult.FailedDueToTooMuchTimeToDetectFirstFace) {
    $("#feedback-text").html("We are having difficulty detecting your face.");

    if(zoomResult.faceMetrics && zoomResult.faceMetrics.auditTrail) {
      lastAuditTrail = zoomResult.faceMetrics.auditTrail;
    }

    showUnsuccessGuide();
    return;
  }
  else if (zoomResult.status === ZoomSDK.ZoomTypes.ZoomCaptureResult.FailedDueToTooMuchTimeToDetectFirstFaceInPhaseTwo) {
    $("#feedback-text").html("We are having difficulty getting getting a quality close-up selfie.");

    if(zoomResult.faceMetrics && zoomResult.faceMetrics.auditTrail) {
      lastAuditTrail = zoomResult.faceMetrics.auditTrail;
    }

    showUnsuccessGuide();
    return;
  }
  else if (zoomResult.status != ZoomSDK.ZoomTypes.ZoomCaptureResult.SessionCompleted || !zoomResult.facemap) {
    appendLog("ZoOm returned but Session was not successful. zoomResult.status: " + zoomResult.status);
    $("#upload-progress").fadeOut(300);
    fadeInMainUI();
    return;
  }

  // Get auditTrail images if available, otherwise clear it out.
  // AuditTrail is used in the sample to provide feedback to user on their session in the event of a failure
  // as well as uploading to FaceTec API in order to associate an image to the user enrollment.
  if(zoomResult.faceMetrics) {
    lastAuditTrail = zoomResult.faceMetrics.auditTrail;
  }
  else {
    lastAuditTrail = [];
  }

  appendLog("Calling ZoOm REST API with ZoOm Facemap Data...");

  // Set up vanilla xhr request to call REST API to process ZoOm FaceMap.
  var dataToUpload = new FormData();
  var xhr = new XMLHttpRequest();

  // Set up xhr request variables depending on whether we are enrolling, authenticating, or doing a liveness check.
  // Enrollment -- needs an enrollmentIdentifier to associate with user, auditTrailImage for the user, and the FaceMap.
  // Authentication -- needs an enrollmentIdentifier to compare the last ZoOm Session against, and the FaceMap to compare.
  // Liveness Check -- just needs the FaceMap.
  var successMessage;
  if(lastAction == SampleAppState.Enrolling) {
    xhr.open("POST", zoomRestEndpointBaseURL + "/enrollment");
    dataToUpload.append("enrollmentIdentifier", $("#username").val());
    dataToUpload.append("facemap", zoomResult.facemap);
    dataToUpload.append("auditTrailImage", convertAuditTrailBase64ToBlobForFaceTecAPI(zoomResult.faceMetrics.auditTrail[0]));
    successMessage = "Enrollment Succeeded";
  }
  else if(lastAction == SampleAppState.Authenticating) {
    xhr.open("POST", zoomRestEndpointBaseURL + "/authenticate");
    dataToUpload.append("source[enrollmentIdentifier]", $("#username").val());
    dataToUpload.append("targets[0][facemap]", zoomResult.facemap);
    successMessage = "Authentication Succeeded";
  }
  else if(lastAction == SampleAppState.CheckingLiveness) {
    xhr.open("POST", zoomRestEndpointBaseURL + "/liveness");
    dataToUpload.append("facemap", zoomResult.facemap);
    successMessage = "Liveness Confirmed";
  }
  else if(lastAction == SampleAppState.Searching){
    xhr.open("POST", zoomRestEndpointBaseURL + "/search");
    dataToUpload.append("sessionId", zoomResult.sessionId);
    dataToUpload.append("enrollmentIdentifier", $("#username").val());
    dataToUpload.append("minMatchLevel", 1);
    successMessage = "Search Confirmed";
    xhr.withCredentials = true;

  }

  // License Key, Session ID, and specific headers are required when using the FaceTec Managed REST API
  // but are not required when you deploy your own instance of ZoOm Server and when you are
  // issued licenses that do not require an HTTPS connection to FaceTec Servers.
  dataToUpload.append("sessionId", zoomResult.sessionId);
  xhr.setRequestHeader("X-App-Token", licenseKey);
  xhr.setRequestHeader("X-User-Agent", ZoomSDK.createZoomAPIUserAgentString(zoomResult.sessionId));

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      var success = false;
      try {
        var responseJSON = JSON.parse(this.responseText);

        // Check for specific success/fail scenarios.
        // Developers are encouraged to evaluate the results in more granular detail and in a safer manner depending on their application requirements.
        if(lastAction == SampleAppState.Enrolling) {
          // Success path for enrollment.
          if(responseJSON.data && responseJSON.data.livenessResult == "passed") {
            success = true;
          }
          // User needs to retry path for enrollment.
          else if(responseJSON && responseJSON.meta && responseJSON.meta.subCode && responseJSON.meta.subCode == "notEnrolled") {
            // Fall through to show unsuccess screens.
          }
          // Error path for enrollment.
          else {
            if(isEnrollmentResponseNameCollision(responseJSON)) {
              alert("User is already enrolled.");
            }
            else if(isResponseBadString(responseJSON)) {
              alert("Invalid enrollmentIdentifier entered.");
            }
            else {
              alert("Unhandled response from REST API.  Please check the response object for more details.");
            }

            fadeInMainUI();
            $("#upload-progress").fadeOut(200);
            lastAction = SampleAppState.Idle;
            return;
          }
        }
        else if(lastAction == SampleAppState.Authenticating) {
          if(responseJSON && responseJSON.data && responseJSON.data.results && responseJSON.data.results[0]) {
            // Success path for authentication.
            if(responseJSON.data.results[0].authenticated == true) {
              success = true;
            }
            // User needs to retry path for enrollment.
            else {
              // Fall through to show unsuccess screens.
            }
          }
          // Error path for authentication.
          else {
            if(isAuthenticationTargetNotFound(responseJSON)) {
              alert("The enrollmentIdentifier entered was not found in the database.");
            }
            else if(isResponseBadString(responseJSON)) {
              alert("Invalid enrollmentIdentifier entered.");
            }
            else {
              alert("Unhandled response from REST API.  Please check the response object for more details.");
            }

            fadeInMainUI();
            $("#upload-progress").fadeOut(200);
            lastAction = SampleAppState.Idle;
            return;
          }
        }
        else if(lastAction == SampleAppState.CheckingLiveness) {
          if (responseJSON && responseJSON.meta && responseJSON.meta.ok == true && responseJSON.data && responseJSON.data.livenessResult == "passed") {
            success = true;
          }
          else {
            // Fall through to show unsuccess screens.
          }
        }

        if(success) {
          appendLog(successMessage);
          $("#upload-progress").fadeOut(200, function() {
            $("#completion-animation-success-message").html(successMessage);
            $("#completion-animation-success").fadeIn();
          });
        }
        else {
          appendLog("User must retry ZoOm.");
          $("#feedback-text").html("Difficult environmental conditions detected.  Please see your attempt below.");
          showUnsuccessGuide();
        }
      }
      catch (e) {
        showGenericAPIUnsuccess();
        appendLog("Response from ZoOm REST API: " + this.responseText);
      }

      // Animate in the results then fade them out.
      $("#upload-progress").fadeOut(200);
      $("#completion-animation-container").fadeIn(800).delay(1200).fadeOut(400, function () {
        if(success) {
          fadeInMainUI();
        }
        $("#completion-animation-success").hide();
        $("#completion-animation-unsuccess").hide();
        $("#completion-animation-success-message").html("");
        $("#completion-animation-unsuccess-message").html("");
      });
    }
  };

  xhr.upload.onprogress = function name(event) {
    var progress = Math.round((event.loaded / event.total) * 100);
    $("#upload-progress-value").attr("value", progress);
  };
  xhr.send(dataToUpload);
}



// Checks if response from FaceTec Managed REST API indicates that enrollment already exists.
function isEnrollmentResponseNameCollision(responseJSON) {
  if(responseJSON && responseJSON.meta && responseJSON.meta.ok == false && responseJSON.meta.subCode && responseJSON.meta.subCode == "nameCollision") {
    return true;
  }
  else {
    return false;
  }
}

// Checks if response from FaceTec Managed REST API indicates that there was nothing to authenticate against.
function isAuthenticationTargetNotFound(responseJSON) {
  if(responseJSON && responseJSON.meta && responseJSON.meta.ok == false && responseJSON.meta.subCode && responseJSON.meta.subCode == "targetNotFound") {
    return true;
  }
  else {
    return false;
  }
}

// Checks if response from FaceTec Managed REST API indicates that the enrollmentIdentifier that was entered was bad.
function isResponseBadString(responseJSON) {
  if(responseJSON && responseJSON.meta && responseJSON.meta.ok == false && responseJSON.meta.subCode && (responseJSON.meta.subCode == "invalidName" || responseJSON.meta.subCode == "badStringParameter")) {
    return true;
  }
  else {
    return false;
  }
}

// This callback is called by the ZoOm Browser SDK when the session has been captured but is still processing.
// Defining this is optional, but recommended to provide snappy feedback.
// Here we show transitioning the UI while we wait for onZoomSessionComplete to be called.
function onZoomSessionProcessingStarted(sessionHasData) {
  $("#upload-progress-value").attr("value", 0);
  $("#developer-overlay-semi-transparent-cover").fadeIn(300);
  if (sessionHasData === ZoomSDK.ZoomTypes.ZoomCaptureResult.SessionCompleted) {
    $("#upload-progress").fadeIn(300);
  }
}

// Sets latest action to CheckingLiveness and starts New User Guidance flow.
function startLivenessCheck() {
  // Don't allow actions when actions are in progress.
  if(lastAction != SampleAppState.Idle) {
    return;
  }

  lastAction = SampleAppState.CheckingLiveness;
  showNewUserGuidance();
}

// Checks input box, sets latest action to Enrolling and starts New User Guidance flow.
// Note that we don't check if enrollment exists first.
// After completing the enrollment process and sending up the request, we could find that the enrollment already exists.
// Applications could choose to handle this differently and check for the enrollment existing more actively.
// We choose to not do this in this Sample for code clarity.
function startEnrollment() {
  if($("#username").val() == "") {
    alert("You must enter a Username to enroll.");
    return;
  }

  // Don't allow actions when actions are in progress.
  if(lastAction != SampleAppState.Idle) {
    return;
  }

  lastAction = SampleAppState.Enrolling;
  showNewUserGuidance();
}

// Checks input box, sets latest action to Authenticating and starts the ZoOm Session capture.
// Note that we don't check if enrollment exists first.
// After completing the enrollment process and sending up the request, we could find that the enrollment does not exist.
// Applications could choose to handle this differently and check for the enrollment existing more actively.
// We choose to not do this in this Sample for code clarity.
function startAuthentication() {
  if($("#username").val() == "") {
    alert("You must enter a Username to authenticate.");
    return;
  }

  // Don't allow actions when actions are in progress.
  if(lastAction != SampleAppState.Idle) {
    return;
  }

  lastAction = SampleAppState.Authenticating;
  initiateZoomSessionCapture();
}

function startFaceSearch() {
  if($("#username").val() == "") {
    alert("You must enter a Username to FaceSearch.");
    return;
  }

  // Don't allow actions when actions are in progress.
  if(lastAction != SampleAppState.Idle) {
    return;
  }

  lastAction = SampleAppState.Searching;
  initiateZoomSessionCapture();





/*
  var dataToUpload = new FormData();

  dataToUpload.append("sessionId", zoomResult.sessionId);
  dataToUpload.append("enrollmentIdentifier", $("#username").val());
  dataToUpload.append("minMatchLevel", 0);
  
  // you may also pass a facemap instead of enrollmentIdentifier
  
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  
  xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
          console.log(this.responseText);
      }
  });
  
  xhr.open("POST", "https://api.zoomauth.com/api/v1/biometrics/search");
  xhr.setRequestHeader("X-App-Token", "dGfLBXdNbrodjpafesLXGGUzBM5FoolW");
  
  xhr.send(dataToUpload);
*/

}


// Check if user is enrolled on the server already.
function isUserEnrolled() {
  if($("#username").val() == "") {
    alert("You must enter a Username to attempt to check enrollment.");
    return;
  }

  // Don't allow actions when actions are in progress.
  if(lastAction != SampleAppState.Idle) {
    return;
  }

  lastAction = SampleAppState.CheckingEnrollment;

  // Vanilla xhr request to check enrollment.
  var dataToUpload = new FormData();
  var xhr = new XMLHttpRequest();
  dataToUpload.append("enrollmentIdentifier", $("#username").val());
  xhr.open("GET", zoomRestEndpointBaseURL + "/enrollment/" + $("#username").val());
  xhr.setRequestHeader("X-App-Token", licenseKey);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if(this.responseText == "") {
        alert("responseText was empty.  This could indicate a network connectivity issue.");
      }
      try {
        var responseJSON = JSON.parse(this.responseText);
        if(responseJSON.meta) {
          alert("Response received from ZoOm REST API: " + JSON.stringify(responseJSON.meta));
        }
      }
      catch (e) {
        alert("Exception caught while handling response from FaceTec API: " + e);
      }

      // Allow actions again.
      lastAction = SampleAppState.Idle;
    }
  };
  xhr.send(dataToUpload);
}

// Check if user is enrolled on the server already.
function deleteUserEnrollment() {
  if($("#username").val() == "") {
    alert("You must enter a Username to attempt to delete.");
    return;
  }

  // Don't allow actions when actions are in progress.
  if(lastAction != SampleAppState.Idle) {
    return;
  }

  lastAction = SampleAppState.DeletingEnrollment;

  // Vanilla xhr request to delete user
  // Note: this does not check if users exists already.
  var dataToUpload = new FormData();
  var xhr = new XMLHttpRequest();
  dataToUpload.append("enrollmentIdentifier", $("#username").val());
  xhr.open("DELETE", zoomRestEndpointBaseURL + "/enrollment/" + $("#username").val());
  xhr.setRequestHeader("X-App-Token", licenseKey);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if(this.responseText == "") {
        alert("responseText was empty.  This could indicate a network connectivity issue.");
      }
      try {
        var responseJSON = JSON.parse(this.responseText);
        if(responseJSON.meta) {
          alert("Response received from ZoOm REST API: " + JSON.stringify(responseJSON.meta));
        }
      }
      catch (e) {
        alert("Exception caught while handling response from FaceTec API: " + e);
      }

      // Allow actions again.
      lastAction = SampleAppState.Idle;
    }
  };
  xhr.send(dataToUpload);
}


function fadeInMainUI() {
  document.getElementById("loading-spinner").style.display = "none";
  $("#developer-overlay-semi-transparent-cover").fadeIn(300, function () {
    $(".controls").fadeIn(300, function() {
      lastAction = SampleAppState.Idle;
    });

    if($("#toggle-link").html() === "Show Liveness Menu") {
      $("#liveness-button").css("display", "none");
    }
    $(".background-fade").fadeOut(300);
  });
}

function showNewUserGuidance() {
  $(".controls").hide(300);

  if(!ZoomSDK.getBrowserSupport().isMobileDevice) {
    $("#webcam-position-guide").fadeIn(300);
  }
  else {
    showNewUserGuidancePage2();
  }
}

function showNewUserGuidancePage2() {
  $("#webcam-position-guide").fadeOut(300);
  $("#camera-angle-guide").fadeIn();
}

function showNewUserGuidancePage3() {
  if(!ZoomSDK.getBrowserSupport().isMobileDevice) {
    $("#webcam-position-guide").fadeOut(300);
  }
  else {
    $("#camera-angle-guide").fadeOut(300);
  }
  $("#lighting-guide").fadeIn(300);
}

function showUnsuccessGuide() {
  // If no audit images, only show ideal samples, else we will show examples from user session.
  if(lastAuditTrail.length == 0) {
    $(".retry-images-left").css("display", "none");
  }
  else {
    $(".retry-images-left").css("display", "inline-block");
  }

  // Add the audit trail images to the page.
  if(lastAuditTrail.length > 0) {
    $("#unsuccess-retry-guide .retry-images .retry-images-left").children()[0].src = lastAuditTrail[0];
  }
  if(lastAuditTrail.length > 1) {
    $("#unsuccess-retry-guide .retry-images .retry-images-left").children()[1].src = lastAuditTrail[lastAuditTrail.length-1];
  }

  $("#unsuccess-retry-guide").fadeIn();
}

function hideDeveloperOverlays() {
  $("#camera-angle-guide").hide();
  $("#lighting-guide").hide();
  $("#webcam-position-guide").hide();
  $("#unsuccess-retry-guide").hide();
  $("#cancelled-too-much-time-finding-phase-two-face-guide").hide();
  $("#cancelled-too-much-time-finding-phase-one-face-guide").hide();
}

function cancelFromOverlay()  {
  appendLog("User cancelled from new user guidance overlay.");
  hideDeveloperOverlays();
  fadeInMainUI();
}

function appendLog(message) {
  console.warn("ZoOm Log - ", message);
}

// Toggles showing the "Liveness Menu" or the "Authentication Menu".
function toggleMenus() {
  if($("#toggle-link").html() === "Show Authentication Menu") {
    $(".authentication-menu-button, input").fadeTo(300, 1);
    $("#liveness-button").css("display", "none");
    $("#toggle-link").html("Show Liveness Menu");
  }
  else {
    $(".authentication-menu-button, input").css("display", "none");
    $("#liveness-button").fadeTo(300, 1);
    $("#toggle-link").html("Show Authentication Menu");
  }
}

// Takes ZoOm Audit Trail base64 and converts to format for FaceTec API.
var convertAuditTrailBase64ToBlobForFaceTecAPI = function (dataURI) {
  var blob;
  if (dataURI) {
    var byteString = atob(dataURI.split(",")[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    blob = new Blob([ab], {
      type: "image/jpeg"
    });
  }
  return blob;
};

function toggleLowLightModeAnimation() {
  if(enableLowLightMode) {
    enableLowLightMode = false;
    // Normal ZoOm background color with white accents.
    $("#image-switch-text").text("Brighten Screen");
    $("body, html").animate({backgroundColor: "rgb(13,165,177)"},1000);
    $(".container-for-developer-overlays-and-zoom").animate({borderColor: "white"}, 1000);
    $(".custom-logo-container p, .custom-logo-container span, .image-switch-container span").animate({color: "white"}, 1000);
    $("#light-off").animate({opacity: 1},750);
    $("#light-on").animate({opacity: 0},500);
    $("#zoom-logo-white").animate({opacity: 1},750);
    $("#zoom-logo-gradient").animate({opacity: 0},500);
  }
  else {
    enableLowLightMode = true;
    // Change background to white with ZoOm colored accents.
    $("#image-switch-text").text("Darken Screen");
    $("body, html").animate({backgroundColor: "white" }, 1000);
    $(".container-for-developer-overlays-and-zoom").animate({borderColor: "rgb(13,165,177)"}, 1000);
    $(".custom-logo-container p, .custom-logo-container span, .image-switch-container span").animate({color: "rgb(13,165,177)"}, 1000);
    $("#light-off").animate({opacity: 0},500);
    $("#light-on").animate({opacity: 1},750);
    $("#zoom-logo-white").animate({opacity: 0},500);
    $("#zoom-logo-gradient").animate({opacity: 1},750);
  }
}

// Update brightness screen icon when window is resized.
window.onresize = function(event) {
  $(".image-switch-container").css("width", $(".container-for-developer-overlays-and-zoom").width());
  $(".image-switch-container").css("right", $(".container-for-developer-overlays-and-zoom").position().left);
};
