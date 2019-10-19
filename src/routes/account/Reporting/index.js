import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon, Tabs, Table, InputNumber, Form } from "antd";
import Invoice from "./components/Invoice";
import ProductInventory  from './components/ProductInventory';
import HardwareInventory  from './components/HardwareInventory';
import PaymentHistory  from './components/PaymentHistory';
import { getAllDealers, generateProductReport, generateInvoiceReport, generatePaymentHistoryReport } from '../../../appRedux/actions/';
import styles from './reporting.css'


const TabPane = Tabs.TabPane;

class Reporting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      visible: false,
      tabselect: '1',
      innerTabSelect: '1',
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  componentDidMount() {
    this.props.getDealerList()
  }

  componentWillReceiveProps(nextProps) {
  }

  handleChangeTab = (value) => {
    this.setState({
      tabselect: value
    })
  };


  render() {
    const Search = Input.Search;
      return (

        <div>
          {
              <div style={{ marginTop: 50 }}>
                <Tabs defaultActiveKey="1" type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.handleChangeTab}>
                  <TabPane tab="PRODUCT INVENTORY" key="1">
                    <ProductInventory
                      dealerList={this.props.dealerList}
                      translation={this.props.translation}
                      productReport={this.props.productReport}
                      productType={this.props.productType}
                      generateProductReport={this.props.generateProductReport}

                    />
                  </TabPane>

                  <TabPane tab="HARDWARE INVENTORY" key="2">
                    <HardwareInventory
                      dealerList={this.props.dealerList}
                      translation={this.props.translation}
                    />
                  </TabPane>

                  <TabPane tab="PAYMENT HISTORY" key="3">
                    <PaymentHistory
                      dealerList={this.props.dealerList}
                      translation={this.props.translation}
                      generatePaymentHistoryReport={this.props.generatePaymentHistoryReport}
                      paymentHistoryReport={this.props.paymentHistoryReport}
                    />
                  </TabPane>

                  <TabPane tab="INVOICES" key="4">
                    <Invoice
                      dealerList={this.props.dealerList}
                      translation={this.props.translation}
                      generateInvoiceReport={this.props.generateInvoiceReport}
                      invoiceReport={this.props.invoiceReport}
                    />
                  </TabPane>
                </Tabs>
              </div>
          }
        </div>
      );
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {

      }
    });
  }
}



var mapStateToProps = ({ dealers, settings, reporting  }) => {

  console.log(reporting)
  return {
    dealerList: dealers.dealers,
    productReport: reporting.productData,
    invoiceReport: reporting.invoiceData,
    paymentHistoryReport: reporting.paymentHistoryData,
    productType: reporting.productType,
    translation: settings.translation,
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    getDealerList: getAllDealers,
    generateProductReport: generateProductReport,
    generateInvoiceReport: generateInvoiceReport,
    generatePaymentHistoryReport: generatePaymentHistoryReport,
  }, dispatch);
};


export default connect(mapStateToProps, mapDispatchToProps)(Reporting)
