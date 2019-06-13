import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import autosize from 'autosize';

const chineseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const punctuationRegex = /[ .,:;!?。，：；！？]/

export const Towards = ({ isMandarin }) => {
    return (
        <span className="pull-right">
            Language: { isMandarin ? 'Chinese => English' : 'English => Chinese' }
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
        this.setState({value: searchString});

        if (this.state.value && searchString.trim() === this.state.value.trim()) {
            // if just spaces added in the beginning or end, we don't request it any more
            return
        }

        searchString = searchString.trim()
        const inputData = {
            text: searchString,
            isEnglish: !this.checkIfMandarin(searchString),
            isSentence: this.checkIfSentence(searchString),
        };

        this.props.googleTranslate(inputData);
        this.props.baiduTranslate(inputData);
        this.props.bingTranslate(inputData);
        this.props.youdaoTranslate(inputData);
        this.props.record(inputData);
        this.props.oxfordTranslate(inputData);
        this.props.oxfordFetchExamples(inputData);
    }


    checkIfMandarin(text) {
        if (typeof text !== "string") {
            return false
        }
        return chineseRegex.test(text);
    }

    checkIfSentence(text) {
        if (typeof text !== "string") {
            return false
        }
        return punctuationRegex.test(text);
    }

    render() {
        return (
            <>
                <Form.Control
                    as="textarea"
                    placeholder="Please input here..."
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
                                <Towards isMandarin={this.checkIfMandarin(this.state.value)} />
                            </Col>
                        </Row>
                    </Container>
                }
            </>
        );
    }
}
