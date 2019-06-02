import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Row, Col } from 'react-bootstrap';

import { actions } from './actions/translationAction'

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

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
