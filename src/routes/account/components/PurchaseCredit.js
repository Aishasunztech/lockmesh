import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider, InputNumber } from "antd";

class PurchaseCredit extends Component {


    constructor(props) {
        super(props);
        this.state = {
            credits: '',
            currency: '',
            currency_price: '',
            total: '',
            method: ""
        }
    }

    onChange = (e, field) => {
        // console.log(e);
        if (field === 'credits') {
            this.setState({
                [field]: e,
                currency_price: e
            })
        }
        else {
            this.setState({
                [field]: e
            })
        }

    }


    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('form', values);
            if (!err) {

            }
        });
    }
    render() {
        // console.log(this.state);
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Modal
                // closable={false}
                maskClosable={false}
                style={{ top: 50 }}
                width="600px"
                className="push_app"
                title="Purchase Credits"
                visible={this.props.purchase_modal}
                footer={false}
                onOk={() => {
                }}
                onCancel={(e) => {
                    this.props.showPurchaseModal(e, false)
                }
                }
                okText="Push Apps"
            >
                <div>
                    <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                        <p className="mb-4">(*)- Required Fields</p>
                        < Form.Item
                            style={{ marginBottom: 0 }}
                            label="Credits"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('credits', {
                                rules: [{
                                    required: true, message: 'No. of credits required !',
                                },
                                ],
                            })(

                                <InputNumber onChange={(e) => { this.onChange(e, 'credits') }} style={{ width: '100%' }} min={1} />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="CURRENCY"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            showSearch
                        >
                            {this.props.form.getFieldDecorator('currency', {
                                initialValue: "",
                                rules: [{
                                    required: true, message: 'Please select a currency!',
                                }],
                            })(
                                <Select
                                    showSearch
                                    placeholder="Select Currency"
                                    optionFilterProp="children"
                                    onChange={(e) => { this.onChange(e, 'currency') }}
                                    // onChange={handleChange}
                                    // onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Select.Option value="">Select Currency</Select.Option>
                                    <Select.Option selected value="usd">$ USD</Select.Option>
                                    {/* <Select.Option value="">Select PGP Email</Select.Option> */}

                                </Select>
                                // <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="CURRENCY PRICE"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('currency_price', {
                                initialValue: this.state.currency_price
                            })(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="PROMO CODE"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('promo_code', {
                                initialValue: '',
                            })(
                                <Input />
                            )}
                        </Form.Item>
                        <Form.Item
                            label="PAYMENT METHOD"
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            showSearch
                        >
                            {this.props.form.getFieldDecorator('method', {
                                initialValue: this.state.method,
                                rules: [{
                                    required: true, message: 'Please select a payment method.',
                                }],
                            })(
                                <Select
                                    showSearch
                                    placeholder="Select Payment Method"
                                    optionFilterProp="children"
                                    // onChange={handleChange}
                                    // onFocus={handleFocus}
                                    // onBlur={handleBlur}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    <Select.Option value="">Select Payment Method</Select.Option>
                                    <Select.Option value="cash">CASH</Select.Option>
                                    <Select.Option value="btc">BITCOIN</Select.Option>
                                    <Select.Option value="credit_card">CREDIT CARD</Select.Option>
                                </Select>,
                            )}
                        </Form.Item>
                        <Form.Item
                            label="TOTAL PRICE IN $(USD) "
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('total', {
                                initialValue: this.state.credits
                            })(
                                <Input disabled />
                            )}
                        </Form.Item>
                        <Form.Item className="edit_ftr_btn11"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button key="back" type="button" onClick={(e) => { this.props.showPurchaseModal(e, false); }} >Cancel</Button>
                            <Button type="primary" htmlType="submit">Submit</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Modal >
        )
    }
}

PurchaseCredit = Form.create()(PurchaseCredit);
export default PurchaseCredit;