import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import Highlighter from 'react-highlight-words';
import { Input, Button, Icon, Select } from "antd";
import {
    getDevicesList,
    suspendDevice,
    activateDevice,
    editDevice,
    rejectDevice,
    addDevice,
    preActiveDevice,
    deleteUnlinkDevice
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
    getNotification
} from "../../appRedux/actions/Socket";

import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';

import { bindActionCreators } from "redux";
import AppFilter from '../../components/AppFilter';
import DevicesList from './components/DevicesList';
import ShowMsg from './components/ShowMsg';
// import Column from "antd/lib/table/Column";
import { getStatus, componentSearch } from '../utils/commonUtils';
import CircularProgress from "components/CircularProgress/index";
import { stat } from "fs";
import AddDevice from './components/AddDevice';

var coppyDevices = [];
var status = true;

class Devices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                // title: (this.state.tabselect === "5") ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>:'',
                dataIndex: 'action',
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
                        name="device_id"
                        key="device_id"
                        id="device_id"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Device ID"
                    />
                ),
                dataIndex: 'device_id',
                className: '',
                children: [
                    {
                        title: 'DEVICE ID',
                        align: "center",
                        dataIndex: 'device_id',
                        key: "device_id",
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
                        placeholder="Status"
                    />
                ),
                dataIndex: 'status',
                className: '',

                children: [
                    {
                        title: 'STATUS',
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
                        placeholder="Online"
                    />
                ),
                dataIndex: 'online',
                className: '',
                children: [
                    {
                        title: 'MODE',
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
                        placeholder="Flagged"
                    />
                ),
                dataIndex: 'flagged',
                className: '',

                children: [
                    {
                        title: 'FLAGGED',
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
                        placeholder="Device Name"

                    />
                ),
                className: '',
                dataIndex: 'name',
                editable: true,
                children: [
                    {
                        align: "center",
                        title: 'DEVICE NAME',
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
                        name="email"
                        key="account_email"
                        id="account_email"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Account Email"
                    />
                ),
                dataIndex: 'account_email',
                className: '',
                children: [
                    {
                        title: 'ACCOUNT EMAIL',
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
                        placeholder="PGP Email"
                    />
                ),
                dataIndex: 'pgp_email',
                className: '',
                children: [
                    {
                        title: 'PGP EMAIL',
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
                        placeholder="ACTIVATION CODE"
                    />
                ),
                dataIndex: 'activation_code',
                className: '',
                children: [
                    {
                        title: 'ACTIVATION CODE',
                        align: "center",
                        dataIndex: 'activation_code',
                        className: '',
                        sorter: (a, b) => { return a.activation_code.localeCompare(b.activation_code) },
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
                        placeholder="Chat ID"
                    />
                ),
                dataIndex: 'chat_id',
                className: '',
                children: [
                    {
                        title: 'CHAT ID',
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
                        placeholder="Client ID"
                    />
                ),
                dataIndex: 'client_id',
                className: '',
                children: [
                    {
                        title: 'CLIENT ID',
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
                        placeholder="Dealer ID"
                    />
                ),
                dataIndex: 'dealer_id',
                className: '',
                children: [
                    {
                        title: 'DEALER ID',
                        align: "center",
                        dataIndex: 'dealer_id',
                        className: '',
                        sorter: (a, b) => { return a.dealer_id.localeCompare(b.dealer_id) },
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
                        placeholder="Dealer Name"
                    />
                ),
                dataIndex: 'dealer_name',
                className: '',
                children: [
                    {
                        title: 'DEALER NAME',
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
                        placeholder="Dealer Pin"
                    />
                ),
                dataIndex: 'dealer_pin',
                className: '',
                children: [
                    {
                        title: 'DEALER PIN',
                        align: "center",
                        dataIndex: 'dealer_pin',
                        key: 'dealer_pin',
                        className: '',
                        sorter: (a, b) => { return a.dealer_pin.localeCompare(b.dealer_pin) },
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
                        placeholder="Mac Address"
                    />
                ),
                dataIndex: 'mac_address',
                className: '',
                children: [
                    {
                        title: 'MAC ADDRESS',
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
                        placeholder="Sim ID"
                    />
                ),
                dataIndex: 'sim_id',
                className: '',
                children: [
                    {
                        title: 'SIM ID',
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
                        placeholder="IMEI 1"
                        onKeyUp={this.handleSearch}
                    />
                ),
                dataIndex: 'imei_1',
                className: '',
                children: [
                    {
                        title: 'IMEI 1',
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
                        placeholder="Sim 1"
                    />
                ),
                className: '',
                dataIndex: 'sim_1',
                children: [
                    {
                        align: "center",
                        title: 'SIM 1',
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
                        placeholder="IMEI 2"
                        onKeyUp={this.handleSearch}
                    />
                ),
                dataIndex: 'imei_2',
                className: '',
                children: [
                    {
                        title: 'IMEI 2',
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
                        placeholder="Sim 2"
                    />
                ),
                dataIndex: 'sim_2',
                className: '',
                children: [
                    {
                        title: 'SIM 2',
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
                        placeholder="Serial Number"
                    />
                ),
                dataIndex: 'serial_number',
                className: '',
                children: [
                    {
                        title: 'SERIAL NUMBER',
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
                        placeholder="Model"
                    />
                ),
                dataIndex: 'model',
                className: '',
                children: [
                    {
                        title: 'MODEL',
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
                        placeholder="S Dealer"
                    />
                ),
                dataIndex: 's_dealer',
                className: '',
                children: [
                    {
                        title: 'S-DEALER',
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
                        placeholder="S-Dealer Name"
                    />
                ),
                dataIndex: 's_dealer_name',
                className: '',
                children: [
                    {
                        title: 'S-DEALER NAME',
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
                        placeholder="Start Date"
                    />
                ),
                dataIndex: 'start_date',
                className: '',
                children: [
                    {
                        title: 'START DATE',
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
                        placeholder="Expiry Date"
                    />
                ),
                dataIndex: 'expiry_date',
                className: '',
                children: [
                    {
                        title: 'EXPIRY DATE',
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
            tabselect: '1'
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
        // alert('value');
        // alert(value);
        // value = value.toLowerCase();

        // console.log('clollolol',this.state.columns);
        if (value == DEVICE_UNLINKED && (this.props.user.type !== ADMIN)) {
            this.state.columns[0]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')}>Delete Selected</Button>
        }

        else if (value == '3') {
            this.state.columns[0]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >Delete Selected</Button>
        }
        else {
            this.state.columns[0]['title'] = ''
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

        // alert('value');
        // alert(value);

        // console.log('selsect', this.props.selectedOptions)
        // let type = value.toLowerCase();

        if (value == '5' && (this.props.user.type !== ADMIN)) {
            this.state.columns[0]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>
        }
        else if (value == '3') {
            this.state.columns[0]['title'] = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllPreActivedDevice('pre-active')} >Delete Selected</Button>
        }
        else {
            this.state.columns[0]['title'] = ''
        }

        switch (value) {
            case '4':
                this.setState({
                    devices: this.filterList(DEVICE_ACTIVATED, this.props.devices),
                    column: this.state.columns,
                    tabselect: '4'
                })
                break;
            case '9':
                this.setState({
                    devices: this.filterList(DEVICE_TRIAL, this.props.devices),
                    column: this.state.columns,
                    tabselect: '9'
                })
                break;
            case '7':
                this.setState({
                    devices: this.filterList(DEVICE_SUSPENDED, this.props.devices),
                    column: this.state.columns,
                    tabselect: '7'
                })
                break;
            case '6':
                this.setState({
                    devices: this.filterList(DEVICE_EXPIRED, this.props.devices),
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
                this.setState({
                    devices: this.filterList(DEVICE_UNLINKED, this.props.devices),
                    column: this.state.columns,
                    tabselect: '5'
                })
                break;
            case "2":
                this.setState({
                    devices: this.filterList(DEVICE_PENDING_ACTIVATION, this.props.devices),
                    column: this.state.columns,
                    tabselect: '2'
                })
                break;
            case "3":
                this.setState({
                    devices: this.filterList(DEVICE_PRE_ACTIVATION, this.props.devices),
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

        // this.handleCheckChange(this.props.selectedOptions)

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

                values.map((value) => {
                    if (column.className !== 'row') {
                        if (column.children[0].title === value) {
                            dumydata[index].className = '';
                            dumydata[index].children[0].className = '';
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
        // console.log('pagination value of ', value)
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

        return (
            <Fragment>
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

        let demoDevices = [];
        if (status) {
            coppyDevices = this.state.devices;
            status = false;
        }
        //  console.log("devices", coppyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            coppyDevices.forEach((device) => {
                // console.log("device", device);

                if (device[e.target.name] !== undefined) {
                    if ((typeof device[e.target.name]) === 'string') {
                        // console.log("lsdjfls", device[e.target.name])
                        if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDevices.push(device);
                        }
                    } else if (device[e.target.name] != null) {
                        // console.log("else lsdjfls", device[e.target.name])
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
            // console.log("searched value", demoDevices);
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
        deleteUnlinkDevice: deleteUnlinkDevice
    }, dispatch);
}

var mapStateToProps = ({ devices, auth }) => {
    //   console.log('devices AUTH', devices.devices);
    //  console.log('devices is', devices);
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