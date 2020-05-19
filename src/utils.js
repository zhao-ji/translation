import React, { Component, Fragment } from 'react';

import * as Sentry from '@sentry/browser';

import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { diffWords, diffChars } from 'diff';

import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import { faVolumeOff, faVolumeDown, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const chineseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const punctuationRegex = /[.,:;!?。，：；！？]/;

export const starReplace = (text) => {
    if (!text) return false;
    return text.split("*").join("\u00B7");
};

export const ConsoleLog = ({ children }) => {
  console.log(children);
  return false;
};

export const Comment = ({ children }) => {
  return false;
};

class ErrorBoundary extends Component {
    state = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        Sentry.withScope((scope) => {
            scope.setExtras(errorInfo);
            Sentry.captureException(error);
        });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>
                            Something went wrong!
                        </Card.Title>
                    </Card.Body>
                </Card>
            );
        }
        return this.props.children;
    }
}

export const LoadingWrapper = ({ loading, currentText, resultText, children }) => {
    if (loading) return false;
    const childrenWithErrorBoundary = (<ErrorBoundary>{children}</ErrorBoundary>);
    if (currentText === resultText) return childrenWithErrorBoundary;
    if (currentText && resultText && currentText.trim() === resultText.trim()) return childrenWithErrorBoundary;
    return false;
}

export function TranslationCard (props) {
    console.log(props)
    if (!props.result || !props.result.result) return null;

    let { text: originText, result } = props.result;
    const { compareTo, header } = props;
    if (checkTextType(originText) === 'sentence' && compareTo) {
        result = diff(result, compareTo);
    }
    return (
        <Card>
            <Card.Header>{header}</Card.Header>
            <Card.Body>
                <Card.Title> {result} </Card.Title>
            </Card.Body>
            {props.children}
        </Card>
    );
}

export class TranslationCardWithClipboard extends Component {
    state = {
        copied: false,
    }

    conponentDidMount() {
        this.timer = null;
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    handleCopy = () => {
        this.setState(
            { copied: true },
            () => {
                this.timer = setTimeout(
                    () => this.setState({ copied: false }),
                    3000
                );
            }
        );
    }

    render() {
        const header = (
            <>
                {this.props.header}
                {
                    this.state.copied
                        ?
                        <span className="float-right text-success"> Copied! </span>
                        :
                        <CopyToClipboard
                            text={this.props.title}
                            onCopy={this.handleCopy}
                            className="float-right"
                        >
                            <FontAwesomeIcon icon={faCopy} />
                        </CopyToClipboard>
                }
            </>
        );
        return (
            <TranslationCard {...this.props} header={header} />
        );
    }
}

export class TranslationCardWithFullscreenAbility extends Component {
    state = {
        fullscreen: false,
    }

    toggle = () => {
        this.setState(prevState => ({fullscreen: !prevState.fullscreen}));
    }

    render() {
        return (
            <Card className={this.state.fullscreen && "fullscreen"}>
                <Card.Header>
                    {this.props.header}
                    <FontAwesomeIcon
                        icon={this.state.fullscreen ? faCompress : faExpand}
                        onClick={this.toggle} pull="right"
                    />
                </Card.Header>
                <Card.Body>
                    {this.props.title && <Card.Title> {this.props.title} </Card.Title>}
                    {this.props.children}
                </Card.Body>
            </Card>
        );
    }
}

export function TranslationCardItems(props) {
    if (!props.items || props.items.length < 1) return null;
    return (
        <Card.Body>
            <Card.Title> {props.title} </Card.Title>
            <ListGroup className="list-group-flush">
                {props.items.map(item => props.renderMethod(item))}
            </ListGroup>
        </Card.Body>
    );
}

export function checkIfMandarin(text) {
    if (typeof text !== "string") return false;
    return chineseRegex.test(text);
}

export function checkTextType(text) {
    if (typeof text !== "string") return "empty";
    if (punctuationRegex.test(text)) return "sentence";
    const spaceCount = (text.match(/ /g) || []).length;
    if (spaceCount > 7) {
        return "sentence";
    } else if (spaceCount > 0) {
        return "phrase";
    } else if (spaceCount === 0) {
        return "word";
    }
    console.log(text, 'what the hell is this?')
    return "sentence";
}

export function diff(text, compare) {
    if (checkTextType(text) !== "sentence") return text;
    const diff = diffWords(compare, text, true);
    const result = diff.map(function(part, index) {
        if (part.added) return <mark key={index}>{part.value}</mark>;
        if (part.removed) return '';
        return part.value;
    });
    return (<>{result}</>);
}

export class CollapsableList extends Component {
    state = {
        show: false,
    }

