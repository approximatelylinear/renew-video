
import React from 'react';

import Card from 'react-bootstrap/Card';

import ChannelList from './ChannelList';

export default function JoinChannelCard(props) {
    const channels = props.channels;
    const onJoinChannel = props.onJoinChannel;
    const onDeleteChannel = props.onDeleteChannel;
    return (
        <Card className="branded-card margin-bottom-2em">
            <Card.Body>
                <Card.Title className="c-brand-blue-100">Join Call</Card.Title>
                <ChannelList channels={channels} onJoinChannel={onJoinChannel} onDeleteChannel={onDeleteChannel}/>
            </Card.Body>
        </Card>
    );
}
