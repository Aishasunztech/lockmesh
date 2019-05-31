import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { message, Input, Modal, Button, Popover, Icon } from "antd";
import AppFilter from '../../components/AppFilter';
import PolicyList from "./components/PolicyList";
import AddPolicy from "./components/AddPolicy";
import EditPolicy from "./components/editPolicy";

import {
    getPolicies, handlePolicyStatus,
    handleEditPolicy, SavePolicyChanges,
    handleCheckAll, defaultPolicyChange,
    getAppPermissions, addAppsToPolicies,
    removeAppsFromPolicies, checktogglebuttons,
    resetPlicies
} from "../../appRedux/actions/Policy";

import {
    getDropdown,
    postDropdown,
    postPagination,
    getPagination
} from '../../appRedux/actions/Common';

import {
    getDealerApps,
} from "../../appRedux/actions/ConnectDevice";

import {
    POLICY_NAME,
    POLICY_PERMISSIONS,
    POLICY_STATUS,
    POLICY_COMMAND,
    POLICY_INFO,
    POLICY_NOTE
} from "../../constants/PolicyConstants";

import { componentSearch, titleCase } from '../utils/commonUtils';
import { ADMIN } from '../../constants/Constants';

var coppyPolicy = [];
var status = true;

const PERMISSION_HELPING_TEXT = (
    <span>Add dealers who are allowed  <br /> to use this Policy</span>
);

