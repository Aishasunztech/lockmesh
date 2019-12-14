import React, {PureComponent} from "react";
import {Button, Checkbox, Drawer, Dropdown, Menu, message} from "antd";
import CustomScrollbars from "util/CustomScrollbars";

import mails from "./data/mails";
import categories from "./data/categories";
import statuses from "./data/statuses";
import priorities from "./data/priorities";
import MailList from "./components/MailList";
import ComposeMail from "./components/Compose/index";
import AppModuleHeader from "./components/AppModuleHeader/index";
import MailDetail from "./components/MailDetail/index";
import Auxiliary from "./util/Auxiliary";
import {convertToLang} from "../../utils/commonUtils";


class Mail extends PureComponent {

  MailSideBar = () => {
    return <div className="gx-module-side">

      <div className="gx-module-side-header p-25">
        <div className="gx-module-logo">
          <i className="icon icon-ticket-new gx-mr-4"/>
          Tickets
        </div>
      </div>

      <div className="gx-module-side-content">
        <CustomScrollbars className="gx-module-side-scroll">
          <div className="gx-module-add-task">
            <Button type="primary" className="gx-btn-block"
                    onClick={() => {
                      this.setState({composeMail: true})
                    }}>
              <i className="icon icon-edit gx-mr-2"/>
              Generate Ticket
            </Button>
          </div>

          <ul className="gx-module-nav">

            <li className="gx-module-nav-label">
              Statuses
            </li>

            {this.getStatuses()}

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
    const mails = this.state.allMail.map(mail =>
      mail.selected && (mail.folder === this.state.selectedFolder) ?
        {...mail, folder: 4, selected: false,} : mail
    );
    this.setState({
      alertMessage: 'Mail Deleted Successfully',
      showMessage: true,
      selectedMails: 0,
      allMail: mails,
      folderMails: mails.filter(mail => mail.folder === this.state.selectedFolder)
    });
  };

  getCategories = () => {
    return categories.map((category, index) =>
      <li key={index} onClick={() => {
        const filterMails = this.state.allMail.filter(mail => mail.folder === category.id);
        this.setState({
          selectedFolder: category.id,
          noContentFoundMessage: 'No Mail found in selected folder',
          currentMail: null,
          loader: true,
          folderMails: filterMails
        });

      }
      }>
        <span className={`${this.state.selectedFolder === category.id ? 'active gx-link' : 'gx-link'}`}>
          <span className='ml-16 text-capitalize'>{category.title}</span>
        </span>
      </li>
    )
  };


  onFolderMenuItemSelect = (e) => {
    const id = +e.key;
    const mails = this.state.allMail.map(mail =>
      mail.selected && (mail.folder === this.state.selectedFolder) ?
        {...mail, folder: id, selected: false,} : mail
    );
    this.setState({
      selectedMails: 0,
      allMail: mails,
      noContentFoundMessage: 'No Mail found in selected folder',
      alertMessage: 'Mail has been moved successfully',
      showMessage: true,
      folderMails: mails.filter(mail => mail.folder === this.state.selectedFolder)
    });
  };

