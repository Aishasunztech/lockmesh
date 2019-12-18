import React from "react";
import CustomScrollbars from 'util/CustomScrollbars'

import MailListItem from "./MailListItem";

const MailList = ({supportTickets, dealerList,  onMailSelect, onMailChecked, onStartSelect}) => {
  console.log(dealerList)

  return (
    <div className="gx-module-list gx-mail-list">
      <CustomScrollbars className="gx-module-content-scroll">
        {/*{supportTickets.map((supportTicket, index) => {*/}
        {/*    let dealerdData = dealerList.find((dealer) => dealer.dealer_id === supportTicket.user_id)*/}
        {/*    console.log(dealerdData)*/}
        {/*    return (<MailListItem key={index} supportTicket={supportTicket} onMailSelect={onMailSelect} onMailChecked={onMailChecked}*/}
        {/*                          onStartSelect={onStartSelect}/>)*/}
        {/*  }*/}

        )}

      </CustomScrollbars>
    </div>
  )
};

export default MailList;
