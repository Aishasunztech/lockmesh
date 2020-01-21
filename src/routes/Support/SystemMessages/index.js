import React, {Component} from 'react'
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {Card, Modal, Tabs} from "antd";
import {checkValue, convertToLang, getDateFromTimestamp} from '../../utils/commonUtils'
import ListSystemMessages from './components/ListSystemMessages';
import SendMessage from './components/SendMessage';
import {getAllDealers} from "../../../appRedux/actions/Dealers";

import {
  generateSupportSystemMessages,
  getReceivedSupportSystemMessages,
  getSupportSystemMessages,
  updateSupportSystemMessageNotification
} from "../../../appRedux/actions/SupportSystemMessages";
import { supportSystemMessage} from "../../utils/columnsUtils";
import {ADMIN, DEALER, SDEALER} from "../../../constants/Constants";

const TabPane           = Tabs.TabPane;
var copySystemMessages  = [];

class SystemMessages extends Component {

  constructor(props) {
    super(props);
    var columns  = supportSystemMessage(props.translation);
    columns      = this.removeColumns(props, columns);

    this.state = {
      columns: columns,
      visible: false,
      sentSupportSystemMessages: [],
      copySentSupportSystemMessages: [],
      receivedSupportSystemMessages: [],
      copyReceivedSupportSystemMessages: [],
      searchSystemMessagesColumns: [],
    };
    this.confirm = Modal.confirm;
  }

  removeColumns = ({ user }, columns) => {
    if(user.type === ADMIN){
      columns.splice(2,2);
    } else if(user.type === SDEALER){
      columns.splice(1, 2);
    }
    return columns;
  };

  componentDidMount() {
    let searchSystemMessagesColumnsArray = [];
    this.props.getAllDealers();
    if (this.props.user.type === SDEALER){
      searchSystemMessagesColumnsArray = ['sender', 'subject' ,'createdAt'];
      this.props.getReceivedSupportSystemMessages();
    }else if (this.props.user.type === ADMIN){
      searchSystemMessagesColumnsArray = ['subject' ,'createdAt'];
      this.props.getSupportSystemMessages();
    }else{
      searchSystemMessagesColumnsArray = ['sender', 'type', 'subject' ,'createdAt'];
      this.props.getSupportSystemMessages();
      this.props.getReceivedSupportSystemMessages();
    }

    this.setState({searchSystemMessagesColumns: searchSystemMessagesColumnsArray})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let receivedSupportSystemMessagesData = [];
    let sentSupportSystemMessagesData     = [];

    if (this.props.receivedSupportSystemMessages.length > 0 && prevProps.receivedSupportSystemMessages !== this.props.receivedSupportSystemMessages){
      let data;
      this.props.receivedSupportSystemMessages.map((item) => {
        data = {
          id: item.system_message._id,
          key: item.system_message._id,
          rowKey: item.system_message._id,
          type: 'Received',
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

    if ((this.props.sentSupportSystemMessages.length > 0 && prevProps.sentSupportSystemMessages !== this.props.sentSupportSystemMessages) || (this.props.dealerList.length > 0 && prevProps.dealerList !== this.props.dealerList)){

      if (this.props.dealerList.length > 0 ){
        let data;
        let sender = '';
        this.props.sentSupportSystemMessages.map((item) => {

          if (this.props.user.type === ADMIN){
            let dealer  = item.sender_user_type === ADMIN ? ADMIN : this.props.dealerList.find(dealer => dealer.dealer_id === item.sender_id) ;
            sender      = item.sender_user_type === ADMIN ? ADMIN : dealer.dealer_name;
            sender      = sender.charAt(0).toUpperCase() + sender.slice(1);
          }

          data = {
            id: item._id,
            key: item._id,
            rowKey: item._id,
            type: 'Sent',
            receiver_ids: item.receiver_ids,
            sender: sender,
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
  }

  handleSendMsgButton = (visible) => {
    this.setState({ visible })
  };

  render() {
    if(this.props.user.type !== ADMIN && this.state.columns[2].dataIndex == 'sender'){
      this.state.columns.splice(2,1)
    }

    return (
      <div>
        {
          <div>

            <ListSystemMessages
              supportSystemMessages={this.state.sentSupportSystemMessages}
              getSupportSystemMessages={this.props.getSupportSystemMessages}
              getReceivedSupportSystemMessages={this.props.getReceivedSupportSystemMessages}
              receivedSupportSystemMessages={this.state.receivedSupportSystemMessages}
              updateSupportSystemMessageNotification={this.props.updateSupportSystemMessageNotification}
              columns={this.state.columns}
              dealerList={this.props.dealerList}
              user={this.props.user}
              translation={this.props.translation}
              filterOption={this.props.filterOption}
              systemMessagesSearchValue={this.props.systemMessagesSearchValue}
              searchSystemMessagesColumns={this.state.searchSystemMessagesColumns}
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

}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
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

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(SystemMessages);
