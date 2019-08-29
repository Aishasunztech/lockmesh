import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import styles from './devices.css'
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import { savePermission } from "../../../appRedux/actions/Apk";
import FilterDevicesList from "./filterDevicesList";
import CircularProgress from "components/CircularProgress/index";
import { getStatus, getColor, checkValue, getSortOrder, checkRemainDays, titleCase, convertToLang, checkRemainTermDays } from '../../utils/commonUtils'

import { bulkDevicesColumns, devicesColumns } from '../../utils/columnsUtils';



import {
  DEVICE_PENDING_ACTIVATION,
  DEVICE_PRE_ACTIVATION,
  DEVICE_UNLINKED,
  ADMIN
} from '../../../constants/Constants'

import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No, Button_Edit } from '../../../constants/ButtonConstants';
const confirm = Modal.confirm;


class FilterDevices extends Component {
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
      // redirect: false,
      dealer_id: '',
      // goToPage: '/dealer/dealer',
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
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.translation !== nextProps.translation) {
      this.setState({
        columns: devicesColumns(nextProps.translation, this.handleSearchInModal),
      })
    }

    if (nextProps.selectedDealers.length == 0 && nextProps.selectedUsers.length == 0) {
      this.setState({
        selectedDevices: []
      })
    }

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
    let unSelectedDevices = this.getUnSelectedDevices(this.props.devices);

    if (this.state.selectedRowKeys.length) {
      unSelectedDevices.map((device) => {
        if (!this.state.selectedRowKeys.includes(device.id)) {
          selectedDevices.push(device);
        }
      })

    } else {
      selectedDevices = [...selectedDevices, ...unSelectedDevices];
    }

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
    let selectedDevices = this.state.selectedDevices;
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
      // this.removeSelectedDealersModal(false);
    }
  }


  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, 'selected', selectedRows);
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
    console.log(this.state.selectedDevices, "this.state.selectedRowKeys ", this.state.selectedRowKeys);

    let permittedDevices = this.state.selectedDevices;
    let selectedRows = this.state.selectedRowKeys;
    var remove_ids = permittedDevices.filter(e => selectedRows.includes(e.id));

    this.setState({
      removeSelectedDealersModal: false,
      device_ids: [],
      selectedDevices: remove_ids
    })

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



  getUnSelectedDevices = (devices) => {
    let selectedIDs = this.state.selectedDevices.map((item) => item.id);
    let fDevices = devices.filter(e => !selectedIDs.includes(e.id));
    return fDevices;
  }


  renderList(list) {
    // console.log('list of dec', list)
    return list.map((device, index) => {

      var status = device.finalStatus;

      let color = getColor(status);
      var style = { margin: '0', width: 'auto', textTransform: 'uppercase' }
      var text = convertToLang(this.props.translation[Button_Edit], "EDIT");

      if ((status === DEVICE_PENDING_ACTIVATION) || (status === DEVICE_UNLINKED)) {
        style = { margin: '0 8px 0 0', width: 'auto', display: 'none', textTransform: 'uppercase' }
        text = "ACTIVATE";
      }

      return {
        rowKey: index,
        // key: device.device_id ? `${device.device_id}` : device.usr_device_id,
        key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ` : device.id,
        counter: ++index,

        status: (<span style={color} > {status}</span>),
        lastOnline: checkValue(device.lastOnline),
        flagged: device.flagged,
        type: checkValue(device.type),
        version: checkValue(device.version),
        device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : "N/A",
        // device_id: ((status !== DEVICE_PRE_ACTIVATION)) ? checkValue(device.device_id) : (device.validity) ? (this.props.tabselect == '3') ? `${device.validity}` : "N/A" : "N/A",
        user_id: <a onClick={() => { this.handleUserId(device.user_id) }}>{checkValue(device.user_id)}</a>,
        validity: checkValue(device.validity),
        transfered_to: checkValue((device.finalStatus == "Transfered") ? device.transfered_to : null),
        name: checkValue(device.name),
        activation_code: checkValue(device.activation_code),
        account_email: checkValue(device.account_email),
        pgp_email: checkValue(device.pgp_email),
        chat_id: checkValue(device.chat_id),
        client_id: checkValue(device.client_id),
        dealer_id: checkValue(device.dealer_id),
        dealer_pin: checkValue(device.link_code),
        mac_address: checkValue(device.mac_address),
        sim_id: checkValue(device.sim_id),
        imei_1: checkValue(device.imei),
        sim_1: checkValue(device.simno),
        imei_2: checkValue(device.imei2),
        sim_2: checkValue(device.simno2),
        serial_number: checkValue(device.serial_number),
        model: checkValue(device.model),
        // start_date: device.start_date ? `${new Date(device.start_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
        // expiry_date: device.expiry_date ? `${new Date(device.expiry_date).toJSON().slice(0,10).replace(/-/g,'-')}` : "N/A",
        dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
        online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
        s_dealer: checkValue(device.s_dealer),
        s_dealer_name: checkValue(device.s_dealer_name),
        remainTermDays: device.remainTermDays,
        start_date: checkValue(device.start_date),
        expiry_date: checkValue(device.expiry_date),
      }
    });
  }


  render() {

    console.log('selected devices are: ', this.state.selectedDevices);
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
                <Table
                  id='scrolltablelist'
                  ref='tablelist'
                  className={"devices "}
                  size="middle"
                  bordered
                  columns={this.state.columns}
                  onChange={this.props.onChangeTableSorting}
                  dataSource={this.renderList(this.state.selectedDevices)}
                  pagination={false}
                  scroll={{ x: true }}
                />
              </Col>
          }
        </Row>
        <Modal
          maskClosable={false}
          width='665px'
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
            devices={this.renderList(this.getUnSelectedDevices(this.props.devices))}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Modal>

        {/*  remove except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation["Remove Devices Except Selected from Filtered devices"], "Remove Devices Except Selected from Filtered devices")}
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
            devices={this.renderList(this.state.selectedDevices)}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          />
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
          onCancel={() => {
            this.addSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.renderList(this.getUnSelectedDevices(this.props.devices))}
            columns={this.state.columns}
            user={this.props.user}
            history={this.props.history}
            translation={this.props.translation}
            onChangeTableSorting={this.props.onChangeTableSorting}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.device_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          />
        </Modal>
      </Fragment>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    savePermission: savePermission
  }, dispatch);
}


const mapStateToProps = ({ dealers, settings, devices, auth }, props) => {

  return {
    user: auth.authUser,
    dealerList: dealers.dealers,
    record: props.record,
    spinloading: dealers.spinloading,
    translation: settings.translation
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(FilterDevices);