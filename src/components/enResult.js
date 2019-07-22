import React, { Component } from 'react';

import { Card } from 'react-bootstrap';
import { faVolumeUp, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as R from 'ramda'

import { secrets } from '../actions/secrets';
import { CollapsableList, ConsoleLog, Comment, LoadingWrapper } from '../utils';


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
                <p class="other-aspect-body">
                    {
                        this.props.examples.map(result => (
                            <>
                            {result.lexicalEntries.map(entry => (
                                <ol>
                                    <CollapsableList>
                                        {entry.sentences.map(item => (
                                            <li>
                                                <Example text={item.text} word={this.props.word} />
                                                {
                                                    item.regions && item.regions.length > 0 &&
                                                        <small className="weak pull-right"> Region: {item.regions[0].text} </small>
                                                }
                                            </li>
                                        ))}
                                    </CollapsableList>
                                </ol>
                            ))}
                            </>
                        ))
                    }
                </p>
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
                    <>
                        <span> { ("dt" in i[1]) && i[1].dt[0][1]} </span>
                        {("sdsense" in i[1]) && <span> {i[1].sdsense.sd} &nbsp; {i[1].sdsense.dt[0][1]} </span> }
                    </>
                );
            case "pseq":
                return (
                    <ol type="1">
                        {i[1].map(this.showDefinition)}
                    </ol>
                );
            default:
                return <ConsoleLog>{i}</ConsoleLog>;
        }
    }

    render() {
        const HeadWord = R.pathOr(false, ["hwi", "hw"], this.props.item);
        const Pronun = R.pathOr(false, ["hwi", "prs", 0, "mw"], this.props.item);
        const Sound = R.pathOr(false, ["hwi", "prs", 0, "sound"], this.props.item);
        const Ins = R.pathOr([], ["hwi", "ins"], this.props.item);
        const Def = R.pathOr([], ["def"], this.props.item);
        const Origin = R.pathOr(false, ["et", 0, 1], this.props.item);
        const From = R.pathOr(false, ["date"], this.props.item);
        return (
            <>
            <hr/>
            <p className="fl">
                {HeadWord && <span> {HeadWord} </span>}
                &nbsp;
                <span>| { this.props.item.fl } |</span>
                &nbsp;
                {Pronun && <span> \{Pronun}\ </span>}
                {Sound && <AudioPlayer src={secrets.websterSoundBaseUrl + Sound.audio[0] + "/" + Sound.audio + ".wav"} />}
            </p>
            <p>
                {Ins.length>0 && Ins.map(item => (<span>{item.il}: {item.if}</span>))}
            </p>
            {Def.length > 0 && Def.map(def => (
                <>
                    <span>{def.vd}</span>
                    <ol type="1">
                        {def.sseq.map(item=> (<li>{item.map(this.showDefinition)}</li>))}
                    </ol>
                </>
            ))}
            <Comment>
                <p class="short-definition">
                    <ol>
                        {("shortdef" in this.props.item) 
                            && this.props.item.shortdef.map(item=> (<li> {item} </li>))}
                    </ol>
                </p>
            </Comment>
            <p class="other-word">
                {("uros" in this.props.item.meta) && this.props.item.meta.uros.map(item => (
                    <div>
                        {item.fl}
                        {item.ure} \{item.prs[0].mw}\
                    </div>
                ))}
            </p>
            <p class="meta">
                {this.props.item.meta.stems.map(stem => (<span>{stem}&nbsp;</span>))}
            </p>
            <p class="origin">
                { Origin && <div> Origin: {Origin} </div> }
                { From && <div> First known use: {From} </div> }
            </p>
            </>
        )
    }
}

class WebsterResult extends Component {
    render() {
        if (!this.props.result || this.props.result.length === 0) {
            return null;
        }
        return (
            <Card>
                <Card.Header> Merriam Webster </Card.Header>
                <Card.Body>
                    <Card.Title>
                        <span class="title"> {this.props.text} </span>
                    </Card.Title>
                    <Card.Text>
                        <CollapsableList>
                            {this.props.result.map(
                                item => <WebsterDefinitionSection item={item}/>
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
