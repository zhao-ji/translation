import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { translationActions } from './actions/translationAction'
import { recordActions } from './actions/recordAction'
import { utilsActions } from './actions/utilsAction'

import Input from './components/input';
import OxfordResult from './components/oxfordResult';
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
                    record={this.props.record}
                />
                <Row noGutters={true}>
                    <Col sm={12} lg={6}>
                        <LoadingWrapper
                            loading={this.props.translation.oxfordTranslation.isLoading}
                            match={this.props.translation.oxfordTranslation.text === this.props.utils.currentText}>
                            <OxfordResult.TranslationResult result={this.props.translation.oxfordTranslation.result}/>
                        </LoadingWrapper>
                        <LoadingWrapper
                            loading={this.props.translation.google.isLoading}
                            match={this.props.translation.google.text === this.props.utils.currentText}>
                            <Result.GoogleResult result={this.props.translation.google.result}/>
                        </LoadingWrapper>
                        <LoadingWrapper
                            loading={this.props.translation.bing.isTranslationLoading}
                            match={this.props.translation.bing.text === this.props.utils.currentText}>
                            <Result.BingResult result={this.props.translation.bing.result}/>
                        </LoadingWrapper>
                    </Col>
                    <Col sm={12} lg={6}>
                        <LoadingWrapper
                            loading={this.props.translation.baidu.isLoading}
                            match={this.props.translation.baidu.text === this.props.utils.currentText}>
                            <Result.BaiduResult result={this.props.translation.baidu.result}/>
                        </LoadingWrapper>
                        <LoadingWrapper
                            loading={this.props.translation.youdao.isLoading}
                            match={this.props.translation.youdao.text === this.props.utils.currentText}>
                            <Result.YoudaoResult result={this.props.translation.youdao.result}/>
                        </LoadingWrapper>
                        <LoadingWrapper
                            loading={this.props.translation.oxfordExamples.isLoading}
                            match={this.props.translation.oxfordExamples.text === this.props.utils.currentText}>
                            <OxfordResult.ExamplesResult result={this.props.translation.oxfordExamples.result}/>
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
