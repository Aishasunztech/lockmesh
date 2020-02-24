import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AppFilter from '../../components/AppFilter';
import SimsList from "./components/StandAloneSimsList";
import { componentSearch, convertToLang, handleMultipleSearch, checkIsArray, } from '../utils/commonUtils';

import {
    Appfilter_SearchUser
} from '../../constants/AppFilterConstants';


import {
    getStandaloneSimsList, changeSimStatus
} from "../../appRedux/actions/StandAloneSims";
import {
    getParentPackages,
    getAllSimIDs,
    getInvoiceId,
} from "../../appRedux/actions";

import { StandAloneSimsColumns } from '../utils/columnsUtils';

import AddSim from './components/AddStandAloneSims';
import { ADMIN } from '../../constants/Constants';
import SimFilter from '../../components/SimFilter';

var copySimList = [];
var status = true;

class StandAloneSims extends Component {
    constructor(props) {
        super(props);
        var columns = StandAloneSimsColumns(props.translation, this.handleSearch);
        this.state = {
            orignalColumns: columns,
            columns: columns,
            packages: [],
            tabSelect: '1',
            simsList: props.simsList,
            SearchValues: [],
            totalValue: 0,
            selectedStatusOption: 'all',
            selectedTypeOption: 'all'
        }
    }

    componentDidMount() {
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
            if (this.props.simsList !== prevProps.simsList) {
                updateState.simsList = this.props.simsList
                updateState.totalValue = this.props.simsList.length
            }


            if (updateState != {}) {
                this.setState(updateState)
                // console.log("adsdsa");
            }
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
        this.refs.add_sim.showModal();
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

    handleTypeChange = (type) => {
        let simsList = this.props.simsList
        let status = this.state.selectedStatusOption
        let typeOption = type
        let filteredList = []
        if (typeOption === 'all') {
            if (status === 'all') {
                filteredList = simsList
            } else {
                filteredList = checkIsArray(simsList).filter(item => item.sim_status === status)
            }
        } else {
            if (status === 'all') {
                filteredList = checkIsArray(simsList).filter(item => item.type === typeOption)
            } else {
                filteredList = checkIsArray(simsList).filter(item => item.sim_status === status && item.type === typeOption)
            }
        }
        this.setState({
            totalValue: filteredList.length,
            selectedTypeOption: typeOption
        })
    }

    handleStatusChange = (status) => {
        let simsList = this.props.simsList
        let statusOption = status
        let typeOption = this.state.selectedTypeOption
        let filteredList = []
        if (status === 'all') {
            if (typeOption === 'all') {
                filteredList = simsList
            } else {
                filteredList = checkIsArray(simsList).filter(item => item.type === typeOption)
            }
        } else {
            if (typeOption === 'all') {
                filteredList = checkIsArray(simsList).filter(item => item.sim_status === statusOption)
            } else {
                filteredList = checkIsArray(simsList).filter(item => item.sim_status === statusOption && item.type === typeOption)
            }
        }
        this.setState({
            totalValue: filteredList.length,
            selectedStatusOption: statusOption
        })
    }

    render() {
        // console.log(this.props.getParentPackages);
        return (
            <Fragment>
                <SimFilter
                    searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchUser], "Search")}
                    addButtonText={convertToLang(this.props.translation[""], "Add Standalone Sim")}
                    isAddButton={this.props.user.type !== ADMIN}
                    isAddSimButton={true}
                    handleTypeChange={this.handleTypeChange}
                    handleStatusChange={this.handleStatusChange}
                    handleComponentSearch={this.handleComponentSearch}
                    totalValue={this.state.totalValue}
                    translation={this.props.translation}
                    pageHeading={convertToLang(this.props.translation[""], "SIMS")}
                    typeOptions={[{ name: 'All', value: 'all' }, { name: 'Device Sim', value: 'device' }, { name: 'Standalone Sim', value: 'standalone' }]}
                    statusOptions={[{ name: 'All', value: 'all' }, { name: 'Active', value: 'active' }, { name: 'Suspended', value: 'suspended' }]}
                    selectedTypeOption={this.state.selectedTypeOption}
                    selectedStatusOption={this.state.selectedStatusOption}
                    handleAddSimModal={this.handleAddSimModal}
                />
                <AddSim
                    ref="add_sim"
                    translation={this.props.translation}
                    history={this.props.history}
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
        getAllSimIDs,
        changeSimStatus
    }, dispatch);

}
var mapStateToProps = ({ auth, settings, standAloneSims, devices, users }) => {
    // console.log(devices);
    return {
        user: auth.authUser,
        translation: settings.translation,
        simsList: standAloneSims.standAloneSimsList,

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandAloneSims);