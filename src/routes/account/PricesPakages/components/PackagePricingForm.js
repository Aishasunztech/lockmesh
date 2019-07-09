import React, { Component, Fragment } from 'react'

import {
    Form, Input, Row, Col, Button, Select,
} from "antd";
// import styles from '../../../whitelabels.css';
import RestService from '../../../../appRedux/services/RestServices';
import { convertToLang } from '../../../utils/commonUtils';
import {
    PACKAGE_NAME,
    PACKAGE_TERM,
    SELECT_PRICE,
    PACKAGE_SERVICES,
    PACKAGE_PRICE,
    PACKAGE_EXPIRY,
    PACKAGE_SEARCH,
    PACKAGE_SERVICE_NAME,
    PACKAGE_INCLUDED,
} from "../../../../constants/AccountConstants";
import {
    LABEL_DATA_CHAT_ID,
    LABEL_DATA_SIM_ID,
    LABEL_DATA_PGP_EMAIL,
    LABEL_DATA_VPN,
} from '../../../../constants/LabelConstants';
import {
    Button_SET,
    Button_UNSET
} from '../../../../constants/ButtonConstants'

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
            if (fieldName === 'pkgPrice' && value < 0) {
            } else {
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
    }


    PackageNameChange = async (rule, value, callback) => {
        let response = true
        // console.log('value', value)
        response = await RestService.checkPackageName(value).then((response) => {
            if (RestService.checkAuth(response.data)) {
                if (response.data.status) {
                    return true
                }
                else {
                    return false
                }
            }
        });
        // console.log(response, 'respoinse ise  d')
        if (response) {
            callback()
        } else {
            callback("Package name already taken please use another name.")
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
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_NAME], PACKAGE_NAME)}
                            labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input Package Name!',
                                    },
                                    {
                                        validator: this.PackageNameChange,
                                    }
                                ],
                            })(<Input />)}
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice('pkgName')}> {convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={6}>
                        <h4 className='priceText'>{this.state.pkgName}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_TERM], PACKAGE_TERM)} labelCol={{ span: 11 }}
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
                                style={{ width: "100%" }}
                                placeholder={convertToLang(this.props.translation[SELECT_PRICE], SELECT_PRICE)}
                                optionFilterProp="children"
                                // onChange={onChange}
                                // onFocus={onFocus}
                                // onBlur={onBlur}
                                // onSearch={onSearch}
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value={one_month}>{convertToLang(this.props.translation[one_month], one_month)}</Option>
                                <Option value={three_month}>{convertToLang(this.props.translation[three_month], three_month)}</Option>
                                <Option value={six_month}>{convertToLang(this.props.translation[six_month], six_month)}</Option>
                                <Option value={twelve_month}>{convertToLang(this.props.translation[twelve_month], twelve_month)}</Option>
                            </Select>)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice('pkgTerms')}> {convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>{this.state.pkgTerms}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col span={13}>
                        <Form.Item label={convertToLang(this.props.translation[PACKAGE_PRICE], PACKAGE_PRICE)} labelCol={{ span: 11 }}
                            wrapperCol={{ span: 13 }}>
                            {getFieldDecorator('pkgPrice', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please Input Package Price',
                                    },
                                ],
                            })(<Input type='number' min={0} />)}

                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice('pkgPrice')} > {convertToLang(this.props.translation[Button_SET], Button_SET)} </Button>
                    </Col>
                    <Col span={7}>
                        <h4 className='priceText'>Price: ${this.state.pkgPrice}</h4>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_SIM_ID], LABEL_DATA_SIM_ID)}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(sim, true, !this.state[sim])} >{this.state[sim] ? convertToLang(this.props.translation[Button_UNSET], Button_UNSET) : convertToLang(this.props.translation[Button_SET], Button_SET) }</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[LABEL_DATA_SIM_ID], LABEL_DATA_SIM_ID)}: </span><span style={{ fontWeight: 'bold' }}>{this.state[sim] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], LABEL_DATA_CHAT_ID)}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(chat, true, !this.state[chat])}>{this.state[chat] ? convertToLang(this.props.translation[Button_UNSET], Button_UNSET) : convertToLang(this.props.translation[Button_SET], Button_SET) }</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' > {convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], LABEL_DATA_CHAT_ID)}: </span><span style={{ fontWeight: 'bold' }}>{this.state[chat] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], LABEL_DATA_PGP_EMAIL)}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(pgp, true, !this.state[pgp])}>{this.state[pgp] ? convertToLang(this.props.translation[Button_UNSET], Button_UNSET) : convertToLang(this.props.translation[Button_SET], Button_SET) }</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], LABEL_DATA_PGP_EMAIL)}: </span><span style={{ fontWeight: 'bold' }}>{this.state[pgp] ? 'Yes' : 'No'}</span>
                    </Col>
                </Row>

                <Row>
                    <Col span={13}>
                        <h4 className="labelTypeText">{convertToLang(this.props.translation[LABEL_DATA_VPN], LABEL_DATA_VPN)}:</h4>
                    </Col>
                    <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice(vpn, true, !this.state[vpn])}>{this.state[vpn] ? convertToLang(this.props.translation[Button_UNSET], Button_UNSET) : convertToLang(this.props.translation[Button_SET], Button_SET) }</Button>
                    </Col>
                    <Col span={7}>
                        <span className='priceText' >{convertToLang(this.props.translation[LABEL_DATA_VPN], LABEL_DATA_VPN)}: </span><span style={{ fontWeight: 'bold' }}>{this.state[vpn] ? 'Yes' : 'No'}</span>
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