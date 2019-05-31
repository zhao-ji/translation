import React, { Component } from 'react';


export class GoogleResult extends Component {
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

export class YoudaoResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        console.log(this.props.youdao);
        if (!this.props.youdao.result) {
            return null;
        }
        let translation, basic, web;
        if (this.props.youdao.result.translation) {
            translation = (
                <div>
                    <span>{this.props.youdao.result.translation[0]}</span>
                </div>
            );
        }
        if (this.props.youdao.result.basic) {
            const basicInfo = this.props.youdao.result.basic;
            basic = (
                <div>
                    <span>Pronounciation: {basicInfo.phonetic}</span>
                    <br/>
                    <span>UK Pronounciation: {basicInfo["uk-phonetic"]}</span>
                    <br/>
                    <span>US Pronounciation: {basicInfo["us-phonetic"]}</span>
                    <br/>
                    {basicInfo.explains.map(explain => (<span>{explain}<br/></span>))}
                </div>
            );
        }
        if (this.props.youdao.result.web) {
            const webInfo = this.props.youdao.result.web;
            web = (
                <div>
                {webInfo.map(
                    info => (
                        <span>
                        {info.key}: {
                                        info.value.map(v => (<small>{v} &nbsp;</small>))
                                    }<br/>
                                    </span>
                        )
                    )}
                </div>
            );
        }
        return (
            <div>
                <div>{translation}</div>
                <div>{basic}</div>
                <div>{web}</div>
            </div>
        );
    }
}
