import React, { Component, Fragment } from 'react';
import { Modal, message, Button, Table, Input, Select, Row, Col, Form, InputNumber } from 'antd';
import { getStatus, componentSearch, titleCase, dealerColsWithSearch } from '../../utils/commonUtils';
import WriteImeiFrom from './WriteImeiForm'

// import EditForm from './editForm';
let editDevice;
var coppyDevices = [];
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
    handleComponentSearch = (value, type) => {
        try {
            if (value.length) {
                if (status) {
                    coppyDevices = (type == 'imei1') ? this.state.imei1List : this.state.imei2List;
                    status = false;
                }
                let foundDevices = componentSearch(coppyDevices, value);
                console.log(value, coppyDevices, value, foundDevices);
                if (foundDevices.length) {
                    if (type == "imei1") {
                        this.setState({
                            imei1List: foundDevices,
                        })
                    } else {
                        this.setState({
                            imei2List: foundDevices,
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
                        imei1List: coppyDevices,
                    })
                } else {
                    this.setState({
                        imei2List: coppyDevices,
                    })
                }
            }
        } catch (error) {
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
                    changed_time: device.created_at
                }
            } else {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei1,
                    changed_time: device.created_at
                }
            }
        }) : imei_list.map((device, index) => {
            if (device.orignal_imei2 === device.imei2) {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei2 + ' (ORIGNAL)',
                    changed_time: device.created_at
                }
            } else {
                i++
                return {
                    key: index,
                    tableIndex: i,
                    imei: device.imei2,
                    changed_time: device.created_at
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
                    width='720px'
                    visible={visible}
                    title={<div className="text-center"><span style={{ float: "left", lineHeight: "36px" }}>MANAGE IMEI</span> <a className="text-right" href='https://dyrk.org/tools/imei/' target='blank'><Button> Generate IMEI number </Button></a></div>}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >
                    <Row>
                        <Col span={12}>
                            <WriteImeiFrom
                                ref='form1'
                                buttonText='WRITE IMEI 1'
                                type='IMEI1'
                                writeImei={this.props.writeImei}
                                device={this.props.device}
                            />
                        </Col>
                        <Col span={12}>
                            <WriteImeiFrom
                                ref='form2'
                                buttonText='WRITE IMEI 2'
                                type='IMEI2'
                                writeImei={this.props.writeImei}
                                device={this.props.device}
                            />
                        </Col>

                    </Row>

                    <Row>
                        <Col span={12}>
                            <Fragment>
                                <div className="row">
                                    <div className="col-md-3">
                                        <h4 className="imei_heading">IMEI 1</h4>
                                    </div>
                                    <div className="col-md-9 pl-0">
                                        <Input.Search
                                            type="number"
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

                                        },
                                    ]}
                                    dataSource={this.renderList(this.state.imei1List, 'IMEI 1')}
                                    scroll={{ y: 350 }}
                                />
                            </Fragment>
                        </Col>
                        <Col span={12}>
                            <Fragment>

                                <div className="row">
                                    <div className="col-md-3">
                                        <h4 className="imei_heading">IMEI 2</h4>
                                    </div>
                                    <div className="col-md-9 pl-0">
                                        <Input.Search
                                            type="number"
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

                                        },
                                    ]}
                                    dataSource={this.renderList(this.state.imei2List, 'IMEI 2')}
                                    scroll={{ y: 350 }}
                                />
                            </Fragment>

                        </Col>
                    </Row>

                </Modal>
            </div >
        )

    }
}