// libraries
import React, { Component, Fragment } from "react";
import { Card, Row, Col, List, Button, message, Modal, Progress, Icon, Tabs, Divider, Table, Select } from "antd";

// Components
// import EditDealer from '../../dealers/components/editDealer';

// Helpers
import { convertToLang, formatMoney } from '../../utils/commonUtils'
import { domainColumns } from "../../utils/columnsUtils";
// import { getColor, isBase64, convertToLang } from "../utils/commonUtils"
// import { getDealerDetails, editDealer } from '../../appRedux/actions'
// import RestService from "../../appRedux/services/RestServices";

// Constants
// import { CONNECT_EDIT_DEALER } from "../../../constants/ActionTypes";
// import {
//     Button_Delete,
//     Button_Activate,
//     Button_Connect,
//     Button_Suspend,
//     Button_Undo,
//     Button_passwordreset,
//     Button_Ok,
//     Button_Cancel,

// } from '../../../constants/ButtonConstants';
// import { DO_YOU_WANT_TO, OF_THIS } from '../../../constants/DeviceConstants';
// import {
//     DEALER_TEXT
// } from '../../../constants/DealerConstants';

var domainStatus = true;
var copyDomainList = [];

export default class DealerDomains extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            dealer_id: null,
            domains: []
        }
        this.columns = domainColumns(props.translation, this.handleSearch, true);

    }

    handleSearch = (e) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (domainStatus) {
            copyDomainList = this.props.domains
            domainStatus = false;
        }

        // console.log("copyDomainList ", copyDomainList)
        let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
        // console.log("searchedData ", searchedData)
        this.setState({
            domains: searchedData
        });

    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            originalData.forEach((data) => {
                // console.log(data);
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] != null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    showModal = (dealer, callback) => {
        this.setState({
            visible: true,
            dealer_id: dealer.dealer_id,
        });
        callback(dealer.dealer_id)
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.domains.length !== nextProps.domains.length) {
            this.setState({
                domains: nextProps.domains
            })
        }
    }
    renderDealerDomainList = (list) => {
        console.log("domain list:", list)
        if (list) {
            return list.map((item, index) => {
                return {
                    rowKey: item.id,
                    key: ++index,
                    name: item.name,
                    
                }
            })
        } else {
            return []
        }
    };
    render() {
        const { visible } = this.state;
        return (
            <Fragment>
                <Modal
                    visible={visible}
                    title={""}
                    maskClosable={false}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[
                        <Button
                            key="back"
                            onClick={this.handleCancel}
                        >
                            Close
                            {/* {convertToLang(this.props.translation[Button_Cancel], "Cancel")} */}
                        </Button>,
                        // <Button
                        //     key="submit"
                        //     type="primary"
                        //     onClick={this.handleSubmit}
                        // >
                        //     {convertToLang(this.props.translation[Button_submit], "Submit")}
                        // </Button>,
                    ]}
                >
                    <Table
                        className="pay_history"
                        columns={this.columns}
                        dataSource={this.renderDealerDomainList(this.state.domains)}
                        bordered
                        title={this.pay_history_title}
                        pagination={false}
                        scroll={{ x: true }}
                    />
                </Modal>
            </Fragment >
        )
    }

}
