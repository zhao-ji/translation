import React, { Component, Fragment } from 'react';
import * as Sentry from '@sentry/browser';
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
        } else {
            // what's wrong with our check?
            Sentry.withScope((scope) => {
                scope.setExtras(inputData);
                Sentry.captureMessage("Input inspection error!");
            });
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
        if (inputData.isEnglish && !inputData.isSentence) {
            this.props.urbanTranslate(inputData);
            this.props.oxfordTranslate(inputData);
            this.props.oxfordFetchExamples(inputData);
            this.props.websterTranslate(inputData);
        } else {
            this.props.cleanEnEnResult();
        }
        this.props.record(inputData);
    }

    handleKeyDown = (event) => {
        if(event.key === "Enter") this.handleClick();
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
                        onFocus={event => event.target.select()}
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
