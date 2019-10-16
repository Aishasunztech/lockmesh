import React, { Component } from "react";
import { Button, Drawer, Form, message, Icon, Tabs, Collapse, } from "antd";
import { connect } from "react-redux";
import Auxiliary from "util/Auxiliary";
import CustomScrollbars from "util/CustomScrollbars";
import {getQueJobs} from '../../appRedux/actions/rightSidebar';
import styles from './rightSidebar.css'
const { TabPane } = Tabs;
const { Panel } = Collapse;
const customPanelStyle = {
  background: '#f7f7f7',
  borderRadius: 4,
  marginBottom: 24,
  border: 0,
  overflow: 'hidden',
};
class RightSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRightSidebarOpened: false
    };
    this.datalist = [{ heading: 'PUSH APPS (ABCD123456)', description: 'A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world' },
    { heading: 'PUSH APPS (ABCD123656)', description: 'A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world' },
    { heading: 'PULL APPS (ABCD133456)', description: 'A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world' },
    { heading: 'PUSH APPS (AvCD123456)', description: 'A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world' }
    ]
  }


  callback = (key) => {
    console.log(key);
  }

  genExtra = () => (
    <div style={{ lineHeight: 1 }}>
      <i class="fa fa-check" aria-hidden="true"></i>
      <i class="fa fa-check" aria-hidden="true"></i>
      <br></br>
      <i class="fa fa-times" aria-hidden="true" onClick={() => alert('canceled')}></i>
    </div>

    // <Icon
    //   type="delete"
    //   onClick={event => {
    //     // If you don't want click extra trigger collapse, you can prevent this:
    //     event.stopPropagation();
    //   }}
    // />
  );

  renderList = (data) => {
    if (data) {
      return data.map((item, index) => {
        return (
          <Panel header={item.heading} style={customPanelStyle} key={item.heading} extra={this.genExtra()}>
            <div>
              <p>{item.description}</p>
            </div>
          </Panel>
        )
      })
    }
  }

  getCustomizerContent = () => {

    return (
      // <CustomScrollbars className="gx-customizer">
      <div className="gx-customizer-item">
        <Tabs onChange={() => this.callback()} type="card" className='rightSidebar-header'>
          <TabPane tab="Pending" key="1">
            <CustomScrollbars className="gx-customizer">
              <Collapse
                // defaultActiveKey={['1']}
                bordered={false}
                expandIconPosition='right'
                onChange={() => this.callback()}

              >
                {this.renderList(this.datalist)}
              </Collapse>
            </CustomScrollbars>
          </TabPane>
          <TabPane tab="Completed" key="2">
            <CustomScrollbars className="gx-customizer">
              <Collapse
                bordered={false}
                expandIconPosition='right'
                // defaultActiveKey={['1']}
                onChange={() => this.callback()}

              >
                {this.renderList(this.datalist)}
              </Collapse>
            </CustomScrollbars>
          </TabPane>
        </Tabs>
        <div className='rightSidebar-footer'>
          <Icon
            type="reload"
            style={{ height: 10, width: 10 }}

          />
        </div>
      </div>

      // </CustomScrollbars>
    )
  };

  componentDidMount(){
    this.props.getQueJobs()
  }

  toggleRightSidebar = () => {
    this.setState(previousState => (
      {
        isRightSidebarOpened: !previousState.isRightSidebarOpened
      }));
  };

  render() {
    console.log(this.props)
    return (
      <Auxiliary>
        <Drawer
          width='200'
          placement="right"
          // closable={true}
          onClose={this.toggleRightSidebar}
          visible={this.state.isRightSidebarOpened}>
          {
            this.getCustomizerContent()
          }

        </Drawer>
        <div
          // className="gx-customizer-option"
          className='container-notification-icon'
        >
          <Button type="primary" onClick={() => this.toggleRightSidebar()}>
            <i className="icon icon-notification bell-icon" />
          </Button>
        </div>

      </Auxiliary>
    );
  }
}

RightSidebar = Form.create()(RightSidebar);

// export default RightSidebar;
const mapStateToProps = ({settings, auth}) => {
  return {
    

  }
};
export default connect(mapStateToProps, {getQueJobs})(RightSidebar);
