
import React from 'react';

export default class VideoWithStream extends React.Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        this.updateVideoStream();
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