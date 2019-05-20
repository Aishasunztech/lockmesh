import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Transfer, Card, Avatar, Row, Col, Switch } from "antd";
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';
import { BASE_URL } from '../../constants/Application';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { transferApps, getMarketApps } from "../../appRedux/actions/AppMarket";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
import { ADMIN, DEALER } from "../../constants/Constants";
import styles from './appmarket.css'

class ApkMarket extends React.Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            apk_list: [],
            secureMarketList: [],
            availbleAppList: this.props.availbleAppList,
            targetKeys: [],
        }

        this.confirm = Modal.confirm;
    }
    renderList = (availbleAppList, secureMarketList) => {

        console.log(availbleAppList, ' objext data ', secureMarketList)
        let combinedList = [];
        if (this.props.user.type === ADMIN) {
            combinedList = availbleAppList
        } else {
            combinedList = [...availbleAppList, ...secureMarketList];
        }

        // let combinedList = availbleAppList;
        // console.log('combined', combinedList)
        combinedList.forEach((item) => {
            if (item.dealer_type === ADMIN) {
                item.disabled = true
            }
            else {
                item.disabled = false
            }
        })
        let apkList = combinedList.map((app, index) => {
            console.log(app);
            let data = {
                key: app.id,
                title: <Fragment> <Avatar size="medium" src={BASE_URL + "users/getFile/" + app.logo} /> <span> {app.app_name} </span> {(app.dealer_type !== undefined) ? <span><Switch defaultChecked = {app.is_restrict_uninstall} size='small' disabled={(this.props.user.type === ADMIN) ? false : app.disabled}></Switch></span> : null} </Fragment>,
                description: `${app.app_name + index + 1}`,
                disabled: (this.props.user.type === ADMIN) ? false : app.disabled,
                // className: (this.props.user.type !== ADMIN) ? 'sm_chk' : false
            }
            return data
        })
        return apkList

    }
    filterOption = (inputValue, option) => {
        // console.log(option, 'object', inputValue)
        return option.description.toLowerCase().indexOf(inputValue.toLowerCase()) > -1

    }

    handleChange = (targetKeys, direction, moveKeys) => {
        let marketApps = targetKeys;
        // console.log('target keys', targetKeys)
        this.props.transferApps(marketApps)
        this.setState({ targetKeys });

    }

    handleSearch = (dir, value) => {
        // console.log('search:', dir, value);
    };

    componentWillReceiveProps(nextProps) {
        //   console.log('will recive props', nextProps);

        if (this.props.apk_list !== nextProps.apk_list) {
            let keys = nextProps.secureMarketList.map((app) => {
                return app.id
            })
            // console.log(keys);
            this.setState({
                apk_list: nextProps.apk_list,
                secureMarketList: nextProps.secureMarketList,
                availbleAppList: nextProps.availbleAppList,
                targetKeys: keys
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let keys = this.props.secureMarketList.map((app, index) => {
                return app.id
            })
            this.setState({
                apk_list: this.props.apk_list,
                secureMarketList: this.props.secureMarketList,
                availbleAppList: this.props.availbleAppList,
                targetKeys: keys
            })
        }
    }
    componentWillMount() {
        this.props.getApkList();
        this.props.getMarketApps()
    }
    componentDidMount() {
    }


    render() {
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Card >
                            <Row>
                                <h4 className="sm_top_heading">Move <b>(Avaiable Apps)</b> to <b>(Secure Market)</b> to make them appear on your user's Secure Market apps on their devices</h4>
                                <Col md={12} sm={24} xs={24} className="text-center">
                                    <h4 className="sm_heading1"><b>Avaiable Apps</b></h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} className="text-center sec_market">
                                    <h4 className="sm_heading1"><b>Secure Market</b></h4>
                                </Col>
                            </Row>
                            <Transfer
                                titles={[
                                    (
                                        <div className="sm_heading2">
                                            <h4>
                                                <b>Avaiable Apps</b>
                                            </h4>
                                        </div>
                                    ),
                                    (
                                        <div className="sm_heading2">
                                            <h4>
                                                <b>Secure Market</b>
                                            </h4>
                                        </div>
                                    )
                                ]}
                                className="transfer_box"
                                dataSource={this.renderList(this.state.availbleAppList, this.state.secureMarketList)}
                                showSearch
                                filterOption={this.filterOption}
                                targetKeys={this.state.targetKeys}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                                onSelectChange={this.onSelectChange}
                                render={item => item.title}
                                locale={{ itemUnit: 'App', itemsUnit: 'Apps' }}

                            />
                        </Card>
                }
            </div>
        )

    }
}

const mapStateToProps = ({ apk_list, auth, appMarket }) => {
    console.log(appMarket.isloading);
    return {
        isloading: appMarket.isloading,
        apk_list: apk_list.apk_list,
        options: apk_list.options,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        user: auth.authUser,
        secureMarketList: appMarket.secureMarketList,
        availbleAppList: appMarket.availbleAppList
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getApkList: getApkList,
        changeAppStatus: changeAppStatus,
        deleteApk: deleteApk,
        editApk: editApk,
        getDropdown: getDropdown,
        postDropdown: postDropdown,
        postPagination: postPagination,
        getPagination: getPagination,
        transferApps: transferApps,
        getMarketApps: getMarketApps
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApkMarket);