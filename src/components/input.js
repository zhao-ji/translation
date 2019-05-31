import React, { Component } from 'react';

const englishRegex = /^[A-Za-z0-9\n\s]*$/;

const Towards = (isEnglish) => (
    <span>
        <small>
            Language: 
            {
                isEnglish ? 'English => Madarine': 'Madarine => English'
            }
        </small>
    </span>
)

export class Input extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null
        }

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
        if (this.checkIfEnglish(event.target.value)) {
            this.props.googleTranslate({
                text: event.target.value,
                origin: "english",
                destination: "manderin",
            });
        } else {
            this.props.googleTranslate({
                text: event.target.value,
                origin: "manderin",
                destination: "english",
            });
        }
        this.props.youdaoTranslate({
            text: event.target.value,
        });
    }

    checkIfEnglish(text) {
        return englishRegex.test(text); 
    }

    render() {
        return (
            <div>
                <textarea
                    value={this.state.value || ""} onChange={this.handleChange}
                    autoComplete="false" autoFocus
                    cols="100" rows="20"
                    minLength="2"
                    placeholder="Please write what you want to translate."
                />
                {
                    this.state.value &&
                        <div>
                            <span><small>Length: {this.state.value ? this.state.value.length : 0}/5000</small></span>
                            <br />
                            <br />
                            <br />
                            <Towards isEnglish={this.checkIfEnglish(this.state.value)} />
                        </div>
                }
            </div>
        );
    }
}
