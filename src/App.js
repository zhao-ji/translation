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

import { LoadingWrapper, ErrorBoundary } from './utils';
import './css/_custom.css';

class App extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Input
                    cache={this.props.utils.cache}
                    cleanCache={this.props.cleanCache}
                    currentText={this.props.utils.currentText}
                    setCurrentText={this.props.setCurrentText}
                    fetchSuggestion={this.props.fetchSuggestion}
                    googleTranslate={this.props.googleTranslate}
                    baiduTranslate={this.props.baiduTranslate}
                    youdaoTranslate={this.props.youdaoTranslate}
                    bingTranslate={this.props.bingTranslate}
                    amazonTranslate={this.props.amazonTranslate}
                    urbanTranslate={this.props.urbanTranslate}
                    oxfordTranslate={this.props.oxfordTranslate}
                    oxfordFetchExamples={this.props.oxfordFetchExamples}
                    websterTranslate={this.props.websterTranslate}
                    cleanEnEnResult={this.props.cleanEnEnResult}
                    record={this.props.record}
                />
                <Row noGutters={true}>
                    <Col lg={4} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.google.isLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.google.text}
                            >
                            <Result.GoogleResult result={this.props.translation.google.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={4} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.baidu.isLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.baidu.text}
                            >
                            <Result.BaiduResult result={this.props.translation.baidu.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={4} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.amazon.isLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.amazon.text}
                            >
                            <Result.AmazonResult result={this.props.translation.amazon.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.youdao.isLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.youdao.text}
                            >
                            <Result.YoudaoResult result={this.props.translation.youdao.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.bing.isTranslationLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.bing.text}
                            >
                                <ErrorBoundary>
                                    <Result.BingResult result={this.props.translation.bing.result}/>
                                </ErrorBoundary>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.webster.isLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.webster.text}
                            >
                                <ErrorBoundary>
                                    <EnResult.WebsterResult result={this.props.translation.webster.result} />
                                </ErrorBoundary>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.oxford.isLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.oxford.text}
                            >
                                <ErrorBoundary>
                                    <EnResult.OxfordResult
                                        result={this.props.translation.oxford.result}
                                        examples={this.props.translation.oxfordExamples}
                                        text={this.props.utils.currentText}
                                    />
                                </ErrorBoundary>
                        </LoadingWrapper>
                    </Col>
                    <Col lg={6} sm={12}>
                        <LoadingWrapper
                            loading={this.props.translation.urban.isTranslationLoading}
                            currentText={this.props.utils.currentText}
                            resultText={this.props.translation.urban.text}
                            >
                            <EnResult.UrbanResult result={this.props.translation.urban.result}/>
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
