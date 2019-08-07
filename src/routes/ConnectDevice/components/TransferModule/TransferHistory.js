import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import { Modal, message, Input, Table, Switch, Avatar, Button, Card, Row, Col, Select, Spin, Form } from 'antd';
import { componentSearch, getFormattedDate, convertToLang } from '../../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME, SEARCH, ADMIN } from '../../../../constants/Constants';
import { BASE_URL } from '../../../../constants/Application';
import { PREVIOUSLY_USED_SIMS, ICC_ID, USER_ID, USER_ID_IS_REQUIRED, SELECT_USER_ID } from '../../../../constants/DeviceConstants';
import { Button_Add_User, Button_Ok, Button_Cancel, Button_submit } from '../../../../constants/ButtonConstants';
import {
    addUser,
    getUserList
} from "../../../../appRedux/actions/Users";

import {
    transferUser,
    transferHistory
} from "../../../../appRedux/actions/ConnectDevice";
import AddUser from '../../../users/components/AddUser';


var copyTransfer = [];
var status = true;
class TransferHistory extends Component {

    constructor(props) {
        super(props);
        var columns = [
            {
                title: "#",
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                render: (text, record, index) => ++index,
            },
            {
                title: "ACTION",
                dataIndex: 'action',
                align: 'center',
                className: 'row',
            },
            {
                title: "DEVICE ID",
                align: "center",
                dataIndex: 'device_id',
                key: "device_id",
                className: '',
                // sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: "USER ID",
                align: "center",
                dataIndex: 'user_id',
                key: "user_id",
                className: '',
                // sorter: (a, b) => { return a.user_id.localeCompare(b.user_id) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: "TRANSFERED FROM",
                align: "center",
                dataIndex: 'transfered_from',
                key: "transfered_from",
                className: '',
                // sorter: (a, b) => { return a.transfered_from.localeCompare(b.transfered_from) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: "TRANSFERED TO",
                align: "center",
                dataIndex: 'transfered_to',
                key: "transfered_to",
                className: '',
                // sorter: (a, b) => { return a.transfered_to.localeCompare(b.transfered_to) },
                // sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation[DATE], "DATE"),
                align: "center",
                dataIndex: 'created_at',
                key: "created_at",
                className: '',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at) },
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend'
            },
        ]

        this.state = {
            visible: props.visible,
            visibleUser: false,
            HistoryList: props.transferHistoryList,
            expandedRowKeys: [],
            columns: columns,
            flagged: "Not flagged",
            // device_id: null,
            addNewUserModal: false,
            addNewUserValue: "",
            user_id: props.device.user_id,
        }
        // this.showModal = this.showModal.bind(this);
    }

    // showModal = (flagged, device_id) => {
    //     this.setState({
    //         visible: true,
    //         flagged,
    //         device_id,
    //         // HistoryList: this.props.transferHistoryList

    //     });
    // }

    handleUserChange = (e) => {
        // console.log(e)
        this.setState({ addNewUserValue: e });
    }

    componentDidMount() {
        this.props.getUserList();
        this.props.transferHistory();
        this.setState({
            user_id: this.props.device.user_id
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isloading) {
            this.setState({ addNewUserModal: true })
        }
        this.setState({ isloading: nextProps.isloading })
        if (this.props !== nextProps) {
            // nextProps.getSimIDs();
        }
        if (this.props.visible != nextProps.visible) {
            this.setState({ visible: nextProps.visible })
        }

        if (this.props.transferHistoryList != nextProps.transferHistoryList) {
            this.setState({
                HistoryList: nextProps.transferHistoryList
            })
        }
    }

    handleCancel = () => {
        this.setState({ visible: false });
        this.props.handleTransferHistoryModal(false)
    }

    handleCancelUser = () => {
        this.setState({
            visibleUser: false,
            addNewUserModal: false,
            addNewUserValue: ''
        });
    }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            if (value.length) {
                if (status) {
                    copyTransfer = this.state.HistoryList;
                    status = false;
                }
                let foundRecords = componentSearch(copyTransfer, value);
                if (foundRecords.length) {
                    this.setState({
                        HistoryList: foundRecords,
                    })
                } else {
                    this.setState({
                        HistoryList: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    HistoryList: copyTransfer,
                })
            }

        } catch (error) {
            console.log('error')
        }
    }

    renderList = () => {
        let data = this.state.HistoryList;
        if (data.length) {
            return data.map((row, index) => {
                // console.log(row);
                return {
                    key: index,
                    action: row.action,
                    device_id: row.device_id,
                    user_id: row.user_acc_id,
                    transfered_from: row.transfered_from,
                    transfered_to: row.transfered_to,
                    created_at: getFormattedDate(row.created_at),
                    // data: row
                }
            })
        }
    }

    handleUserModal = () => {
        let handleSubmit = this.props.addUser;
        this.refs.add_user.showModal(handleSubmit);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log("User detail", values)
                // console.log('this.props.device.user_id is: ', this.state.user_id)
                if (values.user_id !== this.state.user_id) {
                    // console.log('done')
                    this.props.transferUser({
                        NewUser: values.user_id,
                        OldUsr_device_id: this.props.device.usr_device_id,
                        OldUser: this.state.user_id
                    });
                    this.setState({
                        user_id: values.user_id
                    })
                }
                this.handleCancelUser();
                // this.handleReset();
            }
        });

    }

    render() {
        const { visible, visibleUser, addNewUserModal, addNewUserValue } = this.state;
        const { isloading, users_list, device, flagged } = this.props;
        // console.log('users_list ', flagged)
        var lastObject = users_list[0];
        return (
            <div>
                <Modal
                    width='850px'
                    maskClosable={false}
                    visible={visible}
                    title="What you want to transfer, User or Device?"
                    onCancel={this.handleCancel}
                    footer={null}
                >

                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={8} className="gutter-row" justify="center" >
                                <Button onClick={() => { if (flagged === "Unflag") { this.props.handleTransfer(device.device_id) } else { Modal.error({ title: 'Plaese Flag the device first to Transfer' }); } }}>DEVICE TRANSFER</Button>
                            </Col>
                            <Col span={8} className="gutter-row" style={{ textAlign: 'center', marginTop: '5px' }}><h3>-OR-</h3></Col>
                            <Col span={8} className="gutter-row" justify="center" >
                                <Button onClick={() => this.setState({ visibleUser: true })}>USER TRANSFER</Button>
                            </Col>
                        </Row>
                    </Card>


                    <br /><br />
                    <h2>TRANSFER HISTORY</h2>
                    <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder={convertToLang(this.props.translation[SEARCH], "Search")}
                    />

                    <Table
                        columns={this.state.columns}
                        bordered
                        dataSource={this.renderList()}
                        pagination={false}
                    />

                </Modal>


                {/************************** USER MODAL ***************************/}
                <Modal
                    // width='850px'
                    maskClosable={false}
                    visible={visibleUser}
                    title="USER TRANSFER"
                    onCancel={this.handleCancelUser}
                    footer={null}
                // okText={convertToLang(this.props.translation[Button_Ok], Button_Ok)}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
                >

                    <Form onSubmit={this.handleSubmit}>
                        {(isloading ?

                            <div className="addUserSpin">
                                <Spin />
                            </div>
                            :
                            <Fragment>
                                <Form.Item
                                    label={convertToLang(this.props.translation[USER_ID], "USER ID")}
                                    labelCol={{ span: 8, xs: 24, md: 8, sm: 24 }}
                                    wrapperCol={{ span: 14, md: 14, xs: 24 }}
                                >
                                    {this.props.form.getFieldDecorator('user_id', {
                                        initialValue: addNewUserModal ? lastObject.user_id : this.props.device.user_id,
                                        rules: [{
                                            required: true, message: convertToLang(this.props.translation[USER_ID_IS_REQUIRED], "User ID is Required !"),
                                        }]
                                    })(
                                        <Select
                                            className="pos_rel"
                                            setFieldsValue={addNewUserModal ? lastObject.user_id : addNewUserValue}
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}
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
                                            <Select.Option value="">{convertToLang(this.props.translation[SELECT_USER_ID], "Select User ID")}</Select.Option>
                                            {users_list.map((item, index) => {
                                                return (<Select.Option key={index} value={item.user_id}>{`${item.user_id} (${item.user_name})`}</Select.Option>)
                                            })}
                                        </Select>

                                    )}
                                    {(this.props.user.type === ADMIN) ? null :
                                        <Button
                                            className="add_user_btn"
                                            type="primary"
                                            onClick={this.handleUserModal}
                                        >
                                            {convertToLang(this.props.translation[Button_Add_User], "Add User")}
                                        </Button>
                                    }

                                </Form.Item>

                            </Fragment>
                        )}
                        <Form.Item className="edit_ftr_btn11"
                            wrapperCol={{
                                xs: { span: 24, offset: 0 },
                                sm: { span: 24, offset: 0 },
                            }}
                        >
                            <Button key="back" type="button" onClick={() => { this.handleCancelUser() }} > {convertToLang(this.props.translation[Button_Cancel], "Cancel")}</Button>
                            <Button type="primary" htmlType="submit">{convertToLang(this.props.translation[Button_submit], "Submit")}</Button>
                        </Form.Item>
                    </Form>
                    <AddUser ref="add_user" translation={this.props.translation} />
                </Modal>

            </div>
        )
    }
}

const WrappedUserList = Form.create({ name: 'transfer-user' })(TransferHistory);

var mapStateToProps = ({ users, settings, device_details }) => {
    console.log('transferHistoryList ', device_details.transferHistoryList)

    return {
        transferHistoryList: device_details.transferHistoryList,
        users_list: users.users_list,
        isloading: users.addUserFlag,
        translation: settings.translation
    };
}

export default connect(mapStateToProps, { getUserList, addUser, transferUser, transferHistory }, null, { withRef: true })(WrappedUserList);