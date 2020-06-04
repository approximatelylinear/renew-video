
import React from 'react';

export default class VideoWithStream extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        const props = this.props;
        let startTime = window.performance.now();
        this.updateVideoStream();
        this.videoRef.current.addEventListener('loadedmetadata', function() {
            console.log(`${props.kind} video videoWidth: ${this.videoWidth}px, videoHeight: ${this.videoHeight}px`);
        });
        if (this.props.kind === 'remote') {
            this.videoRef.current.addEventListener('resize', function() {
                console.log(`${props.kind} video size changed to ${this.videoWidth}x${this.videoHeight}`);
                if (startTime) {
                    const elapsedTime = window.performance.now() - startTime;
                    console.log('Setup time: ' + elapsedTime.toFixed(3) + 'ms');
                    startTime = null;
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.stream !== prevProps.stream) {
            console.log(`Updated ${this.props.kind} video element with stream`, this.props.stream);
            this.updateVideoStream();
        }
    }

    render() {
        if (this.videoRef.current && this.videoRef.current.srcObject) {
            this.videoRef.current.srcObject.getTracks().forEach(track => console.log(track));
        }
        if (this.props.kind === 'local') {
            // Muted video
            return <video ref={this.videoRef} muted autoPlay playsInline className={this.props.className} id={this.props.id} ></video>;
        }
        else {
            return <video ref={this.videoRef} autoPlay playsInline className={this.props.className} id={this.props.id} ></video>;
        }
    }

    updateVideoStream() {
        const stream = this.props.stream;
        if (this.videoRef.current.srcObject !== stream) {
            this.videoRef.current.srcObject = stream;
        }
    }
}