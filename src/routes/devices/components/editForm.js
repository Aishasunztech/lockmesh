import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button, Form, Input, Select, InputNumber, Spin, Modal, Table } from 'antd';
import { checkValue, convertToLang } from '../../utils/commonUtils'

import { getSimIDs, getChatIDs, getPGPEmails, getParentPackages, getProductPrices } from "../../../appRedux/actions/Devices";
import {
    DEVICE_TRIAL, DEVICE_PRE_ACTIVATION, ADMIN, Model_text, Expire_Date, one_month, three_month, six_month, twelve_month, Days, Start_Date, Expire_Date_Require, Not_valid_Email
} from '../../../constants/Constants';
import AddUser from '../../users/components/AddUser';
import {
    addUser,
    getUserList
} from "../../../appRedux/actions/Users";
import Services from './Services'
import {
    Required_Fields,
    DEVICE_ID, USER_ID,
    DEVICE_SIM_ID,
    DEVICE_Select_SIM_ID,
    DEVICE_CHAT_ID,
    Device_Note,
    Device_Valid_For,
    Device_Valid_days_Required,
    DEVICE_Select_CHAT_ID,
    SELECT_USER_ID,
    USER_ID_IS_REQUIRED,
    SELECT_PGP_EMAILS
} from '../../../constants/DeviceConstants';
import { Button_Add_User, Button_submit, Button_Cancel } from '../../../constants/ButtonConstants';
import { LABEL_DATA_PGP_EMAIL, DUMY_TRANS_ID, LABEL_DATA_CHAT_ID, LABEL_DATA_SIM_ID } from '../../../constants/LabelConstants';
import moment from 'moment';
import axios from 'axios';
import RestService from '../../../appRedux/services/RestServices';
import { async } from 'q';

const { TextArea } = Input;
const confirm = Modal.confirm
class EditDevice extends Component {

