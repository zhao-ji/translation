import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { translationActions } from './actions/translationAction'
import { recordActions } from './actions/recordAction'
import { utilsActions } from './actions/utilsAction'

import Input from './components/input';
import EnResult from './components/enResult';
import Result from './components/result';

import { LoadingWrapper } from './utils';
import './css/_custom.css';

class App extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Input
                    setCurrentText={this.props.setCurrentText}
                    cleanCache={this.props.cleanCache}
                    fetchSuggestion={this.props.fetchSuggestion}
                    cache={this.props.utils.cache}
                    currentText={this.props.utils.currentText}
                    googleTranslate={this.props.googleTranslate}
                    baiduTranslate={this.props.baiduTranslate}
                    bingTranslate={this.props.bingTranslate}
                    youdaoTranslate={this.props.youdaoTranslate}
                    oxfordTranslate={this.props.oxfordTranslate}
                    oxfordFetchExamples={this.props.oxfordFetchExamples}
                    websterTranslate={this.props.websterTranslate}
                    record={this.props.record}
                />
                <Row noGutters={true}>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.google.isLoading}
                            match={this.props.translation.google.text === this.props.utils.currentText}>
                            <Result.GoogleResult result={this.props.translation.google.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.baidu.isLoading}
                            match={this.props.translation.baidu.text === this.props.utils.currentText}>
                            <Result.BaiduResult result={this.props.translation.baidu.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.youdao.isLoading}
                            match={this.props.translation.youdao.text === this.props.utils.currentText}>
                            <Result.YoudaoResult result={this.props.translation.youdao.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.bing.isTranslationLoading}
                            match={this.props.translation.bing.text === this.props.utils.currentText}>
                            <Result.BingResult result={this.props.translation.bing.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.webster.isLoading}
                            match={this.props.translation.webster.text === this.props.utils.currentText}>
                            <EnResult.WebsterResult
                                result={this.props.translation.webster.result}
                                text={this.props.utils.currentText}
                            />
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.oxford.isLoading}
                            match={this.props.translation.oxford.text === this.props.utils.currentText}>
                            <EnResult.OxfordResult
                                result={this.props.translation.oxford.result}
                                examples={this.props.translation.oxfordExamples}
                                text={this.props.utils.currentText}
                            />
                        </LoadingWrapper>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        ...translationActions,
        ...recordActions,
        ...utilsActions,
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
