import React from "react";
import { Input, Button, Icon, Select, Popover } from "antd";
import { titleCase, convertToLang } from './commonUtils';
import { Markup } from 'interweave';
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
    DEVICE_TYPE,
    DEVICE_VERSION
} from '../../constants/DeviceConstants';
import {
    // DEVICE_ID,
    // USER_ID,
    DEVICES,
    USER_NAME,
    USER_EMAIL,
    USER_DATE_REGISTERED,
    USER_TOKEN
} from '../../constants/UserConstants';

import {
    DEALER_ID,
    DEALER_NAME,
    DEALER_EMAIL,
    DEALER_PIN,
    // DEALER_DEVICES,
    DEALER_TOKENS,
    // DEALER_ACTION,
    Parent_Dealer,
    Parent_Dealer_ID,
    DEALER_ACTION,
    DEALER_DEVICES
} from '../../constants/DealerConstants';

// Mobile view 
import {
    DEVICE_ACTIVATED, GUEST_PASSWORD, ENCRYPTED_PASSWORD, DURESS_PASSWORD, ADMIN_PASSWORD,
    SECURE_SETTING, SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
    APPLICATION_PERMISION, SECURE_SETTING_PERMISSION, SYSTEM_PERMISSION, MANAGE_PASSWORDS,
    Main_SETTINGS,
    SET_GUEST_PASSWORD,
    SET_ENCRYPTED_PASSWORD,
    SET_DURESS_PASSWORD,
    CHANGE_ADMIN_PANEL_CODE,
    PERMISSION_NAME,
    ACTION
} from '../../constants/Constants';

import {
    Guest,
    ENCRYPTED,
    ENABLE,
    EXTENSION_NAME,
    ADMIN_PASSWORD_IS_CHANGED,
    ENCRYPTED_PASSWORD_IS_CHANGED,
    GUEST_PASSWORD_IS_CHANGED,
    DURESS_PASSWORD_IS_CHANGED
} from '../../constants/TabConstants';
import {
    APK_APP_NAME,
    APK_PERMISSION,
    APK_SHOW_ON_DEVICE,
    APK, APK_APP_LOGO,
    APK_SIZE,
    USER_DEVICES_HELPING_TEXT,
    APK_PERMISSION_HELPING_TEXT,
    SHOW_ON_DEVCIE_HELPING_TEXT
} from "../../constants/ApkConstants";
import {
    POLICY_ACTION,
    POLICY_INFO,
    POLICY_PERMISSIONS,
    POLICY_STATUS, POLICY_NAME,
    POLICY_APP_NAME, POLICY_COMMAND,
    POLICY_NOTE,
    POLICY_DEFAULT,
    POLICY_PERMISSION_HELPING_TEXT,
    POLICY_STATUS_HELPING_TEXT,
    POLICY_SIZE
} from "../../constants/PolicyConstants";



/////////////////////////////////////////
// **************************************
// ******* devicesColumns
// ******* usersColumns
// ******* userDevicesListColumns
// ******* dealerColumns
// ******* sDealerColumns
// ******* dealerColsWithSearch
// ******* mobileMainMenu
// **************************************
/////////////////////////////////////////

