import React, { Component, Fragment } from 'react';
import { Modal, Table, Button, } from 'antd';
import { Link } from "react-router-dom";
import AddDeviceModal from '../../routes/devices/components/AddDevice';
import { ADMIN, ACTION, CREDITS, CREDITS_CASH_REQUESTS, ARE_YOU_SURE_YOU_WANT_TO_DECLINE_THIS_REQUEST, ARE_YOU_SURE_YOU_WANT_TO_ACCEPT_THIS_REQUEST, WARNING, DEVICE_UNLINKED } from '../../constants/Constants';
import { convertToLang } from '../../routes/utils/commonUtils';
import { Button_Ok, Button_Cancel, Button_Confirm, Button_Decline, Button_ACCEPT, Button_Transfer } from '../../constants/ButtonConstants';
import { DEVICE_ID, DEVICE_SERIAL_NUMBER, DEVICE_IMEI_1, DEVICE_SIM_2, DEVICE_IMEI_2, DEVICE_REQUESTS, DEVICE_SIM_1 } from '../../constants/DeviceConstants';
import { DEALER_NAME } from '../../constants/DealerConstants';
const confirm = Modal.confirm;

export default class NewDevices extends Component {
    constructor(props) {
        super(props);
        const columns = [
            { title: convertToLang(props.translation[""], "AVAILABLE CREDITS"), dataIndex: 'user_credit', key: 'user_credit', align: "center" },
            { title: convertToLang(props.translation[""], "CREDITS DUE"), dataIndex: 'due_credit', key: 'due_credit', align: "center" },
        ];

        this.state = {
            columns: columns,
            visible: false,
        }
    }



    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false,
        });
    }
    componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {

    }

    renderList() {
        return [{
            key: 1,
            user_credit: this.props.user_credit,
            due_credit: this.props.due_credit,
        }]
    }
    render() {
        return (
            <div>
                <Modal
                    width={350}
                    maskClosable={false}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                    // cancelButtonDisabled={true}
                    footer={false}
                // cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                >
                    <Fragment>
                        <h1>{convertToLang(this.props.translation[""], "CREDITS")}</h1>
                        <Table
                            bordered
                            columns={this.state.columns}
                            style={{ marginTop: 20 }}
                            dataSource={this.renderList()}
                            pagination={false}

                        />
                        <div className="edit_ftr_btn11">
                            <Button type="primary" onClick={() => {
                                this.setState({
                                    visible: false
                                })
                            }} >{convertToLang(this.props.translation[""], "OK")}</Button>
                        </div>
                    </Fragment>
                </Modal>

            </div>
        )
    }
}


// function showConfirm(_this, msg, action, request) {
//     confirm({
//         title: convertToLang(_this.props.translation[WARNING], "WARNING!"),
//         content: msg,
//         okText: convertToLang(_this.props.translation[Button_Confirm], "Confirm"),
//         cancelText: convertToLang(_this.props.translation[Button_Cancel], "Cancel"),
//         onOk() {
//             action(request);
//         },
//         onCancel() {


//         },
//     });
// }