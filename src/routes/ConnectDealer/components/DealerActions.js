// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

import EditDealer from '../../dealers/components/editDealer';
import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";

// helpers
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";
// import styles from './connect_dealer.css'

export class DealerAction extends Component {

    render() {
        if(!this.props.dealer){
            return null;
        }
        return (
            <Fragment>
                <Card style={{ borderRadius: 12 }}>
                    <Row gutter={16} type="flex" justify="center" align="top">
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button style={{ width: "100%", marginBottom: 16, }} >
                                <h6 className="mb-0">Activity</h6>
                            </Button>
                        </Col>
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">Domains</h6>
                            </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">Credit Limit</h6>
                            </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">DEMO</h6>
                            </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">Payment History</h6>
                            </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button style={{ width: "100%", marginBottom: 16, }}>
                                <h6 className="mb-0">Sales History</h6>
                            </Button>
                        </Col>
                    </Row>
                </Card>
                <Card style={{ borderRadius: 12 }}>
                    <Row gutter={16} type="flex" justify="center" align="top">
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#00336C', color: '#fff' }}
                            >
                                Pass Reset
                        </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button
                                // disabled
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#FF861C', color: '#fff' }}
                                onClick={() => this.refs.editDealer.showModal(this.props.dealer, this.props.editDealer, CONNECT_EDIT_DEALER)}
                            >
                                <Icon type='edit' />
                                Edit
                        </Button>
                        </Col>
                        <Col className="gutter-row" justify="center" span={12} >
                            <Button
                                disabled style={{ width: "100%", marginBottom: 16, }}
                            >
                                Suspend/Restrict
                        </Button>
                        </Col>
                        <Col span={12} className="gutter-row" justify="center" >
                            <Button
                                disabled
                                className="btn_break_line"
                                style={{ width: "100%", marginBottom: 16, backgroundColor: '#f31517', color: '#fff' }}
                            >
                                <Icon type="lock" className="lock_icon" />
                                Delete
                        </Button>
                        </Col>
                    </Row>
                </Card>
                <EditDealer
                    ref='editDealer'
                    // getDealerList={this.props.getDealerList} 
                    translation={this.props.translation}
                />
            </Fragment >
        )
    }

}
