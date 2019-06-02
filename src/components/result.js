import React, { Component } from 'react';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';


export class GoogleResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return ( this.props.google.result && 
            <Card>
                <Card.Header>Google Translate</Card.Header>
                <Card.Body>
                    <Card.Title> {this.props.google.result} </Card.Title>
                </Card.Body>
            </Card>
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
        if (!this.props.youdao.result) {
            return null;
        }
        let translation, basic, web;
        const basicInfo = this.props.youdao.result.basic;
        const webInfo = this.props.youdao.result.web;
        return (
            <Card>
                <Card.Header>Youdao Translate</Card.Header>
                <Card.Body>
                    <Card.Title> 
                        {this.props.youdao.result.translation && this.props.youdao.result.translation[0]}
                    </Card.Title>
                </Card.Body>
                {this.props.youdao.result.basic && this.props.youdao.result.basic.phonetic &&
                    <Card.Body>
                        <Card.Text>
                            /{basicInfo.phonetic}/ &nbsp;
                            UK: /{basicInfo["uk-phonetic"]}/ &nbsp;
                            US: /{basicInfo["us-phonetic"]}/
                        </Card.Text>
                    </Card.Body>
                }
                <Card.Body>
                    <Card.Title> Basic </Card.Title>
                    {this.props.youdao.result.basic &&
                        <ListGroup className="list-group-flush">
                            {basicInfo.explains.map(explain => (<ListGroupItem>{explain}</ListGroupItem>))}
                        </ListGroup>
                    }
                </Card.Body>
                <Card.Body>
                    <Card.Title> Web </Card.Title>
                    {this.props.youdao.result.web &&
                        <ListGroup className="list-group-flush">
                            {webInfo.map(
                                info => (<ListGroupItem>{info.key}: {info.value.map(v => (<small>{v} &nbsp;</small>))}</ListGroupItem>))
                            }
                        </ListGroup>
                    }
                </Card.Body>
            </Card>
        );
    }
}