const STATUS_HELPING_TEXT = (
    <span>Enable or Disable this policy using <br /> the toggle below.  When disabled,  <br />it cannot be pushed to devices</span>
);

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
                        <Popover placement="top" content={PERMISSION_HELPING_TEXT}>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover>
                    </span>
                ),
                dataIndex: 'permission',
                key: 'permission',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {POLICY_STATUS}
                        <Popover placement="top" content={STATUS_HELPING_TEXT}>
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover>
                    </span>
                ),
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
                        onKeyUp={this.handleSearch}
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
                        name="command_name"
                        key="command_name"
                        id="command_name"
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
            current: 0,
            editPolicyModal: false,
            guestAlldealerApps: false,
            enableAlldealerApps: false,
            encryptedAlldealerApps: false,

            guestAllappPermissions: false,
            enableAllappPermissions: false,
            encryptedAllappPermissions: false

        }


    }
    componentDidMount() {
        // console.log(this.props, 'his')
        this.props.getPolicies();
        this.props.getDealerApps();
        this.props.getAppPermissions();
        this.props.getPagination('policies');
        this.setState({
            policies: this.props.policies,
            guestAlldealerApps: this.props.guestAlldealerApps,
            enableAlldealerApps: this.props.enableAlldealerApps,
            encryptedAlldealerApps: this.props.encryptedAlldealerApps,

            guestAllappPermissions: this.props.guestAllappPermissions,
            enableAllappPermissions: this.props.enableAllappPermissions,
            encryptedAllappPermissions: this.props.encryptedAllappPermissions
        })
        if (this.props.user.type === ADMIN) {
            this.columns.pop()
        }
        // this.props.getApkList();
        // this.props.getDefaultApps();
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            // console.log('this.props ', this.props.policies);
            // console.log('updated', this.props.guestAlldealerApps, this.props.enableAlldealerApps, this.props.encryptedAlldealerApps)

            this.setState({
                defaultPagingValue: this.props.DisplayPages,
                policies: this.props.policies,
                guestAlldealerApps: this.props.guestAlldealerApps,
                enableAlldealerApps: this.props.enableAlldealerApps,
                encryptedAlldealerApps: this.props.encryptedAlldealerApps,

                guestAllappPermissions: this.props.guestAllappPermissions,
                enableAllappPermissions: this.props.enableAllappPermissions,
                encryptedAllappPermissions: this.props.encryptedAllappPermissions
            })
        }
    }

    handlePagination = (value) => {
        //   alert(value);
        //  console.log('pagination value of ', value)
        this.refs.policyList.handlePagination(value);
        this.props.postPagination(value, 'policies');
    }

    handleComponentSearch = (value) => {
        //    console.log('values sr', value)   
        try {
            if (value.length) {

                // console.log('length')

                if (status) {
                    // console.log('status')
                    coppyPolicy = this.state.policies;
                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundPolicies = componentSearch(coppyPolicy, value);
                // console.log('found devics', foundPolicies)
                if (foundPolicies.length) {
                    this.setState({
                        policies: foundPolicies,
                    })
                } else {
                    this.setState({
                        policies: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    policies: coppyPolicy,
                })
            }
        } catch (error) {
            // alert("hello");
        }
    }

    handleSearch = (e) => {
        //  console.log('============ check search value ========')
        //  console.log(e.target.name , e.target.value);

        let demoPolicy = [];
        if (status) {
            coppyPolicy = this.state.policies;
            status = false;
        }
        //   console.log("devices", coppyDevices);

        if (e.target.value.length) {
            // console.log("keyname", e.target.name);
            // console.log("value", e.target.value);
            // console.log(this.state.devices);
            coppyPolicy.forEach((policy) => {
                //   console.log(policy,"user", policy[e.target.name]);

                if (policy[e.target.name] !== undefined) {
                    if ((typeof policy[e.target.name]) === 'string') {
                        //  console.log("string check", policy[e.target.name])
                        if (policy[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoPolicy.push(policy);
                        }
                    } else if (policy[e.target.name] != null) {
                        // console.log("else null check", policy[e.target.name])
                        if (policy[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoPolicy.push(policy);
                        }
                    } else {
                        // demoUsers.push(policy);
                    }
                } else {
                    demoPolicy.push(policy);
                }
            });
            //  console.log("searched value", demoPolicy);
            this.setState({
                policies: demoPolicy
            })
        } else {
            this.setState({
                policies: coppyPolicy
            })
        }
    }

    handlePolicyModal = (visible) => {
        this.setState({
            policyModal: visible
        });
    }

    editPolicyModal = (policy) => {
        // console.log('object', policy)
        this.setState({
            editPolicyModal: true,
            editAblePolicyId: policy.id
        })
    }

    editPolicyModalHide = () => {
        console.log('cancel called')
        this.props.resetPlicies();
        this.setState({
            editPolicyModal: false
        })
        this.refs.editPolicy.reset_steps();

    }

    editPolicyModalHide2 = () => {
        this.setState({
            editPolicyModal: false
        })
        this.refs.editPolicy.reset_steps();
    }


    render() {
       
        return (
            <Fragment>
                <AppFilter
                    handleFilterOptions={this.handleFilterOptions}
                    searchPlaceholder="Search Policy"
                    addButtonText={"Add Policy"}
                    defaultPagingValue={this.state.defaultPagingValue}
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
                    user={this.props.user}
                    columns={this.columns}
                    policies={this.state.policies}
                    checktogglebuttons={this.props.checktogglebuttons}
                    defaultPolicyChange={this.props.defaultPolicyChange}
                    handlePolicyStatus={this.props.handlePolicyStatus}
                    handleEditPolicy={this.props.handleEditPolicy}
                    handleCheckAll={this.props.handleCheckAll}
                    SavePolicyChanges={this.props.SavePolicyChanges}
                    pagination={this.props.DisplayPages}
                    ref='policyList'
                    guestAlldealerApps={this.props.guestAlldealerApps}
                    encryptedAlldealerApps={this.props.encryptedAlldealerApps}
                    enableAlldealerApps={this.props.enableAlldealerApps}
                    guestAllappPermissions={this.props.guestAllappPermissions}
                    encryptedAllappPermissions={this.props.encryptedAllappPermissions}
                    enableAllappPermissions={this.props.enableAllappPermissions}
                    guestAllallExtensions={this.props.guestAllallExtensions}
                    encryptedAllallExtensions={this.props.encryptedAllallExtensions}
                    enableAllallExtensions={this.props.enableAllallExtension}
                    editPolicyModal={this.editPolicyModal}

                />
                <Modal
                    maskClosable={false}
                    width="730px"
                    className="policy_popup"
                    visible={this.state.policyModal}
                    title="Add Policy"
                    onOk={() => this.handlePolicyModal(false)}
                    onCancel={() => this.handlePolicyModal(false)}
                    okText="Save"
                    footer={null}
                    ref='modal'
                >
                    <AddPolicy
                        apk_list={this.props.apk_list}
                        app_list={this.props.app_list}
                        handlePolicyModal={this.handlePolicyModal}
                        getPolicies={this.props.getPolicies}
                        ref='addPolicy'
                    />
                </Modal>
                <Modal
                    maskClosable={false}
                    width="730px"
                    className="policy_popup"
                    visible={this.state.editPolicyModal}
                    title="Edit Policy"
                    onOk={() => this.handlePolicyModal(false)}
                    onCancel={() => this.editPolicyModalHide()}
                    okText="Update"
                    footer={null}
                >
                    <EditPolicy
                        SavePolicyChanges={this.props.SavePolicyChanges}
                        handleEditPolicy={this.props.handleEditPolicy}
                        editAblePolicy={this.state.policies}
                        editAblePolicyId={this.state.editAblePolicyId}
                        push_apps={this.props.push_apps}
                        appPermissions={this.props.appPermissions}
                        handleCheckAll={this.props.handleCheckAll}
                        editPolicyModalHide={this.editPolicyModalHide2}
                        addAppsToPolicies={this.props.addAppsToPolicies}
                        removeAppsFromPolicies={this.props.removeAppsFromPolicies}
                        onCancel={this.editPolicyModalHide}
                        guestAlldealerApps={this.state.guestAlldealerApps}
                        encryptedAlldealerApps={this.state.encryptedAlldealerApps}
                        enableAlldealerApps={this.state.enableAlldealerApps}
                        guestAllappPermissions={this.state.guestAllappPermissions}
                        encryptedAllappPermissions={this.state.encryptedAllappPermissions}
                        enableAllappPermissions={this.state.enableAllappPermissions}
                        guestAllallExtensions={this.props.guestAllallExtensions}
                        encryptedAllallExtensions={this.props.encryptedAllallExtensions}
                        enableAllallExtensions={this.props.enableAllallExtension}
                        ref='editPolicy'
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
        handlePolicyStatus: handlePolicyStatus,
        handleEditPolicy: handleEditPolicy,
        SavePolicyChanges: SavePolicyChanges,
        handleCheckAll: handleCheckAll,
        getDealerApps: getDealerApps,
        getAppPermissions: getAppPermissions,
        addAppsToPolicies: addAppsToPolicies,
        defaultPolicyChange: defaultPolicyChange,
        removeAppsFromPolicies: removeAppsFromPolicies,
        checktogglebuttons: checktogglebuttons,
        resetPlicies: resetPlicies
        // getApkList: getApkList,
        // getDefaultApps: getDefaultApps
    }, dispatch);
}
var mapStateToProps = ({ policies, auth }) => {
    // console.log('pages to display', policies.DisplayPages)
    // console.log("policies", policies);
    return {
        user: auth.authUser,
        policies: policies.policies,
        apk_list: policies.apk_list,
        app_list: policies.app_list,
        push_apps: policies.dealer_apk_list,
        appPermissions: policies.appPermissions,
        DisplayPages: policies.DisplayPages,
        guestAlldealerApps: policies.guestAll2dealerApps,
        encryptedAlldealerApps: policies.encryptedAll2dealerApps,
        enableAlldealerApps: policies.enableAll2dealerApps,
        guestAllappPermissions: policies.guestAll2appPermissions,
        encryptedAllappPermissions: policies.encryptedAll2appPermissions,
        enableAllappPermissions: policies.enableAll2appPermissions,
        guestAllallExtensions: policies.guestAll2allExtensions,
        encryptedAllallExtensions: policies.encryptedAll2allExtensions,
        enableAllallExtensions: policies.enableAll2allExtensions,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Policy);