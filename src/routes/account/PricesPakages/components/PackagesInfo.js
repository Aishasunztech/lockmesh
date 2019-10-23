import React, { Component, Fragment } from 'react';
import { Tabs, Table, Switch, Row, Col, Avatar } from 'antd';
import Permissions from "../../../utils/Components/Permissions";
import { convertToLang } from '../../../utils/commonUtils';
import { Tab_POLICY_SELECTED_APPS, Tab_POLICY_Dealer_PERMISSIONS, Guest, ENCRYPTED, ENABLE } from '../../../../constants/TabConstants';


import {
    PACKAGE_SERVICE_NAME,
    PACKAGE_INCLUDED,
} from "../../../../constants/AccountConstants";


const TabPane = Tabs.TabPane;

export default class PackagesInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: '1',
            policy: [],
            system_setting_app: '',
            secure_setting_app: '',
        }

    }

    componentDidMount() {

        this.setState({
            selected: this.props.selected,
            package: this.props.package,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.selected !== nextProps.selected) {
            // console.log(this.props, 'object updated', nextProps)
            this.setState({
                selected: nextProps.selected,
            })
        }

        if (this.props.package !== nextProps.package) {

            this.setState({
                package: nextProps.package,
            })
        }
    }

    callback = (key) => {
        this.setState({ selected: key })
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
                        key: key.id,
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


    render() {
        return (
            <Fragment>
                <Tabs className="exp_tabs_policy" onChange={this.callback} activeKey={this.state.selected} type="card">
                    <Tabs.TabPane tab={convertToLang(this.props.translation[""], "SERVICES")} key="1" >
                        <Table
                            columns={[
                                { title: convertToLang(this.props.translation[PACKAGE_SERVICE_NAME], "SERVICE NAME"), dataIndex: 'name', key: 'name', align: 'center' },
                                { title: convertToLang(this.props.translation[PACKAGE_INCLUDED], "INCLUDED"), key: 'f_value', dataIndex: 'f_value', align: 'center' }]}
                            dataSource={this.renderFeatures(this.props.package.pkg_features)}
                            pagination={false}
                        />
                    </Tabs.TabPane>
                    <TabPane tab={convertToLang(this.props.translation[Tab_POLICY_Dealer_PERMISSIONS], "Dealer PERMISSIONS")} key="2">
                        <Permissions
                            record={this.props.package}
                            savePermissionAction={this.props.savePermission}
                            translation={this.props.translation}
                        />
                    </TabPane>
                </Tabs>
            </Fragment>
        )
    }
}