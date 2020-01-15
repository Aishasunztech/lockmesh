import React, {Component} from 'react';
import {Card, Tabs, Form} from "antd";
import AppFilter from "../../components/AppFilter";
import Ticket from "./Tickets";
import SystemMessages from "./SystemMessages";


const TabPane = Tabs.TabPane;
class Support extends Component {
  constructor(props) {
    super(props);

    this.state = {
      innerTabSelect: '1'
    };
  }

  handleChangeCardTabs = (value) => {

    switch (value) {
      case '1':
        this.setState({
          innerTabSelect: '1'
        });
        break;

      case '2':
        this.setState({
          innerTabSelect: '2'
        });

        break;
      case "3":
        this.setState({
          innerTabSelect: '3'
        });
        break;
      default:
        this.setState({
          innerTabSelect: '1'
        });
        break;
    }
  };

  render() {
    return (
      <div>
        <AppFilter
          pageHeading="SUPPORT"
        />
        <Card>
          <Tabs defaultActiveKey="1" activeKey={this.state.innerTabSelect} type="card" className="" onChange={this.handleChangeCardTabs}>
            <TabPane tab="SYSTEM MESSAGES" key="1" forceRender={false}>
              <SystemMessages />
            </TabPane>
            <TabPane tab="TICKETS" key="2" forceRender={false}>
              <Ticket />
            </TabPane>
            <TabPane tab="LIVE CHAT" key="3" forceRender={false}>
            </TabPane>
          </Tabs>
        </Card>
      </div>

    )
  }
}

const WrappedAddDeviceForm = Form.create()(Support);
export default WrappedAddDeviceForm;
