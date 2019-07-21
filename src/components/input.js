import React, { Component } from 'react';

import { Button, InputGroup, Form, ListGroup } from 'react-bootstrap';
import { throttle } from 'throttle-debounce';

import { checkIfMandarin, checkIfSentence } from '../utils';

class Suggestions extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (this.props.matchedOption === this.props.currentText) {
            return (<></>);
        }

        const items = this.props.cache[this.props.currentText];
        if (!items || !items.result || items.result.length === 0) {
            return (<></>);
        }

        return (
            <ListGroup>
                {items.result.map((item, index) => (
                    <ListGroup.Item
                        key={index}
                        data-value={item}
                        onClick={this.props.onClickSuggestion}
                        className="option"
                        action>
                        {this.props.currentText}<b>{item.slice(this.props.currentText.length)}</b>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    }
}

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            matchedOption: "",
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.onClickSuggestion = this.onClickSuggestion.bind(this);
    }

    onClickSuggestion(event) {
        this.props.setCurrentText({ text: event.currentTarget.dataset.value });
        this.setState({
            matchedOption: event.currentTarget.dataset.value
        });
    }

    handleChange(event) {
        let searchString = event.target.value;
        const inputData = {
            isEnglish: !checkIfMandarin(searchString),
            isSentence: checkIfSentence(searchString),
        };

        this.props.setCurrentText({ text: searchString });

        if (!searchString || !searchString.trim()) {
            // input is empty string or only contains spaces
            // it means user clean the input
            // so we need to clean the cache and update the current input state
            this.props.cleanCache()
            this.setState((prevState, props) => {
                prevState.tasks.map(task => task.cancel());
                return {tasks: []};
            })
        } else if (searchString === this.props.currentText) {
            // user add spaces in the end or begening of sentence
            // the input does change, but we don't need to trigger a HTTP request
            // we do nothing
        } else if (inputData.isEnglish && searchString.length <= 20) {
            // input is english and not a sentence
            // there is high possibility to be a single word
            // we throttle the HTTP request(more often than debounce)
            if (!(searchString in this.props.cache)) {
                const throttleObj = throttle(200, this.props.fetchSuggestion);
                this.setState((prevState, props) => {
                    prevState.tasks.push(throttleObj);
                    return { tasks: prevState.tasks };
                });
                throttleObj({text: searchString});
            }
        } else {
            // what's wrong with our check?
            console.log("something happened!");
            console.log(inputData);
        }
    }

    handleClick() {
        this.setState({ matchedOption: this.props.currentText });
        const inputData = {
            text: this.props.currentText.trim(),
            isEnglish: !checkIfMandarin(this.props.currentText.trim()),
            isSentence: checkIfSentence(this.props.currentText.trim()),
        };
        this.props.googleTranslate(inputData);
        this.props.baiduTranslate(inputData);
        this.props.bingTranslate(inputData);
        this.props.youdaoTranslate(inputData);
        if (inputData.isEnglish && !inputData.isSentence) {
            this.props.oxfordTranslate(inputData);
            this.props.oxfordFetchExamples(inputData);
            this.props.websterTranslate(inputData);
        }
        this.props.record(inputData);
    }

    handleKeyDown(event) {
        if(event.key === "Enter") {
            this.handleClick()
        }
    }

    render() {
        return (
            <>
                <InputGroup size="lg">
                    <Form.Control
                        as="input"
                        type="search"
                        autoComplete="off"
                        autoFocus
                        id="input-search-bar"
                        placeholder="translate word or sentence for english and mandarin..."
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        defaultValue={this.state.matchedOption}
                        key={this.state.matchedOption}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-dark" type="button" onClick={this.handleClick} block>
                            Search
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
                <Suggestions
                    cache={this.props.cache}
                    currentText={this.props.currentText}
                    matchedOption={this.state.matchedOption}
                    onClickSuggestion={this.onClickSuggestion}
                />
            </>
        );
    }
}
