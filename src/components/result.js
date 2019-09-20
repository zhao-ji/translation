import React, { Component } from 'react';

import { Row, Col } from 'react-bootstrap';
import { Card, ListGroupItem } from 'react-bootstrap';

import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { TranslationCard, TranslationCardItems } from '../utils';


const GoogleResult = props => (<TranslationCard header="Google" title={props.result} />);

const BaiduResult = props => (<TranslationCard header="Baidu" title={props.result} />);

const AmazonResult = props => ( <TranslationCard header="Amazon" title={props.result} />);

class BingResult extends Component {
    render() {
        if (!this.props.result) {
            return null;
        }
        const dictionary = this.props.result.dictionary;
        return (
            <TranslationCard header="Bing" title={this.props.result.translation}>
                <Card.Body>
                    <Card.Title> Dictionary Lookup </Card.Title>
                    {dictionary && dictionary.length > 0 && 
                        dictionary.map((explain, index) => (<BingExample key={index} explain={explain} />))
                    }
                </Card.Body>
            </TranslationCard>
        );
    }
}

class BingExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isExpanded: false,
        }
    }

    onClick = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    render() {
        const explain = this.props.explain;
        return (
            <>
            <hr />
            {explain.displayTarget}. <i className="bing-category">{explain.posTag.toLowerCase()}</i>
            {explain.examples && explain.examples.length > 0 &&
                <FontAwesomeIcon className="float-right"
                    onClick={this.onClick} size="lg"
                    icon={this.state.isExpanded ? faMinusSquare : faPlusSquare}
                />
            }
            {this.state.isExpanded && explain.examples.map((item, iIndex) => (
                <Row className="mt-3" index={iIndex}>
                    <Col lg={6} sm={12}>
                        {item.sourcePrefix} <mark> {item.sourceTerm} </mark> {item.sourceSuffix}:
                    </Col>
                    <Col lg={6} sm={12}>
                        {item.targetPrefix} <mark> {item.targetTerm} </mark> {item.targetSuffix}
                    </Col>
                </Row>
            ))}
            </>
        );
    }
}

class YoudaoResult extends Component {
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
    AmazonResult: AmazonResult,
    YoudaoResult: YoudaoResult,
    BingResult: BingResult,
}

export default Result;
