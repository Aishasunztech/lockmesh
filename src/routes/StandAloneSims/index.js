import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AppFilter from '../../components/AppFilter';
import SimsList from "./components/StandAloneSimsList";
import { componentSearch, convertToLang, handleMultipleSearch, } from '../utils/commonUtils';

import {
    Appfilter_SearchUser
} from '../../constants/AppFilterConstants';


import {
    getStandaloneSimsList,
} from "../../appRedux/actions/StandAloneSims";
import {
    getParentPackages,
} from "../../appRedux/actions/Devices";

import { StandAloneSimsColumns, deviceSimsColumns } from '../utils/columnsUtils';

import AddSim from './components/AddStandAloneSims';
import { ADMIN } from '../../constants/Constants';
import { Tabs } from 'antd';

var copyUsers = [];
var status = true;

class StandAloneSims extends Component {
    constructor(props) {
        super(props);
        var columns = StandAloneSimsColumns(props.translation, this.handleSearch);
        this.state = {
            orignalColumns: columns,
            columns: columns,
            standAlonePackages: [],
            tabSelect: '1'
        }
    }

    componentDidMount() {
        this.props.getStandaloneSimsList();
        this.props.getParentPackages()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.parent_packages.length !== nextProps.parent_packages.length) {
            let standAlonePackages = nextProps.parent_packages.filter(item => item.package_type === 'standalone_sim')
            this.setState({
                standAlonePackages: standAlonePackages
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.translation !== prevProps.translation) {
            this.setState({
                columns: StandAloneSimsColumns(this.props.translation, this.handleSearch)
            });
        }
    }

    handleComponentSearch = (value) => {
        //       
        try {
            if (value.length) {

                // 

                if (status) {
                    // 
                    copyUsers = this.state.users;
                    status = false;
                }
                // 
                let foundUsers = componentSearch(copyUsers, value);
                // 
                if (foundUsers.length) {
                    this.setState({
                        users: foundUsers,
                    })
                } else {
                    this.setState({
                        users: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    users: copyUsers,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }

    handleAddSimModal = () => {
        let handleSubmit = this.props.addSim;
        this.refs.add_sim.showModal(handleSubmit);
    }

    handleChangetab = (tabSelect) => {
        let columns = [...this.state.orignalColumns]

        if (tabSelect == 2) {
            columns.splice(5, 1)
        } else if (tabSelect == 3) {
            columns.splice(2, 1)
        }

        this.setState({
            tabSelect: tabSelect,
            columns: columns
        })
    }


    handleSearch = (e) => {
        // 
        // 

        this.state.SearchValues[e.target.name] = { key: e.target.name, value: e.target.value };

        let response = handleMultipleSearch(e, status, copyUsers, this.state.SearchValues, this.state.users)


        this.setState({
            users: response.demoData,
            SearchValues: response.SearchValues
        });
        status = response.copy_status;
        copyUsers = response.copyRequireSearchData;
    }

    render() {

        return (
            <Fragment>
                <AppFilter
                    searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchUser], "Search")}
                    defaultPagingValue={this.state.defaultPagingValue}
                    addButtonText={convertToLang(this.props.translation[""], "Add StandAlone Sim")}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    // isAddButton={this.props.user.type !== ADMIN}
                    isAddButton={this.props.user.type !== ADMIN}
                    isAddSimButton={true}
                    // AddPolicyModel={true}
                    handleAddSimModal={this.handleAddSimModal}
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                    translation={this.props.translation}
                    pageHeading={convertToLang(this.props.translation[""], "SIMS")}
                />
                <AddSim
                    ref="add_sim"
                    translation={this.props.translation}
                    standAlonePackages={this.state.standAlonePackages}
                />

                <SimsList
                    onChangeTableSorting={this.handleTableChange}
                    columns={this.state.columns}
                    standAloneSimsList={this.props.standAloneSimsList}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                    translation={this.props.translation}
                    user={this.props.user}
                    handleChangetab={this.handleChangetab}
                    tabSelect={this.state.tabSelect}
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStandaloneSimsList,
        getParentPackages
    }, dispatch);

}
var mapStateToProps = ({ auth, settings, standAloneSims, devices }) => {
    console.log(devices);
    return {
        user: auth.authUser,
        translation: settings.translation,
        standAloneSimsList: standAloneSims.standAloneSimsList,
        parent_packages: devices.parent_packages,
        device_sims: standAloneSims.device_sims
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandAloneSims);