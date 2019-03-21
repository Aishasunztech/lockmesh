import React, { Component } from "react";
import { connect } from "react-redux";
import { Avatar, Popover, Badge } from "antd";
import { Link } from "react-router-dom";
import { logout, } from "appRedux/actions/Auth";
import { getNewDevicesList } from "../../appRedux/actions/Common";
import NewDevice from '../../components/NewDevices';
import { Icon } from "antd";
import socketIOClient from "socket.io-client";
import { BASE_URL } from "../../constants/Application"
class UserProfile extends Component {

  showNotification = () => {
    this.refs.new_device.showModal();
    // alert('its working');
  }
  componentDidMount() {
    // console.log('get new device', this.props.getNewDevicesList())
    this.props.getNewDevicesList();
    let token = "token=" + localStorage.getItem('token') + "&isWeb=true";
    // console.log("this token", token);
    // const socket = socketIOClient(BASE_URL, { 
    //   query: token
    // });
  }
  render() {
    // console.log("header devices count", this.props.devices);

    const userMenuOptions = (
      <ul className="gx-user-popover">
        {/* <Link to="/profile"><li>My Account</li></Link> */}
        {/* <li>Connections</li> */}
        <li onClick={() => this.props.logout()}>Logout
        </li>
      </ul>
    );

    return (

      <div className="gx-flex-row gx-align-items-center gx-mb-4 gx-avatar-row side_bar_main">
        <Popover placement="bottomRight" content={userMenuOptions} trigger="click">
          <Avatar src={require("../../assets/images/profile-image.png")}
            className="gx-size-40 gx-pointer gx-mr-3" alt="" />
          <span className="gx-avatar-name">{(localStorage.getItem('name') === '' || localStorage.getItem('name') === null || localStorage.getItem('name') === undefined) ? localStorage.getItem('dealerName') : localStorage.getItem('name')}<i
            className="icon icon-chevron-down gx-fs-xxs gx-ml-2" />

          </span>
        </Popover>

        <NewDevice
          ref='new_device'
          devices={this.props.devices}
          addDevice={this.props.addDevice}
          rejectDevice={this.props.rejectDevice}

        />
        <ul className="gx-app-nav bell_icon">
          {/* <li><i className="icon icon-search-new" /></li> */}
          {/* <li><i className="icon icon-chat-new" /></li> */}
          <li>
            <a className="head-example">
              <Badge count={this.props.devices.length}>
                <i className="icon icon-notification notification_icn" onClick={() => this.showNotification()} />
              </Badge>
            </a>
          </li>
        </ul>
      </div>

    )

  }
}

var mapStateToProps = ({ devices }) => {
  // console.log('devices new', devices.newDevices);
  return {
    devices: devices.newDevices,

  };
}


export default connect(mapStateToProps, { logout, getNewDevicesList })(UserProfile);
