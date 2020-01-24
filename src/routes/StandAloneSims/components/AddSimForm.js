import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select, Modal, Table, Switch } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'
import { inventorySales } from '../../utils/columnsUtils'

import { Button_Cancel, Button_submit } from '../../../constants/ButtonConstants';
import { Required_Fields } from '../../../constants/DeviceConstants';
import Invoice from './simInvoice'

import RestService from '../../../appRedux/services/RestServices'
import { DUMY_TRANS_ID } from '../../../constants/LabelConstants';

const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error;

class AddSimForm extends Component {

    constructor(props) {
        super(props);
        const invoiceColumns = inventorySales(props.translation);
        this.state = {
            visible: false,
            term: '1 month',
            pkg_id: undefined,
            invoice_modal: false,
            standAlonePackages: this.props.standAlonePackages.filter(item => item.pkg_term == '1 month'),
            loading: false,
            invoiceColumns: invoiceColumns,
            serviceData: {}
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                })
                RestService.activateICCID(values.iccid).then((response) => {
                    if (response.data) {
                        if (response.data.valid) {
                            success({
                                title: response.data.msg,
                            })
                            this.setState({
                                loading: false,
                                invoice_modal: true
                            })
                        } else {
                            error({
                                title: response.data.msg
                            })
                            this.setState({
                                loading: false
                            })
                        }
                    }
                    // should be logged out
                    else {
                        this.setState({
                            loading: false
                        })
                    }
                });
            }

        });
    }

    validateICCID = (rule, value, callback) => {
        if ((value !== undefined) && value.length > 0) {

            if (/^[0-9]+$/.test(value)) {
                if (value.length != 20 && value.length != 19) {
                    return callback(`${convertToLang(this.props.translation[''], "ICC ID should be 19 or 20 digits long")}  :(${value.length})`);
                }
            } else {
                return callback(convertToLang(this.props.translation[''], "Please insert only numbers"));
            }
        }
        return callback();
    }



    componentDidMount() {
    }
    handleReset = () => {
        this.props.form.resetFields();
    }


    handleCancel = () => {
        this.handleReset();
        this.props.handleCancel();
    }
    handleChange = (e) => {
        this.setState({ type: e.target.value });
    }

    onChangeTerm = (value) => {
        let packages = this.props.standAlonePackages.filter(item => item.pkg_term == value)
        this.setState({
            term: value,
            standAlonePackages: packages,
            pkg_id: undefined
        });
    }


    confirmRenderList = () => {
        let packages = this.state.standAlonePackages.filter(item => item.id === this.state.pkg_id)
        let packagesList = packages.map((item, index) => {
            return {
                id: item.id,
                rowKey: item.id,
                item: `Stand Alone Sim`,
                description: item.pkg_name,
                term: this.state.term,
                unit_price: item.pkg_price,
                quantity: 1,
                line_total: item.pkg_price
            }
        });
        return packagesList
    }


    render() {
        //   console.log('props of coming', this.props.device);
        //  alert(this.props.device.device_id);
        const { visible, loading } = this.state;
        // console.log(this.props.standAlonePackages);
        return (
            <>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p>(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")} </p>
                    {(this.props.user) ? <Form.Item>
                        {this.props.form.getFieldDecorator('user_id', {
                            initialValue: this.props.user.user_id,
                        })(
                            <Input type='hidden' />
                        )}
                    </Form.Item> : null}
                    {/* Sim ID Input */}
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "ICCID")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('iccid', {
                            initialValue: "",
                            rules: [
                                {
                                    required: true, message: "ICCID is required"
                                },
                                {
                                    validator: (rule, value, callback) => { this.validateICCID(rule, value, callback) },
                                }
                            ]
                        })(
                            <Input
                                placeholder={convertToLang(this.props.translation[""], "Enter ICCID")}
                            />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "SELECT TERM")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('term', {
                            initialValue: this.state.term,
                            rules: [
                                {
                                    required: true, message: "Term is required"
                                },
                            ],
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[""], "Select Term")}
                                optionFilterProp="children"
                                onChange={(value) => this.onChangeTerm(value)}
                                autoComplete="new-password"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled={this.state.disablePgp}
                            >
                                <Select.Option value={'1 month'}>1 Month</Select.Option>
                                <Select.Option value={'3 month'}>3 Month</Select.Option>
                                <Select.Option value={'6 month'}>6 Month</Select.Option>
                                <Select.Option value={'12 month'}>12 Month</Select.Option>
                            </Select>
                            // <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[""], "SELECT PACKAGE")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {this.props.form.getFieldDecorator('package', {
                            initialValue: this.state.pkg_id,
                            rules: [
                                {
                                    required: true, message: "Package is required"
                                },
                            ],
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[""], "Select Package")}
                                optionFilterProp="children"
                                onChange={(e) => this.setState({ pkg_id: e })}
                                autoComplete="new-password"
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                disabled={this.state.disablePgp}
                            >
                                {this.state.standAlonePackages.map((pkg) => {
                                    return (<Select.Option key={pkg.id} value={pkg.id}>{`${pkg.pkg_name} (${pkg.pkg_price} Credits) `}</Select.Option>)
                                })}
                            </Select>
                            // <Input />
                        )}
                    </Form.Item>




                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={this.handleCancel}> {convertToLang(this.props.translation[Button_Cancel], "Cancel")} </Button>
                        <Button type="primary" htmlType="submit" loading={this.state.loading}> {convertToLang(this.props.translation[Button_submit], "Submit")} </Button>
                    </Form.Item>

                </Form>
                {/* Confirmation Modal */}
                <Modal
                    width={900}
                    visible={this.state.showConfirmCredit}
                    title={<span style={{ fontWeight: "bold" }}> {convertToLang(this.props.translation[DUMY_TRANS_ID], "Do You Really want to apply selected services on device ?")} </span>}
                    maskClosable={false}
                    // onOk={this.handleOk}
                    closable={false}
                    onCancel={
                        () => {
                            this.setState({
                                showConfirmCredit: false
                            })
                        }
                    }
                    footer={null}
                    className="edit_form"
                >
                    <Fragment>
                        <div style={{ marginTop: 20 }}>
                            <Table
                                id='packages'
                                className={"devices mb-20"}
                                // rowSelection={packageRowSelection}
                                size="middle"
                                bordered
                                columns={this.state.invoiceColumns}
                                dataSource={this.confirmRenderList(this.state.PkgSelectedRows, this.state.proSelectedRows, this.state.hardwares)}
                                pagination={
                                    false
                                }
                            />
                        </div >
                        <div>
                            <h5 style={{ textAlign: "right" }}><b>Sub Total :  {this.state.serviceData.total_price + this.state.serviceData.hardwarePrice} Credits</b></h5>
                            <h4 style={{ textAlign: "center" }}><b>There will be a charge of {this.state.serviceData.total_price + this.state.serviceData.hardwarePrice} Credits</b></h4>
                        </div>
                        {/* {(this.state.term !== '0') ?
                            <div>
                                <h4 style={{ textAlign: "center", color: 'red' }}>If you PAY NOW you will get 3% discount.</h4>
                            </div>
                            : null
                            } */}

                        <div className="edit_ftr_btn" >
                            <Button onClick={() => { this.setState({ showConfirmCredit: false }) }}>CANCEL</Button>
                            {this.state.serviceData.term == 0 ? <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PROCEED</Button> :
                                <Fragment>
                                    {(this.props.user_credit < (this.state.serviceData.total_price + this.state.serviceData.hardwarePrice) && this.props.user.account_balance_status === 'active') ?
                                        <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PAY LATER</Button>
                                        : null}
                                    <Button style={{ backgroundColor: "green", color: "white" }} onClick={() => { this.submitServicesConfirm(true) }}>PAY NOW (-3%)</Button>
                                </Fragment>
                            }
                        </div >
                    </Fragment>
                </Modal>

                {/* Invoices Modal */}
                <Modal
                    width="850px"
                    visible={this.state.invoiceVisible}
                    maskClosable={false}
                    closable={false}
                    // title={convertToLang(this.props.translation[""], "MDM PANEL SERVICES")}
                    onOk={this.handleOkInvoice}
                    onCancel={this.handleCancelInvoice}
                    className="edit_form"
                    bodyStyle={{ overflow: "overlay" }}
                    okText={convertToLang(this.props.translation[""], "CHECKOUT")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Invoice
                        // ref="invoice_modal"
                        PkgSelectedRows={this.state.PkgSelectedRows}
                        proSelectedRows={this.state.proSelectedRows}
                        renderInvoiceList={this.confirmRenderList}
                        subTotal={this.state.serviceData.total_price + this.state.serviceData.hardwarePrice}
                        invoiceType={this.state.invoiceType}
                        term={this.state.term}
                        duplicate={this.state.duplicate}
                        deviceAction={"Add"}
                        hardwarePrice={this.state.hardwarePrice}
                        hardwares={this.state.hardwares}
                        user_id={this.state.addNewUserValue}
                        invoiceID={this.state.invoiceID}
                        translation={this.props.translation}
                    />
                    <div style={{ float: "right" }}><b>PAID BY USER: </b> <Switch size="small" defaultChecked onChange={this.handlePaidUser} /></div>
                </Modal>
            </>













        )

    }
}

const WrappedAddDeviceForm = Form.create()(AddSimForm);
export default WrappedAddDeviceForm;