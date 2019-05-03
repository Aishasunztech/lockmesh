import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table, Icon, Switch } from "antd";
import update from 'react-addons-update';

import PolicyInfo from './PolicyInfo';

class PolicyList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expandedRowKeys: [],
            expandTabSelected: [],
            expandedByCustom: []

        }
    }

    editPolicy() {
        alert("Edit Policy")
    }

    deletePolicy() {
        alert("Delete Policy")
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
            newItems[rowId] = (btnof == 'info') ? '1' : '6';
            // this.setState({ items:newItems });
            // console.log("new Items", newItems);
            this.setState({
                expandedRowKeys: this.state.expandedRowKeys,
                expandTabSelected: newItems
            })
            // console.log("updated state", this.state.expandTabSelected);
            // this.forceUpdate()
        }

    }

    renderList(list) {
        let policy_list = list.filter((data) => {
            // if (data.type === "policy") {
            return data
            // }
        })
        return policy_list.map((policy, index) => {
            // console.log(policy);

            return {
                rowKey: index,
                policy_id: policy.id,
                action:
                    (<Fragment>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => { this.editPolicy() }}
                        >
                            Edit
                        </Button>
                        <Button
                            type="danger"
                            size="small"
                            onClick={() => { this.deletePolicy() }}
                        >
                            Delete
                        </Button>
                    </Fragment>)
                ,
                policy_info:
                    <div>
                        <a onClick={() =>
                            this.expandRow(index, 'info', true)
                            // console.log('table cosn', this.refs.policy_table)
                            // this.refs.policy_table.props.onExpand()  
                        }>
                            <Icon type="arrow-down" style={{ fontSize: 15 }} />
                        </a>
                        <span className="exp_txt">Expand</span>
                    </div>


                ,
                permission: <span style={{ fontSize: 15, fontWeight: 400 }}>{policy.permission_count}</span>,
                permissions: (policy.dealer_permission !== undefined || policy.dealer_permission != null) ? policy.dealer_permission : [],
                policy_status: (<Switch defaultChecked={true} onChange={(e) => {

                }} />),
                policy_note: (policy.policy_note) ? `${policy.policy_note}` : "N/A",
                policy_command: (policy.command_name) ? `${policy.command_name}` : "N/A",
                policy_name: (policy.policy_name) ? `${policy.policy_name}` : "N/A",
                push_apps: policy.push_apps,
                app_list: policy.app_list,
                controls: policy.controls,
                secure_apps: policy.secure_apps,
                default_policy: (
                    <Switch defaultChecked={true} onChange={(e) => { }} />
                ),
            }
        });

    }

    customExpandIcon(props) {
        // console.log('rowKey, ', props.record.rowKey)

        // this.setState({
        //     expandedByCustom:true
        // });

        if (props.expanded) {
            if (this.state.expandedByCustom[props.record.rowKey]) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    // props.onExpand(props.record, e);
                    //    this.expandRow(props.record.rowKey, 'permission');
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    // props.onExpand(props.record, e);
                    //    this.expandRow(props.record.rowKey, 'permission');
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-down" /></a>
            }
        } else {
            if (this.state.expandedByCustom[props.record.rowKey]) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    // props.onExpand(props.record, e);
                    //this.expandRow(props.record.rowKey, 'permission');
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    // props.onExpand(props.record, e);
                    //this.expandRow(props.record.rowKey, 'permission');
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>

            }
        }
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
        //  console.log('POLICY LIST',this.props.policies)
        return (
            <Fragment>
                <Card>
                    <Table className="devices"
                        size="middle"
                        bordered
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            // console.log("expandTabSelected", record);
                            // console.log("table row", this.state.expandTabSelected[record.rowKey]);
                            return (
                                <PolicyInfo
                                    selected={this.state.expandTabSelected[record.rowKey]}
                                    policy={record}
                                />
                            )
                        }}
                        // expandIconColumnIndex={1}         
                        expandIconColumnIndex={2}
                        expandedRowKeys={this.state.expandedRowKeys}
                        expandIconAsCell={false}
                        columns={this.props.columns}
                        dataSource={this.renderList(this.props.policies)}
                        pagination={{ pageSize: 10, size: "midddle" }}
                        rowKey="policy_list"
                        ref='policy_table'
                    />
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