import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Transfer, Card, Avatar, Row, Col, Switch } from "antd";
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';
import { BASE_URL } from '../../constants/Application';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { transferApps, getMarketApps, handleUninstall } from "../../appRedux/actions/AppMarket";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
import { ADMIN, DEALER } from "../../constants/Constants";
import Markup from 'interweave';
import styles from './appmarket.css'

import {
    SPA_APPS,
    SPA_SEARCH,
    SPA_NOTIFICATION_BAR,
    SPA_TITEL_AVAILABLE_APPS,
    SPA_TITLE_SECURE_MARKET,
    SPA_UNINSTALL_HELPING_TEXT_FUN,
    SPA_APP
} from '../../constants/AppConstants';

import {
    Switch_Button_Uninstall
} from '../../constants/ButtonConstants';

import { convertToLang } from "../utils/commonUtils";

const UNINSTALL_HELPING_TEXT = (
    <span>Turn toggle OFF to restrict app <br /> from being uninstalled by user</span>
);


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

        // console.log(availbleAppList, ' objext data ', secureMarketList)
        let combinedList = [];

        combinedList = [...availbleAppList, ...secureMarketList];


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
            let data = {
                key: app.id,
                title:
                    <Fragment>
                        <Avatar size="medium" src={BASE_URL + "users/getFile/" + app.logo} />
                        <span className="sm_labels"> {app.app_name} </span>
                        {(app.dealer_type !== undefined) ? <span>
                            <Switch className="sm_uninstall" size='small' unCheckedChildren={convertToLang(this.props.translation[Switch_Button_Uninstall], "Uninstall")} checkedChildren={convertToLang(this.props.translation[Switch_Button_Uninstall], "Uninstall")} onChange={(e) => { this.handleCheckChange(app.id, e) }} defaultChecked={(app.is_restrict_uninstall === 0) ? true : false} disabled={(this.props.user.type === ADMIN) ? false : app.disabled}></Switch>
                        </span> : null}
                    </Fragment>,
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
        this.props.transferApps(marketApps)
        this.setState({ targetKeys });

    }
    handleCheckChange = (apk_id, value) => {

        this.props.handleUninstall(apk_id, value)
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
                secureMarketList: this.props.secureMarketList,
                availbleAppList: this.props.availbleAppList,
                targetKeys: keys
            })
        }
    }
    componentWillMount() {
        // this.props.getApkList();
        this.props.getMarketApps()
    }
    componentDidMount() {
    }

    handleSelect = (list, e) => {
        // alert("asdsa")
        // console.log("handle select", e)
    }
    render() {
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Card >
                            <Row>
                                <h4 className="sm_top_heading"> <Markup content={convertToLang(this.props.translation[SPA_NOTIFICATION_BAR], "Move <b>(Available Apps)</b> to <b>(Secure Market)</b> to make them appear on your user's Secure Market apps on their devices.")} /> </h4>
                                <Col md={12} sm={24} xs={24} className="text-center">
                                    <h4 className="sm_heading1"><b>{convertToLang(this.props.translation[SPA_TITEL_AVAILABLE_APPS], "Available Apps")}</b></h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} className="text-center sec_market">
                                    <h4 className="sm_heading1"><b>{convertToLang(this.props.translation[SPA_TITLE_SECURE_MARKET], "Secure Market")}</b></h4>
                                </Col>
                            </Row>
                            <Transfer
                                titles={[
                                    (

                                        <div>
                                            <h4 className="sm_heading2">
                                                <b>{convertToLang(this.props.translation[SPA_TITEL_AVAILABLE_APPS], "Available Apps")}</b>
                                            </h4>

                                        </div>

                                    ),
                                    (
                                        <div>
                                            <h4 className="sm_heading2">
                                                <b>{convertToLang(this.props.translation[SPA_TITLE_SECURE_MARKET], "Secure Market")}</b>
                                            </h4>
                                            <span>
                                                <Popover placement="topRight" content={UNINSTALL_HELPING_TEXT}>
                                                    <span className="helping_txt"><Icon type="info-circle" /></span>
                                                </Popover>
                                            </span>

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
                                onSelectChange={this.handleSelect}
                                render={item => item.title}
                                locale={{ itemUnit: convertToLang(this.props.translation[SPA_APP], "App"), itemsUnit: convertToLang(this.props.translation[SPA_APPS], "Apps") }}
                                onItemSelect={this.handleSelect}

                            />
                        </Card>
                }
            </div>
        )

    }
}

const mapStateToProps = ({ apk_list, auth, appMarket, settings }) => {
    // console.log(appMarket.isloading);
    return {
        isloading: appMarket.isloading,
        apk_list: apk_list.apk_list,
        options: apk_list.options,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        user: auth.authUser,
        secureMarketList: appMarket.secureMarketList,
        availbleAppList: appMarket.availbleAppList,
        translation: settings.translation
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
        getMarketApps: getMarketApps,
        handleUninstall: handleUninstall
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApkMarket);