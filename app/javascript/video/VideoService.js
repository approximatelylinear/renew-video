
export default class VideoService {
    constructor(signallingChannel, localStream, remoteStream) {
      this.configuration = {
        iceServers: [
          {
            urls: [
              'stun:stun1.l.google.com:19302',
              'stun:stun2.l.google.com:19302',
            ],
          },
        ],
        iceCandidatePoolSize: 10,
      };
      this.signallingChannel = signallingChannel;
      this.localStream = localStream;
      this.remoteStream = remoteStream;
      this.peerConnection = null;
    }
  
    async makeCall() {
      const configuration = this.configuration;
      const signallingChannel = this.signallingChannel;
      const localStream = this.localStream;
      const remoteStream = this.remoteStream;
      const channelRef = this.signallingChannel.channelRef;
  
      const peerConnection = new RTCPeerConnection(configuration);
      this.peerConnection = peerConnection;
      this.registerPeerConnectionListeners(peerConnection);
  
      peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          const json = event.candidate.toJSON();
          signallingChannel.addCallerIceCandidate(channelRef, json);
        }
      });
      signallingChannel.listenForCalleeIceCandidates(channelRef, peerConnection);
  
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
  
      const offer = await peerConnection.createOffer();
      console.log('makeCall offer', offer);
      await peerConnection.setLocalDescription(offer);
      await signallingChannel.sendOffer(channelRef, offer);
  
      peerConnection.addEventListener('track', event => {
        // console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          // console.log('Add a track to the remoteStream:', track);
          remoteStream.addTrack(track);
          // console.log('Actual tracks...');
          remoteStream.getTracks().forEach(track => console.log(track));        
        });
      });
      signallingChannel.listenForAnswer(channelRef, peerConnection);
    }
  
    async receiveCall() {
      const configuration = this.configuration;
      const signallingChannel = this.signallingChannel;
      const localStream = this.localStream;
      const remoteStream = this.remoteStream;
      const channelRef = this.signallingChannel.channelRef;
  
      console.log('Receiving call from:', this.signallingChannel.channelId);
  
      const peerConnection = new RTCPeerConnection(configuration);
      this.registerPeerConnectionListeners(peerConnection);
  
      // Collect and exchange ice candidates
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          console.log("received ice candidate", event.candidate);
          signallingChannel.addCalleeIceCandidate(channelRef, event.candidate.toJSON());
        } else {
          // All ICE candidates have been sent
        }
      };
      signallingChannel.listenForCallerIceCandidates(channelRef, peerConnection);
  
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
  
      peerConnection.addEventListener('track', event => {
        // console.log('Got remote track:', event.streams[0]);
        event.streams[0].getTracks().forEach(track => {
          // console.log('Add a track to the remoteStream:', track);
          remoteStream.addTrack(track);
          // console.log('Actual tracks...');
          remoteStream.getTracks().forEach(track => console.log(track));
        });
      });
  
      const offer = await signallingChannel.receiveOffer(channelRef);
      console.log('receiveCall offer', offer);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      console.log('receiveCall answer', answer);
      await peerConnection.setLocalDescription(answer);
      await signallingChannel.sendAnswer(channelRef, answer);
    }

    async hangUp() {
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
        }
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
        }
        if (this.peerConnection) {
            this.peerConnection.close();
        }
    }
  
    registerPeerConnectionListeners(peerConnection) {
      peerConnection.addEventListener('icegatheringstatechange', () => {
        console.log(
          `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
      });
  
      peerConnection.addEventListener('connectionstatechange', () => {
        console.log(`Connection state change: ${peerConnection.connectionState}`);
      });
  
      peerConnection.addEventListener('signalingstatechange', () => {
        console.log(`Signaling state change: ${peerConnection.signalingState}`);
      });
  
      peerConnection.addEventListener('iceconnectionstatechange ', () => {
        console.log(
          `ICE connection state change: ${peerConnection.iceConnectionState}`);
      });
  
      peerConnection.addEventListener('connectionstatechange', event => {
        if (peerConnection.connectionState === 'connected') {
          console.log("Peers connected!");
        }
      });
    }
  }
