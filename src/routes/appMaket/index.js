import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Transfer, Card, Avatar, Row, Col, Switch, Table } from "antd";
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';
import { BASE_URL } from '../../constants/Application';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { transferApps, getMarketApps, handleUninstall } from "../../appRedux/actions/AppMarket";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
import { ADMIN, DEALER } from "../../constants/Constants";
import AppMarketList from './appMarketList';
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
    Switch_Button_Uninstall, Button_Save, Button_Cancel
} from '../../constants/ButtonConstants';

import { convertToLang, titleCase } from "../utils/commonUtils";

const UNINSTALL_HELPING_TEXT = (
    <span>Turn toggle OFF to restrict app <br /> from being uninstalled by user</span>
);


class ApkMarket extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        const columns = [
            {
                title: '#',
                dataIndex: 'counter',
                align: 'center',
                className: 'row',
                render: (text, record, index) => ++index,
            },
            {
                title: <Button type="danger" size="small">Remove All</Button>,
                dataIndex: 'remove',
                align: 'center',
                className: '',
                // width: 50,
            },
            {
                title: "LOGO", // convertToLang(translation[ACTION], "ACTION"),
                dataIndex: 'logo',
                align: 'center',
                className: '',
                // width: 800,
                key: "logo"
            },
            {
                title: (
                    <Input.Search
                        name="app_name"
                        key="app_name"
                        id="app_name"
                        className="search_heading"
                        // onChange={handleSearch}
                        autoComplete="new-password"
                        // placeholder={titleCase(props.convertToLang(props.translation[""], "APP NAME"))}
                        placeholder="APP NAME"
                    />
                ),
                dataIndex: 'app_name',
                children: [
                    {
                        title: "APP NAME", // props.convertToLang(props.translation[""], "APP NAME"),
                        align: "center",
                        dataIndex: 'app_name',
                        sorter: (a, b) => { return a.app_name.localeCompare(b.app_name) },
                        sortDirections: ['ascend', 'descend'],
                    }
                ]
            },
        ]

        this.state = {
            columns: columns,
            apk_list: [],
            secureMarketList: [],
            availbleAppList: props.availbleAppList,
            targetKeys: [],
            guestModal: false,
            app_ids: [],
            selectedRowKeys: [],
            hideDefaultSelections: false,
        }

        this.confirm = Modal.confirm;
    }

    renderAppList(list) {
        console.log('renderAppList ', list)

        return list.map((app, index) => {
            // console.log('renderAppList single app', app)
            return {
                key: app.id,
                remove: <Button type="danger" size="small">Remove</Button>,
                logo:
                    <Fragment>
                        <Avatar size="medium" src={BASE_URL + "users/getFile/" + app.logo} />
                    </Fragment>,
                app_name: `${app.app_name}`,
            }

        })

    }

    renderList = (secureMarketList) => {

        // console.log(availbleAppList, ' objext data ', secureMarketList)
        let combinedList = [];

        combinedList = [...secureMarketList];


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
                logo:
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

    saveGuestApps = () => {
        console.log('hi saveGuestApps', "this.state.app_ids", this.state.app_ids)
        console.log("this.state.availbleAppList", this.state.availbleAppList)
        console.log("this.state.secureMarketList", this.state.secureMarketList)


        if (this.state.app_ids.length) {
            this.state.availbleAppList.map((apps) => {
                if (this.state.app_ids.includes(apps.app.id)) {
                    this.state.secureMarketList.push(apps.app);
                }
                else {
                    if (this.state.secureMarketList.includes(apps.app.id)) {
                        this.state.app_ids.push(apps.app);

                    }
                }
            })
            this.setState({
                app_ids: [],
                secureMarketList: this.state.secureMarketList
            })

            // // console.log(this.state.selectedRowKeys);
            // this.props.savePermission(this.props.record.apk_id, JSON.stringify(this.state.selectedRowKeys), 'save');

            // this.showDealersModal(false);

            // this.props.getAllDealers()
            this.setState({ guestModal: false })
        }
    }

    addIntoSpace = (space) => {
        console.log("spance is: ", space)

        this.setState({ guestModal: true });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, 'selected', selectedRows);
        let app_ids = []
        selectedRows.forEach(row => {
            console.log("selected row", row)
            // app_ids.push(row.id);
        });
        this.setState({
            app_ids: app_ids,
            selectedRowKeys: selectedRowKeys
        });
    }

    render() {
        console.log("this.state.availbleAppList ", this.state.availbleAppList)
        console.log("this.state.secureMarketList ", this.state.secureMarketList)
        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Card >
                            <Row>
                                <h4 className="sm_top_heading"> <Markup content={convertToLang(this.props.translation[SPA_NOTIFICATION_BAR], "Move <b>(Available Apps)</b> to <b>(Secure Market)</b> to make them appear on your user's Secure Market apps on their devices.")} /> </h4>
                                <Col md={12} sm={24} xs={24} className="text-center">
                                    <h4 className="sm_heading1"><b>{convertToLang(this.props.translation[SPA_TITEL_AVAILABLE_APPS], "Guest Space Apps")}</b></h4>

                                    <Button onClick={() => this.addIntoSpace('guest')}>Add Available Apps</Button>
                                    <br /><br />
                                    <div style={{ border: '1px solid lightgray', borderRadius: '8px' }}>
                                        <Table
                                            size="middle"
                                            dataSource={this.renderAppList(this.state.secureMarketList)}
                                            columns={this.state.columns}
                                            pagination={false}
                                        />

                                    </div>
                                </Col>
                                <Col md={12} sm={24} xs={24} className="text-center sec_market">
                                    <h4 className="sm_heading1"><b>{convertToLang(this.props.translation[SPA_TITLE_SECURE_MARKET], "Encrpted Space Apps")}</b></h4>
                                </Col>
                            </Row>


                            {/* <Transfer
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
                                                <Popover placement="topRight" content={<Markup content={convertToLang(this.props.translation[SPA_UNINSTALL_HELPING_TEXT_FUN], "<span>Turn toggle OFF to restrict app <br /> from being uninstalled by user</span>")} />}>
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
                                locale={{ itemUnit: convertToLang(this.props.translation[SPA_APP], "App"), itemsUnit: convertToLang(this.props.translation[SPA_APP], "Apps") }}
                                onItemSelect={this.handleSelect}

                            /> */}

                            <Modal
                                maskClosable={false}
                                width='665px'
                                title={convertToLang(this.props.translation["Add Available Apps To Guest Space"], "Add Available Apps To Guest Space")}
                                visible={this.state.guestModal}
                                onOk={() => {
                                    this.saveGuestApps()
                                }}
                                okText={convertToLang(this.props.translation[Button_Save], "Save")}
                                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                onCancel={() => {
                                    this.setState({ guestModal: false })
                                }}
                                bodyStyle={{ height: 500, overflow: "overlay" }}
                            >
                                <AppMarketList
                                    availableApps={this.renderAppList(this.state.availbleAppList)}
                                    columns={this.state.columns}
                                    // user={this.props.user}
                                    // history={this.props.history}
                                    // translation={this.props.translation}
                                    onChangeTableSorting={this.props.onChangeTableSorting}
                                    onSelectChange={this.onSelectChange}
                                    hideDefaultSelections={this.state.hideDefaultSelections}
                                    selectedRows={this.state.app_ids}
                                    selectedRowKeys={this.state.selectedRowKeys}
                                />
                            </Modal>
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