
import React from 'react';

export default function CameraButton(props) {
    return (
        <div>
            <div className="camera-btn" id="camera-btn" onClick={() => props.onStartCamera()} disabled={props.disabled}>
            </div>
            <p>Turn on camera</p>
        </div>
    );
}
