import React, { Component } from "react";
import { Menu, Icon, Badge, Modal, Popover } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";


import SidebarLogo from "./SidebarLogo";

// import LogoutIcon from "./logout.svg";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";

// import AppsNavigation from "./AppsNavigation";

import NewDevice from '../../components/NewDevices';

import { getNewDevicesList } from "../../appRedux/actions/Common";
import {
  getNewCashRequests,
  getUserCredit,
  rejectRequest,
  acceptRequest
} from "../../appRedux/actions/SideBar";

import { convertToLang } from '../../routes/utils/commonUtils';

import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";

import {
  Sidebar_main,
  Sidebar_devices,
  Sidebar_users,
  Sidebar_dealers,
  Sidebar_policy,
  Sidebar_sdealers,
  Sidebar_app,
  Sidebar_account,
  Sidebar_settings,
  Sidebar_logout,
} from '../../constants/SidebarConstants'

// import languageData from "./languageData";

import { logout } from "appRedux/actions/Auth";

import { rejectDevice, addDevice } from '../../appRedux/actions/Devices';

import { switchLanguage, toggleCollapsedSideNav } from "../../appRedux/actions/Setting";

import { ADMIN, DEALER, SDEALER, AUTO_UPDATE_ADMIN } from "../../constants/Constants";
import { Button_Yes, Button_No } from "../../constants/ButtonConstants";


