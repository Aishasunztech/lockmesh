import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Tabs, Table, Card, Input } from 'antd';

import {
       getPrices, resetPrice, setPackage,
    saveIDPrices, setPrice, getPackages
} from "../../../appRedux/actions/Account";
import { sim, chat, pgp, vpn } from '../../../constants/Constants';
import AppFilter from '../../../components/AppFilter/index';
import PricesList from './components/pricesList';
import { componentSearch, getDealerStatus, titleCase } from '../../utils/commonUtils';
import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../../constants/LabelConstants';
import { isArray } from "util";
import PricingModal from './PricingModal';    
let packagesCopy=[];

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
                        placeholder='PACKAGE NAME'
                    />
                ),
                dataIndex: 'pkg_name',
                className: '',
                children: [
                    {
                        title: 'PACKAGE NAME',
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
                        placeholder='PACKAGE TERM'
                    />
                ),
                dataIndex: 'pkg_term',
                className: '',
                children: [
                    {
                        title: 'PACKAGE TERM',
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
                    <Input.Search
                        name="pkg_price"
                        key="pkg_price"
                        id="pkg_price"
                        className="search_heading"
                        onKeyUp={this.handleSearch}
                        autoComplete="new-password"
                        placeholder='PACKAGE PRICE'
                    />
                ),
                dataIndex: 'pkg_price',
                className: '',
                children: [
                    {
                        title: 'PACKAGE PRICE',
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
                        placeholder='EXPIRY'
                    />
                ),
                dataIndex: 'pkg_expiry',
                className: '',
                children: [
                    {
                        title: 'EXPIRY',
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
        if(this.state.copyStatus){
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
                    } else if (dealer[e.target.name] != null) {
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
        this.props.getPrices(1);
        // this.props.getPackages(this.props.id)
        this.props.getPackages(1)
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

    componentWillReceiveProps(nextProps){
        if (this.props !== nextProps) {
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
           return this.state.packages.map((item, index) => {
                return{
                    key: item.id,
                    sr: ++index,
                    pkg_name: item.pkg_name,
                    pkg_price: "$"+item.pkg_price,
                    pkg_term: item.pkg_term,
                    pkg_expiry: item.pkg_expiry
                }
            })
        }
            // console.log(this.props.packages, 'packages are')
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
        return (
            <div>
                <div>
                    <AppFilter
                        // handleFilterOptions={this.handleFilterOptions}
                        searchPlaceholder="Search Packages"
                        addButtonText={"Set Price"}
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
                            <Tabs.TabPane tab="ID Prices" key="1">
                                <div>
                                    <Tabs
                                        tabPosition={'left'}
                                        type="card"
                                        onChange={(e) => this.tabChaged(e)}
                                        style={{ width: '10%', float: 'left' }}
                                    >
                                        <Tabs.TabPane tab={TAB_SIM_ID} key={sim} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={TAB_CHAT_ID} key={chat} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={TAB_PGP_EMAIL} key={pgp} >

                                        </Tabs.TabPane>
                                        <Tabs.TabPane tab={TAB_VPN} key={vpn} >

                                        </Tabs.TabPane>
                                    </Tabs>
                                    <div style={{ width: '90%', float: 'right' }}>
                                        <PricesList
                                            data={this.state.prices ? this.state.prices[this.state.tabSelected] : {}}
                                            tabSelected={this.state.tabSelected}

                                        />
                                    </div>
                                </div>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Packages" key="2">
                                <Table
                                    columns={this.columns}
                                    dataSource={this.renderList()}
                                    bordered
                                    pagination={false}

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
                    prices={this.props.prices}
                    setPrice={this.props.setPrice}
                    isPriceChanged={this.props.isPriceChanged}
                    resetPrice={this.props.resetPrice}
                    // whitelabel_id={this.props.id}
                    dealer_id={1}
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


var mapStateToProps = ({ account, authUser }, otherprops) => {
    console.log(authUser, ' authUser props are')
    return {
        prices: account.prices,
        packages: account.packages,
        isPriceChanged: account.isPriceChanged,

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Prices);