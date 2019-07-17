import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table, Avatar, Button, Icon, Modal } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleCheckExtension,
    handleCheckAllExtension,
    simRegister
} from "../../../../appRedux/actions/ConnectDevice";
import { BASE_URL } from '../../../../constants/Application';

import ExtensionDropdown from '../ExtensionDropdown';
import { ENABLE, ENCRYPT, Guest, ENCRYPTED, IN_APP_MENU_DISPLAY } from '../../../../constants/TabConstants';
import { convertToLang } from '../../../utils/commonUtils';
import { SECURE_SETTING_PERMISSION, NOT_AVAILABLE, SECURE_SETTINGS } from '../../../../constants/Constants';
import { Button_Add, Button_Cancel } from '../../../../constants/ButtonConstants';
import AddRegistrationModal from './AddRegistrationModal';


class SimSettings extends Component {

    constructor(props) {
        super(props)
        const columns = [
            {
                title: "#",
                dataIndex: 'counter',
                key: 'counter',
                render: (text, record, index) => ++index,
            },
            {
                title: "ICC-ID",
                dataIndex: 'iccid',
                key: 'iccid',
            },
            // {
            //     title: "Sim Slot",
            //     dataIndex: 'slot',
            //     key: 'slot',
            // },
            {
                title: "Sim Name",
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: "Status",
                dataIndex: 'status',
                key: 'status',
            },
            {
                title: "Note",
                dataIndex: 'note',
                key: 'note',
            }, {
                title: convertToLang(props.translation[Guest], "Guest"),
                dataIndex: 'guest',
                key: 'guest',
            }, {
                title: convertToLang(props.translation[ENCRYPTED], "Encrypted"),
                dataIndex: 'encrypted',
                key: 'encrypted',
            }, {
                title: "Data Limit",
                dataIndex: 'dataLimit',
                key: 'dataLimit',
            }
        ];

        this.state = {
            columns: columns,
            extension: {},
            uniqueName: '',
            sims: this.props.sim_list,
            guestAllExt: false,
            encryptedAllExt: false,
            addSimRegistrationModal: false,
        }
    }

    // componentDidMount() {
    //     // if (this.props.isExtension) {
    //     this.setState({
    //         extension: this.props.extension,
    //         pageName: this.props.pageName,
    //         sims: this.props.sim_list,
    //     })
    //     // }

    // }

    componentWillReceiveProps(nextprops) {
        console.log('at componentWillReceiveProps ', this.props.sim_list)

        // if (this.props.isExtension) {
        // alert("hello");
        this.setState({
            extension: nextprops.extension,
            encryptedAllExt: nextprops.encryptedAllExt,
            guestAllExt: nextprops.guestAllExt,
            sims: nextprops.sim_list
        })
        // }

    }

    componentDidUpdate(prevProps) {
        console.log('at did update ', this.props.sim_list)
        this.setState({
            // extension: this.props.extension,
            // encryptedAllExt: this.props.encryptedAllExt,
            // guestAllExt: this.props.guestAllExt,
            sims: this.props.sim_list
        })
    }

    handleSimModal = () => {
        // let handleSubmit = this.props.addUser;
        this.refs.add_sim_reg.showModal();
    }

    handleChecked = (e, key, app_id = '000') => {
        this.props.handleCheckExtension(e, key, app_id, this.props.pageName);
    }

    handleCheckedAll = (key, value) => {

        // console.log("handleCheckedAll");
        if (key === "guestAllExt") {
            this.props.handleCheckAllExtension(key, 'guest', value, this.props.pageName);
        } else if (key === "encryptedAllExt") {
            this.props.handleCheckAllExtension(key, 'encrypted', value, this.props.pageName);
        }
    }

