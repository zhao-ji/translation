import React, { Component } from 'react';

import { Card } from 'react-bootstrap';
import { faVolumeUp, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as R from 'ramda'

import { secrets } from '../actions/secrets';
import { CollapsableList, ConsoleLog, Comment, LoadingWrapper, starReplace, TagResolver } from '../utils';


const Example = ({ text, word }) => {
    let parts = text.split(new RegExp(`(${word})`, 'gi'));
    return (<>{
        parts.map((part, index) =>
            part.toLowerCase() === word.toLowerCase()
            ? <mark key={index}>{part}</mark> : part
        )
    }</>);
}

class ExampleSection extends Component {
    render() {
        return (
            <>
                <hr/>
                <h3 class="other-aspect">Examples</h3>
                <div class="other-aspect-body">
                    {
                        this.props.examples.map(result => (
                            <>
                            {result.lexicalEntries.map(entry => (
                                <ol>
                                    <CollapsableList>
                                        {entry.sentences.map(item => (
                                            <li>
                                                <Example text={item.text} word={this.props.word} />
                                                {item.regions && item.regions.length > 0 &&
                                                    <small className="weak pull-right">
                                                        Region: {item.regions[0].text}
                                                    </small>
                                                }
                                            </li>
                                        ))}
                                    </CollapsableList>
                                </ol>
                            ))}
                            </>
                        ))
                    }
                </div>
            </>
        );
    }
}

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
                <h3 class="other-aspect">
                    Pronunciation
                    <a
                        href="https://www.lexico.com/en/grammar/key-to-pronunciation"
                        rel="noopener noreferrer" target="_blank">
                        <FontAwesomeIcon icon={faQuestionCircle} size="xs"/>
                    </a>
                </h3>
                <p class="other-aspect-body">
                    {this.props.word}
                    {this.props.item.map((item, index) => (
                        <span key={index}>
                            &nbsp; /{item.phoneticSpelling}/ <AudioPlayer src={item.audioFile} />
                        </span>
                    ))}
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
        let origin = false;
        if ("etymologies" in this.props.result[0].lexicalEntries[0].entries[0]) {
            origin = this.props.result[0].lexicalEntries[0].entries[0].etymologies[0];
        }
        const pronunciation = this.props.result[0].lexicalEntries[0].pronunciations;
        return (
            <Card>
                <Card.Header> Oxford </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <span class="title"> {this.props.text} </span>
                    </Card.Title>
                    <Card.Text>
                        {this.props.result[0].lexicalEntries.map(
                            lexicalEntry => <DefinitionSection lexicalEntry={lexicalEntry} />
                        )}
                        {origin && <OriginSection origin={origin} />}
                        <PronunciationSection word={this.props.text} item={pronunciation} />
                        <LoadingWrapper
                            loading={this.props.examples.isLoading}
                            match={this.props.examples.text === this.props.text}>
                            <ExampleSection examples={this.props.examples.result} word={this.props.text} />
                        </LoadingWrapper>
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

class WebsterDefinitionSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.showDefinition = this.showDefinition.bind(this);
    }

    showDefinition(i) {
        switch(i[0]) {
            case "sense":
                return (
                    <li>
                    {("dt" in i[1]) && ("text" === i[1].dt[0][0]) && TagResolver(i[1].dt[0][1])}
                    {("sdsense" in i[1]) &&
                        <div>
                        <i> {i[1].sdsense.sd} </i>{TagResolver(i[1].sdsense.dt[0][1])} 
                        </div>
                    }
                    </li>
                );
            case "pseq":
                return (
                    <li>
                        <ol type="1">
                            {i[1].map(this.showDefinition)}
                        </ol>
                    </li>
                );
            default:
                return <ConsoleLog>{i}<Comment></Comment></ConsoleLog>;
        }
    }

    generateAudio(sound) {
        let prefix;
        switch (true) {
            case sound.audio.startsWith("bix"):
                prefix = "bix";
                break;
            case sound.audio.startsWith("gg"):
                prefix = "gg";
                break;
            case sound.audio.startsWith("_"):
                prefix = "number";
                break;
            case sound.audio.match(/^\d/):
                prefix = "number";
                break;
            default:
                prefix = sound.audio[0];
                break;
        }
        return <AudioPlayer src={secrets.websterSoundBaseUrl + prefix + "/" + sound.audio + ".wav"}/>;
    }

    render() {
        const HeadWord = R.pathOr(false, ["hwi", "hw"], this.props.item);
        const Pronun = R.pathOr(false, ["hwi", "prs", 0, "mw"], this.props.item);
        const Sound = R.pathOr(false, ["hwi", "prs", 0, "sound"], this.props.item);
        const Ins = R.pathOr([], ["ins"], this.props.item);
        const Def = R.pathOr([], ["def"], this.props.item);
        const Origin = R.pathOr(false, ["et", 0, 1], this.props.item);
        const From = R.pathOr(false, ["date"], this.props.item);
        const Uros = R.pathOr(false, ["meta", "uros"], this.props.item);
        const Stems = R.pathOr(false, ["meta", "stems"], this.props.item);
        return (
            <>
            <p>
                <span class="webster-head-word">{starReplace(HeadWord)}</span>
                <span class="webster-word-type"> { this.props.item.fl } </span>
            </p>
            <p class="pronun">
                {Pronun &&
                    <span>\{Pronun} {Sound && this.generateAudio(Sound)}\</span>
                }
            </p>
            {Ins.length>0 &&
                (<p>Different Shape: {Ins.map(item =>
                    (<span><i class="webster-ins">{item.il}</i> {starReplace(item.if)}</span>)
                )}</p>)
            }
            {Def.length > 0 && Def.map(def => (
                <>
                <p>{def.vd}</p>
                <ol type="1">
                    {def.sseq.map(item=> (<li class="webster-definition-item">
                        <ol type="a">
                            {item.map(this.showDefinition)}
                        </ol>
                    </li>))}
                </ol>
                </>
            ))}
            <p class="other-word">
                {Uros.length > 0 && Uros.map(item => (
                    <div>
                        {item.fl}
                        {item.ure} \{item.prs[0].mw}\
                    </div>
                ))}
            </p>
            {
                Stems.length > 0 && 
                <p class="meta"> Related Word: {Stems.map(stem => (<span>{stem}&nbsp;</span>))} </p>
            }
            <p>
                { Origin && <span> Origin: {TagResolver(Origin)} </span> }
            </p>
            <p>
                { From && <span> First Known Use: {TagResolver(From)} </span> }
            </p>
            <hr/>
            </>
        )
    }
}

class WebsterResult extends Component {
    render() {
        if (!this.props.result || this.props.result.length === 0) {
            return false;
        }
        if (typeof this.props.result[0] === "string") {
            return false;
        }
        return (
            <Card>
                <Card.Header> Merriam Webster </Card.Header>
                <Card.Body>
                    <Card.Text>
                        <CollapsableList>
                            {this.props.result.map(
                                item => <WebsterDefinitionSection item={item} total={this.props.result.length}/>
                            )}
                        </CollapsableList>
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

const EnResult = {
    OxfordResult: OxfordResult,
    WebsterResult: WebsterResult,
}

export default EnResult;
