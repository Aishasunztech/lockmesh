import React, { Component, Row, Col } from 'react'

import {
    Button, Modal, Tabs
} from "antd";

import ItemsTab from "../../../components/ItemsTab/index";

import PackagePricingForm from './components/PackagePricingForm';
import { sim, chat, pgp, vpn, pkg_features } from '../../../constants/Constants';
import {
    Tab_SET_ID_PRICES,
    Tab_SET_PACKAGES_PRICES,
} from '../../../constants/TabConstants';
import {
    Button_SET_PRICE,
    Button_Save
} from '../../../constants/ButtonConstants'
import { convertToLang } from '../../utils/commonUtils';


const { TabPane } = Tabs;
export default class PricingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            innerTab: sim,
            [sim]: {},
            [chat]: {},
            [pgp]: {},
            [vpn]: {},
            pkg_features: pkg_features,
            outerTab: '1',
            pkgName: '',
            pkgTerms: '',
            pkgPrice: 0
        }

    }

    componentDidMount() {

    }

    onTabChange = () => {

    }

    handleSubmit = () => {

        if (this.state.outerTab === '1') {
            let data = this.props.prices
            // console.log(this.props.whitelabel_id)

            this.props.saveIDPrices({ data: data, dealer_id: this.props.dealer_id })
            this.props.showPricingModal(false);
            this.setState({
                [sim]: {},
                [chat]: {},
                [pgp]: {},
                [vpn]: {},
                innerTab: sim
            })
        } else if (this.state.outerTab === '2') {
            console.log('ref is hte ', this.form);
            // this.form.props.form.validateFields((err, values) => {
            // if (!err) {
            // console.log('no error found', values);

            if (this.state.pkg_features && this.state.pkgName && this.state.pkgTerms && this.state.pkgName != '' && this.state.pkgTerms != '') {
                let data = {
                    pkgName: this.state.pkgName,
                    pkgTerm: this.state.pkgTerms,
                    pkgPrice: this.state.pkgPrice,
                    pkgFeatures: this.state.pkg_features,
                    dealer_id: this.props.dealer_id
                }
                this.props.setPackage(data);
                this.props.showPricingModal(false);
                this.setState({
                    pkgPrice: 0,
                    pkg_features: pkg_features,
                    pkgTerm: '',
                    pkgName: '',
                })
            }
            // }
            // })
        }

        // console.log('submit data is', data)

    }

    setPkgDetail = (value, field, is_pkg_feature = false) => {
        if (is_pkg_feature) {
            console.log(this.state.pkg_features, 'pkg features')
            this.state.pkg_features[field] = value
        } else {
            this.state[field] = value
        }
    }

    setPrice = (price, field, price_for) => {

        if (price > 0) {
            this.state[price_for][field] = price
        }
        // console.log('price', price, 'field', field, 'price_for', price_for)
    }

    innerTabChanged = (e) => {
        this.setState({
            innerTab: e,
        })
    }

    render() {
        console.log(this.props.isPriceChanged, 'ischanged price')
        // console.log(sim, this.state[sim], 'sim object ',this.state[chat], 'chat object ',this.state[pgp], 'pgp object',this.state[vpn], 'sim object',)
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                title={<div>{convertToLang(this.props.translation[Button_SET_PRICE], Button_SET_PRICE)}</div>}
                visible={this.props.pricing_modal}
                onOk={this.handleSubmit}
                okText={convertToLang(this.props.translation[Button_Save], Button_Save)}
                okButtonProps={{ disabled: this.state.outerTab == '1' ? !this.props.isPriceChanged : false }}
                onCancel={() => { this.props.showPricingModal(false); this.props.resetPrice() }}
                // footer={null}
                width='650px'
                className="set_price_modal"
            >
                <Tabs
                    className="set_price"
                    type="card"
                    onChange={(e) => this.setState({ outerTab: e })}
                >
                    <TabPane tab={convertToLang(this.props.translation[Tab_SET_ID_PRICES], Tab_SET_ID_PRICES)} key="1">
                        <ItemsTab
                            innerTabChanged={this.innerTabChanged}
                            setPrice={this.props.setPrice}
                            prices={this.props.prices}
                            translation={this.props.translation}
                        />
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[Tab_SET_PACKAGES_PRICES], Tab_SET_PACKAGES_PRICES)} key="2">
                        <PackagePricingForm
                            showPricingModal={this.props.showPricingModal}
                            setPkgDetail={this.setPkgDetail}
                            wrappedComponentRef={(form) => this.form = form}
                            translation={this.props.translation}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        )
    }
}
