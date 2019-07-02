import React, { Component } from 'react'

import {
    Tabs
} from "antd";

import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../constants/TabConstants';
import { sim, chat, pgp, vpn } from '../../constants/Constants';
import { CLEAR_APPLICATIONS } from '../../constants/ActionTypes';
import SimTabContent from "../../routes/account/PricesPakages/components/SimTabContent";
import { convertToLang } from '../../routes/utils/commonUtils';
const { TabPane } = Tabs;

export default class ItemTabs extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tabSelected: sim,
            innerTabData: this.props.prices ? this.props.prices[sim] : {},
        }
    }
    tabChaged = (e) => {
        this.props.innerTabChanged(e)
        this.setState({
            tabSelected: e,
            innerTabData: this.props.prices ? this.props.prices[e] : {}
        })
    }
    render() {
        console.log(this.props.prices, 'item tab pos', this.state.innerTabData, this.state.tabSelected)
        return (
            <div>
                <Tabs
                    tabPosition={'left'}
                    type="card"
                    onChange={(e) => this.tabChaged(e)}
                    style={{ width: '15%', float: 'left' }}
                >
                    <TabPane tab={convertToLang(this.props.translation[TAB_SIM_ID], TAB_SIM_ID)} key={sim} >

                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_CHAT_ID], TAB_CHAT_ID)} key={chat} >
                        {/* {this.props.simTabContent} */}

                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_PGP_EMAIL], TAB_PGP_EMAIL)} key={pgp} >

                        {/* {this.props.simTabContent} */}
                    </TabPane>
                    <TabPane tab={convertToLang(this.props.translation[TAB_VPN], TAB_VPN)} key={vpn} >

                        {/* {this.props.simTabContent} */}
                    </TabPane>
                </Tabs>
                <div style={{ width: '83%', float: 'right' }}>
                    <SimTabContent
                        setPrice={this.props.setPrice}
                        innerTab={this.state.tabSelected}
                        innerTabData={this.props.prices ? this.props.prices[this.state.tabSelected] : {}}
                        translation = {this.props.translation}
                    />
                </div>

            </div>
        )
    }
}
