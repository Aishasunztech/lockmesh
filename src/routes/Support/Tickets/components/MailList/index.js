import React from "react";
import CustomScrollbars from 'util/CustomScrollbars'

import MailListItem from "./MailListItem";

const MailList = ({supportTickets,  onMailSelect, onMailChecked}) => {

  return (
    <div className="gx-module-list gx-mail-list">
      <CustomScrollbars className="gx-module-content-scroll">
        {supportTickets.map((supportTicket, index) => {
            return (<MailListItem
              key={index}
              supportTicket={supportTicket}
              onMailSelect={onMailSelect}
              onMailChecked={onMailChecked}
            />)
          }
        )}

      </CustomScrollbars>
    </div>
  )
};

export default MailList;
