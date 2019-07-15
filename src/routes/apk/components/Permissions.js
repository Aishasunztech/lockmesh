import React, { Component, Fragment } from 'react'
import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getAllDealers } from "../../../appRedux/actions/Dealers";
import { savePermission } from "../../../appRedux/actions/Apk";
import DealerList from "./DealerList";
import { Redirect } from 'react-router-dom';
import CircularProgress from "components/CircularProgress/index";

import { titleCase, convertToLang } from '../../utils/commonUtils';
import { dealerColsWithSearch } from '../../utils/columnsUtils';
import {
  DEALER_ID,
  DEALER_NAME,
  DEALER_EMAIL,
  DEALER_PIN,
  DEALER_DEVICES,
  DEALER_TOKENS,
  DEALER_ACTION
} from '../../../constants/DealerConstants';
import { Button_Remove, Button_Add, Button_AddAll, Button_AddExceptSelected, Button_RemoveAll, Button_RemoveExcept, Button_Save, Button_Cancel, Button_DeleteExceptSelected, Button_Yes, Button_No } from '../../../constants/ButtonConstants';
import { Permission_List, PERMISSION_Add_Modal_Title, PERMISSION_Remove_Modal_Title, PERMISSION_Add_Except_Selected_Modal_Title } from '../../../constants/ApkConstants';
import { Alert_Allow_Permission_Delaer, Alert_Remove_Permission_Delaer } from '../../../constants/Constants';

