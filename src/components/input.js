import React, { Component } from 'react';

const englishRegex = /^[A-Za-z0-9]*$/;

const Towards = (text) => (
    <span>
        Language: 
        {
            englishRegex.test(text) ? 'English => Madarine': 'Madarine => English'
        }
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
        this.props.translate(event.target.value);
    }

    render() {
        return (
            <div>
                <textarea
                    value={this.state.value} onChange={this.handleChange}
                    autocomplete={false} autofocus
                    cols="20" rows="5"
                    minlength="2"
                    placeholder="Please write what you want to translate."
                />
                {
                    this.state.value &&
                        <div>
                            <span>Length: {this.state.value ? this.state.value.length : 0}/5000</span>
                            <Towards text={this.state.value} />
                        </div>
                }
            </div>
        );
    }
}
