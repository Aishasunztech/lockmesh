import React, {Component} from 'react';
import {Card, Tabs, Form, Input, Select, Button} from "antd";
import AppFilter from "../../components/AppFilter";
import Ticket from "./Tickets";
import SystemMessages from "./SystemMessages";
import styles from './style.css'
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {DEALER, SDEALER} from "../../constants/Constants";

const TabPane = Tabs.TabPane;

let systemMessagesOptions;

class Support extends Component {
  constructor(props) {
    super(props);

    this.state = {
      innerTabSelect: '1',
      filterOption: 'all',
      systemMessagesSearchValue: '',
    };

    this.systemMessagesOptions = <span>

      <Input
        type="text"
        placeholder="Search"
        style={{ width: '40%', marginRight: '3%' }}
        onChange={ (e) => {this.setState({systemMessagesSearchValue: e.target.value})} }
      />


      {this.props.user.type === DEALER ?
        <Select
          style={{ width: '25%', marginRight: '3%' }}
          onChange={ (e) => { this.setState({filterOption: e})} }
          defaultValue="all"
        >
          <Select.Option value="all">All</Select.Option>
          <Select.Option value="received">Received</Select.Option>
          <Select.Option value="sent">Sent</Select.Option>
        </Select>
        : ''}

      {this.props.user.type !== SDEALER ?

        <Button type="primary" onClick={ () => { this.refs.systemMessages.getWrappedInstance().handleSendMsgButton(true)} } size="default" >Send New Message</Button>
        : ''}
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

          <Tabs tabBarExtraContent={ this.state.innerTabSelect === '1'? this.systemMessagesOptions : '' } defaultActiveKey="1" activeKey={this.state.innerTabSelect} type="card" className="supportModuleMainTab" onChange={this.handleChangeCardTabs}>
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
