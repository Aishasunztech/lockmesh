import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Col, Row, Card, Button } from 'antd';

import { Redirect } from 'react-router-dom'
import {

} from '../../appRedux/actions'


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
        if (this.props.location.state) {
            return (
                <Fragment>
                    <Card >
                        <Row gutter={16} className="filter_top">
                            <Col className="col-md-6 col-sm-6 col-xs-6 vertical_center">
                                <span className="font_26"> {convertToLang(this.props.translation[""], "BULK ACTIVITIES")} </span>
                            </Col>
                        </Row>
                        <div>
                            <h2>
                                {convertToLang(this.props.translation[""], ` Please select from fields bellow to perform a task on ALL or Selected Devices. You can Track your activities in the "HISTORY" button bellow.`)}
                            </h2>
                        </div>
                        <div>
                            <Button type="primary">
                                {convertToLang(this.props.translation[""], "History")}
                            </Button>
                        </div>

                    </Card>
                    <Card >

                    </Card>

                </Fragment>

            )
        } else {
            return (
                <Redirect to={{
                    pathname: '/app',
                }} />
            )
        }
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