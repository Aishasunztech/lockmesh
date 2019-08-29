import React, { Component, Fragment } from 'react'
import { Table, Button, Card, Tag, Form, Input, Popconfirm, Empty, Icon } from "antd";
import { Redirect } from 'react-router-dom';
// import styles from './devices.css'
import CustomScrollbars from "../../../util/CustomScrollbars";
// import styles1 from './devices_fixheader.css'
import { Link } from "react-router-dom";
// import SuspendDevice from './SuspendDevice';
// import ActivateDevcie from './ActivateDevice';
import { getStatus, getColor, checkValue, getSortOrder, checkRemainDays, convertToLang, checkRemainTermDays } from '../../utils/commonUtils'
// import EditDevice from './editDevice';
// import AddDevice from './AddDevice';
import { Tabs, Modal } from 'antd';
import {
    DEVICE_ACTIVATED,
    DEVICE_EXPIRED,
    DEVICE_PENDING_ACTIVATION,
    DEVICE_PRE_ACTIVATION,
    DEVICE_SUSPENDED,
    DEVICE_UNLINKED,
    DEVICE_TRIAL,
    ADMIN,
    Name,
    Value,
    ALERT_TO_SURE_DELETE_ALL_DEVICES,
    DEALER
} from '../../../constants/Constants'
import {
    Button_Modify,
    Button_Delete,
    Button_Activate,
    Button_Connect,
    Button_Yes,
    Button_Ok,
    Button_Cancel,
    Button_Suspend,
    Button_Unsuspend,
    Button_Edit,
    Button_passwordreset,
    Button_submit,
    Button_Flag,
    Button_UNFLAG,
    Button_No,
    Button_ACCEPT,
    Button_Decline,
} from '../../../constants/ButtonConstants';

import {
    Tab_All,
    Tab_Active,
    Tab_Expired,
    Tab_Trial,
    Tab_Suspended,
    Tab_PreActivated,
    Tab_PendingActivation,
    Tab_Transfer,
    Tab_Unlinked,
    Tab_Flagged,
    Tab_ComingSoon,
    Tab_Archived,
} from '../../../constants/TabConstants';

import { isNull } from 'util';
import { unlink } from 'fs';
import { ARE_YOU_SURE_YOU_WANT_DELETE_THE_DEVICE, DO_YOU_REALLY_WANT_TO_UNFLAG_THE_DEVICE, ARE_YOU_SURE_YOU_WANT_UNLINK_THE_DEVICE } from '../../../constants/DeviceConstants';



export default class FilterDevicesList extends Component {

