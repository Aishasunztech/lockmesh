import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
    getAgentList,
    getPagination,
    addAgent
} from '../../appRedux/actions'


import AppFilter from '../../components/AppFilter';
import AgentTabs from './components/AgentTabs';
import AddAgent from './components/AddAgent';

import {
    convertToLang
} from '../utils/commonUtils'
import { dealerAgentColumns } from '../utils/columnsUtils';

class DealerAgent extends Component {
    constructor(props) {
        super(props);
        let columns = dealerAgentColumns(props.translation, this.handleColumnSearch);
        this.state = {
            addAgentModal: false,
            columns: columns
        }
    }

    componentDidMount() {
        this.props.getAgentList();
        // this.props.getPagination('agents');
        // console.log(this.props.location.state);
        // this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.props.users_list.length + ')'
        // this.setState({
        //     users: this.props.users_list,
        //     originalUsers: this.props.users_list,
        //     expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
        // })
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }

    // componentWillReceiveProps(nextProps) {
    //     if (nextProps.users_list !== this.props.users_list) {
    //         this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + nextProps.users_list.length + ')'
    //         // console.log('will recice props is called', nextProps.users_list)
    //         this.setState({
    //             defaultPagingValue: this.props.DisplayPages,
    //             users: nextProps.users_list,
    //             originalUsers: nextProps.users_list,
    //             expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
    //         })

    //     }
    // }

    // componentDidUpdate(prevProps) {
    //     if (this.props !== prevProps) {
    //         // console.log('this.props ', this.props.DisplayPages);
    //         this.state.columns[2].children[0].title = convertToLang(this.props.translation[USER_ID], "USER ID") + ' (' + this.props.users_list.length + ')'
    //         this.setState({
    //             defaultPagingValue: this.props.DisplayPages,
    //             expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
    //         })
    //     }
    //     if (this.props.translation !== prevProps.translation) {
    //         this.setState({ 
    //             columns: usersColumns(this.props.translation, this.handleSearch)
    //          });
    //     }
    // }
    handleColumnSearch = (e) => {
        // console.log('============ check search value ========')
        // console.log(e.target.name , e.target.value);

        // let demoDevices = [];
        // if (this.state.copy_status) {
        //     coppyDevices = this.state.devices;
        //     this.state.copy_status = false;
        // }
        // //   console.log("devices for search", coppyDevices);

        // if (e.target.value.length) {
        //     // console.log("keyname", e.target.name);
        //     // console.log("value", e.target.value);
        //     // console.log(this.state.devices);
        //     coppyDevices.forEach((device) => {
        //         //  console.log("device", device[e.target.name] !== undefined);
        //         if (device[e.target.name] !== undefined) {
        //             if ((typeof device[e.target.name]) === 'string') {
        //                 // console.log("string check", device[e.target.name])
        //                 if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
        //                     demoDevices.push(device);
        //                 }
        //             } else if (device[e.target.name] !== null) {
        //                 // console.log("else null check", device[e.target.name])
        //                 if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
        //                     demoDevices.push(device);
        //                 }
        //             } else {
        //                 // demoDevices.push(device);
        //             }
        //         } else {
        //             // demoDevices.push(device);
        //         }
        //     });
        //     //  console.log("searched value", demoDevices);
        //     this.setState({
        //         devices: demoDevices
        //     })
        // } else {
        //     this.setState({
        //         devices: coppyDevices
        //     })
        // }
    }

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        columns.forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            columns: columns
        });
    }

    handleComponentSearch = (value) => {
        //    console.log('values sr', value)   
        // try {
        //     if (value.length) {

        //         // console.log('length')

        //         if (status) {
        //             // console.log('status')
        //             coppyUsers = this.state.users;
        //             status = false;
        //         }
        //         // console.log(this.state.users,'coppy de', coppyDevices)
        //         let foundUsers = componentSearch(coppyUsers, value);
        //         // console.log('found devics', foundUsers)
        //         if (foundUsers.length) {
        //             this.setState({
        //                 users: foundUsers,
        //             })
        //         } else {
        //             this.setState({
        //                 users: []
        //             })
        //         }
        //     } else {
        //         status = true;

        //         this.setState({
        //             users: coppyUsers,
        //         })
        //     }
        // } catch (error) {
        //     // alert("hello");
        // }
    }

    handleAddUserModal = (visible) => {
        this.setState({
            addAgentModal: visible
        })
    }
    addAgentHandler = (values) => {
        this.props.addAgent(values);
    }
    render() {
        return (
            <Fragment>
                <AppFilter
                    // 1) options and selected options
                    // if options will not be provided, selection will be hidden
                    // options={this.props.options}
                    // selectedOptions={this.props.selectedOptions}
                    // handleCheckChange={this.handleCheckChange}

                    // 2) Filteration 
                    // if handleFilterOptions will not be provided, filteration will not show in appfilter
                    // handleFilterOptions={this.handleFilterOptions}

                    // 3) searching
                    // if handleComponentSearch will not be provided, search will be hidden
                    handleComponentSearch={this.handleComponentSearch}
                    // searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchDevices], "Search Devices")}

                    // 4) Pagination
                    // if handlePagination will not be provided, pagination will be hidden
                    // defaultPagingValue={this.state.defaultPagingValue}
                    // handlePagination={this.handlePagination}

                    // 5) ADD Section
                    // if isAddButton will not be provided, Add Button will be hidden
                    //  common prop of button handler is handleAppFilterAddButton
                    // if we dont want link on button then we will use toLink prop
                    // if we want to disable button use disableAddButton

                    addButtonText={convertToLang(this.props.translation['button.add.agent'], "Add Agent")}
                    isAddButton={true}
                    handleAppFilterAddButton={this.handleAddUserModal}

                    // disableAddButton={this.props.user.type === ADMIN}
                    // toLink="add-device"

                    // language translation
                    translation={this.props.translation}
                />
                <AgentTabs
                    columns={this.state.columns}
                    translation={this.props.translation}
                    dealerAgents={this.props.dealerAgents}
                    onChangeTableSorting={this.handleTableChange}
                />
                <AddAgent
                    addAgentModal={this.state.addAgentModal}
                    handleAddUserModal={this.handleAddUserModal}
                    
                    addAgentHandler={this.addAgentHandler}
                    
                    translation={this.props.translation}
                />
            </Fragment>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getAgentList: getAgentList,
        getPagination: getPagination,
        addAgent: addAgent
    }, dispatch);
}

const mapStateToProps = ({ routing, auth, socket, settings, agents }) => {
    return {
        routing: routing,
        dealerAgents: agents.dealerAgents,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DealerAgent);