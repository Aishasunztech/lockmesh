import React, { Component } from 'react'
import styles from './AppList';
import { Card, Table, Icon } from "antd";
import { getStatus, getColor, checkValue, titleCase, convertToLang } from '../../../routes/utils/commonUtils'
import { Redirect, Link } from 'react-router-dom';
import {
    DEVICE_ID,
    DEVICE_REMAINING_DAYS,
    DEVICE_FLAGGED,
    DEVICE_STATUS,
    DEVICE_MODE,
    DEVICE_NAME,
    DEVICE_ACTIVATION_CODE,
    DEVICE_ACCOUNT_EMAIL,
    DEVICE_PGP_EMAIL,
    DEVICE_CHAT_ID,
    DEVICE_CLIENT_ID,
    DEVICE_DEALER_ID,
    DEVICE_DEALER_PIN,
    DEVICE_MAC_ADDRESS,
    DEVICE_SIM_ID,
    DEVICE_IMEI_1,
    DEVICE_SIM_1,
    DEVICE_IMEI_2,
    DEVICE_SIM_2,
    DEVICE_SERIAL_NUMBER,
    DEVICE_MODEL,
    DEVICE_START_DATE,
    DEVICE_EXPIRY_DATE,
    DEVICE_DEALER_NAME,
    DEVICE_S_DEALER,
    DEVICE_S_DEALER_NAME,
    USER_ID,
    IP_ADDRESS,
    OFFLINE,
    REMAINING_TERM_DAYS,
    ONLINE,
    DEVICE_TYPE,
    DEVICE_VERSION,
    DEVICE_FIRMWAREINFO
} from '../../../constants/DeviceConstants';
import { Button_Refresh } from '../../../constants/ButtonConstants';
import { ADMIN } from '../../../constants/Constants';
import moment from 'moment';
let make_red = 'captilize';

export default class DeviceSidebar extends Component {
    // constructor(props){
    //     super(props);
    // }
    // componentDidMount(){

