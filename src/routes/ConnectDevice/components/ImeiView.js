import React, { Component, Fragment } from 'react';
import { Modal, message, Button, Table, Input, Select, Row, Col, Form, InputNumber } from 'antd';
import { componentSearch, getFormattedDate } from '../../utils/commonUtils';
import WriteImeiFrom from './WriteImeiForm'
import Moment from 'react-moment'

// import EditForm from './editForm';
let editDevice;
var coppyImeis = [];
var status = true;
export default class ImeiView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            dataVisible: false,
            dataFieldName: '',
            imei1List: [],
            imei2List: [],
        }
    }

    success = () => {
        message.success('Action Done Susscefully ');
    };

    showModal = (device, func) => {

        let dumyImei1List = []
        let dumyImei2List = []
        let imei1List = this.props.imei_list.filter(item => {
            if (dumyImei1List.includes(item.imei1) == false) {
                dumyImei1List.push(item.imei1)
                return item
            }
        })
        let imei2List = this.props.imei_list.filter(item => {
            if (dumyImei2List.includes(item.imei2) == false) {
                dumyImei2List.push(item.imei2)
                return item
            }
        })

        editDevice = func;
        this.setState({
            imei2List: imei2List,
            imei1List: imei1List,
            visible: true,
            func: func,

        });
    }
    // showViewmodal = (dataVisible, dataFieldName = "") => {
    //     // console.log(dataVisible);
    //     this.setState({
    //         dataVisible: dataVisible,
    //         dataFieldName: dataFieldName,
    //     });
    // }

    handleCancel = () => {
        this.refs.form1.resetFields();
        this.refs.form2.resetFields();
        this.setState({ visible: false });
    }
    // handlePagination = (value) => {
    //     this.setState({
    //         pagination: value
    //     })
    // }
    handleSearch = (e, dataName) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        let searchData = (fieldName === 'imei1') ? this.state.imei1List : this.state.imei2List
        let searchedData = this.searchField(searchData, fieldName, fieldValue);
        this.setState({
            imei1List: searchedData
        });
    }
    handleComponentSearch = (e, type) => {
        try {
            let value = e.target.value;
            // console.log(status,'searched value', e.target.value)
            if (value.length) {
                // console.log(status,'searched value', value)
                if (status) {
                    // console.log('status')
                    if (type == "imei1") {
                        coppyImeis = this.state.imei1List;
                    } else {
                        coppyImeis = this.state.imei2List;
                    }

                    status = false;
                }
                // console.log(this.state.users,'coppy de', coppyDevices)
                let foundImeis = componentSearch(coppyImeis, value);
                //  console.log('found devics', foundImeis)
                if (foundImeis.length) {
                    if (type == "imei1") {
                        this.setState({
                            imei1List: foundImeis,
                        })
                    } else {
                        this.setState({
                            imei2List: foundImeis,
                        })
                    }
                } else {
                    if (type == "imei1") {
                        this.setState({
                            imei1List: [],
                        })
                    } else {
                        this.setState({
                            imei2List: [],
                        })
                    }
                }
            } else {
                status = true;

                if (type == "imei1") {
                    this.setState({
                        imei1List: coppyImeis,
                    })
                } else {
                    this.setState({
                        imei2List: coppyImeis,
                    })
                }
            }

        } catch (error) {
            console.log('error')
            // alert("hello");
        }
    }
    renderList = (imei_list, type) => {
        var i = 0;
        let data = (type === 'IMEI 1') ? imei_list.map((device, index) => {
            if (device.orignal_imei1 === device.imei1) {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei1 + ' (ORIGNAL)',
                    changed_time: getFormattedDate(device.created_at)
                }
            } else {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei1,
                    changed_time: getFormattedDate(device.created_at)
                }
            }
        }) : imei_list.map((device, index) => {
            if (device.orignal_imei2 === device.imei2) {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei2 + ' (ORIGNAL)',
                    changed_time: getFormattedDate(device.created_at)
                }
            } else {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei2,
                    changed_time: getFormattedDate(device.created_at)
                }
            }
        })
        return data;
    }
    render() {
        // console.log(this.props.imei_list);
        const { visible, loading } = this.state;
        return (
            <div>
                <Modal
                    width='850px'
                    visible={visible}
                    title={<div> <span style={{ position: "absolute", lineHeight: "36px" }}>MANAGE IMEI</span> <div className="text-center"> <a href='https://dyrk.org/tools/imei/' target='blank'><Button> Generate IMEI number </Button></a></div></div>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >
                    <Row>
                        <Col span={11} className="p-16 imei_col_11" >
                            <WriteImeiFrom
                                ref='form1'
                                buttonText='WRITE IMEI 1'
                                type='IMEI1'
                                writeImei={this.props.writeImei}
                                device={this.props.device}
                            />
                            <Fragment>
                                <div className="row">
                                    <div className="col-md-3">
                                        <h4 className="imei_heading">IMEI 1</h4>
                                    </div>
                                    <div className="col-md-9 pl-0">
                                        <Input.Search
                                            name="imei1"
                                            key="imei1"
                                            id="imei1"
                                            className="search_heading1"
                                            onKeyUp={
                                                (e) => {
                                                    this.handleComponentSearch(e, 'imei1')
                                                }
                                            }
                                            autoComplete="new-password"
                                            placeholder="IMEI 1 NUMBER"
                                        />
                                    </div>
                                </div>

                                <Table
                                    columns={[
                                        {
                                            title: 'No.',
                                            align: "center",
                                            dataIndex: 'tableIndex',
                                            key: "tableIndex",
                                            className: '',
                                            sorter: (a, b) => { return a.tableIndex.localeCompare(b.tableIndex) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                        {
                                            title: "IMEI 1",
                                            align: "center",
                                            dataIndex: 'imei',
                                            key: "imei",
                                            className: '',
                                            sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                        {
                                            title: 'Changed Date',
                                            align: "center",
                                            dataIndex: 'changed_time',
                                            key: "changed_time",
                                            className: '',
                                            sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                                            sortDirections: ['ascend', 'descend'],
                                            defaultSortOrder: 'descend'

                                        },
                                    ]}
                                    bordered
                                    dataSource={this.renderList(this.state.imei1List, 'IMEI 1')}
                                    scroll={{ y: 350 }}
                                    pagination={false}
                                />
                            </Fragment>

                        </Col>
                        <Col span={11} className="p-16 imei_col_11">
                            <WriteImeiFrom
                                ref='form2'
                                buttonText='WRITE IMEI 2'
                                type='IMEI2'
                                writeImei={this.props.writeImei}
                                device={this.props.device}
                            />
                            <Fragment>

                                <div className="row">
                                    <div className="col-md-3">
                                        <h4 className="imei_heading">IMEI 2</h4>
                                    </div>
                                    <div className="col-md-9 pl-0">
                                        <Input.Search
                                            name="imei2"
                                            key="imei2"
                                            id="imei2"
                                            className="search_heading1"
                                            onKeyUp={
                                                (e) => {
                                                    this.handleComponentSearch(e, 'imei2')
                                                }
                                            }
                                            autoComplete="new-password"
                                            placeholder="IMEI 2 NUMBER"
                                        />
                                    </div>
                                </div>

                                <Table
                                    columns={[
                                        {
                                            title: 'No.',
                                            align: "center",
                                            dataIndex: 'tableIndex',
                                            key: "tableIndex",
                                            className: '',
                                            sorter: (a, b) => { return a.tableIndex.localeCompare(b.tableIndex) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                        {
                                            title: 'IMEI 2',
                                            align: "center",
                                            dataIndex: 'imei',
                                            key: "imei",
                                            className: '',
                                            sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                                            sortDirections: ['ascend', 'descend'],

                                        },
                                        {
                                            title: 'Changed Date',
                                            align: "center",
                                            dataIndex: 'changed_time',
                                            key: "changed_time",
                                            className: '',
                                            sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                                            sortDirections: ['ascend', 'descend'],
                                            defaultSortOrder: 'descend'

                                        },
                                    ]}
                                    bordered
                                    dataSource={this.renderList(this.state.imei2List, 'IMEI 2')}
                                    scroll={{ y: 350 }}
                                    pagination={false}
                                />
                            </Fragment>
                        </Col>
                    </Row>
                </Modal>

            </div>
        )
    }
}
