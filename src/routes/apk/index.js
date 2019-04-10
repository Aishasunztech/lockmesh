import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Input, Icon, Modal, Select, Button, Tooltip, Popover } from "antd";
import { Link } from 'react-router-dom';
import Highlighter from 'react-highlight-words';
// import {Route, Switch} from "react-router-dom";
// import Apk from "../../containers/ApkList"
import CircularProgress from "components/CircularProgress/index";
//import {getDevicesList} from '../../appRedux/actions/Devices';

import { getApkList, changeAppStatus, deleteApk, editApk } from "../../appRedux/actions/Apk";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
// import {getDeviceList} from 

import AppFilter from "../../components/AppFilter";

// import { BASE_URL } from '../../constants/Application';
import ListApk from './components/ListApk';

import { componentSearch } from "../utils/commonUtils";

const question_txt = (
    <div>
        <p>Here you can see the number  of Dealers<br></br> who permission to  use this app. <br></br>Press <a style={{ fontSize: 18, verticalAlign: 'sub' }}><Icon type="caret-right" /> </a>Arrow to Add/Remove or view the List.</p>
    </div>
);
var status = true;
var coppyApks = [];

class Apk extends React.Component {

    constructor(props) {
        super(props);
        let self = this;
        this.state = {
            apk_list: [],
            columns: [
                {
                    title: 'ACTION',
                    dataIndex: 'action',
                    key: 'action',
                    className: 'row'
                },
                {
                    title: (
                        <span>
                            PERMISSION
                        <Popover placement="top" content={question_txt}>
                                <span style={{ float: "right", cursor: 'pointer' }}><Icon type="question" /></span>
                            </Popover>
                         </span>),
                    dataIndex: 'permission',
                    key: 'permission',
                    className: 'row'
                },
                {
                    title: 'APP STATUS',
                    dataIndex: 'apk_status',
                    key: 'apk_status',
                },
                {
                    title: 'APK',
                    dataIndex: 'apk',
                    key: 'apk',
                },
                {
                    title: 'APP NAME',
                    dataIndex: 'apk_name',
                    width: "100",
                    key: 'apk_name',
                    // sorter: (a, b, direction) => {
                    //     // alert(self);
                    //     self.sortOrder(direction);
                    // },
                    sorter: (a, b) => { return a.apk_name.localeCompare(b.apk_name) },
                    // renderColumnSorter:(<h1>hello</h1>),
                    // sorter: true,
                    sortDirections: ['ascend', 'descend'],
                    // sortOrder:"ascend",
                    defaultSortOrder: "ascend"
                },
                {
                    title: 'APP LOGO',
                    dataIndex: 'apk_logo',
                    key: 'apk_logo',
                },
            ],
        }

        // this.columns = ;
        this.confirm = Modal.confirm;
        // binding methods
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        // this.tableChangeHandler = this.tableChangeHandler.bind(this);


    }
    // delete
    handleConfirmDelete = (appId) => {
        this.confirm({
            title: 'Are you sure, you want to delete the Apk ?',
            content: '',
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
            this.setState({
                apk_list: nextProps.apk_list,
            })
        }
    }

    handleCheckChange = (values) => {
        let dumydata = this.state.columns;

        // console.log('values', values);
        // console.log('values', values)
        if (values.length) {
            this.state.columns.map((column, index) => {

                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                }

                values.map((value) => {
                    if (column.title === value) {
                        dumydata[index].className = '';
                    }
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
        this.props.postPagination(value, 'apk');
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
        // alert(value);
    }


    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                apk_list: this.props.apk_list
            })
        }
    }
    componentWillMount() {
        // alert("componentWillMount");
        this.props.getApkList();
        // this.props.getDevicesList();
        //  console.log('apk did mount', this.props.getDropdown('apk'));
        this.props.getDropdown('apk');
        this.props.getPagination('apk')
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
                placeholder="Show APK"
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={this.handleChange}
            >
                <Select.Option value="all">All</Select.Option>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="disabled">Disabled</Select.Option>
            </Select>
        );
    }


    render() {


        return (
            <div>
                {
                    this.props.isloading ? <CircularProgress /> :

                        <div>
                            <AppFilter
                                handleFilterOptions={this.handleFilterOptions}
                                searchPlaceholder="Search APK"
                                addButtonText="Upload APK"
                                isAddButton={this.props.user.type === 'admin'}
                                defaultPagingValue={this.props.DisplayPages}
                                options={this.props.options}
                                toLink="/upload-apk"
                                selectedOptions={this.props.selectedOptions}
                                handleCheckChange={this.handleCheckChange}
                                handlePagination={this.handlePagination}
                                handleComponentSearch={this.handleComponentSearch}
                            />
                            {/* <div className="row">
                                <div className="col-sm-12">
                                    <a href="http://api.lockmesh.com/users/getFile/apk-ScreenLocker-v4.45.apk" style={{ display:'flex', justifyContent: 'center'}}>
                                        <button style={{ width: "19%", padding: '0 8px', backgroundColor: '#ccc' }} className="btn btn-default"><Icon type="download" /> ScreenLocker apk (v4.45)</button>
                                    </a>
                                </div> 
                            </div> */}

                            {
                                (this.props.user.type === 'admin') ?
                                    <div style={{ textAlign: "center" }}>
                                        {/* <Button
                                            type="primary"
                                            // disabled={(this.props.disableAddButton == true) ? true : false}
                                            style={{ width: '12%', marginBottom:16 }}
                                        >
                                            <Link to='/upload-apk'>Upload apk</Link>
                                        </Button> */}
                                    </div> : false
                            }
                            <ListApk

                                handleStatusChange={this.handleStatusChange}
                                apk_list={this.state.apk_list}
                                // tableChangeHandler={this.tableChangeHandler}
                                handleConfirmDelete={this.handleConfirmDelete}
                                editApk={this.props.editApk}
                                columns={this.state.columns}
                                getApkList={this.props.getApkList}
                                pagination={this.props.DisplayPages}
                                ref="listApk"
                            />
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
                        placeholder={`Search ${dataIndex}`}
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
const mapStateToProps = ({ apk_list, auth }) => {
    // console.log("mapStateToProps apk");
    // console.log(apk_list);
    // console.log("apk_list", auth);
    // console.log("apk_list", apk_list.selectedOptions);
    // console.log("APK LIST", apk_list)
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

export default connect(mapStateToProps, mapDispatchToProps)(Apk);