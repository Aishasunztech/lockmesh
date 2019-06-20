import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button
} from "antd";

import {one_month, three_month, six_month, twelve_month} from '../../../../constants/Constants';

class PricingForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            one_month: 0,
            three_month: 0,
            six_month: 0,
            twelve_month: 0
        }
    }

    setPrice = (fieldName) => {
        // let value = e.target.value;
        if (fieldName) {
            let value = this.props.form.getFieldValue(fieldName)
            if(value && fieldName && this.props.price_for){
                this.props.setPrice(value, fieldName, this.props.price_for);
            }
         
            this.setState({
                [fieldName]: value
            })
        }

    }

    render() {
        // console.log(this.props, 'props are')
        const formItemLayout = {
            labelCol: {
                xs: { span: 24, offset: 2 },
                sm: { span: 10, offset: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={13}>
                        <Form.Item label="1 MONTH"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(one_month, {
                              
                            })(<Input type='number' />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button   type="primary" onClick={() => this.setPrice(one_month)} >Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: {this.state[one_month] ? this.state[one_month] : 0}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <Form.Item label="3 MONTH" labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(three_month, {
                             
                            })(<Input type='number' />)}


                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button   type="primary" onClick={() => this.setPrice(three_month)} >Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: {this.state[three_month] ? this.state[three_month] : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="6 MONTH" labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(six_month, {
                              
                            })(<Input type='number' />)}


                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button   type="primary" onClick={() => this.setPrice(six_month)}>Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: {this.state[six_month] ? this.state[six_month] : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="12 MONTH" labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(twelve_month, {
                              
                            })(<Input type='number' />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button   type="primary" onClick={() => this.setPrice(twelve_month)}>Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: {this.state[twelve_month] ? this.state[twelve_month] : 0}</h4>
                    </Col>
                </Row>

            </Form>
        )
    }
}

PricingForm = Form.create()(PricingForm);

export default PricingForm