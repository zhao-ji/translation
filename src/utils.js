import React from 'react';
import { Card } from 'react-bootstrap';
import { ListGroup } from 'react-bootstrap';

const chineseRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/;
const punctuationRegex = /[ .,:;!?。，：；！？]/

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
