import React, {Component} from "react";
import {Avatar, Button, Drawer, Input, Tabs} from "antd";
import CustomScrollbars from "util/CustomScrollbars";
import Moment from "moment";

import ChatUserList from "./components/ChatUserList";
import Conversation from "./components/Conversation/index";
import ContactList from "./components/ContactList/index";
import users from "./data/chatUsers";

import SearchBox from "./components/SearchBox";
import CircularProgress from "../../../components/CircularProgress/index";
import {bindActionCreators} from "redux";
import { SUPPORT_LIVE_CHAT_I_AM_TYPING, SUPPORT_LIVE_CHAT_I_STOPPED_TYPING } from "../../../constants/ActionTypes";

import {connect} from "react-redux";
import {
  getAllDealers,
  getAllToAllDealers,
  getSupportLiveChatConversation, getSupportLiveChatMessages,
  sendSupportLiveChatMessage
} from "../../../appRedux/actions";
import {ADMIN, DEALER, SDEALER} from "../../../constants/Constants";

const TabPane = Tabs.TabPane;

class Chat extends Component {
  filterContact = (userName) => {
    if (userName === '') {
      return this.state.copyContactList;
    }
    return this.state.copyContactList.filter((list) =>
      list.dealer_name.toLowerCase().indexOf(userName.toLowerCase()) > -1
    );
  };
  filterUsers = (userName) => {
    if (userName === '') {
      return this.state.copyChatUsers;
    }
    return this.state.copyChatUsers.filter((list) =>
      list.user.dealer_name.toLowerCase().indexOf(userName.toLowerCase()) > -1
    );
  };
    Communication = () => {
    const {message, selectedUser} = this.state;
    return <div className="gx-chat-main">
      <div className="gx-chat-main-header">
        <span className="gx-d-block gx-d-lg-none gx-chat-btn"><i className="gx-icon-btn icon icon-chat"
                                                                 onClick={this.onToggleDrawer.bind(this)}/></span>
        <div className="gx-chat-main-header-info">

          <div className="gx-chat-avatar gx-mr-2">
            <div className="gx-status-pos">
              <Avatar src='/static/media/profile-image.c9452584.png'
                      className="gx-rounded-circle gx-size-60"
                      alt=""/>

              <span className={`gx-status gx-${selectedUser.status}`}/>
            </div>
          </div>

          <div className="gx-chat-contact-name">
            {selectedUser.dealer_name}
            <div className="gx-chat-info-des gx-text-truncate">{selectedUser.link_code}</div>
          </div>

        </div>

      </div>

      <CustomScrollbars className="gx-chat-list-scroll">
        <Conversation
          conversationData={this.state.conversation}
          selectedUser={selectedUser}
          user={this.props.user}
        />
      </CustomScrollbars>

      <div className="gx-chat-main-footer">
        <div className="gx-flex-row gx-align-items-center" style={{maxHeight: 51}}>
          <div className="gx-col">
            <div className="gx-form-group">
              <textarea
                id="required" className="gx-border-0 ant-input gx-chat-textarea"
                onKeyUp={this._handleKeyPress.bind(this)}
                onChange={this.updateMessageValue.bind(this)}
                value={message}
                required={true}
                placeholder="Type and hit enter to send message"
              />
            </div>
          </div>
          <i className="gx-icon-btn icon icon-sent" onClick={this.submitComment.bind(this)}/>
        </div>
      </div>
    </div>
  };

