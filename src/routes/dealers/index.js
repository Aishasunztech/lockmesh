
import React, { Component } from "react";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { Input, Modal, Select, } from "antd";
import { getDealerList, suspendDealer, deleteDealer, activateDealer, undoDealer, updatePassword, editDealer } from "../../appRedux/actions/Dealers";
import { getDropdown, postDropdown } from '../../appRedux/actions/Common';
import AppFilter from '../../components/AppFilter';
import EditDealer from './components/editDealer';
import CircularProgress from "components/CircularProgress/index";
import DealerList from "./components/dealerList";
import styles from './dealers.css'

import { componentSearch, getDealerStatus } from '../utils/commonUtils';

var coppydealers = [];
var status = true;
let data = [];
const confirm = Modal.confirm;
class Dealers extends Component {

    constructor(props) {
        super(props);

        const columns = [{
            title: '',
            dataIndex: 'accounts',
            align: 'center',
            className: 'row',
            width: 300,

        }, {
            title: '',
            dataIndex: 'actions',
            align: 'center',
            className: 'row',

        },
        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading"
                    placeholder="Device ID"
                    onKeyUp={this.handleSearch}

                />
            ),
            dataIndex: 'dealer_id',
            className: '',
            children: [
                {
                    title: 'DEALER ID',
                    dataIndex: 'dealer_id',
                    key: 'dealer_id',
                    sortDirections: ['ascend', 'descend'],
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.dealer_id.length;
                    // },
                    
                    sorter: (a, b) => a.dealer_id - b.dealer_id,
                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
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
                    placeholder="Dealer Name"
                    onKeyUp={this.handleSearch}

                />
            ),
            dataIndex: 'dealer_name',
            className: '',
            children: [
                {
                    title: 'DEALER NAME',
                    dataIndex: 'dealer_name',
                    key: 'dealer_name',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.dealer_name.length;
                    // },
                    sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_email"
                    key="dealer_email"
                    id="dealer_email"
                    className="search_heading"
                    placeholder="Dealer Email"
                    onKeyUp={this.handleSearch}

                />
            ),
            dataIndex: 'dealer_email',
            className: '',
            children: [
                {
                    title: 'DEALER EMAIL',
                    dataIndex: 'dealer_email',
                    key: 'dealer_email',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.dealer_email.length;
                    // },
                    sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
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
                    placeholder="Dealer Pin"
                    onKeyUp={this.handleSearch}

                />
            ),
            dataIndex: 'link_code',
            className: '',
            children: [
                {
                    title: 'DEALER PIN',
                    dataIndex: 'link_code',
                    key: 'link_code',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.link_code.length;
                    // },
                    sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="connected_devices"
                    key="connected_devices"
                    id="connected_devices"
                    className="search_heading"
                    placeholder="Connected Devices"
                    onKeyUp={this.handleSearch}

                />
            ),
            dataIndex: 'connected_devices',
            className: '',
            children: [
                {
                    title: 'CONNECTED DEVICES',
                    dataIndex: 'connected_devices',
                    key: 'connected_devices',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.connected_devices.length;
                    // },
                    sorter: (a, b) => { return a.connected_devices.localeCompare(b.connected_devices) },

                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_token"
                    key="dealer_token"
                    id="dealer_token"
                    className="search_heading"
                    placeholder="Tokens"
                    onKeyUp={this.handleSearch}

                />
            ),
            dataIndex: 'dealer_token',
            className: '',
            children: [
                {
                    title: 'TOKENS',
                    dataIndex: 'dealer_token',
                    key: 'dealer_token',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.dealer_token.length;
                    // },
                    sorter: (a, b) => { return a.dealer_token.localeCompare(b.dealer_token) },

                }
            ]
        }
        ];
        // console.log('c_length', columns.length);

        this.state = {
            dealers: [],
            loading: false,
            visible: false,
            dealer_type: '',
            columns: columns,
            options: this.props.options,
            pagination: 10,
        };

    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    }


    filterList = (type, dealers) => {
        let dumyDealers = [];
        dealers.filter(function (dealer) {
            let dealerStatus = getDealerStatus(dealer.unlink_status, dealer.account_status);
            if (dealerStatus === type) {
                dumyDealers.push(dealer);
            }
        });
        return dumyDealers;
    }

    handleChange = (value) => {
        let type = value.toLowerCase();
        switch (type) {
            case 'active':
                this.setState({
                    dealers: this.filterList('active', this.props.dealers),
                    column: this.columns
                })

                break;
            case 'suspended':

                this.setState({
                    dealers: this.filterList('suspended', this.props.dealers),
                    column: this.columns
                })
                break;
            case 'all':
                // console.log("dealers list", this.props.dealers);
                this.setState({
                    dealers: this.props.dealers,
                    column: this.columns
                })
                break;
            case "unlinked":
                this.setState({
                    dealers: this.filterList('unlinked', this.props.dealers),
                    column: this.columns
                })
                break;
        }
    }

    handleCheckChange = (values) => {

        let dumydata = this.state.columns;
        // console.log('values', values)
        if (values.length) {
            this.state.columns.map((column, index) => {
                console.log("column", column);
                console.log("index", index);


                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                    dumydata[index].children[0].className = 'hide';
                    // dumydata[]
                }

                values.map((value) => {
                    console.log("valueis", value);
                    console.log("column", column)
                    if (column.className !== 'row') {
                        if (column.children[0].title === value) {
                            dumydata[index].className = '';
                            dumydata[index].children[0].className = '';
                        }
                    }

                });
            });
            console.log("dumy data again", dumydata);

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

        this.props.postDropdown(values, this.state.dealer_type);
    }

    handleFilterOptions = () => {
        return (
            <Select
                showSearch
                placeholder="Show Dealer"
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={this.handleChange}
            >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="unlinked">Unlinked</Select.Option>
                <Select.Option value="suspended">Suspended</Select.Option>
            </Select>
        );
    }


    componentWillMount() {
        //  alert('will mount ');
        const dealer_type = window.location.pathname.split("/").pop();
        // console.log('device type', dealer_type);
        this.props.getDealerList(dealer_type);
        this.setState({
            //  devices: this.props.devices,
            dealer_type: dealer_type
        })
        //    console.log('did mount',this.props.getDropdown(dealer_type));
        this.props.getDropdown(dealer_type);
    }

    testfunc = () => {
        // alert('testing');
        // console.log('testing');
    }

    componentWillReceiveProps(nextProps) {
        // alert("componentWillReceiveProps");
        const dealer_type = nextProps.match.params.dealer_type;
        //  console.log('device type recieved', dealer_type);
        if (this.state.dealer_type !== dealer_type) {
            this.props.getDealerList(dealer_type);
            this.setState({
                dealer_type: dealer_type
            })
            this.props.getDropdown(dealer_type);
        }
    }

    handleComponentSearch = (value) => {

        try {
            if (value.length) {
                if (status) {
                    coppydealers = this.state.dealers;
                    status = false;
                }
                let founddealers = componentSearch(coppydealers, value);
                // console.log("sghuirguheg", founddealers);
                if (founddealers.length) {
                    this.setState({
                        dealers: founddealers,
                    })
                } else {
                    this.setState({
                        dealers: []
                    })
                }
            } else {
                status = true;
                this.setState({
                    dealers: coppydealers,
                })
            }
        } catch (error) {
            // alert(error);
        }
    }


    // renderList() {
    //     data = [];
    //     this.state.dealers.map((dealer) => {
    //         const dealer_status = (dealer.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
    //         const button_type = (dealer_status === "ACTIVATE") ? "dashed" : "danger";
    //         const undo_button_type = (dealer.unlink_status === 0) ? 'danger' : "default";
    //         data.push({
    //             'row_key': dealer.dealer_id,
    //             'accounts': <span>
    //                 <Button type={button_type} size='small' style={{ margin: '0 8px 0 0', width: '60px' }}
    //                     onClick={() => ((dealer.account_status === '') || (dealer.account_status === null)) ? showConfirm(dealer.dealer_id, this.props.suspendDealer, 'SUSPEND') : showConfirm(dealer.dealer_id, this.props.activateDealer, 'ACTIVATE')}>
    //                     {(dealer.account_status === '') ? <div>{dealer_status}</div> : <div> {dealer_status}</div>}
    //                 </Button>
    //                 <Button type="primary" style={{ margin: '0 8px 0 0' }} size='small' onClick={() => this.refs.editDealer.showModal(dealer, this.props.editDealer)}>EDIT</Button>
    //                 <Button type={undo_button_type} size='small' style={{ margin: '0', width: '60px' }}
    //                     onClick={() => (dealer.unlink_status === 0) ? showConfirm(dealer.dealer_id, this.props.deleteDealer, 'DELETE') : showConfirm(dealer.dealer_id, this.props.undoDealer, 'UNDO')}>
    //                     {(dealer.unlink_status === 0) ? <div> DELETE</div> : <div> UNDO</div>}

    //                 </Button>
    //             </span>,
    //             'actions': <Button type="primary" style={{ margin: '0' }} size='small' onClick={() => showConfirm(dealer, this.props.updatePassword, 'RESET PASSWORD')} >RESET PASS</Button>,
    //             'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
    //             'dealer_name': dealer.dealer_name ? dealer.dealer_name : 'N/A',
    //             'dealer_email': dealer.dealer_email ? dealer.dealer_email : 'N/A',
    //             'link_code': dealer.link_code ? dealer.link_code : 'N/A',
    //             'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
    //             'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
    //             'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
    //             'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A'

    //         })
    //     });



    //     return (data);
    // }


    componentDidUpdate(prevProps) {
        console.log('updated');
        
        if (this.props !== prevProps) {
            // alert("componentDidUpdate");
            this.setState({
                dealers: this.props.dealers
            })
        }
    }

    handlePagination = (value) => {
        this.refs.dealerList.handlePagination(value);
    }


    render() {

        // console.log('columns r',this.state.columns.length);
        //  alert('render');

        if ((this.state.dealer_type !== 'dealer') && (this.state.columns.length <= 8) && (this.state.columns !== undefined) && (this.state.options !== undefined) && (this.state.columns !== null)) {
            //  alert('if sdealer')

            this.state.columns.push(
                {
                    title: (
                        <Input.Search
                            name="parent_dealer"
                            key="parent_dealer"
                            id="parent_dealer"
                            className="search_heading"
                            placeholder="Parent Dealer"
                        />
                    ),
                    dataIndex: 'parent_dealer',
                    className: '',
                    children: [
                        {
                            title: 'PARENT DEALER',
                            dataIndex: 'parent_dealer',
                            key: 'parent_dealer',
                            className: '',
                            // sorter: (a, b) => {
                            //     console.log(a);
                            //     // console.log(b);
                            //     return a.parent_dealer.length;
                            // },
                            sorter: (a, b) => { return a.parent_dealer.localeCompare(b.parent_dealer) },

                        }
                    ]
                },
                {
                    title: (
                        <Input.Search
                            name="parent_dealer_id"
                            key="parent_dealer_id"
                            id="parent_dealer_id"
                            className="search_heading"
                            placeholder="Parent Dealer ID"
                        />
                    ),
                    dataIndex: 'parent_dealer_id',
                    className: '',
                    children: [
                        {
                            title: 'PARENT DEALER ID',
                            dataIndex: 'parent_dealer_id',
                            key: 'parent_dealer_id',
                            className: '',
                            // sorter: (a, b) => {
                            //     console.log(a);
                            //     // console.log(b);
                            //     return a.parent_dealer_id.length;
                            // },
                            sorter: (a, b) => { return a.parent_dealer_id.localeCompare(b.parent_dealer_id) },

                        }
                    ]
                }
            )

            this.state.options.push('PARENT DEALER', 'PARENT DEALER ID');

        }
        else if ((this.state.dealer_type === 'dealer') && (this.state.columns.length > 8)) {

            this.state.columns = this.state.columns.filter(lst => lst.title !== 'PARENT DEALER ID');
            this.state.columns = this.state.columns.filter(lst => lst.title !== 'PARENT DEALER');
            this.state.options = this.state.options.slice(0, 6);

        }

        return (

            <div>
                {
                    this.props.isloading ? <CircularProgress /> :

                        <div>

                            <AppFilter
                                handleFilterOptions={this.handleFilterOptions}
                                searchPlaceholder="Search Dealer"
                                defaultPagingValue="10"
                                addButtonText={"Add " + this.state.dealer_type}
                                selectedOptions={this.props.selectedOptions}
                                options={this.state.options}
                                isAddButton={true}
                                dealer_type={this.state.dealer_type}
                                displayOptions={
                                    [
                                        { label: 'Thing 1', value: 1 },
                                        { label: 'Thing 2', value: 2 },
                                    ]
                                }
                                handleCheckChange={this.handleCheckChange}
                                handlePagination={this.handlePagination}
                                handleComponentSearch={this.handleComponentSearch}
                                testfunc={this.testfunc}
                                toLink={"/create-dealer/" + this.state.dealer_type}
                            />
                            <DealerList
                                columns={this.state.columns}
                                dealersList={this.props.dealers}
                                suspendDealer={this.props.suspendDealer}
                                activateDealer={this.props.activateDealer}
                                deleteDealer={this.props.deleteDealer}
                                undoDealer={this.props.undoDealer}
                                editDealer={this.props.editDealer}
                                getDealerList={this.props.getDealerList}

                                ref='dealerList'

                            />
                            {/* <Card>
                        <Table size="middle"
                            className="gx-table-responsive devices table"
                            bordered
                            scroll={{ x: 500 }}
                            columns={this.state.columns}
                            rowKey='row_key'
                            align='center' dataSource={this.renderList()}
                            pagination={{ pageSize: this.state.pagination , size: "midddle"}}
                        />

                    </Card> */}
                            <EditDealer ref='editDealer' getDealerList={this.props.getDealerList} />

                        </div>
                }
            </div>
        );
    }

    handleSearch = (e) => {

        let demoDealers = [];
        if (status) {
            coppydealers = this.state.dealers;
            status = false;
        }
        console.log("devices", coppydealers);

        if (e.target.value.length) {
            console.log("keyname", e.target.name);
            console.log("value", e.target.value);
            console.log(this.state.dealers);
            coppydealers.forEach((dealer) => {
                console.log("device", dealer);

                if (dealer[e.target.name] !== undefined) {
                    if ((typeof dealer[e.target.name]) === 'string') {
                        if (dealer[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealers.push(dealer);
                        }
                    } else if (dealer[e.target.name] != null) {
                        if (dealer[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealers.push(dealer);
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    demoDealers.push(dealer);
                }
            });
            console.log("searched value", demoDealers);
            this.setState({
                dealers: demoDealers
            })
        } else {
            this.setState({
                dealer: coppydealers
            })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }
}


var mapStateToProps = (state) => {
    // console.log("mapStateToProps");
    // console.log(state.dealers.isloading);
    // console.log('state.dealer', state.dealers);
    //  console.log("selected options Dealer", state.dealers.selectedOptions);
    return {
        isloading: state.dealers.isloading,
        dealers: state.dealers.dealers,
        options: state.dealers.options,
        suspended: state.dealers.suspended,
        selectedOptions: state.dealers.selectedOptions,
        action: state.action
    };
}



// function showConfirm(id, action, btn_title) {
//     confirm({
//         title: 'Do you want to ' + btn_title + ' this ' + window.location.pathname.split("/").pop() + ' ?',
//         onOk() {
//             return new Promise((resolve, reject) => {
//                 setTimeout(Math.random() > 0.5 ? resolve : reject);
//                 if (btn_title === 'RESET PASSWORD') {
//                     id.pageName = 'dealer'
//                 }
//                 action(id);
//                 //  success();

//             }).catch(() => console.log('Oops errors!'));
//         },
//         onCancel() { },
//     });
// }


export default connect(mapStateToProps, { getDealerList, suspendDealer, deleteDealer, activateDealer, undoDealer, updatePassword, editDealer, getDropdown, postDropdown })(Dealers)