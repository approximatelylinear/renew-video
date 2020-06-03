import React from 'react';
import adapter from 'webrtc-adapter';


import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import * as firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";

import Header from './Header';
import JoinChannelCard from './JoinChannelCard';
import CreateChannelCard from './CreateChannelCard';
import VideoScreen from './VideoScreen';
import FirebaseSignallingChannel from './FirebaseSignallingChannel';


function WelcomeScreen(props) {
  const channels = props.channels;
  const onJoinChannel = props.onJoinChannel;
  const onCreateChannel = props.onCreateChannel;
  const onDeleteChannel = props.onDeleteChannel;
  console.log('onDeleteChannel', onDeleteChannel);

  return (
    <div>
      <Header></Header>
      <div>
        <Row>
          <Col>
            <CreateChannelCard onCreateChannel={onCreateChannel} />
          </Col>
        </Row>
        <Row>
          <Col>
            <JoinChannelCard channels={channels} onJoinChannel={onJoinChannel} onDeleteChannel={onDeleteChannel} />
          </Col>
        </Row>
      </div>
    </div>
  );
}


function FollowUpScreen() {
  return (
    <h1>Follow-up Screen</h1>
  );
}


function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Welcome Screen</Link>
        </li>
        <li>
          <Link to="/video">Video Screen</Link>
        </li>
        <li>
          <Link to="/follow-up">Follow-up Screen</Link>
        </li>
      </ul>
    </nav>
  );
}

function RouteSwitcher(props) {
  const channels = props.channels;
  const currentChannelId = props.currentChannelId;
  const currentChannelName = props.currentChannelName;
  const onJoinChannel = props.onJoinChannel;
  const onCreateChannel = props.onCreateChannel;
  const onDeleteChannel = props.onDeleteChannel;
  return (
    <Switch>
      <Route path="/follow-up">
        <FollowUpScreen />
      </Route>
      <Route path="/video/:channelId">
        <VideoScreen
          currentChannelId={currentChannelId}
          currentChannelName={currentChannelName}
          onDeleteChannel={onDeleteChannel}
          isCaller={props.isCaller}
        />
      </Route>
      <Route path="/video">
        <VideoScreen
          currentChannelId={currentChannelId}
          onDeleteChannel={onDeleteChannel}
          isCaller={props.isCaller}
        />
      </Route>
      <Route path="/">
        <WelcomeScreen
          channels={channels}
          onJoinChannel={onJoinChannel}
          onCreateChannel={onCreateChannel}
          onDeleteChannel={onDeleteChannel}
        />
      </Route>
    </Switch >
  );
}


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.channel = null;
    this.createChannel = this.createChannel.bind(this);
    this.joinChannel = this.joinChannel.bind(this);
    this.deleteChannel = this.deleteChannel.bind(this);
    this.handleNewChannels = this.handleNewChannels.bind(this);
    this.state = {
      channels: []
    };
  }

  async componentDidMount() {
    this.signallingChannel = new FirebaseSignallingChannel();
    let channels = await this.signallingChannel.getChannels();
    channels = channels.map(c => ({ id: c.id, name: c.data.name, status: c.data.status || 'CHANNEL_INACTIVE' }));
    // Listen for room updates
    this.signallingChannel.handleNewChannels(this.handleNewChannels);
    this.setState({ channels: channels });
  }

  handleNewChannels(channels) {
    channels = channels.map(c => ({ id: c.id, name: c.data.name, status: c.data.status || 'CHANNEL_INACTIVE' }));
    this.setState({ channels: channels });
  }

  async createChannel(name) {
    const channelRef = await this.signallingChannel.createChannel(name);
    const channel = {
      id: channelRef.id,
      name: channelRef.name,
      state: channelRef.state
    };
    // console.log('Created channel', channel);
    // TODO: This function is clearly trying to do two things by settings state and returning a value. Refactor this...
    this.setState((state) => {
      return {
        channels: state.channels.concat([channel]),
        // Do I need this here?
        currentChannelId: channel.id,
        currentChannelName: name,
        isCaller: true,
      };
    });
    return {
      channel: channel,
    };
  }

  async joinChannel(id) {
    // console.log(`Joined channel ${id}!`);
    // Call receiveCall here?
    // TODO: refactor this signallingChannel method into getChannel
    const channelRef = await this.signallingChannel.createChannelRef(id);
    const channelObj = await channelRef.get();
    const channelData = channelObj.data();
    // console.log('joinChannel channel', channelData);
    const channel = {
      id: channelRef.id,
      name: channelData.name,
      state: channelData.state,
    };
    console.log('joinChannel channel', channel);
    // TODO: This function is clearly trying to do two things by settings state and returning a value. Refactor this...
    this.setState({
      currentChannelId: id,
      currentChannelName: channel.name,
      isCaller: false, });
    return {
      channel: channel,
    };
  }

  async deleteChannel(id) {
    await this.signallingChannel.deleteChannel(id);
  }

  render() {
    // console.log('App state at render: ', this.state);
    return (
      <Router>
        <Container>
          <Row>
            <Col>
              {/* <Nav /> */}
              <RouteSwitcher
                channels={this.state.channels}
                currentChannelId={this.state.currentChannelId}
                currentChannelName={this.state.currentChannelName}
                onJoinChannel={this.joinChannel}
                onCreateChannel={this.createChannel}
                onDeleteChannel={this.deleteChannel}
                isCaller={this.state.isCaller}
              />
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}
