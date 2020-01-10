import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Icon, Modal } from "antd";

import AppFilter from "../../../components/AppFilter";
import { convertToLang } from '../../utils/commonUtils'
import ListMessages from './components/ListMessages';
import SendMessage from './components/SendMessage';
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import {
  updateBulkMsg,
  closeResponseModal
} from "../../../appRedux/actions/BulkDevices";

import { generateSupportSystemMessages } from "../../../appRedux/actions/SupportSystemMessages";

import { supportSystemMessage } from "../../utils/columnsUtils";

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

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        bulkMsgs: this.props.bulkMsgs
      })
    }
  }

  componentDidMount() {
    this.props.getAllDealers();
  }

  handleSendMsgButton = (visible) => {
    this.setState({ visible })
  };

  render() {
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
              handleConfirmDelete={this.handleConfirmDelete}
              columns={this.state.columns}
              getApkList={this.props.getApkList}
              ref="list_msgs"
              translation={this.props.translation}
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
            handleCancelSendMsg={this.handleSendMsgButton}
            getAllDealers={this.props.getAllDealers}
            dealerList={this.props.dealerList}
            translation={this.props.translation}
            generateSupportSystemMessages={this.props.generateSupportSystemMessages}
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

  handleSearch = (e) => {
    let fieldName = e.target.name;
    let fieldValue = e.target.value;

    if (domainStatus) {
      copyDomainList = this.props.bulkMsgs
      domainStatus = false;
    }

    let searchedData = this.searchField(copyDomainList, fieldName, fieldValue);
    this.setState({
      bulkMsgs: searchedData
    });

  };

  searchField = (originalData, fieldName, value) => {
    let demoData = [];
    if (value.length) {
      originalData.forEach((data) => {
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
    updateBulkMsg: updateBulkMsg,
    getAllDealers: getAllDealers,
    closeResponseModal: closeResponseModal,
    generateSupportSystemMessages: generateSupportSystemMessages
  }, dispatch);
}

const mapStateToProps = ({ account, auth, settings, dealers, bulkDevices, SupportSystemMessages }) => {
  return {
    isloading: account.isloading,
    dealerList: dealers.dealers,
    translation: settings.translation,
    supportSystemMessages: SupportSystemMessages.supportSystemMessages,
    response_modal_action: bulkDevices.response_modal_action,
    bulkMsgs: bulkDevices.bulkMsgs
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessages);