    onToggle = () => {
        this.setState(prevState => ({show: !prevState.show}));
    }

    render() {
        if (!this.props.children) return false;
        const tooLong = this.props.children.length > this.props.limit;
        const extraCount = this.props.children.length - this.props.limit;
        return (
            <Fragment>
            {
                tooLong && !this.state.show
                    ? this.props.children.slice(0, this.props.limit)
                    : this.props.children
            }
            <br/>
            <Row>
                <Col lg={12} md={12} sm={12}>
                    {
                        tooLong &&
                        <Button block size="sm" variant="light" onClick={this.onToggle}>
                            {this.state.show ? "Less" : "More (extra " + extraCount + ")"}
                        </Button>
                    }
                </Col>
            </Row>
            </Fragment>
        );
    }
}

CollapsableList.defaultProps = {
    limit: 3
};

export function TagResolver(text) {
    // webster tag resolver
    const newString = text
        .replace(/{bc}/g, "")
        .replace(/{ldquo}/g, "“")
        .replace(/{rdquo}/g, "”")
        .replace(/\{b\}/g, "<strong>")
        .replace(/\{\/b\}/g, "</strong>")
        .replace(/\{inf\}/g, "<sub>")
        .replace(/\{\/inf\}/g, "</sub>")
        .replace(/\{sup\}/g, "<sup>")
        .replace(/\{\/sup\}/g, "</sup>")
        .replace(/\{it\}/g, "<i>")
        .replace(/\{\/it\}/g, "</i>")
        .replace(/\{sc\}/g, "<small>")
        .replace(/\{\/sc\}/g, "</small>")
        .replace(/\{sx\|([a-z0-9\s]+)\|\|\}/g, "$1")
        .replace(/\{.*\}/g, "");
    if (!newString) return false;
    return <span dangerouslySetInnerHTML={{__html: newString}} />;
}

export function UrbanDictionaryTagResolver(text) {
    // webster tag resolver
    const newString = text.replace(/\[/g, "<strong>").replace(/\]/g, "</strong>");
    return <span dangerouslySetInnerHTML={{__html: newString}} />;
}

export class AudioPlayer extends Component {
    state = {
        isPlaying: false,
        count: 0,
    }

    onClick = () => {
        const audio = new Audio(this.props.src);
        if (this.state.count > 0) audio.playbackRate = 0.7;
        audio.addEventListener("ended", () => {
            this.setState(prevState => ({
                isPlaying: false,
                count: prevState.count + 1,
            }));
        });
        audio.play();
        this.setState({ isPlaying: true });
    }

    render() {
        return (
            this.state.isPlaying
            ? <AudioAnimatePlayer />
            : <FontAwesomeIcon icon={faVolumeUp} onClick={this.onClick} fixedWidth />
        );
    }
}

class AudioAnimatePlayer extends Component {
    state = {
        count: 0,
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState(prevState => ({ count: prevState.count + 1 })),
            500
        );
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const iconChoices = [faVolumeOff, faVolumeDown, faVolumeUp, faVolumeDown];
        return (
            <FontAwesomeIcon icon={iconChoices[this.state.count % 4]} fixedWidth />
        );
    }
}

export function ReportAPIErrorToSentry(error, ...extraInfo) {
    Sentry.withScope((scope) => {
        scope.setExtras(extraInfo);
        Sentry.captureException(error);
    });
}
