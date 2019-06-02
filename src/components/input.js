import React, { Component } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

const englishRegex = /^[A-Za-z0-9\n\s]*$/;

const Towards = (isEnglish) => (
    <span>
            Language: 
            {
                isEnglish ? 'English => Madarine': 'Madarine => English'
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
        if (this.checkIfEnglish(event.target.value)) {
            this.props.googleTranslate({
                text: event.target.value,
                origin: "english",
                destination: "manderin",
            });
        } else {
            this.props.googleTranslate({
                text: event.target.value,
                origin: "manderin",
                destination: "english",
            });
        }
        this.props.youdaoTranslate({
            text: event.target.value,
        });
        this.props.record({
            text: event.target.value,
        });
    }

    checkIfEnglish(text) {
        return englishRegex.test(text); 
    }

    render() {
        return (
            <div>
                <Form.Control
                    as="textarea"
                    rows="20"
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
