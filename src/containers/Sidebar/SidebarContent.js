import React, { Component } from "react";
import { Menu } from "antd";
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
// import MenuItems from "../MenuItems";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class SidebarContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userType: localStorage.getItem("type")
    }
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
    const { themeType, navStyle, pathname } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (
      <Auxiliary>
        <SidebarLogo />
        <div className="gx-sidebar-content ">
          <div className={`gx-sidebar-notifications ${this.getNoHeaderClass(navStyle)} `}>
            <UserProfile />
            {/* <AppsNavigation/> */}
          </div>
          <CustomScrollbars className="gx-layout-sider-scrollbar">
            <Menu defaultOpenKeys={[defaultOpenKeys]} selectedKeys={[selectedKeys]} theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'} mode="inline">
              <Menu.Item key="devices">
                <Link to="/devices"><i className="icon icon-widgets" /> <IntlMessages id="sidebar.devices" /></Link>
              </Menu.Item>

              {(this.state.userType === "admin") ? <Menu.Item key="account">
                <Link to="/account"><i className="icon icon-profile2" /> <IntlMessages id="sidebar.account" /></Link>
              </Menu.Item> : null}

              {(this.state.userType === "admin") ? <Menu.Item key="dealer/dealer">
                <Link to="/dealer/dealer"><i className="icon icon-avatar" /> <IntlMessages id="sidebar.dealers" /></Link>
              </Menu.Item> : null}

              {(this.state.userType === "admin" || this.state.userType === "dealer") ? <Menu.Item key="dealer/sdealer">
                <Link to="/dealer/sdealer"><i className="icon icon-avatar" /> <IntlMessages id="sidebar.sdealers" /></Link>
              </Menu.Item> : null}

              {(this.state.userType === "admin") ? <Menu.Item key="apk-list">
                <Link to="/apk-list"><i className="icon icon-apps" /> <IntlMessages id="sidebar.app" /></Link>
              </Menu.Item> : null}
              
              <Menu.Item key="profile">
                <Link to="/profile"><i className="icon icon-contacts" /> <IntlMessages id="sidebar.profile" /></Link>
              </Menu.Item>
            </Menu>
          </CustomScrollbars>
        </div>
      </Auxiliary>
    );
  }
}

SidebarContent.propTypes = {};
const mapStateToProps = ({ settings }) => {
  const { navStyle, themeType, locale, pathname } = settings;
  return { navStyle, themeType, locale, pathname }
};
export default connect(mapStateToProps)(SidebarContent);

