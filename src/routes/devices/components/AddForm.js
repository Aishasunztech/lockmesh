import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddUser from '../../users/components/AddUser';
import { convertToLang } from '../../utils/commonUtils';
import Services from './Services'
import Picky from 'react-picky';
import AddSimPermission from './AddSimPermission'
import { Markup } from 'interweave';
import { Modal, Button, Form, Input, Select, Radio, InputNumber, Popover, Icon, Row, Col, Spin, Table, Checkbox } from 'antd';
import { withRouter, Redirect, Link } from 'react-router-dom';

import { getSimIDs, getChatIDs, getPGPEmails, getParentPackages, getProductPrices, getHardwaresPrices } from "../../../appRedux/actions/Devices";
import { getPolicies } from "../../../appRedux/actions/ConnectDevice";
import {
    addUser,
    getUserList,
    getInvoiceId
} from "../../../appRedux/actions/Users";
import { Button_Cancel, Button_submit, Button_Add_User } from '../../../constants/ButtonConstants';
import { LABEL_DATA_PGP_EMAIL, LABEL_DATA_SIM_ID, LABEL_DATA_CHAT_ID, DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { SINGLE_DEVICE, DUPLICATE_DEVICES, Required_Fields, USER_ID, DEVICE_ID, USER_ID_IS_REQUIRED, SELECT_PGP_EMAILS, DEVICE_Select_CHAT_ID, SELECT_USER_ID, DEVICE_CLIENT_ID, DEVICE_Select_SIM_ID, DEVICE_MODE, DEVICE_MODEL, Device_Note, Device_Valid_For, Device_Valid_days_Required, DUPLICATE_DEVICES_REQUIRED, DEVICE_IMEI_1, DEVICE_SIM_1, DEVICE_IMEI_2, DEVICE_SIM_2, DUPLICATE_DEVICES_HELPING_TEXT } from '../../../constants/DeviceConstants';
import { Not_valid_Email, POLICY, Start_Date, Expire_Date, Expire_Date_Require, SELECT_POLICY, ADMIN } from '../../../constants/Constants';
import { DEALER_PIN } from '../../../constants/DealerConstants';
import moment from 'moment';
import Invoice from './invoice';
import { inventorySales } from '../../utils/columnsUtils';

const confirm = Modal.confirm;
const success = Modal.success

const { TextArea } = Input;
class AddDevice extends Component {

    constructor(props) {
        super(props);
        this.sim_id2_added = false;
        this.hardware_added = false;
        this.sim_id2_included = false;
        const invoiceColumns = inventorySales(props.translation);


        this.state = {
            visible: false,
            invoiceVisible: false,
            invoiceType: '',
            type: 0,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
            client_id: '',
            pgp_email: '',
            chat_id: '',
            sim_id: '',
            sim_id2: undefined,
            selectedPackage: null,
            vpn: '',
            packageId: '',
            disableSim: true,
            disableChat: true,
            disablePgp: true,
            disableVpn: true,
            servicesModal: false,
            tabselect: '0',
            parent_packages: [],
            product_prices: [],
            products: [],
            packages: [],
            expiry_date: '',
            services: false,
            checkServices: {
                display: 'none',
            },
            term: '',
            unit_servcies_price: 0,
            total_price: 0,
            invoiceColumns: invoiceColumns,
            PkgSelectedRows: [],
            proSelectedRows: [],
            duplicate: 0,
            showConfirmCredit: false,
            serviceData: {},
            invoiceID: 'PI00001',
            selectedHardwareValues: [],
            hardwarePrice: 0,
            hardwares: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log('form', values);
            if (this.state.services) {
                if (!err) {
                    let product_prices = this.filterList(this.state.term + ' month', this.props.product_prices, 'product');
                    let sim_id_price = product_prices.filter((item) => {
                        if (item.price_for === 'sim_id') {
                            return item
                        }
                    })
                    if (this.state.sim_id2 && !this.sim_id2_added && !this.sim_id2_included) {
                        if (sim_id_price.length) {
                            let data = {
                                id: sim_id_price[0].id,
                                rowKey: sim_id_price[0].id,
                                unit_price: sim_id_price[0].unit_price,
                                rowKey: sim_id_price[0].id,
                                price_for: "SIM ID 2"
                            }

                            this.state.proSelectedRows.push(data);
                            this.state.products.push(data);
                            this.state.total_price = this.state.total_price + Number(sim_id_price[0].unit_price)
                        }
                        this.sim_id2_added = true
                    } else if (this.state.sim_id2 === '' && this.sim_id2_added) {
                        this.state.proSelectedRows.pop()
                        this.state.products.pop()
                        this.state.total_price = this.state.total_price - Number(sim_id_price[0].unit_price)
                        this.sim_id2_added = false
                    }

                    values.products = this.state.products;
                    values.packages = this.state.packages;
                    values.term = this.state.term;
                    values.total_price = this.state.total_price
                    values.hardwarePrice = this.state.hardwarePrice
                    values.hardwares = this.state.hardwares
                    this.setState({
                        serviceData: values,
                        showConfirmCredit: true

                    })
                }
            }
            else {
                this.setState({
                    checkServices: {
                        display: 'inline',
                        color: 'Red',
                        margin: 0
                    }
                })
            }
        });
    }
    componentDidMount() {
        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        this.props.getPolicies();
        this.props.getUserList();
        if (this.props.user.type !== ADMIN) {
            this.props.getProductPrices();
            this.props.getParentPackages();
            this.props.getHardwaresPrices();
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })

        if (this.props.invoiceID !== nextProps.invoiceID) {
            this.setState({ invoiceID: nextProps.invoiceID })
        }
    }

    handleReset = () => {

        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        // this.props.getUserList();
        this.props.form.resetFields();
    }

    confirmRenderList(packages, products, hardwares, term = this.state.term, duplicate = this.state.duplicate) {
        // console.log('state is: ', this.state)
        let counter = 0
        let hardwareList = hardwares.map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.id,
                item: `Hardware`,
                description: item.hardware_name,
                term: '---',
                unit_price: item.hardware_price,
                quantity: (duplicate > 0) ? 1 * duplicate : 1,
                line_total: (duplicate > 0) ? item.hardware_price * duplicate : item.hardware_price
            }
        });

        let packagesList = packages.map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.rowKey,
                item: `Package`,
                description: item.pkg_name,
                term: term + " Month",
                unit_price: item.pkg_price,
                quantity: (duplicate > 0) ? 1 * duplicate : 1,
                line_total: (duplicate > 0) ? item.pkg_price * duplicate : item.pkg_price
            }
        });
        let productList = products.map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.rowKey,
                item: `Product`,
                description: item.price_for,
                term: (term === '0') ? "TRIAL" : term + " Month",
                unit_price: item.unit_price,
                quantity: (duplicate > 0) ? 1 * duplicate : 1,
                line_total: (duplicate > 0) ? item.unit_price * duplicate : item.unit_price
            }
        });

        return [...packagesList, ...productList, ...hardwareList]
    }

    handleCancel = () => {
        this.setState({
            visible: false,
            servicesModal: false,

        });
    }
    handleChange = (e) => {
        // console.log(e);
        // this.setState({ pgp_email: e }); 
        this.setState({ type: e.target.value });
    }

    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
    }

    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    handleSimPermissionModal = () => {
        let handleSubmit = this.props.addSimPermission;
        this.refs.add_sim_permission.showModal(handleSubmit);
    }

    handleServicesSubmit = (products, packages, term) => {
        let disableChat = true;
        let disablePgp = true;
        let disableSim = true;
        let vpn = '';

        let packagesData = []
        let productData = []
        let total_price = 0
        // console.log(products, packages);
        if (packages && packages.length) {
            packages.map((item) => {
                let data = {
                    id: item.id,
                    pkg_features: item.pkg_features,
                    pkg_price: item.pkg_price,
                    pkg_dealer_type: item.dealer_type,
                    pkg_name: item.pkg_name,
                    pkg_term: item.pkg_term
                }
                total_price = total_price + Number(item.pkg_price)
                packagesData.push(data)
                let services = item.pkg_features;
                if (services.chat_id) {
                    disableChat = false
                }
                if (services.sim_id) {
                    disableSim = false
                }
                if (services.sim_id2) {
                    this.sim_id2_included = true
                } else {
                    this.sim_id2_included = false
                }
                if (services.pgp_email) {
                    disablePgp = false
                }
                if (services.vpn) {
                    vpn = "1"
                }
                // console.log(item.pkg_features);
            })
        }
        if (products && products.length) {
            products.map((item) => {
                let data = {
                    id: item.id,
                    price_for: item.item,
                    unit_price: item.unit_price,
                    price_term: item.price_term
                }
                total_price = total_price + Number(item.unit_price)
                productData.push(data)
                if (item.item == 'chat_id') {
                    disableChat = false
                }
                else if (item.item == 'sim_id') {
                    disableSim = false
                }
                else if (item.item == 'pgp_email') {
                    disablePgp = false
                }
                else if (item.item == 'vpn') {
                    vpn = "1"
                }
            })
        }

        let expiry_date = ''
        if (term === '0') {
            expiry_date = "7 Days";
        } else {
            expiry_date = term + " Months";
        }
        let services = (packages.length > 0 || products.length > 0) ? true : false;
        this.setState({
            pgp_email: (this.props.pgp_emails.length && !disablePgp) ? this.props.pgp_emails[0].pgp_email : '',
            chat_id: (this.props.chat_ids.length && !disableChat) ? this.props.chat_ids[0].chat_id : '',
            sim_id: (this.props.sim_ids.length && !disableSim) ? this.props.sim_ids[0].sim_id : '',
            sim_id2: (this.sim_id2_included) ? (this.props.sim_ids.length > 1) ? this.props.sim_ids[1].sim_id : undefined : undefined,
            vpn: vpn,
            disableSim: disableSim,
            disableChat: disableChat,
            disablePgp: disablePgp,
            packages: packagesData,
            products: productData,
            expiry_date: expiry_date,
            services: services,
            checkServices: (services) ? { display: 'none' } : { display: 'inline', color: "Red", margin: 0 },
            term: term,
            unit_servcies_price: total_price,
            total_price: this.state.duplicate > 0 ? total_price * this.state.duplicate : total_price,
            PkgSelectedRows: packages,
            proSelectedRows: products
        })
    }

    handleServicesModal = () => {
        this.setState({
            servicesModal: true
        })
    }


    packageChange = (value) => {
        if (value != '') {
            let userPackage = this.props.parent_packages.filter((item) => {
                if (item.id === value) {
                    return item
                }
            })
            // console.log(userPackage);
            // console.log(userPackage.pkg_features);
            let services = JSON.parse(userPackage[0].pkg_features)
            // console.log(services);
            let sim_id = '';
            let chat_id = '';
            let pgp_email = '';
            let vpn = '';
            let disableChat = false;
            let disablePgp = false;
            let disableSim = false;
            let disableVpn = false
            let error = false
            if (services.sim_id) {
                if (this.props.sim_ids.length) {
                    sim_id = this.props.sim_ids[0].sim_id
                }
                else {
                    error = true
                }
                disableSim = true
            }

            if (services.chat_id) {
                if (this.props.chat_ids.length) {
                    chat_id = this.props.chat_ids[0].chat_id
                }
                else {
                    error = true
                }
                disableChat = true
            }
            if (services.pgp_email) {
                if (this.props.pgp_emails.length) {
                    pgp_email = this.props.pgp_emails[0].pgp_email
                }
                else {
                    error = true
                }
                disablePgp = true
            }
            if (services.vpn) {
                disableVpn = true
            }
            if (error) {
                let _this = this
                confirm({
                    title: "All Services are not found. Please Contact your ADMIN or click CONTINUE ANYWAYS to add later.",
                    okText: 'CONTINUE ANYWAYS',
                    onOk() {
                        _this.setState({
                            packageId: value,
                            sim_id: sim_id,
                            chat_id: chat_id,
                            pgp_email: pgp_email,
                            vpn: (services.vpn) ? "1" : "0",
                            disableSim: disableSim,
                            disableChat: disableChat,
                            disablePgp: disablePgp,
                            disableVpn: disableVpn,

                        })

                    },
                    onCancel() {
                        _this.setState({
                            packageId: '',
                            sim_id: '',
                            chat_id: '',
                            pgp_email: '',
                            vpn: '',
                            disableSim: false,
                            disableChat: false,
                            disablePgp: false,
                            disableVpn: false,
                        })
                    },

                })

            } else {
                this.setState({
                    packageId: value,
                    sim_id: sim_id,
                    chat_id: chat_id,
                    pgp_email: pgp_email,
                    vpn: (services.vpn) ? "1" : "0",
                    disableSim: disableSim,
                    disableChat: disableChat,
                    disablePgp: disablePgp,
                    disableVpn: disableVpn,

                })
            }
        }
        else {
            this.setState({
                packageId: value,
                sim_id: '',
                chat_id: '',
                pgp_email: '',
                vpn: '',
                disableSim: false,
                disableChat: false,
                disablePgp: false,
                disableVpn: false,
            })

        }
    }


    filterList = (type, list, listType) => {
        let dumyPackages = [];
        if (list.length) {
            list.filter(function (item) {
                let packageTerm;
                if (listType === 'pkg') {
                    packageTerm = item.pkg_term
                } else {
                    packageTerm = item.price_term
                }
                if (packageTerm == type) {
                    dumyPackages.push(item);
                }
            });
        }
        return dumyPackages;
    }



    handleChangetab = (value) => {
        switch (value) {
            case '0':
                this.setState({
                    parent_packages: [],
                    product_prices: [],
                    tabselect: '0',
                })
                break;
            case '1':
                this.setState({
                    parent_packages: this.filterList('1 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('1 month', this.props.product_prices, 'product'),
                    tabselect: '1',
                })
                break;
            case '3':
                this.setState({
                    parent_packages: this.filterList('3 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('3 month', this.props.product_prices, 'product'),
                    tabselect: '3',
                })
                break;
            case '6':
                this.setState({
                    parent_packages: this.filterList('6 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('6 month', this.props.product_prices, 'product'),
                    tabselect: '6',
                })
                break;
            case '12':
                this.setState({
                    parent_packages: this.filterList('12 month', this.props.parent_packages, 'pkg'),
                    product_prices: this.filterList('12 month', this.props.product_prices, 'product'),
                    tabselect: '12',
                })
                break;

            default:
                this.setState({
                    parent_packages: [],
                    product_prices: [],
                    tabselect: '0',
                })
                break;
        }
    }
    handleDuplicate = (e) => {
        // console.log(e);
        let duplicates = e;
        // console.log(this.state.total_price);
        let total_price = this.state.unit_servcies_price * duplicates
        this.setState({
            total_price: total_price,
            duplicate: e
        })
    }

    submitServicesConfirm(pay_now) {
        this.props.getInvoiceId();
        this.state.serviceData.pay_now = pay_now;

        if (pay_now) {
            this.setState({ invoiceVisible: true, invoiceType: "pay_now" })
        } else {
            this.setState({ invoiceVisible: true, invoiceType: "pay_later" })
        }

    }

    handleOkInvoice = () => {
        // console.log("handleOk for invoice", this.state.serviceData)

        if ((this.state.total_price + this.state.hardwarePrice) <= this.props.user_credit) {
            this.props.AddDeviceHandler(this.state.serviceData);
            this.props.hideModal();
            this.handleReset();
            this.setState({
                serviceData: {},
                showConfirmCredit: false
            })
        } else {
            showCreditPurchase(this)
        }

        this.setState({
            invoiceVisible: false,
            // showConfirmCredit: false,
            servicesModal: false
        })
    }

    handleCancelInvoice = () => {
        this.setState({ invoiceVisible: false })
    }

    setDropdowns(values) {
        // console.log('setDropdowns val : ', values)
        this.setState({
            selectedHardwareValues: values,
        });
    }

    handleHardwareChange = (e, added) => {

        let hardware = this.props.parent_hardwares.find((item) => item.id === e)
        if (hardware) {
            // console.log(hardware);
            if (added) {
                this.state.hardwarePrice += hardware.hardware_price
                this.state.hardwares.push(hardware)

            } else {
                this.state.hardwares.splice(this.state.hardwares.findIndex((item) => item.id === hardware.id), 1)
                this.state.hardwarePrice -= hardware.hardware_price
            }
            this.setState({
                hardwarePrice: this.state.hardwarePrice,
                hardwares: this.state.hardwares
            })
        }
    }

    render() {
        // console.log(this.props);
        // console.log('id is', this.state.products, this.state.packages);
        const { visible, loading, isloading, addNewUserValue } = this.state;
        const { users_list } = this.props;
        var lastObject = users_list[0]
        let allSelectedOpt = false
        if (this.props.parent_hardwares.length === this.state.selectedHardwareValues.length) {
            allSelectedOpt = true;
        } else { allSelectedOpt = false }
        // console.log(users_list[0]);

        return (
            <div>


                {(this.props.preActive) ?
                    <Radio.Group className="width_100 text-center" onChange={this.handleChange} ref='option' defaultValue="0" buttonStyle="solid">
                        <Radio.Button className="dev_radio_btn" value="0">{convertToLang(this.props.translation[SINGLE_DEVICE], "Single Device")}</Radio.Button>
                        <Radio.Button className="dev_radio_btn" value="1">
                            <a>{convertToLang(this.props.translation[DUPLICATE_DEVICES], "Duplicate Devices")}</a>
                            <Popover placement="bottomRight" content={(
                                <Markup content={convertToLang(this.props.translation[DUPLICATE_DEVICES_HELPING_TEXT],
                                    `<p>Generate multiple activation <br /> codes with same settings</p>`)} />
                            )}>
                                <span className="helping_txt"><Icon type="info-circle" /></span>
                            </Popover>
                        </Radio.Button>
                    </Radio.Group>
                    : null}
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p style={{ marginLeft: 36 }}>(*)- {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    {(this.props.preActive) ? null :
                        <Form.Item
                            label={convertToLang(this.props.translation[DEVICE_ID], "Device ID ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {this.props.form.getFieldDecorator('device_id', {
                                initialValue: this.props.new ? "" : this.props.device.device_id,
                            })(
                                <Input disabled />
                            )}
                        </Form.Item>
                    }
                    {(isloading ?

                        <div className="addUserSpin">
                            <Spin />
                        </div>
                        :
                        <Fragment>
                            <Form.Item
                                label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >


                                {this.props.form.getFieldDecorator('user_id', {
                                    initialValue: this.props.new ? "" : this.state.addNewUserModal ? lastObject.user_id : addNewUserValue,
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], 'User ID is Required !'),
                                    }]
                                })(
                                    <Select
                                        className="pos_rel"
                                        setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
                                        optionFilterProp="children"
                                        onChange={this.handleUserChange}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                        {users_list.map((item, index) => {
                                            return (<Select.Option key={index} value={item.user_id}>{item.user_id} ( {item.user_name} )</Select.Option>)
                                        })}
                                    </Select>


                                    // {/* <Button
                                    //     type="primary"
                                    //     style={{ width: '100%' }}
                                    //     onClick={() => this.handleUserModal()}
                                    // >
                                    //     Add User
                                    // </Button> */}
                                )}
                                <Button
                                    className="add_user_btn"
                                    type="primary"
                                    onClick={() => this.handleUserModal()}
                                >
                                    {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                </Button>

                            </Form.Item>

                        </Fragment>
                    )}

                    <Form.Item
                        label={convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICES")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('service', {
                            initialValue: '',
                        })(
                            <Fragment>
                                <Button
                                    type="primary"
                                    onClick={() => this.handleServicesModal()}
                                    style={{ width: '100%' }}
                                >
                                    {convertToLang(this.props.translation[DUMY_TRANS_ID], "SELECT SERVICES")}
                                </Button>
                                <span style={this.state.checkServices}>You need to selet a service before submit form.</span>
                            </Fragment>
                        )}
                    </Form.Item>
                    {(this.state.type == 0 && lastObject) ?
                        <Fragment>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('dealer_id', {
                                    initialValue: this.props.new ? "" : this.props.device.dealer_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_device_id', {
                                    initialValue: this.props.new ? "" : this.props.device.usr_device_id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('usr_acc_id', {
                                    initialValue: this.props.new ? "" : this.props.device.id,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item style={{ marginBottom: 0 }}
                            >
                                {this.props.form.getFieldDecorator('connected_dealer', {
                                    initialValue: this.props.new ? "" : this.props.device.connected_dealer,
                                })(

                                    <Input type='hidden' disabled />
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[""], "SELECT HARDWARE")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('hardwares')(
                                    <Select
                                        mode="multiple"
                                        showSearch
                                        style={{ width: '100%' }}
                                        placeholder="Select hardwares"
                                        mode="multiple"
                                        onChange={(e) => this.setState({ hardware: e })}
                                        onSelect={(e) => {
                                            this.handleHardwareChange(e, true)
                                        }
                                        }
                                        onDeselect={(e) => {
                                            this.handleHardwareChange(e, false)
                                        }
                                        }
                                    >
                                        {this.props.parent_hardwares.map((hardware) => {
                                            return (<Select.Option key={hardware.id} value={hardware.id}>{hardware.hardware_name + " ( PRICE: " + hardware.hardware_price + " Credits ) "}</Select.Option>)
                                        })}
                                    </Select>
                                    // <Input />
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP Email ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('pgp_email', {
                                    initialValue: this.state.pgp_email,
                                    rules: [

                                        {
                                            type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], 'The input is not valid E-mail!'),
                                        }
                                    ],
                                })(
                                    <Select
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[SELECT_PGP_EMAILS], "Select PGP Emails")}
                                        optionFilterProp="children"
                                        onChange={(e) => this.setState({ pgp_email: e })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        // defaultValue={this.state.pgp_email}
                                        autoComplete="new-password"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled={this.state.disablePgp}
                                    >
                                        {this.props.pgp_emails.map((pgp_email) => {
                                            return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email}>{pgp_email.pgp_email}</Select.Option>)
                                        })}
                                    </Select>
                                    // <Input />
                                )}
                            </Form.Item>

                            <Form.Item
                                label={convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], "Chat ID ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('chat_id', {
                                    initialValue: this.state.chat_id,
                                })(
                                    // <Input />
                                    <Select
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[DEVICE_Select_CHAT_ID], "Select Chat ID")}
                                        optionFilterProp="children"
                                        onChange={(value) => this.setState({ chat_id: value })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled={this.state.disableChat}
                                    >
                                        {this.props.chat_ids.map((chat_id, index) => {
                                            return (<Select.Option key={index} value={chat_id.chat_id}>{chat_id.chat_id}</Select.Option>)
                                        })}
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item
                                label={convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "Sim ID ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('sim_id', {
                                    initialValue: this.state.sim_id
                                })(
                                    <Select
                                        // className="pos_rel"
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[DEVICE_Select_SIM_ID], "Select Sim ID ")}
                                        optionFilterProp="children"
                                        onChange={(value) => this.setState({ sim_id: value })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled={this.state.disableSim}
                                    >
                                        {this.props.sim_ids.map((sim_id, index) => {
                                            return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                        })}
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DUMY_TRANS_ID], "Sim ID 2 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('sim_id2', {
                                    initialValue: this.state.sim_id2
                                })(
                                    <Select
                                        // className="pos_rel"
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[DUMY_TRANS_ID], "Select Sim ID 2")}
                                        optionFilterProp="children"
                                        onChange={(value) => this.setState({ sim_id2: value })}
                                        // onFocus={handleFocus}
                                        // onBlur={handleBlur}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        disabled={this.state.disableSim}
                                    >
                                        {this.props.sim_ids.map((sim_id, index) => {
                                            if (index > 0) {

                                                return (<Select.Option key={index} value={sim_id.sim_id}>{sim_id.sim_id}</Select.Option>)
                                            }
                                        })}
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DUMY_TRANS_ID], "VPN")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('vpn', {
                                    initialValue: this.state.vpn
                                })(
                                    <Select
                                        showSearch
                                        placeholder={convertToLang(this.props.translation[DUMY_TRANS_ID], "Select VPN")}
                                        optionFilterProp="children"
                                        onChange={(value) => this.setState({ vpn: value })}

                                        disabled={this.state.disableVpn}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[DUMY_TRANS_ID], "Select VPN ")}</Select.Option>
                                        <Select.Option value="1">{convertToLang(this.props.translation[DUMY_TRANS_ID], "YES")}</Select.Option>
                                        <Select.Option value="0">{convertToLang(this.props.translation[DUMY_TRANS_ID], "NO")}</Select.Option>
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DUMY_TRANS_ID], "Client ID ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('client_id', {
                                    // initialValue: this.state.client_id,

                                })(
                                    <Input
                                        onChange={e => {
                                            this.setState({ client_id: e.target.value });
                                        }} />
                                )}
                            </Form.Item>


                            {(this.props.preActive) ? null :
                                <Form.Item
                                    label={convertToLang(this.props.translation[DEVICE_MODEL], "Model ")}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 14 }}
                                >
                                    {this.props.form.getFieldDecorator('model', {
                                        initialValue: this.props.new ? "" : this.props.device.model,
                                    })(
                                        <Input />
                                    )}
                                </Form.Item>} </Fragment> : null}
                    <Form.Item
                        label={convertToLang(this.props.translation[POLICY], "Policy ")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('policy_id', {
                            initialValue: '',
                        })(
                            <Select
                                showSearch
                                placeholder={convertToLang(this.props.translation[SELECT_POLICY], "Select Policy")}
                                optionFilterProp="children"
                                // onChange={handleChange}
                                // onFocus={handleFocus}
                                // onBlur={handleBlur}
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            >
                                <Select.Option value="">{convertToLang(this.props.translation[SELECT_POLICY], "Select Policy ")}</Select.Option>
                                {this.props.policies.map((policy, index) => {
                                    return (<Select.Option key={index} value={policy.id}>{policy.policy_name}</Select.Option>)
                                })}
                            </Select>,
                        )}
                    </Form.Item>
                    {/* <Form.Item
                        label={convertToLang(this.props.translation[Start_Date], "Start Date ")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('start_date', {
                            initialValue: this.props.new ? this.createdDate() : this.props.device.start_date,
                        })(

                            <Input disabled />
                        )}
                    </Form.Item> */}
                    <Form.Item
                        label={convertToLang(this.props.translation[Expire_Date], "Expiry Date ")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('expiry_date', {
                            initialValue: this.state.expiry_date,
                        })(

                            <Input disabled />
                        )}
                    </Form.Item>

                    {(this.props.preActive) ?
                        <Fragment>
                            <Form.Item
                                label={convertToLang(this.props.translation[Device_Valid_For], "VALID FOR(DAYS) ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('validity', {
                                    initialValue: '',
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[Device_Valid_days_Required], "Valid days required "),
                                    }],
                                })(
                                    <InputNumber min={1} />
                                )}

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[Device_Note], "NOTE ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                {this.props.form.getFieldDecorator('note', {
                                    initialValue: '',
                                })(
                                    // <Input />
                                    <TextArea
                                        // value={value}
                                        // onChange={this.onChange}
                                        // placeholder="Controlled autosize"
                                        autosize={{ minRows: 3, maxRows: 5 }}
                                    />
                                )}

                            </Form.Item>

                        </Fragment> : null}
                    {(this.state.type == 1) ?
                        <Form.Item
                            label={convertToLang(this.props.translation[DUPLICATE_DEVICES], "DUPLICATE ")}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                        >
                            {this.props.form.getFieldDecorator('duplicate', {
                                initialValue: '',
                                rules: [{
                                    required: true, message: convertToLang(this.props.translation[DUPLICATE_DEVICES_REQUIRED], 'Number of Duplicate devices required'),
                                }],
                            })(
                                <InputNumber min={2} onChange={this.handleDuplicate} />
                            )}
                        </Form.Item> : null
                    }
                    {(this.props.preActive === false) ?
                        (<Fragment>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEALER_PIN], "Dealer Pin ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.link_code} disabled />

                            </Form.Item>

                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI 1 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                                <Input type='text' value={this.props.new ? '' : this.props.device.imei} disabled />

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_SIM_1], "SIM 1 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.simno} disabled />

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI 2 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >

                                <Input value={this.props.new ? '' : this.props.device.imei2} disabled />

                            </Form.Item>
                            <Form.Item
                                label={convertToLang(this.props.translation[DEVICE_SIM_2], "SIM 2 ")}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <Input value={this.props.new ? '' : this.props.device.simno2} disabled />

                            </Form.Item>


                        </Fragment>
                        )
                        :
                        null}

                    <Form.Item className="edit_ftr_btn"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={this.props.handleCancel}>{convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}</Button>
                        <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], Button_submit)}</Button>
                    </Form.Item>
                </Form>

                <AddUser ref="add_user" translation={this.props.translation} />
                {/* <AddSimPermission ref="add_sim_permission" /> */}
                <Modal
                    width={750}
                    visible={this.state.servicesModal}
                    title={convertToLang(this.props.translation[DUMY_TRANS_ID], "SEVCIES")}
                    maskClosable={false}
                    onOk={this.handleOk}
                    closable={false}
                    // onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >
                    <Services
                        handleCancel={this.handleCancel}
                        parent_packages={this.state.parent_packages}
                        product_prices={this.state.product_prices}
                        tabselect={this.state.tabselect}
                        handleChangetab={this.handleChangetab}
                        translation={this.props.translation}
                        handleServicesSubmit={this.handleServicesSubmit}
                        user_credit={this.props.user_credit}
                        history={this.props.history}
                    />
                </Modal>
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
                            <h5 style={{ textAlign: "right" }}><b>Sub Total :  {this.state.serviceData.total_price + this.state.hardwarePrice} Credits</b></h5>
                            <h4 style={{ textAlign: "center" }}><b>There will be a charge of {this.state.serviceData.total_price + this.state.hardwarePrice} Credits</b></h4>
                        </div>
                        {(this.state.term !== '0') ?
                            <div>
                                <h4 style={{ textAlign: "center", color: 'red' }}>If you PAY NOW you will get 5% discount.</h4>
                            </div>
                            : null}

                        <div className="edit_ftr_btn" >
                            <Button onClick={() => { this.setState({ showConfirmCredit: false }) }}>CANCEL</Button>
                            <Button type='primary' onClick={() => { this.submitServicesConfirm(false) }}>PAY LATER</Button>
                            <Button style={{ backgroundColor: "green", color: "white" }} onClick={() => { this.submitServicesConfirm(true) }}>PAY NOW</Button>
                        </div >
                    </Fragment>
                </Modal>
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
                    cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >
                    <Invoice
                        // ref="invoice_modal"
                        PkgSelectedRows={this.state.PkgSelectedRows}
                        proSelectedRows={this.state.proSelectedRows}
                        renderInvoiceList={this.confirmRenderList}
                        subTotal={this.state.serviceData.total_price + this.state.hardwarePrice}
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
                </Modal>
            </div >
        )

    }
}

