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
    const {chatUsers, selectedSectionId, onSelectUser } = this.props;
    return (
      <div className="gx-chat-user">
        {chatUsers.map((chat, index) =>
          <UserCell key={index} chat={chat} conversation={chat._id} typing={this.state.typing} selectedSectionId={selectedSectionId} onSelectUser={onSelectUser}/>
        )}
      </div>
    )
  }
};

const mapStateToProps = ({ SupportLiveChat }) => {
  const { typingConversations } = SupportLiveChat;
  return {
    typing: typingConversations
  }
}

export default connect(mapStateToProps)(ChatUserList);
