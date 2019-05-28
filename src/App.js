import React, { Component } from 'react';
import { connect } from 'react-redux';

import './App.css';

import { googleTranslate } from './actions/translationAction'

import { Input } from './components/input';
import { Result } from './components/result';

class App extends Component {
    simpleAction = (event) => {
        this.props.googleTranslate()
    }

    translate = (text) => {
        this.props.googleTranslate(text);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Input translate={this.translate} />
                    <Result 
                        google={this.props.google}
                    />
                    <br />
                    <br />
                    <br />
                    <button onClick={this.simpleAction}>Test redux action</button>
                    <pre>
                        {
                            JSON.stringify(this.props)
                        }
                    </pre>
                </header>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    ...state
})

const mapDispatchToProps = dispatch => ({
    googleTranslate: () => dispatch(googleTranslate())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
