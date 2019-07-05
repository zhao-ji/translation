import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { translationActions } from './actions/translationAction'
import { recordActions } from './actions/recordAction'
import { utilsActions } from './actions/utilsAction'

import Input from './components/input';
import StatusIndicator from './components/status';
import OxfordResult from './components/oxfordResult';
import Result from './components/result';

import { LoadingWrapper } from './utils';
import './css/_custom.css';

class App extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col sm={12} lg={12}>
                        <Input
                            googleTranslate={this.props.googleTranslate}
                            googleTranslateFromCache={this.props.googleTranslateFromCache}
                            baiduTranslate={this.props.baiduTranslate}
                            baiduTranslateFromCache={this.props.baiduTranslateFromCache}
                            bingTranslate={this.props.bingTranslate}
                            bingTranslateFromCache={this.props.bingTranslateFromCache}
                            youdaoTranslate={this.props.youdaoTranslate}
                            youdaoTranslateFromCache={this.props.youdaoTranslateFromCache}
                            oxfordTranslate={this.props.oxfordTranslate}
                            oxfordTranslateFromCache={this.props.oxfordTranslateFromCache}
                            oxfordFetchExamples={this.props.oxfordFetchExamples}
                            oxfordFetchExamplesFromCache={this.props.oxfordFetchExamplesFromCache}
                            setCurrentText={this.props.setCurrentText}
                            record={this.props.record}
                            cleanCache={this.props.cleanCache}
                            cache={this.props.utils.cache}
                        />
                        <StatusIndicator
                            currentText={this.props.utils.currentText}
                            isLoading={this.props.recordResult.isLoading}
                            isSuccess={this.props.recordResult.isSuccess}
                        />
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col sm={12} lg={6}>
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
                        <LoadingWrapper
                            loading={this.props.translation.oxfordTranslation.isLoading}
                            match={this.props.translation.oxfordTranslation.text === this.props.utils.currentText}>
                            <OxfordResult.TranslationResult result={this.props.translation.oxfordTranslation.result}/>
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
