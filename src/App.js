import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { translationActions } from './actions/translationAction'
import { recordActions } from './actions/recordAction'

import { Input } from './components/input';
import { GoogleResult, BaiduResult, YoudaoResult, BingResult } from './components/result';

import { debounce } from './utils';
import './css/_custom.css';

class App extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Row noGutters={true}>
                    <Col sm={12} lg={12}>
                        <Input
                            googleTranslate={debounce(this.props.googleTranslate, 500)}
                            baiduTranslate={debounce(this.props.baiduTranslate, 500)}
                            bingTranslate={debounce(this.props.bingTranslate, 500)}
                            youdaoTranslate={debounce(this.props.youdaoTranslate, 500)}
                            record={debounce(this.props.record, 500)}
                        />
                    </Col>
                </Row>
                <Row noGutters={true}>
                    <Col sm={12} lg={6}>
                        <GoogleResult
                            result={this.props.translation.google.result}
                        />
                        <BingResult
                            result={this.props.translation.bing.result}
                        />
                    </Col>
                    <Col sm={12} lg={6}>
                        <BaiduResult
                            result={this.props.translation.baidu.result}
                        />
                        <YoudaoResult
                            result={this.props.translation.youdao.result}
                        />
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
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(App);
