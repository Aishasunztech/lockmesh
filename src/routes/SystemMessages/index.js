import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Avatar, Row, Col, Table } from "antd";
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import CircularProgress from "components/CircularProgress";
import { getDomains, domainPermission } from "../../appRedux/actions/Account";
import AppFilter from "../../components/AppFilter";
import { convertToLang } from '../utils/commonUtils'
import { BASE_URL } from '../../constants/Application';
import ListMsgs from './components/ListMsgs';
import SendMsgForm from './components/SendMsgForm';

import { getAllDealers } from "../../appRedux/actions/Dealers";
import { getUserList } from "../../appRedux/actions/Users";
import {
    getBulkDevicesList,
    setSelectedBulkDevices,
    sendBulkMsg,
    closeResponseModal,
    setBulkMsg
} from "../../appRedux/actions/BulkDevices";

import { componentSearch, titleCase } from "../utils/commonUtils";
import { ACTION, Alert_Delete_APK, SEARCH } from "../../constants/Constants";
import { Button_Save, Button_Yes, Button_No } from "../../constants/ButtonConstants";
import { systemMsgColumns } from "../utils/columnsUtils";
import { Tab_Active, Tab_All, Tab_Disabled } from "../../constants/TabConstants";

var status = true;
var coppyApks = [];
var domainStatus = true;
var copyDomainList = [];

class SystemMessages extends Component {

