import React, { PureComponent } from "react";
import { Button, Checkbox, Drawer, Dropdown, Menu, message, Modal, Col, Row, Table } from "antd";
import CustomScrollbars from "util/CustomScrollbars";

import mails from "./data/mails";
import categories from "./data/categories";
import statuses from "./data/statuses";
import priorities from "./data/priorities";
import MailList from "./components/MailList";
import ComposeMail from "./components/Compose/index";
import AppModuleHeader from "./components/AppModuleHeader/index";
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

  SupportTicketSideBar = () => {
    return <div className="gx-module-side">

      <div className="gx-module-side-header p-25">
        <div className="gx-module-logo">
          <i className="icon icon-ticket-new gx-mr-4" />
          Tickets
        </div>
      </div>

      <div className="gx-module-side-content">
        <CustomScrollbars className="gx-module-side-scroll">
          {this.props.user.type !== ADMIN ?
            <div className="gx-module-add-task">
              <Button type="primary" className="gx-btn-block"
                onClick={() => {
                  this.setState({ composeMail: true })
                }}>
                <i className="icon icon-edit gx-mr-2" />
                Generate Ticket
              </Button>
            </div>
            : ''}
          <ul className="gx-module-nav">

            <li className="gx-module-nav-label">
              Statuses
            </li>

            {this.getStatuses()}

            <li className="gx-module-nav-label">
              Priorities
            </li>

            {this.getPriorities()}

            <li className="gx-module-nav-label">
              Categories
            </li>
            {this.getCategories()}
          </ul>
        </CustomScrollbars>
      </div>
    </div>
  };

  onDeleteMail = () => {
    let _this = this;

    confirm({
      title: 'Do you want to delete the selected ticket?',
      okText: "Confirm",
      onOk() {
        _this.props.deleteSupportTicket(_this.state.selectedMails);
        _this.setState({
          selectedMails: []
        });
      },
      onCancel() { },
    });

  };

  getCategories = () => {

    return categories.map((category, index) =>
      <li key={index} onClick={() => {

        const filterSupportTickets = this.state.supportTickets.filter(supportTickets => {
          if (category.title === 'all') {
            return true
          } else if (category.title === supportTickets.category) {
            return supportTickets
          }
        });
        this.setState({
          noContentFoundMessage: 'No support ticket found in selected filter',
          filteredSupportTickets: filterSupportTickets
        });
      }
      }>
        <span className="gx-link">
          <span className='ml-16 text-capitalize'>{category.title}</span>
        </span>
      </li>
    );
  };

  getPriorities = () => {

    return priorities.map((priority, index) =>
      <li key={index} onClick={() => {

        const filterSupportTickets = this.state.supportTickets.filter(supportTickets => {
          if (priority.title === 'all') {
            return true;
          } else if (priority.title === supportTickets.priority) {
            return supportTickets
          }
        });
        this.setState({
          noContentFoundMessage: 'No support ticket found in selected filter',
          filteredSupportTickets: filterSupportTickets
        });
      }
      }>
        <span className="gx-link">
          <span className='ml-16 text-capitalize'>{priority.title}</span>
        </span>
      </li>
    );
  };

  handleRequestClose = () => {
    this.setState({
      composeMail: false,
      showMessage: false,
    });
  };

  getStatuses = () => {
    return statuses.map((status, index) =>
      <li key={index} onClick={() => {
        let filterSupportTickets = [];
        filterSupportTickets = this.state.supportTickets.filter(supportTickets => {

          if (status.title === 'all') {
            return true;
          } else if (status.title === supportTickets.status) {
            return supportTickets
          }
        });

        this.setState({
          noContentFoundMessage: 'No support ticket found in selected filter',
          filteredSupportTickets: filterSupportTickets
        });
      }
      }>
        <span className="gx-link">
          <span className='ml-16 text-capitalize'>{status.title}</span>
        </span>
      </li>
    )
  };

  searchTicket = (searchText) => {
    if (searchText === '') {
      this.setState({ filteredSupportTickets: this.state.supportTickets });
    } else {
      const searchMails = this.state.supportTickets.filter((mail) =>
        mail.subject.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      this.setState({
        filteredSupportTickets: searchMails
      });
    }
  };

  displayMail = (currentMail, folderMails, noContentFoundMessage) => {

    return (<div className="gx-module-box-column">
      {currentMail === null ?
        this.state.filteredSupportTickets.length === 0 ?
          <div className="gx-no-content-found gx-text-light gx-d-flex gx-align-items-center gx-justify-content-center">
            {noContentFoundMessage}
          </div>
          :
          <MailList
            supportTickets={this.state.filteredSupportTickets}
            onMailSelect={this.onMailSelect.bind(this)}
            onMailChecked={this.onMailChecked.bind(this)}
            user={this.props.user}
          />
        :
        <MailDetail
          user={this.props.user}
          supportTicket={currentMail}
          supportTicketReply={this.props.supportTicketReply}
          onCloseTicket={this.onCloseTicket.bind(this)}
          closeSupportTicketStatus={this.props.closeSupportTicketStatus}
          supportTicketReplies={this.state.supportTicketReplies}
        />}
    </div>)
  };

  getMailActions = () => {
    return <div className="gx-flex-row gx-align-items-center">

      <span onClick={this.onDeleteMail.bind(this)}>
        <i className="icon icon-trash gx-icon-btn" /></span>

    </div>
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTicket: '',
      noContentFoundMessage: 'No support ticket found',
      alertMessage: '',
      dealerList: [],
      showMessage: false,
      drawerState: false,
      optionName: 'None',
      anchorEl: null,
      allMail: mails,
      currentMail: null,
      selectedMails: [],
      selectedFolder: 0,
      composeMail: false,
      folderMails: mails.filter(mail => mail.folder === 0),
      filteredSupportTickets: [],
      supportTickets: [],
      supportTicketReplies: [],
    }
  }

  updateState = (obj) => {
    this.setState( obj );
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


  onMailChecked(data) {
    let selectedMail = this.state.selectedMails;

    if (selectedMail.includes(data._id)) {
      selectedMail = selectedMail.filter(selectedMail => selectedMail != data._id);
    } else {
      selectedMail.push(data._id)
    }

    this.setState({
      selectedMails: [...selectedMail]
    });
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
      selectedMails: []
    });
    this.props.setCurrentTicket(mail._id);
  }

  addLabel(mail, label) {
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: { ...mail, labels: mail.labels.concat(label) }
      })
    }
    return mail.labels.concat(label)
  }

  updateSearch(evt) {
    this.setState({
      searchTicket: evt.target.value,
    });
    this.searchTicket(evt.target.value)
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState
    });
  }

  createSupportTicketsTableData(tickets){
    return tickets.map(item => {

      let data = {
        ticketId: item.ticketId,
        name: { name: `${item.user.dealer_name} (${item.user.link_code})`, ticket: item},
        subject: item.subject,
        status: item.status,
        type: item.category,
        priority: item.priority,
        time: getDateFromTimestamp(item.createdAt),
        _id: item._id
      };
      return data;
    });
  }

  supportTableColumns(){
    return [{
      title: 'Ticket Id',
      dataIndex: 'ticketId',
      align: 'center',
      className: 'row'
      // ,render: (text, record, index) => ++index,
    },{
      title: 'Name',
      align: "center",
      dataIndex: 'name',
      sorter: (a, b) => { return a.name.localeCompare(b.name) },
      sortDirections: ['ascend', 'descend'],
      render: (item) => { return <a href="javascript:void(0);" onClick={() => this.onMailSelect(item.ticket)}>{item.name}</a>; }
    },{
      title: 'Subject',
      align: "center",
      dataIndex: 'subject',
      key: 'link_code',
      sorter: (a, b) => { return a.link_code - b.link_code },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Status',
      align: "center",
      dataIndex: 'status',
      key: 'link_code',
      sorter: (a, b) => { return a.link_code - b.link_code },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Type',
      align: "center",
      dataIndex: 'type',
      key: 'link_code',
      sorter: (a, b) => { return a.link_code - b.link_code },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Priority',
      align: "center",
      dataIndex: 'priority',
      key: 'link_code',
      sorter: (a, b) => { return a.link_code - b.link_code },
      sortDirections: ['ascend', 'descend'],

    },{
      title: 'Time',
      align: "center",
      dataIndex: 'time',
      key: 'link_code',
      sorter: (a, b) => { return a.link_code - b.link_code },
      sortDirections: ['ascend', 'descend'],

    }];
  }

  renderTickets(filteredSupportTickets){
    const { currentMail } = this.state;
    return currentMail === null ? (<Table
      className="gx-table-responsive"
      size="midddle"
      bordered
      columns={this.supportTableColumns()}
      dataSource={this.createSupportTicketsTableData(filteredSupportTickets)}
      pagination={false}
      scroll={{ x: true }}
      rowKey="key"
    />) : <MailDetail
      user={this.props.user}
      supportTicket={currentMail}
      supportTicketReply={this.props.supportTicketReply}
      onCloseTicket={this.onCloseTicket.bind(this)}
      closeSupportTicketStatus={this.props.closeSupportTicketStatus}
      supportTicketReplies={this.state.supportTicketReplies}
      updateState={this.updateState.bind(this)}
      resetCurrentTicket={this.props.resetCurrentTicket}
    />;
  }

  render() {
    const { selectedMails, currentMail, drawerState, folderMails, composeMail, alertMessage, showMessage, noContentFoundMessage, filteredSupportTickets } = this.state;
    console.log(currentMail);
    return (
      <div>
        {this.renderTickets(filteredSupportTickets)}
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
