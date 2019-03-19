
import React, { Component } from "react";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { Input, Modal, Select, } from "antd";
import { getDealerList, suspendDealer, deleteDealer, activateDealer, undoDealer, updatePassword, editDealer } from "../../appRedux/actions/Dealers";
import { getDropdown, postDropdown } from '../../appRedux/actions/Common';
// import {getDevicesList} from '../../appRedux/actions/Devices';
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
                    autoComplete="new-password"
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
        //  console.log('values', values)
        if (values.length) {
            this.state.columns.map((column, index) => {
                // console.log("column", column);
                // console.log("index", index);


                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                    dumydata[index].children[0].className = 'hide';
                    // dumydata[]
                }

                values.map((value) => {
                    // console.log("valueis", value);
                    // console.log("column", column)
                    if (column.className !== 'row') {
                        if (column.children[0].title === value) {
                            dumydata[index].className = '';
                            dumydata[index].children[0].className = '';
                        }
                    }

                });
            });
            // console.log("dumy data again", dumydata);

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
       
    }


    componentDidMount(){
        const dealer_type = window.location.pathname.split("/").pop();
        // console.log('device type', dealer_type);
        this.props.getDealerList(dealer_type);
       // this.props.getDevicesList();
        this.props.getDropdown(dealer_type);
        
        // this.setState({
        //     //  devices: this.props.devices,
        //     dealer_type: dealer_type
        // })
        //    console.log('did mount',this.props.getDropdown(dealer_type));
      
    }

    testfunc = () => {
        // alert('testing');
        // console.log('testing');
    }

    componentWillReceiveProps(nextProps) {
        // alert("componentWillReceiveProps");
        const dealer_type = nextProps.match.params.dealer_type;
        //   console.log('device type recieved', dealer_type);
        
        if (this.state.dealer_type !== dealer_type) {
            this.props.getDealerList(dealer_type);
           // this.props.getDevicesList();
            this.setState({
                dealer_type: dealer_type,
                dealers:this.props.dealers,
            })
            this.props.getDropdown(dealer_type);
            this.handleCheckChange(this.props.selectedOptions)
          
        }
    }

    handleComponentSearch = (value) => {

        console.log('searched keyword', value);

        try {
            if (value.length) {
                if (status) {
                    coppydealers = this.state.dealers;
                    status = false;
                }
                let founddealers = componentSearch(coppydealers, value);
                 console.log("found dealers", founddealers);
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


    componentDidUpdate(prevProps) {
        // console.log('updated', this.props.selectedOptions);
        
        if (this.props !== prevProps) {
            // alert("componentDidUpdate");
          
            this.setState({
                dealers: this.props.dealers,
                columns: this.state.columns,
            })
            
             if(this.props.selectedOptions !== prevProps.selectedOptions)
             {
                this.handleCheckChange(this.props.selectedOptions)
             }
            // const dealer_type = window.location.pathname.split("/").pop();
            //  if(this.state.dealer_type !== dealer_type)
            //  {
            //      this.props.getDropdown(dealer_type);
            //  }
        }
        
    }




    handlePagination = (value) => {
        this.refs.dealerList.handlePagination(value);
    }


    render() {

        // console.log('columns r',this.state.columns.length);
        // alert('render');
        //  console.log('render check', this.state.dealer_type, 'columns', this.state.options.length, 'option', this.state.columns)
       // alert('render');
        if ((window.location.pathname.split("/").pop() !== 'dealer') && (this.state.options.length <= 6) && (this.state.columns !== undefined) && (this.state.options !== undefined) && (this.state.columns !== null)) {
            //  alert('if sdealer')
            // console.log('sdealer came')
            this.state.columns.push(
                {
                    title: (
                        <Input.Search
                            name="parent_dealer"
                            key="parent_dealer"
                            id="parent_dealer"
                            className="search_heading"
                            autoComplete="new-password"
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
                            autoComplete="new-password"
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
                            sorter: (a, b) => { return a.parent_dealer_id.localeCompare(b.parent_dealer_id) },

                        }
                    ]
                }
            )

            this.state.options.push('PARENT DEALER', 'PARENT DEALER ID');

        }
        else if ((window.location.pathname.split("/").pop() === 'dealer') && (this.state.columns.length > 8)) {

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
                                dealersList={this.state.dealers}
                                suspendDealer={this.props.suspendDealer}
                                activateDealer={this.props.activateDealer}
                                deleteDealer={this.props.deleteDealer}
                                undoDealer={this.props.undoDealer}
                                editDealer={this.props.editDealer}
                                getDealerList={this.props.getDealerList}
                                updatePassword= {this.props.updatePassword}
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
                dealers: coppydealers
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
    //  console.log("selected options Dealer", state);
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