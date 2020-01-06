import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Avatar, Table } from "antd";

import AppFilter from "../../../components/AppFilter";
import { checkValue, convertToLang, getColor, componentSearch } from '../../utils/commonUtils'
import { BASE_URL } from '../../../constants/Application';
import ListMessages from './components/ListMessages';
import SendMessage from './components/SendMessage';
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import {
  setSelectedBulkDevices,
  sendBulkMsg,
  updateBulkMsg,
  closeResponseModal,
  getBulkMsgsList,
  deleteBulkMsg
} from "../../../appRedux/actions/BulkDevices";

import { ACTION, Alert_Delete_APK, SEARCH, DEVICE_UNLINKED, DEVICE_PRE_ACTIVATION } from "../../../constants/Constants";
import { Button_Save, Button_Yes, Button_No, Button_Ok } from "../../../constants/ButtonConstants";
import { supportSystemMessage } from "../../utils/columnsUtils";

var status = true;
var coppyApks = [];
var domainStatus = true;
var copyDomainList = [];

class SystemMessages extends Component {

  constructor(props) {
    super(props);
    var columns = supportSystemMessage(props.translation, this.handleSearch);

    this.state = {
      sorterKey: '',
      sortOrder: 'ascend',
      apk_list: [],
      bulkMsgs: [],
      uploadApkModal: false,
      showUploadModal: false,
      showUploadData: {},
      columns: columns,
      visible: false,
      editRecord: null,
      editModal: false
    };
    this.confirm = Modal.confirm;
  }

  handleTableChange = (pagination, query, sorter) => {
    let { columns } = this.state;

    columns.forEach(column => {
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
    });
    this.setState({
      columns: columns
    });
  };

  // delete
  handleConfirmDelete = (appId, appObject) => {
    this.confirm({
      title: convertToLang(this.props.translation[Alert_Delete_APK], "Are you sure, you want to delete the Apk ?"),
      content: <Fragment>
        <Avatar size="small" src={BASE_URL + "users/getFile/" + appObject.logo} />
        {` ${appObject.apk_name} - ${appObject.size}`}
      </Fragment>,
      okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
      cancelText: convertToLang(this.props.translation[Button_No], "No"),
      onOk: () => {
        this.props.deleteApk(appId);
        return new Promise((resolve, reject) => {
          setTimeout((5 > 0.5 ? resolve : reject));
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.bulkMsgs !== nextProps.bulkMsgs) {
      this.setState({
        bulkMsgs: nextProps.bulkMsgs,
      })
    }
  }

  handleComponentSearch = (value) => {
    try {
      if (value.length) {

        if (status) {
          coppyApks = this.state.bulkMsgs;
          status = false;
        }
        let foundApks = componentSearch(coppyApks, value);
        if (foundApks.length) {
          this.setState({
            bulkMsgs: foundApks,
          })
        } else {
          this.setState({
            bulkMsgs: []
          })
        }
      } else {
        status = true;

        this.setState({
          bulkMsgs: coppyApks,
        })
      }
    } catch (error) {
      alert("hello");
    }
  };


  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        bulkMsgs: this.props.bulkMsgs
      })
    }
  }

  handleCancelResponseModal = () => {
    this.props.closeResponseModal();
  };
  componentDidMount() {
    this.props.getBulkMsgsList();
    this.props.getAllDealers();

  }

  handleSendMsgButton = (visible) => {
    this.setState({ visible })
  }

  render() {
    const {
      response_modal_action,
    } = this.props;

    let failedTitle = 'N/A';
    let offlineTitle = 'N/A';
    let onlineTitle = 'N/A';

    if (response_modal_action === "msg") {
      failedTitle = "Failed to Pull apps from these Devices";
      offlineTitle = "(Apps will be Pulled soon from these devices. Action will be performed when devices back online)"
      onlineTitle = "Apps will be Pulled soon from these Devices";
    }
    return (
      <div>
        {
          <div>
            <AppFilter
              translation={this.props.translation}
              isAddButton={true}
              handleSendMsgModal={true}
              handleSendMsgButton={this.handleSendMsgButton}
              pageHeading={convertToLang(this.props.translation[""], "System  Messages")}
              addButtonText={convertToLang(this.props.translation[""], "Send New Message")}
            />

            <ListMessages
              bulkMsgs={this.state.bulkMsgs}
              deleteBulkMsg={this.props.deleteBulkMsg}
              handleConfirmDelete={this.handleConfirmDelete}
              columns={this.state.columns}
              getApkList={this.props.getApkList}
              user={this.props.user}
              ref="list_msgs"
              translation={this.props.translation}
              renderDevicesList={this.renderDevicesList}

              updateBulkMsgAction={this.props.updateBulkMsg}
            />
          </div>
        }
        {/* Send Message modal */}
        <Modal
          title={convertToLang(this.props.translation[""], "Send Message")}
          width={"700px"}
          maskClosable={false}
          visible={this.state.visible}
          onOk={() => this.setState({ visible: false })}
          onCancel={() => this.setState({ visible: false })}
          footer={false}
        >
          <SendMessage
            setSelectedBulkDevices={this.props.setSelectedBulkDevices}
            sendMsgOnDevices={this.props.sendBulkMsg}
            handleCancelSendMsg={this.handleSendMsgButton}
            ref='send_msg_form'
            users_list={this.props.users_list}
            dealerList={this.props.dealerList}
            devices={this.props.devices}
            getBulkDevicesList={this.props.getBulkDevicesList}
            getAllDealers={this.props.getAllDealers}
            getUserList={this.props.getUserList}
            renderList={this.renderDevicesList}
            translation={this.props.translation}
          />

        </Modal>

      </div>
    )
  }

  renderResponseList(list) {
    return list.map(item => {
      return {
        device_id: item
      }
    })
  }

  renderDevicesList(list) {

    return list.map((device, index) => {

      var status = device.finalStatus;
      let color = getColor(status);

      return {
        rowKey: device.id,
        key: status == DEVICE_UNLINKED ? `${device.user_acc_id} ${device.created_at} ` : device.id,
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
        dealer_name: <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a>,
        // dealer_name: (this.props.user.type === ADMIN) ? <a onClick={() => { this.goToDealer(device) }}>{checkValue(device.dealer_name)}</a> : <a >{checkValue(device.dealer_name)}</a>,
        online: device.online === 'online' ? (<span style={{ color: "green" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>) : (<span style={{ color: "red" }}>{device.online.charAt(0).toUpperCase() + device.online.slice(1)}</span>),
        s_dealer: checkValue(device.s_dealer),
        s_dealer_name: checkValue(device.s_dealer_name),
        remainTermDays: device.remainTermDays,
        start_date: checkValue(device.start_date),
        expiry_date: checkValue(device.expiry_date),
      }
    });
  }

  handleSearch = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    if (domainStatus) {
      copyDomainList = this.props.bulkMsgs
      domainStatus = false;
    }

    // console.log("copyDomainList ", copyDomainList)
    let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
    // console.log("searchedData ", searchedData)
    this.setState({
      bulkMsgs: searchedData
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

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setSelectedBulkDevices: setSelectedBulkDevices,
    sendBulkMsg: sendBulkMsg,
    updateBulkMsg: updateBulkMsg,
    getAllDealers: getAllDealers,
    closeResponseModal: closeResponseModal,
    getBulkMsgsList: getBulkMsgsList,
    deleteBulkMsg: deleteBulkMsg
  }, dispatch);
}

const mapStateToProps = ({ account, auth, settings, dealers, bulkDevices }) => {
  return {
    isloading: account.isloading,
    user: auth.authUser,
    dealerList: dealers.dealers,
    devices: bulkDevices.bulkDevices,
    selectedDevices: bulkDevices.selectedDevices,
    translation: settings.translation,
    response_modal_action: bulkDevices.response_modal_action,
    bulkMsgs: bulkDevices.bulkMsgs
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessages);
