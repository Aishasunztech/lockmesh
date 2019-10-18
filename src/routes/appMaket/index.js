import React, { Fragment } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Transfer, Card, Avatar, Row, Col, Switch, Table } from "antd";
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';
import { BASE_URL } from '../../constants/Application';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { transferApps, getMarketApps, handleUninstall, removeSMapps } from "../../appRedux/actions/AppMarket";
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

import { convertToLang, titleCase, initCap } from "../utils/commonUtils";
import { appMarketColumns } from "../utils/columnsUtils";

const UNINSTALL_HELPING_TEXT = (
    <span>Turn toggle OFF to restrict app <br /> from being uninstalled by user</span>
);

var mGueststatus = true;
var mGuestCopySearch = [];
var mEncryptedstatus = true;
var mEncryptedCopySearch = [];

var guestStatus = true;
var guestCopySearch = [];
var encryptedStatus = true;
var encryptedCopySearch = [];

class ApkMarket extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        var columnsGuest = appMarketColumns(props.translation, this.handleGuestSearch, this.removeSMapps);
        var columnsEncrypted = appMarketColumns(props.translation, this.handleEncryptSearch, this.removeSMapps);
        var columnsModal = appMarketColumns(props.translation, this.handleModalSearch, this.removeSMapps);
        // var columns = appMarketColumns(props.translation, this.handleSearch, this.removeSMapps);

        this.state = {
            // columns: columns[0].children,
            columnsGuest: columnsGuest,
            columnsEncrypted: columnsEncrypted,
            columnsModal: columnsModal,
            apk_list: [],
            secureMarketList: [],
            availbleAppList: props.availbleAppList,
            targetKeys: [],
            availableAppModal: false,
            space: '',
            app_ids: [],
            selectedRowKeys: [],
            hideDefaultSelections: false,

            // copySearch: [],
            guest_SM: [],
            encrypted_SM: [],
            // guestAll: [],
            // encryptedAll: [],

            guestAvailableApps: [],
            encryptedAvailableApps: []
        }

        this.confirm = Modal.confirm;
    }

    filterAvailableApp = (availableApps, secureApps, spaceType = this.state.space) => {
        // console.log('space type is: ', this.state.space)
        // console.log("filterAvailableApp availableApps ", availableApps);
        // console.log("filterAvailableApp secureApps ", secureApps);

        let apps = [];
        let secureIds = [];
        let type = this.props.user.type;

        if (type === ADMIN) {
            secureApps.forEach((app) => {
                if (app.space_type === spaceType && app.dealer_type === type) {
                    secureIds.push(app.id);
                }
            });
        } else {
            secureApps.forEach((app) => {
                if (app.space_type === spaceType) {
                    secureIds.push(app.id);
                }
            });
        }


        // console.log("filterAvailableApp secureIds ", secureIds);

        availableApps.map((app) => {
            if (!secureIds.includes(app.id)) {
                apps.push(app);
            }
        })
        // console.log("filterAvailableApp apps ", apps);
        return apps;
    }

    renderAvailableAppList(appList) {
        let availableApps = this.filterAvailableApp(appList, this.state.secureMarketList);

        return availableApps.map((app, index) => {
            return {
                key: app.id,
                logo:
                    <Fragment>
                        <Avatar size="medium" src={BASE_URL + "users/getFile/" + app.logo} />
                    </Fragment>,
                app_name: `${app.app_name}`,
            }
        })
    }

    removeSMapps = (app, spaceType) => {
        // console.log(spaceType, 'removeSMapps ', app);
        // console.log("user ", this.props.user.type)

        let check = this.state.secureMarketList.filter((app) => app.space_type === spaceType && app.dealer_type !== ADMIN && this.props.user.type !== ADMIN)
        // console.log("check ", check);

        // if (check.length > 0 || this.props.user.type === ADMIN) {
        let appIds = []
        if (app === "all") {
            appIds = app;
            this.setState({ selectedRowKeys: [], app_ids: [] })
        } else {
            appIds = [app.id];
        }
        this.props.removeSMapps(appIds, spaceType);

        // this.props.getMarketApps()
        // } else {
        //     Modal.error({ title: "Sorry, You can't remove these apps" })

        // }

    }


    find_duplicate_in_array = (arra1) => {
        // console.log('array is: ', arra1)
        var object = {};
        var result = [];

        arra1.forEach(function (item) {
            if (!object[item])
                object[item] = 0;
            object[item] += 1;
        })

        for (var prop in object) {
            if (object[prop] >= 2) {
                result.push(Number(prop));
            }
        }

        return result;

    }

    renderAppList = (secureMarketList, spaceType) => {
        console.log("secureMarketList is: ", secureMarketList)
        let smApps = [];
        if (this.props.user.type === ADMIN) {
            smApps = secureMarketList.filter((app) => app.dealer_type === this.props.user.type);
        } else {

            smApps = secureMarketList //.filter((app) => app.space_type === spaceType);
            // smApps = secureMarketList.filter((app) => {
            //     console.log("hi ===> ", app.space_type === spaceType , (duplicateIds.length) ? (duplicateIds.includes(app.id) && app.dealer_type === ADMIN) : true);
            //     return (app.space_type === spaceType && (duplicateIds.length) ? (duplicateIds.includes(app.id) && app.dealer_type === ADMIN) : true)
            // });
        }



        // let duplicateIds = this.find_duplicate_in_array(smApps.map((app) => app.id));


        // console.log('get duplicate values: ', this.find_duplicate_in_array(smApps.map((app) => app.id)))
        smApps.forEach((item) => {
            if (item.dealer_type === ADMIN) {
                item.disabled = true
            }
            else {
                item.disabled = false
            }
        })

        let apkList = smApps.map((app, index) => {
            let data = {
                key: app.id,
                removeAllGuest: <Button type="danger" size="small" disabled={(this.props.user.type === ADMIN) ? false : app.disabled} onClick={() => this.removeSMapps(app, spaceType)}>Remove</Button>,
                removeAllEncrypted: <Button type="danger" size="small" disabled={(this.props.user.type === ADMIN) ? false : app.disabled} onClick={() => this.removeSMapps(app, spaceType)}>Remove</Button>,
                logo:
                    <Fragment>
                        <Avatar size="medium" src={BASE_URL + "users/getFile/" + app.logo} />
                    </Fragment>,
                app_name: <span className="sm_labels"> {app.app_name} </span>,
                uninstall: <Fragment>
                    {(app.dealer_type !== undefined) ? <span>
                        <Switch className="sm_uninstall" size='small' unCheckedChildren={convertToLang(this.props.translation[Switch_Button_Uninstall], "Uninstall")} checkedChildren={convertToLang(this.props.translation[Switch_Button_Uninstall], "Uninstall")} onChange={(e) => { this.handleCheckChange(app.id, e, spaceType) }} defaultChecked={(app.is_restrict_uninstall === 0) ? true : false} disabled={(this.props.user.type === ADMIN) ? false : app.disabled}></Switch>
                    </span> : null}
                </Fragment>,
            }
            return data
        })
        return apkList
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
    handleCheckChange = (apk_id, value, space) => {

        this.props.handleUninstall(apk_id, value, space)
    }

    // handleSearch = (dir, value) => {
    //     // console.log('search:', dir, value);
    // };

    handleGuestSearch = (e) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        console.log("fieldName", fieldName);
        console.log("fieldValue", fieldValue);

        if (guestStatus) {
            guestCopySearch = this.state.guest_SM;
            guestStatus = false;
        }

        let searchedData = this.searchField(guestCopySearch, fieldName, fieldValue);
        // console.log("searchedData", searchedData);
        this.setState({
            guest_SM: searchedData
        });

    }

    handleEncryptSearch = (e) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        console.log("fieldName", fieldName);
        console.log("fieldValue", fieldValue);

        if (encryptedStatus) {
            encryptedCopySearch = this.state.encrypted_SM;
            encryptedStatus = false;
        }

        let searchedData = this.searchField(encryptedCopySearch, fieldName, fieldValue);
        // console.log("searchedData", searchedData);
        this.setState({
            encrypted_SM: searchedData
        });

    }

    handleModalSearch = (e) => {

        let fieldName = e.target.name;
        let fieldValue = e.target.value;
        console.log("fieldName", fieldName);
        console.log("fieldValue", fieldValue);

        let availableApps = this.filterAvailableApp(this.state.availbleAppList, this.state.secureMarketList);
        let searchedData = [];

        if (this.state.space === 'guest') {
            if (mGueststatus) {
                mGuestCopySearch = availableApps;
                mGueststatus = false;
            }
            searchedData = this.searchField(mGuestCopySearch, fieldName, fieldValue);
            this.setState({
                guestAvailableApps: searchedData
            });
        }
        else if (this.state.space === 'encrypted') {
            if (mEncryptedstatus) {
                mEncryptedCopySearch = availableApps;
                mEncryptedstatus = false;
            }
            searchedData = this.searchField(mEncryptedCopySearch, fieldName, fieldValue);
            this.setState({
                availbleAppList: searchedData
            });
        }

    }

    searchField = (originalData, fieldName, value) => {
        let demoData = [];

        if (value.length) {
            originalData.forEach((data) => {
                if (data[fieldName] !== undefined) {
                    if ((typeof data[fieldName]) === 'string') {

                        if (data[fieldName].toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    } else if (data[fieldName] !== null) {
                        if (data[fieldName].toString().toUpperCase().includes(value.toUpperCase())) {
                            demoData.push(data);
                        }
                    }
                } else {
                    demoData.push(data);
                }
            });

            return demoData;
        } else {
            return originalData;
        }
    }

    // componentWillReceiveProps(nextProps) {
    //     //   console.log('will recive props', nextProps);

    //     if (this.props.apk_list !== nextProps.apk_list) {
    //         let keys = nextProps.secureMarketList.map((app) => {
    //             return app.id
    //         })
    //         // console.log(keys);

    //         let guestApps = nextProps.secureMarketList.filter((app) => app.space_type === "guest");
    //         let encryptedApps = nextProps.secureMarketList.filter((app) => app.space_type === "encrypted");

    //         let guestAvailableApps = this.filterAvailableApp(nextProps.availbleAppList, nextProps.secureMarketList, "guest");
    //         let encryptedAvailableApps = this.filterAvailableApp(nextProps.availbleAppList, nextProps.secureMarketList, "encrypted");

    //         guestCopySearch = guestApps;
    //         encryptedCopySearch = encryptedApps;

    //         this.setState({
    //             secureMarketList: nextProps.secureMarketList,
    //             availbleAppList: nextProps.availbleAppList,
    //             guest_SM: guestApps,
    //             encrypted_SM: encryptedApps,
    //             guestAvailableApps: guestAvailableApps,
    //             encryptedAvailableApps: encryptedAvailableApps,
    //             targetKeys: keys
    //         })
    //     }
    // }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            let keys = this.props.secureMarketList.map((app, index) => {
                return app.id
            })

            let guestApps = this.props.secureMarketList.filter((app) => app.space_type === "guest");
            let encryptedApps = this.props.secureMarketList.filter((app) => app.space_type === "encrypted");

            let guestAvailableApps = this.filterAvailableApp(this.props.availbleAppList, this.props.secureMarketList, "guest");
            let encryptedAvailableApps = this.filterAvailableApp(this.props.availbleAppList, this.props.secureMarketList, "encrypted");

            guestCopySearch = guestApps;
            encryptedCopySearch = encryptedApps;

            this.setState({
                secureMarketList: this.props.secureMarketList,
                availbleAppList: this.props.availbleAppList,
                guest_SM: guestApps,
                encrypted_SM: encryptedApps,
                guestAvailableApps: guestAvailableApps,
                encryptedAvailableApps: encryptedAvailableApps,
                targetKeys: keys
            })
        }
    }
    componentWillMount() {
        // this.props.getApkList();
        this.props.getMarketApps()
    }
    componentDidMount() {
        // let index = this.state.columns.findIndex((item) => item.dataIndex === "remove");
        // this.state.columns[index].title = <Button type="danger" size="small" onClick={() => this.removeSMapps("all")}>Remove All</Button>
    }

    handleSelect = (list, e) => {
        // alert("asdsa")
        // console.log("handle select", e)
    }

    saveApps = (space) => {
        // console.log('hi saveApps', "this.state.app_ids", this.state.app_ids)
        // console.log("this.state.availbleAppList", this.state.availbleAppList)
        // console.log("this.state.secureMarketList", this.state.secureMarketList)


        if (this.state.app_ids.length) {
            this.state.availbleAppList.map((app) => {
                if (this.state.app_ids.includes(app.id)) {
                    app.space_type = space;
                    this.state.secureMarketList.push(app);
                }
                else {
                    if (this.state.secureMarketList.includes(app.id)) {
                        this.state.app_ids.push(app.id);

                    }
                }
            })
            this.setState({
                app_ids: [],
                secureMarketList: this.state.secureMarketList
            })

            let sm_appIds = [];
            this.state.secureMarketList.forEach((app) => {
                console.log("app ", app)
                if (app.space_type === space) {
                    sm_appIds.push(app.id);
                }
            });
            // console.log(this.state.app_ids, "sm_appIds ", sm_appIds)
            this.props.transferApps(sm_appIds, space)

            this.setState({ availableAppModal: false, selectedRowKeys: [], app_ids: [] })
        }
        // this.props.getMarketApps()
    }

    addIntoSpace = (space) => {
        console.log("space is: ", space)

        this.setState({ availableAppModal: true, space });
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {
        console.log(selectedRowKeys, 'selected', selectedRows);
        let app_ids = []
        selectedRows.forEach(row => {
            console.log("selected row", row)
            app_ids.push(row.key);
        });
        this.setState({
            app_ids: app_ids,
            selectedRowKeys: selectedRowKeys
        });
    }

    render() {
        let { columnsGuest, columnsEncrypted, columnsModal } = this.state;

        if (this.props.user.type !== ADMIN) {
            let dealerGuest = this.state.secureMarketList.filter((app) => app.space_type === "guest" && app.dealer_type === DEALER);
            let dealerEncrypted = this.state.secureMarketList.filter((app) => app.space_type === "encrypted" && app.dealer_type === DEALER);

            let guestindex = columnsGuest.findIndex((obj) => obj.dataIndex == "removeAllGuest");
            columnsGuest[guestindex].title = <Button type="danger" size="small" disabled={(dealerGuest.length) ? false : true} onClick={() => this.removeSMapps("all", "guest")}>Remove All</Button>

            let index = columnsEncrypted.findIndex((obj) => obj.dataIndex == "removeAllEncrypted");
            columnsEncrypted[index].title = <Button type="danger" size="small" disabled={(dealerEncrypted.length) ? false : true} onClick={() => this.removeSMapps("all", "encrypted")}>Remove All</Button>
        }

        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :
                        <Card >
                            <Row>
                                <Col md={2} sm={2} xs={2} className="text-center">
                                    <Avatar size="large" src={BASE_URL + "users/getFile/icon_com.secureMarket.SecureMarketActivity_Secure%20Market.png"} />
                                    <span className="sm_labels"> Secure Market </span>
                                </Col>
                                <Col md={22} sm={22} xs={22} className="text-center">
                                    <h4 className="sm_top_heading"> <Markup content={convertToLang(this.props.translation[SPA_NOTIFICATION_BAR], "Move <b>(Available Apps)</b> to <b>(Secure Market)</b> to make them appear on your user's Secure Market apps on their devices.")} /> </h4>
                                </Col>
                                <Col md={12} sm={24} xs={24} className="text-center">
                                    <h4 className="sm_heading1"><b>{convertToLang(this.props.translation[SPA_TITEL_AVAILABLE_APPS], "Guest Space Apps")}</b></h4>

                                    <Button onClick={() => this.addIntoSpace('guest')}>Add Available Apps</Button>
                                    <br /><br />
                                    <div style={{ border: '1px solid lightgray', borderRadius: '8px' }}>
                                        <Table
                                            name="guestTable"

                                            className="guestTable"
                                            key="guest"
                                            size="middle"
                                            bordered
                                            dataSource={this.renderAppList(this.state.guest_SM, 'guest')}
                                            columns={columnsGuest.filter((item) => item.dataIndex !== "removeAllEncrypted")}
                                            pagination={false}
                                        />

                                    </div>
                                </Col>
                                <Col md={12} sm={24} xs={24} className="text-center sec_market">
                                    <h4 className="sm_heading1"><b>{convertToLang(this.props.translation[SPA_TITLE_SECURE_MARKET], "Encrpted Space Apps")}</b></h4>

                                    <Button onClick={() => this.addIntoSpace('encrypted')}>Add Available Apps</Button>
                                    <br /><br />
                                    <div style={{ border: '1px solid lightgray', borderRadius: '8px' }}>
                                        <Table
                                            key="encrypted"
                                            size="middle"
                                            bordered
                                            dataSource={this.renderAppList(this.state.encrypted_SM, 'encrypted')}
                                            columns={columnsEncrypted.filter((item) => item.dataIndex !== "removeAllGuest")}
                                            pagination={false}
                                        />

                                    </div>
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
                                destroyOnClose={true}
                                title={convertToLang(this.props.translation[""], `Add Available Apps To ${initCap(this.state.space)} Space`)}
                                visible={this.state.availableAppModal}
                                onOk={() => {
                                    this.saveApps(this.state.space)
                                }}
                                okText={convertToLang(this.props.translation[""], "Add")}
                                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                                onCancel={() => {
                                    this.setState({ availableAppModal: false, selectedRowKeys: [], app_ids: [] })
                                }}
                            // bodyStyle={{ height: 500, overflow: "overlay" }}
                            >
                                <AppMarketList
                                    dataSource={this.renderAvailableAppList(this.state.availbleAppList)}
                                    columns={columnsModal.filter((item) => (item.dataIndex !== "removeAllGuest" && item.dataIndex !== "removeAllEncrypted" && item.dataIndex !== "counter" && item.dataIndex !== "uninstall"))}
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
    // console.log("auth.authUser ", auth.authUser);
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
        removeSMapps: removeSMapps,
        getMarketApps: getMarketApps,
        handleUninstall: handleUninstall
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ApkMarket);