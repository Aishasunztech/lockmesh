import React, {Component} from 'react';
import {Card, Tabs, Form, Input, Select, Button} from "antd";
import AppFilter from "../../components/AppFilter";
import Ticket from "./Tickets";
import SystemMessages from "./SystemMessages";
import categories from "./Tickets/data/categories";
import statuses from "./Tickets/data/statuses";
import priorities from "./Tickets/data/priorities";
import styles from './style.css'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {ADMIN, DEALER, SDEALER} from "../../constants/Constants";

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
          key="system_messages_key"
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


    this.supportTicketOptions = <span>


      {this.props.user.type !== ADMIN ?
        <Button type="primary" style={{float: "right"}} onClick={ () => {this.refs.supportTickets.getWrappedInstance().updateState({composeMail: true})} } size="default" >Generate New Ticket</Button>
      : '' }

      <Select
        key="support_tickets_statuses_key"
        style={{ width: '15%', marginRight: '1%', float: "right" }}
        onChange={ (e) => { console.log(e);} }
        defaultValue={statuses[0].title}
      >
        <Select.OptGroup label="Status">
        {statuses.map( (status, index) => {
          return <Select.Option value={status.title}>{status.title.charAt(0).toUpperCase() + status.title.substr(1)}</Select.Option>
        }) }
        </Select.OptGroup>
        <Select.OptGroup label="Type">
        {categories.map( (category, index) => {
          return <Select.Option value={category.title}>{category.title.charAt(0).toUpperCase() + category.title.substr(1)}</Select.Option>
        }) }
        </Select.OptGroup>
        <Select.OptGroup label="Priority">
        {priorities.map( (priority, index) => {
          return <Select.Option value={priority.title}>{priority.title.charAt(0).toUpperCase() + priority.title.substr(1)}</Select.Option>
        }) }
        </Select.OptGroup>
      </Select>

      <Input
        type="text"
        placeholder="Search"
        style={{ width: '30%', marginRight: '1%', float: "right" }}
        onChange={ (e) => {this.setState({systemMessagesSearchValue: e.target.value})} }
      />
      </span>;


      this.tabBarContent.bind(this);
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

  tabBarContent(currentTab){

    let content = '';
    switch (currentTab){
      case '1':
        content = this.systemMessagesOptions;
        break;
      case '2':
        content = this.supportTicketOptions;
        break;
      default:
        break;
    }
    return content;
  }



  render() {
    return (
      <div>
        <AppFilter
          pageHeading="SUPPORT"
        />
        <Card>

          <Tabs tabBarExtraContent={ this.tabBarContent(this.state.innerTabSelect) } defaultActiveKey={this.state.innerTabSelect} activeKey={this.state.innerTabSelect} type="card" className="supportModuleMainTab" onChange={this.handleChangeCardTabs}>
            <TabPane tab="SYSTEM MESSAGES" key="1" forceRender={false}>
              <SystemMessages
                ref="systemMessages"
                filterOption={this.state.filterOption}
                systemMessagesSearchValue={this.state.systemMessagesSearchValue}
              />
            </TabPane>
            <TabPane tab="TICKETS" key="2" forceRender={false}>
              <Ticket ref="supportTickets" />
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
