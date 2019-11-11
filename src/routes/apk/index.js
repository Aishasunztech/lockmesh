import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover, Avatar, Row, Col } from "antd";
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
import { apkPermission } from "../../appRedux/actions/Apk";
// import {Route, Switch} from "react-router-dom";
// import Apk from "../../containers/ApkList"
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';

import { getApkList, changeAppStatus, deleteApk, editApk, addApk, resetUploadForm } from "../../appRedux/actions/Apk";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
import { getPolicies } from "../../appRedux/actions/Policy";
// import {getDeviceList} from 

import AppFilter from "../../components/AppFilter";
import AddApk from '../addApk/index'

import {
    convertToLang
} from '../utils/commonUtils'

import { BASE_URL } from '../../constants/Application';
import ListApk from './components/ListApk';

import {
    APK_SHOW_ON_DEVICE,
    APK,
    APK_APP_NAME,
    APK_APP_LOGO,
    APK_PERMISSION,
    APK_ACTION,
    APK_SEARCH,
    APK_UPLOAD,
    APK_SIZE,
    SHOW_APK
} from '../../constants/ApkConstants';

import { componentSearch, titleCase } from "../utils/commonUtils";
import { ACTION, Alert_Delete_APK, SEARCH } from "../../constants/Constants";
import { Button_Save, Button_Yes, Button_No } from "../../constants/ButtonConstants";
import { apkColumns, featureApkColumns } from "../utils/columnsUtils";
import { Tab_Active, Tab_All, Tab_Disabled } from "../../constants/TabConstants";
import { APPS_PAGE_HEADING } from '../../constants/AppFilterConstants';
import { APP_MANAGE_APKs } from '../../constants/AppConstants';


var status = true;
var coppyApks = [];

class Apk extends Component {

    constructor(props) {
        super(props);
        var columns = apkColumns(props.translation);
        var featureApkcolumns = featureApkColumns(props.translation);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            apk_list: [],
            uploadApkModal: false,
            showUploadModal: false,
            showUploadData: {},
            columns: columns,
            featureApkcolumns: featureApkcolumns,
            listOf: "all"
        }

