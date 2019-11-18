// libraries
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs } from "antd";

// methods, constants and components
import AppFilter from '../../components/AppFilter';

import { getColor, isBase64, convertToLang } from "../utils/commonUtils"


const success = Modal.success
const error = Modal.error
const TabPane = Tabs.TabPane;
class ConnectDealer extends Component {

    constructor(props) {
        super(props);
        this.state = {

            dealer_id: isBase64(props.match.params.dealer_id),
        }
        // console.log("hello every body", this.props);
    }


    componentDidMount() {
        const dealer_id = isBase64(this.props.match.params.dealer_id);
        alert(dealer_id);
    }


    componentDidUpdate(prevProps) {
        // console.log('hi')
        const dealer_id = isBase64(this.props.match.params.dealer_id);

    }

    componentWillReceiveProps(nextProps) {
        const dealer_id = isBase64(nextProps.match.params.dealer_id);

    }


    componentWillUnmount() {
        const dealer_id = isBase64(this.props.match.params.dealer_id);
    }

    render() {
        return (
            <Fragment>
                <AppFilter
                    pageHeading="Dealer Profile Page"
                />
                <Row gutter={16} type="flex" align="top">
                    <Col className="gutter-row left_bar" xs={24} sm={24} md={24} lg={24} xl={8} span={8}>
                        {/* <DeviceSidebar
                            device_details={this.props.device_details}
                            refreshDevice={this.refreshDevice}
                            startLoading={this.props.startLoading}
                            endLoading={this.props.endLoading}
                            auth={this.props.auth}
                            translation={this.props.translation}
                        /> */}
                        <div>
                            <Card className="manage_sec_pro height_auto" style={{ borderRadius: 12 }}>
                                
                            </Card>
                        </div>
                    </Col>
                    <Col className="gutter-row action_group" span={8} xs={24} sm={24} md={24} lg={24} xl={8}>

                    </Col>
                    <Col className="gutter-row right_bar" xs={24} sm={24} md={24} lg={24} xl={8}>
                        {/* <SideActions
                            translation={this.props.translation}
                            device={this.props.device_details}
                            profiles={this.props.profiles}
                            policies={this.props.policies}
                            histories={this.props.histories}
                            activateDevice={this.props.activateDevice2}
                            suspendDevice={this.props.suspendDevice2}
                            editDevice={this.props.editDevice}
                            unlinkDevice={this.props.unlinkDevice}
                            flagged={this.props.flagged}
                            unflagged={this.props.unflagged}
                            wipe={this.props.wipe}
                            checkPass={this.props.checkPass}
                            history={this.props.history}
                            getDevicesList={this.props.getDevicesList}
                            refreshDevice={this.refreshDevice}
                            imei_list={this.props.imei_list}
                            apk_list={this.state.apk_list}
                        // applySetting = {this.applyActions}
                        /> */}

                    </Col>
                </Row>

            </Fragment>
        )

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ routing, device_details, auth, socket, settings }, ownProps) => {


    return {

    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectDealer);