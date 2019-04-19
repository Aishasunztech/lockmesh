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
      extension: [],
      uniqueName: '',
      guestAllExt: false,
      encryptedAllExt: false
    }
  }

  componentDidMount() {
    // console.log("component props", this.props);
    this.setProps('did');

  }

  componentWillReceiveProps(nextprops) {
    // console.log('component will recieve is called', nextprops)
    //  console.log('index', objIndex);
    if (this.props.isExtension) {

      this.state.extension = [];
      this.state.extension.push(this.props.extension);
      this.setState({
        extension: this.state.extension,
        encryptedAllExt: nextprops.encryptedAllExt,
        guestAllExt: nextprops.guestAllExt
      })
    }

  }

  setProps = (type, nextprops) => {
    if (this.props.isExtension) {
      this.state.extension = [];
      this.state.extension.push(this.props.extension);
      if (type === 'did') {
        this.setState({
          extension: this.state.extension,
          pageName: this.props.pageName
        })
      }
      else {
        console.log('update function is called')
        this.setState({
          extension: nextprops.extension,
          encryptedAllExt: nextprops.encryptedAllExt,
          guestAllExt: nextprops.guestAllExt
        })
      }
    }
  }


  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      // console.log('this props.........', this.props)
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
    let data = this.state.extension;
    if (this.state.extension.length !== 0) {
      console.log('length 12', this.state.extension[0].subExtension)
      return this.state.extension[0].subExtension.map((ext, index) => {
        return {
          "key": index,
          "name": ext.label,
          "guest": <Switch checked={ext.guest === 1 ? true : false} size="small"
            onClick={(e) => {
              // console.log("guest", e);
              this.handleChecked(e, "guest", ext.app_id);
            }}
          />,
          "encrypted": <Switch checked={ext.encrypted === 1 ? true : false} size="small"
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
    // console.log('app list if extensin', this.props.extensions);
    const { extension, isExtension } = this.props;
    if(isExtension){
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
      return (<Fragment>
        Extension Not Available
      </Fragment>)
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
  console.log(device_details, "applist ownprops", ownProps);
  const pageName = ownProps.pageName;

  let extension = device_details.extensions.find(o => o.uniqueName === pageName);
  // console.log("extensions_", extension);
  if (extension !== undefined) {
    return {
      isExtension: true,
      extension: extension,
      guestAllExt: device_details.guestAllExt,
      encryptedAllExt: device_details.encryptedAllExt,
    }
  } else {
    return {
      isExtension: false
    }
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(SettingAppPermissions);