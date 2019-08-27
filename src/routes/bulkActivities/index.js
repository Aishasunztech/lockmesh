import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Modal, Col, Row, Card, Button, Input, Select, Table } from 'antd';

import { Redirect } from 'react-router-dom'
import {

} from '../../appRedux/actions'

import CustomScrollbars from "../../util/CustomScrollbars";

import AppFilter from '../../components/AppFilter';

import {
    convertToLang, componentSearch
} from '../utils/commonUtils'

import { ADMIN } from '../../constants/Constants';
import { Button_Confirm, Button_Cancel } from '../../constants/ButtonConstants';
import { devicesColumns } from '../utils/columnsUtils';

import FilterDeives from './components/filterDevices';

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
        let actionList = [];

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
                        <Row gutter={24} className="">
                            <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Action to be performed:")} </span>
                            </Col>
                            <Col className="col-md-4 col-sm-4 col-xs-4">
                                <Select
                                    style={{ width: '100%' }}
                                    className="pos_rel"
                                    // setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                    showSearch
                                    placeholder={convertToLang(this.props.translation[""], "Select any action")}
                                    optionFilterProp="children"
                                    onChange={this.handleUserChange}
                                    filterOption={
                                        (input, option) => {
                                            // console.log("searching: ",input," from:", option.props);
                                            // return null;
                                            return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                        }
                                    }
                                >
                                    <Select.Option value="">{convertToLang(this.props.translation[""], "Select any action")}</Select.Option>
                                    {actionList.map((item, index) => {
                                        return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <p>Selected: <span className="font_26">PUSH APPS</span></p>
                        {/* <br /> */}
                        <Row gutter={24} className="">
                            <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Dealers:")} </span>
                            </Col>

                            <Col className="col-md-4 col-sm-4 col-xs-4">
                                <Select
                                    style={{ width: '100%' }}
                                    className="pos_rel"
                                    // setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                    showSearch

                                    placeholder={convertToLang(this.props.translation[""], "Select Dealers")}
                                    optionFilterProp="children"
                                    onChange={this.handleUserChange}
                                    filterOption={
                                        (input, option) => {
                                            // console.log("searching: ",input," from:", option.props);
                                            // return null;
                                            return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                        }
                                    }
                                >
                                    <Select.Option value="">{convertToLang(this.props.translation[""], "Select Dealers")}</Select.Option>
                                    {actionList.map((item, index) => {
                                        return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <p>Dealers Selected: <span className="font_26">Hamza, Abaid</span></p>
                        <Row gutter={24} className="">
                            <Col className="col-md-3 col-sm-3 col-xs-3 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Users:")} </span>
                            </Col>

                            <Col className="col-md-4 col-sm-4 col-xs-4">
                                <Select
                                    style={{ width: '100%' }}
                                    className="pos_rel"
                                    // setFieldsValue={this.state.addNewUserModal ? lastObject.user_id : addNewUserValue}
                                    showSearch

                                    placeholder={convertToLang(this.props.translation[""], "Select Users")}
                                    optionFilterProp="children"
                                    onChange={this.handleUserChange}
                                    filterOption={
                                        (input, option) => {
                                            // console.log("searching: ",input," from:", option.props);
                                            // return null;
                                            return (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0)
                                        }
                                    }
                                >
                                    <Select.Option value="">{convertToLang(this.props.translation[""], "Select Users")}</Select.Option>
                                    {actionList.map((item, index) => {
                                        return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <p>Users Selected: <span className="font_26">All</span></p>
                        {/* <Row gutter={24} className="">
                            <Col className="col-md-2 col-sm-2 col-xs-2 vertical_center">
                                <span className=""> {convertToLang(this.props.translation[""], "Select Devices:")} </span>
                            </Col>

                            <Col className="col-md-1 col-sm-1 col-xs-1">
                                <Button type="primary" size="small">Add</Button>
                            </Col>
                            <Col className="col-md-1 col-sm-1 col-xs-1">
                                <Button type="primary" size="small">Add All</Button>
                            </Col>
                            <Col className="col-md-2 col-sm-2 col-xs-2">
                                <Button type="primary" size="small">Add Except Selected</Button>
                            </Col>
                            <Col className="col-md-1 col-sm-1 col-xs-1">
                                <Button type="danger" size="small">Remove All</Button>
                            </Col>
                            <Col className="col-md-2 col-sm-2 col-xs-2">
                                <Button type="danger" size="small">Remove Except Selected</Button>
                            </Col>
                        </Row> */}

                        <FilterDeives />

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