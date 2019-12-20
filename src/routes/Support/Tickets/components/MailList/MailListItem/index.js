import React from "react";
import {Avatar, Checkbox} from "antd";
import { getDateFromTimestamp } from "../../../../../utils/commonUtils";

import statuses from "../../../data/statuses";
import categories from "../../../data/categories";
import priorities from "../../../data/priorities";

const MailListItem = ({supportTicket, onMailSelect, onMailChecked}) => {

  return (
    <div className="gx-module-list-item gx-mail-cell">
      <div className="gx-module-list-icon">
        <Checkbox color="primary" className="gx-icon-btn selectCheckBox"

                  onClick={(event) => {
                    event.stopPropagation();
                    onMailChecked(supportTicket)
                  }}
                  value="SelectMail"
        />

      </div>

      <div className="gx-mail-list-info" onClick={() => {
        onMailSelect(supportTicket);
      }}>

        <div className="gx-module-list-content">
          <div className="gx-mail-user-des">

            <span className="gx-sender-name">{supportTicket.user.dealer_name} ({supportTicket.user.link_code})</span>

            <span className="gx-toolbar-separator">&nbsp;</span>

            <span className="gx-d-inline-block gx-text-truncate gx-send-subject">{supportTicket.subject}</span>

            <div className="gx-time">{getDateFromTimestamp(supportTicket.createdAt)}</div>

          </div>


          <div className="gx-message">
            <p className="gx-text-truncate"> {supportTicket.description}</p>

          </div>
          <div className="gx-labels">
            {statuses.map((status, index) => {

              return (supportTicket.status).includes(status.title) &&
                <div key={index} className={`gx-badge gx-text-white gx-bg-${status.title === 'open' ?'green' : 'red'} text-capitalize`}>{status.title}</div>
            })}

            {categories.map((category, index) => {
              return (supportTicket.category).includes(category.title) &&
                <div key={index} className={`gx-badge gx-text-white gx-bg-blue text-capitalize`}>{category.title}</div>
            })}

            {priorities.map((priority, index) => {
              return (supportTicket.priority).includes(priority.title) &&
                <div key={index} className={`gx-badge gx-text-white gx-bg-purple text-capitalize`}>{priority.title}</div>
            })}
          </div>
        </div>

      </div>

    </div>
  )
};

export default MailListItem;