const WrappedAddDeviceForm = Form.create({ name: 'register' })(AddDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails,
        // getProfiles: getProfiles,
        getPolicies: getPolicies,
        addUser: addUser,
        getUserList: getUserList,
        getInvoiceId: getInvoiceId,
        getParentPackages: getParentPackages,
        getProductPrices: getProductPrices,
        getHardwaresPrices: getHardwaresPrices,
        addSimPermission: null
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, device_details, users, settings, sidebar, auth }) => {
    // console.log("users.invoiceID at componente", users.invoiceID);
    return {
        invoiceID: users.invoiceID,
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        policies: device_details.policies,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation,
        parent_packages: devices.parent_packages,
        product_prices: devices.product_prices,
        parent_hardwares: devices.parent_hardwares,
        user_credit: sidebar.user_credit,
        user: auth.authUser,
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WrappedAddDeviceForm));
function showConfirm(_this, values) {
    confirm({
        title: "Do You Really want to duplicate " + values.duplicate + " devices with same settings.",
        onOk() {
            _this.props.AddDeviceHandler(values);
            _this.props.hideModal();
            _this.handleReset();
        },
        onCancel() { },
    });
}

function showCreditPurchase(_this) {
    confirm({
        title: "Your Credits are not enough to apply these services. Please select other services OR Purchase Credits.",
        okText: "PURCHASE CREDITS",
        onOk() {
            _this.props.history.push('/account')
        },
        onCancel() {

        },

    })
}