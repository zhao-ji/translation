import React, { Component } from 'react';
import { Accordion, Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';


export class GoogleResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (!this.props.result) {
            return null;
        }
        return (
            <Card>
                <Card.Header>Google</Card.Header>
                <Card.Body>
                    <Card.Title> {this.props.result} </Card.Title>
                </Card.Body>
            </Card>
        );
    }
}

export class BaiduResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (!this.props.result) {
            return null;
        }
        return (
            <Card>
                <Card.Header>Baidu</Card.Header>
                <Card.Body>
                    <Card.Title> {this.props.result} </Card.Title>
                </Card.Body>
            </Card>
        );
    }
}

export class BingResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (!this.props.result) {
            return null;
        }
        const dictionary = this.props.result.dictionary;
        return (
            <Card>
                <Card.Header>Bing</Card.Header>
                <Card.Body>
                    <Card.Title>
                        {this.props.result.translation}
                    </Card.Title>
                </Card.Body>
                {dictionary && dictionary.length > 0 &&
                        <Card.Body>
                            <Card.Title> Dictionary Lookup </Card.Title>
                            <ListGroup className="list-group-flush">
                                <Accordion>
                                    {dictionary.map((explain, index) => (
                                        <ListGroupItem key={index}>
                                            {explain.posTag}: {explain.displayTarget}
                                            {explain.examples && explain.examples.length > 0 &&
                                                <span>
                                                    <Accordion.Toggle
                                                        as={Button} variant="outline-info" size="sm"
                                                        className="float-right" eventKey={index}>
                                                        Examples
                                                    </Accordion.Toggle>
                                                    <Accordion.Collapse eventKey={index}>
                                                        <ListGroup className="list-group-flush">
                                                            {explain.examples.map((item, iIndex) => (
                                                                <ListGroupItem key={iIndex}>
                                                                    <span>
                                                                        {item.sourcePrefix}
                                                                        <mark>
                                                                            {item.sourceTerm}
                                                                        </mark>
                                                                        {item.sourceSuffix}:
                                                                    </span>
                                                                    <span className="pull-right">
                                                                        {item.targetPrefix}
                                                                        <mark>
                                                                            {item.targetTerm}
                                                                        </mark>
                                                                        {item.targetSuffix}
                                                                    </span>
                                                                </ListGroupItem>
                                                            ))}
                                                        </ListGroup>
                                                    </Accordion.Collapse>
                                                </span>
                                            }
                                        </ListGroupItem>
                                    ))}
                                </Accordion>
                            </ListGroup>
                        </Card.Body>
                }
            </Card>
        );
    }
}

export class YoudaoResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (!this.props.result) {
            return null;
        }
        const basicInfo = this.props.result.basic;
        const webInfo = this.props.result.web;
        return (
            <Card>
                <Card.Header>Youdao</Card.Header>
                <Card.Body>
                    <Card.Title>
                        {this.props.result.translation && this.props.result.translation[0]}
                    </Card.Title>
                </Card.Body>
                {basicInfo && basicInfo.phonetic &&
                    <Card.Body>
                        <Card.Title> Pronounciation </Card.Title>
                        {
                            basicInfo["uk-phonetic"]
                                ?
                                <Card.Text>
                                    /{basicInfo.phonetic}/ &nbsp;
                                    UK: /{basicInfo["uk-phonetic"]}/ &nbsp;
                                    US: /{basicInfo["us-phonetic"]}/
                                </Card.Text>
                                :
                                <Card.Text>
                                    /{basicInfo.phonetic}/
                                </Card.Text>
                        }
                    </Card.Body>
                }
                {basicInfo && basicInfo.explains.length > 0 &&
                    <Card.Body>
                        <Card.Title> Basic </Card.Title>
                        <ListGroup className="list-group-flush">
                            {basicInfo.explains.map((explain, index) => (<ListGroupItem key={index}>{explain}</ListGroupItem>))}
                        </ListGroup>
                    </Card.Body>
                }
                {webInfo && webInfo.length > 0 &&
                    <Card.Body>
                        <Card.Title> Web </Card.Title>
                        <ListGroup className="list-group-flush">
                            {webInfo.map((info, index) => (
                                <ListGroupItem key={index}>
                                    {info.key}: {info.value.map((v, vIndex) => (
                                        <small key={vIndex}> {v} &nbsp; </small>
                                    ))}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Card.Body>
                }
            </Card>
        );
    }
}
