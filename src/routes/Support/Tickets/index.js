import React, { PureComponent } from "react";
import { Button, Checkbox, Drawer, Dropdown, Menu, message, Modal, Col, Row } from "antd";
import CustomScrollbars from "util/CustomScrollbars";

import mails from "./data/mails";
import categories from "./data/categories";
import statuses from "./data/statuses";
import priorities from "./data/priorities";
import MailList from "./components/MailList";
import ComposeMail from "./components/Compose/index";
import AppModuleHeader from "./components/AppModuleHeader/index";
import MailDetail from "./components/TicketDetail/index";
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

const confirm = Modal.confirm;

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

  constructor() {
    super();
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
    console.log(data);
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

  render() {
    const { selectedMails, currentMail, drawerState, folderMails, composeMail, alertMessage, showMessage, noContentFoundMessage } = this.state;
    return (
      <div>
        <div className="gx-main-content">
          <div className="gx-app-module m-0">

            <div className="gx-d-block gx-d-lg-none">
              <Drawer
                placement="left"
                closable={false}
                visible={drawerState}
                onClose={this.onToggleDrawer.bind(this)}>
                {this.SupportTicketSideBar()}
              </Drawer>

            </div>
            <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">
              {this.SupportTicketSideBar()}
            </div>

            <div className="gx-module-box">
              <div className="gx-module-box-header">
                <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
                  <i className="icon icon-menu gx-icon-btn" aria-label="Menu"
                    onClick={this.onToggleDrawer.bind(this)} />
                </span>
                <AppModuleHeader placeholder="Search tickets"
                  onChange={this.updateSearch.bind(this)}
                  value={this.state.searchTicket} />

              </div>

              <div className="gx-module-box-content">
                <div className="gx-module-box-topbar">
                  {this.state.currentMail === null ? '' :
                    <i className="icon icon-arrow-left gx-icon-btn" onClick={() => {
                      this.setState({ currentMail: null })
                      this.props.resetCurrentTicket();
                    }} />
                  }

                  <div classID="toolbar-separator" />
                  {this.state.currentMail === null ? (
                    <Row className="width_100">
                      <div className="gx-module-list-content">
                        <div className="gx-mail-user-des">
                          <Col span="2">
                            {(selectedMails.length > 0) && this.getMailActions()}
                          </Col>
                          <Col span="4">
                            <h4>Name</h4>
                          </Col>
                          <Col span="9">
                            <h4>Subject</h4>
                          </Col>
                          <Col span="2">
                            <h4>Status</h4>
                          </Col>
                          <Col span="2">
                            <h4>Type</h4>
                          </Col>
                          <Col span="2">
                            <h4>Priority</h4>
                          </Col>
                          <Col span="3">
                            <h4>Time</h4>
                          </Col>
                        </div>
                      </div>
                    </Row>
                  ) : '' }
                </div>

                {this.displayMail(currentMail, folderMails, noContentFoundMessage)}

                <ComposeMail
                  open={composeMail}
                  user={this.props.user}
                  generateSupportTicket={this.props.generateSupportTicket}
                  onClose={this.handleRequestClose.bind(this)}
                />

              </div>
            </div>
          </div>
          {showMessage && message.info(<span id="message-id">{alertMessage}</span>, 3, this.handleRequestClose)}
        </div>
      </div>

    )
  }
}


var mapStateToProps = ({ auth, SupportTickets, dealers }) => {

  return {
    user: auth.authUser,
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

export default connect(mapStateToProps, mapDispatchToProps)(Mail);
