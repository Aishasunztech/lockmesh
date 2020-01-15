import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {Card, Icon, Modal, Tabs} from "antd";
import AppFilter from "../../../components/AppFilter";
import { convertToLang } from '../../utils/commonUtils'
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

const TabPane = Tabs.TabPane;


class SystemMessages extends Component {

  constructor(props) {
    super(props);
    var columns = supportSystemMessage(props.translation, this.handleSearch);
    var receivedSupportSystemMessagesCols = receivedSupportSystemMessagesColumns(props.translation, this.handleSearch);

    this.state = {
      sorterKey: '',
      sortOrder: 'ascend',
      columns: columns,
      receivedSupportSystemMessagesCols: receivedSupportSystemMessagesCols,
      visible: false,
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
              pageHeading={convertToLang(this.props.translation[""], "System Messages")}
              addButtonText={convertToLang(this.props.translation[""], "Send New Message")}
            />

            <Card>
              <Tabs defaultActiveKey={ (this.props.user.type === SDEALER) ? "2": "1" } activeKey={this.state.messageTab} type="card" onChange={this.handleChangeCardTabs}>

                {(this.props.user.type !== SDEALER) ?
                <TabPane tab="SENT SYSTEM MESSAGES" key="1" forceRender={true}>
                  <ListSentMessages
                    supportSystemMessages={this.props.supportSystemMessages}
                    columns={this.state.columns}
                    dealerList={this.props.dealerList}
                    getSupportSystemMessages={this.props.getSupportSystemMessages}
                    translation={this.props.translation}
                  />
                </TabPane> : ''}

                {(this.props.user.type !== ADMIN) ?
                <TabPane tab="RECEIVED SYSTEM MESSAGES" key="2" forceRender={true}>
                  <ListReceivedMessages
                    receivedSupportSystemMessages={this.props.receivedSupportSystemMessages}
                    columns={this.state.receivedSupportSystemMessagesCols}
                    dealerList={this.props.dealerList}
                    translation={this.props.translation}
                    user={this.props.user}
                    getReceivedSupportSystemMessages={this.props.getReceivedSupportSystemMessages}
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

    let searchedData = this.searchField(fieldName, fieldValue);
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
    supportSystemMessages: SupportSystemMessages.supportSystemMessages,
    receivedSupportSystemMessages: SupportSystemMessages.receivedSupportSystemMessages,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessages);
