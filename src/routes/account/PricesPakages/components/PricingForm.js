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
        // console.log(fieldName);
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
        // console.log(this.props.innerTabData, 'props are for inner tab data')

        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[one_month], "1 month")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('1 month', {

                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={3} className="p-0">
                        <Button type="primary" onClick={() => this.setPrice('1 month')} >{convertToLang(this.props.translation[Button_SET], "SET")} </Button>
                    </Col>
                    <Col span={7} className="pl-0">
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['1 month'] ? this.props.innerTabData['1 month'] : 0 : 0}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[three_month], "3 month")} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('3 month', {

                            })(<Input type='number' min={0} />)}


                        </Form.Item>
                    </Col>
                    <Col span={3} className="p-0">
                        <Button type="primary" onClick={() => this.setPrice('3 month')} >{convertToLang(this.props.translation[Button_SET], "SET")} </Button>
                    </Col>
                    <Col span={7} className="pl-0">
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['3 month'] ? this.props.innerTabData['3 month'] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[six_month], "6 month")} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('6 month', {

                            })(<Input type='number' min={0} />)}


                        </Form.Item>
                    </Col>
                    <Col span={3} className="p-0">
                        <Button type="primary" onClick={() => this.setPrice('6 month')}>{convertToLang(this.props.translation[Button_SET], "SET")} </Button>
                    </Col>
                    <Col span={7} className="pl-0">
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['6 month'] ? this.props.innerTabData['6 month'] : 0 : 0}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[twelve_month], "12 month")} labelCol={{ span: 8 }}
                            wrapperCol={{ span: 15 }}>
                            {getFieldDecorator('12 month', {

                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={3} className="p-0">
                        <Button type="primary" onClick={() => this.setPrice('12 month')}>{convertToLang(this.props.translation[Button_SET], "SET")} </Button>
                    </Col>
                    <Col span={7} className="pl-0">
                        <h4 className='priceText'>{convertToLang(this.props.translation[PRICE], "PRICE")} : ${this.props.innerTabData ? this.props.innerTabData['12 month'] ? this.props.innerTabData['12 month'] : 0 : 0}</h4>
                    </Col>
                </Row>

            </Form>
        )
    }
}

PricingForm = Form.create()(PricingForm);

export default PricingForm