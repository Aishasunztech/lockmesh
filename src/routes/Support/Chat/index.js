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

import {connect} from "react-redux";
import {getAllDealers, sendSupportLiveChatMessage} from "../../../appRedux/actions";

const TabPane = Tabs.TabPane;

class Chat extends Component {
  filterContact = (userName) => {
    if (userName === '') {
      return users.filter(user => !user.recent);
    }
    return users.filter((user) =>
      !user.recent && user.name.toLowerCase().indexOf(userName.toLowerCase()) > -1
    );
  };
  filterUsers = (userName) => {
    if (userName === '') {
      return users.filter(user => user.recent);
    }
    return users.filter((user) =>
      user.recent && user.name.toLowerCase().indexOf(userName.toLowerCase()) > -1
    );
  };
  Communication = () => {
    const {message, selectedUser, conversation} = this.state;
    const {conversationData} = [conversation];
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
        <Conversation conversationData={conversationData}
                      selectedUser={selectedUser}/>
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
              <span className="gx-status gx-online"/>
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
          <TabPane label="Chat User" tab="Chat User" key="1">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-1">
              {this.state.chatUsers.length === 0 ?
                <div className="gx-p-5">{this.state.userNotFound}</div>
                :
                <ChatUserList chatUsers={this.state.chatUsers}
                              selectedSectionId={this.state.selectedSectionId}
                              onSelectUser={this.onSelectUser.bind(this)}/>
              }
            </CustomScrollbars>
          </TabPane>
          <TabPane label="Chat Contacts" tab="Chat Contacts" key="2">
            <CustomScrollbars className="gx-chat-sidenav-scroll-tab-2">
              {
                this.state.contactList.length === 0 ?
                  <div className="gx-p-5">{this.state.userNotFound}</div>
                  :
                  <ContactList
                    contactList={this.props.contactList}
                    selectedSectionId={this.state.selectedSectionId}
                    onSelectUser={this.onSelectUser.bind(this)}/>
              }
            </CustomScrollbars>
          </TabPane>
        </Tabs>


      </div>
    </div>
  };
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.submitComment();
    }
  };

  handleChange = (event, value) => {
    this.setState({selectedTabIndex: value});
  };

  onSelectUser = (user) => {
    this.setState({
      loader: true,
      selectedSectionId: user.dealer_id,
      drawerState: this.props.drawerState,
      selectedUser: user,
      conversation: []
    });
    setTimeout(() => {
      this.setState({loader: false});
    }, 1500);
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
      contactList: users.filter((user) => !user.recent),
      selectedUser: null,
      message: '',
      chatUsers: users.filter((user) => user.recent),
      conversationList: [],
      conversation: null
    }
  }

  submitComment() {console.log(this.state.selectedUser)
    if (this.state.message !== '') {
      let data = {
        sender: this.props.user.id,
        receiver: this.state.selectedUser.dealer_id,
        message: this.state.message,
      };

      this.props.sendSupportLiveChatMessage(data);
      // const updatedConversation = this.state.conversation.conversationData.concat({
      //   'type': 'sent',
      //   'message': this.state.message,
      //   'sentAt': Moment().format('hh:mm:ss A'),
      // });
      // this.setState({
      //   conversation: {
      //     ...this.state.conversation, conversationData: updatedConversation
      //   },
      //   message: '',
      //   conversationList: this.state.conversationList.map(conversationData => {
      //     if (conversationData.id === this.state.conversation.id) {
      //       return {...this.state.conversation, conversationData: updatedConversation};
      //     } else {
      //       return conversationData;
      //     }
      //   })
      // });
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

var mapStateToProps = ({ auth, SupportTickets, dealers, sidebar }) => {

  return {
    contactList: dealers.dealers,
    user: auth.authUser,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    sendSupportLiveChatMessage: sendSupportLiveChatMessage,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
