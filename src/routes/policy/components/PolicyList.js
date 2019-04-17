import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table, Icon, Switch } from "antd";
import PolicyInfo from './policy_info';

class PolicyList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            expandedRowKeys: [],
            expandTabSelected: '1'

        }
    }

    editPolicy() {

        alert("Edit Policy")

    }

    deletePolicy() {

        alert("Delete Policy")

    }

    expandRow = (rowId, btnof) => {

        console.log('btn is', btnof)

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
            this.setState({
                expandedRowKeys: this.state.expandedRowKeys,
                expandTabSelected: (btnof == 'info') ? '1' : '2'

            })
        }

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
                policy_info:
                    <div>
                        <a onClick={() =>
                            this.expandRow(index, 'info')
                            // console.log('table cosn', this.refs.policy_table)
                            // this.refs.policy_table.props.onExpand()  
                        }><Icon type="arrow-down" size={28} /></a> Detail</div>


                ,
                permission: <span style={{ fontSize: 15, fontWeight: 400 }}>4</span>,
                policy_status: (<Switch defaultChecked={true} onChange={(e) => {

                }} />),

                rowKey: index,
                policy_note: (policy.policy_note) ? `${policy.policy_note}` : "N/A",
                policy_name: (policy.policy_name) ? `${policy.policy_name}` : "N/A",

                default_policy: (<Switch defaultChecked={true} onChange={(e) => {

                }} />),
            }
        });

    }

    customExpandIcon(props) {
        console.log('proops, ', props)
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                // props.onExpand(props.record, e);
                //    this.expandRow(props.record.rowKey, 'permission');
                this.expandRow(props.record.rowKey, 'permission')
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                // props.onExpand(props.record, e);
                //this.expandRow(props.record.rowKey, 'permission');
                this.expandRow(props.record.rowKey, 'permission')
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
                            //  console.log("table row", record);
                            return (
                                <PolicyInfo selected={this.state.expandTabSelected} />
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