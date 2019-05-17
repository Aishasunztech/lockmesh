import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { Input, Button, Icon, Select } from "antd";

import { bindActionCreators } from "redux";

import {
    getDevicesList,
    suspendDevice,
    activateDevice,
    editDevice,
    rejectDevice,
    addDevice,
    preActiveDevice,
    deleteUnlinkDevice,
} from "../../appRedux/actions/Devices";

import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    ADMIN,
    DEVICE_TRIAL
} from '../../constants/Constants'

import {
    DEVICE_ID,
    DEVICE_REMAINING_DAYS,
    DEVICE_FLAGGED,
    DEVICE_STATUS,
    DEVICE_MODE,
    DEVICE_NAME,
    DEVICE_ACTIVATION_CODE,
    DEVICE_ACCOUNT_EMAIL,
    DEVICE_PGP_EMAIL,
    DEVICE_CHAT_ID,
    DEVICE_CLIENT_ID,
    DEVICE_DEALER_ID,
    DEVICE_DEALER_PIN,
    DEVICE_MAC_ADDRESS,
    DEVICE_SIM_ID,
    DEVICE_IMEI_1,
    DEVICE_SIM_1,
    DEVICE_IMEI_2,
    DEVICE_SIM_2,
    DEVICE_SERIAL_NUMBER,
    DEVICE_MODEL,
    DEVICE_START_DATE,
    DEVICE_EXPIRY_DATE,
    DEVICE_DEALER_NAME,
    DEVICE_S_DEALER,
    DEVICE_S_DEALER_NAME,
    USER_ID
} from '../../constants/DeviceConstants';

import {
    getDropdown,
    postDropdown,
    postPagination,
    getPagination
} from '../../appRedux/actions/Common';

import {
    getNotification
} from "../../appRedux/actions/Socket";

import AppFilter from '../../components/AppFilter';
import DevicesList from './components/DevicesList';
import ShowMsg from './components/ShowMsg';
// import Column from "antd/lib/table/Column";
import { getStatus, componentSearch, titleCase, dealerColsWithSearch } from '../utils/commonUtils';
import CircularProgress from "components/CircularProgress/index";
import AddDevice from './components/AddDevice';


var coppyDevices = [];
var status = true;

class Devices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                title: '#',
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                width: 800,
            },
            {
                // title: (this.state.tabselect === "5") ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>:'',
                dataIndex: 'action',
                // title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>,
                align: 'center',
                className: 'row',
                width: 800,
            },
            // {
            //     // title: 'ACTIONS',
            //     dataIndex: 'sortOrder',
            //     align: 'center',
            //     className: 'row',
            //     id:"order",
            //     // hide: true,
            //     // sortDirections: ['ascend', 'descend'],
            //     defaultSortOrder: 'ascend'
            // },

            {
                title: (
                    <Input.Search
                        name="validity"
                        key="validity"
                        id="validity"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_REMAINING_DAYS)}
                    />
                ),
                dataIndex: 'validity',
                className: 'hide',
                children: [
                    {
                        title: DEVICE_REMAINING_DAYS,
                        align: "center",
                        dataIndex: 'validity',
                        key: "validity",
                        className: 'hide',
                        sorter: (a, b) => { return a.validity.localeCompare(b.validity) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="device_id"
                        key="device_id"
                        id="device_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_ID)}
                    />
                ),
                dataIndex: 'device_id',
                className: '',
                children: [
                    {
                        title: DEVICE_ID,
                        align: "center",
                        dataIndex: 'device_id',
                        key: "device_id",
                        className: '',
                        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            }, {
                title: (
                    <Input.Search
                        name="user_id"
                        key="user_id"
                        id="user_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(USER_ID)}
                    />
                ),
                dataIndex: 'user_id',
                className: '',
                children: [
                    {
                        title: USER_ID,
                        align: "center",
                        dataIndex: 'user_id',
                        key: "user_id",
                        className: '',
                        sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="status"
                        key="status"
                        id="status"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_STATUS)}
                    />
                ),
                dataIndex: 'status',
                className: '',

                children: [
                    {
                        title: DEVICE_STATUS,
                        align: "center",
                        className: '',
                        dataIndex: 'status',
                        key: 'status',
                        sorter: (a, b) => { console.log('done', a.status); return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="online"
                        key="online"
                        id="online"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_MODE)}
                    />
                ),
                dataIndex: 'online',
                className: '',
                children: [
                    {
                        title: DEVICE_MODE,
                        align: "center",
                        className: '',
                        dataIndex: 'online',
                        key: 'online',
                        sorter: (a, b) => { return a.online.props.children[1].localeCompare(b.online.props.children[1]) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="flagged"
                        key="flagged"
                        id="flagged"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_FLAGGED)}
                    />
                ),
                dataIndex: 'flagged',
                className: '',

                children: [
                    {
                        title: DEVICE_FLAGGED,
                        align: "center",
                        className: '',
                        dataIndex: 'flagged',
                        key: 'flagged',
                        sorter: (a, b) => { console.log('done', a.status); return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="name"
                        key="name"
                        id="name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_NAME)}

                    />
                ),
                className: '',
                dataIndex: 'name',
                editable: true,
                children: [
                    {
                        title: DEVICE_NAME,
                        align: "center",
                        dataIndex: 'name',
                        key: 'name',
                        className: '',
                        sorter: (a, b) => { return a.name.localeCompare(b.name) },
                        sortDirections: ['ascend', 'descend'],
                        editable: true,

                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="account_email"
                        key="account_email"
                        id="account_email"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_ACCOUNT_EMAIL)}
                    />
                ),
                dataIndex: 'account_email',
                className: '',
                children: [
                    {
                        title: DEVICE_ACCOUNT_EMAIL,
                        align: "center",
                        dataIndex: 'account_email',
                        key: 'account_email',
                        className: '',
                        sorter: (a, b) => { return a.account_email.localeCompare(b.account_email) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

            {
                title: (
                    <Input.Search
                        name="pgp_email"
                        key="pgp_email"
                        id="pgp_email"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_PGP_EMAIL)}
                    />
                ),
                dataIndex: 'pgp_email',
                className: '',
                children: [
                    {
                        title: DEVICE_PGP_EMAIL,
                        align: "center",
                        dataIndex: 'pgp_email',
                        className: '',
                        sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="activation_code"
                        key="activation_code"
                        id="activation_code"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_ACTIVATION_CODE)}
                    />
                ),
                dataIndex: 'activation_code',
                className: '',
                children: [
                    {
                        title: DEVICE_ACTIVATION_CODE,
                        align: "center",
                        dataIndex: 'activation_code',
                        className: '',
                        sorter: (a, b) => { return a.activation_code - b.activation_code },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="chat_id"
                        key="chat_id"
                        id="chat_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_CHAT_ID)}
                    />
                ),
                dataIndex: 'chat_id',
                className: '',
                children: [
                    {
                        title: DEVICE_CHAT_ID,
                        align: "center",
                        dataIndex: 'chat_id',
                        key: 'chat_id',
                        className: '',
                        sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="client_id"
                        key="client_id"
                        id="client_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_CLIENT_ID)}
                    />
                ),
                dataIndex: 'client_id',
                className: '',
                children: [
                    {
                        title: DEVICE_CLIENT_ID,
                        align: "center",
                        dataIndex: 'client_id',
                        key: 'client_id',
                        className: '',
                        sorter: (a, b) => { return a.client_id.localeCompare(b.client_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="dealer_id"
                        key="dealer_id"
                        id="dealer_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_DEALER_ID)}
                    />
                ),
                dataIndex: 'dealer_id',
                className: '',
                children: [
                    {
                        title: DEVICE_DEALER_ID,
                        align: "center",
                        dataIndex: 'dealer_id',
                        key: 'dealer_id',
                        className: '',
                        sorter: (a, b) => { return a.dealer_id - b.dealer_id },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="dealer_name"
                        key="dealer_name"
                        id="dealer_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_DEALER_NAME)}
                    />
                ),
                dataIndex: 'dealer_name',
                className: '',
                children: [
                    {
                        title: DEVICE_DEALER_NAME,
                        align: "center",
                        className: '',
                        dataIndex: 'dealer_name',
                        key: 'dealer_name',
                        sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="link_code"
                        key="link_code"
                        id="link_code"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_DEALER_PIN)}
                    />
                ),
                dataIndex: 'dealer_pin',
                className: '',
                children: [
                    {
                        title: DEVICE_DEALER_PIN,
                        align: "center",
                        dataIndex: 'dealer_pin',
                        key: 'dealer_pin',
                        className: '',
                        sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="mac_address"
                        key="mac_address"
                        id="mac_address"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_MAC_ADDRESS)}
                    />
                ),
                dataIndex: 'mac_address',
                className: '',
                children: [
                    {
                        title: DEVICE_MAC_ADDRESS,
                        align: "center",
                        className: '',
                        dataIndex: 'mac_address',
                        key: 'mac_address',
                        sorter: (a, b) => { return a.mac_address.localeCompare(b.mac_address) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="sim_id"
                        key="sim_id"
                        id="sim_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_SIM_ID)}
                    />
                ),
                dataIndex: 'sim_id',
                className: '',
                children: [
                    {
                        title: DEVICE_SIM_ID,
                        align: "center",
                        dataIndex: 'sim_id',
                        key: 'sim_id',
                        className: '',
                        sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="imei"
                        key="imei"
                        id="imei"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_IMEI_1)}
                        onKeyUp={this.handleSearch}
                    />
                ),
                dataIndex: 'imei_1',
                className: '',
                children: [
                    {
                        title: DEVICE_IMEI_1,
                        align: "center",
                        className: '',
                        dataIndex: 'imei_1',
                        key: 'imei_1',
                        sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="simno"
                        key="simno"
                        id="simno"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_SIM_1)}
                    />
                ),
                className: '',
                dataIndex: 'sim_1',
                children: [
                    {
                        title: DEVICE_SIM_1,
                        align: "center",
                        className: '',
                        dataIndex: 'sim_1',
                        key: 'sim_1',
                        sorter: (a, b) => { return a.sim_1.localeCompare(b.sim_1) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="imei2"
                        key="imei2"
                        id="imei2"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_IMEI_2)}
                        onKeyUp={this.handleSearch}
                    />
                ),
                dataIndex: 'imei_2',
                className: '',
                children: [
                    {
                        title: DEVICE_IMEI_2,
                        align: "center",
                        dataIndex: 'imei_2',
                        key: 'imei_2',
                        className: '',
                        sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="simno2"
                        key="simno2"
                        id="simno2"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_SIM_2)}
                    />
                ),
                dataIndex: 'sim_2',
                className: '',
                children: [
                    {
                        title: DEVICE_SIM_2,
                        align: "center",
                        dataIndex: 'sim_2',
                        key: 'sim_2',
                        className: '',
                        sorter: (a, b) => { return a.sim_2.localeCompare(b.sim_2) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="serial_number"
                        key="serial_number"
                        id="serial_number"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_SERIAL_NUMBER)}
                    />
                ),
                dataIndex: 'serial_number',
                className: '',
                children: [
                    {
                        title: DEVICE_SERIAL_NUMBER,
                        align: "center",
                        dataIndex: 'serial_number',
                        key: 'serial_number',
                        className: '',
                        sorter: (a, b) => { return a.serial_number.localeCompare(b.serial_number) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

            {
                title: (
                    <Input.Search
                        name="model"
                        key="model"
                        id="model"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_MODEL)}
                    />
                ),
                dataIndex: 'model',
                className: '',
                children: [
                    {
                        title: DEVICE_MODEL,
                        align: "center",
                        className: '',
                        dataIndex: 'model',
                        key: 'model',
                        sorter: (a, b) => { return a.model.localeCompare(b.model) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

            {
                title: (
                    <Input.Search
                        name="s_dealer"
                        key="s_dealer"
                        id="s_dealer"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_S_DEALER)}
                    />
                ),
                dataIndex: 's_dealer',
                className: '',
                children: [
                    {
                        title: DEVICE_S_DEALER,
                        align: "center",
                        className: '',
                        dataIndex: 's_dealer',
                        key: 's_dealer',
                        sorter: (a, b) => { return a.s_dealer.localeCompare(b.s_dealer) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="s_dealer_name"
                        key="s_dealer_name"
                        id="s_dealer_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_S_DEALER_NAME)}
                    />
                ),
                dataIndex: 's_dealer_name',
                className: '',
                children: [
                    {
                        title: DEVICE_S_DEALER_NAME,
                        align: "center",
                        className: '',
                        dataIndex: 's_dealer_name',
                        key: 's_dealer_name',
                        sorter: (a, b) => { return a.s_dealer_name.localeCompare(b.s_dealer_name) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }, {
                title: (
                    <Input.Search
                        name="start_date"
                        key="start_date"
                        id="start_date"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_START_DATE)}
                    />
                ),
                dataIndex: 'start_date',
                className: '',
                children: [
                    {
                        title: DEVICE_START_DATE,
                        align: "center",
                        className: '',
                        dataIndex: 'start_date',
                        key: 'start_date',
                        sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }, {
                title: (
                    <Input.Search
                        name="expiry_date"
                        key="expiry_date"
                        id="expiry_date"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(DEVICE_EXPIRY_DATE)}
                    />
                ),
                dataIndex: 'expiry_date',
                className: '',
                children: [
                    {
                        title: DEVICE_EXPIRY_DATE,
                        align: "center",
                        className: '',
                        dataIndex: 'expiry_date',
                        key: 'expiry_date',
                        sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
        ];

        this.state = {
            columns: columns,
            searchText: '',
            devices: [],
            tabselect: '4'
        }
        this.copyDevices = [];

        this.handleCheckChange = this.handleCheckChange.bind(this)
        // this.filterDevices = this.filterDevices.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    deleteAllUnlinked = () => {
        alert('Its working')
    }

    filterList = (type, devices) => {
        let dumyDevices = [];

        devices.filter(function (device) {
            // let deviceStatus = getStatus(device.status, device.account_status, device.unlink_status, device.device_status, device.activation_status);
            let deviceStatus = device.finalStatus;
            if (deviceStatus === type) {
                dumyDevices.push(device);
            }
        });

        return dumyDevices;
    }

    handleChange(value) {

        let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
        let indxAction = this.state.columns.findIndex(k => k.dataIndex == 'action');
        if (value == DEVICE_UNLINKED && this.props.user.type == ADMIN) {
            //  indx = this.state.columns.findIndex(k => k.dataIndex =='action');
            if (indxAction >= 0) { this.state.columns.splice(indxAction, 1) }
            //    console.log('CLGGGG', this.state.columns)

        } else {
            if (indxAction < 0) {
                this.state.columns.splice(1, 0, {
                    title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>,
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 800,

                })
            }
        }
        let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex == 'activation_code');
        if (value == DEVICE_UNLINKED && (this.props.user.type != ADMIN)) {
            // console.log('tab 5', this.state.columns);
            this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>;
        }
        else if (value == DEVICE_PRE_ACTIVATION) {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            // console.log('index of 3 tab', indxRemainingDays)
            if (indxAction >= 0) {
                this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >Delete Selected</Button>
            }
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = '';
                this.state.columns[indxRemainingDays].children[0].className = '';
            }
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(2, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }
        else {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            this.state.columns[1]['title'] = '';

            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }

            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }

        switch (value) {
            case DEVICE_ACTIVATED:
                this.setState({
                    devices: this.filterList(DEVICE_ACTIVATED, this.props.devices),
                    column: this.columns,
                    tabselect: '4'
                })

                break;
            case DEVICE_TRIAL:
                this.setState({
                    devices: this.filterList(DEVICE_TRIAL, this.props.devices),
                    column: this.columns,
                    tabselect: '9'
                })

                break;
            case DEVICE_SUSPENDED:
                this.setState({
                    devices: this.filterList(DEVICE_SUSPENDED, this.props.devices),
                    column: this.columns,
                    tabselect: '7'
                })
                break;
            case DEVICE_EXPIRED:
                this.setState({
                    devices: this.filterList(DEVICE_EXPIRED, this.props.devices),
                    column: this.columns,
                    tabselect: '6'
                })
                break;
            case 'all':
                this.setState({
                    devices: this.props.devices,
                    column: this.columns,
                    tabselect: '1'
                })
                break;
            case DEVICE_UNLINKED:
                this.setState({
                    devices: this.filterList(DEVICE_UNLINKED, this.props.devices),
                    column: this.columns,
                    tabselect: '5'
                })
                break;
            case DEVICE_PENDING_ACTIVATION:
                // alert(value);
                this.setState({
                    devices: this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices),
                    column: this.columns,
                    tabselect: '2'
                })
                break;
            case DEVICE_PRE_ACTIVATION:
                this.setState({
                    devices: this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices),
                    column: this.columns,
                    tabselect: '3'
                })
                break;
            default:
                this.setState({
                    devices: this.props.devices,
                    column: this.columns,
                    tabselect: '1'
                })
                break;
        }

    }

    handleChangetab = (value) => {

        let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
        let indxAction = this.state.columns.findIndex(k => k.dataIndex == 'action');
        if (value == '5' && this.props.user.type == ADMIN) {
            //  indx = this.state.columns.findIndex(k => k.dataIndex =='action');
            if (indxAction >= 0) { this.state.columns.splice(indxAction, 1) }
            //    console.log('CLGGGG', this.state.columns)

        } else {
            if (indxAction < 0) {
                this.state.columns.splice(1, 0, {
                    title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>,
                    dataIndex: 'action',
                    align: 'center',
                    className: 'row',
                    width: 800,

                })
            }
        }
        let activationCodeIndex = this.state.columns.findIndex(i => i.dataIndex == 'activation_code');

        if (value == '5' && (this.props.user.type != ADMIN)) {
            // console.log('tab 5', this.state.columns);
            this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>;
        }
        else if (value == '3') {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            // console.log('index of 3 tab', indxRemainingDays)
            if (indxAction >= 0) {
                this.state.columns[indxAction]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >Delete Selected</Button>
            }
            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = '';
                this.state.columns[indxRemainingDays].children[0].className = '';
            }
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(2, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }
        else {
            let indxRemainingDays = this.state.columns.findIndex(k => k.dataIndex == 'validity');
            this.state.columns[1]['title'] = '';

            if (indxRemainingDays >= 0 && indxRemainingDays !== undefined) {
                this.state.columns[indxRemainingDays].className = 'hide';
                this.state.columns[indxRemainingDays].children[0].className = 'hide';
            }
            if (activationCodeIndex >= 0) {
                this.state.columns.splice(11, 0, this.state.columns.splice(activationCodeIndex, 1)[0]);
            }
        }

        var devices = [];
        switch (value) {
            case '4':
                devices = this.filterList(DEVICE_ACTIVATED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '4'
                })
                break;
            case '9':
                devices = this.filterList(DEVICE_TRIAL, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '9'
                })
                break;
            case '7':
                devices = this.filterList(DEVICE_SUSPENDED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '7'
                })
                break;
            case '6':
                devices = this.filterList(DEVICE_EXPIRED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '6'
                })
                break;
            case '1':
                this.setState({
                    devices: this.props.devices,
                    column: this.state.columns,
                    tabselect: '1'
                })
                break;
            case "5":
                devices = this.filterList(DEVICE_UNLINKED, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '5'
                })
                break;
            case "2":
                devices = this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '2'
                })
                break;
            case "3":
                devices = this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices)
                this.setState({
                    devices: devices,
                    column: this.state.columns,
                    tabselect: '3'
                })
                break;
            case "8":
                this.setState({
                    devices: [],
                    column: this.state.columns,
                    tabselect: '8'
                })
                break;
            default:
                this.setState({
                    devices: this.props.devices,
                    column: this.state.columns,
                    tabselect: '1'
                })
                break;
        }
    }


    updateColumn(column, type) {
        if (type === 'hide') {
            column.children[0].className = 'hide';
            return { ...column, className: 'hide' };
        } else if (type === 'show') {
            column.children[0].className = '';
            return { ...column, className: '' };
        }
    }


    handleCheckChange(values) {

        let dumydata = this.state.columns;

        // console.log("dumyData", dumydata);
        if (values.length) {
            this.state.columns.map((column, index) => {


                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                    dumydata[index].children[0].className = 'hide';
                    // dumydata[]
                }
                // console.log(this.state.tabselect)
                values.map((value) => {
                    if (column.className !== 'row') {
                        if (column.children[0].title === value) {
                            if (this.state.tabselect !== '3') {
                                if (column.children[0].title !== 'REMAINING DAYS') {
                                    dumydata[index].className = '';
                                    dumydata[index].children[0].className = '';
                                }
                            }
                            else {
                                dumydata[index].className = '';
                                dumydata[index].children[0].className = '';
                            }
                        }
                    }

                });
            });

            this.setState({ columns: dumydata });
        } else {

            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    column.children[0].className = 'hide';
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({ columns: newState });
        }
        this.props.postDropdown(values, 'devices');

    }

    componentDidUpdate(prevProps) {

        // console.log('updated');
        if (this.props !== prevProps) {
            // console.log('this.props ', this.props.DisplayPages);
            this.setState({
                devices: this.props.devices,
                columns: this.state.columns,
                defaultPagingValue: this.props.DisplayPages,
                selectedOptions: this.props.selectedOptions

            })
            // this.copyDevices = this.props.devices;
            this.handleChangetab(this.state.tabselect)
        }
    }

    handlePagination = (value) => {
        //  alert(value);
        //  console.log('pagination value of ', value)
        this.refs.devcieList.handlePagination(value);
        this.props.postPagination(value, 'devices');
    }
    componentDidMount() {
        this.props.getDevicesList();
        this.props.getDropdown('devices');
        this.props.getPagination('devices');
        // this.props.getNotification();
    }


    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    coppyDevices = this.state.devices;
                    status = false;
                }
                let foundDevices = componentSearch(coppyDevices, value);
                if (foundDevices.length) {
                    this.setState({
                        devices: foundDevices,
                    })
                } else {
                    this.setState({
                        devices: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    devices: coppyDevices,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }

    rejectDevice = (device) => {
        this.props.rejectDevice(device);
    }
    handleFilterOptions = () => {
        return (
            <Select
                showSearch
                placeholder="Show Devices"
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={this.handleChange}
            >

                <Select.Option value="all">All</Select.Option>
                <Select.Option value={DEVICE_ACTIVATED}>Active</Select.Option>
                <Select.Option value={DEVICE_EXPIRED}>Expired</Select.Option>
                <Select.Option value={DEVICE_TRIAL}>Trial</Select.Option>
                <Select.Option value={DEVICE_SUSPENDED}>Suspended</Select.Option>
                <Select.Option value={DEVICE_PRE_ACTIVATION}>Pre Activated</Select.Option>
                <Select.Option value={DEVICE_PENDING_ACTIVATION}>Pending Activation</Select.Option>
                <Select.Option value={DEVICE_UNLINKED}>Unlinked</Select.Option>

            </Select>
        );
    }

    handleDeviceModal = (visible) => {
        let device = {};
        this.refs.add_device.showModal(device, (device) => {
            this.props.preActiveDevice(device);
        }, true);
    }

    refreshComponent = () => {
        this.props.history.push('/devices');
    }
    render() {
        // dealerColsWithSearch();
        return (
            <Fragment>
                {/* <Button type="danger" size="small" onClick={() => dealerColsWithSearch()}>Testing</Button> */}
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Fragment>
                            <AppFilter
                                handleFilterOptions={this.handleFilterOptions}
                                selectedOptions={this.props.selectedOptions}
                                searchPlaceholder="Search Device"
                                defaultPagingValue={this.state.defaultPagingValue}
                                addButtonText="Add Device"
                                options={this.props.options}
                                isAddButton={this.props.user.type !== ADMIN}
                                AddDeviceModal={true}
                                disableAddButton={this.props.user.type === ADMIN}
                                // toLink="add-device"
                                handleDeviceModal={this.handleDeviceModal}
                                handleUserModal={this.handleUserModal}
                                handleCheckChange={this.handleCheckChange}
                                handlePagination={this.handlePagination}
                                handleComponentSearch={this.handleComponentSearch}
                            />

                            <DevicesList
                                devices={this.state.devices}
                                suspendDevice={this.props.suspendDevice}
                                activateDevice={this.props.activateDevice}
                                columns={this.state.columns}
                                rejectDevice={this.rejectDevice}
                                selectedOptions={this.props.selectedOptions}
                                ref="devcieList"
                                pagination={this.props.DisplayPages}
                                addDevice={this.props.addDevice}
                                editDevice={this.props.editDevice}
                                handleChange={this.handleChange}
                                tabselect={this.state.tabselect}
                                handleChangetab={this.handleChangetab}
                                handlePagination={this.handlePagination}
                                deleteUnlinkDevice={this.props.deleteUnlinkDevice}
                                user={this.props.user}
                                refreshComponent={this.refreshComponent}
                                history={this.props.history}
                            />
                            <ShowMsg
                                msg={this.props.msg}
                                showMsg={this.props.showMsg}
                            />
                            <AddDevice ref="add_device" />
                        </Fragment>

                }
            </Fragment>
        );

    }



    handleSearch = (e) => {
        // console.log('============ check search value ========')
        // console.log(e.target.name , e.target.value);

        let demoDevices = [];
        if (status) {
            coppyDevices = this.state.devices;
            status = false;
        }
        //   console.log("devices", coppyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            coppyDevices.forEach((device) => {
                //  console.log("device", device[e.target.name] !== undefined);

                if (device[e.target.name] !== undefined) {
                    if ((typeof device[e.target.name]) === 'string') {
                        // console.log("string check", device[e.target.name])
                        if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else if (device[e.target.name] != null) {
                        // console.log("else null check", device[e.target.name])
                        if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    demoDevices.push(device);
                }
            });
            //  console.log("searched value", demoDevices);
            this.setState({
                devices: demoDevices
            })
        } else {
            this.setState({
                devices: coppyDevices
            })
        }
    }

    // handleReset = (clearFilters) => {
    //     clearFilters();
    //     this.setState({ searchText: '' });
    // }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDevicesList: getDevicesList,
        suspendDevice: suspendDevice,
        activateDevice: activateDevice,
        editDevice: editDevice,
        getDropdown: getDropdown,
        postDropdown: postDropdown,
        rejectDevice: rejectDevice,
        addDevice: addDevice,
        preActiveDevice: preActiveDevice,
        postPagination: postPagination,
        getPagination: getPagination,
        getNotification: getNotification,
        deleteUnlinkDevice: deleteUnlinkDevice,
    }, dispatch);
}

var mapStateToProps = ({ devices, auth }) => {
    // console.log('devices AUTH', auth);
    //   console.log(devices.options,'devices OPTION', devices.selectedOptions);
    return {
        devices: devices.devices,
        msg: devices.msg,
        showMsg: devices.showMsg,
        options: devices.options,
        isloading: devices.isloading,
        selectedOptions: devices.selectedOptions,
        DisplayPages: devices.DisplayPages,
        user: auth.authUser,
        socket: auth.socket
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)