  ChatUsers = () => {
    return <div className="gx-chat-sidenav-main">

      <div className="gx-chat-sidenav-header">

        <div className="gx-chat-user-hd">

          <div className="gx-chat-avatar gx-mr-3" onClick={() => {
            this.setState({
              userState: 2
            });
          }}>
            <div className="gx-status-pos">
              <Avatar id="avatar-button" src='/static/media/profile-image.c9452584.png'
                      className="gx-size-50"
                      alt=""/>
              {/*<span className="gx-status gx-online"/>*/}
            </div>
          </div>

          <div className="gx-module-user-info gx-flex-column gx-justify-content-center">
            <div className="gx-module-title">
              <h5 className="gx-mb-0">{this.props.user.name}</h5>
            </div>
            <div className="gx-module-user-detail">
              <span className="gx-text-grey gx-link">{this.props.user.email}</span>
            </div>
          </div>
        </div>

        <div className="gx-chat-search-wrapper">

          <SearchBox styleName="gx-chat-search-bar gx-lt-icon-search-bar-lg"
                     placeholder="Search or start new chat"
                     onChange={this.updateSearchChatUser.bind(this)}
                     value={this.state.searchChatUser}/>

        </div>
      </div>

      <div className="gx-chat-sidenav-content">

        <Tabs className="gx-tabs-half" defaultActiveKey="1">
          <TabPane label="Chat Users" tab="Chat Users" key="1">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-1">
              {this.state.chatUsers.length === 0 ?
                <div className="gx-p-5">{this.state.userNotFound}</div>
                :
                <ChatUserList
                  chatUsers={this.state.chatUsers}
                  selectedSectionId={this.state.selectedSectionId}
                  onSelectUser={this.onSelectUser.bind(this)}/>
              }
            </CustomScrollbars>
          </TabPane>
          <TabPane label="Contacts List" tab="Contacts List" key="2">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-2">
              {
                this.state.contactList.length === 0 ?
                  <div className="gx-p-5">{this.state.userNotFound}</div>
                  :
                  <ContactList
                    contactList={this.state.contactList}
                    selectedSectionId={this.state.selectedSectionId}
                    onSelectUser={this.onSelectUser.bind(this)}/>
              }
            </CustomScrollbars>
          </TabPane>
        </Tabs>


      </div>
    </div>
  };

