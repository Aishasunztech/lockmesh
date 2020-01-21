import React, { Component, Fragment } from 'react'
import { Table, Button, Icon, Card, Modal } from "antd";
import {
  checkValue,
  convertToLang,
  componentSearchSystemMessages
} from '../../../utils/commonUtils';
import { supportSystemMessagesReceiversColumns } from '../../../utils/columnsUtils';
import ViewMessage from './ViewMessage'

let list                = [];
let systemMessagesCopy  = [];
let status              = true;
export default class ListSystemMessages extends Component {

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
      viewMessage: false,
      systemMessages: []
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

  }

  componentDidUpdate(prevProps) {

    if (this.props !== prevProps) {

      let sentMessages    = this.props.supportSystemMessages ? this.props.supportSystemMessages : [];
      let receiveMessages = this.props.receivedSupportSystemMessages ? this.props.receivedSupportSystemMessages : [];

      if (this.props.filterOption === 'all'){
        list        = [...sentMessages , ...receiveMessages];
      } else if(this.props.filterOption === 'received'){
        list        = receiveMessages;
      }else{
        list        = sentMessages;
      }

      this.setState({
        columns: this.props.columns,
        systemMessages: list,
      });

    }


    try {
      if (this.props.systemMessagesSearchValue.length !== prevProps.systemMessagesSearchValue.length) {


        if (status) {

          systemMessagesCopy  = list;
          status              = false;

        }

        let foundUsers = componentSearchSystemMessages(systemMessagesCopy, this.props.searchSystemMessagesColumns, this.props.systemMessagesSearchValue);

        if (foundUsers.length) {
          this.setState({
            systemMessages: foundUsers,
          });
        } else {
          this.setState({
            systemMessages: [],
          });
        }
      } else {
        status = true;
      }
    } catch (error) {

    }

    if (this.state.viewMessage && this.props.user.type !== this.state.messageObject.sender_user_type && this.state.messageObject.type === 'Received'){
      this.props.updateSupportSystemMessageNotification({systemMessageId: this.state.messageObject.id})
    }
  }

  handleMessageModal = (data) => {
    this.setState({ viewMessage: true, messageObject: data })
  };

  renderList() {

    let data;
    let renderList      = [];

    if (this.state.systemMessages.length > 0){

      this.state.systemMessages.map((item) => {

        data = {
          key: item.id,
          id: item.id,
          receiver_ids: item.receiver_ids,
          receivers: item.type === 'Sent' ? item.receiver_ids.length : '--',
          type: item.type,
          sender: item.sender === "" ? "--" : item.sender,
          subject: checkValue(item.subject),
          createdAt: item.createdAt,
          action: (
            <div data-column="ACTION" style={{ display: "inline-flex" }}>
              <Fragment>
                <Fragment><Button type="primary" size="small" onClick={() => this.handleMessageModal(JSON.parse(JSON.stringify(item)))}>VIEW MESSAGE</Button></Fragment>
              </Fragment>
            </div>
          ),

        };

        renderList.push(data)
      });

      renderList.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      return renderList
    }else{
      return []
    }

  }

  renderReceiversList(list) {
    let receiversData = [];
    let data;

    let dealerData  = [];
    dealerData      = this.props.dealerList.filter(dealer => list.includes(dealer.dealer_id));
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

  customExpandIcon(props) {
    if (props.expanded) {
      return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
        props.onExpand(props.record, e);
      }}><Icon type="caret-down" /></a>
    } else {

      return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
        props.onExpand(props.record, e);
      }}><Icon type="caret-right" /></a>
    }
  }

  onExpandRow = (expanded, record) => {
    if (expanded) {
      if (!this.state.expandedRowKeys.includes(record.key)) {
        this.state.expandedRowKeys.push(record.key);
        this.setState({ expandedRowKeys: this.state.expandedRowKeys })
      }
    } else if (!expanded) {
      if (this.state.expandedRowKeys.includes(record.key)) {
        let list = this.state.expandedRowKeys.filter(item => item !== record.key);
        this.setState({ expandedRowKeys: list })
      }
    }
  };

  render() {

    return (
      <Fragment>
          <Table
            className="gx-table-responsive"
            rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.key) ? 'exp_row' : ''}
            expandIcon={(props) => props.record.receivers === '--' ? "" : this.customExpandIcon(props)}
            expandedRowRender={(record) => {
              let expandedTable;
              if(record.receivers === '--'){
                expandedTable = "";
              } else {
                expandedTable = <Table
                  style={{ margin: 10 }}
                  size="middle"
                  bordered
                  columns={this.state.receiversColumns}
                  dataSource={this.renderReceiversList(record.receiver_ids)}
                  pagination={false}
                  scroll={{ x: true }}
                />;
              }
              return (
                <Fragment>
                  {expandedTable}

                </Fragment>
              );
            }}
            onExpand={this.onExpandRow}
            expandIconColumnIndex={1}
            expandIconAsCell={false}
            size="midddle"
            bordered
            columns={this.state.columns}
            dataSource={this.renderList()}
            pagination={false
            }
            scroll={{ x: true }}
            rowKey="key"
          />

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
          />

        </Modal>

      </Fragment>
    )
  }
}
