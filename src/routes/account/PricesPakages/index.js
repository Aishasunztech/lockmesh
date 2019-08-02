import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Table, Card, Input, Icon } from 'antd';

import {
    getPrices, resetPrice, setPackage,
    saveIDPrices, setPrice, getPackages
} from "../../../appRedux/actions/Account";
import PackagesInfo from './components/PackagesInfo';
import { sim, chat, pgp, vpn } from '../../../constants/Constants';
import AppFilter from '../../../components/AppFilter/index';
import PricesList from './components/pricesList';
import { componentSearch, getDealerStatus, titleCase, convertToLang } from '../../utils/commonUtils';
import { Tab_All } from '../../../constants/TabConstants';
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
                render: (text, record, index) => ++index,
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
                        placeholder={convertToLang(props.translation[PACKAGE_NAME], "PACKAGE NAME")}
                    />
                ),
                dataIndex: 'pkg_name',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_NAME], "PACKAGE NAME"),
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
                        placeholder={convertToLang(props.translation[PACKAGE_TERM], "PACKAGE TERM")}
                    />
                ),
                dataIndex: 'pkg_term',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_TERM], "PACKAGE TERM"),
                        align: "center",
                        className: '',
                        dataIndex: 'pkg_term',
                        key: 'pkg_term',
                        // ...this.getColumnSearchProps('status'),
                        sorter: (a, b) => { return a.pkg_term.localeCompare(b.pkg_term) },

                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
            {
                title: (
                    <span>
                        {convertToLang(props.translation[PACKAGE_SERVICES], "PACKAGE SERVICES")}
                    </span>
                ),
                align: 'center',
                dataIndex: 'services',
                key: 'services',
                className: 'row '
            },
            {
                title: (
                    <span>
                        {convertToLang(props.translation[""], "PERMISSIONS")}
                        {/* <Popover placement="top" content='dumy'>
                                <span className="helping_txt"><Icon type="info-circle" /></span>
                            </Popover> */}
                    </span>),
                dataIndex: 'permission',
                key: 'permission',
                className: 'row'
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
                        placeholder={convertToLang(props.translation[PACKAGE_PRICE], "PACKAGE PRICE")}
                    />
                ),
                dataIndex: 'pkg_price',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_PRICE], "PACKAGE PRICE"),
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
                        placeholder={convertToLang(props.translation[PACKAGE_EXPIRY], "PACKAGE EXPIRY")}
                    />
                ),
                dataIndex: 'pkg_expiry',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[PACKAGE_EXPIRY], "PACKAGE EXPIRY"),
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
            copyStatus: true,
            expandedRowKeys: [],
            expandTabSelected: [],
            expandedByCustom: [],
        }
    }


    expandRow = (rowId, btnof, expandedByCustom = false) => {
        console.log(rowId, btnof, expandedByCustom);
        const expandedCustomArray = [...this.state.expandedByCustom];
        expandedCustomArray[rowId] = expandedByCustom;
        this.setState({
            expandedByCustom: expandedCustomArray
        });

        if (this.state.expandedRowKeys.includes(rowId)) {
            var index = this.state.expandedRowKeys.indexOf(rowId);
            if (index !== -1) this.state.expandedRowKeys.splice(index, 1);
            // console.log('tab is ', btnof)
            this.setState({
                expandedRowKeys: this.state.expandedRowKeys,

            })
        }
        else {
            this.state.expandedRowKeys.push(rowId);

            const newItems = [...this.state.expandTabSelected];
            newItems[rowId] = (btnof === 'services') ? '1' : '2';
            this.setState({
                expandedRowKeys: this.state.expandedRowKeys,
                expandTabSelected: newItems,
                [rowId]: null,
                // isSwitch: btnof === 'edit' ? true : false,
                savePolicyButton: false

            })
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
        // console.log(nextProps.prices, 'next props of prices ')
        if (this.props.prices !== nextProps.prices && this.state.prices !== nextProps.prices) {
            // console.log("props");
            this.setState({
                prices: nextProps.prices,
                copyStatus: true
            })
        }
        if (this.props.packages.length !== nextProps.packages.length) {
            this.setState({
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
            let i = 0
            return this.state.packages.map((item, index) => {
                return {
                    id: item.id,
                    key: item.id,
                    rowKey: index,
                    sr: ++i,
                    pkg_name: item.pkg_name,
                    services:
                        <Fragment>
                            <a onClick={() => {
                                console.log(index)
                                this.expandRow(index, 'services', true)
                                // console.log('table cosn', this.refs.policy_table)
                                // this.refs.policy_table.props.onExpand()
                            }}>
                                <Icon type="arrow-down" style={{ fontSize: 15 }} />
                            </a>
                            <span className="exp_txt">{convertToLang(this.props.translation[""], "Expand")}</span>
                        </Fragment>
                    ,
                    permission: <span style={{ fontSize: 15, fontWeight: 400 }}>{(item.permission_count == 'All') ? convertToLang(this.props.translation[Tab_All], "All") : item.permission_count > 0 ? item.permission_count : 0}</span>,
                    pkg_price: "$" + item.pkg_price,
                    pkg_term: item.pkg_term,
                    pkg_expiry: item.pkg_expiry,
                    pkg_features: item.pkg_features ? JSON.parse(item.pkg_features) : {},
                    permissions: (item.dealer_permission !== undefined && item.dealer_permission !== null) ? item.dealer_permission : [],

                }
            })
        }
        // console.log(this.props.packages, 'packages are')
    }

    // customExpandIcon(props) {
    //     if (props.expanded) {
    //         return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
    //             props.onExpand(props.record, e);
    //         }}><Icon type="caret-down" /></a>
    //     } else {

    //         return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
    //             props.onExpand(props.record, e);
    //         }}><Icon type="caret-right" /></a>
    //     }
    // }

    customExpandIcon(props) {
        // console.log(props);
        if (props.expanded) {
            if (this.state.expandedByCustom[props.record.rowKey]) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-down" /></a>
            }
        } else {
            if (this.state.expandedByCustom[props.record.rowKey]) {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>
            } else {
                return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                    this.expandRow(props.record.rowKey, 'permission', false)
                }}><Icon type="caret-right" /></a>

            }
        }
    }

    renderFeatures = (data) => {
        let features = [];
        if (Object.keys(data).length !== 0 && data.constructor === Object) {

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    // console.log(key + " -> " + data[key]);
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
        // console.log(this.state.expandedRowKeys, 'prices are coming')
        return (
            <div>
                <div>
                    <AppFilter
                        // handleFilterOptions={this.handleFilterOptions}
                        searchPlaceholder={convertToLang(this.props.translation[PACKAGE_SEARCH], "PACKAGE SEARCH")}
                        addButtonText={convertToLang(this.props.translation[Button_SET_PRICE], "Set Price")}
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
                            <Tabs.TabPane tab={convertToLang(this.props.translation[Tab_ID_PRICES], "ID Prices")} key="1">
                                <div>
                                    <Tabs
                                        tabPosition={'left'}
                                        type="card"
                                        onChange={(e) => this.tabChaged(e)}
                                        className="price_table_tabs"
                                    >
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "SIM")} key={sim} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], "CHAT")} key={chat} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_PGP_EMAIL], "PGP")} key={pgp} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_VPN], "VPN")} key={vpn} >

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
                            <Tabs.TabPane tab={convertToLang(this.props.translation[Tab_PACKAGES], "PACKAGES")} key="2">
                                <Table
                                    className="devices policy_expand"
                                    rowClassName={(record, index) => this.state.expandedRowKeys.includes(index) ? 'exp_row' : ''}
                                    size="default"
                                    bordered
                                    expandIcon={(props) => this.customExpandIcon(props)}
                                    // onExpand={this.onExpandRow}
                                    expandedRowRender={(record) => {
                                        // console.log("expandTabSelected", record);
                                        // console.log("table row", this.state.expandTabSelected[record.rowKey]);
                                        if (Object.keys(record.pkg_features).length !== 0 && record.pkg_features.constructor === Object) {
                                            return (
                                                <div>
                                                    <PackagesInfo
                                                        selected={this.state.expandTabSelected[record.rowKey]}
                                                        package={record}
                                                        translation={this.props.translation}

                                                    />
                                                    {/* 

                                                    <Tabs activeKey={this.state.expandTabSelected[record.rowKey]} >
                                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "SERVICES")} key="1" >
                                                            <Table
                                                                columns={[
                                                                    { title: convertToLang(this.props.translation[PACKAGE_SERVICE_NAME], "SERVICE NAME"), dataIndex: 'name', key: 'name', align: 'center' },
                                                                    { title: convertToLang(this.props.translation[PACKAGE_INCLUDED], "INCLUDED"), key: 'f_value', dataIndex: 'f_value', align: 'center' }]}
                                                                dataSource={this.renderFeatures(record.pkg_features)}
                                                                pagination={false}
                                                            />
                                                        </Tabs.TabPane>
                                                        <Tabs.TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], "PERMISSIONS")} key="2" >

                                                        </Tabs.TabPane>
                                                    </Tabs> */}

                                                </div>)
                                        } else {
                                            return (
                                                <div>
                                                </div>
                                            )
                                        }
                                    }}
                                    // expandIconColumnIndex={1}         
                                    expandIconColumnIndex={4}
                                    expandedRowKeys={this.state.expandedRowKeys}
                                    expandIconAsCell={false}
                                    columns={this.columns}
                                    onChange={this.props.onChangeTableSorting}
                                    dataSource={this.renderList()}
                                    pagination={false
                                        // { pageSize: this.state.pagination, size: "midddle" }
                                    }
                                    rowKey="policy_list"
                                    ref='policy_table'
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
    // console.log(account.isPriceChanged, ' authUser props are')
    return {
        auth: auth.authUser,
        prices: account.prices,
        packages: account.packages,
        isPriceChanged: account.isPriceChanged,
        translation: settings.translation,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Prices);