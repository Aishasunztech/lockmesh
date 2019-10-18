import React, { Component } from "react";
import { Button, Drawer, Form, message, Icon, Tabs, Collapse, } from "antd";
import { connect } from "react-redux";
import Auxiliary from "util/Auxiliary";
import CustomScrollbars from "util/CustomScrollbars";
import { getQueJobs } from '../../appRedux/actions/rightSidebar';
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

  genExtra = (type) => (
    <div style={{ lineHeight: 1 }}>
      <i class="fa fa-check" aria-hidden="true"></i>
      <i class="fa fa-check" aria-hidden="true"></i>
      <br></br>
      {type === 'completed' ? <i class="fa fa-times" aria-hidden="true" onClick={() => alert('canceled')}></i> : null}
    </div>

    // <Icon
    //   type="delete"
    //   onClick={event => {
    //     // If you don't want click extra trigger collapse, you can prevent this:
    //     event.stopPropagation();
    //   }}
    // />
  );

  renderList = (data, type) => {
    if (data) {
      return data.map((item, index) => {
        return (
          <Panel header={item.type + ' (' + item.device_id + ')'} style={customPanelStyle} key={item.id} extra={this.genExtra(type)}>
            <div>
              <p>{item.created_at}</p>
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
              // style={{ height: 400 }}
              >
                {this.renderList(this.props.pendingTasks, 'pending')}
                {/* <div style={{ height: 50 }}></div> */}
              </Collapse>

            </CustomScrollbars>

            <div className='rightSidebar-footer'>
              <Icon
                type="reload"
                style={{ height: 10, width: 10 }}
                onClick={() => this.props.getQueJobs('pending', '', this.props.pendingTasks.length, 50)}

              />
            </div>
          </TabPane>
          <TabPane tab="Completed" key="2">
            <CustomScrollbars className="gx-customizer">
              <Collapse
                bordered={false}
                expandIconPosition='right'
                // defaultActiveKey={['1']}
                onChange={() => this.callback()}

              >
                {this.renderList(this.props.completedTasks, 'completed')}
              </Collapse>
            </CustomScrollbars>
            <div className='rightSidebar-footer'>
              <Icon
                type="reload"
                style={{ height: 10, width: 10 }}
                onClick={() => this.props.getQueJobs('completed', '', this.props.completedTasks.length, 10)}

              />
            </div>
          </TabPane>

        </Tabs>
      </div>

      // </CustomScrollbars>
    )
  };

  componentDidMount() {
    this.props.getQueJobs()
    // console.log('index of rightsidebar')
  }

  toggleRightSidebar = () => {
    this.setState(previousState => (
      {
        isRightSidebarOpened: !previousState.isRightSidebarOpened
      }));
  };

  render() {
    // console.log(this.props)
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
const mapStateToProps = ({ rightSidebar, auth }) => {
  return {
    completedTasks: rightSidebar.completedTasks,
    pendingTasks: rightSidebar.pendingTasks

  }
};
export default connect(mapStateToProps, { getQueJobs })(RightSidebar);
