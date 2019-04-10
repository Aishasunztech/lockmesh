import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import { savePermission } from "../../../appRedux/actions/Apk";
import DealerList from "./DealerList";


// export default 
class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDealersModal: false,
      dealer_ids: [],
      dealerList: []
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
            onKeyUp={
              (e) => {
                  this.handleSearch(e)
              }
            }

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
            onKeyUp={
              (e) => {
                  this.handleSearch(e)
              }
            }

          />
        ),
        dataIndex: 'link_code',
        className: '',
        children: [
          {
            title: 'DEALER PIN',
            dataIndex: 'link_code',
            key: 'link_code',
            
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
            onKeyUp={
              (e) => {
                  this.handleSearch(e)
              }
            }

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
            onKeyUp={
              (e) => {
                  this.handleSearch(e)
              }
            }

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
  
        sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      {
        title: 'DEALER NAME',
        dataIndex: 'dealer_name',
        key: 'dealer_name',
      
        sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      {
        title: 'DEALER EMAIL',
        dataIndex: 'dealer_email',
        key: 'dealer_email',
       
        sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

        align: 'center',
        sortDirections: ['ascend', 'descend'],
        className: '',
      },
      {
        title: 'ACTION',
        dataIndex: 'action',
        key: 'action',
        // sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },
        align: 'center',
        // sortDirections: ['ascend', 'descend'],
        className: '',
      },

    ]

  }

  componentDidMount() {
    this.props.getAllDealers()
    this.setState({
      dealerList: this.props.dealerList
    })
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.props.record.apk_id !== nextProps.record.apk_id) {
      this.props.getAllDealers();
      this.setState({
        dealerList: this.props.dealerList
      })
    } else if (this.props.dealerList.length !== nextProps.dealerList.length){
      this.setState({
        dealerList: nextProps.dealerList
      })
    }
  }

  showDealersModal = (visible) => {
    this.setState({
      showDealersModal: visible
    })
  }
  saveAllDealers = () => {
    let dealer_ids = []
    this.props.dealerList.map((dealer) => {
      dealer_ids.push(dealer.dealer_id);
    });

    this.props.savePermission(this.props.record.apk_id, JSON.stringify(dealer_ids));
    // this.setState({
    //   dealer_ids: dealer_ids
    // });
  }
  savePermission = () => {
    // console.log("dealer ids", this.state.dealer_ids);
    if (this.state.dealer_ids.length) {
      // console.log("saved successfully", this.props.record.apk_id);
      this.props.savePermission(this.props.record.apk_id, JSON.stringify(this.state.dealer_ids));

    }
  }

  
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let dealer_ids = []
    selectedRows.forEach(row => {
      // console.log("selected row", row)
      dealer_ids.push(row.dealer_id);
    });
    this.setState({
      dealer_ids: dealer_ids
    });
    // this.setState({ selectedRowKeys });
  }

  searchField = (originalData, fieldName, value) => {
    let demoData = [];

    if (value.length) {
      originalData.forEach((data) => {
        if (data[fieldName] !== undefined) {
          if ((typeof data[fieldName]) === 'string') {

            if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
              demoData.push(data);
            }
          } else if (data[fieldName] != null) {
            if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
              demoData.push(data);
            }
          }
          // else {
          //     // demoDevices.push(device);
          // }
        } else {
          demoData.push(data);
        }
      });

      return demoData;
    } else {
      return originalData;
    }
  }

  searchAllFields = (originalData, value) => {
    let demoData = [];

    if (value.length) {
      originalData.forEach((data) => {
        if (
            data['dealer_id'].toString().toUpperCase().includes(value.toUpperCase())
        ) {
          demoData.push(data);
        }
        else if (data['link_code'].toString().toUpperCase().includes(value.toUpperCase())){
          demoData.push(data);
        }
        else if (data['dealer_name'].toString().toUpperCase().includes(value.toUpperCase())){
          demoData.push(data);

        }
        else if (data['dealer_email'].toString().toUpperCase().includes(value.toUpperCase())){
          demoData.push(data);
        } else {
          // demoData.push(data);
        }
      });

      return demoData;
    } else {
      return originalData;
    }
  }
  handleSearch = (e, global=false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    console.log("fieldName", fieldName);
    console.log("fieldValue", fieldValue);
    console.log("global", global);
    if(global){
      let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
      console.log("searchedData", searchedData);
      this.setState({
        dealerList: searchedData
      });
    } else {

      let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
      console.log("searchedData", searchedData);
      this.setState({
        dealerList: searchedData
      });
    }
  }
  rejectPemission = (dealer_id) => {
    console.log("console", dealer_id);
  }

  renderDealer(list, permitted = false) {
    let data = [];
    if (permitted) {
      list.map((dealer) => {
        let is_included = this.props.record.permissions.includes(dealer.dealer_id);
        if (is_included) {
          data.push({
            'key': dealer.dealer_id,
            'row_key': dealer.dealer_id,
            'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
            'dealer_name': dealer.dealer_name ? dealer.dealer_name : 'N/A',
            'dealer_email': dealer.dealer_email ? dealer.dealer_email : 'N/A',
            'link_code': dealer.link_code ? dealer.link_code : 'N/A',
            'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
            'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
            'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
            'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A',
            'action':(<Button size="small" type="danger" onClick={()=>{
              this.rejectPemission(dealer.dealer_id)
            }}>Remove</Button>)
          })
        }
      });
    } else {
      list.map((dealer) => {

        data.push({
          'key': dealer.dealer_id,
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

    }
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
            <div className="gutter-box"><Button size="small" type="primary" onClick={() => { this.saveAllDealers() }}>Select All</Button></div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box search_heading">
              <Input.Search 
                placeholder="Dealer Email" 
                style={{ marginBottom: 0 }} 
                onKeyUp={
                  (e) => {
                      this.handleSearch(e, true)
                  }
                }
              />
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Table
            columns={this.listDealerCols}
            dataSource={this.renderDealer(this.state.dealerList, true)}
          />
        </Row>
        <Modal
          className="permiss_tabl"
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
            columns={this.addDealerCols}
            dealers={this.renderDealer(this.state.dealerList)}
            onSelectChange={this.onSelectChange}
            // selectedDealers={[]}
          />
        </Modal>
      </Fragment>
    )
  }
}

// export default Apk;
const mapStateToProps = ({ dealers }, props) => {
  console.log("dealer", dealers);
  console.log("permission", props.record);
  return {
    dealerList: dealers.dealers,
    record: props.record
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    savePermission: savePermission
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);