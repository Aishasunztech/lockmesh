import React, { Component } from "react";
import { Button, Drawer, Form, Tag, Tabs, Collapse, } from "antd";
import { connect } from "react-redux";
import Auxiliary from "../../util/Auxiliary";
import CustomScrollbars from "../../util/CustomScrollbars";
import { getSocketProcesses, getNotification } from '../../appRedux/actions';
import styles from './rightSidebar.css'
const { TabPane } = Tabs;
const { Panel } = Collapse;

// const customPanelStyle = {
//   background: '#f7f7f7',
//   borderRadius: 4,
//   marginBottom: 16,
//   border: 0,
//   overflow: 'hidden',
// };

class RightSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRightSidebarOpened: false,
      offSetValue: 0
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

  queueOnload = () => {
    // console.log("queueOnload");
    let offSet = this.state.offSetValue + 10;
    this.props.getSocketProcesses(false, false, offSet, 10);
  }


  getCustomizerContent = () => {

    return (
      // <CustomScrollbars className="gx-customizer">
      <div className="gx-customizer-item">

        <br />
        <br />
        <CustomScrollbars className="gx-customizer">

          <Collapse
            // defaultActiveKey={['1']}
            bordered={false}
            expandIconPosition='right'
            onChange={() => this.callback()}
          // style={{ height: 400 }}
          >
            {this.renderList(this.props.tasks, 'pending')}
            {/* <div style={{ height: 50 }}></div> */}
          </Collapse>

        </CustomScrollbars>
        <br />
        <Button type="primary" onClick={this.queueOnload}>Load More</Button>
      </div>

    )
  };



  toggleRightSidebar = () => {
    this.setState(previousState => (
      {
        isRightSidebarOpened: !previousState.isRightSidebarOpened
      }));
  };

  renderList = (data, title) => {
    let taskList = [];

    if (data.length) {
      data.map((item, index) => {
        // if (item.status === type) {
        taskList.push(item);
        // }
      })
    }
    return taskList.map((task) => {
      let color = '';
      switch (task.status) {
        case 'pending':
          color = 'blue'
          break;
        case 'completed_successfully':
          color = 'green'
          break;
        default:
          color = 'red'
      }
      return (
        <Panel
          header={task.type + ' (' + task.device_id + ')'}
          // style={customPanelStyle}
          key={task.id}
          className="r_bar_cont"
          extra={this.genExtra(title)}
        >
          <div>
            <p className="mb-4">status: <Tag color={color}>{task.status}</Tag></p>
            <p className="mb-4">{task.created_at}</p>
          </div>
        </Panel>
      )
    })
  }

  componentDidMount() {
    this.props.getSocketProcesses();
  }
  componentWillReceiveProps(nextProps) {
    // console.log("rightSidebar: ", nextProps);
    if (nextProps.socket && nextProps.socket.connected) {
      nextProps.getNotification(nextProps.socket)
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
          <Button className="right_bell_icon" type="primary" onClick={() => this.toggleRightSidebar()}>
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
  // console.log("rightSidebar.tasks ", rightSidebar.tasks)
  return {
    tasks: rightSidebar.tasks,
    socket: socket.socket

  }
};

RightSidebar = Form.create()(RightSidebar);

export default connect(mapStateToProps, { getSocketProcesses, getNotification })(RightSidebar);
