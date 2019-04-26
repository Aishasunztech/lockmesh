import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import PolicyList from "./components/PolicyList";
import AddPolicy from "./components/AddPolicy";

import {
    getPolicies,
} from "../../appRedux/actions/Policy";

import {
    getDropdown,
    postDropdown,
    postPagination,
    getPagination
} from '../../appRedux/actions/Common';

import {
    getDealerApps
} from "../../appRedux/actions/ConnectDevice";

import {
    POLICY_NAME,
    POLICY_PERMISSIONS,
    POLICY_STATUS,
    POLICY_COMMAND,
    POLICY_INFO,
    POLICY_NOTE
} from "../../constants/PolicyConstants";

import {
    titleCase
} from '../utils/commonUtils';

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
                title: 'ACTION',
                align: "center",
                dataIndex: 'action',
                key: "action",
            },
            {
                title: (
                    <span>
                        {POLICY_INFO}
                        {/* <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>),
                dataIndex: 'policy_info',
                key: 'policy_info',
                className: 'row'
            },
            {
                title: (
                    <span>
                        {POLICY_PERMISSIONS}
                        <Popover placement="top" content='dumy'>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover>
                    </span>),
                dataIndex: 'permission',
                key: 'permission',
                className: 'row'
            },
            {
                title: POLICY_STATUS,
                dataIndex: 'policy_status',
                key: 'policy_status',
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
                        placeholder={titleCase(POLICY_NAME)}
                    />
                ),
                dataIndex: 'policy_name',
                className: '',
                children: [
                    {
                        title: POLICY_NAME,
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
                        name="policy_command"
                        key="policy_command"
                        id="policy_command"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={titleCase(POLICY_COMMAND)}
                    />
                ),
                dataIndex: 'policy_command',
                className: '',
                children: [
                    {
                        title: POLICY_COMMAND,
                        align: "center",
                        className: '',
                        dataIndex: 'policy_command',
                        key: 'policy_command',
                        sorter: (a, b) => { return a.policy_command.localeCompare(b.policy_command) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
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
                        placeholder={titleCase(POLICY_NOTE)}
                    />
                ),
                dataIndex: 'policy_note',
                className: '',
                children: [
                    {
                        title: POLICY_NOTE,
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

            {
                title: 'DEFAULT',
                dataIndex: 'default_policy',
                key: 'default_policy',
            },


        ];
        this.state = {
            policyModal: false,
            policies: (this.props.policies) ? this.props.policies : [],
            current: 0
        }

    }
    componentDidMount() {
        this.props.getPolicies();
        this.props.getPagination('policies');
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }

    handlePagination = (value) => {
        //  alert(value);
        //  console.log('pagination value of ', value)
        // this.refs.devcieList.handlePagination(value);
        this.props.postPagination(value, 'policies');
    }

    handlePolicyModal = (visible) => {
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
                    maskClosable={false}
                    width="700px"
                    className="policy_popup"
                    visible={this.state.policyModal}
                    title="Add Policy"
                    onOk={() => this.handlePolicyModal(false)}
                    onCancel={() => this.handlePolicyModal(false)}
                    okText="Save"
                    footer={null}

                >
                    <AddPolicy
                        apk_list={this.props.apk_list}
                        app_list={this.props.app_list}
                        handlePolicyModal={this.handlePolicyModal}
                        getPolicies={this.props.getPolicies}
                        ref='addPolicy'
                    />
                </Modal>
            </Fragment>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPolicies: getPolicies,
        // postDropdown: postDropdown,
        postPagination: postPagination,
        getPagination: getPagination,
        // getApkList: getApkList,
        // getDefaultApps: getDefaultApps
    }, dispatch);
}
var mapStateToProps = ({ policies }) => {
    //  console.log("policies", policies.policies);
    return {
        policies: policies.policies,
        apk_list: policies.apk_list,
        app_list: policies.app_list,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Policy);