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
    getStandaloneSimsList, changeSimStatus
} from "../../appRedux/actions/StandAloneSims";
import {
    getParentPackages,
    getAllSimIDs
} from "../../appRedux/actions/Devices";

import { StandAloneSimsColumns } from '../utils/columnsUtils';

import AddSim from './components/AddStandAloneSims';
import { ADMIN } from '../../constants/Constants';
import { Tabs } from 'antd';

var copySimList = [];
var status = true;

class StandAloneSims extends Component {
    constructor(props) {
        super(props);
        var columns = StandAloneSimsColumns(props.translation, this.handleSearch);
        this.state = {
            orignalColumns: columns,
            columns: columns,
            standAlonePackages: [],
            tabSelect: '1',
            simsList: props.simsList,
            SearchValues: []
        }
    }

    componentDidMount() {
        this.props.getParentPackages()
        this.props.getStandaloneSimsList()
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let updateState = {}
            if (this.props.translation !== prevProps.translation) {
                updateState.columns = StandAloneSimsColumns(this.props.translation, this.handleSearch)
            }
            // console.log(this.props.simsList.length, prevProps.simsList.length);
            if (this.props.simsList !== prevProps.simsList) {
                updateState.simsList = this.props.simsList
            }
            this.setState(updateState)
        }
    }

    handleComponentSearch = (value) => {
        //       
        try {
            if (value.length) {

                // 

                if (status) {
                    // 
                    copySimList = this.state.simsList;
                    status = false;
                }
                // 
                let foundUsers = componentSearch(copySimList, value);
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
                    users: copySimList,
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
        let simsList = this.props.simsList
        if (tabSelect == 2) {
            columns.splice(5, 1)
            simsList = this.props.simsList.filter(item => item.type == 'device')
        } else if (tabSelect == 3) {
            columns.splice(2, 1)
            simsList = this.props.simsList.filter(item => item.type == 'standalone')
        }

        this.setState({
            tabSelect: tabSelect,
            columns: columns,
            simsList: simsList
        })
    }


    handleSearch = (e) => {
        // 
        // 

        this.state.SearchValues[e.target.name] = { key: e.target.name, value: e.target.value };

        let response = handleMultipleSearch(e, status, copySimList, this.state.SearchValues, this.state.simsList)


        this.setState({
            simsList: response.demoData,
            SearchValues: response.SearchValues
        });
        status = response.copy_status;
        copySimList = response.copyRequireSearchData;
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
                    isAddButton={false}
                    // isAddButton={this.props.user.type !== ADMIN}
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
                    simsList={this.state.simsList}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                    translation={this.props.translation}
                    user={this.props.user}
                    handleChangetab={this.handleChangetab}
                    tabSelect={this.state.tabSelect}
                    changeSimStatus={this.props.changeSimStatus}
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStandaloneSimsList,
        getParentPackages,
        getAllSimIDs,
        changeSimStatus
    }, dispatch);

}
var mapStateToProps = ({ auth, settings, standAloneSims, devices }) => {
    // console.log(devices);
    return {
        user: auth.authUser,
        translation: settings.translation,
        simsList: standAloneSims.standAloneSimsList,
        parent_packages: devices.parent_packages,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandAloneSims);