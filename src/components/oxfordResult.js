import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { TranslationCard, TranslationCardItems } from '../utils';

class TranslationResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        if (!this.props.result || this.props.result.length === 0 || !this.props.result[0].lexicalEntries) {
            return null;
        }
        return (<>{this.props.result[0].lexicalEntries.map(
            (entry, index) => (<EntryCard result={entry} key={index} />)
        )}</>);
    }
}


class EntryCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const lexicalEntry = this.props.result;
        return (
            <Card>
                <Card.Header>
                    Oxford Lexical Category: {lexicalEntry.lexicalCategory.text}
                </Card.Header>
                <TranslationCardItems
                    title="Pronunciation" items={lexicalEntry.pronunciations}
                    renderMethod={item => (
                        <ListGroupItem>
                            {item.dialects && item.dialects.length > 0 && item.dialects[0]}:
                            &nbsp; /{item.phoneticSpelling}/
                            &nbsp; <audio src={item.audioFile}></audio>
                        </ListGroupItem>
                    )}
                />
                {lexicalEntry.entries && lexicalEntry.entries.length > 0 && 
                    <>
                        <TranslationCardItems
                            title="Etymology"
                            items={lexicalEntry.entries[0].etymologies}
                            renderMethod={item => (<ListGroupItem> {item} </ListGroupItem>)}
                        />
                        <TranslationCardItems
                            title="Variant Forms"
                            items={lexicalEntry.entries[0].variantForms}
                            renderMethod={item => (<ListGroupItem> {item.text} </ListGroupItem>)}
                        />
                        <TranslationCardItems
                            title="Senses"
                            items={lexicalEntry.entries[0].senses}
                            renderMethod={sense => (<ListGroupItem>
                                {sense.shortDefinitions && sense.shortDefinitions.length > 0 &&
                                    <ListGroupItem>
                                        Short Definitions: {sense.shortDefinitions.join("=============")}
                                    </ListGroupItem>
                                }
                                {sense.definitions && sense.definitions.length > 0 &&
                                    <ListGroupItem>
                                        Definitions: {sense.definitions.join("===============")}
                                    </ListGroupItem>
                                }
                                {sense.examples && sense.examples.map((example, indexx) => (
                                    <ListGroupItem>
                                        Example: <Example text={example.text} word={this.props.result.text} key={indexx} />
                                    </ListGroupItem>
                                ))}
                                {sense.subsenses && sense.subsenses.length > 0 && sense.subsenses.map((subsense, indexx) => (
                                    <ListGroupItem>
                                        <ListGroup className="list-group-flush">
                                            <ListGroupItem>
                                                Short Definitions: {subsense.shortDefinitions.join('--------')}
                                            </ListGroupItem>
                                            <ListGroupItem>
                                                Definitions: {subsense.definitions.join('----------')}
                                            </ListGroupItem>
                                            {subsense.examples && subsense.examples.length > 0 &&
                                                subsense.examples.map((example, hey) => (
                                                    <ListGroupItem key={hey}>
                                                        Example: <Example text={example.text} word={this.props.result.text} />
                                                    </ListGroupItem>
                                                ))
                                            }
                                        </ListGroup>
                                    </ListGroupItem>
                                ))}
                                {sense.regions && sense.regions.length > 0 && sense.regions.map(region => (
                                    <ListGroupItem> Region: {region} </ListGroupItem>
                                ))}
                            </ListGroupItem>)}
                        />
                    </>
                }
            </Card>
        );
    }
}

class ExamplesResult extends Component {
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
            <>
                {this.props.result.map((example, index) => (<ExampleCard result={example} key={index} />))}
            </>
        )
    }
}

class ExampleCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const sentence = this.props.result;
        return (
            <TranslationCard
                    header={<span>Examples of <b>{sentence.word}</b></span>}
                    title={`Lexical Category: ${sentence.lexicalEntries[0].lexicalCategory.text}`}>
                <TranslationCardItems
                    title="" items={sentence.lexicalEntries[0].sentences}
                    renderMethod={item => (
                        <ListGroupItem>
                            <Example text={item.text} word={sentence.word} />
                            {item.regions && item.regions.length > 0 &&
                                <small className="weak pull-right"> Region: {item.regions[0].text} </small>
                            }
                        </ListGroupItem>
                    )}
                />
            </TranslationCard>
        );
    }
}

const Example = ({ text, word }) => {
    let parts = text.split(new RegExp(`(${word})`, 'gi'));
    return (<>{
        parts.map((part, index) => 
            part.toLowerCase() === word.toLowerCase()
            ? <mark key={index}>{part}</mark> : part
        )
    }</>);
}

const OxfordResult = {
    TranslationResult: TranslationResult,
    ExamplesResult: ExamplesResult,
}

export default OxfordResult;
