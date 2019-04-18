import React, { Component, Fragment } from 'react'
import { Col, Row, Switch, Table } from 'antd';
const dataSource = [
  {
    key: '1',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '2',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '3',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '4',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '5',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }, {
    key: '6',
    name: <img src={require("assets/images/setting.png")} />,
    age: <Switch defaultChecked size="small" />,
    address: <Switch defaultChecked size="small" />
  }
];

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
 
export default class SettingAppPermissions extends Component {

  constructor(props){
    super(props)
    this.state={
      extension:[],
    }
  }

  componentDidMount(){
    console.log('did mounted is called');
    let objIndex = this.props.extensions.findIndex((obj => obj.uniqueName === this.props.pageName));
    if(objIndex !== -1 && objIndex === undefined)
    console.log(objIndex,'ext', this.props.extensions[objIndex]);
    this.state.extension.push(this.props.extensions[objIndex]);

    this.setState({extension:this.state.extension })
    console.log(objIndex,'ext', this.props.extensions[objIndex]);
    
  }
  render() {
    console.log('app list if extensin', this.props.extensions);
    const {extensions} = this.props;

    const renderApps = (extensions)=> {
      console.log('extens rte', this.state.extension);
      let data = this.state.extension;
      console.log('data is ', this.state.extension.subExtension)
      console.log('length', this.state.extension.length)

      if( this.state.extension.length !== 0){
        console.log('length 12',this.state.extension[0])
        return this.state.extension[0].subExtension.map((ext, index)=> {
          return{
            "key": index,
            "name": ext.label,
            "guest": <Switch defaultChecked={ext.guest === 1 ? true: false} size="small" />,
            "encrypted": <Switch defaultChecked={ext.encrypted === 1 ? true: false} size="small" />
          }
        })
      }
     
    }
    return (
      <Fragment>
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
            <span>Guest </span> <Switch defaultChecked={extensions[0].guest === 1 ? true: false} size="small" />
          </Col>
          <Col span={8}>
            <span>Encrypt </span> <Switch defaultChecked={extensions[0].encrypted === 1 ? true: false} size="small" />
          </Col>
          <Col span={8}>
            <span>Enable </span> <Switch defaultChecked={extensions[0].enable === 1 ? true: false} size="small" />
          </Col>
        </Row>
        <div className="sec_set_table">
          <Table dataSource={renderApps(extensions)} columns={columns} pagination={false} scroll={{ y: 263 }} />
        </div>

      </Fragment>
    )
  }
}
