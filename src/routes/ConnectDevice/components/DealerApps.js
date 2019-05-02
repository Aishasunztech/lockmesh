import React, { Component, Fragment } from 'react'
import { Card, Row, Col, Button, message, Icon, Modal, Input, Avatar, Table } from "antd";
import { BASE_URL } from '../../../constants/Application';

const DealerApps = (props)=>{
    const columns = [
       
        {
            title: 'APK',
            dataIndex: 'apk',
            key: 'apk',
        },
        {
            title: 'APP NAME',
            dataIndex: 'apk_name',
            width: "100",
            key: 'apk_name',
            // sorter: (a, b, direction) => {
            //     // alert(self);
            //     self.sortOrder(direction);
            // },
            sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },
            // renderColumnSorter:(<h1>hello</h1>),
            // sorter: true,
            sortDirections: ['ascend', 'descend'],
            // sortOrder:"ascend",
            defaultSortOrder: "ascend"
        },
        {
            title: 'APP LOGO',
            dataIndex: 'apk_logo',
            key: 'apk_logo',
        },
    ];
    const renderApps=(apk_list)=>{
        return apk_list.map((app) => {
            // console.log("package name", app);
            return {
                key: app.apk_id,
                apk_id: app.apk_id,
                package_name: app.package_name,
                version: app.version,
                apk_status: (app.apk_status === "On") ? true : false,
                apk: app.apk ? app.apk : 'N/A',
                apk_name: app.apk_name ? app.apk_name : 'N/A',
                apk_logo: (<Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} />),
            }
        });
    }
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex: 1
    };
    return (
        <Fragment>
            <Table
                bordered
                rowSelection={rowSelection}
                columns={columns}
                dataSource={renderApps(props.apk_list)}        
            />
        </Fragment>
    )
    
}

export default DealerApps;
