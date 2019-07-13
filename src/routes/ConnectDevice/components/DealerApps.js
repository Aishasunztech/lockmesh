import React, { Fragment } from 'react'
import { Avatar, Table, Switch } from "antd";
import { BASE_URL } from '../../../constants/Application';
import { APK } from '../../../constants/ApkConstants';
import { POLICY_APP_NAME } from '../../../constants/PolicyConstants';
import { Guest, ENCRYPTED, ENABLE } from '../../../constants/TabConstants';
import { convertToLang } from '../../utils/commonUtils';

const DealerApps = (props) => {
    let columns = [
        {
            title: convertToLang(this.props.translation[APK], "APK"),
            dataIndex: 'apk',
            key: 'apk',
        },
        {
            title: convertToLang(this.props.translation[POLICY_APP_NAME], "APP NAME"),
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },

            sortDirections: ['ascend', 'descend'],
            // sortOrder:"ascend",
            defaultSortOrder: "ascend"
        },
        {
            title: convertToLang(this.props.translation[Guest], "GUEST"),
            dataIndex: 'guest',
            key: 'guest'
        },
        {
            title: convertToLang(this.props.translation[ENCRYPTED], "ENCRYPTED"),
            dataIndex: 'encrypted',
            key: 'encrypted'
        },
        {
            title: convertToLang(this.props.translation[ENABLE], "ENABLE"),
            dataIndex: 'enable',
            key: 'enable'
        },
    ];

    const renderApps = (apk_list, isSwitchable, selectedAppKeys) => {
        // console.log(props.selectedAppKeys);
        return apk_list.map((app) => {

            let isAvailable = selectedAppKeys !== undefined ? (selectedAppKeys.length) ? selectedAppKeys.find(el => (el === app.apk_id) ? true : false) : false : false;
            // let isAvailable = false;
            // console.log('isAvailable', isAvailable);
            return {
                key: app.apk_id,
                apk_id: app.apk_id,
                package_name: app.package_name,
                version_name: app.version_name,
                apk_status: (app.apk_status === "On") ? true : false,
                apk: app.apk ? app.apk : 'N/A',
                apk_name: app.apk_name ? app.apk_name : 'N/A',
                apk_logo: (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
                guest: ((isSwitchable || props.disabledSwitch) ?
                    <Switch
                        defaultChecked={app.guest === true || app.guest === 1 ? true : false}
                        disabled={!isAvailable}
                        size={"small"}
                        onClick={(e) => {
                            props.handleChecked(e, "guest", app.apk_id);
                        }}
                    /> : (app.guest === true) ? 'On' : 'Off'),
                encrypted: ((isSwitchable || props.disabledSwitch) ?
                    <Switch
                        defaultChecked={app.encrypted === true || app.encrypted === 1 ? true : false}

                        disabled={!isAvailable}
                        size={"small"}
                        onClick={(e) => {
                            props.handleChecked(e, "encrypted", app.apk_id);
                        }}
                    /> : (app.encrypted === true) ? 'On' : 'Off'),
                enable: ((isSwitchable || props.disabledSwitch) ?
                    <Switch
                        defaultChecked={app.enable === true || app.enable === 1 ? true : false}
                        disabled={!isAvailable}
                        size={"small"}
                        onClick={(e) => {
                            props.handleChecked(e, "enable", app.apk_id);
                        }}
                    /> : (app.enable === true) ? 'On' : 'Off'),
            }
        });
    }
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRowKeys: props.selectedAppKeys,

    };
    if (props.type === 'pull') {
        columns = [

            {
                title: convertToLang(this.props.translation[APK], "APK"),
                dataIndex: 'apk',
                key: 'apk',
            },
            {
                title: convertToLang(this.props.translation[POLICY_APP_NAME], "APP NAME"),
                dataIndex: 'apk_name',
                width: "100",
                key: 'apk_name',
                sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },

                sortDirections: ['ascend', 'descend'],
                // sortOrder:"ascend",
                defaultSortOrder: "ascend"
            },
        ];
    }

    // console.log('apk list is updated', props.apk_list)
    return (
        <Fragment>
            <Table
                className="push_apps"
                pagination={false}
                scroll={{ x: 500 }}
                bordered
                rowSelection={(props.isSwitchable) ? rowSelection : null}
                columns={columns}
                dataSource={renderApps(props.apk_list, props.isSwitchable, props.selectedAppKeys)}
            />
        </Fragment>
    )

}

export default DealerApps;
