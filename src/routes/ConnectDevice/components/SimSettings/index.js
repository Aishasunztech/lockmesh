import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table, Avatar, Button, Icon, Modal } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
    handleCheckExtension,
    handleCheckAllExtension,
    handleSimUpdate,
    simRegister,
    getSims,
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
            // sims: this.props.sim_list,
            guestAllExt: false,
            encryptedAllExt: false,
            addSimRegistrationModal: false,
        }
    }

    componentDidMount() {
        this.props.getSims(this.props.deviceID);

        // if (this.props.isExtension) {
        // this.setState({
        //     extension: this.props.extension,
        //     pageName: this.props.pageName,
        //     sims: this.props.sim_list,
        // })
        // // }

    }

    componentWillReceiveProps(nextprops) {
        // this.props.getSims(nextprops.deviceID);
        console.log('at componentWillReceiveProps ', nextprops.sim_list)

        if (this.props.simUpdated != nextprops.simUpdated) {
            this.props.getSims(nextprops.deviceID);
        }
        // if (this.props.isExtension) {
        // alert("hello");
        // if (this.props.sim_list != nextprops.sim_list) {

        //     this.setState({
        //         // extension: nextprops.extension,
        //         // encryptedAllExt: nextprops.encryptedAllExt,
        //         // guestAllExt: nextprops.guestAllExt,
        //         sims: nextprops.sim_list
        //     })
        // }

    }

    // componentDidUpdate(prevProps) {
    //     console.log(this.props.sim_list.length, prevProps.sim_list.length)
    //     if (this.props.sim_list.length != prevProps.sim_list.length) {
    //         console.log('at did update ', this.props.sim_list)
    //         this.setState({
    //             // extension: this.props.extension,
    //             // encryptedAllExt: this.props.encryptedAllExt,
    //             // guestAllExt: this.props.guestAllExt,
    //             sims: this.props.sim_list
    //         })
    //     }
    // }

    handleSimModal = () => {
        // let handleSubmit = this.props.addUser;
        this.refs.add_sim_reg.showModal();
    }

    handleChecked = (e, id, label) => {
        let value =  (e == true) ? 1 : 0;
        this.props.handleSimUpdate({ id, label, value });
    }

    // handleGuestAll = (e, label) => {
    //     console.log(label, '======== ',e)

    // }

    handleCheckedAll = (key, value) => {

        // console.log("handleCheckedAll");
        if (key === "guestAllExt") {
            this.props.handleCheckAllExtension(key, 'guest', value, this.props.pageName);
        } else if (key === "encryptedAllExt") {
            this.props.handleCheckAllExtension(key, 'encrypted', value, this.props.pageName);
        }
    }

    setDataLimit = () => {
        console.log('set data limit')
        // this.setState({

        // })
    }
    renderSimList = () => {

        let sims = this.props.sim_list;
        console.log("render list sims", sims);


        if (sims !== undefined && sims !== null && sims.length > 0) {
            // let checkGst = sims.filter(e => e.guest != 1);
            // if (checkEnc.length > 0) guestSimAll = 0; else guestSimAll = 1


            return sims.map((sim, index) => {
                console.log('---------------- ', sim.dataLimit)

                return {
                    key: index,
                    counter: ++index,
                    iccid: sim.iccid,
                    name: sim.name,
                    status: 'not inseted',
                    note: 'Good Network',
                    guest: <Switch
                        checked={(sim.guest == 1) ? true : false}
                        size="small"
                        onClick={(e) => {
                            // console.log("guest", e);
                            this.handleChecked(e, sim.id, "guest");
                        }}
                    />,
                    encrypted: <Switch
                        checked={(sim.encrypt == 1) ? true : false}
                        size="small"
                        onClick={(e) => {
                            // console.log("guest", e);
                            this.handleChecked(e, sim.id, "encrypt");
                        }}
                    />, // 
                    dataLimit: '20 MB', // ((sim.data_limit == "" || sim.data_limit == 0 || sim.data_limit == '0') ? <Button type="danger" onClick={this.setDataLimit}>Set</Button> : sim.data_limit),
                }
            })
        }
    }
    render() {
        const { guestSimAll, encryptSimAll } = this.props;
        console.log('guestSimAll stat is', this.state.sims)
        if (true) {
            return (
                <Fragment>
                 
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
                                this.handleChecked(e, "all", "guest");
                            }}
                                checked={guestSimAll === 1 ? true : false}
                                size="small"
                            />
                        </Col>
                        <Col span={4}>
                            <span>{convertToLang(this.props.translation[ENCRYPT], "Encrypt")} </span> <Switch onClick={(e) => {
                                // console.log("guest", e);
                                this.handleChecked(e, "all", "encrypt");
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
        // handleCheckExtension: handleCheckExtension,
        // handleCheckAllExtension: handleCheckAllExtension,
        handleSimUpdate: handleSimUpdate,
        simRegister: simRegister,
        getSims: getSims,
        // handleCheckAll: handleCheckAll
    }, dispatch);
}


var mapStateToProps = ({ device_details }) => {
    // console.log(device_details, "applist ownprops", ownProps);
    console.log('at sim compont device is : ', device_details.device);
    // console.log('guestSimAll is', device_details.guestSimAll)

    return {
        sim_list: device_details.sim_list,
        guestSimAll: device_details.guestSimAll,
        encryptSimAll: device_details.encryptSimAll,
        device: device_details.device,
        simUpdated: device_details.simUpdated

    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SimSettings);