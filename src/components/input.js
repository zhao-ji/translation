import React, { Component, Fragment } from 'react';
import { Button, InputGroup, Form, ListGroup } from 'react-bootstrap';

import { checkIfMandarin, checkIfSentence } from '../utils';

export function Suggestions({ cache, currentText, matchedOption, onClickSuggestion }) {
    if (matchedOption === currentText) return false;
    if (matchedOption && currentText && (matchedOption.trim() === currentText.trim())) return false;

    const items = cache[currentText];
    if (!items || !items.result || items.result.length === 0) return false;

    return (
        <ListGroup>
            {items.result.map((item, index) => (
                <ListGroup.Item
                    key={index}
                    data-value={item}
                    onClick={onClickSuggestion}
                    className="option" action>
                    {currentText}<b>{item.slice(currentText.length)}</b>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

export default class Input extends Component {
    state = {
        matchedOption: "",
        onFocus: false,
    }

    onClickSuggestion = (event) => {
        this.props.setCurrentText({ text: event.currentTarget.dataset.value });
        this.setState({
            matchedOption: event.currentTarget.dataset.value
        });
    }

    handleChange = (event) => {
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
        } else if (searchString === this.props.currentText) {
            // user add spaces in the end or begening of sentence
            // the input does change, but we don't need to trigger a HTTP request
            // we do nothing
        } else if (inputData.isEnglish && searchString.length <= 20) {
            // input is english and not a sentence
            // there is high possibility to be a single word
            // we throttle the HTTP request(more often than debounce)
            if (!(searchString in this.props.cache)) {
                this.props.fetchSuggestion({text: searchString});
            }
        }
    }

    handleClick = () => {
        this.setState({ matchedOption: this.props.currentText });
        const inputData = {
            text: this.props.currentText.trim(),
            isEnglish: !checkIfMandarin(this.props.currentText.trim()),
            isSentence: checkIfSentence(this.props.currentText.trim()),
        };
        this.props.googleTranslate(inputData);
        this.props.deeplTranslate(inputData);
        this.props.baiduTranslate(inputData);
        this.props.youdaoTranslate(inputData);
        this.props.bingTranslate(inputData);
        this.props.amazonTranslate(inputData);
        this.props.caiyunTranslate(inputData);
        if (inputData.isEnglish) {
            this.props.urbanTranslate(inputData);
            this.props.oxfordTranslate(inputData);
            this.props.oxfordFetchExamples(inputData);
            if (!inputData.isSentence) {
                this.props.websterTranslate(inputData);
            }
        } else {
            this.props.cleanEnEnResult();
        }
        this.props.record(inputData);
    }

    handleKeyDown = (event) => {
        if(event.key === "Enter") this.handleClick();
    }

    onFocus = (event) => {
        // only let user select all text in the first time
        if (!this.state.onFocus) {
            event.target.select();
            // Below line is for iOS mobile device
            event.target.setSelectionRange(0, 9999);
            this.setState({ onFocus: true });
        }
    }

    onBlur = (event) => {
        this.setState({ onFocus: false });
    }

    onMouseUP = (event) => {
        // first time user focus on input,
        // we prevent default on mouse up to give user a chance to auto select all
        // second time user click the input
        // we think user want to edit it
        // so this is time to let event happen
        if (!this.state.onFocus) event.preventDefault();
    }

    render() {
        return (
            <Fragment>
                <InputGroup size="lg" className="mt-2">
                    <Form.Control
                        as="input"
                        type="search"
                        autoComplete="off"
                        autoFocus
                        id="input-search-bar"
                        placeholder="translate word or sentence for english and mandarin..."
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown}
                        onMouseUp={this.onMouseUp}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
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
            </Fragment>
        );
    }
}
