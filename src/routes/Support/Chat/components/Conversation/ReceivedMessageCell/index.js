import React from "react";
import {Avatar} from "antd";
import {getOnlyTimeAndDateTimestamp} from "../../../../../utils/commonUtils";

const ReceivedMessageCell = ({conversation, user}) => {
  return (
    <div className="gx-chat-item">

      <Avatar className="gx-size-40 gx-align-self-end" src="/static/media/profile-image.c9452584.png"
              alt=""/>

      <div className="gx-bubble-block">
        <div className="gx-bubble">
          <div className="gx-message">{conversation.message}</div>
          <div className="gx-time gx-text-muted gx-text-right gx-mt-2">{getOnlyTimeAndDateTimestamp(conversation.createdAt)}</div>
        </div>
      </div>

    </div>
  )
};

export default ReceivedMessageCell;
