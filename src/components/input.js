import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import autosize from 'autosize';

const chineseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const punctuationRegex = /[ .,:;!?。，：；！？]/

const Towards = ({ isEnglish }) => {
    return (
        <span className="pull-right">
                Language:
                {
                    isEnglish ? 'English => Chinese' : 'Chinese => English'
                }
        </span>
    )
}

export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        // auto resize the textarea to let use see all the input
        autosize(event.target)

        let searchString = event.target.value;
        const isEnglish = this.checkIfEnglish(searchString);

        this.setState({value: searchString});

        if (this.state.value && searchString.trim() === this.state.value.trim()) {
            // if just spaces added in the beginning or end, we don't request it any more
            return
        }

        searchString = searchString.trim()
        const isSentence = this.checkIfSentence(searchString);
        const inputData = {
            text: searchString,
            isEnglish: isEnglish,
            isSentence: isSentence,
            origin: isEnglish ? "english" : "mandarin",
            destination: isEnglish ? "mandarin" : "english",
        };

        if (isEnglish && searchString.length > 2 && !isSentence) {
            this.props.oxfordTranslate(inputData);
        }

        this.props.googleTranslate(inputData);
        this.props.baiduTranslate(inputData);
        this.props.bingTranslate(inputData);
        this.props.youdaoTranslate(inputData);
        this.props.record(inputData);
    }


    checkIfEnglish(text) {
        return !chineseRegex.test(text);
    }

    checkIfSentence(text) {
        return punctuationRegex.test(text);
    }

    removeSpecialCharacters(text) {
        // remove all the special characters in input
        return text.replace(/[^a-zA-Z0-9\n\s]/g, " ")
    }

    render() {
        return (
            <div>
                <Form.Control
                    as="textarea"
                    placeholder="Please write what you want to translate."
                    value={this.state.value || ""}
                    onChange={this.handleChange}
                    autoComplete="false"
                    autoFocus
                    minLength="2"
                    rows="1"
                    id="input-search-bar"
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
