import React, {Component} from 'react';
import {Card, Tabs, Form, Input, Select, Button} from "antd";
import AppFilter from "../../components/AppFilter";
import Ticket from "./Tickets";
import SystemMessages from "./SystemMessages";
import styles from './style.css'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {DEALER, SDEALER} from "../../constants/Constants";
import priorities from "./Tickets/data/priorities";

const TabPane = Tabs.TabPane;

let systemMessagesOptions;

class Support extends Component {
  constructor(props) {
    super(props);

    let currentTabId = (this.props.location ? this.props.location.state ? this.props.location.state.page ? this.props.location.state.page : '1' : '1' : '1')

    this.state = {
      innerTabSelect: currentTabId,
      filterOption: 'all',
      systemMessagesSearchValue: '',
    };

    this.systemMessagesOptions = <span>

      {this.props.user.type !== SDEALER ?

        <Button type="primary" style={{float: "right"}} onClick={ () => { this.refs.systemMessages.getWrappedInstance().handleSendMsgButton(true)} } size="default" >Send New Message</Button>
        : ''}

      {this.props.user.type === DEALER ?
        <Select
          style={{ width: '25%', marginRight: '1%', float: "right" }}
          onChange={ (e) => { this.setState({filterOption: e})} }
          defaultValue="all"
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="received">Received</Select.Option>
          <Select.Option value="sent">Sent</Select.Option>
        </Select>
        : ''}

      <Input
        type="text"
        placeholder="Search"
        style={{ width: '40%', marginRight: '1%', float: "right" }}
        onChange={ (e) => {this.setState({systemMessagesSearchValue: e.target.value})} }
      />
      </span>;
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

          <Tabs tabBarExtraContent={ this.state.innerTabSelect === '1'? this.systemMessagesOptions : '' } defaultActiveKey={this.state.innerTabSelect} activeKey={this.state.innerTabSelect} type="card" className="supportModuleMainTab" onChange={this.handleChangeCardTabs}>
            <TabPane tab="SYSTEM MESSAGES" key="1" forceRender={false}>
              <SystemMessages
                ref="systemMessages"
                filterOption={this.state.filterOption}
                systemMessagesSearchValue={this.state.systemMessagesSearchValue}
              />
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


function mapDispatchToProps(dispatch) {
  return bindActionCreators({

  }, dispatch);
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.authUser,
  };
};

export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})(Support);
