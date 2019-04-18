import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import { savePermission } from "../../../appRedux/actions/Apk";
import DealerList from "./DealerList";
import CircularProgress from "components/CircularProgress/index";


// export default 
class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDealersModal: false,
      dealer_ids: [],
      dealerList: [],
      permissions: [],
      hideDefaultSelections: false
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
      dealerList: this.props.dealerList,
      permissions: this.props.record.permissions
    })
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.record.apk_id !== nextProps.record.apk_id) {
      this.props.getAllDealers();
      this.setState({
        dealerList: this.props.dealerList,
        permissions: this.props.record.permissions
      })
    } else if (this.props.dealerList.length !== nextProps.dealerList.length) {
      this.setState({
        dealerList: nextProps.dealerList,
        permissions: this.props.record.permissions
      })
    }
  }

  showDealersModal = (visible) => {
    this.setState({
      showDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }
  saveAllDealers = () => {
    let dealer_ids = []
    this.props.dealerList.map((dealer) => {
      dealer_ids.push(dealer.dealer_id);
    });
    this.setState({ permissions: dealer_ids })

    this.props.savePermission(this.props.record.apk_id, JSON.stringify(dealer_ids), 'save');

    // this.setState({
    //   dealer_ids: dealer_ids
    // });
  }
  savePermission = () => {
    console.log(this.props.dealerList, "dealer ids", this.state.dealer_ids);

    if (this.state.dealer_ids.length) {
      this.props.dealerList.map((dealer) => {
        if (this.state.dealer_ids.includes(dealer.dealer_id)) {
          this.state.permissions.push(dealer.dealer_id);
        }
        else {
          if (this.state.permissions.includes(dealer.dealer_id)) {
            this.state.dealer_ids.push(dealer.dealer_id);

          }
        }
        this.setState({
          dealer_ids: [],
          permissions: this.state.permissions
        })
      })

      console.log(this.state.selectedRowKeys);
      this.props.savePermission(this.props.record.apk_id, JSON.stringify(this.state.selectedRowKeys), 'save');

      this.showDealersModal(false);

      // this.props.getAllDealers()

    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log(selectedRowKeys, 'selected', selectedRows);
    let dealer_ids = []
    selectedRows.forEach(row => {
      // console.log("selected row", row)
      dealer_ids.push(row.dealer_id);
    });
    this.setState({
      dealer_ids: dealer_ids,
      selectedRowKeys: selectedRowKeys
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
        else if (data['link_code'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);
        }
        else if (data['dealer_name'].toString().toUpperCase().includes(value.toUpperCase())) {
          demoData.push(data);

        }
        else if (data['dealer_email'].toString().toUpperCase().includes(value.toUpperCase())) {
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
  handleSearch = (e, global = false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    console.log("fieldName", fieldName);
    console.log("fieldValue", fieldValue);
    console.log("global", global);
    if (global) {
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
    let dealers = this.state.permissions;
    // console.log("permissions",dealers);
    var index = dealers.indexOf(dealer_id);
    console.log("array index", index);
    if (index > -1) {
      dealers.splice(index, 1);
    }
    // console.log("permissions",dealers);
    this.props.savePermission(this.props.record.apk_id, JSON.stringify([dealer_id]), 'delete');
    this.setState({
      dealerList: this.props.dealerList
    })

  }
  removeAllDealers = () => {
    let permittedDealers = this.state.permissions;
    console.log("permitted dealers", permittedDealers);

    this.setState({
      permissions: []
    })
    this.props.savePermission(this.props.record.apk_id, JSON.stringify(permittedDealers), 'delete');
    // this.state.dealerList.map((dealer)=>{
    //   console.log(dealer);
    // })
  }
  renderDealer(list, permitted = false) {
    let data = [];
    console.log(list);
    list.map((dealer) => {
      // console.log('object recrd', this.props.record.permissions);
      let is_included = this.state.permissions.includes(dealer.dealer_id);
      let common = {
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
      }

      if (permitted && is_included) {

        data.push({
          ...common,
          'action': (<Button size="small" type="danger" onClick={() => {
            this.rejectPemission(dealer.dealer_id)
          }}>Remove</Button>)
        })
      } else if (permitted === false && is_included === false) {
        data.push({ ...common })
      }
    });
    return (data);
  }
  render() {
    console.log('dealer state', this.state.dealerList);
    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box"><h2>Permission List</h2> </div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" style={{ width: '100%' }} type="primary" onClick={() => { this.showDealersModal(true) }}>Add</Button></div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" style={{ width: '100%' }} type="primary" onClick={() => { this.saveAllDealers() }}>Select All</Button></div>
          </Col>
          <Col className="gutter-row" span={2}>
            <div className="gutter-box"><Button size="small" style={{ width: '100%' }} type="danger" onClick={() => { this.removeAllDealers() }}>Remove All</Button></div>
          </Col>
          <Col className="gutter-row" span={4}>
            <div className="gutter-box search_heading">
              <Input.Search
                placeholder="Search"
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

          {
            this.props.spinloading ? <CircularProgress /> :

              <Table
                columns={this.listDealerCols}
                dataSource={this.renderDealer(this.state.dealerList, true)}
              />
          }
        </Row>
        <Modal
          width='665px'
          className="permiss_tabl"
          title="Add Dealer to permissions list for this App"
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
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>
      </Fragment >
    )
  }
}

// export default Apk;
const mapStateToProps = ({ dealers }, props) => {
  console.log("dealer", dealers);
  // console.log("permission", props.record);
  return {
    dealerList: dealers.dealers,
    record: props.record,
    spinloading: dealers.spinloading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    savePermission: savePermission
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);