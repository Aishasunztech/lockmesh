import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table, Avatar, Button, Icon, Modal } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleSimUpdate,
    simRegister,
    getSims,
    deleteSim,
} from "../../../../appRedux/actions/ConnectDevice";
import { BASE_URL } from '../../../../constants/Application';

import ExtensionDropdown from '../ExtensionDropdown';
import { ENABLE, ENCRYPT, Guest, ENCRYPTED, IN_APP_MENU_DISPLAY } from '../../../../constants/TabConstants';
import { convertToLang } from '../../../utils/commonUtils';
import { SECURE_SETTING_PERMISSION, NOT_AVAILABLE, SECURE_SETTINGS } from '../../../../constants/Constants';
import { Button_Add, Button_Cancel } from '../../../../constants/ButtonConstants';
import AddRegistrationModal from './AddRegistrationModal';
import EditRegistrationModal from './EditRegistrationModal';


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
                title: "Actions",
                dataIndex: 'actions',
                key: 'actions',
                // render: (text, record, index) => ++index,
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
            // sims: this.props.sim_list,
            guestAllExt: false,
            encryptedAllExt: false,
            addSimRegistrationModal: false,
            sim: {},
            visible: false,
        }

        this.confirm = Modal.confirm;
        this.handleDeleteSim = this.handleDeleteSim.bind(this);

    }

    componentDidMount() {
        this.props.getSims(this.props.deviceID);
    }

    componentWillReceiveProps(nextprops) {
        // console.log('at componentWillReceiveProps ', nextprops.sim_list)
        if (this.props.simUpdated != nextprops.simUpdated) {
            this.props.getSims(nextprops.deviceID);
        }
    }

    handleSimModal = () => {
        this.refs.add_sim_reg.showModal();
    }

    handleChecked = (e, obj, label) => {
        console.log('obj is: ', obj)
        return
        // let value = (e == true) ? '1' : '0';
        if (obj.id == 'all') {
            e = (e == true) ? '1' : '0';
            // if (label == 'guest') {
            //     obj[label] = e;
            //     // obj['encrypt'] = (obj.encrypt == 1) ? true : false;
            // } else {
            //     obj[label] = e;
            // }
        } else {
            if (label == 'guest') {
                obj[label] = e;
                obj['encrypt'] = (obj.encrypt == 1) ? true : false;
            } else {
                obj[label] = e;
                obj['guest'] = (obj.guest == 1) ? true : false;
            }
        }

        this.props.handleSimUpdate({ obj, label, value: e });
    }

    setDataLimit = () => {
        console.log('set data limit')
    }
    handleDeleteSim = (sim) => {
        this.confirm({
            title: "Are you sure to delete Registered Sim?",
            content: '',
            // okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            // cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk: () => {
                this.props.deleteSim(sim);
            },
            onCancel() { },
        });
    }

    handleEditSim = (sim) => {
        this.refs.edit_sim_reg.showModal(sim);
    }

    renderSimList = () => {
        let sims = this.props.sim_list;
        console.log("render list sims", sims);
        if (sims !== undefined && sims !== null && sims.length > 0) {

            return sims.map((sim, index) => {
                let EditBtn = <Button type="default" size="small" onClick={() => this.handleEditSim(sim)}> Edit </Button>;
                let DeleteBtn = <Button type="danger" size="small" onClick={() => this.handleDeleteSim(sim)}> Delete </Button>;

                return {
                    key: index,
                    counter: ++index,
                    actions: (<Fragment><Fragment>{EditBtn}</Fragment><Fragment>{DeleteBtn}</Fragment></Fragment>),
                    iccid: (sim.iccid != undefined) ? sim.iccid : "N/A",
                    name: (sim.name != undefined) ? sim.name : "N/A",
                    status: (sim.status != undefined) ? sim.status : "N/A",
                    note: (sim.note != undefined) ? sim.note : "N/A",
                    guest: <Switch
                        checked={(sim.guest == 1) ? true : false}
                        size="small"
                        onClick={(e) => this.handleChecked(e, sim, "guest")}
                    />,
                    encrypted: <Switch
                        checked={(sim.encrypt == 1) ? true : false}
                        size="small"
                        onClick={(e) => this.handleChecked(e, sim, "encrypt")}
                    />,
                    dataLimit: '20 MB', // ((sim.data_limit == "" || sim.data_limit == 0 || sim.data_limit == '0') ? <Button type="danger" onClick={this.setDataLimit}>Set</Button> : sim.data_limit),
                }
            })
        }
    }
    render() {
        const { guestSimAll, encryptSimAll, sim_list } = this.props;
        console.log('sim list is ', sim_list);
        return (
            <div>
                <Fragment>

                    <Row className="">
                        {/* <Row className="sec_head"> */}
                        <Col span={4} />
                        <Col span={6}><h4>Enable All <small>(Unregistered)</small></h4></Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                // this.handleChecked(e, "guest");
                            }}
                                // checked={extension.guest === 1 ? true : false} 
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
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
                                this.handleChecked(e, {
                                    id: "all",
                                    device_id: sim_list.device_id,
                                    iccid: sim_list.iccid
                                }, "guest");
                            }}
                                checked={guestSimAll === 1 ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "all",
                                    device_id: sim_list.device_id,
                                    iccid: sim_list.iccid
                                }, "encrypt");
                            }}
                                checked={encryptSimAll === 1 ? true : false}
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
                                type="primary"
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
                        <Table
                            dataSource={this.renderSimList()}
                            columns={this.state.columns}
                            pagination={false}
                        />
                    </div>

                    <AddRegistrationModal
                        ref="add_sim_reg"
                        simRegister={this.props.simRegister}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        total_dvc={this.props.sim_list}
                    />
                    <EditRegistrationModal
                        ref="edit_sim_reg"
                        handleSimUpdate={this.props.handleSimUpdate}
                        translation={this.props.translation}
                        deviceID={this.props.deviceID}
                        device={this.props.device}
                        total_dvc={this.props.sim_list}
                    />

                </Fragment>


                {/* <Modal
                    maskClosable={false}
                    title="Are you sure to delete Registered Sim?"
                    visible={this.state.visible}
                    onOk={this.deleteSim}
                    onCancel={this.handleCancel}
                >

                </Modal > */}
            </div>

        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleSimUpdate: handleSimUpdate,
        simRegister: simRegister,
        deleteSim: deleteSim,
        getSims: getSims,
    }, dispatch);
}


var mapStateToProps = ({ device_details }) => {
    return {
        encryptSimAll: device_details.encryptSimAll,
        guestSimAll: device_details.guestSimAll,
        simUpdated: device_details.simUpdated,
        sim_list: device_details.sim_list,
        device: device_details.device,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimSettings);