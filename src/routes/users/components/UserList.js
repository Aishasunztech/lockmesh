import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table, Icon, Switch } from "antd";
import update from 'react-addons-update';

class UserList extends Component {

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
        let user_list = list.filter((data) => {
            // if (data.type === "policy") {
            return data
            // }
        })
        return user_list.map((user, index) => {
            // this.state.expandTabSelected[index]='1';
            // this.state.expandedByCustom[index]=false;

            return {
                action:
                    (<Fragment>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => { }}
                        >
                            Edit
                    </Button>
                    </Fragment>)
                ,
                user_id: <span style={{ fontSize: 15, fontWeight: 400 }}>{user.user_id}</span>,
                devices:
                    <div>
                        <a onClick={() =>
                            this.expandRow(index, 'info', true)
                            // console.log('table cosn', this.refs.policy_table)
                            // this.refs.policy_table.props.onExpand()  
                        }><Icon type="arrow-down" size={28} /></a> <span className="exp_txt">EXPAND</span></div>


                ,
                user_name: <span style={{ fontSize: 15, fontWeight: 400 }}>{user.user_name}</span>,
                user_email: <span style={{ fontSize: 15, fontWeight: 400 }}>{user.email}</span>,
                token: <span style={{ fontSize: 15, fontWeight: 400 }}>{user.email}</span>,
                //     policy_status: (<Switch defaultChecked={true} onChange={(e) => {

                //     }} />),

                //     rowKey: index,
                //     policy_note: (policy.policy_note) ? `${policy.policy_note}` : "N/A",
                //     policy_name: (policy.policy_name) ? `${policy.policy_name}` : "N/A",

                //     default_policy: (<Switch defaultChecked={true} onChange={(e) => {

                //     }
                // } />
                // ),
            }
        });

    }

    customExpandIcon(props) {
        console.log('rowKey, ', props.record.rowKey)

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
        this.props.users.map((user, index) => {
            this.state.expandTabSelected[index] = '1';
            this.state.expandedByCustom[index] = false;
        });
    }
    componentWillReceiveProps(preProps) {
        if (preProps.users.length !== this.props.users.length) {
            this.props.users.map((user, index) => {
                this.state.expandTabSelected[index] = '1';
                this.state.expandedByCustom[index] = false
            });
        }
    }
    render() {
        // console.log(this.props.policies)
        return (
            <Fragment>
                <Card>
                    <Table className="devices"
                        size="middle"
                        bordered
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            // console.log("expandTabSelected", this.state.expandTabSelected);
                            // console.log("table row", this.state.expandTabSelected[record.rowKey]);
                            return (
                                <div>
                                    <h1>sadsadsadsah</h1>
                                </div>
                                // <PolicyInfo selected={this.state.expandTabSelected[record.rowKey]} />
                            )

                        }}
                        // expandIconColumnIndex={1}         
                        expandIconColumnIndex={2}
                        expandedRowKeys={this.state.expandedRowKeys}
                        expandIconAsCell={false}
                        columns={this.props.columns}
                        dataSource={this.renderList(this.props.users)}
                        pagination={{ pageSize: 10, size: "midddle" }}
                        rowKey="user_list"
                        ref='user_table'


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
export default UserList;