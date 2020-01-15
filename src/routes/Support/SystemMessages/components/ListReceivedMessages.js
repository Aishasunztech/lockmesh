import React, { Component, Fragment } from 'react'
import { Table, Button, Icon, Card, Modal } from "antd";
import {getDateFromTimestamp, checkValue, convertToLang} from '../../../utils/commonUtils';
import { supportSystemMessagesReceiversColumns } from '../../../utils/columnsUtils';
import ViewMessage from './ViewMessage'

export default class ListReceivedMessages extends Component {

  constructor(props) {
    super(props);
    let receiversColumns = supportSystemMessagesReceiversColumns(props.translation, this.handleSearch);
    this.state = {
      receiversColumns: receiversColumns,
      searchText: '',
      columns: [],
      expandedRowKeys: [],
      visible: false,
      messageObject: null,
      viewMessage: false
    };
    this.renderList = this.renderList.bind(this);
    this.confirm = Modal.confirm;
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  componentDidMount() {
    this.props.getReceivedSupportSystemMessages();
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        columns: this.props.columns
      })
    }

    if (this.state.viewMessage && this.props.user.type !== this.state.messageObject.sender_user_type){
      this.props.updateSupportSystemMessageNotification({systemMessageId: this.state.messageObject._id})
    }

  }

  handleMessageModal = (data) => {
    this.setState({ viewMessage: true, messageObject: data })
  };

  renderList(list) {

    let supportSystemMessages = [];
    let data;

    list.map((item) => {
      data = {
        key: item.id,
        id: item.id,
        sender: <span className="text-capitalize">{item.system_message.sender_user_type}</span>,
        subject: checkValue(item.system_message.subject),
        createdAt: item.system_message.createdAt ? getDateFromTimestamp(item.system_message.createdAt) : "N/A",
        action: (
          <div data-column="ACTION" style={{ display: "inline-flex" }}>
            <Fragment>
              <Fragment><Button type="primary" size="small" onClick={() => this.handleMessageModal(JSON.parse(JSON.stringify(item.system_message)))}>VIEW MESSAGE</Button></Fragment>
            </Fragment>
          </div>
        ),

      };
      supportSystemMessages.push(data)
    });
    return supportSystemMessages
  }

  renderReceiversList(list) {
    let receiversData = [];
    let data;

    let dealerData = [];
    dealerData  = this.props.dealerList.filter(dealer => list.includes(dealer.dealer_id));
    dealerData.map((item, index) => {
      data = {
        key: item.dealer_id,
        counter: ++index,
        name: item.dealer_name ? item.dealer_name : "N/A",
        link_code: item.link_code ? item.link_code : "N/A",
      };
      receiversData.push(data)
    });

    return receiversData
  }


  render() {

    return (
      <Fragment>
        <Card>
          <Table
            className="gx-table-responsive"
            size="midddle"
            bordered
            columns={this.state.columns}
            dataSource={this.renderList(this.props.receivedSupportSystemMessages ? this.props.receivedSupportSystemMessages : [])}
            pagination={false
            }
            scroll={{ x: true }}
            rowKey="domain_id"
          />
        </Card>

        <Modal
          title={convertToLang(this.props.translation[""], "View Message")}
          width={"700px"}
          maskClosable={false}
          visible={this.state.viewMessage}
          onOk={() => this.setState({ viewMessage: false })}
          onCancel={() => this.setState({ viewMessage: false })}
          footer={false}
        >
          <ViewMessage
            messageObject={this.state.messageObject}
            translation={this.props.translation}
            user={this.props.user}
            updateSupportSystemMessageNotification={this.props.updateSupportSystemMessageNotification}
          />

        </Modal>

      </Fragment>
    )
  }
}
