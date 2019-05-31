import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import './App.css';

import { actions } from './actions/translationAction'

import { Input } from './components/input';
import { Result } from './components/result';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Input
                        googleTranslate={this.props.googleTranslate}
                    />
                    <Result 
                        google={this.props.translation.google}
                    />
                </header>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
});

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
