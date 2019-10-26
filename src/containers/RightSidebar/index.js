import React, { Component } from "react";
import { Button, Drawer, Form, message, Icon, Tabs, Collapse, } from "antd";
import { connect } from "react-redux";
import Auxiliary from "../../util/Auxiliary";
import CustomScrollbars from "../../util/CustomScrollbars";
import { getSocketProcesses, getNotification } from '../../appRedux/actions';
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
    this.datalist = []
  }

  callback = (key) => {
    console.log(key);
  }

  genExtra = (type) => {
    return (<div style={{ lineHeight: 1 }}>
      <i class="fa fa-check" aria-hidden="true"></i>
      <i class="fa fa-check" aria-hidden="true"></i>
      <br></br>
      {type === 'completed' ? <i class="fa fa-times" aria-hidden="true" onClick={() => { }}></i> : null}
    </div>)
  }


  getCustomizerContent = () => {

    return (
      // <CustomScrollbars className="gx-customizer">
      <div className="gx-customizer-item">

        <Tabs onChange={() => this.callback()} type="card" className='rightSidebar-header'>
          <TabPane tab="Pending" key="pending">
            <CustomScrollbars className="gx-customizer">

              <Collapse
                // defaultActiveKey={['1']}
                bordered={false}
                expandIconPosition='right'
                onChange={() => this.callback()}
              // style={{ height: 400 }}
              >
                {this.renderList(this.props.tasks, 'pending', 'pending')}
                {/* <div style={{ height: 50 }}></div> */}
              </Collapse>

            </CustomScrollbars>

            <div className='rightSidebar-footer'>
              <Icon
                type="reload"
                style={{ height: 10, width: 10 }}
              // onClick={() => this.props.getSocketProcesses('pending', '', this.props.pendingTasks.length, 50)}

              />
            </div>
          </TabPane>
          <TabPane tab="Completed" key="completed_successfully">
            <CustomScrollbars className="gx-customizer">
              <Collapse
                bordered={false}
                expandIconPosition='right'
                // defaultActiveKey={['1']}
                onChange={() => this.callback()}

              >
                {this.renderList(this.props.tasks, 'completed_successfully', 'completed')}
              </Collapse>
            </CustomScrollbars>
            <div className='rightSidebar-footer'>
              <Icon
                type="reload"
                style={{ height: 10, width: 10 }}
              // onClick={() => this.props.getSocketProcesses('completed', '', this.props.completedTasks.length, 10)}

              />
            </div>
          </TabPane>

        </Tabs>
      </div>

      // </CustomScrollbars>
    )
  };

  

  toggleRightSidebar = () => {
    this.setState(previousState => (
      {
        isRightSidebarOpened: !previousState.isRightSidebarOpened
      }));
  };

  renderList = (data, type, title) => {
    let taskList = [];

    if (data.length) {
      data.map((item, index) => {
        if (item.status === type) {
          taskList.push(item);
        }
      })
    }
    return taskList.map((task) => {
      return (
        <Panel
          header={task.type + ' (' + task.device_id + ')'}
          style={customPanelStyle}
          key={task.id}
          extra={this.genExtra(title)}
        >
          <div>
            <p>{task.created_at}</p>
          </div>
        </Panel>
      )
    })
  }
  
  componentDidMount() {
    this.props.getSocketProcesses();
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.socket){
      nextProps.getNotification()
    }
  }
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

// export default RightSidebar;
const mapStateToProps = ({ rightSidebar, auth, socket }) => {
  // console.log("right sidebar:", rightSidebar, auth)
  return {
    tasks: rightSidebar.tasks,
    socket: socket.socket

  }
};

RightSidebar = Form.create()(RightSidebar);

export default connect(mapStateToProps, { getSocketProcesses, getNotification })(RightSidebar);
