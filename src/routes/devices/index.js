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
    preActiveDevice
} from "../../appRedux/actions/Devices";
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
                // title: 'ACTIONS',
                dataIndex: 'action',
                align: 'center',
                className: 'row',
                width: 800,
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
                        // ...this.getColumnSearchProps('device_id'),
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
                children: [
                    {
                        align: "center",
                        title: 'DEVICE NAME',
                        dataIndex: 'name',
                        key: 'name',
                        className: '',
                        // ...this.getColumnSearchProps('name'),
                        sorter: (a, b) => { return a.name.localeCompare(b.name) },
                        sortDirections: ['ascend', 'descend'],
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
                        // ...this.getColumnSearchProps('account_email'),
                        sorter: (a, b) => { return a.account_email.localeCompare(b.account_email) },
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
                        // ...this.getColumnSearchProps('activation_code'),
                        sorter: (a, b) => { return a.activation_code.localeCompare(b.activation_code) },
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
                        // ...this.getColumnSearchProps('pgp_email'),
                        sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
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
                        // ...this.getColumnSearchProps('chat_id'),
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
                        // ...this.getColumnSearchProps('client_id'),
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
                        // ...this.getColumnSearchProps('dealer_id'),
                        sorter: (a, b) => { return a.dealer_id.localeCompare(b.dealer_id) },
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
                        // ...this.getColumnSearchProps('dealer_pin'),
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

                        // ...this.getColumnSearchProps('mac_address'),
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
                        // ...this.getColumnSearchProps('sim_id'),
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

                        // ...this.getColumnSearchProps('imei_1'),
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

                        // ...this.getColumnSearchProps('sim_1'),
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
                        // ...this.getColumnSearchProps('imei_2'),
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
                        // ...this.getColumnSearchProps('sim_2'),
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
                        // ...this.getColumnSearchProps('serial_number'),
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

                        // ...this.getColumnSearchProps('model'),
                        sorter: (a, b) => { return a.model.localeCompare(b.model) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
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

                        // ...this.getColumnSearchProps('start_date'),
                        sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
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

                        // ...this.getColumnSearchProps('expiry_date'),
                        sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },

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

                        // ...this.getColumnSearchProps('dealer_name'),
                        sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

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
                        title: 'ONLINE',
                        align: "center",
                        className: '',
                        dataIndex: 'online',
                        key: 'online',

                        // ...this.getColumnSearchProps('online'),
                        sorter: (a, b) => { return a.online.localeCompare(b.online) },

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

                        // ...this.getColumnSearchProps('s_dealer'),

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

                        // ...this.getColumnSearchProps('s_dealer_name'),

                        sorter: (a, b) => { return a.s_dealer_name.localeCompare(b.s_dealer_name) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }
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


    filterList = (type, devices) => {
        let dumyDevices = [];

        devices.filter(function (device) {
            let deviceStatus = getStatus(device.status, device.account_status, device.unlink_status, device.device_status, device.activation_status);
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
        switch (value) {
            case 'active':
                this.setState({
                    devices: this.filterList('Activated', this.props.devices),
                    column: this.columns,
                    tabselect: '4'
                })

                break;
            case 'suspended':
                this.setState({
                    devices: this.filterList('Suspended', this.props.devices),
                    column: this.columns,
                    tabselect: '7'
                })
                break;
            case 'expired':
                this.setState({
                    devices: this.filterList('Expired', this.props.devices),
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
            case "unlinked":
                this.setState({
                    devices: this.filterList('Unlinked', this.props.devices),
                    column: this.columns,
                    tabselect: '5'
                })
                break;
            case "pending activation":
                // alert(value);
                this.setState({
                    devices: this.filterList('Pending activation', this.props.devices),
                    column: this.columns,
                    tabselect: '2'
                })
                break;
            case "pre-activated":
                this.setState({
                    devices: this.filterList('Pre-activated', this.props.devices),
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
        switch (value) {
            case '4':
                this.setState({
                    devices: this.filterList('Activated', this.props.devices),
                    column: this.state.columns,
                    tabselect: '4'
                })

                break;
            case '7':
                this.setState({
                    devices: this.filterList('Suspended', this.props.devices),
                    column: this.state.columns,
                    tabselect: '7'
                })
                break;
            case '6':
                this.setState({
                    devices: this.filterList('Expired', this.props.devices),
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
                    devices: this.filterList('Unlinked', this.props.devices),
                    column: this.state.columns,
                    tabselect: '5'
                })
                break;
            case "2":
                this.setState({
                    devices: this.filterList('Pending activation', this.props.devices),
                    column: this.state.columns,
                    tabselect: '2'
                })
                break;
            case "3":
                this.setState({
                    devices: this.filterList('Pre-activated', this.props.devices),
                    column: this.state.columns,
                    tabselect: '3'
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
        this.props.getPagination('devices')
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

    rejectDevice = (device_id) => {
        this.props.rejectDevice(device_id);
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
                <Select.Option value="pending activation">Pending Activation</Select.Option>
                <Select.Option value="pre-activated">Pre Activated</Select.Option>
                <Select.Option value="active">Activated</Select.Option>
                <Select.Option value="unlinked">Unlinked</Select.Option>
                <Select.Option value="expired">Expired</Select.Option>
                <Select.Option value="suspended">Suspended</Select.Option>

            </Select>
        );
    }

    handleDeviceModal = (visible) => {
        let device = {};
        this.refs.add_device.showModal(device, (device) => {
            this.props.preActiveDevice(device);
        }, true);
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
                                isAddButton={this.props.user.type !== 'admin'}
                                AddDeviceModal={true}
                                disableAddButton={this.props.user.type === 'admin'}
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
        getPagination: getPagination
    }, dispatch);
}

var mapStateToProps = ({ devices, auth }) => {
    // console.log('devices AUTH', auth, devices);
    return {
        devices: devices.devices,
        msg: devices.msg,
        showMsg: devices.showMsg,
        options: devices.options,
        isloading: devices.isloading,
        selectedOptions: devices.selectedOptions,
        DisplayPages: devices.DisplayPages,
        user: auth.authUser,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)