import React from "react";

import ReceivedMessageCell from "./ReceivedMessageCell/index";
import SentMessageCell from "./SentMessageCell/index";

const Conversation = ({conversationData, selectedUser, user}) => {

  return (
    <div className="gx-chat-main-content">
      { conversationData !== undefined && conversationData.map((conversation, index) =>
        conversation.sender === user.dealerId ?
            <SentMessageCell key={index} conversation={conversation}/> :
            <ReceivedMessageCell key={index} conversation={conversation} user={selectedUser}/>


      )}
    </div>
  )
};

export default Conversation;