        // this.columns = ;
        this.confirm = Modal.confirm;

    }

    // handleTableChange = (pagination, query, sorter) => {
    //     const sortOrder = sorter.order || "ascend";
    //     this.setState({
    //         columns: apkColumns(sortOrder, this.props.translation)
    //     })
    // };

    handleTableChange = (pagination, query, sorter) => {
        let { columns } = this.state;

        columns.forEach(column => {
            // if (column.children) {
            if (Object.keys(sorter).length > 0) {
                if (column.dataIndex == sorter.field) {
                    if (this.state.sorterKey == sorter.field) {
                        column['sortOrder'] = sorter.order;
                    } else {
                        column['sortOrder'] = "ascend";
                    }
                } else {
                    column['sortOrder'] = "";
                }
                this.setState({ sorterKey: sorter.field });
            } else {
                if (this.state.sorterKey == column.dataIndex) column['sortOrder'] = "ascend";
            }
            // }
        })
        this.setState({
            columns: columns
        });
    }

    // delete
    handleConfirmDelete = (appId, appObject) => {
        this.confirm({
            title: convertToLang(this.props.translation[Alert_Delete_APK], "Are you sure, you want to delete the Apk ?"),
            content: <Fragment>
                <Avatar size="small" src={BASE_URL + "users/getFile/" + appObject.logo} />
                {` ${appObject.apk_name} - ${appObject.size}`}
            </Fragment>,
            okText: convertToLang(this.props.translation[Button_Yes], "Yes"),
            cancelText: convertToLang(this.props.translation[Button_No], "No"),
            onOk: () => {
                this.props.deleteApk(appId);
                return new Promise((resolve, reject) => {
                    setTimeout((5 > 0.5 ? resolve : reject));
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() { },
        });
    }

    // toggleStatus
    handleStatusChange = (checked, appId) => {
        this.props.changeAppStatus(appId, checked);
    }


    componentWillReceiveProps(nextProps) {
        //  console.log('will recive props');

        if (this.props.apk_list !== nextProps.apk_list) {
            // this.setState({
            //     apk_list: nextProps.apk_list,
            // })
            this.handleChange(this.state.listOf);
        }
    }

    handleCheckChange = (values) => {
        console.log('hiii')
        let dumydata = this.state.columns;

        console.log('dumydata is: ', dumydata)

        if (values.length) {
            console.log('values are: ', values)
            this.state.columns.map((column, index) => {

                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                }

                // console.log('dumydata is: ', dumydata)
                // console.log('values are: ', values)
                values.map((value) => {
                    if (column.dataIndex === value.key) {
                        if ((value.key === APK_PERMISSION && column.dataIndex === 'permission') || (value.key === APK_SHOW_ON_DEVICE && column.dataIndex === 'apk_status')) {

                            // if (column.title.props.children[0] === convertToLang(this.props.translation[value.key], value.key)) {
                            //     dumydata[index].className = '';
                            // }
                        } else {
                            // if (column.dataIndex === value.key) {
                            dumydata[index].className = '';
                        }
                    }
                    // else if (column.title.props.children !== undefined) {
                    //     if(column.title.props.children[0] === value){
                    //         dumydata[index].className = '';
                    //     }
                    // }
                });


            });

            this.setState({ columns: dumydata });

        } else {
            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({
                columns: newState,
            });
        }
        this.props.postDropdown(values, 'apk');
    }


    handlePagination = (value) => {
        this.refs.listApk.handlePagination(value);
        // this.props.postPagination(value, 'apk');
    }

    handleComponentSearch = (value) => {
        try {
            if (value.length) {

                if (status) {
                    coppyApks = this.state.apk_list;
                    status = false;
                }
                let foundApks = componentSearch(coppyApks, value);
                if (foundApks.length) {
                    this.setState({
                        apk_list: foundApks,
                    })
                } else {
                    this.setState({
                        apk_list: []
                    })
                }
            } else {
                status = true;

                this.setState({
                    apk_list: coppyApks,
                })
            }
        } catch (error) {
            alert("hello");
        }
    }



    handleChange = (value) => {

        switch (value) {
            case 'active':
                // this.state.listOf = value;
                this.setState({
                    apk_list: this.filterList('On', this.props.apk_list),
                    listOf: "active"
                    // column: this.columns,

                })

                break;
            case 'disabled':
                this.setState({
                    apk_list: this.filterList('Off', this.props.apk_list),
                    listOf: "disabled"
                    // column: this.columns,

                })
                break;

            default:
                this.setState({
                    apk_list: this.props.apk_list,
                    listOf: "all"
                    // column: this.columns,

                })
                break;
        }
    }

    filterList = (type, dealers) => {
        let dumyDealers = [];
        dealers.filter(function (apk) {
            let dealerStatus = apk.apk_status;
            if (dealerStatus === type) {
                dumyDealers.push(apk);
            }
        });
        return dumyDealers;
    }


    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            // this.setState({
            //     apk_list: this.props.apk_list
            // })
            this.handleChange(this.state.listOf);
        }

        if (this.props.selectedOptions !== prevProps.selectedOptions) {
            this.handleCheckChange(this.props.selectedOptions)
        }

        if (this.props.translation != prevProps.translation) {
            this.setState({
                columns: apkColumns(this.props.translation)
            })
        }
    }
    componentWillMount() {
        // alert("componentWillMount");
        this.props.getApkList();
        this.props.getPolicies();
        // this.props.getDevicesList();
        //  console.log('apk did mount', this.props.getDropdown('apk'));
        this.props.getDropdown('apk');
        // this.props.getPagination('apk')
    }
    componentDidMount() {
        // alert("hello213");
        // this.props.getApkList();
        // this.props.getDropdown('apk');
    }

    handleFilterOptions = () => {
        return (
            <Select
                showSearch
                placeholder={convertToLang(this.props.translation[SHOW_APK], "Show APK")}
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={this.handleChange}
            >
                <Select.Option value="all">{convertToLang(this.props.translation[Tab_All], "All")}</Select.Option>
                <Select.Option value="active">{convertToLang(this.props.translation[Tab_Active], "Active")}</Select.Option>
                <Select.Option value="disabled">{convertToLang(this.props.translation[Tab_Disabled], "Disabled")}</Select.Option>
            </Select>
        );
    }

    handleUploadApkModal = (visible) => {
        this.setState({
            uploadApkModal: visible
        });
        this.props.resetUploadForm(false)
    }
    hideUploadApkModal = () => {
        this.setState({
            uploadApkModal: false
        });
        this.props.resetUploadForm(true)
    }

    render() {

        // console.log("this.state.apk_list ", this.state.apk_list);
        // console.log("this.props.apk_list ", this.props.apk_list);
        if (this.props.user.type === 'dealer') {
            this.state.columns[1].className = 'hide';
        } else {
            this.state.columns[1].className = 'row m-0';
        }

        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :

                        <div>
                            <AppFilter
                                translation={this.props.translation}
                                handleFilterOptions={this.handleFilterOptions}
                                searchPlaceholder={convertToLang(this.props.translation[APK_SEARCH], "Search APK")}
                                addButtonText={convertToLang(this.props.translation[APK_UPLOAD], "Upload APK")}
                                isAddButton={this.props.user.type === 'admin'}
                                defaultPagingValue={this.props.DisplayPages}
                                options={this.props.options}
                                // toLink="/upload-apk"
                                handleUploadApkModal={this.handleUploadApkModal}
                                selectedOptions={this.props.selectedOptions}
                                handleCheckChange={this.handleCheckChange}
                                handlePagination={this.handlePagination}
                                handleComponentSearch={this.handleComponentSearch}
                                pageHeading={convertToLang(this.props.translation[APP_MANAGE_APKs], "Manage APK's")}
                            />

                            {
                                (this.props.user.type === 'admin') ?
                                    <div style={{ textAlign: "center" }}>
                                        {/* <Button
                                            type="primary"
                                            // disabled={(this.props.disableAddButton === true) ? true : false}
                                            style={{ width: '12%', marginBottom:16 }}
                                        >
                                            <Link to='/upload-apk'>Upload apk</Link>
                                        </Button> */}
                                    </div> : false
                            }


                            <ListApk
                                totalDealers={this.props.dealerList.length}
                                savePermission={this.props.apkPermission}
                                onChangeTableSorting={this.handleTableChange}
                                handleStatusChange={this.handleStatusChange}
                                apk_list={this.state.apk_list}
                                // tableChangeHandler={this.tableChangeHandler}
                                handleConfirmDelete={this.handleConfirmDelete}
                                editApk={this.props.editApk}
                                addApk={this.props.addApk}
                                columns={this.state.columns}
                                featureApkcolumns={this.state.featureApkcolumns}
                                getApkList={this.props.getApkList}
                                pagination={this.props.DisplayPages}
                                user={this.props.user}
                                ref="listApk"
                                translation={this.props.translation}
                            />

                            <Modal
                                maskClosable={false}
                                width="620px"
                                className="upload_apk_popup"
                                visible={this.state.uploadApkModal}
                                title={convertToLang(this.props.translation[APK_UPLOAD], "Upload APK")}
                                onOk={() => { }}
                                onCancel={() => {
                                    this.hideUploadApkModal()
                                }}
                                okText={convertToLang(this.props.translation[Button_Save], "Save")}
                                footer={null}
                            >
                                <AddApk
                                    translation={this.props.translation}
                                    hideUploadApkModal={this.hideUploadApkModal}
                                    ref='uploadApk'
                                />
                            </Modal>
                        </div>}
            </div>
        )
    }


    getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys, selectedKeys, confirm, clearFilters,
        }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => { this.searchInput = node; }}
                        placeholder={`${convertToLang(this.props.translation[SEARCH], "Search")} ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                        style={{ width: 188, marginBottom: 8, display: 'block' }}
                    />
                    {/* <Button
                        type="primary"
                        onClick={() => this.handleSearch(selectedKeys, confirm)}
                        icon="search"
                        size="small"
                        style={{ width: 90, marginRight: 8 }}
                    >
                        Search
                    </Button>
                        <Button
                            onClick={() => this.handleReset(clearFilters)}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Reset
                    </Button>

                    */}
                </div>
            ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text) => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        ),
    })

    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
    }

    handleReset = (clearFilters) => {
        clearFilters();
        this.setState({ searchText: '' });
    }
}

// const Extensions = ({match}) => (
//   <Switch>
//     <Route path={`${match.url}/map`} component={Maps}/>
//     <Route path={`${match.url}/chart`} component={Charts}/>
//     <Route path={`${match.url}/calendar`} component={Calendar}/>
//   </Switch>
// );

// export default Apk;
const mapStateToProps = ({ apk_list, auth, settings, policies, dealers }) => {
    return {
        dealerList: dealers.dealers,
        isloading: apk_list.isloading,
        apk_list: apk_list.apk_list,
        options: settings.APKOptions,
        selectedOptions: apk_list.selectedOptions,
        DisplayPages: apk_list.DisplayPages,
        user: auth.authUser,
        translation: settings.translation,
        policies: policies.policies,
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
        addApk: addApk,
        resetUploadForm: resetUploadForm,
        getPolicies: getPolicies,
        apkPermission: apkPermission
        //  getDevicesList: getDevicesList
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Apk);