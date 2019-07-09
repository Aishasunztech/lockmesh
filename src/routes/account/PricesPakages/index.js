import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Table, Card, Input, Icon } from 'antd';

import {
    getPrices, resetPrice, setPackage,
    saveIDPrices, setPrice, getPackages
} from "../../../appRedux/actions/Account";
import { sim, chat, pgp, vpn } from '../../../constants/Constants';
import AppFilter from '../../../components/AppFilter/index';
import PricesList from './components/pricesList';
import { componentSearch, getDealerStatus, titleCase, convertToLang } from '../../utils/commonUtils';
import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../../constants/TabConstants';

import {
    Tab_ID_PRICES,
    Tab_PACKAGES,
} from '../../../constants/TabConstants';

import {
    PACKAGE_NAME,
    PACKAGE_TERM,
    PACKAGE_SERVICES,
    PACKAGE_PRICE,
    PACKAGE_EXPIRY,
    PACKAGE_SEARCH,
    PACKAGE_SERVICE_NAME,
    PACKAGE_INCLUDED,
} from "../../../constants/AccountConstants";
import {
    Button_SET_PRICE,
} from '../../../constants/ButtonConstants'

import { isArray } from "util";
import PricingModal from './PricingModal';
let packagesCopy = [];

class Prices extends Component {
    constructor(props) {
        super(props)
        this.columns = [
            {
                title: "Sr.#",
                dataIndex: 'sr',
                key: 'sr',
                align: "center",
            },
            {
                title: (
                    <Input.Search
                        name="pkg_name"
                        key="pkg_name"
                        id="pkg_name"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[PACKAGE_NAME], PACKAGE_NAME)}
                    />
                ),
                dataIndex: 'pkg_name',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_NAME], PACKAGE_NAME),
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_name',
                        key: 'pkg_name',
                        sorter: (a, b) => { return a.pkg_name.localeCompare(b.pkg_name) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="pkg_term"
                        key="pkg_term"
                        id="pkg_term"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[PACKAGE_TERM], PACKAGE_TERM)}
                    />
                ),
                dataIndex: 'pkg_term',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_TERM], PACKAGE_TERM),
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_term',
                        key: 'pkg_term',
                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.pkg_term.localeCompare(b.pkg_term) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }, {
                title: (
                    <span>
                        {convertToLang(props.translation[PACKAGE_SERVICES], PACKAGE_SERVICES)}
                        {/* <Popover placement="top" >
                            <span className="helping_txt"><Icon type="info-circle" /></span>
                        </Popover> */}
                    </span>
                ),
                align: 'center',
                dataIndex: 'permission',
                key: 'permission',
                className: 'row '
            },
            {
                title: (
                    <Input.Search
                        name="pkg_price"
                        key="pkg_price"
                        id="pkg_price"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[PACKAGE_PRICE], PACKAGE_PRICE)}
                    />
                ),
                dataIndex: 'pkg_price',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_PRICE], PACKAGE_PRICE),
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_price',
                        key: 'pkg_price',
                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.pkg_price - b.pkg_price },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="pkg_expiry"
                        key="pkg_expiry"
                        id="pkg_expiry"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[PACKAGE_EXPIRY], PACKAGE_EXPIRY)}
                    />
                ),
                dataIndex: 'pkg_expiry',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_EXPIRY], PACKAGE_EXPIRY),
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_expiry',
                        key: 'pkg_expiry',
                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.pkg_expiry - b.pkg_expiry },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            }
        ];
        this.state = {
            pricing_modal: false,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
            tabSelected: sim,
            packages: [],
            copyStatus: true
        }
    }

    handleSearch = (e) => {

        let dumyPackages = [];
        if (this.state.copyStatus) {
            packagesCopy = this.state.packages;
            this.state.copyStatus = false;
        }

        if (e.target.value.length) {

            packagesCopy.forEach((dealer) => {

                if (dealer[e.target.name] !== undefined) {
                    if ((typeof dealer[e.target.name]) === 'string') {
                        if (dealer[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyPackages.push(dealer);
                        }
                    } else if (dealer[e.target.name] !== null) {
                        if (dealer[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            dumyPackages.push(dealer);
                        }
                        if (isArray(dealer[e.target.name])) {
                            if (dealer[e.target.name][0]['total'].includes(e.target.value)) {
                                dumyPackages.push(dealer);
                            }
                        }
                    } else {
                    }
                } else {
                    dumyPackages.push(dealer);
                }
            });

            this.setState({
                packages: dumyPackages
            })
        } else {
            this.setState({
                packages: packagesCopy
            })
        }
    }

    componentDidMount() {
        // this.props.getPrices(1);
        this.props.getPrices()
        // console.log(this.props.auth.dealerId, 'auth user is')
        this.props.getPackages()
        this.setState({
            prices: this.props.prices,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
            packages: this.props.packages,
        })
    }

    // componentDidUpdate(prevProps) {
    //     console.log('did update', this.props.packages)
    //     if (this.props !== prevProps) {
    //         this.setState({
    //             prices: this.props.prices,
    //             packages: this.props.packages,
    //             packagesCopy: this.props.packages
    //             // innerTabData: this.props.prices ? this.props.prices[this.state.tabSelected] : {},
    //         })
    //     }
    // }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.prices, 'next props of prices ')
        if (this.props !== nextProps) {
            // console.log(nextProps.prices, 'next props of prices ')

            this.setState({
                prices: nextProps.prices,
                packages: nextProps.packages,
                copyStatus: true
            })
        }
    }

    showPricingModal = (visible) => {
        this.setState({
            pricing_modal: visible
        })
    }


    renderList = () => {
        if (this.state.packages) {
            // console.log(this.state.packages)
            return this.state.packages.map((item, index) => {
                return {
                    key: item.id,
                    sr: ++index,
                    pkg_name: item.pkg_name,
                    pkg_price: "$" + item.pkg_price,
                    pkg_term: item.pkg_term,
                    pkg_expiry: item.pkg_expiry,
                    pkg_features: item.pkg_features ? JSON.parse(item.pkg_features) : {},
                }
            })
        }
        // console.log(this.props.packages, 'packages are')
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

    renderFeatures = (data) => {
        let features = [];
        if (Object.keys(data).length !== 0 && data.constructor === Object) {

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    console.log(key + " -> " + data[key]);
                    let name = key;
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                    let dump = {
                        name: name.replace(/_/g, ' '),
                        f_value: data[key] ? "yes" : 'No',
                        rowKey: key
                    }

                    features.push(dump)
                }
            }
        }
        // console.log(features, 'featues arte')
        return features
    }



    handleComponentSearch = (value) => {

        try {
            if (value.length) {
                if (this.state.copyStatus) {
                    packagesCopy = this.state.packages;
                    this.state.copyStatus = false;
                }
                let foundPackages = componentSearch(packagesCopy, value);
                if (foundPackages.length) {
                    this.setState({
                        packages: foundPackages,
                    })
                } else {
                    this.setState({
                        packages: []
                    })
                }
            } else {
                this.state.copyStatus = true;
                this.setState({
                    packages: packagesCopy,
                })
            }
        } catch (error) {
        }
    }

    tabChaged = (e) => {
        // this.props.innerTabChanged(e)
        this.setState({
            tabSelected: e,
            innerTabData: this.state.prices ? this.state.prices[e] : {}
        })
    }
    render() {
        // console.log(this.state.prices, 'prices are coming')
        return (
            <div>
                <div>
                    <AppFilter
                        // handleFilterOptions={this.handleFilterOptions}
                        searchPlaceholder={convertToLang(this.props.translation[PACKAGE_SEARCH], PACKAGE_SEARCH)}
                        addButtonText={convertToLang(this.props.translation[Button_SET_PRICE], Button_SET_PRICE)}
                        // defaultPagingValue={this.state.defaultPagingValue}
                        // selectedOptions={this.props.selectedOptions}
                        // options={this.state.options}
                        isAddButton={true}
                        setPrice={true}
                        // handlePolicyModal={this.handlePolicyModal2}

                        showPricingModal={this.showPricingModal}
                        // handleUserModal={this.handleUserModal}
                        // handleCheckChange={this.handleCheckChange}
                        // handlePagination={this.handlePagination}
                        handleComponentSearch={this.handleComponentSearch}

                    />

                    <Card>

                        <Tabs
                            // className="set_price"
                            type="card"
                            onChange={(e) => this.setState({ outerTab: e })}
                        >
                            <Tabs.TabPane tab={convertToLang(this.props.translation[Tab_ID_PRICES], Tab_ID_PRICES)} key="1">
                                <div>
                                    <Tabs
                                        tabPosition={'left'}
                                        type="card"
                                        onChange={(e) => this.tabChaged(e)}
                                        className="price_table_tabs"
                                    >
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], TAB_SIM_ID)} key={sim} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], TAB_CHAT_ID)} key={chat} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_PGP_EMAIL], TAB_PGP_EMAIL)} key={pgp} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_VPN], TAB_VPN)} key={vpn} >

                                        </Tabs.TabPane>
                                    </Tabs>
                                    <div className="price_table">
                                        <PricesList
                                            data={this.state.prices ? this.state.prices[this.state.tabSelected] : {}}
                                            tabSelected={this.state.tabSelected}
                                            translation={this.props.translation}
                                        />
                                    </div>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={convertToLang(this.props.translation[Tab_PACKAGES], Tab_PACKAGES)} key="2">
                                <Table
                                    columns={this.columns}
                                    dataSource={this.renderList()}
                                    bordered
                                    pagination={false}
                                    expandIconAsCell={false}
                                    expandIcon={(props) => this.customExpandIcon(props)}
                                    expandIconColumnIndex={3}
                                    expandedRowRender={record => {
                                        if (Object.keys(record.pkg_features).length !== 0 && record.pkg_features.constructor === Object) {
                                            return (
                                                <div>
                                                    <Table
                                                        columns={[
                                                            { title: convertToLang(this.props.translation[PACKAGE_SERVICE_NAME], PACKAGE_SERVICE_NAME), dataIndex: 'name', key: 'name', align: 'center' },
                                                            { title: convertToLang(this.props.translation[PACKAGE_INCLUDED], PACKAGE_INCLUDED), key: 'f_value', dataIndex: 'f_value', align: 'center' }]}
                                                        dataSource={this.renderFeatures(record.pkg_features)}
                                                        pagination={false}
                                                    />
                                                </div>)
                                        } else {
                                            return (
                                                <div>

                                                </div>
                                            )
                                        }


                                    }}

                                />
                            </Tabs.TabPane>
                        </Tabs>

                    </Card>
                </div>

                <PricingModal
                    showPricingModal={this.showPricingModal}
                    pricing_modal={this.state.pricing_modal}
                    // LabelName={this.props.whiteLabelInfo.name}
                    saveIDPrices={this.props.saveIDPrices}
                    // whitelabel_id={this.props.whiteLabelInfo.id}
                    setPackage={this.props.setPackage}
                    prices={this.state.prices}
                    setPrice={this.props.setPrice}
                    isPriceChanged={this.props.isPriceChanged}
                    resetPrice={this.props.resetPrice}
                    // whitelabel_id={this.props.id}
                    dealer_id={this.props.auth.dealerId}
                    translation={this.props.translation}
                />
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getPrices: getPrices,
        saveIDPrices: saveIDPrices,
        setPackage: setPackage,
        resetPrice: resetPrice,
        setPrice: setPrice,
        getPackages: getPackages
    }, dispatch)
}


var mapStateToProps = ({ account, auth, settings }, otherprops) => {
    // console.log(auth.authUser, ' authUser props are')
    return {
        auth: auth.authUser,
        prices: account.prices,
        packages: account.packages,
        isPriceChanged: account.isPriceChanged,
        translation: settings.translation,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Prices);