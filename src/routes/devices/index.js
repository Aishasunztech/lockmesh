import React, { Component } from "react";
import { connect } from "react-redux";
import { Select } from "antd";
import Highlighter from 'react-highlight-words';
import { Input, Button, Icon } from "antd";
import { 
    getDevicesList, 
    suspendDevice, 
    activateDevice, 
    editDevice
} from "../../appRedux/actions/Devices";
import { getDropdown, postDropdown } from '../../appRedux/actions/Common';

import { bindActionCreators } from "redux";
import AppFilter from '../../components/AppFilter';
import DevicesList from './components/DevicesList';
import ShowMsg from './components/ShowMsg';
// import Column from "antd/lib/table/Column";
import { getStatus, componentSearch } from '../utils/commonUtils';
import CircularProgress from "components/CircularProgress/index";


var coppyDevices = [];
var status = true;


class Devices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            {
                title: 'ACTIONS',
                dataIndex: 'action',
                align: 'center',
                className: 'row',
                width: 800,
            },
            {
                title: 'DEVICE ID',
                dataIndex: 'device_id',
                align: "center",
                className: '',
                ...this.getColumnSearchProps('device_id'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.device_id.length;
                // },
                sorter: (a, b) => {return a.device_id.localeCompare(b.device_id)},

                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'DEVICE NAME',
                dataIndex: 'name',
                align: "center",
                className: '',
                ...this.getColumnSearchProps('name'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.name.length;
                // },
                sorter: (a, b) => {return a.name.localeCompare(b.name)},                
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'ACCOUNT EMAIL',
                dataIndex: 'account_email',
                align: "center",
                className: '',
                ...this.getColumnSearchProps('account_email'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.account_email.length;
                // },
                sorter: (a, b) => {return a.account_email.localeCompare(b.account_email)},
                
                sortDirections: ['ascend', 'descend'],

            },
            {
                title: 'PGP EMAIL',
                align: "center",
                dataIndex: 'pgp_email',
                className: '',
                ...this.getColumnSearchProps('pgp_email'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.pgp_email.length;
                // },
                sorter: (a, b) => {return a.pgp_email.localeCompare(b.pgp_email)},
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'CHAT ID',
                align: "center",
                dataIndex: 'chat_id',
                className: '',
                ...this.getColumnSearchProps('chat_id'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.chat_id.length;
                // },
                sorter: (a, b) => {return a.chat_id.localeCompare(b.chat_id)},
                
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'CLIENT ID',
                align: "center",
                dataIndex: 'client_id',
                className: '',
                ...this.getColumnSearchProps('client_id'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.client_id.length;
                // },
                sorter: (a, b) => {return a.client_id.localeCompare(b.client_id)},
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'DEALER ID',
                align: "center",
                dataIndex: 'dealer_id',
                className: '',
                ...this.getColumnSearchProps('dealer_id'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.dealer_id.length;
                // },
                sorter: (a, b) => {return a.dealer_id.localeCompare(b.dealer_id)},                
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'DEALER PIN',
                align: "center",
                dataIndex: 'dealer_pin',
                className: '',
                ...this.getColumnSearchProps('dealer_pin'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.dealer_pin.length ? a.dealer_pin.length : 0;
                // },
                sorter: (a, b) => {return a.dealer_pin.localeCompare(b.dealer_pin)},                

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'MAC ADDRESS',
                align: "center",
                dataIndex: 'mac_address',
                className: '',
                ...this.getColumnSearchProps('mac_address'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.mac_address.length;
                // },
                sorter: (a, b) => {return a.mac_address.localeCompare(b.mac_address)},                

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'SIM ID',
                align: "center",
                dataIndex: 'sim_id',
                className: '',
                ...this.getColumnSearchProps('sim_id'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.sim_id.length;
                // },
                sorter: (a, b) => {return a.sim_id.localeCompare(b.sim_id)},
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'IMEI 1',
                align: "center",
                dataIndex: 'imei_1',
                className: '',
                ...this.getColumnSearchProps('imei_1'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.imei_1.length;
                // },
                sorter: (a, b) => {return a.imei_1.localeCompare(b.imei_1)},
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'SIM 1',
                align: "center",
                dataIndex: 'sim_1',
                className: '',
                ...this.getColumnSearchProps('sim_1'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.imei_1.length;
                // },
                sorter: (a, b) => {return a.sim_1.localeCompare(b.sim_1)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'IMEI 2',
                align: "center",
                dataIndex: 'imei_2',
                className: '',
                ...this.getColumnSearchProps('imei_2'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.imei_2.length;
                // },
                sorter: (a, b) => {return a.imei_2.localeCompare(b.imei_2)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'SIM 2',
                align: "center",
                dataIndex: 'sim_2',
                className: '',
                ...this.getColumnSearchProps('sim_2'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.sim_2.length;
                // },
                sorter: (a, b) => {return a.sim_2.localeCompare(b.sim_2)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'SERIAL NUMBER',
                align: "center",
                dataIndex: 'serial_number',
                className: '',
                ...this.getColumnSearchProps('serial_number'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.serial_number.length;
                // },
                sorter: (a, b) => {return a.serial_number.localeCompare(b.serial_number)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'STATUS',
                align: "center",
                dataIndex: 'status',
                className: '',
                ...this.getColumnSearchProps('status'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.status.length;
                // },
                sorter: (a, b) => {return a.status.localeCompare(b.status)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'MODEL',
                align: "center",
                dataIndex: 'model',
                className: '',
                ...this.getColumnSearchProps('model'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.model.length;
                // },
                sorter: (a, b) => {return a.model.localeCompare(b.model)},
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'START DATE',
                align: "center",
                dataIndex: 'start_date',
                className: '',
                ...this.getColumnSearchProps('start_date'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.start_date.length;
                // },
                sorter: (a, b) => {return a.start_date.localeCompare(b.start_date)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'EXPIRY DATE',
                align: "center",
                dataIndex: 'expiry_date',
                className: '',
                ...this.getColumnSearchProps('expiry_date'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.expiry_date.length;
                // },
                sorter: (a, b) => {return a.expiry_date.localeCompare(b.expiry_date)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'DEALER NAME',
                align: "center",
                dataIndex: 'dealer_name',
                className: '',
                ...this.getColumnSearchProps('dealer_name'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.dealer_name.length;
                // },
                sorter: (a, b) => {return a.dealer_name.localeCompare(b.dealer_name)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'ONLINE',
                align: "center",
                dataIndex: 'online',
                className: '',
                ...this.getColumnSearchProps('online'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.online.length;
                // },
                sorter: (a, b) => {return a.online.localeCompare(b.online)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'S DEALER',
                align: "center",
                dataIndex: 's_dealer',
                className: '',
                ...this.getColumnSearchProps('s_dealer'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.s_dealer.length;
                // },
                sorter: (a, b) => {return a.s_dealer.localeCompare(b.s_dealer)},

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: 'S DEALER NAME',
                align: "center",
                dataIndex: 's_dealer_name',
                className: '',
                ...this.getColumnSearchProps('s_dealer_name'),
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.s_dealer_name.length;
                // },
                sorter: (a, b) => {return a.s_dealer_name.localeCompare(b.s_dealer_name)},

                sortDirections: ['ascend', 'descend'],
            }
        ];
        this.state = {
            columns: columns,
            searchText: '',
            devices: [],
        }

        this.handleCheckChange = this.handleCheckChange.bind(this)
        // this.filterDevices = this.filterDevices.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }


    filterList = (type, devices) => {
        let dumyDevices = [];

        devices.filter(function (device) {
            let deviceStatus = getStatus(device.status, device.account_status, device.unlink_status, device.device_status);
            if (deviceStatus === type) {
                dumyDevices.push(device);
            }
        });

        return dumyDevices;
    }

    handleChange(value) {
        let type = value.toLowerCase();
        switch (type) {
            case 'active':
                this.setState({
                    devices: this.filterList('active', this.props.devices),
                    column: this.columns
                })

                break;
            case 'suspended':
                this.setState({
                    devices: this.filterList('suspended', this.props.devices),
                    column: this.columns
                })
                break;
            case 'expired':
                this.setState({
                    devices: this.filterList('expired', this.props.devices),
                    column: this.columns
                })
                break;
            case 'all':
                this.setState({
                    devices: this.props.devices,
                    column: this.columns
                })
                break;
            case "unlinked":
                this.setState({
                    devices: this.filterList('unlinked', this.props.devices),
                    column: this.columns
                })
                break;
            case "new-device":
                this.setState({
                    devices: this.filterList('new-device', this.props.devices),
                    column: this.columns,
                })
                break;
            default:
                this.setState({
                    devices: this.props.devices,
                    column: this.columns
                })
                break;
        }

    }


    updateColumn(column, type) {
        if (type === 'hide') {
            return { ...column, className: 'hide' };
        } else if (type === 'show') {
            return { ...column, className: '' };
        }
    }


    handleCheckChange(values) {
        
        let dumydata = this.state.columns;
        if (values.length) {
            this.state.columns.map((column, index) => {
                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                }
                values.map((value) => {
                    if (column.title === value) {
                        dumydata[index].className = '';
                    }
                });
            });
            this.setState({ columns: dumydata });
        } else {

            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({ columns: newState });
        }
        this.props.postDropdown(values, 'devices');

    }
    componentWillMount() {

        // this.props.suspendDevice(device_id);
    }
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                devices: this.props.devices,
                columns: this.state.columns,
            
            })
        }
    }
    handlePagination = (value) => {
        this.refs.devcieList.handlePagination(value);
    }
    componentDidMount() {
        this.props.getDevicesList();
        this.props.getDropdown('devices');
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
                <Select.Option value="new-device">New</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="unlinked">Unlinked</Select.Option>
                <Select.Option value="expired">Expired</Select.Option>
                <Select.Option value="suspended">Suspended</Select.Option>

            </Select>
        );
    }

    render() {

        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress />:
                    <div>
                
                <AppFilter
                    handleFilterOptions={this.handleFilterOptions}
                    selectedOptions = {this.props.selectedOptions}
                    searchPlaceholder="Search Device"
                    defaultPagingValue="10"
                    addButtonText="Add Device"
                    options={this.props.options}
                    isAddButton={false}
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                />

                <DevicesList
                    devices={this.state.devices}
                    suspendDevice={this.props.suspendDevice}
                    activateDevice={this.props.activateDevice}
                    columns={this.state.columns}
                    ref="devcieList"
                    editDevice={this.props.editDevice}
                />

                <ShowMsg
                    msg={this.props.msg}
                    showMsg={this.props.showMsg}
                />
                </div>

                }
            </div>
        );

    }
    getColumnSearchProps = (dataIndex) => ({

        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
            </Button>
                    <Button
                        onClick={() => this.handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
            </Button>
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (

            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),


    })

    // filterDevices = (devices) => {
    //     this.refs.filter.filterDevices(devices);
    // }


    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getDevicesList: getDevicesList,
        suspendDevice: suspendDevice,
        activateDevice: activateDevice,
        editDevice: editDevice,
        getDropdown: getDropdown,
        postDropdown: postDropdown
    }, dispatch);
}
var mapStateToProps = ({ devices }) => {
    // console.log('devices', devices.selectedOptions);
    return {
        devices: devices.devices,
        msg: devices.msg,
        showMsg: devices.showMsg,
        options: devices.options,
        isloading: devices.isloading,
        selectedOptions: devices.selectedOptions
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Devices)