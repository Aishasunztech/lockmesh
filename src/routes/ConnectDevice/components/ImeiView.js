import React, { Component, Fragment } from 'react';
import { Modal, message, Button, Table, Input, Select, Col, Row } from 'antd';

// import EditForm from './editForm';
let editDevice;
export default class ImeiView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            expiry_date: 1,
            dataVisible: false,
            dataFieldName: '',
            pagination: 10,
            device: this.props.device
        }
    }

    success = () => {
        message.success('Action Done Susscefully ');
    };

    showModal = (device, func) => {

        editDevice = func;
        this.setState({
            device: device,
            visible: true,
            func: func,
        });
    }
    showViewmodal = (dataVisible, dataFieldName = "") => {
        // console.log(dataVisible);
        this.setState({
            dataVisible: dataVisible,
            dataFieldName: dataFieldName,
        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }
    handlePagination = (value) => {
        this.setState({
            pagination: value
        })
    }
    handleSearch = (e, dataName) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        let searchedData = this.searchField([this.props.device], fieldName, fieldValue);
        this.setState({
            device: searchedData
        });

    }
    searchField = (originalData, fieldName, value) => {
        let demoData = [];
        if (value.length) {
            originalData.forEach((data) => {
                // console.log(data);
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] != null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                    // else {
                    //     // demoDevices.push(device);
                    // }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }
    renderList = () => {
        var i = 0;
        let dumyImei1List = []
        let dumyImei2List = []

        var imei1List = this.props.imei_list.filter(item => {
            if (dumyImei1List.includes(item.imei1) == false) {
                dumyImei1List.push(item.imei1)
                return item
            }
        })
        var imei2List = this.props.imei_list.filter(item => {
            if (dumyImei2List.includes(item.imei2) == false) {
                dumyImei2List.push(item.imei2)
                return item
            }
        })
        let data = (this.state.dataFieldName === 'IMEI 1') ? imei1List.map((device, index) => {
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
        }) : imei2List.map((device, index) => {
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
                    style={{ width: '50%' }}
                    visible={visible}
                    title="IMEI HISTORY"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={null}
                    className="edit_form"
                >

                    {/* <EditForm
                        device={this.state.device}
                        hideModal={this.handleCancel}
                        editDeviceFunc={this.state.func}
                        handleCancel={this.handleCancel}
                    /> */}
                    {/* <Button key="back" type="button" onClick={this.props.handleCancel}>Cancel</Button> */}
                    <Row gutter={24} type="flex" justify="center" align="top">
                        <Col span={12} className="text-right">
                            <Button onClick={() => { this.showViewmodal(true, 'IMEI 1') }} type="primary">IMEI 1</Button>
                        </Col>
                        <Col span={12} className="text-left">
                            <Button onClick={() => { this.showViewmodal(true, 'IMEI 2') }} type="primary">IMEI 2</Button>
                        </Col>
                    </Row>
                    {/* <Button style={{ float: 'right' }} type="primary" onClick={this.props.handleCancel}>OK</Button> */}
                </Modal>
                <Modal
                    // className="m_d_pop"
                    visible={this.state.dataVisible}
                    title={`${this.state.dataFieldName}`}
                    // onOk={this.handleOk}
                    onCancel={
                        () => {
                            this.showViewmodal(false);
                        }
                    }
                    onOk={
                        () => {
                            this.showViewmodal(false);
                        }
                    }
                >
                    <Fragment>
                        <div className="row">
                            <div className="col-md-6 pr-8">
                                <Select
                                    className="search_heading2"
                                    value={this.state.pagination}
                                    //  defaultValue={this.state.DisplayPages}
                                    style={{ width: '100%' }}
                                    // onSelect={value => this.setState({DisplayPages:value})}
                                    onChange={value => this.handlePagination(value)}
                                >
                                    <Select.Option className="font-12" value="10" >10</Select.Option>
                                    <Select.Option className="font-12" value="20">20</Select.Option>
                                    <Select.Option className="font-12" value="30">30</Select.Option>
                                    <Select.Option className="font-12" value="50">50</Select.Option>
                                    <Select.Option className="font-12" value="100">100</Select.Option>
                                </Select>
                            </div>
                            <div className="col-md-6 pr-8">
                                <Input.Search
                                    name="imei"
                                    key="imei"
                                    id="imei"
                                    className="search_heading1"
                                    onKeyUp={
                                        (e) => {
                                            this.handleSearch(e, 'imei')
                                        }
                                    }
                                    autoComplete="new-password"
                                    placeholder="IMEI NUMBER"
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
                                    title: this.state.dataFieldName,
                                    align: "center",
                                    dataIndex: 'imei',
                                    key: "imei",
                                    className: '',
                                    sorter: (a, b) => { return a.imei.localeCompare(b.imei) },
                                    sortDirections: ['ascend', 'descend'],

                                },
                                {
                                    title: 'Changed Time',
                                    align: "center",
                                    dataIndex: 'changed_time',
                                    key: "changed_time",
                                    className: '',
                                    sorter: (a, b) => { return a.changed_time.localeCompare(b.changed_time) },
                                    sortDirections: ['ascend', 'descend'],

                                },
                            ]}
                            dataSource={this.renderList()}
                        // this.state.sim_ids.map(sim_id => {
                        //     return {
                        //         key: sim_id.id,
                        //         sim_id: sim_id.sim_id,
                        //         start_date: sim_id.start_date,
                        //         expiry_date: sim_id.expiry_date
                        //     }
                        // })


                        // pagination={{ pageSize: Number(this.state.sim_ids_page), size: "middle" }}

                        />
                    </Fragment>
                </Modal>
            </div>
        )

    }
}