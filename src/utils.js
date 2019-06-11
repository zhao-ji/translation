import React from 'react';
import { Card } from 'react-bootstrap';
import { ListGroup, ListGroupItem } from 'react-bootstrap';

export const debounce = (fn, delay) => {
    let timer = null;
    return (...args) => {
        const context = this;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
};

export const LoadingWrapper = ({ loading, children }) => (
    <div>
        { !loading && children }
    </div>
)

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
