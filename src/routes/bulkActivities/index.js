import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal } from 'antd';

import {

} from '../../appRedux/actions'

import {
    WARNING
} from '../../constants/Constants';

import AppFilter from '../../components/AppFilter';

import {
    convertToLang, componentSearch
} from '../utils/commonUtils'

import { ADMIN } from '../../constants/Constants';
import { Button_Confirm, Button_Cancel } from '../../constants/ButtonConstants';
import { devicesColumns } from '../utils/columnsUtils';


var copyDealerAgents = [];
var status = true;
var copy_status = true;
const confirm = Modal.confirm;

class BulkActivities extends Component {
    constructor(props) {
        super(props);
        let columns = devicesColumns(props.translation, this.handleColumnSearch);
        this.state = {
            columns: columns,
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
    }


    handleColumnSearch = (e) => {

        let demoDealerAgents = [];
        if (copy_status) {
            copyDealerAgents = this.state.dealerAgents;
            copy_status = false;
        }


        if (e.target.value.length) {

            copyDealerAgents.forEach((agent) => {

                if (agent[e.target.name] !== undefined) {
                    if ((typeof agent[e.target.name]) === 'string') {

                        if (agent[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealerAgents.push(agent);
                        }
                    } else if (agent[e.target.name] !== null) {

                        if (agent[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoDealerAgents.push(agent);
                        }
                    } else {

                    }
                } else {
                }
            });
            this.setState({
                dealerAgents: demoDealerAgents
            })
        } else {
            this.setState({
                dealerAgents: copyDealerAgents
            })
        }
    }

    handleComponentSearch = (value) => {

        if (value.length) {

            // console.log('length')

            if (status) {
                copyDealerAgents = this.state.dealerAgents;
                status = false;
            }

            let foundDealerAgents = componentSearch(copyDealerAgents, value);
            // console.log('found devics', foundUsers)
            if (foundDealerAgents.length) {
                this.setState({
                    dealerAgents: foundDealerAgents,
                })
            } else {
                this.setState({
                    dealerAgents: []
                })
            }
        } else {
            // status = true;

            this.setState({
                dealerAgents: copyDealerAgents,
            })
        }

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

                    isAddButton={false}
                    pageHeading={convertToLang(this.props.translation[""], "BULK ACTIVITIES")}
                    // toLink="add-device"

                    // language translation
                    translation={this.props.translation}
                />

            </Fragment>

        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch);
}

const mapStateToProps = ({ routing, auth, socket, settings, agents }) => {
    return {
        user: auth.authUser,
        routing: routing,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(BulkActivities);