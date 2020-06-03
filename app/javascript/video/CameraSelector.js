
import React from 'react';
import VideoWithStream from './VideoWithStream';

export class CameraSelector extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.openCamera = this.openCamera.bind(this);
        this.closeCamera = this.closeCamera.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.makeCall = this.makeCall.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleReceiveCall = this.handleReceiveCall.bind(this);
        this.state = {
            cameras: [],
            cameraId: null,
            cameraLabel: null,
            camera: null,
            stream: null,
            videoTracks: null,
            muted: false,
        };
    }

    async componentDidMount() {
        const cameras = await this.getCameras();
        this.setState({ cameras: cameras, camera: cameras[0], cameraId: cameras[0].deviceId, cameraLabel: cameras[0].label });
        navigator.mediaDevices.addEventListener('devicechange', async e => {
            const cameras = await this.getCameras();
            this.setState({ cameras: cameras });
        });
    }

    handleChange(e) {
        const cameraId = e.target.value;
        this.setState({ cameraId: cameraId });
        this.openCamera(cameraId);
    }

    handleInputChange(e) {
        console.log('handle input change', e.target.value);
        this.setState({ channelId: e.target.value });
    }

    handleReceiveCall(e) {
        this.receiveCall(this.state.channelId);
    }

    async openCamera(cameraId) {
        const constraints = {
            'audio': true,
            'video': true
        };
        cameraId = cameraId || this.state.cameraId;
        if (cameraId) {
            constraints['video'] = { deviceId: cameraId };
        }
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.onended = function () {
            console.log('Stream ended');
        };
        this.setState({ stream: stream });
        const remoteStream = new MediaStream();
        this.setState({ remoteStream: remoteStream });
    }

    closeCamera() {
        this.setState({ stream: null });
    }

    async getCameras() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(d => d.kind === 'videoinput');
    }

    toggleMute() {
        if (this.state.stream) {
            // TODO: The audio track isn't showing up here...
            const videoTracks = this.state.stream.getVideoTracks();
            console.log(videoTracks);
            // this.state.videoTracks.filter( t => t.kind === 'audio').forEach( t => t.enabled = !t.enabled );
            this.setState({ muted: this.state.stream.muted });
        }
    }

    async makeCall() {
        const signallingChannel = new FirebaseSignallingChannel();
        const localStream = this.state.stream;
        const remoteStream = this.state.remoteStream;
        const channelRef = await signallingChannel.createChannelRef();
        console.log(channelRef);
        const videoService = new VideoService(signallingChannel, localStream, remoteStream);
        videoService.makeCall();
    }

    async receiveCall(channelId) {
        const signallingChannel = new FirebaseSignallingChannel(channelId);
        const localStream = this.state.stream;
        const remoteStream = this.state.remoteStream;
        console.log('receiveCall localstream', localStream);
        console.log('receiveCall remotestream', remoteStream);
        const channelRef = await signallingChannel.createChannelRef();
        console.log(channelRef);
        const videoService = new VideoService(signallingChannel, localStream, remoteStream);
        videoService.receiveCall();
    }

    render() {
        const cameras = this.state.cameras;
        console.log('render state', this.state);
        const muteButton = (
            <button onClick={this.toggleMute}>
                {this.state.muted ? "Unmute Camera" : "Mute Camera"}
            </button>
        );
        if (cameras.length === 0) {
            return <p>Loading cameras...</p>;
        }
        else {
            return (
                <div>
                    <h2>Change camera</h2>
                    <select onChange={this.handleChange}>
                        {
                            cameras.map(c => (
                                <option key={c.deviceId} label={c.label} value={c.deviceId} >
                                </option>
                            ))
                        }
                    </select>
                    <p>Selected camera: {this.state.cameraLabel} | {this.state.cameraId} </p>
                    <button onClick={this.openCamera}>
                        Turn on camera
            </button>
                    <button onClick={this.closeCamera}>
                        Turn off camera
            </button>
                    <button onClick={this.makeCall}>Make call</button>
                    {muteButton}
                    <input type="text" onChange={this.handleInputChange} placeholder="input channel id"></input>
                    <button onClick={this.handleReceiveCall}>Receive call</button>
                    <VideoWithStream stream={this.state.stream} name='local'></VideoWithStream>
                    <VideoWithStream stream={this.state.remoteStream} name='remote'></VideoWithStream>
                </div>);
        }
    }
}

