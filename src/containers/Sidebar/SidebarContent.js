import React, { Component } from "react";
import { Menu, Icon, Badge, Modal, Popover, Avatar } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import SidebarLogo from "./SidebarLogo";

// import LogoutIcon from "./logout.svg";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";

// import AppsNavigation from "./AppsNavigation";

import NewDevice from '../../components/NewDevices';
import CreditsModal from '../../components/CreditsModal';

import { getNewDevicesList } from "../../appRedux/actions/Common";
import {
  getNewCashRequests,
  getUserCredit,
  rejectRequest,
  acceptRequest
} from "../../appRedux/actions/SideBar";

import { transferDeviceProfile } from "../../appRedux/actions/ConnectDevice";

import { convertToLang } from '../../routes/utils/commonUtils';

import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";

import {
  Sidebar_dealers,
  Sidebar_sdealers,
  Sidebar_app,
  Sidebar_account,
  Sidebar_settings,
  Sidebar_logout,
  Alert_Change_Language,
  ARE_YOU_SURE_YOU_WANT_TO_LOGOUT,
  Sidebar_users_devices,
  Sidebar_clients,
} from '../../constants/SidebarConstants'


import { logout } from "appRedux/actions/Auth";

import { rejectDevice, addDevice, getDevicesList } from '../../appRedux/actions/Devices';

import { switchLanguage, getLanguage, getAll_Languages, toggleCollapsedSideNav } from "../../appRedux/actions/Setting";

import { ADMIN, DEALER, SDEALER, AUTO_UPDATE_ADMIN } from "../../constants/Constants";
import { Button_Yes, Button_No } from "../../constants/ButtonConstants";

