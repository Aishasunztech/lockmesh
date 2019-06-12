import React, { Component } from 'react'
import { Table, Button } from "antd";

import AppList from "./AppList";
import DeviceSettings from './DeviceSettings';
import styles from './Applist.css';

import {
    SECURE_SETTING,
    POLICY
    // , 
    // SYSTEM_CONTROLS, NOT_AVAILABLE, MANAGE_PASSWORD, MAIN_MENU, APPS,
} from '../../../constants/Constants';


// applyProfile = (app_list) => {
//     this.props.loadDeviceProfile(app_list);
//     this.props.showHistoryModal(false, '');
// }

const renderList = (histories, type, callback) => {
    return histories.map((history) => {
        console.log("list", history.extenssions);

        return ({
            key: history.id,
            history_date: (type === "history") ? history.created_at : (type === POLICY) ? history.policy_name : (type === "profile") ? history.profile_name : null,
            action: (
                <Button
                    size="small"
                    className="mb-0"
                    onClick={() => {
                        if (type === POLICY) {
                            callback(history.id, history.policy_name, history);
                        } else {
                            callback(history.id, history.profile_name, history);
                        }
                        // this.applyProfile(history.app_list)
                    }}
                > Apply
                </Button>
            ),
            app_list: history.app_list,
            controls: history.controls,
            secure_apps: (type === "profile") ? history.permissions : history.secure_apps,
            push_apps: history.push_apps,
            passwords: history.passwords
        })
    })
}

const renderColumn = (type) => {
    // if(type === "history"){

    // } else {

    // }
    return [
        {
            title: (type === "history") ? 'History Date' : `${type} Name`,
            dataIndex: 'history_date',
            key: '1',
            align: "center"
        },
        {
            title: "Action",
            dataIndex: 'action',
            key: '2',
            align: "center"
        }
    ]
}

class TableHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            expandedRowKeys: [],
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
                let list = this.state.expandedRowKeys.filter(item => item != record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    render() {
        // const TableHistory = (props) => {
        console.log("props", this.props.histories);

        return (
            <Table
                style={{ margin: 0, padding: 0 }}
                rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
                size='default'
                bordered
                columns={renderColumn(this.props.type)}
                align='center'
                dataSource={renderList(this.props.histories, this.props.type, this.props.applyHistory)}
                pagination={false}
                onExpand={this.onExpandRow}
                expandedRowRender={record => {
                    // console.log("record", record);

                    let app_list = (record.app_list !== undefined && record.app_list !== null && record.app_list !== '') ? record.app_list : [];
                    let extensions = (record.secure_apps !== undefined && record.secure_apps != null && record.secure_apps != '') ? record.secure_apps : [];

                    let controls = (record.controls !== undefined && record.controls !== null && record.controls !== '') ? (Object.entries(record.controls).length > 0 && record.controls.constructor === Object) ? record.controls : [] : [];
                    let push_apps = record.push_apps == null || record.push_apps == 'null' ? [] : record.push_apps;
                    let passwords = record.passwords;
                    // console.log("app_list: ", app_list);
                    // console.log("extensions: ", extensions);
                    if(this.props.type == 'profile' && record.controls !== null && record.controls !== '' && record.controls !== undefined ){
                        let cntrl = {};
                        cntrl = JSON.parse(record.controls) 
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
                            controls={{ controls }}
                            isPushApps={true}
                            push_apps={push_apps}
                            type={this.props.type}

                        />
                    );
                }}
            />
        )
    }
}

// }

export default TableHistory;