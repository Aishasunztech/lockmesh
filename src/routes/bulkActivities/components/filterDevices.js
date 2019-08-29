import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers } from "../../../appRedux/actions/Dealers";
// import { getBulkDevicesList } from "../../../appRedux/actions/Devices";
import { savePermission } from "../../../appRedux/actions/Apk";
import FilterDevicesListModal from "./filterDevicesListModal";
import { Redirect } from 'react-router-dom';
import CircularProgress from "components/CircularProgress/index";

import { titleCase, convertToLang } from '../../utils/commonUtils';
import { bulkDevicesColumns, devicesColumns } from '../../utils/columnsUtils';
import {
  DEALER_ID,
  DEALER_NAME,
  DEALER_EMAIL,
  DEALER_PIN,
  DEALER_DEVICES,
  DEALER_TOKENS,
  DEALER_ACTION
} from '../../../constants/DealerConstants';
import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No } from '../../../constants/ButtonConstants';
import { Permission_List, PERMISSION_Add_Modal_Title, PERMISSION_Remove_Modal_Title, PERMISSION_Add_Except_Selected_Modal_Title } from '../../../constants/ApkConstants';
import { Alert_Allow_Permission_Delaer, Alert_Remove_Permission_Delaer } from '../../../constants/Constants';
import FilterDevicesList from './filterDevicesList';

const confirm = Modal.confirm;
// export default 
class Permissions extends Component {
  constructor(props) {
    super(props);
    // let columns = bulkDevicesColumns(props.translation, this.handleSearch);
    let columns = devicesColumns(props.translation, this.handleSearch);

    this.state = {
      columns: columns,
      sorterKey: '',
      sortOrder: 'ascend',
      showDealersModal: false,
      device_ids: [],
      dealerList: [],
      dealerListForModal: [],
      permissions: [],
      hideDefaultSelections: false,
      removeSelectedDealersModal: false,
      addSelectedDealersModal: false,
      redirect: false,
      dealer_id: '',
      goToPage: '/dealer/dealer',
      selectedDevices: []
    }


  }


