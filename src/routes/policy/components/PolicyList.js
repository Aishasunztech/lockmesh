import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table,Icon,Switch } from "antd";

class PolicyList extends Component {

    editPolicy() {

        alert("Edit Policy")

    }

    deletePolicy() {

        alert("Delete Policy")

    }

    renderList(list) {
        let policy_list = list.filter((data) => {
            // if (data.type === "policy") {
                return data
            // }
        })
        return policy_list.map((policy, index) => {
            return {
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
                'permission': <span style={{fontSize:15, fontWeight:400}}>4</span>,
                policy_status: (<Switch defaultChecked={ true} onChange={(e) => {
                   
                }} />),
                policy_command: 'apk-1554898502524.apk',
                rowKey: index,
                policy_name: (policy.policy_name) ? `${policy.policy_name}` : "N/A",
                policy_note: (policy.policy_note) ? `${policy.policy_note}` : "N/A",
                default_policy: (<Switch defaultChecked={ true} onChange={(e) => {
                   
                }} />),
            }
        });

    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }


    componentDidMount() {

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
                             console.log("table row", record);
    
                        }}
                        expandIconColumnIndex={1}
                        expandIconAsCell={false}
                        columns={this.props.columns}
                        dataSource={this.renderList(this.props.policies)}
                        pagination={{ pageSize: 10, size: "midddle" }}
                        rowKey="policy_list"


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