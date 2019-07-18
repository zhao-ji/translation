import React, { Component } from 'react';

import { Card } from 'react-bootstrap';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class OriginSection extends Component {
    render() {
        return (
            <>
                <hr/>
                <h3 class="other-aspect">Origin</h3>
                <p class="other-aspect-body"> {this.props.origin} </p>
            </>
        );
    }
}

class PronunciationSection extends Component {
    render() {
        return (
            <>
                <hr/>
                <h3 class="other-aspect">Pronunciation</h3>
                <p class="other-aspect-body">
                    {this.props.word}
                    &nbsp; /{this.props.item.phoneticSpelling}/
                    &nbsp; <AudioPlayer src={this.props.item.audioFile} />
                </p>
            </>
        );
    }
}

class DefinitionSection extends Component {
    render() {
        return (
            <>
                <hr/>
                <h3 class="lexical-category">
                    { this.props.lexicalEntry.lexicalCategory.text }
                </h3>
                { this.props.lexicalEntry.entries.map(entry => (
                    <ol type="1">
                    {entry.senses.map((sense, index) => (
                        <li>
                            {sense.domains && sense.domains.length > 0 &&
                                <p class="note">{sense.domains[0].text}</p>
                            }
                            <p>
                                {
                                    sense.notes && sense.notes.length > 0 &&
                                        <span class="note">[{sense.notes[0].text}]</span>
                                }
                                <span class="definition">{sense.definitions[0]}</span>
                            </p>
                            {("examples" in sense) && sense.examples && sense.examples.length > 0 && 
                                sense.examples.map(example => (
                                    <p>
                                        {
                                            ("notes" in example) && example.notes && example.notes.length > 0 &&
                                                <span class="note">[{example.notes[0].text}]</span>
                                        }
                                        <span class="example"><em>{example.text}</em></span>
                                    </p>
                                    
                                ))
                            }
                            <ol type="1">
                            {sense.subsenses && sense.subsenses.length > 0 &&sense.subsenses.map((subsense, subIndex) => (
                                <li>
                                    {
                                        ("definitions" in subsense) && subsense.definitions.length > 0 
                                        ?
                                            <p class="definition">{subsense.definitions[0]}</p>
                                        :
                                        ("shortDefinitions" in subsense) && subsense.shortDefinitions.length > 0 &&
                                            <p class="definition"> short for {subsense.shortDefinitions[0]} </p>
                                    }
                                    {subsense.examples && subsense.examples.length > 0 && subsense.examples.map(example => (
                                        <p class="example"><em>{example.text}</em></p>
                                    ))}
                                </li>
                            ))}
                            </ol>
                        </li>
                    ))}
                    </ol>
                ))}
            </>
        );
    }
}

class OxfordResult extends Component {
    render() {
        if (!this.props.result || this.props.result.length === 0 || !this.props.result[0].lexicalEntries) {
            return null;
        }
        const word = this.props.result[0].id;
        const origin = this.props.result[0].lexicalEntries[0].entries[0].etymologies[0];
        const pronunciation = this.props.result[0].lexicalEntries[0].pronunciations[0];
        return (
            <Card>
                <Card.Header> Oxford </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <span class="title"> {word} </span>
                    </Card.Title>
                    <Card.Text>
                        {this.props.result[0].lexicalEntries.map(
                            lexicalEntry => <DefinitionSection lexicalEntry={lexicalEntry} />
                        )}
                        <OriginSection origin={origin} />
                        <PronunciationSection word={word} item={pronunciation} />
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
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

const EnResult = {
    OxfordResult: OxfordResult,
}

export default EnResult;
