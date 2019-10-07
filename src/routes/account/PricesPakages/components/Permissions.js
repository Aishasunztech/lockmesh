import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { bindActionCreators } from "redux";

import {
    getUserDealers
} from "../../../../appRedux/actions/Dealers";

import {
    savePermission
} from "../../../../appRedux/actions/Account";

import DealerList from "../../../apk/components/DealerList";

import CircularProgress from "components/CircularProgress/index";
import { titleCase, convertToLang } from '../../../utils/commonUtils';
import { dealerColsWithSearch } from '../../../utils/columnsUtils';
import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No } from '../../../../constants/ButtonConstants';
import { Permission_List, PERMISSION_Add_Modal_Title, PERMISSION_Remove_Modal_Title, PERMISSION_Add_Except_Selected_Modal_Title } from '../../../../constants/ApkConstants';
import { Alert_Allow_Permission_Delaer, Alert_Remove_Permission_Delaer } from '../../../../constants/Constants';

const confirm = Modal.confirm;
// export default 
class Permissions extends Component {
    constructor(props) {
        super(props);
        this.addDealerCols = dealerColsWithSearch(props.translation, true, this.handleSearch);
        var addDealerColsInModal = dealerColsWithSearch(props.translation, true, this.handleSearchInModal);
        var listDealerCols = dealerColsWithSearch(props.translation);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            listDealerCols: listDealerCols,
            addDealerColsInModal: addDealerColsInModal,
            showDealersModal: false,
            dealer_ids: [],
            dealerList: [],
            dealerListForModal: [],
            permissions: [],
            hideDefaultSelections: false,
            removeSelectedDealersModal: false,
            addSelectedDealersModal: false,
            redirect: false,
            dealer_id: '',
            goToPage: '/dealer/dealer'
        }

    }


    handleTableChange = (pagination, query, sorter) => {
        // console.log('check sorter func: ', sorter)
        let columns = this.state.addDealerColsInModal;
        // console.log('columns are: ', columns);

        columns.forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            addDealerColsInModal: columns
        });
    }

    handleDealerTableChange = (pagination, query, sorter) => {
        // console.log('check sorter func: ', sorter)
        let columns = this.state.listDealerCols;
        // console.log('columns are: ', columns);

        columns.forEach(column => {
            // if (column.children) {
            if (Object.keys(sorter).length > 0) {
                if (column.dataIndex == sorter.field) {
                    if (this.state.sorterKey == sorter.field) {
                        column['sortOrder'] = sorter.order;
                    } else {
                        column['sortOrder'] = "ascend";
                    }
                } else {
                    column['sortOrder'] = "";
                }
                this.setState({ sorterKey: sorter.field });
            } else {
                if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
            }
            // }
        })
        this.setState({
            listDealerCols: columns
        });
    }

    componentDidMount() {
        this.props.getUserDealers()
        console.log(this.props.record.permissions);
        this.setState({
            dealerList: this.props.dealerList,
            dealerListForModal: this.props.dealerList,
            permissions: this.props.record.permissions
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.translation !== nextProps.translation) {
            this.addDealerCols = dealerColsWithSearch(nextProps.translation, true, this.handleSearch);
            this.setState({
                addDealerColsInModal: dealerColsWithSearch(nextProps.translation, true, this.handleSearchInModal),
                listDealerCols: dealerColsWithSearch(nextProps.translation)
            })
        }

        if (this.props.record.id !== nextProps.record.id) {
            this.props.getUserDealers();
            this.setState({
                dealerList: this.props.dealerList,
                dealerListForModal: this.props.dealerList,
                permissions: this.props.record.permissions
            })
        } else if (this.props.dealerList.length !== nextProps.dealerList.length) {
            this.setState({
                dealerList: nextProps.dealerList,
                dealerListForModal: nextProps.dealerList,
                permissions: this.props.record.permissions
            })
        }
    }

    showPermissionedDealersModal = (visible) => {
        this.setState({
            removeSelectedDealersModal: visible,
            dealer_ids: [],
            selectedRowKeys: []
        })
    }

    showDealersModal = (visible) => {

        this.setState({
            showDealersModal: visible,
            dealer_ids: [],
            selectedRowKeys: [],
            dealerListForModal: this.props.dealerList,
        })
    }

    addSelectedDealersModal = (visible) => {
        this.setState({
            addSelectedDealersModal: visible,
            dealer_ids: [],
            selectedRowKeys: []
        })
    }

    addSelectedDealers = () => {
        let permissions = this.state.permissions;
        let selectedRows = this.state.selectedRowKeys;
        // var dList = this.state.dealerList; arfan

        var dList = this.state.dealerListForModal;
        var add_ids = dList.filter(e => !permissions.includes(e.dealer_id));
        var addUnSelected = add_ids.filter(e => !selectedRows.includes(e.dealer_id));
        var addUnSelected_IDs = addUnSelected.map(v => v.dealer_id);
        permissions = [...permissions, ...addUnSelected_IDs];

        this.setState({
            permissions,
            addSelectedDealersModal: false
        })
        this.props.savePermission(this.props.record.id, JSON.stringify(addUnSelected_IDs), 'save');
    }

    saveAllDealersConfirm = () => {
        let _this = this;
        confirm({
            title: convertToLang(this.props.translation[Alert_Allow_Permission_Delaer], "Do you really Want to allow Permission for all Dealers?"),
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk() {
                _this.saveAllDealers()
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }

    saveAllDealers = () => {
        let dealer_ids = []
        this.props.dealerList.map((dealer) => {
            dealer_ids.push(dealer.dealer_id);
        });
        this.setState({ permissions: dealer_ids })

        this.props.savePermission(this.props.record.id, JSON.stringify(dealer_ids), 'save');

        // this.setState({
        //   dealer_ids: dealer_ids
        // });
    }
    savePermission = () => {
        // console.log(this.props.dealerList, "dealer ids", this.state.dealer_ids);

        if (this.state.dealer_ids.length) {
            this.props.dealerList.map((dealer) => {
                if (this.state.dealer_ids.includes(dealer.dealer_id)) {
                    this.state.permissions.push(dealer.dealer_id);
                }
                else {
                    if (this.state.permissions.includes(dealer.dealer_id)) {
                        this.state.dealer_ids.push(dealer.dealer_id);

                    }
                }
                this.setState({
                    dealer_ids: [],
                    permissions: this.state.permissions
                })
            })

            // console.log(this.state.selectedRowKeys);
            this.props.savePermission(this.props.record.id, JSON.stringify(this.state.selectedRowKeys), 'save');

            this.showDealersModal(false);

            // this.props.getUserDealers()

        }
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        // console.log(selectedRowKeys, 'selected', selectedRows);
        let dealer_ids = []
        selectedRows.forEach(row => {
            // console.log("selected row", row)
            dealer_ids.push(row.dealer_id);
        });
        this.setState({
            dealer_ids: dealer_ids,
            selectedRowKeys: selectedRowKeys
        });
        // this.setState({ selectedRowKeys });
    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];

        if (value.length) {
            originalData.forEach((data) => {
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] !== null) {
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

    searchAllFields = (originalData, value) => {
        let demoData = [];

        if (value.length) {
            originalData.forEach((data) => {
                if (
                    data['dealer_id'].toString().toUpperCase().includes(value.toUpperCase())
                ) {
                    demoData.push(data);
                }
                else if (data['link_code'].toString().toUpperCase().includes(value.toUpperCase())) {
                    demoData.push(data);
                }
                else if (data['dealer_name'].toString().toUpperCase().includes(value.toUpperCase())) {
                    demoData.push(data);

                }
                else if (data['dealer_email'].toString().toUpperCase().includes(value.toUpperCase())) {
                    demoData.push(data);
                } else {
                    // demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }
    handleSearch = (e, global = false) => {
        let fieldName = e.target.name;
        let fieldValue = e.target.value;

        if (global) {
            let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
            // console.log("searchedData", searchedData);
            this.setState({
                dealerList: searchedData
            });
        } else {

            let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
            // console.log("searchedData", searchedData);
            this.setState({
                dealerList: searchedData
            });
        }

    }

    handleSearchInModal = (e, global = false) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        // console.log("fieldName", fieldName);
        // console.log("fieldValue", fieldValue);
        // console.log("global", global);
        if (global) {
            let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
            // console.log("searchedData", searchedData);
            this.setState({
                dealerListForModal: searchedData
            });
        } else {

            let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
            // console.log("searchedData", searchedData);
            this.setState({
                dealerListForModal: searchedData
            });
        }
    }


    rejectPemission = (dealer_id) => {
        let dealers = this.state.permissions;
        // console.log("permissions",dealers);
        var index = dealers.indexOf(dealer_id);
        // console.log("array index", index);
        if (index > -1) {
            dealers.splice(index, 1);
        }
        // console.log("permissions",dealers);
        this.props.savePermission(this.props.record.id, JSON.stringify([dealer_id]), 'delete');
        this.setState({
            dealerList: this.props.dealerList,
            dealerListForModal: this.props.dealerList
        })

    }


    removeAllDealersConfirm = () => {
        let _this = this;
        confirm({
            title: convertToLang(this.props.translation[Alert_Remove_Permission_Delaer], "Do you really Want to Remove Permission for all Dealers?"),
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk() {
                _this.removeAllDealers();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    removeAllDealers = () => {
        // let permittedDealers = this.state.permissions;
        console.log("permitted dealers", this.statedealerList);
        let dealersID = [];
        if (this.state.dealerList && this.state.dealerList.length) {
            for (let item of this.state.dealerList) {
                dealersID.push(item.dealer_id);
            }
        }

        this.setState({
            permissions: []
        })
        this.props.savePermission(this.props.record.id, JSON.stringify(dealersID), 'delete');
        // this.state.dealerList.map((dealer)=>{
        //   console.log(dealer);
        // })
    }

    removeSelectedDealersModal = (visible) => {
        this.setState({
            removeSelectedDealersModal: visible

        })
    }

    handleUserId = (user_id) => {
        if (user_id !== 'null' && user_id !== null) {
            this.setState({
                redirect: true,
                user_id: user_id
            })
        }
    }

    removeSelectedDealers = () => {
        let permittedDealers = this.state.permissions;
        let selectedRows = this.state.selectedRowKeys;
        var remove_ids = permittedDealers.filter(e => !selectedRows.includes(e));

        this.setState({
            removeSelectedDealersModal: false,
            dealer_ids: [],
            permissions: selectedRows
        })

        this.props.savePermission(this.props.record.id, JSON.stringify(remove_ids), 'delete');
    }

    goToDealer = (dealer) => {
        if (dealer.dealer_id !== 'null' && dealer.dealer_id !== null) {
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

    renderDealer(list, permitted = false) {
        let data = [];
        // console.log(list);
        list.map((dealer) => {
            // console.log('object recrd', dealer);
            let is_included = this.state.permissions.includes(dealer.dealer_id);
            let common = {
                key: dealer.dealer_id,
                row_key: dealer.dealer_id,
                dealer_id: dealer.dealer_id ? dealer.dealer_id : 'N/A',
                dealer_name: dealer.dealer_name ? <a onClick={() => { this.goToDealer(dealer) }}>{dealer.dealer_name}</a> : 'N/A',
                dealer_email: dealer.dealer_email ? dealer.dealer_email : 'N/A',
                link_code: dealer.link_code ? dealer.link_code : 'N/A',
                parent_dealer: dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
                parent_dealer_id: dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
                connected_devices: dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
                dealer_token: dealer.dealer_token ? dealer.dealer_token : 'N/A',
            }

            if (permitted && is_included) {

                data.push({
                    ...common,
                    'action': (<Button size="small" type="danger" onClick={() => {
                        this.rejectPemission(dealer.dealer_id)
                    }}>
                        {convertToLang(this.props.translation[Button_Remove], "Remove")}
                    </Button>)
                })
            } else if (permitted === false && is_included === false) {
                data.push({ ...common })
            }
        });
        return (data);
    }
    render() {


        console.log(this.state.dealerList)
        const { redirect } = this.state;
        if (redirect && this.state.dealer_id !== '') {
            return <Redirect to={{
                pathname: this.state.goToPage,
                state: { id: this.state.dealer_id }
            }} />
        }


        return (
            <Fragment>
                <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
                    <Col className="gutter-row" sm={10} xs={15} md={5}>
                        <div className="gutter-box text-left">
                            <h2>{convertToLang(this.props.translation[Permission_List], "Permission List")}</h2>
                        </div>
                    </Col>
                    <Col className="gutter-row" sm={4} xs={9} md={3}>
                        <div className="gutter-box">
                            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                                onClick={() => { this.showDealersModal(true) }}>{convertToLang(this.props.translation[Button_Add], "Add")}</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" sm={6} xs={12} md={5}>
                        <div className="gutter-box">
                            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                                onClick={() => { this.addSelectedDealersModal(true) }}>{convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" sm={4} xs={12} md={3}>
                        <div className="gutter-box">
                            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                                onClick={() => { this.saveAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_AddAll], "Add All")}</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" sm={5} xs={12} md={3}>
                        <div className="gutter-box">
                            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
                                onClick={() => { this.removeAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_RemoveAll], "Remove All")}</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" sm={7} xs={12} md={4}>
                        <div className="gutter-box">
                            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
                                onClick={() => { this.showPermissionedDealersModal(true) }}>{convertToLang(this.props.translation[Button_RemoveExcept], "Remove Except")}</Button>
                        </div>
                    </Col>
                    <Col className="gutter-row" sm={12} xs={24} md={8}>
                        <div className="gutter-box search_heading">
                            <Input.Search
                                placeholder="Search"
                                style={{ marginBottom: 0 }}
                                onKeyUp={
                                    (e) => {
                                        this.handleSearch(e, true)
                                    }
                                }
                            />
                        </div>
                    </Col>

                </Row>
                <Row gutter={16} gutter={24} style={{ marginBottom: '24px' }}>
                    {
                        this.props.spinloading ? <CircularProgress /> :
                            <Col className="gutter-row" span={20}>
                                <Table
                                    columns={this.state.listDealerCols}
                                    onChange={this.handleDealerTableChange}
                                    dataSource={this.renderDealer(this.state.dealerList, true)}
                                    pagination={false}
                                />
                            </Col>
                    }
                </Row>
                <Modal
                    width='665px'
                    maskClosable={false}
                    className="permiss_tabl"
                    title={convertToLang(this.props.translation[PERMISSION_Add_Modal_Title], "Add Dealers to permissions list for this App")}
                    visible={this.state.showDealersModal}
                    onOk={() => {
                        this.savePermission()
                    }}
                    okText={convertToLang(this.props.translation[Button_Save], "Save")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}

                    onCancel={() => {
                        this.showDealersModal(false)
                    }}
                    bodyStyle={{ height: 500, overflow: "overlay" }}
                    destroyOnClose={true}
                >
                    <DealerList
                        columns={this.state.addDealerColsInModal}
                        onChangeTableSorting={this.handleTableChange}
                        dealers={this.renderDealer(this.state.dealerListForModal)}
                        onSelectChange={this.onSelectChange}
                        hideDefaultSelections={this.state.hideDefaultSelections}
                        selectedRows={this.state.dealer_ids}
                        selectedRowKeys={this.state.selectedRowKeys}
                    // selectedDealers={[]}
                    />
                </Modal>
                {/*  remove except selected */}
                <Modal
                    width='665px'
                    maskClosable={false}
                    className="permiss_tabl"
                    title={convertToLang(this.props.translation[PERMISSION_Remove_Modal_Title], "Remove Dealers from permissions list for this App")}
                    visible={this.state.removeSelectedDealersModal}
                    onOk={() => {
                        this.removeSelectedDealers()
                    }}
                    okText={convertToLang(this.props.translation[Button_DeleteExceptSelected], "Delete Except Selected")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}

                    onCancel={() => {
                        this.removeSelectedDealersModal(false)

                    }}
                >
                    <DealerList
                        columns={this.state.addDealerColsInModal}
                        onChangeTableSorting={this.handleTableChange}
                        dealers={this.renderDealer(this.state.dealerListForModal, true)}
                        onSelectChange={this.onSelectChange}
                        hideDefaultSelections={this.state.hideDefaultSelections}
                        selectedRows={this.state.dealer_ids}
                        selectedRowKeys={this.state.selectedRowKeys}
                    // selectedDealers={[]}
                    />
                </Modal>

                {/*  Add Except selected */}
                <Modal
                    width='665px'
                    maskClosable={false}
                    className="permiss_tabl"
                    title={convertToLang(this.props.translation[PERMISSION_Add_Modal_Title], "Add Dealers to permissions list for this App")}
                    visible={this.state.addSelectedDealersModal}
                    onOk={() => {
                        this.addSelectedDealers()
                    }}
                    okText={convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}
                    cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}

                    onCancel={() => {
                        this.addSelectedDealersModal(false)
                    }}
                >
                    <DealerList
                        columns={this.state.addDealerColsInModal}
                        onChangeTableSorting={this.handleTableChange}
                        dealers={this.renderDealer(this.state.dealerListForModal)}
                        onSelectChange={this.onSelectChange}
                        hideDefaultSelections={this.state.hideDefaultSelections}
                        selectedRows={this.state.dealer_ids}
                        selectedRowKeys={this.state.selectedRowKeys}
                    // selectedDealers={[]}
                    />
                </Modal>
            </Fragment >
        )
    }
}

// export default Apk;
const mapStateToProps = ({ dealers, settings }, props) => {
    // console.log("dealer", dealers);
    // console.log("permission", props.record);
    return {
        dealerList: dealers.dealers,
        record: props.record,
        spinloading: dealers.spinloading,
        translation: settings.translation
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUserDealers: getUserDealers,
        savePermission: savePermission
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);