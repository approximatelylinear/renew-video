import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

export default class FirebaseSignallingChannel {
  constructor(channelId) {
    this.channelId = channelId;
    this.db = firebase.firestore();
    this.channelRef = null;
  }

  async getChannels() {
    let channels = await this.db.collection('rooms').get();
    return channels.docs.map(doc => ({ id: doc.id, data: doc.data() }));
  }

  async deleteChannel(channelId) {
    const channelRef = this.db.collection('rooms').doc(channelId);
    const calleeCandidates = await channelRef.collection('calleeCandidates').get();
    calleeCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    const callerCandidates = await channelRef.collection('callerCandidates').get();
    callerCandidates.forEach(async candidate => {
      await candidate.ref.delete();
    });
    await channelRef.delete();
  }

  handleNewChannels(callback) {
    this.db.collection("rooms").onSnapshot(querySnapshot => {
      let channels = [];
      querySnapshot.forEach(function (doc) {
        channels.push({ id: doc.id, data: doc.data() });
      });
      if (callback !== undefined) {
        callback(channels);
      }
    });
  }

  // Create a channel with a specified name
  async createChannel(name) {
    const channelRef = await this.db.collection('rooms').doc();
    channelRef.set({
        name: name,
        state: 'CHANNEL_ACTIVE',
      });
    return channelRef;
  }

  async createChannelRef(channelId) {
    channelId = channelId || this.channelId
    if (channelId !== undefined && channelId) {
      const channelRef = await this.db.collection('rooms').doc(channelId);
      this.channelRef = channelRef;
      return channelRef;
    }
    else {
      const channelRef = await this.db.collection('rooms').doc();
      this.channelId = channelRef.id;
      this.channelRef = channelRef;
      console.log('channel id set to ', this.channelId);
      return channelRef;
    }
  }

  async addIceCandidate(channelRef, collectionName, candidate) {
    const candidatesCollection = channelRef.collection(collectionName);
    candidatesCollection.add(candidate);
  }

  async addCallerIceCandidate(channelRef, candidate) {
    return this.addIceCandidate(channelRef, 'callerCandidates', candidate);
  }

  async addCalleeIceCandidate(channelRef, candidate) {
    return this.addIceCandidate(channelRef, 'calleeCandidates', candidate);
  }

  listenForIceCandidates(channelRef, collectionName, peerConnection) {
    channelRef.collection(collectionName).onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === "added") {
          let data = change.doc.data();
          console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
          await peerConnection.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  }

  listenForCallerIceCandidates(channelRef, peerConnection) {
    return this.listenForIceCandidates(channelRef, 'callerCandidates', peerConnection);
  }

  listenForCalleeIceCandidates(channelRef, peerConnection) {
    return this.listenForIceCandidates(channelRef, 'calleeCandidates', peerConnection);
  }

  async sendOffer(channelRef, offer) {
    const channelWithOffer = {
      offer: {
        type: offer.type,
        sdp: offer.sdp,
      },
    };
    await channelRef.set(channelWithOffer);
  }

  async receiveOffer(channelRef) {
    const channelSnapshot = await channelRef.get();
    if (channelSnapshot.exists) {
      return channelSnapshot.data().offer;
    }
  }

  async sendAnswer(channelRef, answer) {
    const channelWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await channelRef.update(channelWithAnswer);
  }

  listenForAnswer(channelRef, peerConnection) {
    console.log('Listening for answers to the offer...')
    channelRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data && data.answer) {
        console.log('Got remote description: ', data.answer);
        const rtcSessionDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(rtcSessionDescription);
      }
    });
  }

}