import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AddUser from '../../users/components/AddUser';
import { convertToLang } from '../../utils/commonUtils';
import CustomScrollbars from "../../../util/CustomScrollbars";
import { Modal, Button, Form, Input, Select, Radio, InputNumber, Popover, Icon, Row, Col, Spin, Tabs, Card, Table } from 'antd';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { Button_Cancel, Button_submit, Button_Add_User } from '../../../constants/ButtonConstants';
import { SINGLE_DEVICE, DUPLICATE_DEVICES, Required_Fields, USER_ID, DEVICE_ID, USER_ID_IS_REQUIRED, SELECT_PGP_EMAILS, DEVICE_Select_CHAT_ID, SELECT_USER_ID, DEVICE_CLIENT_ID, DEVICE_Select_SIM_ID, DEVICE_MODE, DEVICE_MODEL, Device_Note, Device_Valid_For, Device_Valid_days_Required, DUPLICATE_DEVICES_REQUIRED, DEVICE_IMEI_1, DEVICE_SIM_1, DEVICE_IMEI_2, DEVICE_SIM_2 } from '../../../constants/DeviceConstants';
import { LABEL_DATA_PGP_EMAIL, LABEL_DATA_SIM_ID, LABEL_DATA_CHAT_ID, DUMY_TRANS_ID } from '../../../constants/LabelConstants';
import { Not_valid_Email, POLICY, Start_Date, Expire_Date, Expire_Date_Require } from '../../../constants/Constants';
import {
    PACKAGE_NAME,
    PACKAGE_TERM,
    PACKAGE_SERVICES,
    PACKAGE_PRICE,
    PACKAGE_EXPIRY,
    PACKAGE_SEARCH,
    PACKAGE_SERVICE_NAME,
    PACKAGE_INCLUDED,
    UNIT_PRICE,
} from "../../../constants/AccountConstants";

const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;


class ServicesList extends Component {