    constructor(props) {
        super(props);



        const invoiceColumns = [
            {
                dataIndex: 'counter',
                className: '',
                title: '#',
                align: "center",
                key: 'counter',
                sorter: (a, b) => { return a.counter - b.counter },
                sortDirections: ['ascend', 'descend'],

            },
            {
                dataIndex: 'item',
                className: '',
                title: convertToLang(this.props.translation["ITEM"], "ITEM"),
                align: "center",
                key: 'item',
                sorter: (a, b) => { return a.item.localeCompare(b.item) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "DESCRPTION"),
                dataIndex: 'description',
                className: '',
                align: "center",
                className: '',
                key: 'description',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.description.localeCompare(b.description) },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "SERVICE TERM"),
                dataIndex: 'term',
                className: '',
                align: "center",
                className: '',
                key: 'term',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.term.localeCompare(b.term) },
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "UNIT PRICE (CREDITS)"),
                dataIndex: 'unit_price',
                className: '',
                align: "center",
                className: '',
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.unit_price - b.unit_price },

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "QUANTITY"),
                dataIndex: 'quantity',
                className: '',
                align: "center",
                className: '',
                key: 'quantity',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.quantity - b.quantity },

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation[DUMY_TRANS_ID], "LINE TOTAL"),
                dataIndex: 'line_total',
                className: '',
                align: "center",
                className: '',
                key: 'line_total',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.line_total - b.line_total },
                sortDirections: ['ascend', 'descend'],

            },
        ];
        this.state = {
            visible: false,
            addNewUserModal: false,
            isloading: false,
            addNewUserValue: "",
            servicesModal: false,
            client_id: '',
            pgp_email: (this.props.device.pgp_email === 'N/A') ? "" : this.props.device.pgp_email,
            chat_id: (this.props.device.chat_id === 'N/A') ? "" : this.props.device.chat_id,
            sim_id: (this.props.device.sim_id === 'N/A') ? "" : this.props.device.sim_id,
            sim_id2: (this.props.device.sim_id2 === 'N/A') ? "" : this.props.device.sim_id2,
            selectedPackage: null,
            vpn: '',
            packageId: '',
            disableSim: true,
            disableChat: true,
            disablePgp: true,
            disableVpn: true,
            tabselect: '0',
            parent_packages: [],
            product_prices: [],
            products: [],
            packages: [],
            expiry_date: this.props.device.expiry_date,
            services: false,
            checkServices: {
                display: 'none',
            },
            term: false,
            unit_servcies_price: 0,
            total_price: 0,
            invoiceColumns: invoiceColumns,
            PkgSelectedRows: [],
            proSelectedRows: [],
            creditsToRefund: 0,
            serviceRemainingDays: 0
        }
    }
    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    handleSubmit = (e) => {
        // alert('submit', this.props.editDeviceFunc);
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log('edit device form values are: ', values);
                // console.log("Device List", values)
                values.prevPGP = this.props.device.pgp_email;
                values.prevChatID = this.props.device.chat_id;
                values.prevSimId = this.props.device.sim_id;
                values.finalStatus = this.props.device.finalStatus;
                values.prevService = this.props.device.services

                if (this.state.services) {
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
                    let priceToCharge = this.state.total_price - this.state.creditsToRefund


                    if (priceToCharge < this.props.user_credit) {
                        // console.log(this.state.products);
                        values.products = this.state.products;
                        values.packages = this.state.packages;
                        values.expiry_date = this.state.term;
                        values.total_price = priceToCharge
                        values.service = true

                        // if (this.state.type == 1) {
                        showConfirmCredit(this, values);
                        // } else {
                        //     this.props.AddDeviceHandler(values);
                        //     this.props.hideModal();
                        //     this.handleReset();
                        // }
                    } else {
                        let _this = this;
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
                } else {
                    console.log("Device Details ", values)
                    this.props.editDeviceFunc(values);
                    this.props.hideModal();
                    this.handleReset();
                    // console.log('Received values of form: ', values);
                }


            }
        });

    }
    componentDidMount() {
        this.props.getSimIDs();
        this.props.getChatIDs();
        this.props.getPGPEmails();
        this.props.getUserList();
        this.props.getParentPackages()
        this.props.getProductPrices()
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })
        if (this.props !== nextProps) {
            this.setState({
                tabselect: this.props.device.finalStatus === DEVICE_PRE_ACTIVATION ? '0' : '1',
                parent_packages: this.props.device.finalStatus === DEVICE_PRE_ACTIVATION ? [] : this.filterList('1 month', nextProps.parent_packages, 'pkg'),
                product_prices: this.props.device.finalStatus === DEVICE_PRE_ACTIVATION ? [] : this.filterList('1 month', nextProps.product_prices, 'product'),
            })
        }
    }
    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    handleServicesModal = async () => {


        let prevService = this.props.device.services
        console.log(this.props.device);
        let creditsToRefund = 0
        let serviceRemainingDays = 0
        if (prevService) {
            await RestService.getServiceRefund(prevService.id).then((response) => {
                if (RestService.checkAuth(response.data)) {
                    if (response.data.status) {
                        creditsToRefund = response.data.creditsToRefund
                        serviceRemainingDays = response.data.serviceRemainingDays
                    }
                    else {
                        return false
                    }
                }
            });
        }

        if (creditsToRefund !== null) {
            this.setState({
                servicesModal: true,
                creditsToRefund: creditsToRefund,
                serviceRemainingDays: serviceRemainingDays
            })
        }
    }


    handleReset = () => {
        this.props.form.resetFields();
    }

    get_current_date = () => {

        let day = new Date().getDay(); //Current Date
        let month = new Date().getMonth() + 1; //Current Month
        let year = new Date().getFullYear();

        if (day < 10) {
            day = '0' + day;
        }

        if (month < 10) {
            month = '0' + month;
        }

        var current_date = year + '/' + month + '/' + day;
        // console.log('date', current_date);
        return current_date;
    }

    confirmRenderList(packages, products) {
        // console.log(products, packages)
        let counter = 0
        let packagesList = packages.map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.id,
                item: `Package`,
                description: item.pkg_name,
                term: this.state.term + " Month",
                unit_price: item.pkg_price,
                quantity: (this.state.duplicate > 0) ? 1 * this.state.duplicate : 1,
                line_total: (this.state.duplicate > 0) ? item.pkg_price * this.state.duplicate : item.pkg_price
            }
        });
        let productList = products.map((item, index) => {
            // let services = JSON.parse(item.pkg_features)
            counter++
            return {
                counter: counter,
                id: item.id,
                rowKey: item.id,
                item: `Product`,
                description: item.price_for,
                term: (this.state.term === '0') ? "TRIAL" : this.state.term + " Month",
                unit_price: item.unit_price,
                quantity: (this.state.duplicate > 0) ? 1 * this.state.duplicate : 1,
                line_total: (this.state.duplicate > 0) ? item.unit_price * this.state.duplicate : item.unit_price
            }
        });
        // console.log(packagesList)
        return [...packagesList, ...productList]
    }

    handleCancelForm = () => {
        this.setState({
            visible: false,
            addNewUserModal: false,
            addNewUserValue: ''
        });
    }

    createdDate = () => {
        return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
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

    handleCancel = () => {
        this.setState({
            visible: false,
            servicesModal: false,

        });
    }


    handleChangetab = (value) => {
        // console.log(value);
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
                    pkg_name: item.pkg_name
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
                    unit_price: item.unit_price
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
        // console.log(this.props.sim_ids, disableSim);

        this.setState({
            pgp_email: (this.state.pgp_email && !disablePgp) ? this.state.pgp_email : (this.props.pgp_emails.length && !disablePgp) ? this.props.pgp_emails[0].pgp_email : '',
            chat_id: (this.state.chat_id && !disableChat) ? this.state.chat_id : (this.props.chat_ids.length && !disableChat) ? this.props.chat_ids[0].chat_id : '',
            sim_id: (this.state.sim_id && !disableSim) ? this.state.sim_id : (this.props.sim_ids.length > 0 && !disableSim) ? this.props.sim_ids[0].sim_id : '',
            sim_id2: (this.state.sim_id2 && this.sim_id2_included) ? this.state.sim_id2 : (this.sim_id2_included) ? (this.props.sim_ids.length > 1) ? this.props.sim_ids[1].sim_id : undefined : undefined,
            vpn: vpn,
            disableSim: disableSim,
            disableChat: disableChat,
            disablePgp: disablePgp,
            packages: packagesData,
            products: productData,
            expiry_date: expiry_date,
            services: services,
            checkServices: (services) ? { display: 'inline', color: "Red", margin: 0 } : { display: 'none' },
            term: term,
            unit_servcies_price: total_price,
            total_price: this.state.duplicate > 0 ? total_price * this.state.duplicate : total_price,
            PkgSelectedRows: packages,
            proSelectedRows: products
        })
    }


    render() {
        // console.log(this.props.parent_packages, this.props.product_prices)
        // console.log('check edit device: ', this.props.device);
        console.log('props of coming', this.props);
        const { visible, loading, isloading, addNewUserValue } = this.state;
        const { users_list } = this.props;
        var lastObject = users_list[0]
        // console.log(this.props.user);

        return (
            <div>
                <Form onSubmit={this.handleSubmit} autoComplete="new-password">
                    <p className="mb-4">(*)-  {convertToLang(this.props.translation[Required_Fields], "Required Fields")}</p>
                    <Form.Item
                        label={(this.props.device.finalStatus !== DEVICE_PRE_ACTIVATION) ? convertToLang(this.props.translation[DEVICE_ID], DEVICE_ID) : null}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('device_id', {
                            initialValue: this.props.device.device_id,
                        })(

                            <Input type={(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? 'hidden' : ''} disabled />
                        )}
                    </Form.Item>

                    {/* {(isloading ?

                        <div className="addUserSpin">
                            <Spin />
                        </div>
                        :
                        // (this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1') ? null :
                        <Fragment> */}
                            {/* <Form.Item
                                label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                labelCol={{ span: 8, xs: 24, md: 8, sm: 24 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >


                                {this.props.form.getFieldDecorator('user_id', {
                                    initialValue: this.state.addNewUserModal ? lastObject.user_id : this.props.device.user_id,

                                    // rules: [
                                    //     (this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1') ? {} :
                                    //         {
                                    //             required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], "User ID is Required !"),
                                    //         }
                                    // ]
                                })(
                                    <Select
                                        className="pos_rel"
                                        setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                        showSearch
                                        disabled
                                        // disabled={(this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1') ? true : false}
                                        placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
                                        optionFilterProp="children"
                                        onChange={this.handleUserChange}
                                        filterOption={
                                            (input, option) => {
                                                // console.log("searching: ",input," from:", option.props);
                                                // return null;
                                                return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                            }
                                        }
                                        disabled={true}
                                    >
                                        <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                        {users_list.map((item, index) => {
                                            return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                        })}
                                    </Select>
                                )}
                                 {(this.props.user.type === ADMIN || (this.props.device.transfer_status == '1' || this.props.device.transfer_user_status == '1')) ? null :
                                    <Button
                                        className="add_user_btn"
                                        type="primary"
                                        onClick={() => this.handleUserModal()}
                                    >
                                        {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                    </Button>
                                } 

                            </Form.Item> */}

                        {/* </Fragment>
                    )} */}
                    < Form.Item style={{ marginBottom: 0 }}
                    >
                        {this.props.form.getFieldDecorator('dealer_id', {
                            initialValue: this.props.device.dealer_id,
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
                    <Form.Item
                        label={convertToLang(this.props.translation[DUMY_TRANS_ID], "CHANGE SERVICES")}
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
                                    {convertToLang(this.props.translation[DUMY_TRANS_ID], "CHANGE SERVICES")}
                                </Button>
                                <span style={this.state.checkServices}>YOUR SERVICES CHANGED.</span>
                            </Fragment>
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP Email ")}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                    >
                        {this.props.form.getFieldDecorator('pgp_email', {
                            initialValue: this.state.pgp_email,
                            rules: [{
                                type: 'email', message: convertToLang(this.props.translation[Not_valid_Email], 'The input is not valid E-mail!'),
                            }],
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
                                    return (<Select.Option key={pgp_email.id} value={pgp_email.pgp_email.trim()}>{pgp_email.pgp_email.trim()}</Select.Option>)
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
                            initialValue: this.state.sim_id,
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
                            initialValue: this.state.sim_id2,
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
                                <Select.Option value=""> {convertToLang(this.props.translation[DUMY_TRANS_ID], "Select Sim ID 2")}</Select.Option>
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
                            initialValue: this.props.device.vpn
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
                            initialValue: this.props.device.client_id,

                        })(
                            <Input
                                onChange={e => {
                                    this.setState({ client_id: e.target.value });
                                }} />
                        )}
                    </Form.Item>

                    {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? null :
                        <Form.Item
                            label={convertToLang(this.props.translation[Model_text], "Model")}
                            labelCol={{ span: 8, xs: 24, sm: 8 }}
                            wrapperCol={{ span: 14, md: 14, xs: 24 }}
                        >
                            {this.props.form.getFieldDecorator('model', {
                                initialValue: checkValue(this.props.device.model),
                            })(
                                <Input />
                            )}
                        </Form.Item>
                    }
                    <Form.Item
                        label={convertToLang(this.props.translation[Start_Date], "Start Date ")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('start_date', {
                            initialValue: (this.props.device.start_date) ? this.props.device.start_date : this.createdDate()
                        })(

                            <Input disabled />
                        )}
                    </Form.Item>
                    <Form.Item
                        label={convertToLang(this.props.translation[Expire_Date], "Extend Expire Date")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('expiry_date', {
                            initialValue: this.state.expiry_date,
                            // rules: [{
                            //     required: true, message: convertToLang(this.props.translation[Expire_Date_Require], "Expiry Date is Required ! "),
                            // }],
                        })(
                            <Input disabled />
                            // <Select
                            //     style={{ width: '100%' }}
                            // >
                            //     {/* {(this.props.device.finalStatus === DEVICE_TRIAL || this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ? <Select.Option value={0}>{convertToLang(this.props.translation[DEVICE_TRIAL], DEVICE_TRIAL)} (7 {convertToLang(this.props.translation[Days], Days)})</Select.Option> : null} */}
                            //     <Select.Option value={1}> {convertToLang(this.props.translation[one_month], one_month)} </Select.Option>
                            //     <Select.Option value={3}>{convertToLang(this.props.translation[three_month], three_month)}</Select.Option>
                            //     <Select.Option value={6}>{convertToLang(this.props.translation[six_month], six_month)}</Select.Option>
                            //     <Select.Option value={12}>{convertToLang(this.props.translation[twelve_month], twelve_month)}</Select.Option>
                            // </Select>
                        )}

                    </Form.Item>

                    {(this.props.device.finalStatus === DEVICE_PRE_ACTIVATION) ?
                        <Fragment>

                            <Form.Item
                                label={convertToLang(this.props.translation[Device_Valid_For], "VALID FOR(DAYS)  ")}
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                {this.props.form.getFieldDecorator('validity', {
                                    initialValue: this.props.device.validity,
                                    rules: [{
                                        required: true, message: convertToLang(this.props.translation[Device_Valid_days_Required], "Valid days required "),
                                    }],
                                })(
                                    <InputNumber min={1} />
                                )}

                            </Form.Item>

                        </Fragment>
                        :
                        <Fragment>
                            {/* <Form.Item
                                label="Dealer Pin "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.link_code} disabled />

                            </Form.Item>

                            <Form.Item
                                label="IMEI 1 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >

                                <Input type='text' value={this.props.device.imei} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 1 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.simno} disabled />

                            </Form.Item>
                            <Form.Item
                                label="IMEI 2 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >

                                <Input value={this.props.device.imei2} disabled />

                            </Form.Item>
                            <Form.Item
                                label="SIM 2 "
                                labelCol={{ span: 8, xs: 24, sm: 8 }}
                                wrapperCol={{ span: 14, md: 14, xs: 24 }}
                            >
                                <Input value={this.props.device.simno2} disabled />

                            </Form.Item> */}
                        </Fragment>

                    }

                    <Form.Item
                        label={convertToLang(this.props.translation[Device_Note], "Note ")}
                        labelCol={{ span: 8, xs: 24, sm: 8 }}
                        wrapperCol={{ span: 14, md: 14, xs: 24 }}
                    >
                        {this.props.form.getFieldDecorator('note', {
                            initialValue: this.props.device.note,
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

                    <Form.Item className="edit_ftr_btn11"
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: { span: 24, offset: 0 },
                        }}
                    >
                        <Button key="back" type="button" onClick={() => { this.props.handleCancel(); this.handleCancelForm() }} > {convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                        <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                    </Form.Item>

                </Form>
                <AddUser ref="add_user" translation={this.props.translation} />
                <Modal
                    width={750}
                    visible={this.state.servicesModal}
                    title={convertToLang(this.props.translation[DUMY_TRANS_ID], "SEVCIES")}
                    maskClosable={false}
                    onOk={this.handleOk}
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
                        current_services={this.props.device.services}
                        creditsToRefund={this.state.creditsToRefund}
                        type={"edit"}
                        device={this.props.device}
                    />
                </Modal>
            </div >

        )

    }
}

const WrappedEditDeviceForm = Form.create({ name: 'register' })(EditDevice);
// export default WrappedRegistrationForm;

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // getDeviceDetails: getDeviceDetails,
        // importCSV: importCSV
        getSimIDs: getSimIDs,
        getChatIDs: getChatIDs,
        getPGPEmails: getPGPEmails,
        getUserList: getUserList,
        addUser: addUser,
        getParentPackages: getParentPackages,
        getProductPrices: getProductPrices,
    }, dispatch);
}
var mapStateToProps = ({ routing, devices, users, auth, settings, sidebar }) => {
    // console.log("sdfsaf", devices);

    return {
        user: auth.authUser,
        routing: routing,
        sim_ids: devices.sim_ids,
        chat_ids: devices.chat_ids,
        pgp_emails: devices.pgp_emails,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation,
        parent_packages: devices.parent_packages,
        product_prices: devices.product_prices,
        user_credit: sidebar.user_credit,
    };
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(WrappedEditDeviceForm);



function showConfirmCredit(_this, values) {
    let prevPackages = (_this.props.device.services) ? JSON.parse(_this.props.device.services.packages) : []
    let prevProducts = (_this.props.device.services) ? JSON.parse(_this.props.device.services.products) : []
    confirm({
        width: 900,
        title: <span style={{ fontWeight: "bold" }}>Do You Really want to apply selected services on device ? </span>,
        content:
            <Fragment>
                <div style={{ marginTop: 20 }}>
                    <h3 style={{ textAlign: "center" }}><b>CURRENT SERVICES</b></h3>
                    <Table
                        id='packages'
                        className={"devices mb-20"}
                        // rowSelection={packageRowSelection}
                        size="middle"
                        bordered
                        columns={_this.state.invoiceColumns}
                        dataSource={_this.confirmRenderList(prevPackages, prevProducts)}
                        pagination={
                            false
                        }
                    />
                    <h5 style={{ textAlign: "right" }}><b>Remaining days of services : {_this.state.serviceRemainingDays}</b></h5>
                    <h5 style={{ textAlign: "right" }}>Previous service refund credits :  {_this.state.creditsToRefund} Credits</h5>
                </div >


                <div style={{ marginTop: 20 }}>
                    <h3 style={{ textAlign: "center" }}><b>NEW SERVICES</b></h3>
                    <Table
                        id='packages'
                        className={"devices mb-20"}
                        // rowSelection={packageRowSelection}
                        size="middle"
                        bordered
                        columns={_this.state.invoiceColumns}
                        dataSource={_this.confirmRenderList(_this.state.PkgSelectedRows, _this.state.proSelectedRows)}
                        pagination={
                            false
                        }
                    />
                </div >
                {(_this.state.term !== '0') ?
                    <div>
                        <h5 style={{ textAlign: "right" }}>Sub Total :  {_this.state.total_price} Credits</h5>

                        <h5 style={{ textAlign: "right" }}>Previous service refund credits :  {_this.state.creditsToRefund} Credits</h5>
                        <h5 style={{ textAlign: "right" }}><b>Total :  {values.total_price} Credits</b></h5>
                        <h4 style={{ textAlign: "center" }}><b>There will be a charge of {values.total_price} Credits</b></h4>
                    </div>
                    : null}
            </Fragment>,
        onOk() {
            _this.props.editDeviceFunc(values)
            _this.props.hideModal();
            _this.handleReset();
        },
        onCancel() {

        },
    });
}