import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';


export class GoogleResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return ( this.props.result &&
            <Card>
                <Card.Header>Google Translate</Card.Header>
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
        return ( this.props.result &&
            <Card>
                <Card.Header>Baidu Translate</Card.Header>
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
        const examples = this.props.result.examples;
        return (
            <Card>
                <Card.Header>Bing Translate</Card.Header>
                <Card.Body>
                    <Card.Title>
                        {this.props.result.translation}
                    </Card.Title>
                </Card.Body>
                {this.props.result.dictionary && this.props.result.dictionary.length > 0 &&
                    <Card.Body>
                        <Card.Title> Dictionary Lookup </Card.Title>
                        <ListGroup className="list-group-flush">
                            {dictionary.map((explain, index) => (
                                <ListGroupItem key={index}>
                                    {explain.posTag}: {explain.displayTarget}
                                </ListGroupItem>
                                ))}
                        </ListGroup>
                    </Card.Body>
                }
                {this.props.result.examples && this.props.result.examples.length > 0 &&
                    <Card.Body>
                        <Card.Title> Examples </Card.Title>
                        <ListGroup className="list-group-flush">
                            {examples.map((example, index) => (
                                example.examples.map((item, iIndex) => (
                                    <ListGroupItem key={index * 100 + iIndex}>
                                        {item.sourcePrefix.split('...').join('')}
                                        {item.sourceTerm.split('...').join('')}
                                        {item.sourceSuffix.split('...').join('')}: &nbsp;
                                        {item.targetPrefix.split('...').join('')}
                                        {item.targetTerm.split('...').join('')}
                                        {item.targetSuffix.split('...').join('')}
                                    </ListGroupItem>
                                ))
                            ))}
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
                <Card.Header>Youdao Translate</Card.Header>
                <Card.Body>
                    <Card.Title>
                        {this.props.result.translation && this.props.result.translation[0]}
                    </Card.Title>
                </Card.Body>
                {this.props.result.basic && this.props.result.basic.phonetic &&
                    <Card.Body>
                        <Card.Text>
                            Pronounciation: /{basicInfo.phonetic}/ &nbsp;
                            UK: /{basicInfo["uk-phonetic"]}/ &nbsp;
                            US: /{basicInfo["us-phonetic"]}/
                        </Card.Text>
                    </Card.Body>
                }
                {this.props.result.basic && this.props.result.basic.explains &&
                    <Card.Body>
                        <Card.Title> Basic </Card.Title>
                        {this.props.result.basic &&
                            <ListGroup className="list-group-flush">
                                {basicInfo.explains.map((explain, index) => (<ListGroupItem key={index}>{explain}</ListGroupItem>))}
                            </ListGroup>
                        }
                    </Card.Body>
                }
                {this.props.result.web && this.props.result.web &&
                    <Card.Body>
                        <Card.Title> Web </Card.Title>
                        {this.props.result.web &&
                            <ListGroup className="list-group-flush">
                                {
                                    webInfo.map((info, index) => (
                                        <ListGroupItem key={index}>
                                            {info.key}: {info.value.map((v, vIndex) => (
                                                <small key={vIndex}>
                                                    {v} &nbsp;
                                                </small>
                                            ))}
                                        </ListGroupItem>
                                    ))
                                }
                            </ListGroup>
                        }
                    </Card.Body>
                }
            </Card>
        );
    }
}
