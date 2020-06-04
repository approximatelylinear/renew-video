
import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Media from 'react-bootstrap/Media';
import Toast from 'react-bootstrap/Toast';

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
        this.toggleShowToast = this.toggleShowToast.bind(this);
        this.state = {
            currentChannelId: props.currentChannelId,
            cameraOn: false,
            callStarted: false,
            showToast: true,
        };
        console.log('is caller?', props.isCaller);
        this.toastRef = React.createRef();
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
        this.setState({ callStarted: true });
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
        this.setState({ callStarted: true });
        const signallingChannel = new FirebaseSignallingChannel(channelId);
        const channelRef = await signallingChannel.createChannelRef(channelId);
        console.log('receiveCall channelRef', channelRef);
        const videoService = new VideoService(signallingChannel, this.state.localStream, this.state.remoteStream);
        this.setState({ videoService: videoService })
        await videoService.receiveCall();
    }

    toggleShowToast() {
        this.setState({ showToast: !this.state.showToast });
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
        const startCallButton = (
            <div>
                {
                    this.state.callStarted ?
                        <div>
                            <div className="startcall-btn-disabled">
                            </div>
                            <p className="c-brand-light-gray">Call</p>
                        </div>
                        :
                        <div>
                            <div className="startcall-btn" onClick={this.handleMakeCall}>
                            </div>
                            <p>Call</p>
                        </div>
                }
            </div>);
        const answerCallButton = (
            <div>
                {
                    this.state.callStarted ?
                        <div>
                            <div className="answer-btn-disabled">
                            </div>
                            <p className="c-brand-light-gray">Answer</p>
                        </div>
                        :
                        <div>
                            <div className="answer-btn" onClick={this.handleReceiveCall}>
                            </div>
                            <p>Answer</p>
                        </div>
                }
            </div>);
        const cameraOffElems = (
            <div>
                <Row>
                    <Toast show={this.state.showToast} onClose={this.toggleShowToast} ref={this.toastRef}>
                        <Toast.Header>
                            {/* <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" /> */}
                            <strong className="mr-auto">Renew</strong>
                        </Toast.Header>
                        <Toast.Body>Turn on your camera to connect</Toast.Body>
                    </Toast>
                </Row>
                <Row>
                    <Media>
                        <Media.Body>
                            <CameraButton onStartCamera={this.openCamera} disabled={this.state.cameraOn}>
                            </CameraButton>
                            <HangupButton onHangup={this.hangUp}> cameraOn={this.state.cameraOn}</HangupButton>
                        </Media.Body>
                    </Media>
                    {/* <Col>
                        <CameraButton onStartCamera={this.openCamera} disabled={this.state.cameraOn}>
                        </CameraButton>
                    </Col>
                    <Col>
                        <HangupButton onHangup={this.hangUp}> cameraOn={this.state.cameraOn}</HangupButton>
                    </Col> */}
                </Row>
            </div>
        );
        const cameraOnElems = (
            <div>
                <Row>
                    <Media>
                        <div>
                            {/* <VideoWithStream stream={this.state.localStream} kind='local' className="video-sm"></VideoWithStream> */}
                            {/* <VideoWithStream stream={this.state.localStream} kind='local' className="video-sm"></VideoWithStream> */}
                            <VideoWithStream stream={this.state.remoteStream} kind='remote' className="video-lg"></VideoWithStream>
                            <VideoWithStream stream={this.state.localStream} kind='local' className="video-sm"></VideoWithStream>
                            {/* <VideoWithStream stream={this.state.remoteStream} kind='remote' className="margin-sm video-lg bg-black"></VideoWithStream> */}
                            {/* <VideoWithStream stream={this.state.remoteStream} kind='remote' className="margin-sm video-lg bg-black"></VideoWithStream> */}
                        </div>
                        <Media.Body>
                            {this.props.isCaller ? startCallButton : answerCallButton}
                            <HangupButton onHangup={this.hangUp}> cameraOn={this.state.cameraOn}</HangupButton>
                            {/* <Col>
                        <HangupButton onHangup={this.hangUp}> cameraOn={this.state.cameraOn}</HangupButton>
                    </Col> */}
                        </Media.Body>
                    </Media>
                </Row>
            </div>
        );
        return (
            <Container fluid className="pos-relative video-container">
                {
                    this.state.cameraOn ? cameraOnElems : cameraOffElems
                }
            </Container>
        );
    }
}
