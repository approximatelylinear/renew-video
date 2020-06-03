
import React from 'react';


export class Video extends React.Component {
    constructor(props) {
        super(props)
        this.videoRef = React.createRef();
        this.state = {
            stream: props.stream
        }
    }

    render() {
        return <video ref={this.videoRef} className={this.props.className} id={this.props.id} muted autoPlay playsInline />
    }

    componentDidMount() {
        this.updateVideoStream()
    }

    componentWillUnmount() {
        // Do I need both?
        this.state.stream.getTracks().forEach(track => track.stop());
        this.videoRef.current.srcObject.getTracks().forEach(track => {
            track.stop();
        });
    }

    updateVideoStream() {
        if (this.videoRef.current.srcObject !== this.state.stream) {
            this.videoRef.current.srcObject = this.state.stream
        }
    }
}



function Errors(props) {

}



