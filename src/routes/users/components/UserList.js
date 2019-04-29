import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table, Icon, Switch } from "antd";
import UserDeviceList from './UserDeviceList'

class UserList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            pagination: this.props.pagination,

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
                devices: <span style={{ fontSize: 15, fontWeight: 400 }}>{(user.devicesList) ? user.devicesList.length : 0}</span>,
                devicesList: user.devicesList,
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
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /> </a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns
            })
        }
    }
    render() {
        console.log(this.state.pagination)
        return (
            <Fragment>
                <Card>
                    <Table className="devices"
                        size="middle"
                        bordered
                        expandIcon={(props) => this.customExpandIcon(props)}
                        expandedRowRender={(record) => {
                            console.log("table row", record);
                            return (
                                <UserDeviceList
                                    record={record} />
                            );
                        }}
                        expandIconColumnIndex={2}
                        expandIconAsCell={false}
                        columns={this.state.columns}
                        dataSource={this.renderList(this.props.users)}
                        pagination={{ pageSize: 50, size: "midddle" }}
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