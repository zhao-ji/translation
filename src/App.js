import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { translationActions } from './actions/translationAction'
import { recordActions } from './actions/recordAction'

import { Input } from './components/input';
import { GoogleResult, BaiduResult, YoudaoResult, BingResult } from './components/result';
import { debounce } from './utils';

class App extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={12} lg={5}>
                        <Input
                            googleTranslate={debounce(this.props.googleTranslate, 250)}
                            baiduTranslate={debounce(this.props.baiduTranslate, 250)}
                            youdaoTranslate={debounce(this.props.youdaoTranslate, 250)}
                            bingTranslate={debounce(this.props.bingTranslate, 250)}
                            record={debounce(this.props.record, 250)}
                        />
                    </Col>
                    <Col sm={12} lg={7}>
                        <GoogleResult
                            result={this.props.translation.google.result}
                        />
                        <BaiduResult
                            result={this.props.translation.baidu.result}
                        />
                        <YoudaoResult
                            result={this.props.translation.youdao.result}
                        />
                        <BingResult
                            result={this.props.translation.bing.result}
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