    constructor(props) {
        super(props);
        this.confirm = Modal.confirm;

        this.state = {
            searchText: '',
            showMsg: false,
            editing: false,
            msg: "",
            columns: props.columns,
            devices: [],
            pagination: this.props.pagination,
            selectedRows: [],
            selectedRowKeys: [],
            self: this,
            redirect: false,
            user_id: '',
            expandedRowKeys: [],
            dealer_id: '',
            goToPage: '/dealer/dealer'
        };
        this.renderList = this.renderList.bind(this);
        this.sideScroll = this.sideScroll.bind(this);
    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /></a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    deleteUnlinkedDevice = (action, device) => {
        let arr = [];
        arr.push(device);
        let title = convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_DELETE_THE_DEVICE], "Are you sure, you want to delete the device");
        this.confirmDelete(action, arr, title);
    }
    handleUserId = (user_id) => {
        if (user_id !== 'null' && user_id !== null) {
            this.setState({
                redirect: true,
                user_id: user_id
            })
        }
    }
    goToDealer = (dealer) => {
        if (dealer.dealer_id !== 'null' && dealer.dealer_id !== null) {
            if (dealer.connected_dealer === 0 || dealer.connected_dealer === '' || dealer.connected_dealer === null) {
                this.setState({
                    redirect: true,
                    dealer_id: dealer.dealer_id,
                    goToPage: '/dealer/dealer'
                })
            } else {
                this.setState({
                    redirect: true,
                    dealer_id: dealer.dealer_id,
                    goToPage: '/dealer/sdealer'
                })
            }

        }
    }


    // renderList
    renderList(list) {
        // console.log('list of dec', list)
        return list.map((device, index) => {

            var status = device.finalStatus;
            const button_type = (status === DEVICE_ACTIVATED || status === DEVICE_TRIAL) ? "danger" : "dashed";
            const flagged = device.flagged;
            // console.log("not avail", status);
            var order = getSortOrder(status)
            let color = getColor(status);
            var style = { margin: '0', width: 'auto', textTransform: 'uppercase' }
            var text = convertToLang(this.props.translation[Button_Edit], "EDIT");
            // var icon = "edit";

            // if ((status === 'pending activation') || (device.unlink_status === 1)) {
            if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
                // console.log('device name', device.name, 'status', device.unlink_status)
                style = { margin: '0 8px 0 0', width: 'auto', display: 'none', textTransform: 'uppercase' }
                text = "ACTIVATE";
                // icon = 'add'
            }

            let SuspendBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleSuspendDevice(device)}> {convertToLang(this.props.translation[Button_Suspend], "SUSPEND")}</Button>;
            let ActiveBtn = <Button type={button_type} size="small" style={style} onClick={() => this.handleActivateDevice(device)}> {convertToLang(this.props.translation[Button_Unsuspend], "UN-SUSPEND")}</Button>;
            let DeleteBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px ', textTransform: 'uppercase' }} onClick={() => this.deleteUnlinkedDevice('unlink', device)} >{convertToLang(this.props.translation[Button_Delete], "DELETE")}</Button>
            let ConnectBtn = <Link to={`connect-device/${btoa(device.device_id)}`.trim()}><Button type="default" size="small" style={style}>  {convertToLang(this.props.translation[Button_Connect], "CONNECT")}</Button></Link>
            let EditBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button>
            let EditBtnPreActive = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => this.refs.edit_device.showModal(device, this.props.editDevice)} >{text}</Button>
            let AcceptBtn = <Button type="primary" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.refs.add_device.showModal(device, this.props.addDevice) }}> {convertToLang(this.props.translation[Button_ACCEPT], "ACCEPT")} </Button>;
            let DeclineBtn = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => { this.handleRejectDevice(device) }}>{convertToLang(this.props.translation[Button_Decline], "DECLINE")}</Button>
            let DeleteBtnPreActive = <Button type="danger" size="small" style={{ margin: '0 8px 0 8px', textTransform: 'uppercase' }} onClick={() => this.deleteUnlinkedDevice('pre-active', device)}>{convertToLang(this.props.translation[Button_Delete], "DELETE")} </Button>
            let Unflagbtn = <Button
                type="defualt"
                size="small"
                style={{ margin: '0 8px 0 0', color: "#fff", background: "#000", textTransform: 'uppercase' }}
                onClick={() => { (device.finalStatus == "Transfered") ? this.props.unlinkConfirm(device) : this.props.unflagConfirm(device) }}
                disabled={(device.finalStatus == "Transfered") ? true : false}
            >{convertToLang(this.props.translation[Button_UNFLAG], "UNFLAG")} </Button>;

            // console.log(device.usr_device_id,'key', device.device_id)
            // console.log('end', device)
            // console.log(device.id, 'ids')
            return {
                // sortOrder: <span style={{ display: 'none' }}>{order}</span>,
                // sortOrder: (<span id="order">{order}</span>),
                // sortOrder: {order},
                rowKey: index,
                // key: device.device_id ? `${device.device_id}` : device.usr_device_id,
                key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ` : device.id,
                counter: ++index,

                status: (<span style={color} > {status}</span>),
                lastOnline: checkValue(device.lastOnline),
                flagged: device.flagged,
                type: checkValue(device.type),
                version: checkValue(device.version),
                device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
                // device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : (device.validity) ? (this.props.tabselect == '3') ? `${device.validity}` : "N/A" : "N/A",
                user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
                validity: checkValue(device.validity),
                transfered_to: checkValue((device.finalStatus == "Transfered") ? device.transfered_to : null),
                name: checkValue(device.name),
                activation_code: checkValue(device.activation_code),
                account_email: checkValue(device.account_email),
                pgp_email: checkValue(device.pgp_email),
                chat_id: checkValue(device.chat_id),
                client_id: checkValue(device.client_id),
                dealer_id: checkValue(device.dealer_id),
                dealer_pin: checkValue(device.link_code),
                mac_address: checkValue(device.mac_address),
                sim_id: checkValue(device.sim_id),
                imei_1: checkValue(device.imei),
                sim_1: checkValue(device.simno),
                imei_2: checkValue(device.imei2),
                sim_2: checkValue(device.simno2),
                serial_number: checkValue(device.serial_number),
                model: checkValue(device.model),
                // start_date: device.start_date ? `${new Date(device.start_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                // expiry_date: device.expiry_date ? `${new Date(device.expiry_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
                dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
                online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
                s_dealer: checkValue(device.s_dealer),
                s_dealer_name: checkValue(device.s_dealer_name),
                remainTermDays: device.remainTermDays,
                start_date: checkValue(device.start_date),
                expiry_date: checkValue(device.expiry_date),
            }
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                devices: this.props.devices,
                columns: this.props.columns,

            })
        }
        // console.log('did update', )
    }

    deleteAllUnlinkedDevice = (type) => {
        // console.log(this.state.selectedRows, 'selected keys', this.state.selectedRowKeys)
        // console.log(type);
        if (this.state.selectedRowKeys.length) {
            let title = convertToLang(this.props.translation[ALERT_TO_SURE_DELETE_ALL_DEVICES], " Are you sure, you want to delete All these devices");
            let arr = [];
            // console.log('delete the device', this.state.selectedRowKeys);
            for (let id of this.state.selectedRowKeys) {
                for (let device of this.props.devices) {
                    if (type !== 'unlink') {
                        if (id === device.id) {
                            arr.push(device)
                        }
                    }
                    else {
                        if (id === device.user_acc_id) {
                            arr.push(device)
                        }
                    }
                }
            }
            // console.log('object of ', arr);
            this.confirmDelete(type, arr, title);
        }
        //  console.log('DELETE ALL 1', this.state.selectedRows);

    }

    confirmDelete = (action, devices, title) => {

        // console.log(action);
        // console.log(devices);
        this.confirm({
            title: title,
            content: '',
            okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
            cancelText: convertToLang(this.props.translation[Button_No], 'No'),
            onOk: (() => {

                this.props.deleteUnlinkDevice(action, devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)
                this.resetSeletedRows();
                if (this.refs.tablelist.props.rowSelection !== null) {
                    this.refs.tablelist.props.rowSelection.selectedRowKeys = []
                }
            }),
            onCancel() { },
        });
    }


    handlePagination = (value) => {
        // alert('sub child');
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    resetSeletedRows = () => {
        // console.log('table ref', this.refs.tablelist)
        this.setState({
            selectedRowKeys: [],
            selectedRows: [],
        })
    }

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.key)) {
                this.state.expandedRowKeys.push(record.key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.key)) {
                let list = this.state.expandedRowKeys.filter(item => item !== record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    // componentWillReceiveProps() {
    //     this.setState({
    //         devices: this.props.devices,
    //         columns: this.props.columns
    //     })

    // }

    scrollBack = () => {
        let element = document.getElementById('scrolltablelist');
        console.log(element.scrollLeft)
        element.scrollLeft += 100;
        console.log(element.scrollLeft)
        // var element = this.refs.tablelist; //document.getElementsByClassName("scrolltablelist");
        // console.log(element)
        // this.sideScroll(element, 'left', 25, 100, 10);
    }

    scrollNext = () => {
        console.log('hi scroll next')
        var element = this.refs.tablelist; // document.getElementsByClassName("scrolltablelist");  // ant-table-body   scrolltablelist  ant-table-scroll
        this.sideScroll(element, 'right', 25, 100, 10);
    }

    sideScroll(element, direction, speed, distance, step) {
        console.log('hi sideScroll function')
        // element.props.scroll.x=15;
        // element.props.style.scrollMargin="100px";
        console.log('element is: ', element.props);
        // console.log('direction is: ', direction);
        // console.log('speed is: ', speed);
        // console.log('distance is: ', distance);
        // console.log('step is: ', step)

        var scrollAmount = 0;
        // var slideTimer = setInterval(function () {
        //     if (direction === 'left') {
        //         element.scrollLeft -= step;
        //     } else {
        //         element.scrollLeft += step;
        //     }
        //     scrollAmount += step;
        //     if (scrollAmount >= distance) {
        //         window.clearInterval(slideTimer);
        //     }
        // }, speed);
    }

    render() {

        // console.log(this.state, 'selected keys', )
        // const { activateDevice, suspendDevice } = this.props;
        // const { redirect } = this.state
        // if (redirect && this.state.user_id !== '') {
        //     return <Redirect to={{
        //         pathname: '/users',
        //         state: { id: this.state.user_id }
        //     }} />
        // }

        // if (redirect && this.state.dealer_id !== '') {
        //     return <Redirect to={{
        //         pathname: this.state.goToPage,
        //         state: { id: this.state.dealer_id }
        //     }} />
        // }

        let rowSelection;
        if (true) {
            rowSelection = {
                // selectedDealers,
                onChange: this.props.onSelectChange,
                selectionColumnIndex: 1,
                selectedRowKeys: this.props.selectedRowKeys,
                selectedRows: this.props.selectedRows
            };
        }

        return (
            // <div className="dev_table">
            //     {/* <ActivateDevcie ref="activate"
            //         activateDevice={activateDevice}
            //         translation={this.props.translation}
            //     />
            //     <SuspendDevice ref="suspend"
            //         suspendDevice={suspendDevice}
            //         translation={this.props.translation}
            //     /> */}
            //     {/* <Card className={`fix_card ${this.props.styleType}`}> */}
            //     {/* <hr className="fix_header_border" style={{ top: "56px" }} /> */}
            //     <CustomScrollbars className="gx-popover-scroll ">
            <Table
                // id="test"
                id='scrolltablelist'
                ref='tablelist'
                className={"devices "}
                rowSelection={rowSelection}
                rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
                size="middle"
                bordered
                columns={this.props.columns}
                onChange={this.props.onChangeTableSorting}
                dataSource={this.renderList(this.props.devices)}
                hideDefaultSelections={this.props.hideDefaultSelections}
                pagination={
                    false
                    // pageSize: Number(this.state.pagination),
                    //size: "midddle",
                }

            />
            //         {/* <Button onClick={this.scrollBack} style={{ display: 'none' }} > Previous</Button>
            //         <Button onClick={this.scrollNext} style={{ display: 'none' }} > Next</Button> */}
            //     </CustomScrollbars>
            //     {/* </Card> */}

            //     {/* <EditDevice ref='edit_device'
            //         translation={this.props.translation}
            //         getSimIDs={this.props.getSimIDs}
            //         getChatIDs={this.props.getChatIDs}
            //         getPgpEmails={this.props.getPgpEmails}
            //     />
            //     <AddDevice ref="add_device"
            //         translation={this.props.translation}
            //     /> */}
            // </div >

        )
    }

    handleSuspendDevice = (device) => {
        this.refs.suspend.handleSuspendDevice(device);
    }

    handleActivateDevice = (device) => {
        this.refs.activate.handleActivateDevice(device);
    }

    handleRejectDevice = (device) => {

        this.props.rejectDevice(device)
    }
    addDevice = (device) => {
        // console.log(device);
        // this.props.addDevice(device);
    }

}