  handleTableChange = (pagination, query, sorter) => {
    // console.log('check sorter func: ', sorter)
    let columns = this.state.columns;
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
      columns: columns
    });
  }

  handleDealerTableChange = (pagination, query, sorter) => {
    // console.log('check sorter func: ', sorter)
    let columns = this.state.columns;
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
      columns: columns
    });
  }


  componentDidMount() {
    this.props.getAllDealers()
    // this.props.getBulkDevicesList()
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList,
      //   permissions: this.props.record.permissions
    })
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.translation !== nextProps.translation) {
      this.setState({
        columns: devicesColumns(nextProps.translation, this.handleSearchInModal),
      })
    }

    // if (this.props.record.apk_id !== nextProps.record.apk_id) {
    //   this.props.getAllDealers();
    //   this.setState({
    //     dealerListForModal: this.props.dealerList,
    //     dealerList: this.props.dealerList,
    //     // permissions: this.props.record.permissions
    //   })
    // } else if (this.props.dealerList.length !== nextProps.dealerList.length) {
    //   this.setState({
    //     dealerListForModal: nextProps.dealerList,
    //     dealerList: nextProps.dealerList,
    //     // permissions: this.props.record.permissions
    //   })
    // }



  }

  showPermissionedDealersModal = (visible) => {
    this.setState({
      removeSelectedDealersModal: visible,
      device_ids: [],
      selectedRowKeys: []
    })
  }

  showDealersModal = (visible) => {
    this.setState({
      showDealersModal: visible,
      device_ids: [],
      selectedRowKeys: []
    })
  }

  addSelectedDealersModal = (visible) => {
    this.setState({
      addSelectedDealersModal: visible,
      device_ids: [],
      selectedRowKeys: []
    })
  }

  addSelectedDealers = () => {
    let selectedDevices = this.state.selectedDevices;
    let selectedRows = this.state.selectedRowKeys;
    var addUnSelected = this.props.devices.filter(e => !selectedRows.includes(e.id));
    selectedDevices = [...selectedDevices, ...addUnSelected];

    this.setState({
      selectedDevices,
      addSelectedDealersModal: false,
      selectedRowKeys: []
    })
  }

  saveAllDealersConfirm = () => {
    let _this = this;
    confirm({
      title: convertToLang(this.props.translation["Do you really Want to add all Devices?"], "Do you really Want to add all Devices?"),
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
    this.setState({ selectedDevices: this.props.devices })
  }

  savePermission = () => {
    // console.log("dealer ids", this.state.device_ids);
    let selectedDevices = [];
    if (this.state.selectedRowKeys.length) {
      this.props.devices.map((device) => {
        if (this.state.selectedRowKeys.includes(device.id)) {
          selectedDevices.push(device);
        }
      })
      this.setState({
        selectedRowKeys: [],
        selectedDevices: selectedDevices
      })

      this.showDealersModal(false);
    }
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, 'selected', selectedRows);
    let device_ids = []
    selectedRows.forEach(row => {
      // console.log("selected row", row)
      device_ids.push(row.id);
    });
    this.setState({
      device_ids: device_ids,
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
    // console.log("fieldName", fieldName);
    // console.log("fieldValue", fieldValue);
    // console.log("global", global);
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
    // this.props.savePermission(this.props.record.apk_id, JSON.stringify([dealer_id]), 'delete');
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList
    })

  }

  removeAllDealersConfirm = () => {
    let _this = this;
    confirm({
      title: convertToLang(this.props.translation["Do you really Want to Remove all filtered devices?"], "Do you really Want to Remove all filtered devices?"),
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

    this.setState({
      selectedDevices: []
    })
  }

  removeSelectedDealersModal = (visible) => {
    this.setState({
      removeSelectedDealersModal: visible
    })
  }

  removeSelectedDealers = () => {
    let permittedDevices = this.state.selectedDevices;
    let selectedRows = this.state.selectedRowKeys;
    var remove_ids = permittedDevices.filter(e => !selectedRows.includes(e.id));

    this.setState({
      removeSelectedDealersModal: false,
      device_ids: [],
      selectedDevices: remove_ids
    })

    // this.props.savePermission(this.props.record.apk_id, JSON.stringify(remove_ids), 'delete');
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
    let is_included
    list.map((dealer) => {
      // console.log('object recrd', dealer);
      if (this.state.permissions) {
        is_included = this.state.permissions.includes(dealer.dealer_id);
      }
      let common = {
        'key': dealer.dealer_id,
        'row_key': dealer.dealer_id,
        'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
        'dealer_name': (
          // <div data-column="DEALER NAME">
          dealer.dealer_name ? <a onClick={() => { this.goToDealer(dealer) }}>{dealer.dealer_name}</a> : 'N/A'
          // </div>
        ),
        'dealer_email': (
          <div data-column="DEALER EMAIL">
            {dealer.dealer_email ? dealer.dealer_email : 'N/A'}
          </div>
        ),
        'link_code': (
          <div data-column="DEALER PIN">
            {dealer.link_code ? dealer.link_code : 'N/A'}
          </div>
        ),
        'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
        'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
        'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
        'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A',
      }

      if (permitted && is_included) {

        data.push(
          {
            ...common,
            'action':
              (
                <div data-column="ACTION">
                  <Button size="small" type="danger" onClick={() => {
                    this.rejectPemission(dealer.dealer_id)
                  }}>
                    {convertToLang(this.props.translation[Button_Remove], "Remove")}
                  </Button>
                </div>
              )
          }
        )
      } else if (permitted === false && is_included === false) {
        data.push({ ...common })
      }
    });
    return (data);
  }
  render() {
    // const { redirect } = this.state;
    // if (redirect && this.state.dealer_id !== '') {
    //   return <Redirect to={{
    //     pathname: this.state.goToPage,
    //     state: { id: this.state.dealer_id }
    //   }} />
    // }
    console.log('selectedDevices ', this.state.selectedDevices);
    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
          <Col className="gutter-row" sm={4} xs={4} md={4}>
            <div className="gutter-box text-left">
              <h2>{convertToLang(this.props.translation["Select Devices:"], "Select Devices:")}</h2>
            </div>
          </Col>
          <Col className="gutter-row" sm={2} xs={2} md={2}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                onClick={() => { this.showDealersModal(true) }}>{convertToLang(this.props.translation[Button_Add], "Add")}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={3} xs={3} md={3}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                onClick={() => { this.addSelectedDealersModal(true) }}>{convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={2} xs={2} md={2}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                onClick={() => { this.saveAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_AddAll], "Add All")}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={2} xs={2} md={2}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
                onClick={() => { this.removeAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_RemoveAll], "Remove All")}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={3} xs={3} md={3}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
                onClick={() => { this.showPermissionedDealersModal(true) }}>{convertToLang(this.props.translation[Button_RemoveExcept], "Remove Except")}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={15} xs={15} md={15}>
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
        <Row gutter={24} style={{ marginBottom: '24px' }}>
          {
            this.props.spinloading ? <CircularProgress /> :
              <Col className="gutter-row" span={24}>
                {/* <Table
                  className="mb-24 expand_rows"
                  columns={this.state.columns}
                  // onChange={this.handleDealerTableChange}
                  dataSource={this.renderDealer(this.props.devices)}
                  pagination={false}
                  translation={this.props.translation}
                /> */}

                <FilterDevicesList
                  devices={this.state.selectedDevices}
                  columns={this.state.columns}
                  user={this.props.user}
                  history={this.props.history}
                  translation={this.props.translation}
                  onChangeTableSorting={this.props.onChangeTableSorting}
                />
              </Col>
          }
        </Row>
        <Modal
          maskClosable={false}
          width='665px'
          // className="permiss_tabl"
          title={convertToLang(this.props.translation["Add Device To Filtered Selected Devices"], "Add Device To Filtered Selected Devices")}
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
        >
          <FilterDevicesList
            devices={this.props.devices}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>

        {/*  remove except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["Remove Devices from Filtered devices"], "Remove Devices from Filtered devices")}
          visible={this.state.removeSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_DeleteExceptSelected], "Delete Except Selected")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onOk={() => {
            this.removeSelectedDealers()
          }}
          onCancel={() => {
            this.removeSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.props.devices}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
          {/* <FilterDevicesListModal
            columns={this.state.columns}
            onChangeTableSorting={this.handleTableChange}
            dealers={[]}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          /> */}
        </Modal>

        {/*  Add Except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["Add Except Selected Devices"], "Add Except Selected Devices")}
          visible={this.state.addSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}
          cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
          onOk={() => {
            this.addSelectedDealers()
          }}
          // okText="Add Except Selected"
          onCancel={() => {
            this.addSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.props.devices}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
          {/* <FilterDevicesListModal
            columns={this.state.columns}
            onChangeTableSorting={this.handleTableChange}
            dealers={[]}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          /> */}
        </Modal>
      </Fragment>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // getBulkDevicesList: getBulkDevicesList,
    getAllDealers: getAllDealers,
    savePermission: savePermission
  }, dispatch);
}


// export default Apk;
const mapStateToProps = ({ dealers, settings, devices, auth }, props) => {
  // console.log("devices.bulkDevices ", devices.bulkDevices);
  // console.log("permission", props.record);
  return {
    user: auth.authUser,
    devices: devices.bulkDevices,
    dealerList: dealers.dealers,
    record: props.record,
    spinloading: dealers.spinloading,
    translation: settings.translation
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Permissions);