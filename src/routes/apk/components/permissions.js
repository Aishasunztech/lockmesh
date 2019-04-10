import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import DealerList from "./DealerList";


// export default 
class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDealersModal: false,

    }
    
    this.addDealerCols = [
      {
        title: (
          <Input.Search
            name="dealer_id"
            key="dealer_id"
            id="dealer_id"
            className="search_heading"
            autoComplete="new-password"
            placeholder="Device ID"
            onKeyUp={this.handleSearch}

          />
        ),
        dataIndex: 'dealer_id',
        className: '',
        children: [
          {
            title: 'DEALER ID',
            dataIndex: 'dealer_id',
            key: 'dealer_id',
            sortDirections: ['ascend', 'descend'],
            // sorter: (a, b) => {
            //     console.log(a);
            //     // console.log(b);
            //     return a.dealer_id.length;
            // },

            sorter: (a, b) => a.dealer_id - b.dealer_id,
            align: 'center',
            sortDirections: ['ascend', 'descend'],
            className: '',
          }
        ]
      },
      {
        title: (
          <Input.Search
            name="link_code"
            key="link_code"
            id="link_code"
            className="search_heading"
            autoComplete="new-password"
            placeholder="Dealer Pin"
            onKeyUp={this.handleSearch}

          />
        ),
        dataIndex: 'link_code',
        className: '',
        children: [
          {
            title: 'DEALER PIN',
            dataIndex: 'link_code',
            key: 'link_code',
            // sorter: (a, b) => {
            //     console.log(a);
            //     // console.log(b);
            //     return a.link_code.length;
            // },
            sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

            align: 'center',
            sortDirections: ['ascend', 'descend'],
            className: '',
          }
        ]
      },
      {
        title: (
          <Input.Search
            name="dealer_name"
            key="dealer_name"
            id="dealer_name"
            className="search_heading"
            autoComplete="new-password"
            placeholder="Dealer Name"
            onKeyUp={this.handleSearch}

          />
        ),
        dataIndex: 'dealer_name',
        className: '',
        children: [
          {
            title: 'DEALER NAME',
            dataIndex: 'dealer_name',
            key: 'dealer_name',
            // sorter: (a, b) => {
            //     console.log(a);
            //     // console.log(b);
            //     return a.dealer_name.length;
            // },
            sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

            align: 'center',
            sortDirections: ['ascend', 'descend'],
            className: '',
          }
        ]
      },
      {
        title: (
          <Input.Search
            name="dealer_email"
            key="dealer_email"
            id="dealer_email"
            className="search_heading"
            autoComplete="new-password"
            placeholder="Dealer Email"
            onKeyUp={this.handleSearch}

          />
        ),
        dataIndex: 'dealer_email',
        className: '',
        children: [
          {
            title: 'DEALER EMAIL',
            dataIndex: 'dealer_email',
            key: 'dealer_email',
            // sorter: (a, b) => {
            //     console.log(a);
            //     // console.log(b);
            //     return a.dealer_email.length;
            // },
            sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

            align: 'center',
            sortDirections: ['ascend', 'descend'],
            className: '',
          }
        ]
      },
      {
        title: (
          <Input.Search
            name="connected_devices"
            key="connected_devices"
            id="connected_devices"
            className="search_heading"
            autoComplete="new-password"
            placeholder="Connected Devices"
            onKeyUp={this.handleSearch}

          />
        ),
        dataIndex: 'connected_devices',
        className: '',
        children: [
          {
            title: 'CONNECTED DEVICES',
            dataIndex: 'connected_devices',
            key: 'connected_devices',
            // sorter: (a, b) => {
            //     console.log(a);
            //     // console.log(b);
            //     return a.connected_devices.length;
            // },
            sorter: (a, b) => { return a.connected_devices.localeCompare(b.connected_devices) },

            align: 'center',
            sortDirections: ['ascend', 'descend'],
            className: '',
          }
        ]
      },
      {
        title: (
          <Input.Search
            name="dealer_token"
            key="dealer_token"
            id="dealer_token"
            className="search_heading"
            autoComplete="new-password"
            placeholder="Tokens"
            onKeyUp={this.handleSearch}

          />
        ),
        dataIndex: 'dealer_token',
        className: '',
        children: [
          {
            title: 'TOKENS',
            dataIndex: 'dealer_token',
            key: 'dealer_token',
            // sorter: (a, b) => {
            //     console.log(a);
            //     // console.log(b);
            //     return a.dealer_token.length;
            // },
            sorter: (a, b) => { return a.dealer_token.localeCompare(b.dealer_token) },

          }
        ]
      }
    ]
    
    this.listDealerCols = [
      {
        title: 'DEALER ID',
        dataIndex: 'dealer_id',
        key: 'dealer_id',
        sortDirections: ['ascend', 'descend'],

        sorter: (a, b) => a.dealer_id - b.dealer_id,
        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      {
        title: 'DEALER PIN',
        dataIndex: 'link_code',
        key: 'link_code',
        // sorter: (a, b) => {
        //     console.log(a);
        //     // console.log(b);
        //     return a.link_code.length;
        // },
        sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      {
        title: 'DEALER NAME',
        dataIndex: 'dealer_name',
        key: 'dealer_name',
        // sorter: (a, b) => {
        //     console.log(a);
        //     // console.log(b);
        //     return a.dealer_name.length;
        // },
        sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      {
        title: 'DEALER EMAIL',
        dataIndex: 'dealer_email',
        key: 'dealer_email',
        // sorter: (a, b) => {
        //     console.log(a);
        //     // console.log(b);
        //     return a.dealer_email.length;
        // },
        sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      
      // {
      //   title: 'CONNECTED DEVICES',
      //   dataIndex: 'connected_devices',
      //   key: 'connected_devices',
      //   // sorter: (a, b) => {
      //   //     console.log(a);
      //   //     // console.log(b);
      //   //     return a.connected_devices.length;
      //   // },
      //   sorter: (a, b) => { return a.connected_devices.localeCompare(b.connected_devices) },

      //   align: 'center',
      //   sortDirections: ['ascend', 'descend'],
      //   className: '',
      // },
      // {
      //   title: 'TOKENS',
      //   dataIndex: 'dealer_token',
      //   key: 'dealer_token',
      //   // sorter: (a, b) => {
      //   //     console.log(a);
      //   //     // console.log(b);
      //   //     return a.dealer_token.length;
      //   // },
      //   sorter: (a, b) => { return a.dealer_token.localeCompare(b.dealer_token) },

      // }
    ]
   
  }

  componentDidMount() {
    this.props.getAllDealers()
  }
  showDealersModal = (visible) => {
    this.setState({
      showDealersModal: visible
    })
  }
  savePermission = () => {

  }

  renderDealer(list) {
    let data = [];
    list.map((dealer) => {

      data.push({
        'row_key': dealer.dealer_id,
        'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
        'dealer_name': dealer.dealer_name ? dealer.dealer_name : 'N/A',
        'dealer_email': dealer.dealer_email ? dealer.dealer_email : 'N/A',
        'link_code': dealer.link_code ? dealer.link_code : 'N/A',
        'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
        'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
        'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
        'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A'

      })
    });
    return (data);
  }
  render() {
    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box"><h2>Permission List</h2> </div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" type="primary" onClick={() => { this.showDealersModal(true) }}>Add</Button></div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" type="primary">Select All</Button></div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box search_heading">
              <Input.Search placeholder="Dealer Email" style={{ marginBottom: 0 }} />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Table
            columns={this.listDealerCols}
            // dataSource={data} 
          />
        </Row>
        <Modal
          // size={}
          width = '700'
          title="Dealers Permission"
          visible={this.state.showDealersModal}
          onOk={() => {
            this.savePermission()
          }}
          okText="Save"
          onCancel={() => {
            this.showDealersModal(false)
          }}
        >
          <DealerList
            columns = {this.addDealerCols}
            dealers={this.renderDealer(this.props.dealerList)}

          />
        </Modal>
      </Fragment>
    )
  }
}

// export default Apk;
const mapStateToProps = ({ dealers }, props) => {
  console.log("dealer", dealers);
  return {
    dealerList: dealers.dealers
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    //  getDevicesList: getDevicesList
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);