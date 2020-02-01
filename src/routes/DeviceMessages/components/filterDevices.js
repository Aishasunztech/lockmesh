import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input, Card } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import styles from './devices.css'
import { getAllDealers } from "../../../appRedux/actions/Dealers";
// import { savePermission } from "../../../appRedux/actions/Apk";
import FilterDevicesList from "./filterDevicesList";
import CircularProgress from "components/CircularProgress";
// import BulkSuspendDevices from './bulkSuspendDevices';
// import BulkActivateDevices from './bulkActivateDevices';
// import BulkUnlinkConfirmation from './bulkUnlinkConfirmation';
// import BulkPushAppsConfirmation from './bulkPushAppsConfirmation';
// import BulkPullAppsConfirmation from './bulkPullAppsConfirmation';
// import BulkWipeConfirmation from './bulkWipeConfirmation';
// import BulkPolicyConfirmation from './bulkPushPolicyConfirmation';
import { checkValue, titleCase, convertToLang, getColor } from '../../utils/commonUtils'

import { bulkDevicesColumns, devicesColumns, userDevicesListColumns } from '../../utils/columnsUtils';
import CustomScrollbars from '../../../util/CustomScrollbars';

import {
  DEVICE_PENDING_ACTIVATION,
  DEVICE_PRE_ACTIVATION,
  DEVICE_UNLINKED,
  ADMIN,
  DEVICE_SUSPENDED,
  DEVICE_ACTIVATED,
  DEVICE_TRIAL,
  DEVICE_EXPIRED,
  DEVICE_TRANSFERED
} from '../../../constants/Constants'

import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No, Button_Edit } from '../../../constants/ButtonConstants';
const confirm = Modal.confirm;
const success = Modal.success
const error = Modal.error

var addAllBtn = false;
var removeAllBtn = false;
var addBtn = false;
var updateDealers = true;

var copyDevices = [];
var status = true;

