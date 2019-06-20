import React, { Component } from 'react'

import {
    Tabs
} from "antd";

import {
    TAB_SIM_ID,
    TAB_CHAT_ID,
    TAB_PGP_EMAIL,
    TAB_VPN
} from '../../constants/LabelConstants';
import {sim, chat, pgp, vpn} from '../../constants/Constants';
import { CLEAR_APPLICATIONS } from '../../constants/ActionTypes';
const { TabPane } = Tabs;

export default class ItemTabs extends Component {

    tabChaged = (e) => {
        console.log(e,' value is');
        this.props.innerTabChanged(e)
        // this.setState({tabSelected: e})
    }
    render() {
       
        return (
            <Tabs
                tabPosition={'left'}
                type="card"
                onChange={(e)=> this.tabChaged(e)}
            >
                <TabPane tab={TAB_SIM_ID} key={sim} >
                    {this.props.simTabContent}
                </TabPane>
                <TabPane tab={TAB_CHAT_ID} key={chat} >
                    {this.props.simTabContent}
                </TabPane>
                <TabPane tab={TAB_PGP_EMAIL} key={pgp} >
                    {this.props.simTabContent}
                </TabPane>
                <TabPane tab={TAB_VPN} key={vpn} >
                    {this.props.simTabContent}
                </TabPane>
            </Tabs>
        )
    }
}
