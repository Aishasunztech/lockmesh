import React, { PureComponent } from "react";
import { Button, Modal, Table } from "antd";
import ComposeMail from "./components/Compose/index";
import MailDetail from "./components/TicketDetail/index";
import { getDateFromTimestamp } from "../../utils/commonUtils";
import { bindActionCreators } from "redux";
import {
  generateSupportTicket,
  supportTicketReply,
  getSupportTickets,
  getAllDealers,
  closeSupportTicket,
  deleteSupportTicket,
  getSupportTicketReplies,
  getAllToAllDealers,
  setCurrentTicketId,
  resetCurrentTicketId
} from "../../../appRedux/actions";
import { connect } from "react-redux";
import {
  ADMIN, DEALER, SDEALER
} from "../../../constants/Constants";
import {SET_CURRENT_TICKET_ID} from "../../../constants/ActionTypes";
import {DEVICE_ACTIVATION_CODE, DEVICE_DEALER_PIN} from "../../../constants/DeviceConstants";
import {convertToLang} from "../../utils/commonUtils";

const confirm = Modal.confirm;
let connectedDealer;

class Mail extends PureComponent {

  onDeleteMail = (ticketId) => {
    let _this = this;
    confirm({
      title: 'Do you want to delete the selected ticket?',
      okText: "Confirm",
      onOk() {
        _this.props.deleteSupportTicket([ticketId]);
      },
      onCancel() { },
    });
  };

  handleRequestClose = () => {
    this.setState({
      composeMail: false,
    });
  };

  filter = () => {

    let filter = this.state.filter.split('_');
    let searchText = this.state.searchTicket;
    let filter_type = filter[0];
    let value;
    if(filter.length > 1){
      value = filter[1];
    } else {
      filter_type = 'all';
      value = 'all';
    }

    let filteredTickets;

    switch(filter_type) {
      case "status":
        filteredTickets = this.state.supportTickets.filter(ticket => ticket.status === value);
        break;
      case "type":
        filteredTickets = this.state.supportTickets.filter(ticket => ticket.category === value);
        break;
      case "priority":
        filteredTickets = this.state.supportTickets.filter(ticket => ticket.priority === value);
        break;
      default:
        filteredTickets = this.state.supportTickets;
        break;
    }

    let filtered = filteredTickets.filter(ticket => {
      let name = `${ticket.user.dealer_name} (${ticket.user.link_code})`;
      if(ticket.ticketId.toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      } else if(name.toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      } else if(ticket.subject.toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      } else if(ticket.status.toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      } else if(ticket.priority.toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      } else if(ticket.category.toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      } else if(getDateFromTimestamp(ticket.createdAt).toLowerCase().indexOf(searchText.toLowerCase()) > -1){
        return ticket;
      }
    });

    this.setState({filteredSupportTickets: filtered});
  }

  constructor(props) {
    super(props);
    this.state = {
      searchTicket: '',
      filter: 'all_all',
      alertMessage: '',
      currentMail: null,
      composeMail: false,
      filteredSupportTickets: [],
      supportTickets: [],
      supportTicketReplies: [],
    }
  }

  updateState = (obj) => {
    this.setState( obj );
  }

  filterTickets = (obj) => {
    this.setState(obj, () => {
      this.filter();
    });
  }



  componentDidMount() {
    this.props.getDealerList();
    this.props.getSupportTickets(this.props.user);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let ticketsWithUser = [];
    let dealerData;

    if (this.state.supportTickets.length !== this.props.supportTickets.length && this.props.dealerList.length > 0) {

      this.props.supportTickets.map((supportTicket, index) => {

        dealerData = this.props.dealerList.length > 0 && this.props.dealerList.find((dealer) => dealer.dealer_id === supportTicket.user_id);

        supportTicket.user = dealerData;
        ticketsWithUser.push(supportTicket)
      });

      this.setState({
        supportTickets: ticketsWithUser,
        filteredSupportTickets: ticketsWithUser,
      })
    }



    if (this.props.supportTicketReplies.length > 0 && prevProps !== this.props) {

      let repliesWithUser = [];
      this.props.supportTicketReplies.map((reply, index) => {
        dealerData = this.props.dealerList.find((dealer) => dealer.dealer_id === reply.user_id);
        reply.user = dealerData;
        repliesWithUser.push(reply)
      });
      this.setState({
        supportTicketReplies: repliesWithUser,
      })
    } else if (this.props.supportTicketReplies.length === 0 && prevProps !== this.props) {
      this.setState({
        supportTicketReplies: [],
      })
    }

    if (this.props.dealerList.length > 0){
      connectedDealer = this.props.dealerList.find(dealer => this.props.user.connected_dealer === dealer.dealer_id);
    }

  }

  onCloseTicket(data) {
    let _this = this;
    confirm({
      title: 'Do you want to change the ticket status to close?',
      okText: "Confirm",
      onOk() {
        _this.props.closeSupportTicket(data._id);
      },
      onCancel() { },
    });

  }

  onMailSelect(mail) {
    this.props.getSupportTicketReplies(mail._id);
    this.setState({
      currentMail: mail,
    });
    this.props.updateOnTicketPage(true);
    this.props.setCurrentTicket(mail._id);
  }

  deSelectMail() {
    this.setState({
      currentMail: null
    });
    this.props.resetCurrentTicket();
  }

  createSupportTicketsTableData(tickets){
    return tickets.map(item => {

      let data = {
        ticketId: item.ticketId,
        name: item.user.dealer_name + " ("+ item.user.link_code +")",
        subject: <a href="javascript:void(0);" onClick={() => this.onMailSelect(item)}>{item.subject}</a>,
        subjectStr: item.subject,
        status: item.status,
        type: item.category,
        priority: item.priority,
        time: getDateFromTimestamp(item.createdAt),
        delete: {
          id: item._id,
          isClosed: item.status === 'closed'
        },
        _id: item._id
      };
      return data;
    });
  }

  supportTableColumns(admin = false){
    let adminColumn = {
      title: 'Actions',
      dataIndex: 'delete',
      align: 'center',
      className: 'row',
      key: "deleteTicket",
      render: (item) => { return item.isClosed ? <Button type="danger" size="small" onClick={() => this.onDeleteMail(item.id)}>Delete</Button> : ''; },
    };
    let defautlColumns = [{
      title: 'Subject',
      align: "center",
      dataIndex: 'subject',
      width: 500,
      key: 'subject',
      sorter: (a, b) => { return a.subjectStr.localeCompare(b.subjectStr) },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Ticket Id',
      dataIndex: 'ticketId',
      align: 'center',
      className: 'row',
      key: "ticketId",
      sorter: (a, b) => { return a.ticketId.localeCompare(b.ticketId) },
      sortDirections: ['ascend', 'descend'],
    },{
      title: 'Dealer/SDealer Name',
      align: "center",
      dataIndex: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name); },
      sortDirections: ['ascend', 'descend'],
      key: "name",
    },{
      title: 'Status',
      align: "center",
      dataIndex: 'status',
      key: 'status',
      sorter: (a, b) => { return a.status.localeCompare(b.status) },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Type',
      align: "center",
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => { return a.type.localeCompare(b.type) },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Priority',
      align: "center",
      dataIndex: 'priority',
      key: 'priority',
      sorter: (a, b) => { return a.priority.localeCompare(b.priority) },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Date',
      align: "center",
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => { return a.time.localeCompare(b.time) },
      sortDirections: ['ascend', 'descend'],
    }];

    if(admin){
      return [adminColumn, ...defautlColumns];
    }

    return defautlColumns;
  }

  renderTickets(filteredSupportTickets){
    const { currentMail } = this.state;
    return currentMail === null ? (<Table
      className="gx-table-responsive"
      size="midddle"
      bordered
      columns={this.supportTableColumns(this.props.user.type === ADMIN)}
      dataSource={this.createSupportTicketsTableData(filteredSupportTickets)}
      pagination={false}
      scroll={{ x: true }}
      rowKey="key"
    />) : <MailDetail
      user={this.props.user}
      supportTicket={currentMail}
      supportTicketReply={this.props.supportTicketReply}
      onCloseTicket={this.onCloseTicket.bind(this)}
      updateOnTicketPage={this.props.updateOnTicketPage}
      closeSupportTicketStatus={this.props.closeSupportTicketStatus}
      supportTicketReplies={this.state.supportTicketReplies}
      updateState={this.updateState.bind(this)}
      resetCurrentTicket={this.props.resetCurrentTicket}
    />;
  }

  render() {
    const { currentMail, composeMail, filteredSupportTickets } = this.state;
    return (
      <div>
        {this.renderTickets(filteredSupportTickets)}

        <ComposeMail
          open={composeMail}
          admin={this.props.admin}
          user={this.props.user}
          connectedDealer={connectedDealer}
          generateSupportTicket={this.props.generateSupportTicket}
          onClose={this.handleRequestClose.bind(this)}
        />
      </div>

    )
  }
}


var mapStateToProps = ({ auth, SupportTickets, dealers, sidebar }) => {

  return {
    user: auth.authUser,
    admin: sidebar.admin,
    supportTickets: SupportTickets.supportTickets,
    dealerList: dealers.allDealers,
    closeSupportTicketStatus: SupportTickets.closeSupportTicketStatus,
    supportTicketReplies: SupportTickets.supportTicketReplies,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    generateSupportTicket: generateSupportTicket,
    supportTicketReply: supportTicketReply,
    getSupportTickets: getSupportTickets,
    getDealerList: getAllToAllDealers,
    closeSupportTicket: closeSupportTicket,
    deleteSupportTicket: deleteSupportTicket,
    getSupportTicketReplies: getSupportTicketReplies,
    setCurrentTicket: setCurrentTicketId,
    resetCurrentTicket: resetCurrentTicketId
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Mail);
