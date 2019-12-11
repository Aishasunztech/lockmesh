import React from "react";
import {Avatar, Checkbox} from "antd";

import labels from "../../../data/labels";

const MailListItem = ({mail, onMailSelect, onMailChecked, onStartSelect}) => {
  return (
    <div className="gx-module-list-item gx-mail-cell">
      <div className="gx-module-list-icon">
        <Checkbox color="primary" className="gx-icon-btn"
                  checked={mail.selected}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMailChecked(mail)
                  }}
                  value="SelectMail"
        />

      </div>

      <div className="gx-mail-list-info" onClick={() => {
        onMailSelect(mail);
      }}>

        <div className="gx-module-list-content">
          <div className="gx-mail-user-des">

            <span className="gx-sender-name">{mail.from.name}</span>

            <span className="gx-toolbar-separator">&nbsp;</span>

            <span className="gx-d-inline-block gx-text-truncate gx-send-subject">{mail.subject}</span>

            {mail.hasAttachments &&

            <i className="icon icon-attachment"/>}

            <div className="gx-time">{mail.time}</div>

          </div>


          <div className="gx-message">
            <p className="gx-text-truncate"> {mail.message}</p>

          </div>
          <div className="gx-labels">
            {labels.map((label, index) => {
              return (mail.labels).includes(label.id) &&
                <div key={index} className={`gx-badge gx-text-white gx-bg-${label.color}`}>{label.title}</div>
            })}
          </div>
        </div>

      </div>

    </div>
  )
};

export default MailListItem;
