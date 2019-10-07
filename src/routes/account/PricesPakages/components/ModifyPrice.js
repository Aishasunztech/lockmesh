import React, { Component, Fragment } from 'react'
import {
    Form, Input, Row, Col, Button, Select,
} from "antd";
import { convertToLang } from '../../../utils/commonUtils';
import {
    PACKAGE_PRICE,
} from "../../../../constants/AccountConstants";
import {
    Button_SET, Button_Cancel, Button_submit, Button_Save,
} from '../../../../constants/ButtonConstants'

class PackagePricingForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pkgPrice: 0,
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(this.props.package.id);
                if (this.props.package.id) {
                    this.props.modifyPackage(this.props.package.id, values.pkgPrice, this.props.isModify);
                    this.props.handleCancel()
                }
            }

        })
    }

    // setPrice = (fieldName) => {
    //     let value = this.props.form.getFieldValue(fieldName)
    //     if (fieldName) {
    //         if (fieldName === 'pkgPrice' && value > 0) {
    //             this.setState({
    //                 pkgPrice: value
    //             })
    //         }
    //     }
    // }



    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} >
                <Form.Item label={convertToLang(this.props.translation[PACKAGE_PRICE], "PACKAGE PRICE")} labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}>
                    {getFieldDecorator('pkgPrice', {
                        initialValue: this.props.package.pkg_price,
                        rules: [
                            {
                                required: true,
                                message: 'Please Input Package Price',
                            },
                        ],
                    })(<Input type='number' min={0} />)}

                </Form.Item>
                {/* <Col span={4}>
                        <Button type="primary" onClick={() => this.setPrice('pkgPrice')} > {convertToLang(this.props.translation[Button_SET], "SET")} </Button>
                    </Col> */}
                {/* <Col span={7}>
                        <h4 className='priceText'>Price: ${this.state.pkgPrice}</h4>
                    </Col> */}
                {/* </Row> */}

                <Form.Item className="edit_ftr_btn"
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 24, offset: 0 },
                    }}
                >
                    <Button key="back" type="button" onClick={this.props.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                    <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_Save], "Save")}</Button>
                </Form.Item>

            </Form >
        )
    }
}

PackagePricingForm = Form.create()(PackagePricingForm);

export default PackagePricingForm;