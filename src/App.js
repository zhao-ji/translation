import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { translationActions } from './actions/translationAction'
import { recordActions } from './actions/recordAction'

import { Input } from './components/input';
import { GoogleResult, YoudaoResult } from './components/result';

class App extends Component {
    render() {
        return (
            <Container fluid={true}>
                <Row>
                    <Col sm={6} lg={6}>
                        <Input
                            googleTranslate={this.props.googleTranslate}
                            youdaoTranslate={this.props.youdaoTranslate}
                            record={this.props.record}
                        />
                    </Col>
                    <Col sm={6} lg={6}>
                        <GoogleResult 
                            google={this.props.translation.google}
                        />
                        <YoudaoResult 
                            youdao={this.props.translation.youdao}
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