export function devicesColumns(translation, handleSearch) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            dataIndex: 'action',
            align: 'center',
            className: 'row',
            key: "action"
            // title: <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.refs.devcieList.deleteAllUnlinkedDevice('unlink')} >Delete Selected</Button>,
            // title: (this.state.tabselect === "5") ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>:'',
        },
        {
            title: (
                <Input.Search
                    name="validity"
                    key="validity"
                    id="validity"
                    className="search_heading remaning_days_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_REMAINING_DAYS], "REMAINING DAYS")}
                // onBlur={(e) => { console.log(e);; e.target.value = ''; }}
                />
            ),
            dataIndex: 'validity',
            className: 'hide',
            children: [
                {
                    title: convertToLang(translation[DEVICE_REMAINING_DAYS], "REMAINING DAYS"),
                    align: "center",
                    dataIndex: 'validity',
                    key: "validity",
                    className: 'hide',
                    sorter: (a, b) => { return a.validity - b.validity },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    className="search_heading device_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ID], "DEVICE ID")}
                // onBlur={(e) => { e.target.value = '' }}
                />
            ),

            dataIndex: 'device_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ID], "DEVICE ID"),
                    align: "center",
                    dataIndex: 'device_id',
                    key: "device_id",
                    sorter: (a, b) => {
                        let list = a.device_id.localeCompare(b.device_id);

                        return list
                    }, //
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        }, {
            title: (
                <Input.Search
                    name="user_id"
                    key="user_id"
                    id="user_id"
                    className="search_heading user_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_ID], "USER ID")}
                // onBlur={(e) => { e.target.value = '' }}
                />
            ),
            dataIndex: 'user_id',
            children: [
                {
                    title: convertToLang(translation[USER_ID], "USER ID"),
                    align: "center",
                    dataIndex: 'user_id',
                    key: "user_id",
                    sorter: (a, b) => {
                        console.log(a); return a.user_id.props.children.localeCompare(b.user_id.props.children)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="finalStatus"
                    key="status"
                    id="status"
                    className="search_heading status_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_STATUS], "STATUS")}
                // onBlur={(e) => { e.target.value = '' }}
                />
            ),
            dataIndex: 'status',
            children: [
                {
                    title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
                    align: "center",
                    dataIndex: 'status',
                    key: 'status',
                    sorter: (a, b) => { return a.status.props.children[1].localeCompare(b.status.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="online"
                    key="online"
                    id="online"
                    className="search_heading online_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MODE], "MODE")}
                />
            ),
            dataIndex: 'online',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MODE], "MODE"),
                    align: "center",
                    dataIndex: 'online',
                    key: 'online',
                    sorter: (a, b) => { return a.online.props.children[1].localeCompare(b.online.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="type"
                    key="type"
                    id="type"
                    className="search_heading"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_TYPE], DEVICE_TYPE)}
                />
            ),
            dataIndex: 'type',
            children: [
                {
                    title: convertToLang(translation[DEVICE_TYPE], DEVICE_TYPE),
                    align: "center",
                    dataIndex: 'type',
                    key: 'type',
                    sorter: (a, b) => { return a.type.props.children[1].localeCompare(b.type.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="version"
                    key="version"
                    id="version"
                    className="search_heading"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_VERSION], DEVICE_VERSION)}
                />
            ),
            dataIndex: 'version',
            children: [
                {
                    title: convertToLang(translation[DEVICE_VERSION], DEVICE_VERSION),
                    align: "center",
                    dataIndex: 'version',
                    key: 'version',
                    sorter: (a, b) => { return a.version.props.children[1].localeCompare(b.version.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="flagged"
                    key="flagged"
                    id="flagged"
                    className="search_heading flagged_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_FLAGGED], "FLAGGED")}
                />
            ),
            dataIndex: 'flagged',
            children: [
                {
                    title: convertToLang(translation[DEVICE_FLAGGED], "FLAGGED"),
                    align: "center",
                    dataIndex: 'flagged',
                    key: 'flagged',
                    sorter: (a, b) => { return a.status.props.children[1].localeCompare(b.status.props.children[1]) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="name"
                    key="name"
                    id="name"
                    className="search_heading name_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_NAME], "NAME")}
                />
            ),
            dataIndex: 'name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_NAME], "NAME"),
                    align: "center",
                    dataIndex: 'name',
                    key: 'name',
                    sorter: (a, b) => { return a.name.localeCompare(b.name) },
                    sortDirections: ['ascend', 'descend'],
                    editable: true,

                }
            ]


        },
        {
            title: (
                <Input.Search
                    name="account_email"
                    key="account_email"
                    id="account_email"
                    className="search_heading account_email_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL")}
                />
            ),
            dataIndex: 'account_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACCOUNT_EMAIL], "ACCOUNT EMAIL"),
                    align: "center",
                    dataIndex: 'account_email',
                    key: 'account_email',
                    sorter: (a, b) => { return a.account_email.localeCompare(b.account_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="activation_code"
                    key="activation_code"
                    id="activation_code"
                    className="search_heading activation_code_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE")}
                />
            ),
            dataIndex: 'activation_code',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"),
                    align: "center",
                    dataIndex: 'activation_code',
                    sorter: (a, b) => { return a.activation_code - b.activation_code },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="client_id"
                    key="client_id"
                    id="client_id"
                    className="search_heading client_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_CLIENT_ID], "CLIENT ID")}
                />
            ),
            dataIndex: 'client_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CLIENT_ID], "CLIENT ID"),
                    align: "center",
                    dataIndex: 'client_id',
                    key: 'client_id',
                    sorter: (a, b) => { return a.client_id.localeCompare(b.client_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="pgp_email"
                    key="pgp_email"
                    id="pgp_email"
                    className="search_heading pgp_email_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL")}
                />
            ),
            dataIndex: 'pgp_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"),
                    align: "center",
                    dataIndex: 'pgp_email',
                    sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="sim_id"
                    key="sim_id"
                    id="sim_id"
                    className="search_heading sim_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_ID], "SIM ID")}
                />
            ),
            dataIndex: 'sim_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_ID], "SIM ID"),
                    align: "center",
                    dataIndex: 'sim_id',
                    key: 'sim_id',
                    sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="chat_id"
                    key="chat_id"
                    id="chat_id"
                    className="search_heading chat_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID")}
                />
            ),
            dataIndex: 'chat_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"),
                    align: "center",
                    dataIndex: 'chat_id',
                    key: 'chat_id',
                    sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading dealer_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_ID], "DEALER ID")}
                />
            ),
            dataIndex: 'dealer_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_ID], "DEALER ID"),
                    align: "center",
                    dataIndex: 'dealer_id',
                    key: 'dealer_id',
                    sorter: (a, b) => { return a.dealer_id - b.dealer_id },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="dealer_name"
                    key="dealer_name"
                    id="dealer_name"
                    className="search_heading dealer_name_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_NAME], "DEALER NAME")}
                />
            ),
            dataIndex: 'dealer_name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_NAME], "DEALER NAME"),
                    align: "center",
                    dataIndex: 'dealer_name',
                    key: 'dealer_name',
                    sorter: (a, b) => { return a.dealer_name.props.children.localeCompare(b.dealer_name.props.children) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading dealer_pin_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN")}
                />
            ),
            dataIndex: 'dealer_pin',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"),
                    align: "center",
                    dataIndex: 'dealer_pin',
                    key: 'dealer_pin',
                    sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="mac_address"
                    key="mac_address"
                    id="mac_address"
                    className="search_heading mac_address_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MAC_ADDRESS], "MAC ADDRESS")}
                />
            ),
            dataIndex: 'mac_address',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MAC_ADDRESS], "MAC ADDRESS"),
                    align: "center",
                    dataIndex: 'mac_address',
                    key: 'mac_address',
                    sorter: (a, b) => { return a.mac_address.localeCompare(b.mac_address) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="imei"
                    key="imei"
                    id="imei"
                    className="search_heading imei_1_w"
                    autoComplete="new-password"
                    onKeyUp={handleSearch}
                    placeholder={convertToLang(translation[DEVICE_IMEI_1], "IMEI 1")}
                />
            ),
            dataIndex: 'imei_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"),
                    align: "center",
                    dataIndex: 'imei_1',
                    key: 'imei_1',
                    sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="simno"
                    key="simno"
                    id="simno"
                    className="search_heading sim_1_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_1], "SIM 1")}
                />
            ),
            dataIndex: 'sim_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_1], "SIM 1"),
                    align: "center",
                    dataIndex: 'sim_1',
                    key: 'sim_1',
                    sorter: (a, b) => { return a.sim_1.localeCompare(b.sim_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="imei2"
                    key="imei2"
                    id="imei2"
                    className="search_heading imei_2_w"
                    autoComplete="new-password"
                    onKeyUp={handleSearch}
                    placeholder={convertToLang(translation[DEVICE_IMEI_2], "IMEI 2")}
                />
            ),
            dataIndex: 'imei_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"),
                    align: "center",
                    dataIndex: 'imei_2',
                    key: 'imei_2',
                    sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="simno2"
                    key="simno2"
                    id="simno2"
                    className="search_heading sim_2_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SIM_2], "SIM 2")}
                />
            ),
            dataIndex: 'sim_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_2], "SIM 2"),
                    align: "center",
                    dataIndex: 'sim_2',
                    key: 'sim_2',
                    sorter: (a, b) => { return a.sim_2.localeCompare(b.sim_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="serial_number"
                    key="serial_number"
                    id="serial_number"
                    className="search_heading serial_number_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER")}
                />
            ),
            dataIndex: 'serial_number',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SERIAL_NUMBER], "SERIAL NUMBER"),
                    align: "center",
                    dataIndex: 'serial_number',
                    key: 'serial_number',
                    sorter: (a, b) => { return a.serial_number.localeCompare(b.serial_number) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="model"
                    key="model"
                    id="model"
                    className="search_heading model_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_MODEL], "MODEL")}
                />
            ),
            dataIndex: 'model',
            children: [
                {
                    title: convertToLang(translation[DEVICE_MODEL], "MODEL"),
                    align: "center",
                    dataIndex: 'model',
                    key: 'model',
                    sorter: (a, b) => { return a.model.localeCompare(b.model) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },

        {
            title: (
                <Input.Search
                    name="s_dealer"
                    key="s_dealer"
                    id="s_dealer"
                    className="search_heading s_dealer_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_S_DEALER], "S DEALER")}
                />
            ),
            dataIndex: 's_dealer',
            children: [
                {
                    title: convertToLang(translation[DEVICE_S_DEALER], "S DEALER"),
                    align: "center",
                    dataIndex: 's_dealer',
                    key: 's_dealer',
                    sorter: (a, b) => { return a.s_dealer.localeCompare(b.s_dealer) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="s_dealer_name"
                    key="s_dealer_name"
                    id="s_dealer_name"
                    className="search_heading s_dealer_name_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_S_DEALER_NAME], "S DEALER NAME")}
                />
            ),
            dataIndex: 's_dealer_name',
            children: [
                {
                    title: convertToLang(translation[DEVICE_S_DEALER_NAME], "S DEALER NAME"),
                    align: "center",
                    dataIndex: 's_dealer_name',
                    key: 's_dealer_name',
                    sorter: (a, b) => { return a.s_dealer_name.localeCompare(b.s_dealer_name) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="start_date"
                    key="start_date"
                    id="start_date"
                    className="search_heading start_date_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_START_DATE], "START DATE")}
                />
            ),
            dataIndex: 'start_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_START_DATE], "START DATE"),
                    align: "center",
                    dataIndex: 'start_date',
                    key: 'start_date',
                    sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="expiry_date"
                    key="expiry_date"
                    id="expiry_date"
                    className="search_heading expiry_date_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE")}
                />
            ),
            dataIndex: 'expiry_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"),
                    align: "center",
                    dataIndex: 'expiry_date',
                    key: 'expiry_date',
                    sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
    ]);
}


export function usersColumns(translation, handleSearch) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            align: "center",
            dataIndex: 'action',
            key: "action",
        },
        {
            title: (
                <Input.Search
                    name="user_id"
                    key="user_id"
                    id="user_id"
                    className="search_heading user_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_ID], "USER ID")}
                />
            ),
            dataIndex: 'user_id',
            children: [
                {
                    title: convertToLang(translation[USER_ID], "USER ID"),
                    align: "center",
                    dataIndex: 'user_id',
                    key: "user_id",
                    sorter: (a, b) => {
                        // console.log(a, 'user is is')
                        return a.user_id.localeCompare(b.user_id)
                    },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <div>
                    <Input.Search
                        name="device_id"
                        key="device_id"
                        id="device_id"
                        className="search_heading device_id_w"
                        autoComplete="new-password"
                        onKeyUp={handleSearch}
                        placeholder={convertToLang(translation[DEVICE_ID], "DEVICE ID")}
                    />
                </div>
            ),
            dataIndex: 'devices',
            className: 'row',
            children: [
                {
                    title: (
                        <span>
                            {convertToLang(translation[DEVICE_ID], "DEVICE ID")}
                            <Popover placement="top" content={(<Markup content={convertToLang(translation[USER_DEVICES_HELPING_TEXT],
                                `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                                <i class="fa fa-caret-right" aria-hidden="true"></i>
                                </a> to View Devices<br/> list of this User</p>`)} />)}>
                                <span className="helping_txt"><Icon type="info-circle" /></span>
                            </Popover>
                        </span>
                    ),
                    align: "center",
                    dataIndex: 'devices',
                    key: "devices",
                    className: 'row device_id_w_td',
                    onFilter: (value, record) => record.devices.indexOf(value) === 0,
                    sorter: (a, b) => { return a.devices - b.devices },
                    // sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="user_name"
                    key="user_name"
                    id="user_name"
                    className="search_heading user_name_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_NAME], "NAME")}
                />
            ),
            dataIndex: 'user_name',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_NAME], "NAME"),
                dataIndex: 'user_name',
                align: "center",
                key: 'user_name',
                sorter: (a, b) => { return a.user_name.localeCompare(b.user_name) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: (
                <Input.Search
                    name="email"
                    key="email"
                    id="email"
                    className="search_heading email_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_EMAIL], "EMAIL")}
                />
            ),
            dataIndex: 'email',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_EMAIL], "EMAIL"),
                dataIndex: 'email',
                align: "center",
                key: 'email',
                sorter: (a, b) => { return a.email.localeCompare(b.email.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
        {
            title: convertToLang(translation[USER_TOKEN], "USER TOKEN"),
            align: "center",
            dataIndex: 'tokens',
            key: "tokens",
            className: "token_w",
        },
        {
            title: (
                <Input.Search
                    name="created_at"
                    key="created_at"
                    id="created_at"
                    className="search_heading created_at_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[USER_DATE_REGISTERED], "DATE REGISTERED")}
                />
            ),
            dataIndex: 'created_at',
            className: 'row',
            children: [{
                title: convertToLang(translation[USER_DATE_REGISTERED], "DATE REGISTERED"),
                dataIndex: 'created_at',
                align: "center",
                key: 'created_at',
                sorter: (a, b) => { return a.created_at.localeCompare(b.created_at.toString()) },
                sortDirections: ['ascend', 'descend'],
            }]
        },
    ]);
}


export function userDevicesListColumns(translation, handleSearch) {
    return ([
        {
            // title: (this.state.tabselect === "5") ? <Button type="danger" size="small" style={{ margin: '0 8px 0 8px' }} onClick={() => this.deleteAllUnlinkedDevice()} >Delete All Selected</Button>:'',
            title: convertToLang(translation[ACTION], "ACTION"),
            dataIndex: 'action',
            align: 'center',
            className: 'row',
            width: 800,
            key: "action"
        },
        {
            title: (
                <Input.Search
                    name="activation_code"
                    key="activation_code"
                    id="activation_code"
                    className="search_heading activation_code_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"))}
                />
            ),
            dataIndex: 'activation_code',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ACTIVATION_CODE], "ACTIVATION CODE"),
                    align: "center",
                    dataIndex: 'activation_code',
                    sorter: (a, b) => { return a.activation_code.localeCompare(b.activation_code) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading link_code_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"))}
                />
            ),
            dataIndex: 'dealer_pin',
            children: [
                {
                    title: convertToLang(translation[DEVICE_DEALER_PIN], "DEALER PIN"),
                    align: "center",
                    dataIndex: 'dealer_pin',
                    key: 'dealer_pin',
                    sorter: (a, b) => { return a.dealer_pin - b.dealer_pin },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="device_id"
                    key="device_id"
                    id="device_id"
                    className="search_heading device_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_ID], "DEVICE ID"))}
                />
            ),
            dataIndex: 'device_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_ID], "DEVICE ID"),
                    align: "center",
                    dataIndex: 'device_id',
                    key: "device_id",
                    sorter: (a, b) => { return a.device_id.localeCompare(b.device_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ],
        },
        {
            title: (
                <Input.Search
                    name="finalStatus"
                    key="status"
                    id="status"
                    className="search_heading status_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_STATUS], "STATUS"))}
                />
            ),
            dataIndex: 'status',

            children: [
                {
                    title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
                    align: "center",
                    dataIndex: 'status',
                    key: 'status',
                    sorter: (a, b) => { console.log('done', a.status); return a.status.props.children[1].localeCompare(b.status.props.children[1]) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="expiry_date"
                    key="expiry_date"
                    id="expiry_date"
                    className="search_heading expiry_date_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"))}
                />
            ),
            dataIndex: 'expiry_date',
            children: [
                {
                    title: convertToLang(translation[DEVICE_EXPIRY_DATE], "EXPIRY DATE"),
                    align: "center",
                    dataIndex: 'expiry_date',
                    key: 'expiry_date',
                    sorter: (a, b) => { return a.expiry_date.localeCompare(b.expiry_date) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="pgp_email"
                    key="pgp_email"
                    id="pgp_email"
                    className="search_heading pgp_email_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"))}
                />
            ),
            dataIndex: 'pgp_email',
            children: [
                {
                    title: convertToLang(translation[DEVICE_PGP_EMAIL], "PGP EMAIL"),
                    align: "center",
                    dataIndex: 'pgp_email',
                    sorter: (a, b) => { return a.pgp_email.localeCompare(b.pgp_email) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="chat_id"
                    key="chat_id"
                    id="chat_id"
                    className="search_heading chat_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"))}
                />
            ),
            dataIndex: 'chat_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_CHAT_ID], "CHAT ID"),
                    align: "center",
                    dataIndex: 'chat_id',
                    key: 'chat_id',
                    sorter: (a, b) => { return a.chat_id.localeCompare(b.chat_id) },

                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="sim_id"
                    key="sim_id"
                    id="sim_id"
                    className="search_heading sim_id_w"
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_SIM_ID], "SIM ID"))}
                />
            ),
            dataIndex: 'sim_id',
            children: [
                {
                    title: convertToLang(translation[DEVICE_SIM_ID], "SIM ID"),
                    align: "center",
                    dataIndex: 'sim_id',
                    key: 'sim_id',
                    sorter: (a, b) => { return a.sim_id.localeCompare(b.sim_id) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="imei"
                    key="imei"
                    id="imei"
                    className="search_heading imei_w"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"))}
                    onKeyUp={handleSearch}
                />
            ),
            dataIndex: 'imei_1',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_1], "IMEI 1"),
                    align: "center",
                    dataIndex: 'imei_1',
                    key: 'imei_1',
                    sorter: (a, b) => { return a.imei_1.localeCompare(b.imei_1) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        }, {
            title: (
                <Input.Search
                    name="imei2"
                    key="imei2"
                    id="imei2"
                    className="search_heading imei2_w"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"))}
                    onKeyUp={handleSearch}
                />
            ),
            dataIndex: 'imei_2',
            children: [
                {
                    title: convertToLang(translation[DEVICE_IMEI_2], "IMEI 2"),
                    align: "center",
                    dataIndex: 'imei_2',
                    key: 'imei_2',
                    sorter: (a, b) => { return a.imei_2.localeCompare(b.imei_2) },
                    sortDirections: ['ascend', 'descend'],
                }
            ]
        },
    ]);
}


