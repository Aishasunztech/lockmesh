import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Clock from 'react-live-clock';
import { Tooltip, Button } from 'antd';
import moment_timezone from "moment-timezone";

import {
  onNavStyleChange,
  toggleCollapsedSideNav
} from "appRedux/actions/Setting";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import { APP_TITLE } from "../../constants/Application";
import { TZData } from '../../routes/myProfile/components/timezone_array';

class SidebarLogo extends Component {
  render() {
    // console.log("this.props");
    // console.log(this.props);

    const { width, themeType, navCollapsed } = this.props;
    let { navStyle } = this.props;
    if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
      navStyle = NAV_STYLE_DRAWER;
    }

    let tzIndex = TZData.findIndex(item => item.value == this.props.auth.timezone);
    // console.log("tzIndex ", tzIndex, TZData[tzIndex]);

    return (
      <div className="gx-layout-sider-header">
        {navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR ? (
          <div className="gx-linebar">
            <i
              className={`gx-icon-btn icon icon-${
                navStyle === NAV_STYLE_MINI_SIDEBAR
                  ? "menu-unfold"
                  : "menu-fold"
                } ${themeType !== THEME_TYPE_LITE ? "gx-text-white" : ""}`}
              onClick={() => {
                if (navStyle === NAV_STYLE_DRAWER) {
                  this.props.toggleCollapsedSideNav(!navCollapsed);
                } else if (navStyle === NAV_STYLE_FIXED) {
                  this.props.onNavStyleChange(NAV_STYLE_MINI_SIDEBAR);
                } else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
                  this.props.toggleCollapsedSideNav(!navCollapsed);
                } else {
                  this.props.onNavStyleChange(NAV_STYLE_FIXED);
                }
              }}
            />
          </div>
        ) : null}

        <a href="/" className="gx-site-logo" style={{ width: '100%' }}>
          {navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR &&
            width >= TAB_SIZE ? (
              <p className="mb-0" style={{ fontSize: 18 }}>
                {APP_TITLE}
              </p>
            ) : themeType === THEME_TYPE_LITE ? (
              <p className="mb-0" style={{ fontSize: 18 }}>
                {APP_TITLE}
              </p>
            ) : (
                <Fragment>
                  <p className="mb-0" style={{ fontSize: 18, float: 'left' }}>
                    {APP_TITLE}
                  </p>
                </Fragment>
              )}
        </a>
        <Tooltip placement="bottomRight" title={`${TZData[tzIndex] ? TZData[tzIndex].key : ""} (${this.props.auth.timezone ? this.props.auth.timezone : "Timezone not set"})`}>
          {/* <Button>Right</Button> */}

          {/* <a href="javascript:void(0)" */}
          {/* title={`${this.props.auth.timezone} ${TZData[tzIndex].key}`}> */}
          <p className="mb-0" style={{ fontSize: 18, float: 'right' }}>
            <Clock
              timezone={this.props.auth.timezone}
              format={'HH:mm:ss'}
              ticking={true}
            />
          </p>
          {/* </a> */}
        </Tooltip>
      </div>
    );
  }
}

const mapStateToProps = ({ settings, auth }) => {
  // console.log("logo file auth.authUser ", auth.authUser)
  const { navStyle, themeType, width, navCollapsed } = settings;
  return { navStyle, themeType, width, navCollapsed, auth: auth.authUser };
};

export default connect(
  mapStateToProps,
  {
    onNavStyleChange,
    toggleCollapsedSideNav
  }
)(SidebarLogo);
