import React from 'react';
import './Minimal_sample.css';

function Minimal_sample() {
  return (
    <div className="Minimal_sample">
        <div id="zoom-parent-container"  class="display-none">
            <div id="zoom-interface-container"></div>
            <video autoplay playsinline id="zoom-video-element"></video>
        </div>
    <button onclick="initiateZoomSessionCapture()">Liveness Check</button>
    <p id="lastZoomResult"><br />Welcome to the Minimal Sample!<br /><br />Please note, to provide developers with a clear understanding of the ZoOm Browser SDK APIs, this demo DOES NOT implement a production-worthy interface and is coded to demonstrate the "happy path".<br /><br />When you fully understand the code behind this demonstration, you will be ready to check out a more fully-featured, well-styled example (with more code).  Please head on over the <a href="../sample-complete">Complete Sample</a> to check this out!<br /></p>
    <a href="../">Back to Home</a>
    <script src="../../ZoomAuthentication.js/ZoomAuthentication.js"></script>

    </div>
  );
}

export default Minimal_sample;
