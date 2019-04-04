import React, { Component } from 'react';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { 
    showHistoryModal, 
    showSaveProfileModal, 
    saveProfile,
    hanldeProfileInput,
    transferDeviceProfile
} from "../../../appRedux/actions/ConnectDevice";

import { Card, Row, Col, Button, message, Icon, Modal, Input } from "antd";
import TableHistory from "./TableHistory";
import SuspendDevice from '../../devices/components/SuspendDevice';
import ActivateDevcie from '../../devices/components/ActivateDevice';
import EditDevice from '../../devices/components/editDevice';
const confirm = Modal.confirm;

class SideActions extends Component {

    constructor(props) {
        super(props);


        this.state = {
            // type: "history",
            // historyModal: false,

            // saveProfileModal: false,
            // profileType: '',
            // profileName: '',
            // policyName: ''

            historyModal: false,
            saveProfileModal: false,
            historyType: "history",
            saveProfileType:'',
            profileName: '',
            policyName: '',
            disabled:false
        }
    }

    componentDidMount() {
        this.setState({
            historyModal: this.props.historyModal,
            saveProfileModal: this.props.saveProfileModal,
            historyType: this.props.historyType,
            saveProfileType: this.props.saveProfileType,
            profileName: this.props.profileName,
            policyName: this.props.policyName
        })
    }
    
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                historyModal: nextProps.historyModal,
                saveProfileModal: nextProps.saveProfileModal,
                historyType: nextProps.historyType,
                saveProfileType: nextProps.saveProfileType,
                profileName: nextProps.profileName,
                policyName: nextProps.policyName
            })
        }
    }

    showHistoryModal(visible, type) {
        if (((type !== undefined) || type ==="" || type===null) && visible ===false) {
            this.props.showHistoryModal(visible);
        }else{
            this.props.showHistoryModal(visible,type);
        }
    }

    showSaveProfileModal(visible, profileType = '') {
        this.props.showSaveProfileModal(visible, profileType);
    }

    handleChange = (value) => {
        // console.log(`selected ${value}`);
    }

    onInputChange = (e) => {
        this.props.hanldeProfileInput(this.state.saveProfileType,e.target.value);

    }
    saveProfile = () => {

        if (this.state.saveProfileType === "profile" && this.state.profileName !== '') {
            this.props.saveProfile(this.props.app_list, {
                adminPwd: this.props.adminPwd,
                guestPwd: this.props.guestPwd,
                encryptedPwd: this.props.encryptedPwd,
                duressPwd: this.props.duressPwd,
            } ,this.state.saveProfileType, this.state.profileName);
        } else if (this.state.saveProfileType === "policy" && this.state.policyName !== '') {
            this.props.saveProfile(this.props.app_list,
                {
                   adminPwd: this.props.adminPwd,
                   guestPwd: this.props.guestPwd,
                   encryptedPwd: this.props.encryptedPwd,
                   duressPwd: this.props.duressPwd,
                },this.state.saveProfileType, this.state.policyName);
        }
        this.showSaveProfileModal(false)
    }
    transferDeviceProfile = (device_id) => {
        let _this = this;
        confirm({
            content: (
              <h2>
                Are You Sure, You want to Transfer this Device 
            </h2>
            ),
            onOk() {
              console.log('OK');
             _this.props.transferDeviceProfile(device_id);
            },
            onCancel() {
              console.log('Cancel');
            },
          });
        
    }
    render() {
        //  console.log('device', this.props.device);
        const device_status = (this.props.device.account_status === "suspended") ? "Activate" : "Suspend";
        const button_type = (device_status === "ACTIVATE") ? "dashed" : "danger";
        return (
            <div className="gutter-box bordered">
                <div className="gutter-example">
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={12}
                                className="gutter-row" justify="center" >
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} ><Icon type='upload' /> Push</Button>
                                <Button type="primary" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showHistoryModal(true, "policy")} ><Icon type="file" />Load Policy</Button>

                                <Button type="primary" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showHistoryModal(true, "profile")} ><Icon type="file" />Load Profile</Button>

                                <Button type="primary" style={{ width: "100%", marginBottom: 15 }} onClick={() => this.showHistoryModal(true, "history")} ><Icon type="file" />Load History</Button>
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >Disable N/A</Button>
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default" disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default" onClick={() => { this.transferDeviceProfile(this.props.device_id)}} style={{ width: "100%", marginBottom: 15,backgroundColor: '#00336C', color: '#fff'}} >Transfer</Button>
                            </Col>
                            <Col className="gutter-row" justify="center" span={12} >
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} > <Icon type='download' /> Pull</Button>
                                {(localStorage.getItem("type")==="admin" || localStorage.getItem("type")==="dealer")?<Button type="primary "  style={{ width: "100%", marginBottom: 15 }} onClick={() => { this.showSaveProfileModal(true, 'profile') }} > <Icon type="save" style={{fontSize:"14px" }} /> Save Profile</Button>:null}
                                {(localStorage.getItem("type")==="admin")?<Button type="primary " style={{ width: "100%", marginBottom: 15 }} onClick={() => { this.showSaveProfileModal(true, 'policy') }} ><Icon type="save" style={{fontSize:"14px" }} /> Save Policy</Button>:null}
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>
                                <Button type="default " disabled style={{ width: "100%", marginBottom: 15}} >N/A</Button>

                            </Col>

                        </Row>
                    </Card>
                    <Card>
                        <Row gutter={16} type="flex" justify="center" align="top">
                            <Col span={12} className="gutter-row" justify="center" >

                                <Button type={button_type}
                                    onClick={() => (device_status === "Activate") ? this.handleActivateDevice(this.props.device) : this.handleSuspendDevice(this.props.device, this)}
                                    style={{ width: "100%", marginBottom: 15, fontSize: "12px" }} >

                                    {(this.props.device.account_status === '') ? <div><Icon type="user-delete" /> {device_status}</div> : <div><Icon type="user-add" /> {device_status}</div>}
                                </Button>

                                <Button disabled={this.props.device.unlink_status ? true: this.state.disabled}
                                    onClick={()=>showConfirm(this.props.device.usr_device_id,this.props.unlinkDevice,this)} 
                                    style={{ width: "100%", marginBottom: 15, backgroundColor: '#00336C', color: '#fff' }} ><Icon type='disconnect' />Unlink</Button>
                            </Col>
                            <Col className="gutter-row" justify="center" span={12} >
                                <Button  onClick={()=>this.refs.edit_device.showModal(this.props.device,this.props.editDevice)} style={{ width: "100%", marginBottom: 15, backgroundColor: '#FF861C', color: '#fff' }}><Icon type='edit' />Edit</Button>
                                <Button disabled type="default"  style={{ width: "100%", marginBottom: 15}} >Power(N/A)</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                <Modal

                    style={{ top: 20 }}
                    visible={this.state.historyModal}
                    onOk={() => this.showHistoryModal(false, '')}
                    onCancel={() => this.showHistoryModal(false, '')}
                >
                    {(this.state.historyType === "history") ?
                        <TableHistory showHistoryModal={this.props.showHistoryModal} histories={this.props.histories} type={this.state.historyType} />
                        :
                        (this.state.historyType === "profile") ?
                            <TableHistory showHistoryModal={this.props.showHistoryModal} histories={this.props.profiles} type={this.state.historyType} />
                            :
                            (this.state.historyType === "policy") ?
                                <TableHistory showHistoryModal={this.props.showHistoryModal} histories={this.props.profiles} type={this.state.historyType} /> : null}

                </Modal>
                {/* title={this.state.profileType[0] + this.state.profileType.substring(1,this.state.profileType.length).toLowerCase()} */}
                <Modal
                    closable={false}
                    style={{ top: 20 }}

                    visible={this.state.saveProfileModal}
                    onOk={() => {
                        this.saveProfile();
                    }}
                    onCancel={() => this.showSaveProfileModal(false)}
                >
                    <Input placeholder={`Enter ${this.state.saveProfileType} name`} required onChange={(e) => { this.onInputChange(e) }} value={(this.state.saveProfileType === "policy") ? this.state.policyName : this.state.profileName} />
                </Modal>

                <ActivateDevcie ref="activate"
                    activateDevice={this.props.activateDevice}
                />

                <SuspendDevice ref="suspend"
                   suspendDevice={this.props.suspendDevice}
                   go_back={ this.props.history.goBack}
                   getDevice = {this.props.getDevicesList}
                    
                />

                <EditDevice ref='edit_device' />

                
            </div>
        )
    }
    activateDevice
    handleSuspendDevice = (device,_this) => {
        this.refs.suspend.handleSuspendDevice(device);
        
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device, this.props.refreshDevice);

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        showHistoryModal: showHistoryModal,
        showSaveProfileModal: showSaveProfileModal,
        saveProfile: saveProfile,
        hanldeProfileInput: hanldeProfileInput,
        transferDeviceProfile: transferDeviceProfile
    }, dispatch);
}
var mapStateToProps = ( {device_details}) => {
   
    return {
        historyModal: device_details.historyModal,
        saveProfileModal: device_details.saveProfileModal,
        historyType: device_details.historyType,
        saveProfileType: device_details.saveProfileType,
        profileName: device_details.profileName,
        policyName: device_details.policyName,
        app_list: device_details.app_list,
        guestPwd: device_details.guestPwd,
        guestCPwd: device_details.guestCPwd,
        encryptedPwd: device_details.encryptedPwd,
        encryptedCPwd: device_details.encryptedCPwd,
        duressPwd: device_details.duressPwd,
        duressCPwd: device_details.duressCPwd,
        adminPwd: device_details.adminPwd,
        adminCPwd: device_details.adminCPwd,
        device_id: device_details.device.device_id
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SideActions);
function showConfirm(id, action,_this) {
    confirm({
        title: 'Do you want to Unlink this Device  '+id,
        onOk() {
            _this.setState({disabled:true})
            // console.log('go back func', _this.props);
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject);
                 action(id);
                
                 _this.props.history.goBack();
                 _this.props.getDevicesList();
              //  message.success('Action Done Susscefully ');

            }).catch(() => console.log('Oops errors!'));
        },
        onCancel() { },
    });
}
