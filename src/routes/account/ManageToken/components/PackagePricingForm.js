import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select,
} from "antd";
import styles from '../managetoken.css';
import { one_month, three_month, six_month, twelve_month, sim, chat, pgp, vpn } from '../../../../constants/Constants';

class PackagePricingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pkgPrice: 0,
            sim: false,
            chat: false,
            pgp: false,
            vpn: false
        }
    }

    setPrice = (fieldName, is_pkg_feature = false, pkg_feature_value = '') => {
        // let value = e.target.value;
        let value = ''
        if (fieldName) {
            if (is_pkg_feature) {
                if (pkg_feature_value !== '' && fieldName) {
                     value = pkg_feature_value;
                    this.props.setPkgDetail(pkg_feature_value, fieldName, is_pkg_feature);
                }
            } else {
                 value = this.props.form.getFieldValue(fieldName)
                // console.log('fiels name', fieldName, 'value', value)
                if (value !== '' && fieldName) {
                    this.props.setPkgDetail(value, fieldName, is_pkg_feature);
                }
            }

            this.setState({
                [fieldName]: value
            })
        }
    }

    render() {

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
        const { Option } = Select;
        return (
            <Form onSubmit={this.handleSubmit}>
                <Row>
                    <Col span={13}>
                        <Form.Item label="Package Name"
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input Package Name!',
                                    },
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgName')}>Set</Button> */}
                    </Col>
                    <Col span={7}>
                        {/* <h4 className='priceText'>Price: 51651</h4> */}
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="Package Terms" labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgTerms', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please Select Package Terms',
                                    },
                                ],
                            })(<Select
                                showSearch
                                style={{ width: 145 }}
                                placeholder="Select a Price"
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={one_month}>{one_month}</Option>
                                <Option value={three_month}>{three_month}</Option>
                                <Option value={six_month}>{six_month}</Option>
                                <Option value={twelve_month}>{twelve_month}</Option>
                            </Select>)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        {/* <Button type="primary" onClick={() => this.setPrice('pkgTerms')}>Set</Button> */}
                    </Col>
                    <Col span={7}>
                        {/* <h4 className='priceText'>Price: 51651</h4> */}
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label="Package Price" labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgPrice', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please Input Package Price',
                                    },
                                ],
                            })(<Input type='number' />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice('pkgPrice')} >Set</Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: {this.state.pkgPrice}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">Sim ID:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(sim, true, !this.state[sim])} >{this.state[sim] ? 'Unset' : 'Set'}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >Sim ID: </span><span style={{ fontWeight: 'bold' }}>{this.state[sim] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">Chat ID:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(chat, true, !this.state[chat])}>{this.state[chat] ? 'Unset' : 'Set'}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' > Chat ID: </span><span style={{ fontWeight: 'bold' }}>{this.state[chat] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">Pgp ID:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(pgp, true, !this.state[pgp])}>{this.state[pgp] ? 'Unset' : 'Set'}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >Pgp ID: </span><span style={{ fontWeight: 'bold' }}>{this.state[pgp] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">VPN ID:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(vpn, true, !this.state[vpn])}>{this.state[vpn] ? 'Unset' : 'Set'}</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >VPN ID: </span><span style={{ fontWeight: 'bold' }}>{this.state[vpn] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>


                {/* <div style={{float: 'right', marginTop: 20}} > 
                    <Button onClick={()=> this.props.showPricingModal(false)}>Cancel</Button>
                    <Button type="primary" htmlType="submit" >Submit</Button>
                </div>  */}
            </Form>
        )
    }
}

PackagePricingForm = Form.create()(PackagePricingForm);

export default PackagePricingForm;