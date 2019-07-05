import React, { Component } from 'react';
import { Form } from 'react-bootstrap';
import autosize from 'autosize';
import { throttle, debounce } from 'throttle-debounce';

import { checkIfMandarin, checkIfSentence } from '../utils';

export default class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
        }

        this.handleChange = this.handleChange.bind(this);
        this.debounceFetch = this.debounceFetch.bind(this);
        this.throttleFetch = this.throttleFetch.bind(this);
    }

    handleChange(event) {
        // auto resize the textarea to let use see all the input
        autosize(event.target)

        let searchString = event.target.value;
        const inputData = {
            text: searchString.trim(),
            isEnglish: !checkIfMandarin(searchString),
            isSentence: checkIfSentence(searchString),
        };
        this.props.setCurrentText({ text: inputData.text })
        this.setState((prevState, props) => {
            prevState.tasks.map(task => task.cancel());
            return {tasks: []};
        })

        if (!searchString || !searchString.trim()) {
            // input is empty string or only contains spaces
            // it means user clean the input
            // so we need to clean the cache and update the current input state
            this.props.cleanCache()
        } else if (searchString.trim() === this.props.currentText) {
            // user add spaces in the end or begening of sentence
            // the input does change, but we don't need to trigger a HTTP request
            // we do nothing
        } else if (inputData.isEnglish && searchString.length < 2) {
            // input is english and less than 2 characters
            // user have not finished the input
            // we don't trigger the search but we update the global state to hide the result
        } else if (inputData.isEnglish && inputData.text.length < 10) {
            // input is english and less than 10 characters
            // there is high possibility to be a single word
            // we throttle the HTTP request(more often than debounce)
            this.throttleFetch(inputData)
        } else if (inputData.isEnglish && inputData.text.length >= 10) {
            // input is english and more than 10 chars
            // this means user want to translate the sentence
            // we debounce the request
            this.debounceFetch(inputData)
        } else if (!inputData.isEnglish && inputData.text.length <= 3) {
            // input is mandarin and less than 3 chars
            // this is mandarin word
            // we throttle the HTTP request and no oxford included
            this.throttleFetch(inputData)
        } else if (!inputData.isEnglish && inputData.text.length > 3) {
            // input is mandarin and more than 3 chars
            // this is mandarin word
            // we debounce the HTTP request and don't include the oxford
            this.debounceFetch(inputData)
        } else {
            // what's wrong with our check?
            console.log("something happened!");
            console.log(inputData);
        }
    }

    cacheOrThrottle(inputData, sourceName, fetchFunc, fetchFromCacheFunc, throttleFunc, throttleTime) {
        if (inputData.text in this.props.cache && sourceName in this.props.cache[inputData.text]) {
            fetchFromCacheFunc({
                text: inputData.text,
                cache: this.props.cache[inputData.text][sourceName]
            });
        } else {
            const throttleObj = throttle(500, fetchFunc);
            this.setState((prevState, props) => {
                prevState.tasks.push(throttleObj);
                return { tasks: prevState.tasks };
            });
            throttleObj(inputData);
        }
    }

    debounceFetch(inputData) {
        const partialFunc = (sourceName, fetchFunc, fetchFromCacheFunc) => {
            this.cacheOrThrottle(inputData, sourceName, fetchFunc, fetchFromCacheFunc, debounce, 1000);
        }
        partialFunc("google", this.props.googleTranslate, this.props.googleTranslateFromCache);
        partialFunc("baidu", this.props.baiduTranslate, this.props.baiduTranslateFromCache);
        partialFunc("bing", this.props.bingTranslate, this.props.bingTranslateFromCache);
        partialFunc("youdao", this.props.youdaoTranslate, this.props.youdaoTranslateFromCache);
        if (inputData.isEnglish && !inputData.isSentence) {
            partialFunc("oxford", this.props.oxfordTranslate, this.props.oxfordTranslateFromCache);
            partialFunc("oxfordExamples", this.props.oxfordFetchExamples, this.props.oxfordFetchExamplesFromCache);
        }
        debounce(1000, this.props.record)(inputData);
    }

    throttleFetch(inputData) {
        const partialFunc = (sourceName, fetchFunc, fetchFromCacheFunc) => {
            this.cacheOrThrottle(inputData, sourceName, fetchFunc, fetchFromCacheFunc, throttle, 500);
        }
        partialFunc("google", this.props.googleTranslate, this.props.googleTranslateFromCache);
        partialFunc("baidu", this.props.baiduTranslate, this.props.baiduTranslateFromCache);
        partialFunc("bing", this.props.bingTranslate, this.props.bingTranslateFromCache);
        partialFunc("youdao", this.props.youdaoTranslate, this.props.youdaoTranslateFromCache);
        if (inputData.isEnglish && !inputData.isSentence) {
            partialFunc("oxford", this.props.oxfordTranslate, this.props.oxfordTranslateFromCache);
            partialFunc("oxfordExamples", this.props.oxfordFetchExamples, this.props.oxfordFetchExamplesFromCache);
        }
        debounce(500, this.props.record)(inputData);
    }

    render() {
        return (
            <Form.Control
                as="textarea"
                placeholder="Please input here..."
                onChange={this.handleChange}
                autoComplete="false"
                autoFocus
                minLength="2"
                rows="1"
                id="input-search-bar"
            />
        );
    }
}
