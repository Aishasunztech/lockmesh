import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Transfer, Card, Avatar } from "antd";
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';
import { BASE_URL } from '../../constants/Application';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';

class ApkMarket extends React.Component {

    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            apk_list: [],
            secureApps: [],
        }

        this.confirm = Modal.confirm;
    }
    renderList = (appList) => {
        console.log(appList);
        let secureApps = [];
        let apkList = appList.map((app, index) => {
            let data = {
                key: index.toString(),
                title: <Fragment> <Avatar size="small" src={BASE_URL + "users/getFile/" + app.logo} /><span> {app.apk_name} </span> </Fragment>,
                description: `description of content${index + 1}`,
            };
            return data
        })
        return apkList

    }

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1

    handleChange = (targetKeys) => {
        console.log(targetKeys);
        this.setState({ targetKeys });
    }

    handleSearch = (dir, value) => {
        // console.log('search:', dir, value);
    };

    componentWillReceiveProps(nextProps) {
        //  console.log('will recive props');

        if (this.props.apk_list !== nextProps.apk_list) {
            this.setState({
                apk_list: nextProps.apk_list,
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                apk_list: this.props.apk_list
            })
        }
    }
    componentWillMount() {
        this.props.getApkList();
    }
    componentDidMount() {
    }


    render() {
        // console.log(this.props.apk_list);
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Card >
                            <Transfer
                                style={{ margin: 'auto' }}
                                titles={['AVAILABLE APPS', 'SECURE MARKET APPS']}
                                dataSource={this.renderList(this.state.apk_list)}
                                listStyle={{
                                    width: 500,
                                    height: 500,
                                }}
                                showSearch
                                filterOption={this.filterOption}
                                targetKeys={this.state.targetKeys}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                                render={item => item.title}
                            />
                        </Card>
                }
            </div>
        )
    }
}

const mapStateToProps = ({ apk_list, auth }) => {
    return {
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        options: apk_list.options,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        user: auth.authUser
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
        getPagination: getPagination
        //  getDevicesList: getDevicesList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApkMarket);