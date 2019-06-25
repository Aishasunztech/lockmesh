import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button
} from "antd";

import { one_month, three_month, six_month, twelve_month } from '../../../../constants/Constants';

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
            if (value > 0) {

                if (value && fieldName && this.props.price_for) {
                    this.props.setPrice(fieldName, value, this.props.price_for);
                }
                this.props.form.setFieldsValue({ [fieldName]: '' })
            }
        }

    }

    render() {
        console.log(this.props.innerTabData, 'props are')

        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={13}>
                        <Form.Item label="1 MONTH"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(one_month, {

                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(one_month)} >Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: ${this.props.innerTabData ? this.props.innerTabData[one_month] ? this.props.innerTabData[one_month] : 0 : 0}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <Form.Item label="3 MONTH" labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(three_month, {

                            })(<Input type='number' min={0} />)}


                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(three_month)} >Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: ${this.props.innerTabData ? this.props.innerTabData[three_month] ? this.props.innerTabData[three_month] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="6 MONTH" labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(six_month, {

                            })(<Input type='number' min={0} />)}


                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(six_month)}>Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: ${this.props.innerTabData ? this.props.innerTabData[six_month] ? this.props.innerTabData[six_month] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="12 MONTH" labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(twelve_month, {

                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(twelve_month)}>Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: ${this.props.innerTabData ? this.props.innerTabData[twelve_month] ? this.props.innerTabData[twelve_month] : 0 : 0}</h4>
                    </Col>
                </Row>

            </Form>
        )
    }
}

PricingForm = Form.create()(PricingForm);

export default PricingForm