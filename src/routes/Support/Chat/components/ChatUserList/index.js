import React, { Component } from "react";
import { connect } from 'react-redux';
import UserCell from "./UserCell/index";

class ChatUserList extends Component {
  constructor(props){
    super(props);
    this.state = {
      typing: props.typing
    };
  }

  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      this.setState({
        typing: this.props.typing
      });
    }
  }

  render(){
    const {chatUsers, selectedSectionId, onSelectUser, notifications } = this.props;
    let noOfReceivedMessages = 0;
    return (
      <div className="gx-chat-user">
        {chatUsers.map((chat, index) => {
          notifications.map(noti => {
            if(noti.sender === chat.user.dealer_id){
              noOfReceivedMessages = noti.noOfUnreadMessages;
            }
          });
            return <UserCell key={index} noOfReceivedMessages={noOfReceivedMessages} chat={chat} conversation={chat._id} typing={this.state.typing}
                      selectedSectionId={selectedSectionId} onSelectUser={onSelectUser}/>
          }
        )}
      </div>
    )
  }
};

const mapStateToProps = ({ SupportLiveChat, sidebar }) => {
  const { typingConversations } = SupportLiveChat;
  const { supportChatNotifications } = sidebar;
  return {
    typing: typingConversations,
    notifications: supportChatNotifications
  }
}

export default connect(mapStateToProps)(ChatUserList);
