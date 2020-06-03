
import React from 'react';

import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';

export default function JoinChannelButton(props) {
    const history = useHistory();
    const id = props.channel.id;
    const state = props.channel.state;
    const onJoinChannel = props.onJoinChannel;

    const joinChannelAndNavigate = function (id) {
        onJoinChannel(id).then(
            result => {
                console.log(`Join button channel id: ${result.channel.id}`);
                history.push(`video/${result.channel.id}`);
            }
        )
    }

    if (state === 'CHANNEL_DISABLED') {
        return (
            <Button className="btn btn-outline-secondary disabled" onClick={() => joinChannelAndNavigate(id)}>Join Call</Button>
        );
    }
    else if (state === 'CHANNEL_INACTIVE') {
        return <Button className="btn btn-secondary" onClick={() => joinChannelAndNavigate(id)}>Join Call</Button>;
    }
    else {
        return <div className="video-call-btn" onClick={() => joinChannelAndNavigate(id)}></div>;
    }
}