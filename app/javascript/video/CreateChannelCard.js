
import React from 'react';

import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import CreateChannelButton from './CreateChannelButton';


export default class CreateChannelCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = { name: '' };
    }

    handleChange(e) {
        this.setState({ name: e.target.value });
    }

    render() {
        const name = this.state.name;
        const channel = {
            name: name
        };
        return (
            <Card className="branded-card margin-bottom-2em">
                <Card.Body>
                    <Card.Title className="c-brand-blue-100">Start Call</Card.Title>
                    <Form>
                        <Form.Group controlId="channelName">
                            <Form.Label className="c-brand-black-100">Channel Name</Form.Label>
                            <Form.Row>
                                <Col xs={8} md={8}>
                                    <Form.Control type="text" placeholder="Input channel name" value={name} onChange={this.handleChange} />
                                </Col>
                                <Col>
                                    <CreateChannelButton channel={channel} onCreateChannel={this.props.onCreateChannel} />
                                </Col>
                            </Form.Row>
                            <Form.Row>
                                <Form.Text className="text-muted">
                                    Don't have a name? We'll create one for you.
                          </Form.Text>
                            </Form.Row>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}