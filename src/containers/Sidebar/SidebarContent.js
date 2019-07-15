import React, { Component } from "react";
import { Menu, Icon, Badge } from "antd";
import { Link } from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";
// import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import { connect } from "react-redux";
import { rejectDevice, addDevice, getDevicesList } from '../../appRedux/actions/Devices';

import { ADMIN, DEALER, SDEALER, AUTO_UPDATE_ADMIN } from "../../constants/Constants";

// import MenuItems from "../MenuItems";

class SidebarContent extends Component {

  constructor(props) {
    super(props);

    // console.log("userType", this.state);
  }

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


  render() {
    // console.log(addDevice)
    const { themeType, navStyle, pathname, authUser } = this.props;

    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (
      <Auxiliary>
        <SidebarLogo />
        <div className="gx-sidebar-content ">
          <div className={`gx-sidebar-notifications ${this.getNoHeaderClass(navStyle)} `}>
            <UserProfile
              // devices={this.props.devices}
              addDevice={this.props.addDevice}
              rejectDevice={this.props.rejectDevice}
            />

            <ul className="gx-app-nav mt-8">
              <li className="font_14">
                {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN)?'PIN :':null} <Link to="#">
                  {(localStorage.getItem('type') !== ADMIN && localStorage.getItem('type') !== AUTO_UPDATE_ADMIN) ? (localStorage.getItem('dealer_pin') === '' || localStorage.getItem('dealer_pin') === null || localStorage.getItem('dealer_pin') === undefined) ? null : localStorage.getItem('dealer_pin') : null}
                </Link>
              </li>
              <li></li>
              <li>
                {/* <a className="head-example">
                  <i className="icon icon-notification notification_icn" ></i>
                </a> */}
              </li>
            </ul>
          </div>
          {/* <CustomScrollbars className="gx-layout-sider-scrollbar"> */}
          {(authUser.type === AUTO_UPDATE_ADMIN)
            ?
            <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
              <Menu.Item key="app">
                <Link to="/apk-list/autoupdate"><i className="icon icon-apps" />
                  <IntlMessages id="sidebar.app" />
                </Link>
              </Menu.Item>
            </Menu>
            :

            <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
              <Menu.Item key="devices">
                <Link to="/devices">
                  <i className="icon icon-mobile" >
                    <i className="fa fa-mobile" aria-hidden="true"></i>
                  </i>
                  <IntlMessages id="sidebar.devices" /></Link>
              </Menu.Item>
              <Menu.Item key="users">
                <Link to="/users">
                  <i className="icon icon-user" />
                  <IntlMessages id="sidebar.users" /></Link>
              </Menu.Item>
              {(authUser.type === ADMIN) ? <Menu.Item key="dealer/dealer">
                <Link to="/dealer/dealer"><i className="icon icon-avatar" /> <IntlMessages id="sidebar.dealers" /></Link>
              </Menu.Item> : null}

              {(authUser.type === ADMIN || authUser.type === DEALER) ? <Menu.Item key="dealer/sdealer">
                <Link to="/dealer/sdealer"><i className="icon icon-avatar" /> <IntlMessages id="sidebar.sdealers" /></Link>
              </Menu.Item> : null}

              {(authUser.type === "admin" || authUser.type === "dealer") ? <Menu.Item key="app">
                <Link to="/app"><i className="icon icon-apps" /> <IntlMessages id="sidebar.app" /></Link>
              </Menu.Item> : null}
              {(authUser.type === ADMIN) ? <Menu.Item key="account">
                <Link to="/account"><i className="icon icon-profile2" /> <IntlMessages id="sidebar.account" /></Link>
              </Menu.Item> : null}
              {/* {(authUser.type === "admin") ? <Menu.Item key="policy">
              <Link to="/policy"><Icon type="file-protect" className="icon" /> <IntlMessages id="sidebar.policy" /></Link>
            </Menu.Item> : null} */}

              {/* {(authUser.type === "admin") ? <Menu.Item key="apk-list">
              <Link to="/app"><i className="icon icon-apps" /> <IntlMessages id="sidebar.app" /></Link>
            </Menu.Item> : null} */}

              <Menu.Item key="profile">
                <Link to="/profile"><i className="icon icon-contacts" /> <IntlMessages id="sidebar.profile" /></Link>
              </Menu.Item>
            </Menu>
          }
          {/* </CustomScrollbars> */}
        </div>
      </Auxiliary>
    );
  }
}

SidebarContent.propTypes = {};
const mapStateToProps = ({ settings, devices, device3 }) => {
  const { navStyle, themeType, locale, pathname } = settings;
  let deviceList = [];
  //  console.log("testing testing",devices);
  //  console.log("testing 2testing",settings);
  devices.devices.map(device => {
    if ((device.device_status === 0 || device.device_status === '0') && (device.unlink_status === 0 || device.unlink_status === '0')) {
      deviceList.push(device);
    }
  });
  // console.log("sidebar", deviceList.length);
  return { navStyle, themeType, locale, pathname, devices: deviceList }
};
export default connect(mapStateToProps, { rejectDevice, addDevice, getDevicesList })(SidebarContent);

