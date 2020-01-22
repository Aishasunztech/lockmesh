import React from "react";
import { Button, Icon, Form, Input, Row, Col } from 'antd';
import SupportTicketReply from '../SupportTicketReply/index'
import CustomScrollbars from 'util/CustomScrollbars'
import { getDateFromTimestamp } from "../../../../utils/commonUtils";
import Reply from '../SupportTicketReply/reply';
import statuses from "../../data/statuses";
import categories from "../../data/categories";
import priorities from "../../data/priorities";

const { TextArea } = Input;
class TicketDetail extends React.Component {

  state = {
    replyTicket: false
  };

  handleRequestClose = () => {
    this.setState({
      replyTicket: false,
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  render() {
    const {supportTicket, onCloseTicket, closeSupportTicketStatus, user, updateState } = this.props;

    return (
      <div className="gx-module-detail gx-mail-detail">
        <CustomScrollbars className="gx-module-content-scroll">
          <div className="gx-mail-detail-inner">
            <div className="gx-mail-header">
              <div className="gx-mail-header-content gx-col gx-pl-0">
                <div className="gx-subject" style={{fontSize: '20px'}}>
                  <span style={{display: 'block', float: 'left', marginRight: '20px'}}><Icon type="arrow-left" style={{fontSize: '20px', marginTop: '15px'}} onClick={() => {
                    updateState({ currentMail: null })
                    this.props.resetCurrentTicket();
                  }} /></span>
                  <span style={{display: 'block', float: 'left'}}>Subject: {supportTicket.subject}<br />
                    Ticket Id: ({ supportTicket.ticketId })</span>
                </div>

              </div>

              <div className="gx-mail-header-actions">

                <div onClick={() => {
                  onCloseTicket(supportTicket);
                }}>

                  {supportTicket.status === 'open' && closeSupportTicketStatus === false?
                    <Button type="danger" size="small">Close Ticket</Button>
                    : ''
                  }
                </div>
              </div>
            </div>

            <hr/>

            <p style={{fontSize: '16px', textAlign: 'justify'}}>
              <strong>Description:</strong><br />

              {supportTicket.description}
            </p>

            {(this.props.supportTicketReplies.length > 0) ?
              <div>
                <h2>Replies ({this.props.supportTicketReplies.length})</h2>
                {this.props.supportTicketReplies.map((reply, index) => {
                  return (<div className="gx-module-list-item gx-mail-cell" key={index}>
                    <div className="gx-mail-list-info" style={{maxWidth: '100%'}}>
                      <div className="gx-module-list-content">
                        <div className="gx-mail-user-des">
                          <span className="gx-sender-name">{(reply.user_type === 'admin') ? 'Admin' : reply.user.dealer_name +' ('+reply.user.link_code+')' }</span>
                          <div className="gx-time">{getDateFromTimestamp(reply.createdAt)}</div>
                        </div>
                        <div className="gx-message">
                          <p style={{textAlign: 'justify'}}>{reply.description.split("\n").map((i,k) => <span key={k}>{i}<br /></span>)}</p>
                        </div>
                      </div>
                    </div>
                  </div>)
                })}
              </div>
              : ''}
          </div>

          <Reply user={user} ticket={supportTicket} supportTicketReply={this.props.supportTicketReply} />

        </CustomScrollbars>

        {/*<SupportTicketReply open={this.state.replyTicket}*/}
                            {/*user={this.props.user}*/}
                            {/*supportTicketReply={this.props.supportTicketReply}*/}
                            {/*supportTicket={this.props.supportTicket}*/}
                            {/*onClose={this.handleRequestClose.bind(this)}*/}
        {/*/>*/}

      </div>
    );
  }
}

export default TicketDetail;
