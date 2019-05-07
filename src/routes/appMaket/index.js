import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Transfer, Card, Avatar } from "antd";
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';
import { BASE_URL } from '../../constants/Application';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { transferApps, getMarketApps } from "../../appRedux/actions/AppMarket";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
import { ADMIN, DEALER } from "../../constants/Constants";

let selectedKeys = [];

class ApkMarket extends React.Component {
    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            apk_list: [],
            secureMarketList: [],
            availbleAppList: [],
            targetKeys: [],
        }

        this.confirm = Modal.confirm;
    }
    renderList = (availbleAppList, secureMarketList) => {

        let combinedList = [...availbleAppList, ...secureMarketList]
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
                title: <Fragment> <Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} /><span> {app.app_name} </span> </Fragment>,
                description: `description of content${index + 1}`,
                disabled: (this.props.user.type === ADMIN) ? false : app.disabled
            }
            return data
        })
        return apkList

    }
    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1

    handleChange = (targetKeys) => {
        let marketApps = targetKeys;
        // if (this.props.user.type === DEALER) {
        //     console.log(selectedKeys);

        // } else {
        // }
        this.props.transferApps(marketApps)
        this.setState({ targetKeys });
    }
    onSelectChange = (sourceSelectedKeys, targetKeys) => {
        if (sourceSelectedKeys.length) {
            selectedKeys = sourceSelectedKeys
        }

    }

    handleSearch = (dir, value) => {
        // console.log('search:', dir, value);
    };

    componentWillReceiveProps(nextProps) {
        //  console.log('will recive props');

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
            // console.log(keys);
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
                            <Transfer
                                style={{ margin: 'auto' }}
                                titles={['AVAILABLE APPS', 'SECURE MARKET']}
                                dataSource={this.renderList(this.state.availbleAppList, this.state.secureMarketList)}
                                listStyle={{
                                    width: 500,
                                    height: 500,
                                }}
                                showSearch
                                filterOption={this.filterOption}
                                targetKeys={this.state.targetKeys}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                                onSelectChange={this.onSelectChange}
                                render={item => item.title}
                            />
                        </Card>
                }
            </div>
        )
    }
}

const mapStateToProps = ({ apk_list, auth, appMarket }) => {
    // console.log(appMarket.secureMarketList);
    return {
        isloading: apk_list.isloading,
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