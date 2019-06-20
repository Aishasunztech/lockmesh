import React, { Component } from 'react'
import { Card, Button, Row, Col, Icon, Modal, Form, Input, Upload, message, Table, Select, Divider } from "antd";

class PurchaseCredit extends Component {
    handleSubmit = (e) => {

    }
    render() {
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
                width="500px"
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
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    <Form.Item label="Credits">
                        {this.props.form.getFieldDecorator('email', {
                            // rules: [

                            // ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            </Select>

                        )}
                    </Form.Item>
                    <Form.Item label="CURRENCY">
                        {this.props.form.getFieldDecorator('email', {
                            // rules: [

                            // ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            </Select>

                        )}
                    </Form.Item>
                    <Form.Item label="PROMO CODE">
                        {this.props.form.getFieldDecorator('email', {
                            // rules: [

                            // ],
                        })(
                           <Input />

                        )}
                    </Form.Item>
                    <Form.Item label="PAYMENT METHOD">
                        {this.props.form.getFieldDecorator('email', {
                            // rules: [

                            // ],
                        })(
                            <Select
                                showSearch
                                style={{ width: 200 }}
                                placeholder="Select a person"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            </Select>

                        )}
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 16, offset: 8 },
                        }}
                    >
                        <Button type="primary" htmlType="submit" disabled>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal >
        )
    }
}

PurchaseCredit = Form.create()(PurchaseCredit);
export default PurchaseCredit;