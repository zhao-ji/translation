import React, { Component } from 'react';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';

const chineseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const punctuationRegex = /[ .,:;!?。，：；！？]/

export const ConsoleLog = ({ children }) => {
  console.log(children);
  return false;
};

export const Comment = ({ children }) => {
  return false;
};

export const LoadingWrapper = ({ loading, match, children }) => {
    if (!loading && match) {
        return (<>{ children }</>);
    }
    return null
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
            show: false
        }
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle() {
        this.setState({show: !this.state.show})
    }

    render() {
        return (
            <>
            {
                !this.state.show && this.props.children.length > this.props.limit ?
                this.props.children.slice(0, this.props.limit) :
                this.props.children
            }
            <Row>
                <Col lg={12} md={12} sm={12}>
                    {
                        this.props.children.length > this.props.limit ?
                        <Button block size="sm" variant="light" onClick={this.onToggle}>
                            {this.state.show ? "Less" : "More"}
                        </Button>: null
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
