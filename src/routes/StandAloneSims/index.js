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
    getStandaloneSimsList
} from "../../appRedux/actions/StandAloneSims";

import { StandAloneSimsColumns } from '../utils/columnsUtils';

import AddSim from './components/AddStandAloneSims';

var copyUsers = [];
var status = true;

class StandAloneSims extends Component {
    constructor(props) {
        super(props);
        var columns = StandAloneSimsColumns(props.translation, this.handleSearch);
        this.state = {
            columns: columns
        }
    }

    componentDidMount() {
        this.props.getStandaloneSimsList();
    }

    componentWillReceiveProps(nextProps) {
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
                    addButtonText={convertToLang(this.props.translation[""], "ADD SIM")}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    // isAddButton={this.props.user.type !== ADMIN}
                    isAddButton={true}
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
                />
                <SimsList
                    onChangeTableSorting={this.handleTableChange}
                    columns={this.state.columns}
                    simsList={this.props.simsList}
                    pagination={this.props.DisplayPages}
                    ref="userList"
                    translation={this.props.translation}
                    user={this.props.user}
                />
                {/* <UserList/> */}
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getStandaloneSimsList
    }, dispatch);
}
var mapStateToProps = ({ auth, settings, standAloneSims }) => {
    // 
    return {
        user: auth.authUser,
        translation: settings.translation,
        standAloneSimsList: standAloneSims.standAloneSimsList
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(StandAloneSims);