import React, { Component, Fragment } from 'react';

import { Row, Col } from 'react-bootstrap';
import { Card, ListGroupItem } from 'react-bootstrap';

import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    TranslationCardItems,
    TranslationCardWithFullscreenAbility,
    TranslationCardWithClipboard,
} from '../utils';

/**
 * Google Translation Card, use for display google translation result
 */
const GoogleResult = props => (<TranslationCardWithClipboard header="Google" {...props} />);

const BaiduResult = props => (<TranslationCardWithClipboard header="Baidu" {...props} />);

const DeeplResult = props => (<TranslationCardWithClipboard header="Deepl" {...props} />);

const AmazonResult = props => (<TranslationCardWithClipboard header="Amazon" {...props} />);

const CaiyunResult = props => (<TranslationCardWithClipboard header="Caiyun" {...props} />);

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
                renderMethod={item => (<ListGroupItem>{item}</ListGroupItem>)}
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
    DeeplResult: DeeplResult,
    AmazonResult: AmazonResult,
    CaiyunResult: CaiyunResult,
    YoudaoResult: YoudaoResult,
    BingResult: BingResult,
}

export default Result;
