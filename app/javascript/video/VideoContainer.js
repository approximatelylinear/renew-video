
import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import CameraButton from './CameraButton';
import HangupButton from './HangupButton';
import VideoService from './VideoService';
import VideoWithStream from './VideoWithStream';
import FirebaseSignallingChannel from './FirebaseSignallingChannel';


export default class VideoContainer extends React.Component {
    constructor(props) {
        super(props);
        this.onDeleteChannel = props.onDeleteChannel;
        this.openCamera = this.openCamera.bind(this);
        this.hangUp = this.hangUp.bind(this);
        this.makeCall = this.makeCall.bind(this);
        this.handleReceiveCall = this.handleReceiveCall.bind(this);
        this.handleMakeCall = this.handleMakeCall.bind(this);
        this.state = {
            currentChannelId: props.currentChannelId,
            cameraOn: false,
        };
        console.log('is caller?', props.isCaller);
    }

    handleMakeCall(e) {
        this.makeCall(this.state.currentChannelId);
    }

    handleReceiveCall(e) {
        this.receiveCall(this.state.currentChannelId);
    }

    async openCamera(cameraId) {
        const constraints = {
            audio: true,
            video: true
        };
        cameraId = cameraId || this.state.cameraId;
        if (cameraId != undefined && cameraId) {
            constraints.video = { deviceId: cameraId };
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.onended = function () {
            console.log('Stream ended');
        };
        const remoteStream = new MediaStream();
        this.setState({
            localStream: stream,
            remoteStream: remoteStream,
            cameraOn: true
        });
    }

    async hangUp(e) {
        this.setState({
            cameraOn: false
        });
        if (this.state.videoService !== undefined) {
            this.state.videoService.hangUp();
        }
        // console.log('video hangup state: ', this.state);
        await this.onDeleteChannel(this.state.currentChannelId);
    }

    async makeCall(channelId) {
        console.log('makeCall channelId', channelId);
        const signallingChannel = new FirebaseSignallingChannel(channelId);
        const channelRef = await signallingChannel.createChannelRef(channelId);
        console.log(channelRef);
        console.log('makeCall channelref', signallingChannel.channelRef);
        const videoService = new VideoService(signallingChannel, this.state.localStream, this.state.remoteStream);
        this.setState({ videoService: videoService });
        await videoService.makeCall();
    }

    async receiveCall(channelId) {
        console.log('receiveCall channelId', channelId);
        const signallingChannel = new FirebaseSignallingChannel(channelId);
        const channelRef = await signallingChannel.createChannelRef(channelId);
        console.log('receiveCall channelRef', channelRef);
        const videoService = new VideoService(signallingChannel, this.state.localStream, this.state.remoteStream);
        this.setState({ videoService: videoService })
        await videoService.receiveCall();
    }

    render() {
        // console.log('video render state: ', this.state);
        const localStream = this.state.localStream;
        const remoteStream = this.state.remoteStream;
        // const cameraOnElems = (
        //     <Row>
        //         <Video id="remoteVideo" stream={remoteStream} className="margin-sm video-lg bg-black"></Video>
        //         <Video id="localVideo" stream={localStream} className="video-sm pos-fixed"></Video>
        //     </Row>
        // );
        const cameraOffElems = (
            <Row>
                <p className="c-brand-black-100">Please turn the camera on to connect</p>
            </Row>
        );        
        const cameraOnElems = (
            <Row>
                <div>
                    <VideoWithStream stream={this.state.localStream} kind='local' className="video-sm pos-fixed"></VideoWithStream>
                    <VideoWithStream stream={this.state.remoteStream} kind='remote' className="margin-sm video-lg bg-black"></VideoWithStream>               
                </div>
            </Row>
        );
        const defaultCameraControls = (
            <Row>
                <Col>
                    <CameraButton onStartCamera={this.openCamera}>
                    </CameraButton>
                </Col>
                <Col>
                    <HangupButton onHangup={this.hangUp}> cameraOn={this.state.cameraOn}</HangupButton>
                </Col>
            </Row>
        );        
        const startCallButton = (
            <Col>
                <div className="startcall-btn" onClick={this.handleMakeCall}>
                </div>
                <p>Call</p>
            </Col>);
        const answerCallButton = (
            <Col>
                <div className="answer-btn" onClick={this.handleReceiveCall}>
                </div>
                <p>Answer</p>
            </Col>);
        const cameraOnControls = (
            <Row>
                { defaultCameraControls }
                { this.props.isCaller ? startCallButton : answerCallButton }
            </Row>
        )
        return (
            <Container fluid className="pos-relative">
                {
                    this.state.cameraOn ? cameraOnControls : defaultCameraControls
                } 
                {
                    this.state.cameraOn ? cameraOnElems : cameraOffElems
                }
            </Container>
        );
    }
}