    constructor(props) {
        super(props);
        this.confirm = Modal.confirm;

        const packagesColumns = [
            {
                title: convertToLang(this.props.translation[PACKAGE_NAME], "PACKAGE NAME"),
                align: "center",
                className: '',
                dataIndex: 'pkg_name',
                key: 'pkg_name',
                sorter: (a, b) => { return a.pkg_name.localeCompare(b.pkg_name) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["SIM ID"], "SIM ID")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'sim_id',
                key: 'sim_id',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["SIM ID"], "SIM ID 2")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'sim_id2',
                key: 'sim_id2',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["chat"], "CHAT ID")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'chat_id',
                key: 'chat_id',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["pgp"], "PGP EMAIL")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'pgp_email',
                key: 'pgp_email',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(this.props.translation["vpn"], "VPN")}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'vpn',
                key: 'vpn',
                className: 'row '
            },
            {
                title: convertToLang(this.props.translation[PACKAGE_PRICE], "PACKAGE PRICE"),
                align: "center",
                className: '',
                dataIndex: 'pkg_price',
                key: 'pkg_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.pkg_price - b.pkg_price },

                sortDirections: ['ascend', 'descend'],
            },
        ];


        const pricesColumns = [
            {
                dataIndex: 'price_for',
                className: '',
                title: convertToLang(this.props.translation["ITEM"], "ITEM"),
                align: "center",
                key: 'price_term',
                sorter: (a, b) => { return a.price_term.localeCompare(b.price_term) },

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: convertToLang(this.props.translation[UNIT_PRICE], "UNIT PRICE"),
                dataIndex: 'unit_price',
                className: '',
                align: "center",
                className: '',
                key: 'unit_price',
                // ...this.getColumnSearchProps('status'),
                sorter: (a, b) => { return a.unit_price - b.unit_price },

                sortDirections: ['ascend', 'descend'],
            }
        ];


        this.state = {
            searchText: '',
            showMsg: false,
            editing: false,
            msg: "",
            columns: [],
            devices: [],
            pagination: this.props.pagination,
            selectedRows: [],
            selectedRowKeys: [],
            self: this,
            redirect: false,
            user_id: '',
            expandedRowKeys: [],
            dealer_id: '',
            goToPage: '/dealer/dealer',
            pricesColumns: pricesColumns,
            packagesColumns: packagesColumns,
            PkgSelectedRows: [],
            pkgSelectedRowKeys: [],
            proSelectedRows: [],
            proSelectedRowKeys: []

        };
        this.renderList = this.renderList.bind(this);
        this.sideScroll = this.sideScroll.bind(this);
    }

    renderList(type, list) {
        // console.log(list);
        if (type === 'package') {
            return list.map((item, index) => {

                // console.log(item.pkg_features);
                let services = JSON.parse(item.pkg_features)
                // console.log(services);
                return {
                    rowKey: index,
                    pkg_name: item.pkg_name,
                    sim_id: (services.sim_id) ? "YES" : "NO",
                    sim_id2: (services.sim_id2) ? "YES" : "NO",
                    chat_id: (services.chat_id) ? "YES" : "NO",
                    pgp_email: (services.pgp_email) ? "YES" : "NO",
                    vpn: (services.vpn) ? "YES" : "NO",
                    pkg_price: item.pkg_price
                }
            });
        } else {
            return list.map((item, index) => {
                return {
                    rowKey: index,
                    price_for: item.price_for,
                    unit_price: item.unit_price,
                }
            });
        }
    }

    componentDidUpdate(prevProps) {
    }


    resetSeletedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    scrollBack = () => {
        let element = document.getElementById('scrolltablelist');
        // console.log(element.scrollLeft)
        element.scrollLeft += 100;
        // console.log(element.scrollLeft)
        // var element = this.refs.tablelist; //document.getElementsByClassName("scrolltablelist");
        // console.log(element)
        // this.sideScroll(element, 'left', 25, 100, 10);
    }

    scrollNext = () => {
        console.log('hi scroll next')
        var element = this.refs.tablelist; // document.getElementsByClassName("scrolltablelist");  // ant-table-body   scrolltablelist  ant-table-scroll
        this.sideScroll(element, 'right', 25, 100, 10);
    }

    sideScroll(element, direction, speed, distance, step) {
        console.log('hi sideScroll function')
        // element.props.scroll.x=15;
        // element.props.style.scrollMargin="100px";
        console.log('element is: ', element.props);
        // console.log('direction is: ', direction);
        // console.log('speed is: ', speed);
        // console.log('distance is: ', distance);
        // console.log('step is: ', step)

        var scrollAmount = 0;
        // var slideTimer = setInterval(function () {
        //     if (direction === 'left') {
        //         element.scrollLeft -= step;
        //     } else {
        //         element.scrollLeft += step;
        //     }
        //     scrollAmount += step;
        //     if (scrollAmount >= distance) {
        //         window.clearInterval(slideTimer);
        //     }
        // }, speed);
    }

    handlePackageSelect = (selectedRowKeys, selectedRows) => {

        this.setState({ PkgSelectedRows: selectedRows, pkgSelectedRowKeys: selectedRowKeys })

    }
    handlePackageSelect = (selectedRowKeys, selectedRows) => {

        this.setState({ proSelectedRows: selectedRows, proSelectedRowKeys: selectedRowKeys })

    }

    render() {

        // console.log(this.packagesColumns);

        let packageRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.handlePackageSelect(selectedRowKeys, selectedRows)

                // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => {
                if (this.state.pkgSelectedRowKeys.findIndex(record.id)) {
                    console.log("Record found");
                }
                return ({
                    disabled: record.name === 'Disabled User', // Column configuration not to be checked
                    name: record.name,
                })
            },
            //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
        };

        let productRowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                this.handlePriceSelect(selectedRowKeys, selectedRows)

                // console.log(`selectedRowKeys 5: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
            }),
            //  columnTitle: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>
        };

        return (
            <Fragment>
                <div style={{ marginTop: 20 }}>
                    <h1 style={{ textAlign: "center" }}>PACKAGES</h1>
                    <Table
                        id='packages'
                        className={"devices"}
                        rowSelection={packageRowSelection}
                        size="middle"
                        bordered
                        columns={this.state.packagesColumns}
                        dataSource={this.renderList("package", this.props.parent_packages)}
                        pagination={
                            false
                        }
                    />
                </div >


                <div style={{ marginTop: 20 }} >
                    <h1 style={{ textAlign: "center" }}>PRODUCTS</h1>
                    <Table
                        id='products'
                        className={"devices"}
                        rowSelection={productRowSelection}
                        size="middle"
                        bordered
                        columns={this.state.pricesColumns}
                        dataSource={this.renderList("product", this.props.product_prices)}
                        pagination={
                            false
                        }
                    />


                </div >

            </Fragment>

        )
    }

    handleSuspendDevice = (device) => {
        this.refs.suspend.handleSuspendDevice(device);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

    handleRejectDevice = (device) => {

        this.props.rejectDevice(device)
    }
    addDevice = (device) => {
        // console.log(device);
        // this.props.addDevice(device);
    }

}

class Services extends Component {

    constructor(props) {
        super(props);
        this.state = {
            client_id: '',
            pgp_email: '',
            chat_id: '',
            sim_id: '',
            selectedPackage: null,
            vpn: '',
            packageId: '',
            disableSim: true,
            disableChat: true,
            disablePgp: true,
            disableVpn: true,
            servicesModal: false
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
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {

    }

    handleReset = () => {
    }


    handleCancel = () => {
        this.setState({
            visible: false,
            servicesModal: false
        });
    }
    handleChange = (e) => {
        // console.log(e);
        // this.setState({ pgp_email: e }); 
        this.setState({ type: e.target.value });
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

    callback = (key) => {
        this.props.handleChangetab(key);
    }

    render() {


        return (
            <Fragment>
                <div>
                    <Tabs type="card" className="dev_tabs" activeKey={this.props.tabselect} onChange={this.callback}>
                        <TabPane tab={<span className="green">1 MONTH</span>} key="1" >
                        </TabPane>
                        <TabPane tab={<span className="green">3 MONTH</span>} key="3" >
                        </TabPane>
                        <TabPane tab={<span className="green">6 MONTH</span>} key="6" >
                        </TabPane>
                        <TabPane tab={<span className="green">12 MONTH</span>} key="12" >
                        </TabPane>
                    </Tabs>
                    <ServicesList
                        parent_packages={this.props.parent_packages}
                        product_prices={this.props.product_prices}
                        ref="devciesList"
                        tabselect={this.props.tabselect}
                        // resetTabSelected={this.resetTabSelected}
                        user={this.props.user}
                        history={this.props.history}
                        translation={this.props.translation}
                    />
                </div>
            </Fragment>
        )

    }
}

const WrappedAddDeviceForm = Form.create({ name: 'register' })(Services);

export default WrappedAddDeviceForm;
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