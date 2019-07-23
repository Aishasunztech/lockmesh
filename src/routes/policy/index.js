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
    resetPlicies, resetAddPolicyForm,
    handleAppGotted
} from "../../appRedux/actions/Policy";

import {
    getDropdown,
    postDropdown,
    postPagination,
    getPagination
} from '../../appRedux/actions/Common';
import { Markup } from 'interweave';
import {
    getDealerApps,
} from "../../appRedux/actions/ConnectDevice";

import {
    POLICY_ACTION,
    POLICY_NAME,
    POLICY_PERMISSIONS,
    POLICY_STATUS,
    POLICY_COMMAND,
    POLICY_INFO,
    POLICY_NOTE,
    POLICY_DEFAULT,
    POLICY_SAVE_CHANGES,
    POLICY_SEARCH,
    POLICY_ADD,
    POLICY_EDIT,
    POLICY_PERMISSION_HELPING_TEXT,
} from "../../constants/PolicyConstants";

import {
    Button_Yes,
    Button_No,
    Button_Update,
    Button_Save
} from '../../constants/ButtonConstants'

import { componentSearch, titleCase, convertToLang } from '../utils/commonUtils';
import { ADMIN } from '../../constants/Constants';
import { policyColumns } from '../utils/columnsUtils';

var coppyPolicy = [];
var status = true;

class Policy extends Component {
    constructor(props) {
        super(props);

        this.columns = policyColumns(null, props.translation, this.handleSearch);


        this.state = {
            sortOrder: null,
            policyModal: false,
            policies: (props.policies) ? props.policies : [],
            formRefresh: false,
            current: 0,
            goToLastTab: false,
            editPolicyModal: false,
            guestAlldealerApps: false,
            enableAlldealerApps: false,
            encryptedAlldealerApps: false,

            guestAllappPermissions: false,
            enableAllappPermissions: false,
            encryptedAllappPermissions: false,
            appsGotted: false,

        }


    }

    handleTableChange = (pagination, query, sorter) => {
        const sortOrder = sorter.order || "ascend";
        this.columns = policyColumns(sortOrder, this.props.translation, this.handleSearch);
    };

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
            encryptedAllappPermissions: this.props.encryptedAllappPermissions,
            appsGotted: this.props.appsGotted
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
                encryptedAllappPermissions: this.props.encryptedAllappPermissions,
                appsGotted: this.props.appsGotted
            })
        }
        if (this.props.translation != prevProps.translation) {
            this.columns = policyColumns(this.state.sortOrder, this.props.translation, this.handleSearch);
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
                    } else if (policy[e.target.name] !== null) {
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
        let _this = this;
        Modal.confirm({
            title: convertToLang(this.props.translation[POLICY_SAVE_CHANGES], "Save changes to Policy?"),
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk() {
                _this.setState({
                    goToLastTab: true,
                    formRefresh: false
                })
            },
            onCancel() {
                _this.props.resetAddPolicyForm()
                _this.setState({
                    policyModal: visible,
                    goToLastTab: false,
                    formRefresh: true
                });
            },
        });

    }

    handlePolicyModal2 = (visible) => {
        this.setState({
            policyModal: visible,
            goToLastTab: false,
            formRefresh: true

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

        let _this = this;
        Modal.confirm({
            title: convertToLang(this.props.translation[POLICY_SAVE_CHANGES], "Save changes to Policy?"),
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk() {

                //   console.log('OK');
            },
            onCancel() {

                _this.props.resetPlicies();
                _this.setState({
                    editPolicyModal: false
                })
                _this.form.reset_steps();
                //   console.log('Cancel');
            },
        });

        // console.log('cancel called')


    }

    editPolicyModalHide2 = () => {
        this.setState({
            editPolicyModal: false
        })
        this.form.reset_steps();
    }


    render() {
        // console.log(this.refs.editPolicy, 'dsklfsdlkfjlksd', this.refs)

        return (
            <Fragment>
                <AppFilter
                    handleFilterOptions={this.handleFilterOptions}
                    searchPlaceholder={convertToLang(this.props.translation[POLICY_SEARCH], "Search Policy")}
                    addButtonText={convertToLang(this.props.translation[POLICY_ADD], "Add Policy")}
                    defaultPagingValue={this.state.defaultPagingValue}
                    // selectedOptions={this.props.selectedOptions}
                    // options={this.state.options}
                    isAddButton={true}
                    AddPolicyModel={true}
                    handlePolicyModal={this.handlePolicyModal2}

                    handleCheckChange={this.handleCheckChange}
                    handlePagination={this.handlePagination}
                    handleComponentSearch={this.handleComponentSearch}
                    translation={this.props.translation}
                />
                <PolicyList
                    onChangeTableSorting={this.handleTableChange}
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
                    handleAppGotted={this.props.handleAppGotted}
                    appsGotted={this.state.appsGotted}
                    translation={this.props.translation}

                />
                <Modal
                    maskClosable={false}
                    width="780px"
                    className="policy_popup"
                    visible={this.state.policyModal}
                    title={convertToLang(this.props.translation[POLICY_ADD], "Add Policy")}
                    onOk={() => this.handlePolicyModal2(false)}
                    onCancel={() => this.handlePolicyModal(false)}
                    destroyOnClose={true}
                    okText={convertToLang(this.props.translation[Button_Save], "Save")}
                    footer={null}
                    ref='modal'
                >
                    <AddPolicy
                        apk_list={this.props.apk_list}
                        app_list={this.props.app_list}
                        handlePolicyModal={this.handlePolicyModal2}
                        getPolicies={this.props.getPolicies}
                        goToLastTab={this.state.goToLastTab}
                        refreshForm={this.state.formRefresh}
                        ref='addPolicy'
                        translation={this.props.translation}
                    />
                </Modal>
                <Modal
                    maskClosable={false}
                    width="780px"
                    className="policy_popup"
                    visible={this.state.editPolicyModal}
                    // destroyOnClose={true}
                    title={convertToLang(this.props.translation[POLICY_EDIT], "Edit Policy")}
                    onOk={() => this.handlePolicyModal(false)}
                    onCancel={() => { this.editPolicyModalHide(); this.props.handleAppGotted(false) }}
                    okText={convertToLang(this.props.translation[Button_Update], "Update")}
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
                        handleAppGotted={this.props.handleAppGotted}
                        appsGotted={this.state.appsGotted}
                        getPolicies={this.props.getPolicies}
                        wrappedComponentRef={(form) => this.form = form}
                        ref='editPolicy'
                        translation={this.props.translation}
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
        resetPlicies: resetPlicies,
        resetAddPolicyForm: resetAddPolicyForm,
        handleAppGotted: handleAppGotted
        // getApkList: getApkList,
        // getDefaultApps: getDefaultApps
    }, dispatch);
}
var mapStateToProps = ({ policies, auth, settings }) => {
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
        appsGotted: policies.appsGotted,
        translation: settings.translation,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Policy);