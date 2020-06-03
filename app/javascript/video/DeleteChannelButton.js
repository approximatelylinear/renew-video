
import React from 'react';

import Button from 'react-bootstrap/Button';

export default function DeleteChannelButton(props) {
    const id = props.channel.id;
    const onDeleteChannel = props.onDeleteChannel;
    return <Button className="btn btn-danger" onClick={() => onDeleteChannel(id)}>Delete Call</Button>;
}