
import React from 'react';

import { useHistory } from "react-router-dom";

export default function HangupButton(props) {
    const history = useHistory();

    const hangUpAndNavigate = function (name) {
        props.onHangup().then(
            channel => {
                history.goBack();
            }
        )
    }

    return (

        <div>
            <div className="hangup-btn" id="hangup-btn" onClick={() => hangUpAndNavigate()} disabled={props.disabled}>
            </div>
            <p>{props.cameraOn ? "Hang Up" : "Exit"}</p>
        </div>
    );
}
