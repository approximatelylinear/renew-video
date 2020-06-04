
import React from 'react';

export default function CameraButton(props) {
    const buttonOn = (
    <div>
        <div className="video-call-btn-disabled" id="camera-btn"></div>
        <p><strong>Camera is on</strong></p>
    </div>);
    const buttonOff = (<div>
        <div className="camera-btn" id="camera-btn" onClick={() => props.onStartCamera()}>
        </div>
        <p>Turn on camera</p>
    </div>);
    console.log('camera disabled?', props.disabled);
    console.log(buttonOn);
    return props.disabled ? buttonOn : buttonOff;
}