    setDataLimit = () => {
        this.setState({

        })
    }
    renderSimList = () => {

        let sims = this.state.sims;
        console.log("render list sims", sims);

        if (sims !== undefined && sims !== null && sims.length > 0) {

            return sims.map((ext, index) => {
                return {
                    key: index,
                    counter: ++index,
                    iccid: ext.iccid,
                    name: ext.name,
                    status: 'not inseted',
                    note: 'Good Network',
                    guest: <Switch
                        checked={ext.guest ? true : false}
                        size="small"
                        onClick={(e) => {
                            // console.log("guest", e);
                            // this.handleChecked(e, "guest", ext.app_id);
                        }}
                    />,
                    encrypted: <Switch
                        checked={ext.encrypt ? true : false}
                        size="small"
                        onClick={(e) => {
                            // console.log("guest", e);
                            // this.handleChecked(e, "encrypted", ext.app_id);
                        }}
                    />,
                    dataLimit: (<Button type="danger" onClick={this.setDataLimit}>Set</Button>),
                }
            })
        }
    }
    render() {
        const { extension, isExtension } = this.props;
        console.log('extenion te is', extension)
        // if (isExtension) {
        if (true) {
            return (
                <Fragment>
                    {/* <ExtensionDropdown
                        checked_app_id={null}
                        encryptedAll={this.state.encryptedAllExt}
                        guestAll={this.state.guestAllExt}
                        handleCheckedAll={this.handleCheckedAll}
                    /> */}
                    {/* <Row className="first_head">
                        <Col span={7} className="pr-0">
                            <img src={require("assets/images/setting.png")} />
                        </Col>
                        <Col span={17} className="pl-4 pr-0">
                            <h5>{convertToLang(this.props.translation[SECURE_SETTING_PERMISSION], "Secure Settings Permission")}</h5>
                        </Col>
                    </Row> */}
                    <Row className="">
                        {/* <Row className="sec_head"> */}
                        <Col span={4} />
                        <Col span={6}><h4>Enable All <small>(Unregistered)</small></h4></Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                // this.handleChecked(e, "guest");
                            }}
                                // checked={extension.guest === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                // this.handleChecked(e, "encrypted");
                            }}
                                // checked={extension.encrypted === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        <Col span={6} />
                    </Row>
                    <Row className="">
                        {/* <Row className="sec_head"> */}
                        <Col span={4} />
                        <Col span={6}><h4>Enable All <small>(Registered)</small></h4></Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                // this.handleChecked(e, "guest");
                            }}
                                // checked={extension.guest === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                // this.handleChecked(e, "encrypted");
                            }}
                                // checked={extension.encrypted === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        <Col span={6} />
                    </Row>
                    <br />

                    <Row>
                        <Col span={20}>
                            <h2>Registered Sim Cards</h2>
                        </Col>
                        <Col span={4}>
                            <Button
                                // disabled
                                type="primary"
                                // style={{ width: "100%", marginBottom: 16 }}
                                onClick={this.handleSimModal}
                            >
                                <Icon type="folder-add" />
                                {convertToLang(this.props.translation[Button_Add], "Add")}
                            </Button>
                        </Col>

                    </Row>
                    <br />
                    {/* <div className="sec_set_table"> */}
                    <div className="">
                        <Table dataSource={this.renderSimList()} columns={this.state.columns} pagination={false} scroll={{ y: 276 }} />
                    </div>

                    <AddRegistrationModal
                        ref="add_sim_reg"
                        simRegister={this.props.simRegister}
                        translation={this.props.translation}
                    />

                    

                </Fragment>
            )
        } else {
            return (
                <Fragment>
                    <h1 class="not_syn_txt">{convertToLang(this.props.translation[NOT_AVAILABLE], "Not Available")}</h1>
                </Fragment>
            )
        }

    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        // showHistoryModal: showHistoryModal
        handleCheckExtension: handleCheckExtension,
        handleCheckAllExtension: handleCheckAllExtension,
        simRegister: simRegister
        // handleCheckAll: handleCheckAll
    }, dispatch);
}


var mapStateToProps = ({ device_details }, ownProps) => {
    // console.log(device_details, "applist ownprops", ownProps);
    const pageName = ownProps.pageName;

    let extension = device_details.extensions.find(o => o.uniqueName === pageName);
    // console.log("extensions_", device_details.secureSettingsMain);
    console.log('at compont: ', device_details.sim_list);

    // if (extension !== undefined) {
    return {
        isExtension: true,
        extension: extension,
        guestAllExt: device_details.guestAllExt,
        encryptedAllExt: device_details.encryptedAllExt,
        checked_app_id: device_details.checked_app_id,
        sim_list: device_details.sim_list,

    }
    // } else {
    //     return {
    //         isExtension: false
    //     }
    // }

}

export default connect(mapStateToProps, mapDispatchToProps)(SimSettings);