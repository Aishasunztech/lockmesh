import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table } from 'antd';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  handleCheckExtension,
  handleCheckAllExtension

} from "../../../appRedux/actions/ConnectDevice";

import ExtensionDropdown from './ExtensionDropdown';

const columns = [{
  title: 'In-App Menu Display',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Guest',
  dataIndex: 'guest',
  key: 'guest',
}, {
  title: 'Encrypted',
  dataIndex: 'encrypted',
  key: 'encrypted',
}];

class SettingAppPermissions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      extension: {},
      uniqueName: '',
      guestAllExt: false,
      encryptedAllExt: false
    }
  }

  componentDidMount() {
    if (this.props.isExtension) {
      this.setState({
        extension: this.props.extension,
        pageName: this.props.pageName
      })
    }

  }

  componentWillReceiveProps(nextprops) {
    
    if (this.props.isExtension) {
      // alert("hello");
      this.setState({
        extension: nextprops.extension,
        encryptedAllExt: nextprops.encryptedAllExt,
        guestAllExt: nextprops.guestAllExt
      })
    }

  }


  handleChecked = (e, key, app_id) => {
    this.props.handleCheckExtension(e, key, app_id, this.props.pageName);
  }

  handleCheckedAll = (key, value) => {

    console.log("handleCheckedAll");
    if (key === "guestAllExt") {
      this.props.handleCheckAllExtension(key, 'guest', value, this.props.pageName);
    } else if (key === "encryptedAllExt") {
      this.props.handleCheckAllExtension(key, 'encrypted', value, this.props.pageName);
    }
  }
  renderApps = () => {

    let extension = this.state.extension;
    // console.log("render list extension", extension);

    if (this.state.extension !== undefined && this.state.extension !== null && Object.keys(extension).length) {

      return this.state.extension.subExtension.map((ext, index) => {
        return {
          key: index,
          name: ext.label,
          guest: <Switch checked={ext.guest === 1 ? true : false} size="small"
            onClick={(e) => {
              // console.log("guest", e);
              this.handleChecked(e, "guest", ext.app_id);
            }}
          />,
          encrypted: <Switch checked={ext.encrypted === 1 ? true : false} size="small"
            onClick={(e) => {
              // console.log("guest", e);
              this.handleChecked(e, "encrypted", ext.app_id);
            }}
          />
        }
      })
    }
  }
  render() {
    const { extension, isExtension } = this.props;
    if (isExtension) {
      return (
        <Fragment>
          <ExtensionDropdown
            checked_app_id={null}
            encryptedAll={this.state.encryptedAllExt}
            guestAll={this.state.guestAllExt}
            handleCheckedAll={this.handleCheckedAll}
          />
          <Row className="first_head">
            <Col span={7} className="pr-0">
              <img src={require("assets/images/setting.png")} />
            </Col>
            <Col span={17}>
              <h5>Secure Settings Permission</h5>
            </Col>
          </Row>
          <Row className="sec_head">
            <Col span={8}>
              <span>Guest </span> <Switch defaultChecked={extension.guest === 1 ? true : false} size="small" />
            </Col>
            <Col span={8}>
              <span>Encrypt </span> <Switch defaultChecked={extension.encrypted === 1 ? true : false} size="small" />
            </Col>
            <Col span={8}>
              <span>Enable </span> <Switch defaultChecked={extension.enable === 1 ? true : false} size="small" />
            </Col>
          </Row>
          <div className="sec_set_table">
            <Table dataSource={this.renderApps()} columns={columns} pagination={false} scroll={{ y: 263 }} />
          </div>

        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <h1 class="not_syn_txt"><a>Secure Settings <br></br> Not Available</a></h1>
        </Fragment>
      )
    }

  }
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    // showHistoryModal: showHistoryModal
    handleCheckExtension: handleCheckExtension,
    handleCheckAllExtension: handleCheckAllExtension
    // handleCheckAll: handleCheckAll
  }, dispatch);
}


var mapStateToProps = ({ device_details }, ownProps) => {
  // console.log(device_details, "applist ownprops", ownProps);
  const pageName = ownProps.pageName;

  let extension = device_details.extensions.find(o => o.uniqueName === pageName);
  // console.log("extensions_", extension);

  if (extension !== undefined) {
    return {
      isExtension: true,
      extension: extension,
      guestAllExt: device_details.guestAllExt,
      encryptedAllExt: device_details.encryptedAllExt,
      checked_app_id: device_details.checked_app_id,
    }
  } else {
    return {
      isExtension: false
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SettingAppPermissions);