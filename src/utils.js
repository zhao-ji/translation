import React, { Component } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const chineseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const punctuationRegex = /[ .,:;!?。，：；！？]/

export const starReplace = (text) => {
    if (!text) {
        return false;
    }
    return text.split("*").join("\u00B7");
};

export const ConsoleLog = ({ children }) => {
  console.log(children);
  return false;
};

export const Comment = ({ children }) => {
  return false;
};

export const LoadingWrapper = ({ loading, currentText, resultText, children }) => {
    if (!loading) {
        if (currentText === resultText) {
            return children;
        } else if (currentText && resultText) {
            if (currentText.trim() === resultText.trim()) {
                return children;
            }
        }
    }
    return false;
}

export function TranslationCard (props) {
    if (!props.title) {
        return null
    }
    return (
        <Card>
            <Card.Header>{props.header}</Card.Header>
            <Card.Body>
                <Card.Title> {props.title} </Card.Title>
            </Card.Body>
            {props.children}
        </Card>
    )
}


export class TranslationCardWithFullscreenAbility extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullscreen: false,
        }
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
                        onClick={this.toggle} pull="right" />
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
    if (!props.items || props.items.length < 1) {
        return null;
    }
    return (
        <Card.Body>
            <Card.Title> {props.title} </Card.Title>
            <ListGroup className="list-group-flush">
                {props.items.map(item => (props.renderMethod(item)))}
            </ListGroup>
        </Card.Body>
    );
}

export function checkIfMandarin(text) {
    if (typeof text !== "string") {
        return false
    }
    return chineseRegex.test(text);
}

export function checkIfSentence(text) {
    if (typeof text !== "string") {
        return false
    }
    return punctuationRegex.test(text);
}

export class CollapsableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
        }
    }

    onToggle = () => {
        this.setState(prevState => ({show: !prevState.show}));
    }

    render() {
        if (!this.props.children) {
            return false;
        }
        const tooLong = this.props.children.length > this.props.limit;
        const extraCount = this.props.children.length - this.props.limit;
        return (
            <>
            {
                tooLong && !this.state.show ?
                this.props.children.slice(0, this.props.limit) :
                this.props.children
            }
            <br/>
            <Row>
                <Col lg={12} md={12} sm={12}>
                    {
                        tooLong ?
                        <Button block size="sm" variant="light" onClick={this.onToggle}>
                            {this.state.show ? "Less" : "More (extra " + extraCount + ")"}
                        </Button> :
                        null
                    }
                </Col>
            </Row>
            </>
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
    if (!newString) {
        return false;
    }
    return <span dangerouslySetInnerHTML={{__html: newString}} />;
}

export function UrbanDictionaryTagResolver(text) {
    // webster tag resolver
    const newString = text.replace(/\[/g, "<strong>").replace(/\]/g, "</strong>");
    return <span dangerouslySetInnerHTML={{__html: newString}} />;
}