    constructor(props) {
        super(props);
        var columns = systemMsgColumns(props.translation, this.handleSearch);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            apk_list: [],
            domainList: [],
            uploadApkModal: false,
            showUploadModal: false,
            showUploadData: {},
            columns: columns,
            visible: false,
            bulkResponseModal: false,

        }
        this.confirm = Modal.confirm;
    }

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        columns.forEach(column => {
            // if (column.children) {
            if (Object.keys(sorter).length > 0) {
                if (column.dataIndex == sorter.field) {
                    if (this.state.sorterKey == sorter.field) {
                        column['sortOrder'] = sorter.order;
                    } else {
                        column['sortOrder'] = "ascend";
                    }
                } else {
                    column['sortOrder'] = "";
                }
                this.setState({ sorterKey: sorter.field });
            } else {
                if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
            }
            // }
        })
        this.setState({
            columns: columns
        });
    }

    // delete
    handleConfirmDelete = (appId, appObject) => {
        this.confirm({
            title: convertToLang(this.props.translation[Alert_Delete_APK], "Are you sure, you want to delete the Apk ?"),
            content: <Fragment>
                <Avatar size="small" src={BASE_URL + "users/getFile/" + appObject.logo} />
                {` ${appObject.apk_name} - ${appObject.size}`}
            </Fragment>,
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk: () => {
                this.props.deleteApk(appId);
                return new Promise((resolve, reject) => {
                    setTimeout((5 > 0.5 ? resolve : reject));
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    // toggleStatus
    handleStatusChange = (checked, appId) => {
        this.props.changeAppStatus(appId, checked);
    }


    componentWillReceiveProps(nextProps) {
        if (this.props.domainList !== nextProps.domainList) {
            this.setState({
                domainList: nextProps.domainList,
            })
        }
    }

    handlePagination = (value) => {
        this.refs.list_msgs.handlePagination(value);
    }

    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    coppyApks = this.state.domainList;
                    status = false;
                }
                let foundApks = componentSearch(coppyApks, value);
                if (foundApks.length) {
                    this.setState({
                        domainList: foundApks,
                    })
                } else {
                    this.setState({
                        domainList: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    domainList: coppyApks,
                })
            }
        } catch (error) {
            alert("hello");
        }
    }


    filterList = (type, dealers) => {
        let dumyDealers = [];
        dealers.filter(function (apk) {
            let dealerStatus = apk.apk_status;
            if (dealerStatus === type) {
                dumyDealers.push(apk);
            }
        });
        return dumyDealers;
    }


    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                domainList: this.props.domainList
            })
        }
        if (this.props.bulkResponseModal !== prevProps.bulkResponseModal) {
            this.setState({
                bulkResponseModal: this.props.bulkResponseModal
            })
        }
    }

    handleCancelResponseModal = () => {
        this.setState({
            bulkResponseModal: false
        })
        this.props.closeResponseModal();
    }
    componentDidMount() {
        // this.props.getDomains();
        // this.props.getAllDealers();
        // this.props.getUserList();

    }

    handleUploadApkModal = (visible) => {
        this.setState({
            uploadApkModal: visible
        });
        this.props.resetUploadForm(false)
    }
    hideUploadApkModal = () => {
        this.setState({
            uploadApkModal: false
        });
        this.props.resetUploadForm(true)
    }

    handleSendMsgButton = (visible) => {
        this.setState({ visible })
    }



    render() {
        // console.log("this.state.dealerList:: render func ", this.state.domainList)
        const {
            response_modal_action,
            failed_device_ids,
            expire_device_ids,
            queue_device_ids,
            pushed_device_ids,
        } = this.props;

        let failedTitle = '';
        let offlineTitle = '';
        let onlineTitle = '';

        if (response_modal_action === "msg") {
            failedTitle = "Failed to Pull apps from these Devices";
            offlineTitle = "(Apps will be Pulled soon from these devices. Action will be performed when devices back online)"
            onlineTitle = "Apps will be Pulled soon from these Devices";
        }
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <div>
                            <AppFilter
                                translation={this.props.translation}
                                defaultPagingValue={this.props.DisplayPages}
                                handlePagination={this.handlePagination}
                                isAddButton={true}
                                handleSendMsgModal={true}
                                handleSendMsgButton={this.handleSendMsgButton}
                                pageHeading={convertToLang(this.props.translation[""], "System Messages")}
                                addButtonText={convertToLang(this.props.translation[""], "Send New Message")}
                            />

                            <ListMsgs
                                totalDealers={this.props.dealerList.length}
                                savePermission={this.props.domainPermission}
                                onChangeTableSorting={this.handleTableChange}
                                handleStatusChange={this.handleStatusChange}
                                domainList={this.state.domainList}
                                handleConfirmDelete={this.handleConfirmDelete}
                                editApk={this.props.editApk}
                                columns={this.state.columns}
                                getApkList={this.props.getApkList}
                                pagination={this.props.DisplayPages}
                                user={this.props.user}
                                ref="list_msgs"
                                translation={this.props.translation}
                            />
                        </div>
                }
                {/* Send Message modal */}
                <Modal
                    title={convertToLang(this.props.translation[""], "Send Message to Selected Devcies")}
                    width={"850px"}
                    maskClosable={false}
                    style={{ top: 20 }}
                    visible={this.state.visible}
                    onOk={() => this.setState({ visible: false })}
                    onCancel={() => this.setState({ visible: false })}
                    // className="load_policy_popup"
                    footer={false}
                // okText={convertToLang(this.props.translation[Button_Ok], "SEND")}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <SendMsgForm
                        setSelectedBulkDevices={this.props.setSelectedBulkDevices}
                        sendMsgOnDevices={this.props.sendBulkMsg}
                        setBulkMsg={this.props.setBulkMsg}
                        bulkMsg={this.props.bulkMsg}
                        handleCancelSendMsg={this.handleSendMsgButton}
                        user={this.state.user}
                        ref='send_msg_form'
                        translation={this.props.translation}

                        users_list={this.props.users_list}
                        dealerList={this.props.dealerList}
                        devices={this.props.devices}
                        selectedDevices={this.props.selectedDevices ? this.props.selectedDevices : []}
                        getBulkDevicesList={this.props.getBulkDevicesList}
                        getAllDealers={this.props.getAllDealers}
                        getUserList={this.props.getUserList}
                    />

                </Modal>

                {/* Responses handle through modal */}
                <Modal
                    maskClosable={false}
                    title={<div><Icon type="question-circle" className='warning' /><span> WARNING! </span></div>}
                    visible={this.state.bulkResponseModal}
                    onCancel={this.handleCancelResponseModal}
                    footer={false}
                >
                    {failed_device_ids && failed_device_ids.length ?
                        <Fragment>
                            <h2>{failedTitle}</h2>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.failed_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {expire_device_ids && expire_device_ids.length ?
                        <Fragment>
                            <h2>{`Already Expired Devices`}</h2>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.expire_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {queue_device_ids && queue_device_ids.length ?
                        <Fragment>
                            <h2>Offline Devices</h2>
                            <p><small>{offlineTitle}</small></p>
                            <Table
                                bordered
                                size="middle"
                                pagination={false}
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.queue_device_ids)}
                            />
                            <span className="warning_hr">
                                <hr />
                            </span>
                        </Fragment>
                        : null}

                    {pushed_device_ids && pushed_device_ids.length ?
                        <Fragment>
                            <h2>{onlineTitle}</h2>
                            <Table
                                size="middle"
                                pagination={false}
                                bordered
                                className="dup_table"
                                columns={this.pushAppsModalColumns}
                                dataSource={this.renderResponseList(this.props.pushed_device_ids)}
                            />
                        </Fragment>
                        : null}
                </Modal>
            </div>
        )
    }

    handleSearch = (e) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (domainStatus) {
            copyDomainList = this.props.domainList
            domainStatus = false;
        }

        // console.log("copyDomainList ", copyDomainList)
        let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
        // console.log("searchedData ", searchedData)
        this.setState({
            domainList: searchedData
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

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBulkDevicesList: getBulkDevicesList,
        setSelectedBulkDevices: setSelectedBulkDevices,
        sendBulkMsg: sendBulkMsg,
        getAllDealers: getAllDealers,
        getUserList: getUserList,

        getDomains: getDomains,
        domainPermission: domainPermission,
        closeResponseModal: closeResponseModal,
    }, dispatch);
}

const mapStateToProps = ({ account, auth, settings, dealers, bulkDevices }) => {
    // console.log("account.domainList ", account.domainList);
    return {
        // dealerList: dealers.dealers,
        domainList: account.domainList,
        isloading: account.isloading,
        user: auth.authUser,

        users_list: bulkDevices.usersOfDealers,
        dealerList: dealers.dealers,
        devices: bulkDevices.bulkDevices,
        selectedDevices: bulkDevices.selectedDevices,
        // bulkMsg: bulkDevices.bulkMsg,
        translation: settings.translation,
        bulkResponseModal: bulkDevices.bulkResponseModal,
        failed_device_ids: bulkDevices.failed_device_ids,
        queue_device_ids: bulkDevices.queue_device_ids,
        pushed_device_ids: bulkDevices.pushed_device_ids,
        response_modal_action: bulkDevices.response_modal_action,
        expire_device_ids: bulkDevices.expire_device_ids,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessages);