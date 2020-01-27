import React, { Component } from 'react'
import { Table, Button } from "antd";

// import AppList from "./AppList";
import DeviceSettings from './DeviceSettings';
// import styles from './Applist.css';

import {
    SECURE_SETTING,
    POLICY,
    Name,
    ACTION
    // , 
    // SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
} from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';
import { Button_Apply } from '../../../constants/ButtonConstants';
import { HISTORY_DATE } from '../../../constants/DeviceConstants';



class TableHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expandedRowKeys: [],
            setPolicy: ''
        }
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

    renderList = (histories, callback, selectedPolicy) => {
        // console.log("list", histories);
        let historyList = [];

        histories.map((history) => {
            let btnTxt = "Add";
            let btnDisable = false;

            if (selectedPolicy != '') {

                if (history.id == selectedPolicy.id) {
                    btnTxt = "Remove";
                    // btnDisable = true;
                } else {
                    btnDisable = true;
                }
            } else {
                btnDisable = false;
            }

            let historyObj = {
                key: history.id,
                history_date: history.policy_name,
                action: (
                    <Button
                        size="small"
                        className="mb-0"
                        disabled={btnDisable}
                        onClick={() => {
                            callback(history, btnTxt === "Remove" ? true : false);
                        }}
                    >
                        {btnTxt}
                    </Button>
                ),
                app_list: history.app_list,
                controls: history.controls,
                secure_apps: history.secure_apps,
                push_apps: history.push_apps,
                passwords: history.passwords
            }

            if (history.status === 1) {
                historyList.push(historyObj);
            }

        })
        return historyList;
    }

    renderColumn = (type) => {
        // if(type === "history"){

        // } else {

        // }
        return [
            {
                title: (type === "history") ? convertToLang(this.props.translation[HISTORY_DATE], "History Date") : `${type} ${convertToLang(this.props.translation[Name], "Name")}`,
                dataIndex: 'history_date',
                key: '1',
                align: "center"
            },
            {
                title: convertToLang(this.props.translation[ACTION], "ACTION"),
                dataIndex: 'action',
                key: '2',
                align: "center"
            }
        ]
    }

    render() {
        // const TableHistory = (props) => {
        // console.log("props", this.props.histories);

        return (
            <Table
                style={{ margin: 0, padding: 0 }}
                rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
                size='default'
                bordered
                columns={this.renderColumn(this.props.type)}
                align='center'
                dataSource={this.renderList(this.props.histories, this.props.setPolicy, this.props.selectedPolicy)}
                pagination={false}
                onExpand={this.onExpandRow}
                expandedRowRender={record => {
                    console.log("record", record, this.props.type);

                    let app_list = (record.app_list !== undefined && record.app_list !== null && record.app_list !== '') ? record.app_list : [];
                    let extensions = (record.secure_apps !== undefined && record.secure_apps !== null && record.secure_apps !== '') ? record.secure_apps : [];

                    let controls = (record.controls && record.controls.length) ? record.controls : [];

                    console.log("table history controls: ", controls);
                    let push_apps = record.push_apps === null || record.push_apps === 'null' ? [] : record.push_apps;
                    let passwords = record.passwords;
                    // console.log("app_list: ", app_list);
                    // console.log("extensions: ", extensions);
                    if (this.props.type === 'profile' && record.controls !== null && record.controls !== '' && record.controls !== undefined) {
                        console.log("CONTROLS SETTINGS", controls);
                        let cntrl = {};
                        cntrl = JSON.parse(JSON.stringify(record.controls))
                        controls = cntrl
                    }
                    // console.log("push_apps: ", push_apps);

                    return (
                        <DeviceSettings
                            app_list={app_list}
                            extensions={extensions}
                            extensionUniqueName={SECURE_SETTING}
                            // isAdminPwd={this.props.isAdminPwd}
                            // isDuressPwd={this.props.isDuressPwd}
                            // isEncryptedPwd={this.props.isEncryptedPwd}
                            // isGuestPwd={this.props.isGuestPwd}
                            passwords={passwords}
                            show_all_apps={true}
                            controls={controls}
                            isPushApps={true}
                            push_apps={push_apps}
                            type={this.props.type}
                            translation={this.props.translation}
                            auth={{ authUser: this.props.auth }}
                        />
                    );
                }
                }
            />
        )
    }
}

// }

export default TableHistory;