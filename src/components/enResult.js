import React, { Component, Fragment } from 'react';

import { Card } from 'react-bootstrap';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as R from 'ramda'

import { secrets } from '../actions/secrets';
import {
    CollapsableList, ConsoleLog,
    LoadingWrapper, starReplace,
    TranslationCard, TranslationCardWithFullscreenAbility,
    TagResolver, UrbanDictionaryTagResolver, AudioPlayer,
} from '../utils';


const Example = ({ text, word }) => {
    let parts = text.split(new RegExp(`(${word})`, 'gi'));
    return parts.map((part, index) =>
        part.toLowerCase() === word.toLowerCase()
        ? <mark key={index}>{part}</mark>
        : part
    );
}

const ExampleSection = ({ examples, word }) => {
    let entries = Array.prototype.concat(...examples.map(example => example.lexicalEntries));
    return (
        <Fragment>
        <hr/>
        <h3 className="other-aspect">Examples</h3>
        <div className="other-aspect-body">
            {entries.map((entry, index1) => (
                <ol key={index1}>
                    <h5 className="example-category">{entry.lexicalCategory.text}</h5>
                    <CollapsableList>
                        {entry.sentences.map((item, index) => (
                            <li key={index}>
                                <Example text={item.text} word={word} />
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
        </div>
        </Fragment>
    );
}

const OriginSection = ({ origin }) => (<Fragment>
    <hr/>
    <h3 className="other-aspect">Origin</h3>
    <p className="other-aspect-body"> {origin} </p>
</Fragment>);

const PronunciationSection = ({ word, items }) => (<Fragment>
    <hr/>
    <h3 className="other-aspect">
        Pronunciation
        <a
            href="https://www.lexico.com/en/grammar/key-to-pronunciation"
            rel="noopener noreferrer" target="_blank">
            <FontAwesomeIcon icon={faQuestionCircle} size="xs"/>
        </a>
    </h3>
    <p className="other-aspect-body">
        {word}
        {items.map((item, index) => (
            <span key={index}>
                &nbsp; /{item.phoneticSpelling}/ <AudioPlayer src={item.audioFile} />
            </span>
        ))}
    </p>
</Fragment>);

const PronunciationSectionInEntry = ({ items }) => {
    if (!items) {
        return false
    }
    return items.map((item, index) => (
        <Fragment key={index}>
            /{item.phoneticSpelling}/ <AudioPlayer src={item.audioFile} />
        </Fragment>
    ));
}

const DefinitionSection = ({ lexicalEntry }) => {
    const entries = lexicalEntry.entries;
    let pronunciations = entries && entries.length > 0 && entries[0].pronunciations;
    return (
        <Fragment>
        <hr/>
        <h3>
            <span className="lexical-category">
                { lexicalEntry.lexicalCategory.text }
            </span>
            &nbsp; &nbsp;
            <span className="normal-font-in-h3">
                <PronunciationSectionInEntry items={pronunciations}/>
            </span>
        </h3>
        { lexicalEntry.entries.map((entry, index2) => (
            <ol type="1" key={index2}>
            {entry.senses.map((sense, index) => (
                <li key={index}>
                {sense.domains && sense.domains.length > 0 &&
                    <p className="note">{sense.domains[0].text}</p>
                }
                <p>
                    {
                        sense.notes && sense.notes.length > 0 &&
                            <span className="note">[{sense.notes[0].text}]</span>
                    }
                    {
                        sense.definitions && sense.definitions.length > 0 &&
                            <span className="definition">[{sense.definitions[0]}]</span>
                    }
                </p>
                {("examples" in sense) && sense.examples && sense.examples.length > 0 &&
                    sense.examples.map((example, index) => (
                    <Fragment key={index}>
                    {
                        ("notes" in example) && example.notes && example.notes.length > 0 &&
                        <span className="note">[{example.notes[0].text}]</span>
                    }
                        <span className="example"><em>{example.text}</em></span>
                    </Fragment>
                    ))
                }
                <ol type="1">
                    {sense.subsenses && sense.subsenses.length > 0 &&sense.subsenses.map((subsense, subIndex) => (
                        <li key={subIndex}>
                            {
                                ("definitions" in subsense) && subsense.definitions.length > 0
                                    ? <p className="definition">{subsense.definitions[0]}</p>
                                    : ("shortDefinitions" in subsense) && subsense.shortDefinitions.length > 0 &&
                                        <p className="definition"> short for {subsense.shortDefinitions[0]} </p>
                            }
                            {subsense.examples && subsense.examples.length > 0 && subsense.examples.map(
                                (example, index) => (
                                    <p key={index} className="example"><em>{example.text}</em></p>
                                )
                            )}
                        </li>
                    ))}
                </ol>
            </li>
            ))}
            </ol>
        ))}
        </Fragment>
    );
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
            <TranslationCardWithFullscreenAbility header={"Oxford"}>
                <Card.Title>
                    <span className="title"> {this.props.text} </span>
                </Card.Title>
                {pronunciation &&
                        <PronunciationSection word={this.props.text} items={pronunciation} />
                }
                {this.props.result[0].lexicalEntries.map(
                    (lexicalEntry, index) => <DefinitionSection key={index} lexicalEntry={lexicalEntry} />
                )}
                {origin && <OriginSection origin={origin} />}
                <LoadingWrapper
                    loading={this.props.examples.isLoading}
                    match={this.props.examples.text === this.props.text}>
                    <ExampleSection examples={this.props.examples.result} word={this.props.text} />
                </LoadingWrapper>
            </TranslationCardWithFullscreenAbility>
        );
    }
}

class WebsterDefinitionSection extends Component {
    showDefinition = (i) => {
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
                return <ConsoleLog>{i}</ConsoleLog>;
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
            <Fragment>
            <p>
                <span className="webster-head-word">{starReplace(HeadWord)}</span>
                <span className="webster-word-type"> { this.props.item.fl } </span>
            </p>
            <p className="pronun">
                {Pronun &&
                    <span>\{Pronun} {Sound && this.generateAudio(Sound)}\</span>
                }
            </p>
            {Ins.length>0 &&
                (<p>Different Shape: {Ins.map((item, index) =>
                    (<span key={index}><i className="webster-ins">{item.il}</i> {starReplace(item.if)}</span>)
                )}</p>)
            }
            {Def.length > 0 && Def.map(def => (
                <Fragment>
                <p>{def.vd}</p>
                <ol type="1">
                    {def.sseq.map(item=> (<li className="webster-definition-item">
                        <ul> {item.map(this.showDefinition)} </ul>
                    </li>))}
                </ol>
                </Fragment>
            ))}
            <p className="other-word">
                {Uros.length > 0 && Uros.map(item => (
                    <div>
                        {item.fl}
                        {item.ure} \{item.prs[0].mw}\
                    </div>
                ))}
            </p>
            {
                Stems.length > 0 &&
                <p className="meta"> Related Word: {Stems.map(stem => (<span>{stem}&nbsp;</span>))} </p>
            }
            <p>
                { Origin && <span> Origin: {TagResolver(Origin)} </span> }
            </p>
            <p>
                { From && <span> First Known Use: {TagResolver(From)} </span> }
            </p>
            <hr/>
            </Fragment>
        );
    }
}

function WebsterResult ({ result }) {
    if (!result || result.length === 0) {
        return false;
    }
    if (typeof result[0] === "string") {
        return false;
    }
    return (
        <TranslationCardWithFullscreenAbility header={"Merriam Webster"}>
            <CollapsableList>
                {result.map((item, index) =>
                    <WebsterDefinitionSection key={index} item={item} total={result.length}/>
                )}
            </CollapsableList>
        </TranslationCardWithFullscreenAbility>
    );
}

const UrbanResult = ({ result }) => {
    if (!result || result.length < 1 ) {
        return false;
    }
    const title = UrbanDictionaryTagResolver(result[0].definition);
    return <TranslationCard header="Urban Dictionary" title={title} />;
}

const EnResult = {
    UrbanResult: UrbanResult,
    OxfordResult: OxfordResult,
    WebsterResult: WebsterResult,
}

export default EnResult;