  onLabelMenuItemSelect = (e) => {
    const id = +e.key;
    const mails = this.state.allMail.map(mail => {
        if (mail.selected && (mail.folder === this.state.selectedFolder)) {
          if (mail.labels.includes(id)) {
            return {...mail, labels: this.removeLabel(mail, id)};
          } else {
            return {...mail, labels: this.addLabel(mail, id)};
          }
        } else {
          return mail;
        }
      }
    );
    this.setState({
      noContentFoundMessage: 'No Mail found in selected label',
      alertMessage: 'Label Updated Successfully',
      showMessage: true,
      allMail: mails,
      folderMails: mails.filter(mail => mail.folder === this.state.selectedFolder)
    });
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
        const filterMails = this.state.allMail.filter(mail => {
          if (status.id === 0 && mail.starred && mail.folder === this.state.selectedFolder) {
            return mail
          } else if (status.id === 1 && mail.important && mail.folder === this.state.selectedFolder) {
            return mail
          }
          return null;
        });
        this.setState({
          noContentFoundMessage: 'No Mail found in selected filter',
          loader: true,
          folderMails: filterMails
        });
      }
      }>
        <span className="gx-link">
          <span className='ml-16 text-capitalize'>{status.title}</span>
        </span>
      </li>
    )
  };

  searchMail = (searchText) => {
    if (searchText === '') {
      this.setState({folderMails: this.state.allMail.filter((mail) => !mail.deleted)});
    } else {
      const searchMails = this.state.allMail.filter((mail) =>
        !mail.deleted && mail.subject.toLowerCase().indexOf(searchText.toLowerCase()) > -1);
      this.setState({
        folderMails: searchMails
      });
    }
  };

  displayMail = (currentMail, folderMails, noContentFoundMessage) => {
    return (<div className="gx-module-box-column">
      {currentMail === null ?
        folderMails.length === 0 ?
          <div className="gx-no-content-found gx-text-light gx-d-flex gx-align-items-center gx-justify-content-center">
            {noContentFoundMessage}
          </div>
          :
          <MailList mails={folderMails}
                    onMailSelect={this.onMailSelect.bind(this)}
                    onMailChecked={this.onMailChecked.bind(this)}/>
        :
        <MailDetail mail={currentMail} onImportantSelect={this.onImportantSelect.bind(this)}/>}
    </div>)
  };

  getMailActions = () => {
    return <div className="gx-flex-row gx-align-items-center">

      <Dropdown overlay={this.folderMenu()} placement="bottomRight" trigger={['click']}>
        <i className="icon icon-folder gx-icon-btn"/>
      </Dropdown>

      <Dropdown overlay={this.labelMenu()} placement="bottomRight" trigger={['click']}>
        <i className="icon icon-tag gx-icon-btn"/>
      </Dropdown>

      <span onClick={this.onDeleteMail.bind(this)}>
        <i className="icon icon-trash gx-icon-btn"/></span>

    </div>
  };

  folderMenu = () => (
    <Menu id="folder-menu"
          onClick={this.onFolderMenuItemSelect.bind(this)}>
      {categories.map(folder =>
        <Menu.Item key={folder.id}>
          {folder.title}
        </Menu.Item>,
      )}
    </Menu>);

  labelMenu = () => (
    <Menu id="label-menu"
          onClick={this.onLabelMenuItemSelect.bind(this)}>
      {priorities.map(label =>
        <Menu.Item key={label.id}>
          {label.title}
        </Menu.Item>,
      )}
    </Menu>
  );


  constructor() {
    super();
    this.state = {
      searchMail: '',
      noContentFoundMessage: 'No Mail found in selected folder',
      alertMessage: '',
      showMessage: false,
      drawerState: false,
      optionName: 'None',
      anchorEl: null,
      allMail: mails,
      loader: true,
      currentMail: null,
      user: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
      },
      selectedMails: 0,
      selectedFolder: 0,
      composeMail: false,
      folderMails: mails.filter(mail => mail.folder === 0)
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({loader: false});
    }, 1500);
  }


  onMailChecked(data) {
    data.selected = !data.selected;
    let selectedMail = 0;
    const mails = this.state.folderMails.map(mail => {
        if (mail.selected) {
          selectedMail++;
        }
        if (mail.id === data.id) {
          if (mail.selected) {
            selectedMail++;
          }
          return data;
        } else {
          return mail;
        }
      }
    );
    this.setState({
      selectedMails: selectedMail,
      folderMails: mails
    });
  }

  onAllMailSelect() {
    const selectAll = this.state.selectedMails <= this.state.folderMails.length;
    if (selectAll) {
      this.getAllMail();
    } else {
      this.getUnselectedAllMail();
    }
  }

  removeLabel(mail, label) {
    mail.labels.splice(mail.labels.indexOf(label), 1);
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: {...mail, labels: mail.labels}
      })
    }
    return mail.labels;
  }

  onImportantSelect(data) {
    data.important = !data.important;
    this.setState({
      alertMessage: data.important ? 'Mail Mark as Important' : 'Mail Remove as Important',
      showMessage: true,
      folderMails: this.state.folderMails.map(mail =>
        mail.id === data.id ?
          data : mail
      )
    });
  }

  onMailSend(data) {
    this.setState(
      {
        alertMessage: 'Mail Sent Successfully',
        showMessage: true,
        folderMails: this.state.allMail.concat(data),
        allMail: this.state.allMail.concat(data)
      }
    );
  }

  onMailSelect(mail) {
    this.setState({
      currentMail: mail,
    });
  }

  addLabel(mail, label) {
    if (this.state.currentMail !== null && mail.id === this.state.currentMail.id) {
      this.setState({
        currentMail: {...mail, labels: mail.labels.concat(label)}
      })
    }
    return mail.labels.concat(label)
  }

  updateSearch(evt) {
    this.setState({
      searchMail: evt.target.value,
    });
    this.searchMail(evt.target.value)
  }

  onToggleDrawer() {
    this.setState({
      drawerState: !this.state.drawerState
    });
  }

  render() {
    const {selectedMails, loader, currentMail, drawerState, folderMails, composeMail, user, alertMessage, showMessage, noContentFoundMessage} = this.state;
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
                {this.MailSideBar()}
              </Drawer>

            </div>
            <div className="gx-module-sidenav gx-d-none gx-d-lg-flex">
              {this.MailSideBar()}
            </div>

            <div className="gx-module-box">
              <div className="gx-module-box-header">
              <span className="gx-drawer-btn gx-d-flex gx-d-lg-none">
                  <i className="icon icon-menu gx-icon-btn" aria-label="Menu"
                     onClick={this.onToggleDrawer.bind(this)}/>
              </span>
                <AppModuleHeader placeholder="Search mails" user={this.state.user}
                                 onChange={this.updateSearch.bind(this)}
                                 value={this.state.searchMail}/>

              </div>

              <div className="gx-module-box-content">
                <div className="gx-module-box-topbar">
                  {this.state.currentMail === null ?
                    <div className="gx-flex-row gx-align-items-center">
                      {this.state.folderMails.length > 0 ?
                        <Auxiliary>
                          <Checkbox color="primary" className="gx-icon-btn"
                                    indeterminate={selectedMails > 0 && selectedMails < folderMails.length}
                                    checked={selectedMails > 0}
                                    onChange={this.onAllMailSelect.bind(this)}
                                    value="SelectMail"/>
                        </Auxiliary>
                        : null}
                    </div>
                    :
                    <i className="icon icon-arrow-left gx-icon-btn" onClick={() => {
                      this.setState({currentMail: null})
                    }}/>
                  }

                  <div classID="toolbar-separator"/>

                  {(selectedMails > 0) && this.getMailActions()}

                </div>

                {loader ?
                  <div className="gx-loader-view">
                  </div>
                  : this.displayMail(currentMail, folderMails, noContentFoundMessage)}

                <ComposeMail open={composeMail} user={user}
                             onClose={this.handleRequestClose.bind(this)}
                             onMailSend={this.onMailSend.bind(this)}/>

              </div>
            </div>
          </div>
          {showMessage && message.info(<span id="message-id">{alertMessage}</span>, 3, this.handleRequestClose)}
        </div>
      </div>

    )
  }
}

export default Mail;
