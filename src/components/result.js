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

export class OxfordResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (!this.props.result) {
            return null;
        }
        console.log(this.props.result);
        const entries = this.props.result.entry;
        const sentences = this.props.result.sentence;
        return (
            <>
                <OxfordEntries entries={entries} />
            <Card>
                <Card.Header>Oxford</Card.Header>
                <Card.Body>
                    <Card.Title> Examples </Card.Title>
                    <ListGroup className="list-group-flush">
                        <Accordion>
                        {sentences.map((sentence, index) => (
                            <ListGroupItem key={index}>
                                Lexical Category: {sentence.lexicalEntries[0].lexicalCategory.text}
                                {sentence.lexicalEntries[0].sentences && sentence.lexicalEntries[0].sentences.length > 0 &&
                                    <span>
                                        <Accordion.Toggle
                                            as={Button} variant="outline-info" size="sm"
                                            className="float-right" eventKey={index}>
                                            Examples
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={index}>
                                            <ListGroup className="list-group-flush">
                                                {sentence.lexicalEntries[0].sentences.map((item, iIndex) => (
                                                    <ListGroupItem key={iIndex}>
                                                        {item.regions && item.regions.length > 0 &&
                                                            <div> Region: {item.regions[0].text} </div>
                                                        }
                                                        {item.text}
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
            </Card>
            </>
        );
    }
}

const OxfordEntries = ({ entries }) => {
    return (
        <>
        {entries.map((entry) => (
            <>
            {entry.lexicalEntries.map((lexicalEntry, iIndex) => (
                <Card>
                <Card.Header>Oxford Lexical Category: {lexicalEntry.lexicalCategory.text}</Card.Header>
                <Card.Body key={iIndex}>
                    <Card.Title> Pronunciation </Card.Title>
                    <ListGroup className="list-group-flush">
                        {lexicalEntry.pronunciations.map((pronunciation, IIindex) => (
                            <ListGroupItem key={IIindex}>
                                {pronunciation.dialects && pronunciation.dialects.length > 0 &&
                                    pronunciation.dialects[0]
                                }: /{pronunciation.phoneticSpelling}/
                                <audio control="true">
                                    <source src={pronunciation.audioFile} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </ListGroupItem>
                        ))}
                    </ListGroup>
                </Card.Body>
                <Card.Body key={iIndex}>
                    <Card.Title> Etymology </Card.Title>
                    <ListGroup className="list-group-flush">
                        {lexicalEntry.entries[0].etymologies && lexicalEntry.entries[0].etymologies.length > 0 &&
                            <>
                                {lexicalEntry.entries[0].etymologies.map((etymology, IIIindex) => (
                                    <ListGroupItem key={IIIindex}>
                                        {etymology}
                                    </ListGroupItem>
                                ))}
                            </>
                        }
                    </ListGroup>
                </Card.Body>
                {lexicalEntry.entries[0].variantForms && lexicalEntry.entries[0].variantForms.length > 0 &&
                    <Card.Body key={iIndex}>
                        <Card.Title>Variant Forms:</Card.Title>
                        <ListGroup className="list-group-flush">
                            {lexicalEntry.entries[0].variantForms.map((variant, IIIindex) => (
                                <ListGroupItem key={IIIindex}>
                                    {variant.text}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Card.Body>
                }
                {lexicalEntry.entries[0].senses && lexicalEntry.entries[0].senses.length > 0 &&
                    <>
                            {lexicalEntry.entries[0].senses.map((sense, Iindex) => (
                    <Card.Body key={iIndex}>
                        <Card.Title>Variant Forms:</Card.Title>
                        <ListGroup className="list-group-flush">
                                <ListGroupItem key={Iindex}>
                                    Short Definitions: {sense.shortDefinitions.join()}
                                    <br/>
                                    Definitions: {sense.definitions.join()}
                                    <br/>
                                    Examples: {sense.examples.map(example => (example.text)).join()}
                                    <br/>
                                    Sub Senses: {sense.subsenses && sense.subsenses.length > 0 &&
                                            <div>
                                        {sense.subsenses.map((subsense, hello) => (
                                            <div key={hello}>
                                                Short Definitions: {subsense.shortDefinitions.join()}
                                    <br/>
                                                Definitions: {subsense.definitions.join()}
                                    <br/>
                                                Examples: {subsense.examples && subsense.examples.length > 0 && subsense.examples.map((example, hey) => (<span key={hey}>{example.text}</span>))}
                                            </div>
                                        ))}
                                            </div>
                                    }
                                    Regions: {sense.regions && sense.regions.length > 0 &&
                                            <div>
                                                {sense.regions.map(region => (
                                                    <span>{region.text}</span>
                                                ))}
                                            </div>
                                             }
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                            ))
                            }
                    </>
                    }
                </Card>
            ))}
            </>
        ))}
        </>
    )
}
