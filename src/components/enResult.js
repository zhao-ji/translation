import React, { Component } from 'react';

import { Card } from 'react-bootstrap';
import { faVolumeUp, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ConsoleLog } from '../utils';

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
                    <a href="https://www.lexico.com/en/grammar/key-to-pronunciation" target="_blank">
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
        const word = this.props.result[0].id;
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
                        <span class="title"> {word} </span>
                    </Card.Title>
                    <Card.Text>
                        {this.props.result[0].lexicalEntries.map(
                            lexicalEntry => <DefinitionSection lexicalEntry={lexicalEntry} />
                        )}
                        {origin && <OriginSection origin={origin} />}
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

class WebsterDefinitionSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        this.renderDefinition = this.renderDefinition.bind(this);
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
                    <>
                        {i[1].map(this.showDefinition)}
                    </>
                );
            default:
                console.log(i);
                return false;
        }
    }

    renderDefinition(i) {
        return (
            <li>
                {this.showDefinition(i)}
            </li>
        );
    }

    render() {
        return (
            <>
                <hr/>
                <p class="fl">
                    { this.props.item.fl}
                </p>
            {
                ("prs" in this.props.item.hwi) && 
                <p class="pronun">
                / {this.props.item.hwi.prs[0].mw} /
                </p>
            }
            {("ins" in this.props.item) && this.props.item.ins.map(item => (
                <p class="ins"> {item.il}: {item.if} </p>
            ))}
            <p class="meta">
                {this.props.item.meta.stems.map(stem => (<span>{stem}&nbsp;</span>))}
            </p>
            <ol>
                {("def" in this.props.item) && this.props.item.def[0].sseq.map(item=> (<li>
                    <ol>
                        {item.map(this.renderDefinition)}
                    </ol>
                </li>))}
            </ol>
            <p class="short-definition">
                <ol>
                    {("shortdef" in this.props.item) && this.props.item.shortdef.map(item=> (<li> {item} </li>))}
                </ol>
            </p>
                <p class="other-word">
                    {("uros" in this.props.item.meta) && this.props.item.meta.uros.map(item => (
                        <div>
                            {item.fl}
                            {item.ure} \{item.prs[0].mw}\
                        </div>
                    ))}
                </p>
            <p class="origin">
                <div>
                    Origin: {("et" in this.props.item) && this.props.item.et[0][1]}
                </div>
                <div>
                    First known use: {("date" in this.props.item) && this.props.item.date}
                </div>
            </p>
            </>
        )
    }
}

class NoMoreThan2Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExtended: false
        }

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({
            isExtended: !this.state.isExtended
        })
    }

    render() {
        if (this.props.children.length < 3) {
            return (
                <>{this.props.children}</>
            );
        }
        if (this.state.isExtended) {
            return (
                <>
                <div>
                    <button className="pull-right" onClick={this.handleClick}> Collapse </button>
                </div>
                {this.props.children}
                </>
            );
        }
        return (
            <>
                {this.props.children.slice(0, 2)}
                <div>
                    <button className="pull-right" onClick={this.handleClick}> Show More </button>
                </div>
            </>
        );
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
                    <Card.Text>
                        <NoMoreThan2Display>
                            {this.props.result.map(
                                item => <WebsterDefinitionSection item={item} />
                            )}
                        </NoMoreThan2Display>
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
