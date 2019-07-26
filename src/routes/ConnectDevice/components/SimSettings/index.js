import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table, Avatar, Button, Icon, Modal } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleSimUpdate,
    simRegister,
    simHistory,
    getSims,
    deleteSim,
} from "../../../../appRedux/actions/ConnectDevice";
import { ENABLE, ENCRYPT, Guest, ENCRYPTED, IN_APP_MENU_DISPLAY } from '../../../../constants/TabConstants';
import { convertToLang } from '../../../utils/commonUtils';
import { Button_Add, Button_Cancel } from '../../../../constants/ButtonConstants';
import AddRegistrationModal from './AddRegistrationModal';
import EditRegistrationModal from './EditRegistrationModal';


let status = true;

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
                title: "Guest",//  convertToLang(props.translation[Guest], "Guest"),
                dataIndex: 'guest',
                key: 'guest',
            }, {
                title: convertToLang(props.translation[ENCRYPT], "Encrypt"),
                dataIndex: 'encrypt',
                key: 'encrypt',
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
            addSimRegistrationModal: false,
            historyModal: false,
            sim: {},
            visible: false,
            guestAllExt: 0,
            encryptedAllExt: 0,
            unrGuest: 0,
            unrEncrypt: 0,
        }

        this.confirm = Modal.confirm;
        this.handleDeleteSim = this.handleDeleteSim.bind(this);
    }

    componentDidMount() {
        this.props.getSims(this.props.deviceID);
        this.props.simHistory(this.props.deviceID);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.simUpdated != nextProps.simUpdated) {
            this.props.getSims(nextProps.deviceID);
            status = true;
        }
    }

    handleSimModal = () => {
        this.refs.add_sim_reg.showModal();
    }

    handleChecked = (e, obj, label) => {
        obj[label] = e ? 1 : 0;
        // console.log('status ', status);
        if (status) {
            this.props.handleSimUpdate({ obj, label, value: e });
            status = false;
        }
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
        // console.log("render list sims", sims);
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
                        checked={(sim.guest) ? true : false}
                        size="small"
                        onClick={(e) => this.handleChecked(e, sim, "guest")}
                    />,
                    encrypt: <Switch
                        checked={(sim.encrypt) ? true : false}
                        size="small"
                        onClick={(e) => this.handleChecked(e, sim, "encrypt")}
                    />,
                    dataLimit: '20 MB', // ((sim.data_limit == "" || sim.data_limit == 0 || sim.data_limit == '0') ? <Button type="danger" onClick={this.setDataLimit}>Set</Button> : sim.data_limit),
                }
            })
        }
    }
    render() {
        const {
            guestSimAll,
            encryptSimAll,
            unrGuest,
            unrEncrypt,
            sim_list,
        } = this.props;
        // console.log('sim list is ', sim_list);
        return (
            <div>
                <Fragment>
                    <Row className="">

                        {/* <Row className="sec_head"> */}
                        <Col span={4} />
                        <Col span={6}><h4>Enable All <small>(Unregistered)</small></h4></Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[Guest], "Guest")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "unrAll",
                                    device_id: this.props.deviceID,
                                    unrEncrypt: unrEncrypt ? 1 : 0
                                }, "unrGuest");
                            }}
                                checked={unrGuest ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "unrAll",
                                    device_id: this.props.deviceID,
                                    unrGuest: unrGuest ? 1 : 0
                                }, "unrEncrypt");
                            }}
                                checked={unrEncrypt ? true : false}
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
                                    device_id: this.props.deviceID,
                                }, "guest");
                            }}
                                checked={guestSimAll ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                this.handleChecked(e, {
                                    id: "all",
                                    device_id: this.props.deviceID,
                                    iccid: sim_list ? sim_list[0].iccid : '',
                                }, "encrypt");
                            }}
                                checked={encryptSimAll ? true : false}
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
            </div>

        )
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        handleSimUpdate: handleSimUpdate,
        simRegister: simRegister,
        simHistory: simHistory,
        deleteSim: deleteSim,
        getSims: getSims,
    }, dispatch);
}


var mapStateToProps = ({ device_details }) => {
    console.log('device_details  unrGuest ', device_details.unrGuest)
    return {
        encryptSimAll: device_details.encryptSimAll,
        guestSimAll: device_details.guestSimAll,
        unrGuest: device_details.unrGuest,
        unrEncrypt: device_details.unrEncrypt,
        simUpdated: device_details.simUpdated,
        sim_list: device_details.sim_list,
        device: device_details.device,
        simHistoryList: device_details.simHistoryList,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SimSettings);