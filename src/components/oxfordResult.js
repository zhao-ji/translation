import React, { Component } from 'react';

import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ConsoleLog, TranslationCard, TranslationCardItems } from '../utils';

class OriginSection extends Component {
    render() {
        return (
            <section>
                <hr/>
                <h3> <strong> Origin </strong> </h3>
                <div>
                    <p> {this.props.origin} </p>
                </div>
            </section>
        );
    }
}

class PronunciationSection extends Component {
    render() {
        return (
            <section>
                <hr/>
                <h3> <strong> Pronunciation </strong> </h3>
                <div>
                    <p> {this.props.word} {this.props.pronunciations} </p>
                </div>
            </section>
        );
    }
}

class DefinitionSection extends Component {
    render() {
        return (
            <section>
                <hr/>
                <h3> <strong>{ this.props.lexicalEntry.lexicalCategory.text } </strong></h3>
                { this.props.lexicalEntry.entries.map(entry => (
                    <>
                    {entry.senses.map((sense, index) => (
                        <li>
                            {index + 1}
                            {sense.domains && sense.domains.length > 0 &&
                                    <span>{sense.domains[0].text}</span>
                            }
                            {sense.domains && sense.domains.length > 0 &&
                                    <br/>
                            }
                            {sense.notes && sense.notes.length > 0 
                                    ?
                                    <span>[{sense.notes[0].text}] {sense.definitions[0]} </span>
                                    :
                                    <span>{sense.definitions[0]} </span>
                            }
                            <ConsoleLog>{sense}</ConsoleLog>
                            {("examples" in sense) && sense.examples && sense.examples.length > 0 && 
                                sense.examples.map(example => (
                                    ("notes" in example) && example.notes && example.notes.length > 0 
                                        ?
                                        <p>[{example.notes[0].text}] {example.text} </p>
                                        :
                                        <p>{example.text}</p>
                                    
                                ))
                            }
                            {sense.subsenses && sense.subsenses.length > 0 &&sense.subsenses.map((subsense, subIndex) => (
                                <li>
                                    {(index + 1) + "." + (subIndex + 1)}
                                    {
                                        ("definitions" in subsense) && subsense.definitions.length > 0 
                                        ?
                                        subsense.definitions[0]
                                        :
                                        ("shortDefinitions" in subsense) && subsense.shortDefinitions.length > 0 &&
                                            <span> short for {subsense.shortDefinitions[0]} </span>
                                    }
                                    {subsense.examples && subsense.examples.length > 0 && subsense.examples.map(example => (
                                        <p>{example.text}</p>
                                    ))}
                                </li>
                            ))}
                        </li>
                    ))}
                    </>
                ))}
            </section>
        );
    }
}

class NewTranslationResult extends Component {
    render() {
        if (!this.props.result || this.props.result.length === 0 || !this.props.result[0].lexicalEntries) {
            return null;
        }
        const word = this.props.result[0].id;
        const origin = this.props.result[0].lexicalEntries[0].entries[0].etymologies[0];
        const pronunciation = this.props.result[0].lexicalEntries[0].pronunciations[0];
        return (
            <Card>
                <Card.Header>
                    <span>Oxford</span>
                </Card.Header>
                <span class="hw">{word}</span>
                {this.props.result[0].lexicalEntries.map(lexicalEntry => <DefinitionSection lexicalEntry={lexicalEntry} />)}
                <OriginSection origin={origin} />
                <PronunciationSection word={word} pronunciation={pronunciation} />
            </Card>
        );
    }
}

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
        return (<>{
            this.props.result.map((item, index) => (
                item.lexicalEntries.map((entry, Iindex) =>
                    <EntryCard result={entry} key={Iindex + index * 100} />
                )
            ))
        }</>);
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
                    <span>Oxford Lexical Category: <b>{lexicalEntry.lexicalCategory.text}</b></span>
                </Card.Header>
                <TranslationCardItems
                    title="Pronunciation" items={lexicalEntry.pronunciations}
                    renderMethod={item => (
                        <ListGroupItem>
                            {item.dialects && item.dialects.length > 0 && item.dialects[0]}:
                            &nbsp; /{item.phoneticSpelling}/
                            &nbsp; <AudioPlayer src={item.audioFile} />
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
                                {sense.domains && sense.domains.map((domain, indexx) => (
                                    <ListGroupItem>
                                        Domains: {domain.text}
                                    </ListGroupItem>
                                ))}
                                {sense.notes && sense.notes.map((note, indexx) => (
                                    <ListGroupItem>
                                        Note: {note.type} {note.text}
                                    </ListGroupItem>
                                ))}
                                {sense.subsenses && sense.subsenses.length > 0 && sense.subsenses.map((subsense, indexx) => (
                                    <ListGroupItem>
                                        <ListGroup className="list-group-flush">
                                            <ListGroupItem>
                                                Short Definitions: {subsense.shortDefinitions.join('--------')}
                                            </ListGroupItem>
                                            {subsense.definitions && subsense.definitions.length > 0 &&
                                                <ListGroupItem>
                                                    Definitions: {subsense.definitions.join('----------')}
                                                </ListGroupItem>
                                            }
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
                                    <ListGroupItem> Region: {region.text} </ListGroupItem>
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
        if (this.props.result.length < 1) {
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
                    header={<span>Oxford Lexical Category: <b>{sentence.lexicalEntries[0].lexicalCategory.text}</b></span>}
                    title="Examples">
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

class AudioPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false
        }

        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        const audio = new Audio(this.props.src);
        audio.play();
        this.setState({ isPlaying: true });
        audio.addEventListener("ended", () => {
            this.setState({ isPlaying: false });
        });
    }

    render() {
        return (
            <FontAwesomeIcon
                icon={faVolumeUp}
                onClick={this.onClick}
                pulse={this.state.isPlaying ? true : false}
            />
        );
    }
}

const OxfordResult = {
    TranslationResult: TranslationResult,
    ExamplesResult: ExamplesResult,
    NewTranslationResult: NewTranslationResult,
}

export default OxfordResult;
