import React, { Component, Fragment } from 'react';

import { Row, Col } from 'react-bootstrap';
import { Card, ListGroupItem } from 'react-bootstrap';

import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    TranslationCard, TranslationCardItems,
    TranslationCardWithFullscreenAbility,
} from '../utils';

/**
 * Google Translation Card, use for display google translation result
 */
const GoogleResult = props => (<TranslationCard header="Google" title={props.result} />);

const BaiduResult = props => (<TranslationCard header="Baidu" title={props.result} />);

const AmazonResult = props => ( <TranslationCard header="Amazon" title={props.result} />);

const BingResult = ({ result }) => {
    if (!result) return false;
    const { dictionary, translation } = result;
    return (
        <TranslationCardWithFullscreenAbility header="Bing" title={translation}>
            {dictionary && dictionary.length > 0 &&
                dictionary.map((explain, index) => (<BingExample key={index} explain={explain} />))
            }
        </TranslationCardWithFullscreenAbility>
    );
}

class BingExample extends Component {
    state = {
        isExpanded: false,
    }

    onClick = () => {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    render() {
        const { explain, } = this.props;
        return (
            <Fragment>
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
            </Fragment>
        );
    }
}

const YoudaoResult = ({ result }) => {
    if (!result) return false;
    const {basic, web, translation} = result;
    return (
        <TranslationCardWithFullscreenAbility header="Youdao" title={translation && translation[0]}>
            {basic && basic.phonetic &&
                <Card.Body>
                    <Card.Title> Pronounciation </Card.Title>
                    <Card.Text>
                        /{basic.phonetic}/ &nbsp; { basic["uk-phonetic"] && <Fragment>
                            UK: /{basic["uk-phonetic"]}/ &nbsp; US: /{basic["us-phonetic"]}/
                            </Fragment> }
                    </Card.Text>
                </Card.Body>
            }
            <TranslationCardItems
                title="Basic" items={basic && basic.explains}
                renderMethod={(item, index) => (<ListGroupItem key={index}>{item}</ListGroupItem>)}
            />
            <TranslationCardItems
                title="Web" items={web}
                renderMethod={item => (
                    <ListGroupItem>
                        {item.key}: {item.value.map((v, index) => (
                            <small key={index}> {v} &nbsp; </small>
                        ))}
                    </ListGroupItem>
                )}
            />
        </TranslationCardWithFullscreenAbility>
    );
}

const Result = {
    GoogleResult: GoogleResult,
    BaiduResult: BaiduResult,
    AmazonResult: AmazonResult,
    YoudaoResult: YoudaoResult,
    BingResult: BingResult,
}

export default Result;
