import React, { Component } from 'react';
import { connect } from 'react-redux';

import logo from './logo.svg';
import './App.css';

import { googleTranslate } from './actions/translationAction'

const mapStateToProps = state => ({
    ...state
})

const mapDispatchToProps = dispatch => ({
    googleTranslate: () => dispatch(googleTranslate())
})

class App extends Component {

    simpleAction = (event) => {
        this.props.googleTranslate()
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