class FilterDevices extends Component {
  constructor(props) {
    super(props);
    let columns = userDevicesListColumns(props.translation, this.handleSearchInModal);
    let selectedDevicesColumns = userDevicesListColumns(props.translation, this.handleSearch);

    this.state = {
      columns: columns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
      selectedDevicesColumns: selectedDevicesColumns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
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
      dealer_id: '',
      selectedDevices: props.selectedDevices ? props.selectedDevices : [],
      copySelectedDevices: [],
      callSelectedDeviceAction: true,
      allBulkDevices: [],
      searchRemoveModal: []
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
    // console.log("nextProps.selectedDevices ", nextProps.selectedDevices, this.props.selectedDevices)

    if (this.props.devices !== nextProps.devices) {
      this.setState({ allBulkDevices: nextProps.devices })
    }
    if (this.props.translation !== nextProps.translation) {
      let columns = userDevicesListColumns(nextProps.translation, this.handleSearchInModal);
      let selectedDevicesColumns = userDevicesListColumns(nextProps.translation, this.handleSearch);

      this.setState({
        columns: columns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
        selectedDevicesColumns: selectedDevicesColumns.filter(e => e.dataIndex != "action" && e.dataIndex != "activation_code"),
      })
    }

    if (nextProps.selectedDealers.length == 0 && nextProps.selectedUsers.length == 0) {

      if (this.state.callSelectedDeviceAction) {
        this.props.setSelectedBulkDevices([]);
        this.state.callSelectedDeviceAction = false;
      } else {
        this.setState({
          selectedDevices: [],
          copySelectedDevices: [],
          searchRemoveModal: []
        })
      }
    } else {
      this.setState({
        selectedDevices: nextProps.selectedDevices,
        copySelectedDevices: nextProps.selectedDevices,
        searchRemoveModal: nextProps.selectedDevices
      })
    }

    // let action = nextProps.handleActionValue;
    // if (this.props.handleActionValue != action) {

    //   // let updateSelectedDevices = this.props.devices.map((item) => {
    //   //   return (
    //   //     this.state.selectedDevices.filter(e => e.device_id == item.device_id)
    //   //   )
    //   // })

    //   // console.log('child this.props.devices ', this.props.devices)


    //   let updateSelectedDevices = this.state.selectedDevices;
    //   let { copySelectedDevices } = this.state;

    //   if (action !== "NOT SELECTED" && updateSelectedDevices.length) {
    //     updateSelectedDevices = this.filterOnActionBase(action, copySelectedDevices);
    //     // console.log("updateSelectedDevices ", updateSelectedDevices)
    //     // this.props.setSelectedBulkDevices(updateSelectedDevices);
    //     this.setState({
    //       selectedDevices: updateSelectedDevices
    //     });
    //   }
    // }
  }

  // filterOnActionBase = (action, copySelectedDevices) => {
  //   let filteredDevices = [];
  //   if (action === "SUSPEND DEVICES") {
  //     copySelectedDevices.forEach((device) => {
  //       if (device.finalStatus !== DEVICE_SUSPENDED) {
  //         filteredDevices.push(device);
  //       }
  //     })
  //   } else if (action === "ACTIVATE DEVICES") {
  //     copySelectedDevices.forEach((device) => {
  //       if (device.finalStatus !== DEVICE_ACTIVATED) {
  //         filteredDevices.push(device);
  //       }
  //     })
  //   }
  //   // else if (action === "UNLINK DEVICES") {
  //   //   if (device.finalStatus !== DEVICE_ACTIVATED) {
  //   //     filteredDevices.push(device);
  //   //   }
  //   //   unlinkBulkDevices
  //   // }
  //   // else if (action === "PUSH APPS") {
  //   //   filteredDevices = copySelectedDevices.filter((device) => device.finalStatus != DEVICE_SUSPENDED)
  //   // } else if (action === "PULL APPS") {
  //   //   filteredDevices = copySelectedDevices.filter((device) => device.finalStatus != DEVICE_SUSPENDED)
  //   // } 
  //   else {
  //     filteredDevices = copySelectedDevices;
  //   }
  //   return filteredDevices;
  // }


  devicesNotFoundErrorMsg = () => {
    let response = false;
    let devices = this.props.devices;
    let dealers = this.props.selectedDealers;
    let users = this.props.selectedUsers;

    if (dealers.length || users.length) {
      if (devices.length) {
        response = true;
      } else {
        error({
          title: `Devices not found against selected dealers/users!`,
        });
      }
    } else {
      error({
        title: `Please select dealers/users to get their devices then perform this action`,
      });
    }

    return response;
  }

  showPermissionedDealersModal = (visible) => {
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      this.setState({
        removeSelectedDealersModal: visible,
        device_ids: [],
        selectedRowKeys: []
      })
    }
  }

