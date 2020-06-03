import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import JoinChannelButton from './JoinChannelButton';
import DeleteChannelButton from './DeleteChannelButton';

export default function ChannelList(props) {
    const loading = props.loading;
    const channels = props.channels;
    const onJoinChannel = props.onJoinChannel;
    const onDeleteChannel = props.onDeleteChannel;

    if (loading) {
        return (
            <Container className="list-items">
                <Row>
                    <Col>Loading...</Col>
                </Row>
            </Container>
        );
    }
    if (channels.length === 0) {
        return (
            <Container className="list-items">
                <Row>
                    <Col className="c-brand-black-100">No one's talking yet...</Col>
                </Row>
            </Container>
        );
    }
    return (
        <Container className="list-items">
            {
                channels.map(
                    (channel) => (
                        <Row key={channel.id} className="margin-bottom-2em">
                            <Col xs={8} md={8}>{channel.name || channel.id}</Col>
                            <Col>
                                <JoinChannelButton channel={channel} onJoinChannel={onJoinChannel}></JoinChannelButton>
                            </Col>
                            {/* <Col>
                                <DeleteChannelButton channel={channel} onDeleteChannel={onDeleteChannel}></DeleteChannelButton>
                            </Col>     */}
                        </Row>
                    )
                )
            }
        </Container>
    );
}

