
import React from 'react';

import { useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import VideoContainer from './VideoContainer';
import VideoHeader from './VideoHeader';

export default function VideoScreen(props) {
    let { channelId } = useParams();
    const currentChannelId = props.currentChannelId;
    const currentChannelName = props.currentChannelName;
    const onDeleteChannel = props.onDeleteChannel;
    // console.log(`Video current channel Id: ${currentChannelId}`);

    const handleErrors = function () {

    }

    return (
        <div>
            <VideoHeader></VideoHeader>
            <span>
                <h3 className="c-brand-blue-100">Joined Call</h3>
                <h3>{currentChannelName}</h3>
            </span>
            <Container fluid className="pos-relative">
                <Row>
                    <VideoContainer
                        currentChannelId={currentChannelId}
                        onDeleteChannel={onDeleteChannel}
                        isCaller={props.isCaller}
                    ></VideoContainer>
                </Row>
            </Container>
        </div>
    );
}