  _emitEvent = (e) => {
    if(this.props.supportSocket && this.state.selectedConversation !== null && this.state.selectedUser !== null){
      if(this.state.message.length > 0 && !this.state.isTypingEventEmitted){
        this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_AM_TYPING, {conversation: this.state.selectedConversation, user: this.state.selectedUser.dealer_id});
        this.setState({isTypingEventEmitted: true});
      } else {
        if(!this.state.message.length > 0){
          this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_STOPPED_TYPING, {conversation: this.state.selectedConversation, user: this.state.selectedUser.dealer_id});
          this.setState({isTypingEventEmitted: false});
        }
      }
    }
    if(e.key === 'Enter'){
      if(this.props.supportSocket && this.state.selectedConversation !== null && this.state.selectedUser !== null){
        this.props.supportSocket.emit(SUPPORT_LIVE_CHAT_I_STOPPED_TYPING, {conversation: this.state.selectedConversation, user: this.state.selectedUser.dealer_id});
      }
    }
  }

  _handleKeyPress = (e) => {
    this._emitEvent(e);
    if (e.key === 'Enter') {
      this.submitComment();
    }
  };

  handleChange = (event, value) => {

    this.setState({selectedTabIndex: value});
  };

  onSelectUser = (data, type) => {

    if (type === 'chat'){
      this.props.getSupportLiveChatMessages({type: 'conversation', id: data._id});
    }else{
      this.props.getSupportLiveChatMessages({type: 'user', id: data.dealer_id});
    }

    let selectedConversation = (data.hasOwnProperty('_id')) ? data._id : null;

    this.setState({
      loader: true,
      selectedSectionId: type === 'user'? data.dealer_id : data.user.dealer_id,
      drawerState: this.props.drawerState,
      selectedUser: type === 'user'? data : data.user,
      selectedConversation: selectedConversation,
      conversation: []
    });
    setTimeout(() => {
      this.setState({loader: false});
    }, 500);
  };

  showCommunication = () => {
    return (
      <div className="gx-chat-box">
        {this.state.selectedUser === null ?
          <div className="gx-comment-box">
            <div className="gx-fs-80"><i className="icon icon-chat gx-text-muted"/></div>
            <h1 className="gx-text-muted">Select User to start Chat</h1>
            <Button className="gx-d-block gx-d-lg-none" type="primary"
                    onClick={this.onToggleDrawer.bind(this)}>Select User to start Chat</Button>

          </div>
          : this.Communication()}
      </div>)
  };

  constructor() {
    super();
    this.state = {
      loader: false,
      userNotFound: 'No user found',
      drawerState: false,
      selectedSectionId: '',
      selectedTabIndex: 1,
      userState: 1,
      searchChatUser: '',
      contactList: [],
      copyContactList: [],
      selectedUser: null,
      selectedConversation: null,
      message: '',
      isTypingEventEmitted: false,
      chatUsers: [],
      copyChatUsers: [],
      conversation: []
    }
  }

  componentDidMount() {
    this.props.getAllToAllDealers();
    this.props.getSupportLiveChatConversation();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let chatUsersWithUser = [];


    if (prevProps !== this.props){


      if (this.state.chatUsers !== this.props.supportLiveChatConversations && this.props.supportLiveChatConversations.length > 0 && this.props.dealerList.length > 0) {

        this.props.supportLiveChatConversations.map((chatUsers) => {

          if (this.props.user.id === chatUsers.sender){
            chatUsers.user = this.props.dealerList.find((dealer) => (dealer.dealer_id === chatUsers.receiver));
          }else{
            chatUsers.user = this.props.dealerList.find((dealer) => (dealer.dealer_id === chatUsers.sender));
          }

          if (chatUsers.user.type === ADMIN){
            let adminObject           = chatUsers.user;
            adminObject.dealer_name   = 'Admin';
            adminObject.link_code     = '';
            chatUsers.user            = adminObject;
          }


          chatUsersWithUser.push(chatUsers)
        });

        this.setState({
          chatUsers: chatUsersWithUser,
          copyChatUsers: chatUsersWithUser,
        });

      }

      let admin ;
      if (this.props.user.type === SDEALER || this.props.user.type === DEALER){
        admin               = this.props.admin;
        admin.dealer_name   = 'Admin';
        admin.link_code     = '';
      }

      if (this.props.user.type === SDEALER  && this.props.dealerList.length > 0){

        let dealer          = this.props.dealerList.find((dealer) => (dealer.dealer_id === this.props.user.connected_dealer ));

        this.setState({
          contactList: [dealer, admin],
          copyContactList: [dealer, admin],
        })

      }else if (this.props.user.type === DEALER && this.props.contactList.length > 0){

        this.setState({
          contactList: [...this.props.contactList, admin],
          copyContactList: [...this.props.contactList, admin],
        })

      }else if (this.props.contactList.length > 0){

        this.setState({
          contactList: this.props.contactList,
          copyContactList: this.props.contactList,
        })

      }

      if (this.props.supportLiveChatMessages.length > 0){
        this.setState({
          conversation: this.props.supportLiveChatMessages,
        })
      }

    }

  }

  submitComment() {

    if (this.state.message.length > 0 && this.state.message.trim().length > 0) {
      let data = {
        receiver: this.state.selectedUser.dealer_id,
        message: this.state.message,
      };

      this.props.sendSupportLiveChatMessage(data);
      this.setState({
        message: '',
        isTypingEventEmitted: false
      });
    }
  }

  updateMessageValue(evt) {
    this.setState({
      message: evt.target.value
    });
  }

  updateSearchChatUser(evt) {
    this.setState({
      searchChatUser: evt.target.value,
      contactList: this.filterContact(evt.target.value),
      chatUsers: this.filterUsers(evt.target.value)
    });
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState
    });
  }

  render() {
    const {loader} = this.state;
    return (
      <div className="gx-main-content">
        <div className="gx-app-module gx-chat-module m-0">
          <div className="gx-chat-module-box">
            <div className="gx-chat-sidenav gx-d-none gx-d-lg-flex">
              {this.ChatUsers()}
            </div>
            {loader ?
              <div className="gx-loader-view">
                <CircularProgress/>
              </div> : this.showCommunication()
            }
          </div>
        </div>
      </div>
    )
  }
}

var mapStateToProps = ({ auth, SupportLiveChat, dealers, sidebar, socket }) => {

  return {
    contactList: dealers.dealers,
    dealerList: dealers.allDealers,
    admin: sidebar.admin,
    user: auth.authUser,
    supportSocket: socket.supportSystemSocket,
    supportLiveChatConversations: SupportLiveChat.supportLiveChatConversations,
    supportLiveChatMessages: SupportLiveChat.supportLiveChatMessages,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    sendSupportLiveChatMessage: sendSupportLiveChatMessage,
    getSupportLiveChatConversation: getSupportLiveChatConversation,
    getSupportLiveChatMessages: getSupportLiveChatMessages,
    getAllToAllDealers: getAllToAllDealers,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
