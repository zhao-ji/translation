import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

const englishRegex = /^[A-Za-z0-9\n\s]*$/;

const Towards = (isEnglish) => (
    <span>
            Language:
            {
                isEnglish ? 'English => Mandarin': 'Mandarin => English'
            }
    </span>
)

export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});

        let inputData = {
            text: event.target.value,
            origin: "mandarin",
            destination: "english",
        };
        if (this.checkIfEnglish(event.target.value)) {
            inputData.origin = "english"
            inputData.destination = "mandarin"
        }
        this.props.googleTranslate(inputData);
        this.props.baiduTranslate(inputData);
        this.props.bingTranslate(inputData);
        this.props.youdaoTranslate({ text: event.target.value });
        this.props.record({ text: event.target.value });
    }

    checkIfEnglish(text) {
        return englishRegex.test(text);
    }

    render() {
        return (
            <div>
                <Form.Control
                    as="textarea"
                    rows="6"
                    placeholder="Please write what you want to translate."
                    value={this.state.value || ""}
                    onChange={this.handleChange}
                    autoComplete="false" autoFocus
                    minLength="2"
                />
                {
                    this.state.value &&
                    <Container fluid={true}>
                        <Row>
                            <Col sm={6} lg={6}>
                                <span>Length: {this.state.value ? this.state.value.length : 0}/5000</span>
                            </Col>
                            <Col sm={6} lg={6}>
                                <Towards isEnglish={this.checkIfEnglish(this.state.value)} />
                            </Col>
                        </Row>
                    </Container>
                }
            </div>
        );
    }
}