    // }    
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            user_id: '',
            dealer_id: '',
            goToPage: '/dealer/dealer'
        };
    }

    renderDetailsData(device_details) {
        // console.log(device_details, 'device is')

        //  let status = getStatus(device_details.status, device_details.account_status, device_details.unlink_status, device_details.device_status, device_details.activation_status);
        let color = getColor(device_details.finalStatus)


        // let device_status = 'Active';

        // if ((device_details.status === 'expired')) {
        //     device_status = 'Expired';
        //     make_red = 'make_red captilize'
        // } else if (device_details.account_status === 'suspended') {
        //     device_status = 'Suspended';
        //     make_red = 'make_red captilize'
        // } else if (device_details.unlink_status === 1) {
        //     device_status = 'Unlinked';
        //     make_red = 'make_red captilize'
        // } else {
        //     device_status = 'Active';
        //     make_red = 'captilize'
        // }
        // console.log(device_details);

        return [
            {
                key: 1,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_STATUS], "STATUS"))}:</a>),
                value: <span style={color}>{checkValue(device_details.finalStatus)}</span>,
            },
            {
                key: 26,
                name: (<a>{titleCase(convertToLang(this.props.translation[REMAINING_TERM_DAYS], 'REMAINING TERM DAYS'))}:</a>),
                value: (device_details.remainTermDays > 0) ? device_details.remainTermDays : 0
            },
            {
                key: 2,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_MODE], "MODE"))}:</a>),
                value: device_details.online ? (device_details.online === "online") ? (<span style={{ color: "green" }}>{titleCase(convertToLang(this.props.translation[ONLINE], "Online"))}</span>) : (<span style={{ color: "red" }}>{titleCase(convertToLang(this.props.translation[OFFLINE], "Offline"))}</span>) : "N/A"
            },
            {
                key: 10,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_CHAT_ID], "CHAT ID"))}:</a>),
                value: checkValue(device_details.chat_id)
            },
            {
                key: 8,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_PGP_EMAIL], "PGP EMAIL"))}:</a>),
                value: checkValue(device_details.pgp_email)
            },
            {
                key: 16,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SIM_ID], "SIM ID"))}:</a>),
                value: checkValue(device_details.sim_id)
            },
            {
                key: 13,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_DEALER_NAME], "DEALER NAME"))}:</a>),
                // value: (<span className="captilize">{(this.props.auth.authUser.type === ADMIN) ? <a onClick={() => { this.goToDealer(device_details) }}>{checkValue(device_details.dealer_name)}</a> : <a >{checkValue(device_details.dealer_name)}</a>}</span>)
                value: (<span className="captilize">{(this.props.auth.authUser.type === ADMIN && device_details.dealer_id) ? <Link
                    to={`/connect-dealer/${btoa(device_details.dealer_id.toString())}`.trim()}
                >
                    {checkValue(device_details.dealer_name)}</Link> : <a >{checkValue(device_details.dealer_name)}</a>}</span>)
            },
            {
                key: 14,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_DEALER_PIN], "DEALER PIN"))}:</a>),
                value: checkValue(device_details.link_code)
            },
            {
                key: 7,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL"))}:</a>),
                value: checkValue(device_details.account_email)
            },
            {
                key: 3,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_FLAGGED], "FLAGGED"))}:</a>),
                value: (device_details.flagged === '') ? "Not Flagged" : device_details.flagged
            },
            {
                key: 4,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_TYPE], "TYPE"))}:</a>),
                value: checkValue(device_details.type)
            },
            {
                key: 533,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_VERSION], "VERSION"))}:</a>),
                value: checkValue(device_details.version)
            },
            {
                key: 5,
                name: (<a >{titleCase(convertToLang(this.props.translation[DEVICE_FIRMWAREINFO], "FIRMWARE INFO"))}:</a>),
                value: <span >{checkValue(device_details.firmware_info)}</span>
            },
            {
                key: 6,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_NAME], "DEVICE NAME"))}:</a>),
                value: (<span className="captilize">{checkValue(device_details.name)}</span>)
            },
            {
                key: 9,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_ACTIVATION_CODE], "ACTIVATION-CODE"))}:</a>),
                value: checkValue(device_details.activation_code)
            },

            {
                key: 11,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_CLIENT_ID], "CLIENT-ID"))}:</a>),
                value: checkValue(device_details.client_id)
            },
            {
                key: 12,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_DEALER_ID], "DEALER-ID"))}:</a>),
                value: checkValue(device_details.dealer_id)
            },
            {
                key: 15,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_MAC_ADDRESS], "MAC-ADDRESS"))}:</a>),
                value: checkValue(device_details.mac_address)
            },
            {
                key: 1222,
                name: (<a href="javascript:void(0)">{titleCase(convertToLang(this.props.translation[""], "SIM ID 2"))}:</a>),
                value: checkValue(device_details.sim_id2)
            },

            {
                key: 17,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_IMEI_1], "IMEI-1"))}:</a>),
                value: checkValue(device_details.imei)
            },
            {
                key: 18,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SIM_1], "SIM-1"))}:</a>),
                value: checkValue(device_details.simno)
            },
            {
                key: 19,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_IMEI_2], "IMEI-2"))}:</a>),
                value: checkValue(device_details.imei2)
            },
            {
                key: 20,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SIM_2], "SIM-2"))}:</a>),
                value: checkValue(device_details.simno2)
            },

            {
                key: 21,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_SERIAL_NUMBER], "SERIAL-NUMBER"))}:</a>),
                value: checkValue(device_details.serial_number)
            },
            {
                key: 22,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_MODEL], "MODEL"))}:</a>),
                value: checkValue(device_details.model)
            },
            {
                key: 23,
                name: (<a>{titleCase(convertToLang(this.props.translation[IP_ADDRESS], "IP-ADDRESS"))}:</a>),
                value: checkValue(device_details.ip_address)
            },

            {
                key: 24,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_S_DEALER], "S-DEALER"))}:</a>),
                value: checkValue(device_details.s_dealer)
            },
            {
                key: 25,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_S_DEALER_NAME], "S-DEALER NAME"))}:</a>),
                value: checkValue(device_details.s_dealer_name)
            },
            {
                key: 27,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_START_DATE], "START DATE"))}:</a>),
                value: checkValue(device_details.start_date)
            },
            {
                key: 28,
                name: (<a>{titleCase(convertToLang(this.props.translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"))}:</a>),
                value: checkValue(device_details.expiry_date)
            },
            {
                key: 29,
                name: (<a>{titleCase(convertToLang(this.props.translation["Last Online"], "Last Online"))}:</a>),
                value: checkValue(device_details.lastOnline)
                // value: moment(device_details.lastOnline).format("MM/DD/YYYY HH:mm:ss")
            },
            {
                key: 30,
                name: (<a>{titleCase(convertToLang(this.props.translation["Note"], "Note"))}:</a>),
                value: checkValue(device_details.note)
            }
        ]
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
            if (this.props.auth.authUser.type === ADMIN) {
                this.props.history.push(`/connect-dealer/${btoa(dealer.dealer_id.toString())}`.trim())
            } else {
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
    }

    renderDetailsColumns(device_details) {
        return [
            {
                title: <div>
                    <p style={{ margin: "8px 0" }}>{convertToLang(this.props.translation[DEVICE_ID], "ID")}:</p>
                    <p style={{ margin: "8px 0" }}>{convertToLang(this.props.translation[USER_ID], USER_ID)}:</p>
                </div>,
                dataIndex: 'name',
                className: "device_info",
                width: 110,
            },
            {
                key: 0,
                title: (
                    <div>
                        <a className="ref-btn" onClick={() => {
                            this.props.refreshDevice(device_details.device_id, true)
                        }}>
                            <Icon type="sync" spin className="loading_icon" />
                            <Icon type="reload" />
                            {convertToLang(this.props.translation[Button_Refresh], "Refresh")}
                        </a>
                        <div>
                            <p style={{ margin: "8px 0" }}>{device_details.device_id}</p>
                        </div>
                        <p style={{ margin: "8px 0" }}>{<a onClick={() => { this.handleUserId(device_details.user_id) }}>{checkValue(device_details.user_id)}</a>}</p>
                    </div>
                ),
                dataIndex: 'value',
                className: "device_value",
                width: "auto",
            }
        ]
    }

    render() {
        const { redirect } = this.state
        if (redirect && this.state.user_id !== '') {
            return <Redirect
                to={{
                    pathname: '/users',
                    state: { id: this.state.user_id }
                }} />
        }

        if (redirect && this.state.dealer_id !== '') {
            return <Redirect
                to={{
                    pathname: this.state.goToPage,
                    state: { id: this.state.dealer_id }
                }} />
        }
        return (
            <Card>
                <Table
                    columns={this.renderDetailsColumns(this.props.device_details)}
                    dataSource={
                        this.renderDetailsData(this.props.device_details)
                    }
                    scroll={{ y: 546 }}
                    pagination={false}
                />
            </Card>
        )
    }
}
