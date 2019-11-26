import React, { Component } from "react";
import { connect } from "react-redux";

import { toggleCollapsedSideNav } from "../../../appRedux/actions/Setting";
import { APP_TITLE } from "../../../constants/Application";

class NoHeaderNotification extends Component {

  render() {
    const { navCollapsed } = this.props;
    return (
      <div className="gx-no-header-horizontal hidden-md">
        <div className="gx-d-block gx-d-lg-none gx-linebar gx-mr-xs-3">
          <i className="gx-icon-btn icon icon-menu"
            onClick={() => {
              this.props.toggleCollapsedSideNav(!navCollapsed);
            }}
          />
          {/* <a to="/" className="gx-site-logo">
            <p className="mb-0" style={{ fontSize: 18 }}>
              {APP_TITLE}
            </p>
          </a> */}
        </div>

      </div>
    )
  }
}

const mapStateToProps = ({ settings }) => {
  const { navCollapsed } = settings;
  return { navCollapsed }
};
export default connect(mapStateToProps, { toggleCollapsedSideNav })(NoHeaderNotification);
