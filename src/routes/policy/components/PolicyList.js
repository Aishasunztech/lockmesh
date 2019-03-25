import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Row, Col, List, Button, message, Table } from "antd";

class PolicyList extends Component {

    editPolicy() {

        alert("Edit Policy")

    }

    deletePolicy() {

        alert("Delete Policy")

    }

    renderList(list) {
        let policy_list = list.filter((data) => {
            if (data.type === "policy") {
                return data
            }
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
                rowKey: index,
                policy_name: (policy.name) ? `${policy.name}` : "N/A",
                policy_note: (policy.note) ? `${policy.note}` : "N/A"
            }
        });

    }


    componentDidMount() {

    }

    render() {
        return (
            <Fragment>
                <Card>
                    <Table className="devices"
                        size="middle"
                        bordered
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