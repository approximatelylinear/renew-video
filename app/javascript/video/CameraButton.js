
import React from 'react';
import Button from 'react-bootstrap/Button';

export default function CameraButton(props) {
    return (
        <div>
            <div className="camera-btn" id="camera-btn" onClick={() => props.onStartCamera()} disabled={props.disabled}>
            </div>
            <p>Turn on camera</p>
        </div>
    );
}
