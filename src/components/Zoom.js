import React from 'react';
import './Zoom.css';


function Zoom() {
  return (
    <div className="Zoom">
      <div className="wrapping-box-container">
        <div className="container-for-developer-overlays-and-zoom">
          <div id="zoom-parent-container" className="display-none">
            <div id="zoom-interface-container"></div>
            <video autoPlay playsInline id="zoom-video-element"></video>
        </div>
        <div id="developer-overlay-semi-transparent-cover"></div>

        <div id="user-helper-container">

          <div id="webcam-position-guide" className="user-helper">
            <img className="cancel-button-img" onClick="cancelFromOverlay()" src="../../../public/sample-shared-files/images/zoom-letter-x.png"></img>
            <div>
                <div>
                  <h2 id="move-browser-window-title">Center Your Webcam</h2>
                  <img className="fade-in-1s side-by-side-images" src="../sample-shared-files/images/webcam_bad_ok.png"></img>
                  <img className="fade-in-1s side-by-side-images" src="../sample-shared-files/images/webcam_good_ok.png"></img>
                </div>
            </div>
            <button className="fade-in-3s big-button" onClick="showNewUserGuidancePage3()">OK</button>
            <a onClick="initiateZoomSessionCapture()" className="link-skip-to-zoom fade-in-3s">Skip Guidance</a>
          </div>
          
          <div id="camera-angle-guide" className="user-helper">
            <img className="cancel-button-img" onClick="cancelFromOverlay()" src="../sample-shared-files/images/zoom-letter-x.png"></img>
            <div>
              <div>
                <h2>Ensure Camera At Eye Level</h2>
                <img id="zoom-icon-angle-good" className="scaler fade-in-1s" src="../sample-shared-files/images/zoom-face-guy-angle-good-phone.png"></img>
                <img id="zoom-icon-angle-bad" className="fade-in-2s" src="../sample-shared-files/images/zoom-face-guy-angle-bad-phone.png"></img>
              </div>
            </div>
            <button className="fade-in-3s big-button" onClick="showNewUserGuidancePage3()">OK</button>
            <a onClick="initiateZoomSessionCapture()" className="link-skip-to-zoom fade-in-3s">Skip Guidance</a>
          </div>
          
          <div id="lighting-guide" className="user-helper">
            <img className="cancel-button-img" onClick="cancelFromOverlay()" src="../sample-shared-files/images/zoom-letter-x.png"></img>
            <div>
                <div>
                  <h2>Light Your Face Evenly</h2>
                  <img className="scaler fade-in-1s" src="../sample-shared-files/images/zoom-face-guy-lighting-good-web.png"></img>
                  <img className="fade-in-2s" src="../sample-shared-files/images/zoom-face-guy-lighting-side-web.png"></img>
                  <img className="fade-in-3s" src="../sample-shared-files/images/zoom-face-guy-lighting-back-web.png"></img>
                </div>
            </div>
            <button className="fade-in-4s big-button" onClick="initiateZoomSessionCapture()">OK</button>
            <a onClick="initiateZoomSessionCapture()" className="link-skip-to-zoom fade-in-3s">Skip Guidance</a>
          </div>
          
          <div id="unsuccess-retry-guide" className="user-helper">
            <img className="cancel-button-img" onClick="cancelFromOverlay()" src="../sample-shared-files/images/zoom-letter-x.png"></img>
            <div>
                <div>
                  <h2>Let's try that again</h2>
                  <p id="feedback-text">Looks like some difficult environmental conditions.  Please see the images below.</p>
                  <div className="retry-images">
                    <div className="retry-images-left">
                      <img src=""></img>
                      <img src=""></img>
                      <p>Your ZoOm</p>
                    </div>
                    <div className="retry-images-right">
                      <img src="./images/ZoOmGirl1.png"></img>
                      <img src="./images/ZoOmGirl2.png"></img>
                      <p>Ideal ZoOm</p>
                    </div>
                  </div>
                </div>
            </div>
            <button className="fade-in-1s big-button" onClick="showNewUserGuidance()">OK</button>
            <a onClick="initiateZoomSessionCapture()" className="link-skip-to-zoom fade-in-3s">Skip Guidance</a>
          </div>
          <div id="controls" className="controls">
            <div id="auth-menu-container">
              <input type="text" name="username" className="control display-none" id="username" value="" placeholder="Enter Username" />
              <br />
              <button onClick="startEnrollment()" className="big-button display-none authentication-menu-button" id="enroll-input">Enroll</button>
              <button onClick="startAuthentication()" className="big-button display-none authentication-menu-button">Authenticate</button>
              <button onClick="isUserEnrolled()" className="big-button display-none authentication-menu-button">Check Enrollment</button>
              <button onClick="deleteUserEnrollment()" className="big-button display-none authentication-menu-button">Delete Enrollment</button>
            </div>
            <button id="liveness-button" onClick="startLivenessCheck()" className="big-button display-none">Liveness Check</button>
            <br />
            <a href="#" onClick="toggleMenus()" id="toggle-link">Show Authentication Menu</a>
          </div>
        </div>
        <div id="upload-progress">
          <progress id="upload-progress-value" value="0" max="100"></progress>
          <div className="upload-progress-message">Uploading<br />Encrypted<br />ZoOm Facemap</div>
        </div>
        <div id="completion-animation-container">
          <div id="completion-animation-bounding-container">
            <div id="completion-animation-success">
              <div>
                
                <svg id="completion-animation-success-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle className="zoom-session-success-checkmark__circle" cx="26" cy="26" r="25" fill="none"></circle>
                  <path className="zoom-session-checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"></path>
                </svg>
                <div className="completion-animation-message">
                  <p id="completion-animation-success-message"></p>
                </div>
              </div>
            </div>
          </div>
          <div id="completion-animation-unsuccess">
            <div>
            
            <svg id="completion-animation-error-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
              <circle className="path circle" fill="none" stroke="#FFFAF0" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1"></circle>
              <line className="path line" fill="none" stroke="#FFFAF0" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3"></line>
              <line className="path line" fill="none" stroke="#FFFAF0" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2"></line>
            </svg>
            <div className="completion-animation-message">
                <p id="completion-animation-unsuccess-message"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className="image-switch-container">
        <span id="image-switch-text" onClick="toggleLowLightModeAnimation()">Brighten Screen</span>
        <div className="image-swap-container">
          <img id="light-off" className="low-light-switch" src="images/light-off.png" onClick="toggleLowLightModeAnimation()"></img>
          <img id="light-on" className="low-light-switch" src="images/light-on.png" onClick="toggleLowLightModeAnimation()"></img>
        </div>
      </div>
  
      <div className="custom-logo-container display-none">
        <div className="image-swap-container">
          <img id="zoom-logo-white" src="../sample-shared-files/images/zoom_logo@2x.png" className="img"></img>
          <img id="zoom-logo-gradient" src="../sample-shared-files/images/zoom_logo_gradient@2x.png" className="img"></img>
        </div>
        <p className="sub-title">LIVENESS</p>
        <div className="email-section">
          <span id="email-details"></span>
          <span className="contact-us-link"><a href="https://dev.zoomlogin.com/zoomsdk/#/support" target="_blank">Contact Us</a></span>
          <span className="sdk-site-link"> | <a href="https://dev.zoomlogin.com/zoomsdk/#/signin" target="_blank">Developers</a></span>
        </div>
      </div>
  
    </div>
    
    <div id="loading-overlay">
        <img id="loading-spinner" src="../sample-shared-files/images/ball-triangle.svg" />
        <p id="status"></p>
    </div>
    
    <div className="background-to-black"></div>
    

    </div>
  );
}

export default Zoom;
