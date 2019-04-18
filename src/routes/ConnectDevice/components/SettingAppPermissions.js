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
      uniqueName:'',
      guestAllExt: false,
      encryptedAllExt: false
    }
  }

  componentDidMount() {
    this.setProps('did');
  
  }

  componentWillReceiveProps(nextprops){
     console.log('component will recieve is called',nextprops)
     let objIndex = nextprops.extensions.findIndex((obj => obj.uniqueName === this.props.pageName));
     //  console.log('index', objIndex);
       if (objIndex >= 0)
       {
  
      this.state.extension = [];
         this.state.extension.push(this.props.extensions[objIndex]);
           this.setState({ 
             extension: this.state.extension,
             encryptedAllExt: nextprops.encryptedAllExt,
             guestAllExt: nextprops.guestAllExt
            })
         }
      
  }

  setProps = (type, nextprops)=> {
   // console.log(this.props.pageName,'fucntino is called', this.props.extensions);
    let objIndex = this.props.extensions.findIndex((obj => obj.uniqueName === this.props.pageName));
  //  console.log('index', objIndex);
    if (objIndex >= 0)
    {
      console.log('test conssle')
   //   console.log('insexd', objIndex);
   this.state.extension = [];
      this.state.extension.push(this.props.extensions[objIndex]);
      if(type === 'did'){
        this.setState({ 
          extension: this.state.extension,
          pageName:this.props.pageName
         })
      }
      else{
        console.log('update function is called')
        this.setState({ 
          extension: nextprops.extension,
          encryptedAllExt: nextprops.encryptedAllExt,
          guestAllExt: nextprops.guestAllExt
         })
      }
    }
  }


  componentDidUpdate(prevProps){
    if(this.props !== prevProps){
      console.log('this props.........', this.props)
    }
  }

  handleChecked = (e, key, app_id) => {
    this.props.handleCheckExtension(e,key,app_id, this.props.pageName);
}

  handleCheckedAll = (key, value) => {

     console.log("handleCheckedAll");
    if (key === "guestAllExt") {
      this.props.handleCheckAllExtension(key, 'guest', value, this.props.pageName);
    } else if (key === "encryptedAllExt") {
      this.props.handleCheckAllExtension(key, 'encrypted', value, this.props.pageName);
    }
  }

  render() {
   // console.log('app list if extensin', this.props.extensions);
    const { extensions } = this.props;

    const renderApps = () => {
    //  console.log('extens rte', this.state.extension);
      let data = this.state.extension;
    //  console.log('data is ', this.state.extension.subExtension)
    //  console.log('length', this.state.extension.length)

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
            <span>Guest </span> <Switch defaultChecked={extensions[0].guest === 1 ? true : false} size="small" />
          </Col>
          <Col span={8}>
            <span>Encrypt </span> <Switch defaultChecked={extensions[0].encrypted === 1 ? true : false} size="small" />
          </Col>
          <Col span={8}>
            <span>Enable </span> <Switch defaultChecked={extensions[0].enable === 1 ? true : false} size="small" />
          </Col>
        </Row>
        <div className="sec_set_table">
          <Table dataSource={renderApps()} columns={columns} pagination={false} scroll={{ y: 263 }} />
        </div>

      </Fragment>
    )
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


var mapStateToProps = ({ device_details },ownProps) => {
  // console.log(device_details,"applist ownprops", ownProps);
   if(device_details){
     console.log('detail list of all props', device_details)
     return{
      extensions: device_details.extensions,
      guestAllExt: device_details.guestAllExt,
      encryptedAllExt: device_details.encryptedAllExt,
     }
   }else{
   
      return {
        extensions: ownProps.extensions,
      // console.log("applist mapStateToProps", {
      //     app_list: device_details.app_list,
      //     undoApps: device_details.undoApps,
      //     redoApps: device_details.redoApps,
      //     checked_app_id: device_details.checked_app_id,
        
        //  enableAll: device_details.enableAll
      // });
      
      // alert("apps not from history");
  }
}
  // console.log("applist", device_details.app_list);
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingAppPermissions);