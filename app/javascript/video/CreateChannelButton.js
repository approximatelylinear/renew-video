
import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';

export default function CreateChannelButton(props) {
    const history = useHistory();
    const name = props.channel.name || uuidv4();
    const onCreateChannel = props.onCreateChannel;

    const createChannelAndNavigate = function (name) {
        onCreateChannel(name).then(
            result => {
                console.log(`Create channel button channel id: ${result.channel.id}`);
                history.push(`video/${result.channel.id}`);
            }
        )
    }

    return (
      <div id="create-btn" className="video-call-btn" onClick={() => createChannelAndNavigate(name)}></div>
    );
  }
