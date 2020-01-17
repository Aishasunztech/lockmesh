import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {Button, Card, Icon, Modal, Tabs} from "antd";
import AppFilter from "../../../components/AppFilter";
import {checkValue, convertToLang, getDateFromTimestamp} from '../../utils/commonUtils'
import ListSentMessages from './components/ListSentMessages';
import ListReceivedMessages from './components/ListReceivedMessages';
import SendMessage from './components/SendMessage';
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import {
  closeResponseModal
} from "../../../appRedux/actions/BulkDevices";

import { updateSupportSystemMessageNotification,
  generateSupportSystemMessages,
  getSupportSystemMessages,
  getReceivedSupportSystemMessages } from "../../../appRedux/actions/SupportSystemMessages";
import { supportSystemMessage, receivedSupportSystemMessagesColumns } from "../../utils/columnsUtils";
import {ADMIN, SDEALER} from "../../../constants/Constants";

const TabPane           = Tabs.TabPane;
var copySystemMessages  = [];

class SystemMessages extends Component {

  constructor(props) {
    super(props);
    var columns                           = supportSystemMessage(props.translation, this.handleSentMessagesSearch);
    var receivedSupportSystemMessagesCols = receivedSupportSystemMessagesColumns(props.translation, this.handleReceivedMessageSearch);

    this.state = {
      sorterKey: '',
      sortOrder: 'ascend',
      columns: columns,
      receivedSupportSystemMessagesCols: receivedSupportSystemMessagesCols,
      visible: false,
      sentSupportSystemMessages: [],
      copySentSupportSystemMessages: [],
      receivedSupportSystemMessages: [],
      copyReceivedSupportSystemMessages: [],
      messageTab: (this.props.user.type === SDEALER) ? "2": "1",
      editRecord: null,
      editModal: false
    };
    this.confirm = Modal.confirm;
  }

  handleChangeCardTabs = (value) => {

    switch (value) {
      case '1':
        this.setState({
          messageTab: '1'
        });
        break;

      case '2':
        this.setState({
          messageTab: '2'
        });

        break;
      default:
        this.setState({
          messageTab: '1'
        });
        break;
    }
  };

  componentDidMount() {
    this.props.getAllDealers();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let receivedSupportSystemMessagesData = [];
    let sentSupportSystemMessagesData = [];

    if (this.props.receivedSupportSystemMessages.length > 0 && prevProps.receivedSupportSystemMessages !== this.props.receivedSupportSystemMessages){
      let data;
      this.props.receivedSupportSystemMessages.map((item) => {
        data = {
          id: item.system_message._id,
          key: item.system_message._id,
          rowKey: item.system_message._id,
          sender: item.system_message.sender_user_type,
          subject: checkValue(item.system_message.subject),
          message: checkValue(item.system_message.message),
          createdAt: item.system_message.createdAt ? getDateFromTimestamp(item.system_message.createdAt) : "N/A",
        };
        receivedSupportSystemMessagesData.push(data)
      });
      this.setState({
        receivedSupportSystemMessages: receivedSupportSystemMessagesData,
        copyReceivedSupportSystemMessages: receivedSupportSystemMessagesData,
      });
    }

    if (this.props.sentSupportSystemMessages.length > 0 && prevProps.sentSupportSystemMessages !== this.props.sentSupportSystemMessages){

      let data;
      this.props.sentSupportSystemMessages.map((item) => {

        data = {
          id: item._id,
          key: item._id,
          rowKey: item._id,
          receiver_ids: item.receiver_ids,
          subject: checkValue(item.subject),
          message: checkValue(item.message),
          createdAt: item.createdAt ? getDateFromTimestamp(item.createdAt) : "N/A",
        };
        sentSupportSystemMessagesData.push(data)
      });
      this.setState({
        sentSupportSystemMessages: sentSupportSystemMessagesData,
        copySentSupportSystemMessages: sentSupportSystemMessagesData,
      });
    }
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
              isAddButton={this.props.user.type !== SDEALER}
              handleSendMsgModal={true}
              handleSendMsgButton={this.handleSendMsgButton}
              pageHeading={convertToLang(this.props.translation[""], "System Messages")}
              addButtonText={convertToLang(this.props.translation[""], "Send New Message")}
            />

            <Card>
              <Tabs defaultActiveKey={ (this.props.user.type === SDEALER) ? "2": "1" } activeKey={this.state.messageTab} type="card" onChange={this.handleChangeCardTabs}>

                {(this.props.user.type !== SDEALER) ?
                  <TabPane tab="SENT SYSTEM MESSAGES" key="1" forceRender={true}>
                    <ListSentMessages
                      supportSystemMessages={this.state.sentSupportSystemMessages}
                      columns={this.state.columns}
                      dealerList={this.props.dealerList}
                      getSupportSystemMessages={this.props.getSupportSystemMessages}
                      translation={this.props.translation}
                    />
                  </TabPane> : ''}

                {(this.props.user.type !== ADMIN) ?
                  <TabPane tab="RECEIVED SYSTEM MESSAGES" key="2" forceRender={true}>
                    <ListReceivedMessages
                      getReceivedSupportSystemMessages={this.props.getReceivedSupportSystemMessages}
                      receivedSupportSystemMessages={this.state.receivedSupportSystemMessages}
                      columns={this.state.receivedSupportSystemMessagesCols}
                      dealerList={this.props.dealerList}
                      translation={this.props.translation}
                      user={this.props.user}
                      updateSupportSystemMessageNotification={this.props.updateSupportSystemMessageNotification}
                    />
                  </TabPane>
                  : ''}

              </Tabs>
            </Card>


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


  handleReceivedMessageSearch = (e) => {
    let fieldName       = e.target.name;
    let fieldValue      = e.target.value;
    let searchedData = this.searchField(this.state.copyReceivedSupportSystemMessages, fieldName, fieldValue);
    this.setState({
      receivedSupportSystemMessages: searchedData
    });
  };

  handleSentMessagesSearch = (e) => {
    let fieldName       = e.target.name;
    let fieldValue      = e.target.value;
    let searchedData = this.searchField(this.state.copySentSupportSystemMessages, fieldName, fieldValue);
    this.setState({
      sentSupportSystemMessages: searchedData
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
    getAllDealers: getAllDealers,
    closeResponseModal: closeResponseModal,
    generateSupportSystemMessages: generateSupportSystemMessages,
    getSupportSystemMessages: getSupportSystemMessages,
    getReceivedSupportSystemMessages: getReceivedSupportSystemMessages,
    updateSupportSystemMessageNotification: updateSupportSystemMessageNotification
  }, dispatch);
}

const mapStateToProps = ({ account, auth, settings, dealers, SupportSystemMessages }) => {
  return {
    isloading: account.isloading,
    user: auth.authUser,
    dealerList: dealers.dealers,
    translation: settings.translation,
    sentSupportSystemMessages: SupportSystemMessages.supportSystemMessages,
    receivedSupportSystemMessages: SupportSystemMessages.receivedSupportSystemMessages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessages);