const confirm = Modal.confirm;
// export default 
class Permissions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDealersModal: false,
      dealer_ids: [],
      dealerList: [],
      dealerListForModal: [],
      permissions: [],
      hideDefaultSelections: false,
      removeSelectedDealersModal: false,
      addSelectedDealersModal: false,
      redirect: false,
      dealer_id: '',
      goToPage: '/dealer/dealer'
    }
    this.addDealerCols = dealerColsWithSearch(props.translation, true, this.handleSearch);
    this.addDealerColsInModal = dealerColsWithSearch(props.translation, true, this.handleSearchInModal);
    this.listDealerCols = dealerColsWithSearch(props.translation);

  }

  componentDidMount() {
    this.props.getAllDealers()
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList,
      permissions: this.props.record.permissions
    })
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.translation !== nextProps.translation) {
      this.addDealerCols = dealerColsWithSearch(nextProps.translation, true, this.handleSearch);
      this.addDealerColsInModal = dealerColsWithSearch(nextProps.translation, true, this.handleSearchInModal);
      this.listDealerCols = dealerColsWithSearch(nextProps.translation);
    }

    if (this.props.record.apk_id !== nextProps.record.apk_id) {
      this.props.getAllDealers();
      this.setState({
        dealerListForModal: this.props.dealerList,
        dealerList: this.props.dealerList,
        permissions: this.props.record.permissions
      })
    } else if (this.props.dealerList.length !== nextProps.dealerList.length) {
      this.setState({
        dealerListForModal: nextProps.dealerList,
        dealerList: nextProps.dealerList,
        permissions: this.props.record.permissions
      })
    }

  

  }

  showPermissionedDealersModal = (visible) => {
    this.setState({
      removeSelectedDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }

  showDealersModal = (visible) => {
    this.setState({
      showDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }

  addSelectedDealersModal = (visible) => {
    this.setState({
      addSelectedDealersModal: visible,
      dealer_ids: [],
      selectedRowKeys: []
    })
  }

  addSelectedDealers = () => {
    let permissions = this.state.permissions;
    let selectedRows = this.state.selectedRowKeys;
    // var dList = this.state.dealerList; arfan
    var dList = this.state.dealerListForModal;
    var add_ids = dList.filter(e => !permissions.includes(e.dealer_id));
    var addUnSelected = add_ids.filter(e => !selectedRows.includes(e.dealer_id));
    var addUnSelected_IDs = addUnSelected.map(v => v.dealer_id);
    permissions = [...permissions, ...addUnSelected_IDs];

    this.setState({
      permissions,
      addSelectedDealersModal: false
    })
    this.props.savePermission(this.props.record.apk_id, JSON.stringify(addUnSelected_IDs), 'save');
  }

  saveAllDealersConfirm = () => {
    let _this = this;
    confirm({
      title: convertToLang(this.props.translation[Alert_Allow_Permission_Delaer], Alert_Allow_Permission_Delaer),
      okText: convertToLang(this.props.translation[Button_Yes], Button_Yes),
      cancelText: convertToLang(this.props.translation[Button_No], Button_No),
      onOk() {
        _this.saveAllDealers()
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
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
    // console.log(this.props.dealerList, "dealer ids", this.state.dealer_ids);

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

      // console.log(this.state.selectedRowKeys);
      this.props.savePermission(this.props.record.apk_id, JSON.stringify(this.state.selectedRowKeys), 'save');

      this.showDealersModal(false);

      // this.props.getAllDealers()

    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(selectedRowKeys, 'selected', selectedRows);
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
          } else if (data[fieldName] !== null) {
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
    // console.log("fieldName", fieldName);
    // console.log("fieldValue", fieldValue);
    // console.log("global", global);
    if (global) {
      let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
      // console.log("searchedData", searchedData);
      this.setState({
        dealerList: searchedData
      });
    } else {

      let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
      // console.log("searchedData", searchedData);
      this.setState({
        dealerList: searchedData
      });
    }
  }


  handleSearchInModal = (e, global = false) => {

    let fieldName = e.target.name;
    let fieldValue = e.target.value;
    // console.log("fieldName", fieldName);
    // console.log("fieldValue", fieldValue);
    // console.log("global", global);
    if (global) {
      let searchedData = this.searchAllFields(this.props.dealerList, fieldValue)
      // console.log("searchedData", searchedData);
      this.setState({
        dealerListForModal: searchedData
      });
    } else {

      let searchedData = this.searchField(this.props.dealerList, fieldName, fieldValue);
      // console.log("searchedData", searchedData);
      this.setState({
        dealerListForModal: searchedData
      });
    }
  }



  rejectPemission = (dealer_id) => {
    let dealers = this.state.permissions;
    // console.log("permissions",dealers);
    var index = dealers.indexOf(dealer_id);
    // console.log("array index", index);
    if (index > -1) {
      dealers.splice(index, 1);
    }
    // console.log("permissions",dealers);
    this.props.savePermission(this.props.record.apk_id, JSON.stringify([dealer_id]), 'delete');
    this.setState({
      dealerList: this.props.dealerList,
      dealerListForModal: this.props.dealerList
    })

  }

  removeAllDealersConfirm = () => {
    let _this = this;
    confirm({
      title: convertToLang(this.props.translation[Alert_Remove_Permission_Delaer], Alert_Remove_Permission_Delaer),
      okText: convertToLang(this.props.translation[Button_Yes], Button_Yes),
      cancelText: convertToLang(this.props.translation[Button_No], Button_No),
      onOk() {
        _this.removeAllDealers();
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  removeAllDealers = () => {
    let permittedDealers = this.state.permissions;
    // console.log("permitted dealers", permittedDealers);

    this.setState({
      permissions: []
    })
    this.props.savePermission(this.props.record.apk_id, JSON.stringify(permittedDealers), 'delete');
    // this.state.dealerList.map((dealer)=>{
    //   console.log(dealer);
    // })
  }

  removeSelectedDealersModal = (visible) => {
    this.setState({
      removeSelectedDealersModal: visible
    })
  }

  removeSelectedDealers = () => {
    let permittedDealers = this.state.permissions;
    let selectedRows = this.state.selectedRowKeys;
    var remove_ids = permittedDealers.filter(e => !selectedRows.includes(e));

    this.setState({
      removeSelectedDealersModal: false,
      dealer_ids: [],
      permissions: selectedRows
    })

    this.props.savePermission(this.props.record.apk_id, JSON.stringify(remove_ids), 'delete');
  }

  goToDealer = (dealer) => {
    if (dealer.dealer_id !== 'null' && dealer.dealer_id !== null) {
      if (dealer.connected_dealer === 0 || dealer.connected_dealer === '' || dealer.connected_dealer === null) {
        this.setState({
          redirect: true,
          dealer_id: dealer.dealer_id,
          goToPage: '/dealer/dealer'
        })
      } else {
        this.setState({
          redirect: true,
          dealer_id: dealer.dealer_id,
          goToPage: '/dealer/sdealer'
        })
      }

    }
  }

  renderDealer(list, permitted = false) {
    let data = [];
    // console.log(list);
    let is_included
    list.map((dealer) => {
      // console.log('object recrd', dealer);
      if (this.state.permissions) {
        is_included = this.state.permissions.includes(dealer.dealer_id);

      }
      let common = {
        'key': dealer.dealer_id,
        'row_key': dealer.dealer_id,
        'dealer_id': (
          <div data-column="DEALER ID">
            {dealer.dealer_id ? dealer.dealer_id : 'N/A'}
          </div>
        ),
        'dealer_name': (
          // <div data-column="DEALER NAME">
            dealer.dealer_name ? <a onClick={() => { this.goToDealer(dealer) }}>{dealer.dealer_name}</a> : 'N/A'
          // </div>
        ),
        'dealer_email': (
          <div data-column="DEALER EMAIL">
            {dealer.dealer_email ? dealer.dealer_email : 'N/A'}
          </div>
        ),
        'link_code': (
          <div data-column="DEALER PIN">
            {dealer.link_code ? dealer.link_code : 'N/A'}
          </div>
        ),
        'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
        'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
        'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
        'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A',
      }

      if (permitted && is_included) {

        data.push(
          {
            ...common,
            'action':
              (
                <div data-column="ACTION">
                  <Button size="small" type="danger" onClick={() => {
                    this.rejectPemission(dealer.dealer_id)
                  }}> 
                  {convertToLang(this.props.translation[Button_Remove], Button_Remove)} 
                    </Button>
                </div>
              )
          }
        )
      } else if (permitted === false && is_included === false) {
        data.push({ ...common })
      }
    });
    return (data);
  }
  render() {

    const { redirect } = this.state;
    if (redirect && this.state.dealer_id !== '') {
      return <Redirect to={{
        pathname: this.state.goToPage,
        state: { id: this.state.dealer_id }
      }} />
    }
    // console.log('dealer state', this.state.dealerList);
    return (
      <Fragment>
        <Row gutter={16} style={{ margin: '10px 0px 6px' }}>
          <Col className="gutter-row" sm={10} xs={15} md={5}>
            <div className="gutter-box text-left">
              <h2>{convertToLang(this.props.translation[Permission_List], Permission_List)}</h2>
            </div>
          </Col>
          <Col className="gutter-row" sm={4} xs={9} md={3}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                onClick={() => { this.showDealersModal(true) }}>{convertToLang(this.props.translation[Button_Add], Button_Add)}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={6} xs={12} md={5}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                onClick={() => { this.addSelectedDealersModal(true) }}>{convertToLang(this.props.translation[Button_AddExceptSelected], Button_AddExceptSelected)}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={4} xs={12} md={3}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="primary"
                onClick={() => { this.saveAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_AddAll], Button_AddAll)}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={5} xs={12} md={3}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
                onClick={() => { this.removeAllDealersConfirm() }}>{convertToLang(this.props.translation[Button_RemoveAll], Button_RemoveAll)}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={7} xs={12} md={4}>
            <div className="gutter-box">
              <Button size="small" style={{ width: '100%', marginBottom: 16 }} type="danger"
                onClick={() => { this.showPermissionedDealersModal(true) }}>{convertToLang(this.props.translation[Button_RemoveExcept], Button_RemoveExcept)}</Button>
            </div>
          </Col>
          <Col className="gutter-row" sm={12} xs={24} md={8}>
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
        <Row gutter={24}>

          {
            this.props.spinloading ? <CircularProgress /> :
              <Col className="gutter-row" span={24}>
                <Table
                  className="mb-24 expand_rows"
                  columns={this.listDealerCols}
                  dataSource={this.renderDealer(this.state.dealerList, true)}
                  pagination={false}
                  translation={this.props.translation}
                />
              </Col>
          }
        </Row>
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation[PERMISSION_Add_Modal_Title], PERMISSION_Add_Modal_Title)}
          visible={this.state.showDealersModal}
          onOk={() => {
            this.savePermission()
          }}
          okText={convertToLang(this.props.translation[Button_Save], Button_Save)}
          cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
          onCancel={() => {
            this.showDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <DealerList
            columns={this.addDealerColsInModal}
            dealers={this.renderDealer(this.state.dealerListForModal)}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>

        {/*  remove except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation[PERMISSION_Remove_Modal_Title], PERMISSION_Remove_Modal_Title)}
          visible={this.state.removeSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_DeleteExceptSelected], Button_DeleteExceptSelected)}
          cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
          onOk={() => {
            this.removeSelectedDealers()
          }}
          onCancel={() => {
            this.removeSelectedDealersModal(false)
          }}
        >
          <DealerList
            columns={this.addDealerColsInModal}
            dealers={this.renderDealer(this.state.dealerListForModal, true)}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>

        {/*  Add Except selected */}
        <Modal
          maskClosable={false}
          width='665px'
          className="permiss_tabl"
          title={convertToLang(this.props.translation[PERMISSION_Add_Except_Selected_Modal_Title], PERMISSION_Add_Except_Selected_Modal_Title)}
          visible={this.state.addSelectedDealersModal}
          okText={convertToLang(this.props.translation[Button_AddExceptSelected], Button_AddExceptSelected)}
          cancelText={convertToLang(this.props.translation[Button_Cancel], Button_Cancel)}
          onOk={() => {
            this.addSelectedDealers()
          }}
          // okText="Add Except Selected"
          onCancel={() => {
            this.addSelectedDealersModal(false)
          }}
          bodyStyle={{ height: 500, overflow: "overlay" }}
        >
          <DealerList
            columns={this.addDealerColsInModal}
            dealers={this.renderDealer(this.state.dealerListForModal)}
            onSelectChange={this.onSelectChange}
            hideDefaultSelections={this.state.hideDefaultSelections}
            selectedRows={this.state.dealer_ids}
            selectedRowKeys={this.state.selectedRowKeys}
          // selectedDealers={[]}
          />
        </Modal>
      </Fragment>
    )
  }
}

// export default Apk;
const mapStateToProps = ({ dealers, settings }, props) => {
  // console.log("dealer", dealers);
  // console.log("permission", props.record);
  return {
    dealerList: dealers.dealers,
    record: props.record,
    spinloading: dealers.spinloading,
    translation: settings.translation
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getAllDealers: getAllDealers,
    savePermission: savePermission
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);