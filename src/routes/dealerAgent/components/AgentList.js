import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom';
import { Link } from "react-router-dom";
import { Table, Button, Card, Tabs, Modal, Icon, Tag, Form, Input, Popconfirm, Empty, Switch } from "antd";


import CustomScrollbars from "../../../util/CustomScrollbars";

import { 
    // getStatus, 
    getColor, 
    checkValue, 
    getSortOrder, 
    // checkRemainDays, 
    convertToLang 
} from '../../utils/commonUtils'
import { Button_Yes, Button_No } from '../../../constants/ButtonConstants';



const confirm = Modal.confirm;

export default class DevicesList extends Component {

    constructor(props) {
        super(props);
        
    }

    // renderList
    renderList() {
        
        return this.props.dealerAgents.map((agent, index) => {
            
            return {
                rowKey: index,
                key: agent.id,
                action: "Actions",
                name: checkValue(agent.name),
                staff_id: checkValue(agent.staff_id),
                type: checkValue(agent.type),
                status: (
                    <Switch 
                        defaultChecked={(agent.status ===1)? true: false}
                        size={'small'}
                    />
                ),
                email: checkValue(agent.email),
                created_at: checkValue(agent.created_at),
            }
        });
    }

    componentDidUpdate(prevProps) {

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

                // this.props.deleteUnlinkDevice(action, devices);
                //    this.props.resetTabSelected()
                // this.props.refreshComponent();
                // console.log('this.refs.tablelist.props.rowSelection', this.refs.tablelist.props.rowSelection)
                
                // this.resetSeletedRows();
                // if (this.refs.tablelist.props.rowSelection !== null) {
                //     this.refs.tablelist.props.rowSelection.selectedRowKeys = []
                // }
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


    render() {

        return (
            <div className="dev_table">
               
                <Card className="fix_card devices_fix_card">
                    <hr className="fix_header_border" style={{ top: "56px" }} />
                    <CustomScrollbars className="gx-popover-scroll ">
                        <Table
                            style={{
                                // whiteSpace: 'nowrap'
                                // scrollMargin:"100px"
                                // scrollMarginLeft: "1000px"
                            }}
                            
                            id='scrolltablelist'
                            ref='tablelist'
                            className={"devices "}
                            // rowSelection={rowSelection}
                            // rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
                            
                            size="middle"
                            bordered
                            columns={this.props.columns}
                            onChange={this.props.onChangeTableSorting}
                            dataSource={this.renderList()}
                            pagination={
                                false
                                // pageSize: Number(this.state.pagination),
                                //size: "midddle",
                            }
                            // useFixedHeader={true}
                            // onExpand={this.onExpandRow}
                            // expandIcon={(props) => this.customExpandIcon(props)}
                        />
                        
                    </CustomScrollbars>
                </Card>

            </div >

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