let status = true;
class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: [],
      clicked: false,
    }
  }

  handleClickChange = visible => {
    this.setState({ clicked: visible });
  }

  languageMenu = () => (
    <ul className="gx-sub-popover">
      {this.state.languageData.map(language =>
        <li className={`gx-media gx-pointer ${(language.id == this.props.lng_id) ? "noClick" : ""}`} key={JSON.stringify(language)} onClick={(e) => this.changeLng(language)}>
          <i className={`flag flag-24 gx-mr-2 flag-${language.icon}`} />
          <span className="gx-language-text">{language.name}</span>
        </li>
      )}
    </ul>
  );

  getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  showNotification = () => {
    if (this.props.authUser.type !== ADMIN) {
      this.props.getNewCashRequests();
      this.props.getNewDevicesList()
      this.props.getUserCredit()
      this.refs.new_device.showModal();
      // this.props.getDevicesList();
    }

    // alert('its working');
  }
  showCreditsModal = () => {
    if (this.props.authUser.type !== ADMIN) {
      this.props.getUserCredit()
      this.refs.credits_modal.showModal();
    }

    // alert('its working');
  }

  componentDidMount() {
    this.props.getLanguage();
    this.props.getAll_Languages();
    this.setState({
      languageData: this.props.languageData
    })



    // console.log('get new device', this.props.getNewDevicesList())
    this.props.getNewDevicesList();
    this.props.getNewCashRequests();
    this.props.getUserCredit();
    if (this.props.allDevices.length === 0) {
      this.props.getDevicesList();
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      languageData: nextProps.languageData
    })

    // console.log("this.props.pathname", this.props.pathname, "nextProps.pathname ", nextProps.pathname)
    if (this.props.pathname !== nextProps.pathname) {
      this.props.getNewDevicesList();
      this.props.getNewCashRequests();
      this.props.getUserCredit()
    }

    if (this.props.isSwitched !== nextProps.isSwitched) {
      this.props.getLanguage();
    }
  }

  logout = () => {
    let _this = this;
    Modal.confirm({
      title: convertToLang(this.props.translation[ARE_YOU_SURE_YOU_WANT_TO_LOGOUT], "Are you sure you want to logout?"),
      okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
      cancelText: convertToLang(this.props.translation[Button_No], "No"),

      onOk() {
        _this.props.logout()
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  changeLng = (language) => {
    let _this = this;

    this.setState({ clicked: false });

    Modal.confirm({
      title: convertToLang(this.props.translation[Alert_Change_Language], "Are you sure you want to change the language?"),
      okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
      cancelText: convertToLang(this.props.translation[Button_No], "No"),

      onOk() {
        _this.props.switchLanguage(language)
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
  }

  transferDeviceProfile = (obj) => {
    // console.log('at req transferDeviceProfile', obj)
    let _this = this;
    Modal.confirm({
      content: `Are you sure you want to Transfer, from ${obj.flagged_device.device_id} to ${obj.reqDevice.device_id} ?`, //convertToLang(_this.props.translation[ARE_YOU_SURE_YOU_WANT_TRANSFER_THE_DEVICE], "Are You Sure, You want to Transfer this Device"),
      onOk() {
        // console.log('OK');
        _this.props.transferDeviceProfile(obj);
      },
      onCancel() { },
      okText: convertToLang(this.props.translation[Button_Yes], 'Yes'),
      cancelText: convertToLang(this.props.translation[Button_No], 'No'),
    });
  }

  render() {
    // console.log(addDevice)
    const { themeType, navStyle, pathname, authUser, translation } = this.props;

    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    // console.log(this.props.user_credit);
    return (
      <Auxiliary>
        <SidebarLogo />
        <div className="gx-sidebar-content ">
          <div className={`gx-sidebar-notifications text-center ${this.getNoHeaderClass(navStyle)} `}>
            <UserProfile />
            <CreditsModal
              ref='credits_modal'
              translation={this.props.translation}
              user_credit={this.props.user_credit}
              due_credit={this.props.due_credit}
            />
            <NewDevice
              ref='new_device'
              devices={this.props.devices}
              addDevice={this.props.addDevice}
              rejectDevice={this.props.rejectDevice}
              authUser={this.props.authUser}
              requests={this.props.requests}
              acceptRequest={this.props.acceptRequest}
              rejectRequest={this.props.rejectRequest}
              translation={this.props.translation}
              allDevices={this.props.allDevices}
              transferDeviceProfile={this.transferDeviceProfile}
            />
            <span className="font_14">
              {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? 'PIN :' : null}
              {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? (localStorage.getItem('dealer_pin') === '' || localStorage.getItem('dealer_pin') === null || localStorage.getItem('dealer_pin') === undefined) ? null : localStorage.getItem('dealer_pin') : null}
            </span>
            <ul className="gx-app-nav mt-12" style={{ justifyContent: "center" }}>

              {/* Price */}
              <li>
                <a className="head-example">
                  <Badge className="cred_badge" count={this.props.user_credit} overflowCount={99999}>
                    <i className="icon icon-dollar notification_icn" onClick={() => this.showCreditsModal()} >
                      <Icon type="dollar" className="mb-10" />
                    </i>
                  </Badge>
                </a>
              </li>
              {/* {/* Chat Icon */}
              <li>
                <i className="icon icon-chat-new" />
              </li>

              {/* Notifications */}
              <li>
                <a className="head-example">
                  <Badge count={(localStorage.getItem('type') !== ADMIN) ? this.props.devices.length + this.props.requests.length : null}>
                    <i className="icon icon-notification notification_icn" onClick={() => this.showNotification()} />
                  </Badge>
                </a>
              </li>

              {/* Language Dropdown */}
              <li>
                <Popover
                  overlayClassName="gx-popover-horizantal lang_icon"
                  placement="bottomRight"
                  content={this.languageMenu()}
                  trigger="click"
                  visible={this.state.clicked}
                  onVisibleChange={this.handleClickChange}
                >
                  <i className="icon icon-global" >
                    <Icon type="global" className="mb-10" />
                  </i>
                </Popover>
              </li>
            </ul>
          </div>
          {(authUser.type === AUTO_UPDATE_ADMIN)
            ?
            <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
              <Menu.Item key="app">
                <Link to="/apk-list/autoupdate"><i className="icon icon-apps" />
                  {/* <IntlMessages id="sidebar.app" /> */}
                  {convertToLang(translation[Sidebar_app], "App")}
                </Link>
              </Menu.Item>
              <Menu.Item key="logout" onClick={(e) => {
                // this.props.logout() 
                this.logout()
              }}>
                {/* <Link to="/logout"> */}
                <i className="icon">
                  <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                </i>
                {convertToLang(translation[Sidebar_logout], "Logout")}
                {/* </Link> */}
              </Menu.Item>
            </Menu>
            :
            <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
              <Menu.Item key="dashboard">
                <Link to="/dashboard">
                  <i className="icon icon-dasbhoard" >
                    <i className="fa fa-dasbhoard" aria-hidden="true"></i>
                  </i>
                  {/* <IntlMessages id="sidebar.devices" /> */}
                  {convertToLang(translation[''], "Dashboard")}
                </Link>
              </Menu.Item>
              <Menu.Item key="devices">
                <Link to="/devices">
                  <i className="icon icon-mobile" >
                    <i className="fa fa-mobile" aria-hidden="true"></i>
                  </i>
                  {/* <IntlMessages id="sidebar.devices" /> */}
                  {convertToLang(translation[Sidebar_users_devices], "Users & Devices")}
                </Link>
              </Menu.Item>
              <Menu.Item key="users">
                <Link to="/users">
                  <i className="icon icon-user" />
                  {/* <IntlMessages id="sidebar.users" /> */}
                  {convertToLang(translation[Sidebar_clients], "Clients")}
                </Link>
              </Menu.Item>
              {(authUser.type === ADMIN) ? <Menu.Item key="dealer/dealer">
                <Link to="/dealer/dealer"><i className="icon icon-avatar" />
                  {/* <IntlMessages id="sidebar.dealers" /> */}
                  {convertToLang(translation[Sidebar_dealers], "Dealers")}
                </Link>
              </Menu.Item> : null}

              {(authUser.type === ADMIN || authUser.type === DEALER) ? <Menu.Item key="dealer/sdealer">
                <Link to="/dealer/sdealer"><i className="icon icon-avatar" />
                  {/* <IntlMessages id="sidebar.sdealers" /> */}
                  {convertToLang(translation[Sidebar_sdealers], "S-dealers")}
                </Link>
              </Menu.Item> : null}

              {(authUser.type === "admin" || authUser.type === "dealer") ? <Menu.Item key="app">
                <Link to="/app"><i className="icon icon-apps" />
                  {/* <IntlMessages id="sidebar.app" /> */}
                  {convertToLang(translation[Sidebar_app], "App")}
                </Link>
              </Menu.Item> : null}
              <Menu.Item key="account">
                <Link to="/account"><i className="icon icon-profile2" />
                  {/* <IntlMessages id="sidebar.account" /> */}
                  {convertToLang(translation[Sidebar_account], "Account")}
                </Link>
              </Menu.Item>


              <Menu.Item key="settings">
                <Link to="/settings"><i className="icon icon-setting" />
                  {/* <IntlMessages id="sidebar.settings" /> */}
                  {convertToLang(translation[Sidebar_settings], "Settings")}
                </Link>
              </Menu.Item>

              <Menu.Item key="logout" onClick={(e) => {
                this.logout()
              }}>
                <i className="icon">
                  <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                </i>
                {convertToLang(translation[Sidebar_logout], "Logout")}
              </Menu.Item>
            </Menu>
          }
          {/* </CustomScrollbars> */}
        </div>
      </Auxiliary >
    );
  }
}

// SidebarContent.propTypes = {};

const mapStateToProps = ({ settings, devices, sidebar }) => {
  const { navStyle, themeType, locale, pathname, languages, translation, isSwitched } = settings;

  // console.log('lng id is: ', translation["lng_id"])
  // console.log('test: =====================================================>  ' , devices.devices)
  return {
    navStyle,
    themeType,
    locale,
    pathname,
    allDevices: devices.devices,
    devices: devices.newDevices,
    requests: sidebar.newRequests,
    user_credit: sidebar.user_credit,
    due_credit: sidebar.due_credit,
    languageData: languages,
    translation: translation,
    lng_id: translation["lng_id"],
    isSwitched: isSwitched
  }
};
export default connect(mapStateToProps, { getDevicesList, rejectDevice, addDevice, logout, getNewDevicesList, toggleCollapsedSideNav, switchLanguage, getLanguage, getAll_Languages, getNewCashRequests, getUserCredit, acceptRequest, rejectRequest, transferDeviceProfile })(SidebarContent);