  showDealersModal = (visible) => {
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      this.setState({
        showDealersModal: visible,
        device_ids: [],
        selectedRowKeys: []
      })
    }
  }

  addSelectedDealersModal = (visible) => {
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      this.setState({
        addSelectedDealersModal: visible,
        device_ids: [],
        selectedRowKeys: []
      })
    }
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
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      let _this = this;
      confirm({
        title: convertToLang(_this.props.translation["Do you really Want to add all Devices?"], "Do you really Want to add all Devices?"),
        okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
        cancelText: convertToLang(_this.props.translation[Button_No], "No"),
        onOk() {
          _this.saveAllDealers()
        },
        onCancel() {
          // console.log('Cancel');
        },
      });
    }
  }

  saveAllDealers = () => {
    // console.log("add all")
    this.props.setSelectedBulkDevices(this.props.devices);
    this.setState({
      // selectedDevices: this.props.devices,
      copySelectedDevices: this.props.devices,
    })
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
      this.props.setSelectedBulkDevices(selectedDevices);
      this.setState({
        selectedRowKeys: [],
        // selectedDevices: selectedDevices,
        copySelectedDevices: selectedDevices
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

  searchAllFields = (originalData, value, fieldName) => {
    let demoData = [];

    if (value.length) {
      originalData.forEach((data) => {
        if (data['dealer_id'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        // else if (data['link_code'].toString().toUpperCase().includes(value.toUpperCase())) {
        //   demoData.push(data);
        // }
        // else if (data['dealer_name'].toString().toUpperCase().includes(value.toUpperCase())) {
        //   demoData.push(data);

        // }
        // else if (data['dealer_email'].toString().toUpperCase().includes(value.toUpperCase())) {
        //   demoData.push(data);
        // } else {
        //   // demoData.push(data);
        // }
      });

      return demoData;
    } else {
      return originalData;
    }
  }
  // handleSearch = (e, global = false) => {

  //   let fieldName = e.target.name;
  //   let fieldValue = e.target.value;
  //   console.log("fieldName", fieldName);
  //   console.log("fieldValue", fieldValue);
  //   console.log("global", global);
  //   if (global) {
  //     let searchedData = this.searchAllFields(this.state.selectedDevices, fieldValue, fieldName)
  //     // console.log("searchedData", searchedData);
  //     this.setState({
  //       selectedDevices: searchedData,
  //       copySelectedDevices: searchedData
  //     });
  //   } else {

  //     let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
  //     // console.log("searchedData", searchedData);
  //     this.setState({
  //       dealerList: searchedData
  //     });
  //   }
  // }


  handleSearchInModal = (e, global = false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    let searchedData = this.searchField(this.props.devices, fieldName, fieldValue);
    let searcheSelectedDevicedData = this.searchField(this.state.selectedDevices, fieldName, fieldValue);
    // console.log("searchedData", searchedData);
    this.setState({
      allBulkDevices: searchedData,
      searchRemoveModal: searcheSelectedDevicedData
    });
  }


  handleSearch = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    console.log("fieldName", fieldName);
    console.log("fieldValue", fieldValue);

    let demoDevices = [];
    if (status) {
      copyDevices = this.state.selectedDevices;
      status = false;
    }

    if (e.target.value.length) {
      // console.log(this.state.devices);
      copyDevices.forEach((device) => {
        if (e.target.name === 'all') {
          Object.keys(device).map(key => {

            if (device[key] !== undefined && key != 'status' && key != 'account_status') {
              if ((typeof device[key]) === 'string') {
                if (device[key].toUpperCase().includes(e.target.value.toUpperCase())) {
                  if (!demoDevices.includes(device)) {
                    demoDevices.push(device);
                  }
                }
              } else if (device[key] !== null && key != 'status' && key != 'account_status') {
                if (device[key].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                  if (!demoDevices.includes(device)) {
                    demoDevices.push(device);
                  }
                }
              } else {
                // demoDevices.push(device);
              }
            } else {
              // demoDevices.push(device);
            }
          })
        } else {
          if (device[e.target.name] !== undefined) {
            if ((typeof device[e.target.name]) === 'string') {
              // console.log("lsdjfls", device[e.target.name])
              if (device[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                demoDevices.push(device);
              }
            } else if (device[e.target.name] !== null) {
              // console.log("else lsdjfls", device[e.target.name])
              if (device[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                demoDevices.push(device);
              }
            } else {
              // demoDevices.push(device);
            }
          } else {
            demoDevices.push(device);
          }
        }

      });
      // console.log("searched value", demoDevices);
      // this.props.setSelectedBulkDevices(demoDevices);
      this.setState({
        selectedDevices: demoDevices
      })
    } else {
      // this.props.setSelectedBulkDevices(copyDevices);
      this.setState({
        selectedDevices: copyDevices
      })
    }
  }


  rejectPemission = (dealer_id) => {
    let dealers = this.state.permissions;
    var index = dealers.indexOf(dealer_id);
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
    let done = this.devicesNotFoundErrorMsg();
    if (done) {
      let _this = this;
      confirm({
        title: convertToLang(_this.props.translation["Do you really Want to Remove all filtered devices?"], "Do you really Want to Remove all filtered devices?"),
        okText: convertToLang(_this.props.translation[Button_Yes], "Yes"),
        cancelText: convertToLang(_this.props.translation[Button_No], "No"),
        onOk() {
          _this.removeAllDealers();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  }

  removeAllDealers = () => {
    this.props.setSelectedBulkDevices([]);
    this.setState({
      // selectedDevices: [],
      copySelectedDevices: []
    })
  }

  removeSelectedDealersModal = (visible) => {
    this.setState({
      removeSelectedDealersModal: visible
    })
  }

  removeSelectedDealers = () => {
    // console.log(this.state.selectedDevices, "this.state.selectedRowKeys ", this.state.selectedRowKeys);

    let permittedDevices = this.state.selectedDevices;
    let selectedRows = this.state.selectedRowKeys;
    var selectedDevices = permittedDevices.filter(e => selectedRows.includes(e.id));

    this.props.setSelectedBulkDevices(selectedDevices);
    this.setState({
      removeSelectedDealersModal: false,
      device_ids: [],
      // selectedDevices: selectedDevices,
      copySelectedDevices: selectedDevices
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

    // console.log('this.state.selectedDevices filter ', this.state.selectedDevices)
    if (this.state.selectedDevices.length > 0) {
      let selectedIDs = this.state.selectedDevices.map((item) => item.id);
      let fDevices = devices.filter(e => !selectedIDs.includes(e.id));
      return fDevices;
    } else {
      return devices
    }
  }

  applyAction = () => {
    console.log(this.props.selectedDealers, this.props.selectedUsers, 'action apply', this.props.handleActionValue);

    let action = this.props.handleActionValue;
    let devices = this.state.selectedDevices;
    let dealers = this.props.selectedDealers;
    let users = this.props.selectedUsers;

    if (action !== "NOT SELECTED") {
      if (devices.length) {
        if (action === "SUSPEND DEVICES") {
          this.refs.bulk_suspend.handleSuspendDevice(devices, dealers, users);
        }
        else if (action === "ACTIVATE DEVICES") {
          this.refs.bulk_activate.handleActivateDevice(devices, dealers, users);
        }
        else if (action === "PUSH APPS") {
          this.refs.bulk_push_apps.handleBulkPushApps(devices, dealers, users);
        }
        else if (action === "PULL APPS") {
          this.refs.bulk_pull_apps.handleBulkPullApps(devices, dealers, users);
        }
        else if (action === "UNLINK DEVICES") {
          this.refs.bulk_unlink.handleBulkUnlink(devices, dealers, users);
        }
        else if (action === "WIPE DEVICES") {
          this.refs.bulk_wipe.handleBulkWipe(devices, dealers, users);
        }
        else if (action === "PUSH POLICY") {
          if (this.props.selectedPolicy) {
            this.refs.bulk_policy.handleBulkPolicy(devices, dealers, users, this.props.selectedPolicy);
          } else {
            error({
              title: `Sorry, Policy not selected. Please try again`,
            });
          }
        }

      } else {
        error({
          title: `Sorry, You have not selected any device to perform an action`,
        });
      }
    } else {
      error({
        title: `Sorry, You have not selected any action`,
      });
    }
  }


  actionRelatedDevice = (devices) => {
    let action = this.props.handleActionValue;
    let updateSelectedDevices = devices;

    if (action === "SUSPEND DEVICES") {
      updateSelectedDevices = devices.filter((device) => device.finalStatus == DEVICE_TRIAL || device.finalStatus == DEVICE_ACTIVATED)
    } else if (action === "ACTIVATE DEVICES") {
      updateSelectedDevices = devices.filter((device) => device.finalStatus == DEVICE_SUSPENDED)
    }
    else if (action === "PUSH APPS" || action === "PULL APPS" || action === "UNLINK DEVICES" || action === "PUSH POLICY") {
      updateSelectedDevices = devices.filter((device) => device.finalStatus == DEVICE_SUSPENDED || device.finalStatus == DEVICE_TRIAL || device.finalStatus == DEVICE_ACTIVATED || device.finalStatus == DEVICE_EXPIRED)
    }
    else if (action === "WIPE DEVICES") {
      updateSelectedDevices = devices.filter((device) => device.finalStatus == DEVICE_SUSPENDED || device.finalStatus == DEVICE_TRIAL || device.finalStatus == DEVICE_ACTIVATED || device.finalStatus == DEVICE_EXPIRED || device.finalStatus == DEVICE_UNLINKED || device.finalStatus == DEVICE_TRANSFERED)
    }

    this.state.selectedDevices = updateSelectedDevices
    return updateSelectedDevices;
  }



  render() {

    // console.log('selected devices are: ', this.state.selectedDevices);

    // if (this.state.checkChanges) {
    //   if (this.state.dealerList.length == this.props.record.permissions.length) {
    //     addAllBtn = true; // disable 
    //     addBtn = true;
    //   } else {
    //     addAllBtn = false; // visible
    //     addBtn = false;
    //   }
    //   this.state.checkChanges = false;
    //   // this.setState({ checkChanges: false })
    // } else {
    //   if (this.state.dealerList.length == this.props.record.permissions.length) {
    //     addBtn = true; // disable 
    //   } else {
    //     addBtn = false; // visible
    //   }

    // }

    // if (!this.props.devices || !this.props.devices.length){
    //   return <div>Note: *To performe an action please select dealers/users to get their devices.</div>;
    // }

    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '8px 0px 2px' }}>
          <h2 className="mr-24 ml-8">{convertToLang(this.props.translation["Select Devices:"], "Select Devices:")}</h2>
          <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
              onClick={() => { this.showDealersModal(true) }}>{convertToLang(this.props.translation[Button_Add], "Add")}</Button>
          </div>
          {/* <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
              onClick={() => { this.addSelectedDealersModal(true) }}>{convertToLang(this.props.translation[Button_AddExceptSelected], "Add Except Selected")}</Button>
          </div> */}
          <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
              onClick={() => { this.saveAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_AddAll], "Add All")}</Button>
          </div>
          <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
              onClick={() => { this.removeAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_RemoveAll], "Remove All")}</Button>
          </div>
          {/* <div className="mr-16">
            <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
              onClick={() => { this.showPermissionedDealersModal(true) }}>{convertToLang(this.props.translation[Button_RemoveExcept], "Remove Except")}</Button>
          </div> */}
          <div className="gutter-box search_heading mr-16">
            <Input.Search
              placeholder="Search"
              style={{ marginBottom: 0 }}
              onKeyUp={
                (e) => {
                  e.target.name = 'all';
                  this.handleSearch(e, true)
                }
              }
            />
          </div>
        </Row>
        <Row gutter={16}>
          {
            this.props.spinloading ? <CircularProgress /> :
              <Col className="gutter-row" span={24}>
                <Card className='fix_card fix_card_bulk_act'>
                  <hr className="fix_header_border" style={{ top: "56px" }} />
                  <CustomScrollbars className="gx-popover-scroll ">
                    <Table
                      id='scrolltablelist'
                      ref='tablelist'
                      className={"devices "}
                      size="middle"
                      bordered
                      columns={this.state.selectedDevicesColumns}
                      onChange={this.props.onChangeTableSorting}
                      dataSource={this.props.renderList(this.state.selectedDevices)}
                      pagination={false}
                    // scroll={{ y: true }}
                    />
                  </CustomScrollbars>
                </Card>
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
          bodyStyle={{ height: 450, overflow: "overlay" }}
        >
          <FilterDevicesList
            devices={this.props.renderList(this.getUnSelectedDevices(this.state.allBulkDevices))}
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
            devices={this.props.renderList(this.state.searchRemoveModal)}
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
            devices={this.props.renderList(this.getUnSelectedDevices(this.state.allBulkDevices))}
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
    // savePermission: savePermission
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