import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button
} from "antd";

import { one_month, three_month, six_month, twelve_month } from '../../../../constants/Constants';

import {
    Button_SET,
} from '../../../../constants/ButtonConstants'
import {
    PRICE,
} from '../../../../constants/AccountConstants'
import { convertToLang } from '../../../utils/commonUtils';

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
        console.log(this.props.innerTabData, 'props are for inner tab data')

        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={13}>
                        <Form.Item label= {convertToLang(this.props.translation[one_month], one_month)}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(one_month, {

                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(one_month)} >{convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], PRICE)} : ${this.props.innerTabData ? this.props.innerTabData[one_month] ? this.props.innerTabData[one_month] : 0 : 0}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[three_month], three_month)} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(three_month, {

                            })(<Input type='number' min={0} />)}


                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(three_month)} >{convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], PRICE)} : ${this.props.innerTabData ? this.props.innerTabData[three_month] ? this.props.innerTabData[three_month] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[six_month], six_month)} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(six_month, {

                            })(<Input type='number' min={0} />)}


                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(six_month)}>{convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], PRICE)} : ${this.props.innerTabData ? this.props.innerTabData[six_month] ? this.props.innerTabData[six_month] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[twelve_month], twelve_month)} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator(twelve_month, {

                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(twelve_month)}>{convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], PRICE)} : ${this.props.innerTabData ? this.props.innerTabData[twelve_month] ? this.props.innerTabData[twelve_month] : 0 : 0}</h4>
                    </Col>
                </Row>

            </Form>
        )
    }
}

PricingForm = Form.create()(PricingForm);

export default PricingForm