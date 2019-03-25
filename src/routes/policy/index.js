import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {  message, Input, Modal, Button} from "antd";
import AppFilter from '../../components/AppFilter';
import PolicyList from "./components/PolicyList";
import AddPolicy from "./components/AddPolicy";

import {
    getPolicies,
    getDefaultApps
} from "../../appRedux/actions/Policy";

import {
    getApkList,
} from "../../appRedux/actions/Apk";

class Policy extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            // {
            //     title: 'ACTIONS',
            //     dataIndex: 'action',
            //     align: 'center',
            //     className: 'row',
            //     width: 800,
            // },
            {
                dataIndex: 'Action',
                className: '',
                children: [
                    {
                        title: 'ACTION',
                        align: "center",
                        dataIndex: 'action',
                        key: "action",
                        className: '',
                    }
                ],
            },
            {
                title: (
                    <Input.Search
                        name="policy_name"
                        key="policy_name"
                        id="policy_name"
                        className="search_heading"
                        // onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Policy Name"
                    />
                ),
                dataIndex: 'policy_name',
                className: '',
                children: [
                    {
                        title: 'POLICY NAME',
                        align: "center",
                        dataIndex: 'policy_name',
                        key: "policy_name",
                        className: '',
                        sorter: (a, b) => { return a.policy_name.localeCompare(b.policy_name) },
                    }
                ],

                sortDirections: ['ascend', 'descend'],
            },
            {
                title: (
                    <Input.Search
                        name="policy_note"
                        key="policy_note"
                        id="policy_note"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder="Policy Note"
                    />
                ),
                dataIndex: 'policy_note',
                className: '',
                children: [
                    {
                        title: 'POLICY NOTE',
                        align: "center",
                        className: '',
                        dataIndex: 'policy_note',
                        key: 'policy_note',

                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.policy_note.localeCompare(b.policy_note) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },

        ];
        this.state = {
            policyModal: false,
            policies: (this.props.policies) ? this.props.policies : []
        }

    }
    componentDidMount() {
        this.props.getPolicies();
        this.props.getApkList();
        this.props.getDefaultApps();
    }

    handlePolicyModal= (visible) => {
        this.setState({
            policyModal: visible
        });
    }

    render() {
        return (
            <Fragment>
                <AppFilter
                    handleFilterOptions={this.handleFilterOptions}
                    searchPlaceholder="Search Policy"
                    defaultPagingValue={10}
                    addButtonText={"Add Policy"}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    isAddButton={true}
                    AddPolicyModel={true}
                    handlePolicyModal={this.handlePolicyModal}
                    
                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                    
                />
                <PolicyList
                    columns={this.columns}
                    policies={this.props.policies}
                />
                <Modal 
                width="700px"
                    className="policy_popup"
                    visible={this.state.policyModal}
                    title="Add Policy"
                    onOk={() => this.handlePolicyModal(false)}
                    onCancel={() => this.handlePolicyModal(false)}
                    
                >
                    <AddPolicy
                        apk_list={this.props.apk_list}
                        app_list={this.props.app_list}
                    />
                </Modal>
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPolicies: getPolicies,
        getApkList: getApkList,
        getDefaultApps: getDefaultApps
    }, dispatch);
}
var mapStateToProps = ({ policies }) => {
    // console.log("policies", policies);
    return {
        policies: policies.policies,
        apk_list: policies.apk_list,
        app_list: policies.app_list
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Policy);