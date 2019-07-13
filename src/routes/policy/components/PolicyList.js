import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, Modal, Button, message, Table, Icon, Switch } from "antd";
import update from 'react-addons-update';
import CustomScrollbars from "../../../util/CustomScrollbars";
import PolicyInfo from './PolicyInfo';
import { flagged } from '../../../appRedux/actions/ConnectDevice';
import { ADMIN } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';
import styles from './policy.css';
import { Button_Save, Button_Yes, Button_No, Button_Edit, Button_Delete, Button_Save_Changes, Button_Cancel } from '../../../constants/ButtonConstants';
import { POLICY } from '../../../constants/ActionTypes';
import { POLICY_SAVE_CONFIRMATION, POLICY_DELETE_CONFIRMATION, POLICY_CHANGE_DEFAULT_CONFIRMATION } from '../../../constants/PolicyConstants';
const confirm = Modal.confirm;

class PolicyList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expandedRowKeys: [],
            expandTabSelected: [],
            expandedByCustom: [],
            pagination: this.props.pagination,
            savePolicyButton: false

        }
    }

    expandRow = (rowId, btnof, expandedByCustom = false) => {
        //  console.log('btn is', btnof)
        // this.setState({
        //     expandedByCustom:expandedByCustom
        // })
        const expandedCustomArray = [...this.state.expandedByCustom];
        expandedCustomArray[rowId] = expandedByCustom;
        this.setState({
            expandedByCustom: expandedCustomArray
        });
        if (this.state.expandedRowKeys.includes(rowId)) {
            var index = this.state.expandedRowKeys.indexOf(rowId);
            if (index !== -1) this.state.expandedRowKeys.splice(index, 1);
            // console.log('tab is ', btnof)
            this.setState({
                expandedRowKeys: this.state.expandedRowKeys,

            })
        }
        else {
            this.state.expandedRowKeys.push(rowId);

            const newItems = [...this.state.expandTabSelected];
            newItems[rowId] = (btnof === 'info' || btnof === 'edit') ? '1' : '6';
            // this.setState({ items:newItems });
            // console.log("new Items", newItems);
            if (btnof === 'edit') {
                this.setState({
                    expandedRowKeys: this.state.expandedRowKeys,
                    expandTabSelected: newItems,
                    isSwitch: btnof === 'edit' ? true : false,
                    [rowId]: rowId,
                    savePolicyButton: true
                })
            } else {
                this.setState({
                    expandedRowKeys: this.state.expandedRowKeys,
                    expandTabSelected: newItems,
                    [rowId]: null,
                    // isSwitch: btnof === 'edit' ? true : false,
                    savePolicyButton: false

                })
            }

        }

    }


    SavePolicyChanges = (record) => {

        Modal.confirm({
            title: convertToLang(this.props.translation[POLICY_SAVE_CONFIRMATION], "Are You Sure, You Want to Save Changes"),
            onOk: () => {
                this.props.SavePolicyChanges(record);
            },
            // content: 'Bla bla ...',
            okText: convertToLang(this.props.translation[Button_Save], "Save"),
            cancelText: convertToLang(this.props.translation[Button_Cancel], "Cancel"),
        });
    }


    deletePolicy = (id) => {
        let _this = this
        confirm({
            title: convertToLang(this.props.translation[POLICY_DELETE_CONFIRMATION], "Do you want to delete this Policy?"),
            onOk() {
                _this.props.handlePolicyStatus(1, 'delete_status', id)
            },
            onCancel() { },
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No")

        });
    }

    renderList(list) {
        let policy_list = list.filter((data) => {
            // if (data.type === "policy") {
            return data
            // }
        })
        return policy_list.map((policy, index) => {

            return {
                rowKey: index,
                isChangedPolicy: policy.isChangedPolicy ? policy.isChangedPolicy : false,
                policy_id: policy.id,
                action:

                    (policy.dealer_id === this.props.user.id || this.props.user.type === ADMIN) ?
                        (
                            <Fragment>
                                <Button
                                    style={{ marginRight: 7, marginLeft: 7, textTransform: "uppercase" }}
                                    type="primary"
                                    size="small"
                                    onClick={() => {
                                        // this.expandRow(index, 'edit', true) 
                                        this.props.checktogglebuttons(policy)
                                        this.props.editPolicyModal(policy)
                                    }}
                                >
                                    {convertToLang(this.props.translation[Button_Edit], "EDIT")}
                                </Button>
                                <Button
                                    style={{ marginRight: 7, textTransform: "uppercase" }}
                                    type="danger"
                                    size="small"
                                    onClick={() => { this.deletePolicy(policy.id) }}
                                >
                                    {convertToLang(this.props.translation[Button_Delete], "DELETE")}
                                </Button>
                            </Fragment>) : null
                ,
                policy_info:
                    <Fragment>
                        <a onClick={() =>
                            this.expandRow(index, 'info', true)
                            // console.log('table cosn', this.refs.policy_table)
                            // this.refs.policy_table.props.onExpand()  
                        }>
                            <Icon type="arrow-down" style={{ fontSize: 15 }} />
                        </a>
                        <span className="exp_txt">Expand</span>
                    </Fragment>
                ,
                permission: <span style={{ fontSize: 15, fontWeight: 400 }}>{policy.permission_count}</span>,
                permissions: (policy.dealer_permission !== undefined || policy.dealer_permission !== null) ? policy.dealer_permission : [],
                policy_status: (<Switch size='small' checked={policy.status === 1 || policy.status === true ? true : false}
                    onChange={(e) => { this.props.handlePolicyStatus(e, 'status', policy.id) }
                    } disabled={(policy.dealer_id === this.props.user.id || this.props.user.type === ADMIN) ? false : true
                    } />),
                policy_note: (policy.policy_note) ? `${policy.policy_note}` : "N/A",
                policy_command: (policy.command_name) ? `${policy.command_name}` : "N/A",
                policy_name: (policy.policy_name) ? `${policy.policy_name}` : "N/A",
                push_apps: policy.push_apps,
                app_list: policy.app_list,
                controls: policy.controls,
                secure_apps: policy.secure_apps,
                default_policy: (
                    <Switch size='small' checked={policy.is_default} onChange={(e) => { this.handleDefaultChange(e, policy.id) }} disabled={(policy.status === 1 || policy.status === true) ? false : true} />
                ),
            }
        });

    }
    handleDefaultChange(e, policy_id) {

        let _this = this
        confirm({
            title: convertToLang(this.props.translation[POLICY_CHANGE_DEFAULT_CONFIRMATION], "Do you want to change your default Policy?"),
            onOk() {
                _this.props.defaultPolicyChange(e, policy_id)
            },
            onCancel() { },
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No")

        });
    }
    customExpandIcon(props) {

        if (props.expanded) {
            if (this.state.expandedByCustom[props.record.rowKey]) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-down" /></a>
            }
        } else {
            if (this.state.expandedByCustom[props.record.rowKey]) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>

            }
        }
    }
    handlePagination = (value) => {
        // alert('sub child');
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    componentDidMount() {
        this.props.policies.map((policy, index) => {
            this.state.expandTabSelected[index] = '1';
            this.state.expandedByCustom[index] = false;
        });
    }
    componentWillReceiveProps(preProps) {
        if (preProps.policies.length !== this.props.policies.length) {
            this.props.policies.map((policy, index) => {
                this.state.expandTabSelected[index] = '1';
                this.state.expandedByCustom[index] = false
            });
        }
    }
    render() {
        // console.log(this.state.expandedRowKeys, 'keys are')
        return (
            <Fragment>
                <Card className="fix_card policy_fix_card">
                    <hr className="fix_header_border" style={{ top: "57px" }} />
                    <CustomScrollbars className="gx-popover-scroll">
                        <Table
                            className="devices policy_expand"
                            rowClassName={(record, index) => this.state.expandedRowKeys.includes(index) ? 'exp_row' : ''}
                            size="default"
                            bordered
                            expandIcon={(props) => this.customExpandIcon(props)}
                            // onExpand={this.onExpandRow}
                            expandedRowRender={(record) => {
                                // console.log("expandTabSelected", record);
                                // console.log("table row", this.state.expandTabSelected[record.rowKey]);
                                return (
                                    <div>{
                                        this.state.savePolicyButton ?
                                            <Button onClick={() => this.SavePolicyChanges(record)}> {convertToLang(this.props.translation[Button_Save_Changes], "Save Changes")} </Button>
                                            : false}
                                        <PolicyInfo
                                            selected={this.state.expandTabSelected[record.rowKey]}
                                            policy={record}
                                            isSwitch={this.state.isSwitch && this.state[record.rowKey] == record.rowKey ? true : false}
                                            rowId={record.policy_id}
                                            handleEditPolicy={this.props.handleEditPolicy}
                                            handleCheckAll={this.props.handleCheckAll}
                                            // edit={true}
                                            guestAlldealerApps={this.props.guestAlldealerApps}
                                            encryptedAlldealerApps={this.props.encryptedAlldealerApps}
                                            enableAlldealerApps={this.props.enableAlldealerApps}
                                            guestAllappPermissions={this.props.guestAllappPermissions}
                                            encryptedAllappPermissions={this.props.encryptedAllappPermissions}
                                            enableAllappPermissions={this.props.enableAllappPermissions}
                                            guestAllallExtensions={this.props.guestAllallExtensions}
                                            encryptedAllallExtensions={this.props.encryptedAllallExtensions}
                                            enableAllallExtensions={this.props.enableAllallExtension}
                                            handleAppGotted={this.props.handleAppGotted}
                                            appsGotted={this.props.appsGotted}
                                            translation={this.props.translation}
                                        />
                                    </div>
                                )
                            }}
                            // expandIconColumnIndex={1}         
                            expandIconColumnIndex={2}
                            expandedRowKeys={this.state.expandedRowKeys}
                            expandIconAsCell={false}
                            columns={this.props.columns}
                            dataSource={this.renderList(this.props.policies)}
                            pagination={false
                                // { pageSize: this.state.pagination, size: "midddle" }
                            }
                            rowKey="policy_list"
                            ref='policy_table'
                        />
                    </CustomScrollbars>
                </Card>

            </Fragment>
        )
    }
}

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({
//         // getPolicies: getPolicies,
//     }, dispatch);
// }

// var mapStateToProps = ({ policies }) => {
//     // console.log("policies", policies);
//     return {
//         // routing: routing,
//     };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(PolicyList);
export default PolicyList;