class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languageData: []
    }
  }

  languageMenu = () => (
    <ul className="gx-sub-popover">
      {this.state.languageData.map(language =>
        <li className="gx-media gx-pointer" key={JSON.stringify(language)} onClick={(e) =>
          // this.props.switchLanguage(language)
          this.changeLng(language)
        }>
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
    this.props.getNewCashRequests();
    this.props.getNewDevicesList()
    this.props.getUserCredit()
    this.refs.new_device.showModal();

    // alert('its working');
  }

  componentDidMount() {
    // console.log(this.props.languageData)
    this.setState({
      languageData: this.props.languageData
    })

    // console.log('get new device', this.props.getNewDevicesList())
    this.props.getNewDevicesList();
    this.props.getNewCashRequests();
    this.props.getUserCredit()

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      languageData: nextProps.languageData
    })

    if (this.props.pathname !== nextProps.pathname) {
      this.props.getNewDevicesList();
      this.props.getNewCashRequests();
      this.props.getUserCredit()
    }
  }

  logout = () => {
    let _this = this;
    Modal.confirm({
      title: 'Are you sure you want to logout?',
      okText: convertToLang(this.props.translation[Button_Yes], Button_Yes),
      cancelText: convertToLang(this.props.translation[Button_No], Button_No),

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
    Modal.confirm({
      title: 'Are you sure you want to change the language?',
      okText: convertToLang(this.props.translation[Button_Yes], Button_Yes),
      cancelText: convertToLang(this.props.translation[Button_No], Button_No),

      onOk() {
        _this.props.switchLanguage(language)
        // console.log('OK');
      },
      onCancel() {
        // console.log('Cancel');
      },
    })
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
            <NewDevice
              ref='new_device'
              devices={this.props.devices}
              addDevice={this.props.addDevice}
              rejectDevice={this.props.rejectDevice}
              authUser={this.props.authUser}
              requests={this.props.requests}
              acceptRequest={this.props.acceptRequest}
              rejectRequest={this.props.rejectRequest}
            />
            <span className="font_14">
              {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? 'PIN :' : null}
              {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? (localStorage.getItem('dealer_pin') === '' || localStorage.getItem('dealer_pin') === null || localStorage.getItem('dealer_pin') === undefined) ? null : localStorage.getItem('dealer_pin') : null}
            </span>
            <ul className="gx-app-nav mt-12" style={{ justifyContent: "center" }}>

              {/* Price */}
              <li>
                <a className="head-example">
                  <Badge className="cred_badge" count={this.props.user_credit} overflowCount={999}>
                    <i className="icon icon-dollar notification_icn" >
                      <Icon type="dollar" className="mb-10" />
                    </i>
                  </Badge>
                </a>
              </li>
              {/* Chat Icon */}
              <li>
                <i className="icon icon-chat-new" />
              </li>

              {/* Notifications */}
              <li>
                <a className="head-example">
                  <Badge count={this.props.devices.length + this.props.requests.length}>
                    <i className="icon icon-notification notification_icn" onClick={() => this.showNotification()} />
                  </Badge>
                </a>
              </li>

              {/* Language Dropdown */}
              <li>
                <Popover overlayClassName="gx-popover-horizantal lang_icon" placement="bottomRight"
                  content={this.languageMenu()} trigger="click">
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
                  {convertToLang(translation[Sidebar_app], Sidebar_app)}
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
                {convertToLang(translation[Sidebar_logout], Sidebar_logout)}
                {/* </Link> */}
              </Menu.Item>
            </Menu>


            :

            <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
              <Menu.Item key="devices">
                <Link to="/devices">
                  <i className="icon icon-mobile" >
                    <i className="fa fa-mobile" aria-hidden="true"></i>
                  </i>
                  {/* <IntlMessages id="sidebar.devices" /> */}
                  {convertToLang(translation[Sidebar_devices], Sidebar_devices)}
                </Link>
              </Menu.Item>
              <Menu.Item key="users">
                <Link to="/users">
                  <i className="icon icon-user" />
                  {/* <IntlMessages id="sidebar.users" /> */}
                  {convertToLang(translation[Sidebar_users], Sidebar_users)}
                </Link>
              </Menu.Item>
              {(authUser.type === ADMIN) ? <Menu.Item key="dealer/dealer">
                <Link to="/dealer/dealer"><i className="icon icon-avatar" />
                  {/* <IntlMessages id="sidebar.dealers" /> */}
                  {convertToLang(translation[Sidebar_dealers], Sidebar_dealers)}
                </Link>
              </Menu.Item> : null}

              {(authUser.type === ADMIN || authUser.type === DEALER) ? <Menu.Item key="dealer/sdealer">
                <Link to="/dealer/sdealer"><i className="icon icon-avatar" />
                  {/* <IntlMessages id="sidebar.sdealers" /> */}
                  {convertToLang(translation[Sidebar_sdealers], Sidebar_sdealers)}
                </Link>
              </Menu.Item> : null}

              {(authUser.type === "admin" || authUser.type === "dealer") ? <Menu.Item key="app">
                <Link to="/app"><i className="icon icon-apps" />
                  {/* <IntlMessages id="sidebar.app" /> */}
                  {convertToLang(translation[Sidebar_app], Sidebar_app)}
                </Link>
              </Menu.Item> : null}
              {(authUser.type === ADMIN) ? <Menu.Item key="account">
                <Link to="/account"><i className="icon icon-profile2" />
                  {/* <IntlMessages id="sidebar.account" /> */}
                  {convertToLang(translation[Sidebar_account], Sidebar_account)}
                </Link>
              </Menu.Item> : null}


              <Menu.Item key="settings">
                <Link to="/settings"><i className="icon icon-setting" />
                  {/* <IntlMessages id="sidebar.settings" /> */}
                  {convertToLang(translation[Sidebar_settings], Sidebar_settings)}
                </Link>
              </Menu.Item>

              <Menu.Item key="logout" onClick={(e) => {
                this.logout()
              }}>
                <i className="icon">
                  <i className="fa fa-sign-out ml-2" aria-hidden="true"></i>
                </i>
                {convertToLang(translation[Sidebar_logout], Sidebar_logout)}
              </Menu.Item>
            </Menu>
          }
          {/* </CustomScrollbars> */}
        </div>
      </Auxiliary>
    );
  }
}

// SidebarContent.propTypes = {};

const mapStateToProps = ({ settings, devices, sidebar }) => {
  const { navStyle, themeType, locale, pathname, languages, translation } = settings;
 
  return {
    navStyle,
    themeType,
    locale,
    pathname,
    devices: devices.newDevices,
    requests: sidebar.newRequests,
    user_credit: sidebar.user_credit,
    languageData: languages,
    translation: translation
  }
};
export default connect(mapStateToProps, { rejectDevice, addDevice, logout, getNewDevicesList, toggleCollapsedSideNav, switchLanguage, getNewCashRequests, getUserCredit, acceptRequest, rejectRequest })(SidebarContent);

