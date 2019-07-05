import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { checkIfMandarin } from '../utils';


const Towards = ({ isMandarin }) => {
    return (
        <span className="pull-right">
            Language: { isMandarin ? 'Chinese => English' : 'English => Chinese' }
        </span>
    )
}

export default class StatusIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            this.props.currentText &&
            <Container fluid={true}>
                <Row>
                    <Col sm={4} lg={4}>
                        <span>
                            Length: {this.props.currentText ? this.props.currentText.length : 0}/5000
                        </span>
                    </Col>
                    <Col sm={4} lg={4}>
                        <span textAlign={ "center" }>
                            {this.props.isLoading ? "isLoading" : this.props.isSuccess ? "Yes" : "No"}
                        </span>
                    </Col>
                    <Col sm={4} lg={4}>
                        <Towards isMandarin={checkIfMandarin(this.props.currentText)} />
                    </Col>
                </Row>
            </Container>
        );
    }
}