export function dealerColumns(translation, handleSearch) {
    return ([{
        title: '#',
        dataIndex: 'counter',
        align: 'center',
        className: 'row',
        render: (text, record, index) => ++index,
    }, {
        title: '',
        dataIndex: 'accounts',
        align: 'center',
        className: 'row',
    },
    {
        title: (
            <Input.Search
                name="connected_devices"
                key="connected_devices"
                id="connected_devices"
                className="search_heading"
                autoComplete="new-password"
                onKeyUp={handleSearch}
                placeholder={convertToLang(translation[DEALER_DEVICES], "DEVICES")}

            />
        ),
        dataIndex: 'connected_devices',
        className: '',
        children: [
            {
                title: convertToLang(translation[DEALER_DEVICES], "DEVICES"),
                dataIndex: 'connected_devices',
                key: 'connected_devices',
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.connected_devices.length;
                // },
                sorter: (a, b) => { return a.connected_devices - b.connected_devices },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            }
        ]
    },
    {
        title: (
            <Input.Search
                name="dealer_id"
                key="dealer_id"
                id="dealer_id"
                className="search_heading"
                autoComplete="new-password"
                placeholder={convertToLang(translation[DEALER_ID], "DEALER ID")}
                onKeyUp={handleSearch}

            />
        ),
        dataIndex: 'dealer_id',
        className: '',
        children: [
            {
                title: convertToLang(translation[DEALER_ID], "DEALER ID"),
                dataIndex: 'dealer_id',
                key: 'dealer_id',
                align: 'center',
                sorter: (a, b) => a.dealer_id - b.dealer_id,
                sortDirections: ['ascend', 'descend'],
                className: '',
            }
        ]
    }, {
        title: (
            <Input.Search
                name="link_code"
                key="link_code"
                id="link_code"
                className="search_heading"
                autoComplete="new-password"
                placeholder={convertToLang(translation[DEALER_PIN], "DEALER PIN")}
                onKeyUp={handleSearch}

            />
        ),
        dataIndex: 'link_code',
        className: '',
        children: [
            {
                title: convertToLang(translation[DEALER_PIN], "DEALER PIN"),
                dataIndex: 'link_code',
                key: 'link_code',
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.link_code.length;
                // },
                sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            }
        ]
    },
    {
        title: (
            <Input.Search
                name="dealer_name"
                key="dealer_name"
                id="dealer_name"
                className="search_heading"
                autoComplete="new-password"
                placeholder={convertToLang(translation[DEALER_NAME], "DEALER NAME")}
                onKeyUp={handleSearch}

            />
        ),
        dataIndex: 'dealer_name',
        className: '',
        children: [
            {
                title: convertToLang(translation[DEALER_NAME], "DEALER NAME"),
                dataIndex: 'dealer_name',
                key: 'dealer_name',
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.dealer_name.length;
                // },
                sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            }
        ]
    },
    {
        title: (
            <Input.Search
                name="dealer_email"
                key="dealer_email"
                id="dealer_email"
                className="search_heading"
                autoComplete="new-password"
                placeholder={convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL")}
                onKeyUp={handleSearch}

            />
        ),
        dataIndex: 'dealer_email',
        className: '',
        children: [
            {
                title: convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL"),
                dataIndex: 'dealer_email',
                key: 'dealer_email',
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.dealer_email.length;
                // },
                sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            }
        ]
    },


    {
        title: (
            <Input.Search
                name="dealer_token"
                key="dealer_token"
                id="dealer_token"
                className="search_heading"
                autoComplete="new-password"
                placeholder={convertToLang(translation[DEALER_TOKENS], "TOKENS")}
                onKeyUp={handleSearch}

            />
        ),
        dataIndex: 'dealer_token',
        className: '',
        children: [
            {
                title: convertToLang(translation[DEALER_TOKENS], "TOKENS"),
                dataIndex: 'dealer_token',
                key: 'dealer_token',
                // sorter: (a, b) => {
                //     console.log(a);
                //     // console.log(b);
                //     return a.dealer_token.length;
                // },
                sorter: (a, b) => { return a.dealer_token.localeCompare(b.dealer_token) },

            }
        ]
    }
    ]);
}

export function sDealerColumns(translation, handleSearch) {
    return ([
        {
            title: (
                <Input.Search
                    name="parent_dealer"
                    key="parent_dealer"
                    id="parent_dealer"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[Parent_Dealer], "PARENT DEALER")}
                    onKeyUp={handleSearch}
                />
            ),
            dataIndex: 'parent_dealer',
            className: '',
            children: [
                {
                    title: convertToLang(translation[Parent_Dealer], "PARENT DEALER"),
                    dataIndex: 'parent_dealer',
                    key: 'parent_dealer',
                    className: '',
                    // sorter: (a, b) => {
                    //     console.log(a);
                    //     // console.log(b);
                    //     return a.parent_dealer.length;
                    // },
                    sorter: (a, b) => { return a.parent_dealer.localeCompare(b.parent_dealer) },

                }
            ]
        },
        {
            title: (
                <Input.Search
                    name="parent_dealer_id"
                    key="parent_dealer_id"
                    id="parent_dealer_id"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[Parent_Dealer_ID], "Parent Dealer ID")}
                    onKeyUp={handleSearch}
                />
            ),
            dataIndex: 'parent_dealer_id',
            className: '',
            children: [
                {
                    title: convertToLang(translation[Parent_Dealer_ID], "Parent Dealer ID"),
                    dataIndex: 'parent_dealer_id',
                    key: 'parent_dealer_id',
                    className: '',
                    sorter: (a, b) => { return a.parent_dealer_id - b.parent_dealer_id },

                }
            ]
        }
    ]);
}


export function dealerColsWithSearch(translation, searchBar = false, callBack = null) {

    var searchInput = [
        {
            title: (
                <Input.Search
                    name="dealer_id"
                    key="dealer_id"
                    id="dealer_id"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_ID], "DEALER ID"))}
                    onKeyUp={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'dealer_id',
            className: '',
            children: []
        },
        {
            title: (
                <Input.Search
                    name="link_code"
                    key="link_code"
                    id="link_code"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_PIN], "DEALER PIN"))}
                    onKeyUp={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'link_code',
            className: '',
            children: []
        },
        {
            title: (
                <Input.Search
                    name="dealer_name"
                    key="dealer_name"
                    id="dealer_name"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_NAME], "DEALER NAME"))}
                    onKeyUp={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'dealer_name',
            className: '',
            children: []
        },
        {
            title: (
                <Input.Search
                    name="dealer_email"
                    key="dealer_email"
                    id="dealer_email"
                    className="search_heading"
                    autoComplete="new-password"
                    placeholder={titleCase(convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL"))}
                    onKeyUp={
                        (e) => {
                            callBack(e)
                        }
                    }

                />
            ),
            dataIndex: 'dealer_email',
            className: '',
            children: []
        },
    ]


    var child = [
        {
            title: convertToLang(translation[DEALER_ID], "DEALER ID"),
            dataIndex: 'dealer_id',
            key: 'dealer_id',
            sorter: (a, b) => a.dealer_id - b.dealer_id,
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_PIN], "DEALER PIN"),
            dataIndex: 'link_code',
            key: 'link_code',
            sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_NAME], "DEALER NAME"),
            dataIndex: 'dealer_name',
            key: 'dealer_name',
            sorter: (a, b) => { return a.dealer_name.props.children.localeCompare(b.dealer_name.props.children) },
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_EMAIL], "DEALER EMAIL"),
            dataIndex: 'dealer_email',
            key: 'dealer_email',
            sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },
            sortDirections: ['ascend', 'descend'],
            className: '',
        },
        {
            title: convertToLang(translation[DEALER_ACTION], "DEALER ACTION"),
            dataIndex: 'action',
            key: 'action',
            className: '',
        },

    ];

    if (searchBar) {
        var result = searchInput.map((item, index) => {
            let flag = true;
            for (var i in child) {
                if (child[i].dataIndex == item.dataIndex) {
                    item.children = [child[i]];
                    flag = false;
                    return item;
                }
            }
            if (flag == true) {
                return item;
            }
        })
        return result;
    } else {
        return child;
    }
}


export function mobileMainMenu(translation) {
    return (
        [
            {
                pageName: APPS,
                value: convertToLang(translation[APPLICATION_PERMISION], "Application Permission")
            },
            {
                pageName: SECURE_SETTING,
                value: convertToLang(translation[SECURE_SETTING_PERMISSION], "Secure Settings Permission")
            },
            {
                pageName: SYSTEM_CONTROLS,
                value: convertToLang(translation[SYSTEM_PERMISSION], "System Permission")
            },

            {
                pageName: MANAGE_PASSWORD,
                value: convertToLang(translation[MANAGE_PASSWORDS], "Manage Password")
            },

        ]
    );
}

export function mobileManagePasswords(translation) {
    return ([

        {
            pageName: GUEST_PASSWORD,
            value: convertToLang(translation[SET_GUEST_PASSWORD], "Set Guest Passwordasd")
        },
        {
            pageName: ENCRYPTED_PASSWORD,
            value: convertToLang(translation[SET_ENCRYPTED_PASSWORD], "Set Encrypted Password")
        },
        {
            pageName: DURESS_PASSWORD,
            value: convertToLang(translation[SET_DURESS_PASSWORD], "Set Duress Password")
        },

        {
            pageName: ADMIN_PASSWORD,
            value: convertToLang(translation[CHANGE_ADMIN_PANEL_CODE], "Change Admin Panel Code")
        },
    ]);
}
// Devie Settings
export function appsColumns(translation) {
    return ([
        {
            title: convertToLang(translation[APK_APP_NAME], "APP NAME"),
            dataIndex: 'app_name',
            key: '1',
            render: text => <a href="javascript:;" style={{ fontSize: 12 }}>{text}</a>,
        }, {
            title: convertToLang(translation[Guest], "Guest"),
            dataIndex: 'guest',
            key: '2',
        }, {
            title: convertToLang(translation[ENCRYPTED], "ENCRYPTED"),
            dataIndex: 'encrypted',
            key: '3',
        }, {
            title: convertToLang(translation[ENABLE], "ENABLE"),
            dataIndex: 'enable',
            key: '4',
        }
    ]);
}

export function extensionColumns(translation) {
    return ([
        {
            title: convertToLang(translation[EXTENSION_NAME], "EXTENSION NAME"),
            dataIndex: 'label',
            key: '1',
            render: text => <a href="javascript:;" style={{ fontSize: 12 }}> {text}</ a>,
        }, {
            title: convertToLang(translation[Guest], "Guest"),
            dataIndex: 'guest',
            key: '2',
        }, {
            title: convertToLang(translation[ENCRYPTED], "ENCRYPTED"),
            dataIndex: 'encrypted',
            key: '3',
        }
    ]);
}

export function controlColumns(translation) {
    return ([
        {
            title: convertToLang(translation[PERMISSION_NAME], "PERMISSION NAME"),
            dataIndex: 'label',
            key: '1',
            render: text => <a href="javascript:;" style={{ fontSize: 12 }}>{text}</a>,
        }, {
            title: convertToLang(translation[DEVICE_STATUS], "STATUS"),
            dataIndex: 'status',
            key: '2',
        }
    ]);
}
export function policyColumns(translation, handleSearch) {
    return ([
        //     title: 'ACTIONS',
        //     dataIndex: 'action',
        //     align: 'center',
        //     className: 'row',
        //     width: 800,
        // },
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[POLICY_ACTION], "ACTION"),
            align: "center",
            dataIndex: 'action',
            key: "action",
        },
        {
            title: (
                <span>
                    {convertToLang(translation[POLICY_INFO], "POLICY INFO")}
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
                    {convertToLang(translation[POLICY_PERMISSIONS], "PERMISSIONS")}
                    <Popover placement="top" content={
                        (<Markup content={convertToLang(translation[POLICY_PERMISSION_HELPING_TEXT],
                            `<span>Add dealers who are allowed <br/> to use this Policy</span>`)} />
                        )
                    }>
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
                    {convertToLang(translation[POLICY_STATUS], "STATUS")}
                    <Popover placement="top" content={
                        (<Markup content={convertToLang(translation[POLICY_STATUS_HELPING_TEXT],
                            `<span>Enable or Disable this policy using <br/> the toggle below.  When disabled,  <br />it cannot be pushed to devices</span>`)} />
                        )
                    }>
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
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[POLICY_NAME], "POLICY NAME")}
                />
            ),
            dataIndex: 'policy_name',
            className: '',
            children: [
                {
                    title: convertToLang(translation[POLICY_NAME], "POLICY NAME"),
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
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[POLICY_COMMAND], "POLICY COMMAND")}
                />
            ),
            dataIndex: 'policy_command',
            className: '',
            children: [
                {
                    title: convertToLang(translation[POLICY_COMMAND], "POLICY COMMAND"),
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
                    onKeyUp={handleSearch}
                    autoComplete="new-password"
                    placeholder={convertToLang(translation[POLICY_NOTE], "POLICY NOTE")}
                />
            ),
            dataIndex: 'policy_note',
            className: '',
            children: [
                {
                    title: convertToLang(translation[POLICY_NOTE], "POLICY NOTE"),
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
            title: convertToLang(translation[POLICY_SIZE], "POLICY SIZE"),
            dataIndex: 'policy_size',
            key: 'policy_size',
        },
        {
            title: convertToLang(translation[POLICY_DEFAULT], "DEFAULT"),
            dataIndex: 'default_policy',
            key: 'default_policy',
        },

    ]
    )
};


