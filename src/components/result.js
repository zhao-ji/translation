import React, { Component } from 'react';


export class Result extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div>
                <span>{this.props.google.result}</span>
            </div>
        );
    }
}
