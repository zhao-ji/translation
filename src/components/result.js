import React, { Component } from 'react';
import { Accordion, Button, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { TranslationCard, TranslationCardItems } from '../utils';


class GoogleResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <TranslationCard header="Google" title={this.props.result} />
        );
    }
}

class BaiduResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <TranslationCard header="Baidu" title={this.props.result} />
        );
    }
}

class BingResult extends Component {
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
            <TranslationCard header="Bing" title={this.props.result.translation}>
                {dictionary && dictionary.length > 0 &&
                    <Card.Body>
                        <Card.Title> Dictionary Lookup </Card.Title>
                        <ListGroup className="list-group-flush">
                            <Accordion>
                                {dictionary.map((explain, index) => (
                                    <ListGroupItem key={index}>
                                        {explain.posTag}: {explain.displayTarget}
                                        {explain.examples && explain.examples.length > 0 && <>
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
                                                                {item.sourcePrefix} <mark> {item.sourceTerm} </mark> {item.sourceSuffix}:
                                                            </span>
                                                            <span className="pull-right">
                                                                {item.targetPrefix} <mark> {item.targetTerm} </mark> {item.targetSuffix}
                                                            </span>
                                                        </ListGroupItem>
                                                    ))}
                                                </ListGroup>
                                            </Accordion.Collapse>
                                        </>}
                                    </ListGroupItem>
                                ))}
                            </Accordion>
                        </ListGroup>
                    </Card.Body>
                }
            </TranslationCard>
        );
    }
}

class YoudaoResult extends Component {
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
            <TranslationCard header="Youdao" title={this.props.result.translation && this.props.result.translation[0]}>
                {basicInfo && basicInfo.phonetic &&
                    <Card.Body>
                        <Card.Title> Pronounciation </Card.Title>
                        <Card.Text>
                            /{basicInfo.phonetic}/ &nbsp; { basicInfo["uk-phonetic"] && <>
                                UK: /{basicInfo["uk-phonetic"]}/ &nbsp; US: /{basicInfo["us-phonetic"]}/
                                </> }
                        </Card.Text>
                    </Card.Body>
                }
                <TranslationCardItems
                    title="Basic" items={basicInfo && basicInfo.explains}
                    renderMethod={(item, index) => (<ListGroupItem key={index}>{item}</ListGroupItem>)}
                />
                <TranslationCardItems
                    title="Web" items={webInfo}
                    renderMethod={item => (
                        <ListGroupItem>
                            {item.key}: {item.value.map((v, index) => (
                                <small key={index}> {v} &nbsp; </small>
                            ))}
                        </ListGroupItem>
                    )}
                />
            </TranslationCard>
        );
    }
}

const Result = {
    GoogleResult: GoogleResult,
    BaiduResult: BaiduResult,
    YoudaoResult: YoudaoResult,
    BingResult: BingResult,
}

export default Result;