export function apkColumns(translation) {
    return ([
        {
            title: "#",
            dataIndex: 'counter',
            align: 'center',
            className: 'row',
            render: (text, record, index) => ++index,
        },
        {
            title: convertToLang(translation[ACTION], "ACTION"),
            dataIndex: 'action',
            key: 'action',
            className: 'row m-0'
        },
        {
            title: (
                <span>
                    {convertToLang(translation[APK_PERMISSION], "PERMISSION")}
                    <Popover placement="top" content={(<Markup content={convertToLang(translation[APK_PERMISSION_HELPING_TEXT],
                        `   <p>Press <a style="font-size: 20px;vertical-align: sub;margin-left: 4px;">
                            <i class="fa fa-caret-right" aria-hidden="true"></i> 
                            </a> to Add, remove or View
                            <br/> the Dealers who have permission
                            <br/>to use this App</p>`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>),
            dataIndex: 'permission',
            key: 'permission',
            className: ''
        },
        {
            title:
                <span>
                    {convertToLang(translation[APK_SHOW_ON_DEVICE], "SHOW ON DEVICE")}
                    <Popover placement="top"
                        content={(<Markup content={convertToLang(translation[SHOW_ON_DEVCIE_HELPING_TEXT],
                            `<p>Shows app in <b>Install Apps</b> <br />menu on Devices`)} />)}>
                        <span className="helping_txt"><Icon type="info-circle" /></span>
                    </Popover>
                </span>,
            // title: 'SHOW ON DEVICE',
            dataIndex: 'apk_status',
            key: 'apk_status',
        },
        {
            title: convertToLang(translation[APK], "APK"),
            dataIndex: 'apk',
            key: 'apk',
        },
        {
            title: convertToLang(translation[APK_APP_NAME], "APP NAME"),
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },
            sortDirections: ['ascend', 'descend'],
            defaultSortOrder: "ascend"
        },
        {
            title: convertToLang(translation[APK_APP_LOGO], "APP LOGO"),
            dataIndex: 'apk_logo',
            key: 'apk_logo',
        },
        {
            title: convertToLang(translation[APK_SIZE], "APP SIZE"),
            dataIndex: 'apk_size',
            key: 'apk_size',
        },
    ])
}
