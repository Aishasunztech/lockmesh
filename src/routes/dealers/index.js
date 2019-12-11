
import React, { Component } from "react";
import { connect } from "react-redux";
// import { bindActionCreators } from "redux";
import { Input, Modal, Select, Button } from "antd";
import { componentSearch, getDealerStatus, titleCase, convertToLang, handleMultipleSearch, filterData_RelatedToMultipleSearch } from '../utils/commonUtils';
import { getDealerList, suspendDealer, deleteDealer, activateDealer, undoDealer, updatePassword, editDealer } from "../../appRedux/actions/Dealers";
import { getDropdown, postDropdown, postPagination, getPagination } from '../../appRedux/actions/Common';
import { resetUploadForm } from "../../appRedux/actions/Apk";
// import {getDevicesList} from '../../appRedux/actions/Devices';
import AppFilter from '../../components/AppFilter';
import AddDealer from '../addDealer/index';
import EditDealer from './components/editDealer';
import CircularProgress from "components/CircularProgress/index";
import DealerList from "./components/dealerList";
import styles from './dealers.css'


import {
    Appfilter_SearchDealer, Appfilter_ShowDealer, DEALER_PAGE_HEADING, S_Dealer_PAGE_HEADING
} from '../../constants/AppFilterConstants';
import {
    // ADMIN,
    DEALER,
    SDEALER,
} from '../../constants/Constants'

import {
    Button_Ok,
    Button_Cancel,
    Button_Add_Dealer,
    Button_Add_S_dealer,
    // Button_Add_Admin,
} from '../../constants/ButtonConstants';

// import {
//     DEVICES
// } from '../../constants/UserConstants';

import {
    // DEALER_ID,
    // DEALER_NAME,
    // DEALER_EMAIL,
    // DEALER_PIN,
    // DEALER_DEVICES,
    // DEALER_TOKENS,
    // DEALER_ACTION,
    Parent_Dealer,
    Parent_Dealer_ID,
} from '../../constants/DealerConstants';


import { isArray } from "util";
import { Tab_All, Tab_Active, Tab_Suspended, Tab_Archived } from "../../constants/TabConstants";
// import { ADMIN, DEALER } from "../../constants/Constants";
import { dealerColumns, sDealerColumns } from '../utils/columnsUtils';
import { Sidebar_dealers, Sidebar_sdealers } from "../../constants/SidebarConstants";

var copyDealers = [];
var status = true;
class Dealers extends Component {

    constructor(props) {
        super(props);
        var columns = dealerColumns(props.translation, this.handleSearch);

        this.state = {
            sorterKey: '',
            sortOrder: 'ascend',
            dealers: [],
            loading: false,
            visible: false,
            dealer_type: '',
            columns: columns,
            options: this.props.options,
            loading_DealerModal: false,
            visible_DealerModal: false,
            pagination: 10,
            tabselect: '2',
            allDealers: [],
            activeDealers: [],
            suspendDealers: [],
            unlinkedDealers: [],
            expandedRowsKey: [],
            SearchValues: [],
            filteredDealers: [],
            globalSearchedValue: "",
        };
        this.handleChange = this.handleChange.bind(this);
    }

    // handleTableChange = (pagination, query, sorter) => {
    //     // console.log('check sorter func: ', sorter)
    //     const sortOrder = sorter.order || "ascend";
    //     this.setState({
    //         sortOrder,
    //         columns: dealerColumns(sortOrder, this.props.translation, this.handleSearch)
    //     })
    // };

    handleTableChange = (pagination, query, sorter) => {
        // console.log('check sorter func: ', sorter)
        let { columns } = this.state;

        columns.forEach(column => {
            if (column.children) {
                if (Object.keys(sorter).length > 0) {
                    if (column.dataIndex == sorter.field) {
                        if (this.state.sorterKey == sorter.field) {
                            column.children[0]['sortOrder'] = sorter.order;
                        } else {
                            column.children[0]['sortOrder'] = "ascend";
                        }
                    } else {
                        column.children[0]['sortOrder'] = "";
                    }
                    this.setState({ sorterKey: sorter.field });
                } else {
                    if (this.state.sorterKey == column.dataIndex) column.children[0]['sortOrder'] = "ascend";
                }
            }
        })
        this.setState({
            columns: columns
        });
    }

    showAddDealer = () => {
        this.setState({
            visible_DealerModal: true,
        });

    };

    handleOk = () => {
        this.setState({ loading_DealerModal: true });
        setTimeout(() => {
            this.setState({ loading_DealerModal: false, visible_DealerModal: false });
        }, 3000);
    };

    handleCancel = (e) => {
        this.setState({ visible_DealerModal: false });

        // this.props.resetUploadForm(true)
    };

    showModal = () => {
        this.setState({
            visible: true,
        });
    }


    filterList = (type, dealers) => {
        let dumyDealers = [];
        dealers.filter(function (dealer) {
            let dealerStatus = getDealerStatus(dealer.unlink_status, dealer.account_status);
            if (dealerStatus === type) {
                dumyDealers.push(dealer);
            }
        });
        return dumyDealers;
    }

    handleChange(value) {
        // alert('value');
        // alert(value);
        // let type = value.toLowerCase();
        let dealers = [];
        switch (value) {
            case 'active':
                status = true;
                dealers = this.filterList('active', this.props.dealers);
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '2'
                })

                break;
            case 'suspended':
                status = true;
                dealers = this.filterList('suspended', this.props.dealers);
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '4'
                })
                break;

            case 'all':
                status = true;
                dealers = this.props.dealers;
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '1'
                })
                break;
            case "unlinked":
                status = true;
                dealers = this.filterList('unlinked', this.props.dealers);
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '3'
                })
                break;

            default:
                status = true;
                dealers = this.props.dealers;
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '1'
                })
                break;
        }

    }

    handleCheckChange = (values) => {

        let dumydata = this.state.columns;
        //  console.log('values', values)
        if (values.length) {
            this.state.columns.map((column, index) => {
                // console.log("column", column);
                // console.log("index", index);


                if (dumydata[index].className !== 'row') {
                    dumydata[index].className = 'hide';
                    dumydata[index].children[0].className = 'hide';
                    // dumydata[]
                }

                values.map((value) => {
                    // console.log("valueis", value);
                    // console.log("column", column)
                    if (column.className !== 'row') {
                        if (column.dataIndex === value.key) {
                            dumydata[index].className = '';
                            dumydata[index].children[0].className = '';
                        }
                    }

                });
            });
            // console.log("dumy data again", dumydata);

            this.setState({ columns: dumydata });
        } else {

            const newState = this.state.columns.map((column) => {
                if (column.className === 'row') {
                    return column;
                } else {
                    column.children[0].className = 'hide';
                    return ({ ...column, className: 'hide' })
                }
            });

            this.setState({ columns: newState });
        }
        // console.log('this.state.dealer_type is: ', this.state.dealer_type);

        this.props.postDropdown(values, this.state.dealer_type);
    }

    handleFilterOptions = () => {
        return (
            <Select
                showSearch
                placeholder={convertToLang(this.props.translation[Appfilter_ShowDealer], "Show Dealer")
                    // <IntlMessages id="appfilter.ShowDealer" />
                }
                optionFilterProp="children"
                style={{ width: '100%' }}
                filterOption={(input, option) => {
                    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                onChange={this.handleChange}
            >
                <Select.Option value="all">{convertToLang(this.props.translation[Tab_All], "All")}</Select.Option>
                <Select.Option value="active">{convertToLang(this.props.translation[Tab_Active], "Active")}</Select.Option>
                <Select.Option value="suspended">{convertToLang(this.props.translation[Tab_Suspended], "Suspended")}</Select.Option>
                <Select.Option value="unlinked">{convertToLang(this.props.translation[Tab_Archived], "Archived")}</Select.Option>
            </Select>
        );
    }



    componentWillMount() {
        //  alert('will mount ');

    }


    componentDidMount() {
        const dealer_type = window.location.pathname.split("/").pop();
        // console.log('device type', dealer_type);
        this.props.getDealerList(dealer_type);
        // this.props.getDevicesList();
        this.props.getDropdown(dealer_type);
        this.props.getPagination(dealer_type);

        this.setState({
            expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
        })

        // this.setState({
        //     //  devices: this.props.devices,
        //     dealer_type: dealer_type
        // })
        //    console.log('did mount',this.props.getDropdown(dealer_type));

    }

    testfunc = () => {
        // alert('testing');
        // console.log('testing');
    }

    componentWillReceiveProps(nextProps) {
        // alert("componentWillReceiveProps");
        const dealer_type = nextProps.match.params.dealer_type;
        //    console.log('device type recieved', dealer_type);

        if (this.props !== nextProps) {
            this.setState({
                expandedRowsKeys: (this.props.location.state) ? [this.props.location.state.id] : []
            })
        }

        if (this.state.dealer_type !== dealer_type) {
            this.props.getDealerList(dealer_type);
            // this.props.getDevicesList();
            this.setState({
                dealer_type: dealer_type,
                dealers: this.props.dealers,
            })
            this.props.getDropdown(dealer_type);
            this.handleCheckChange(this.props.selectedOptions)

        }
    }

    handleGlobalSearch(dealers) {
        // console.log("HANDLE GLOBAL SEARCH");
        if (dealers.length) {
            if (this.state.globalSearchedValue !== "") {
                status = true
                let foundDealers = componentSearch(dealers, this.state.globalSearchedValue);
                if (foundDealers.length) {
                    dealers = foundDealers
                } else {
                    dealers = []
                }
            }
        }
        return dealers
    }

    handleComponentSearch = (value) => {

        // console.log('searched keyword', value);

        try {
            switch (this.state.tabselect) {
                case '1':
                    copyDealers = this.state.allDealers
                    break;
                case '2':
                    copyDealers = this.state.activeDealers
                    break;
                case '3':
                    copyDealers = this.state.unlinkedDealers
                    break;
                case '4':
                    copyDealers = this.state.suspendDealers
                    break;
                default:
                    copyDealers = this.state.allDealers
                    break;
            }
            if (value.length) {
                // if (status) {
                //     copyDealers = this.state.filteredDealers;
                //     status = false;
                // }
                let founddealers = componentSearch(copyDealers, value);
                // console.log("found dealers", founddealers);
                if (founddealers.length) {
                    this.setState({
                        dealers: founddealers,
                        globalSearchedValue: value
                    })
                } else {
                    this.setState({
                        dealers: [],
                        globalSearchedValue: value
                    })
                }
            } else {
                status = true;
                this.setState({
                    dealers: copyDealers,
                    globalSearchedValue: ""
                })
            }
        } catch (error) {
            // console.log("error: ", error);
            // alert(error);
        }
    }


    componentDidUpdate(prevProps) {
        // console.log('updated', this.state.columns);

        if ((window.location.pathname.split("/").pop() === 'sdealer') && (this.state.columns !== undefined) && (this.state.options !== undefined) && (this.state.columns !== null) && (this.state.columns.length <= 8)) {
            //  alert('if sdealer')
            status = true;
            let sDealerCols = sDealerColumns(this.props.translation, this.handleSearch);
            this.state.columns.push(...sDealerCols);
            // this.state.columns = this.state.columns
        }
        if ((window.location.pathname.split("/").pop() === 'sdealer') && (this.state.options.length <= 6)) {
            // alert('if sdealer')
            status = true;
            this.state.options.push(convertToLang(this.props.translation[Parent_Dealer], "PARENT DEALER"), convertToLang(this.props.translation[Parent_Dealer_ID], "PARENT DEALER ID"));
        }
        else if ((window.location.pathname.split("/").pop() === 'dealer') && ((this.state.columns.length > 8) || (this.state.options.length > 6))) {
            // alert('if dealer')
            status = true;
            this.state.columns = this.state.columns.filter(lst => lst.title !== convertToLang(this.props.translation[Parent_Dealer_ID], "PARENT DEALER ID"));
            this.state.columns = this.state.columns.filter(lst => lst.title !== convertToLang(this.props.translation[Parent_Dealer], "PARENT DEALER"));
            this.state.options = this.state.options.slice(0, 6);
        }


        if (this.props.dealers !== prevProps.dealers) {
            this.setState({
                dealers: this.props.dealers
            })
        }
        if (this.props !== prevProps) {
            let dealerList = []
            switch (this.state.tabselect) {
                case '2':
                    dealerList = this.filterList('active', this.props.dealers);
                    break;
                case '3':
                    dealerList = this.filterList('unlinked', this.props.dealers);
                    break;
                case '4':
                    dealerList = this.filterList('suspended', this.props.dealers);
                    break;
                default:
                    dealerList = this.filterList('active', this.props.dealers);
                    break;
            }
            this.setState({
                dealers: dealerList,
                allDealers: this.props.dealers,
                activeDealers: this.filterList('active', this.props.dealers),
                suspendDealers: this.filterList('suspended', this.props.dealers),
                unlinkedDealers: this.filterList('unlinked', this.props.dealers),
            })
            this.handleChangetab(this.state.tabselect);
        }
        if (this.props.translation !== prevProps.translation) {
            this.setState({
                columns: dealerColumns(this.props.translation, this.handleSearch)
            })
        }

        if (this.props.selectedOptions !== prevProps.selectedOptions) {
            this.handleCheckChange(this.props.selectedOptions)
        }


    }




    handlePagination = (value) => {
        this.refs.dealerList.handlePagination(value);
        this.props.postPagination(value, this.state.dealer_type);
    }

    handleChangetab = (value) => {
        // alert('value');
        // alert(value);
        // console.log('tab value: ', value);
        // console.log('selsect', this.props.selectedOptions)
        // let type = value.toLowerCase();
        let dealers = this.props.dealers;
        switch (value) {
            case '2':
                status = true;
                dealers = this.filterList('active', this.props.dealers);
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '2'
                })
                break;
            case '4':
                status = true;
                dealers = this.filterList('suspended', this.props.dealers);
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '4'
                })
                break;
            case '1':
                status = true;
                dealers = this.props.dealers;
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '1'
                })
                break;
            case "3":
                status = true;
                dealers = this.filterList('unlinked', this.props.dealers);
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '3'
                })
                break;
            default:
                status = true;
                dealers = this.props.dealers;
                dealers = (this.state.globalSearchedValue === "") ? dealers : this.handleGlobalSearch(dealers);
                this.setState({
                    dealers: this.handleSearchOnTabChange(dealers),
                    filteredDealers: dealers,
                    tabselect: '1'
                })
                break;
        }

        // this.handleCheckChange(this.props.selectedOptions)

    }


    render() {
        // console.log('copy dealers: ', copyDealers);
        // ADMIN,DEALER,SDEALER
        // console.log(this.props.location, 'location is the ')
        let dealerType;
        let dealerHeadingType;
        const type = this.state.dealer_type;
        // if (type === ADMIN) {
        // dealerType = convertToLang(this.props.translation[Button_Add_Admin], Button_Add_Admin)}
        if (type === DEALER) {
            dealerType = convertToLang(this.props.translation[Button_Add_Dealer], "Add Dealer")
            dealerHeadingType = convertToLang(this.props.translation[Sidebar_dealers], "Dealers")
        } else if (type === SDEALER) {
            dealerType = convertToLang(this.props.translation[Button_Add_S_dealer], "Add S-dealer")
            dealerHeadingType = convertToLang(this.props.translation[Sidebar_sdealers], "S-Dealers")
        }
        return (

            <div>
                {
                    this.props.isloading ? <CircularProgress /> :

                        <div>
                            {/* <AddDealer ref='addDealer'  /> */}
                            <Modal
                                visible={this.state.visible_DealerModal}
                                title={dealerType}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={null}
                                maskClosable={false}
                                destroyOnClose={true}
                                okText={convertToLang(this.props.translation[Button_Ok], "Ok")}
                                cancelText={convertToLang(this.props.translation[Button_Cancel], "Cancel")}
                            >
                                <AddDealer
                                    handleCancel={this.handleCancel}
                                    dealersList={this.state.dealers}
                                    dealer_type={this.state.dealer_type}
                                    dealerTypeText={dealerType}
                                    translation={this.props.translation}
                                />

                            </Modal>

                            <AppFilter
                                handleFilterOptions={this.handleFilterOptions}
                                searchPlaceholder={convertToLang(this.props.translation[Appfilter_SearchDealer], "Search Dealer")}
                                defaultPagingValue={this.props.DisplayPages}
                                addButtonText={dealerType}
                                selectedOptions={this.props.selectedOptions}
                                options={this.state.options}
                                isAddButton={true}
                                dealer_type={this.state.dealer_type}
                                displayOptions={
                                    [
                                        { label: 'Thing 1', value: 1 },
                                        { label: 'Thing 2', value: 2 },
                                    ]
                                }
                                handleCheckChange={this.handleCheckChange}
                                handlePagination={this.handlePagination}
                                handleComponentSearch={this.handleComponentSearch}
                                testfunc={this.testfunc}
                                addDealer={this.showAddDealer}
                                translation={this.props.translation}
                                //  toLink={"/create-dealer/" + this.state.dealer_type}
                                pageHeading={dealerHeadingType}

                            />
                            <DealerList
                                onChangeTableSorting={this.handleTableChange}
                                columns={this.state.columns}
                                dealersList={this.state.dealers}
                                allDealers={this.state.allDealers.length}
                                activeDealers={this.state.activeDealers.length}
                                suspendDealers={this.state.suspendDealers.length}
                                unlinkedDealers={this.state.unlinkedDealers.length}
                                suspendDealer={this.props.suspendDealer}
                                activateDealer={this.props.activateDealer}
                                deleteDealer={this.props.deleteDealer}
                                undoDealer={this.props.undoDealer}
                                editDealer={this.props.editDealer}
                                pagination={this.props.DisplayPages}
                                getDealerList={this.props.getDealerList}
                                tabselect={this.state.tabselect}
                                handleChangetab={this.handleChangetab}
                                updatePassword={this.props.updatePassword}
                                location={this.props.location}
                                expandedRowsKey={this.state.expandedRowsKeys}
                                user={this.props.user}
                                ref='dealerList'
                                translation={this.props.translation}
                            />

                        </div>
                }
            </div>
        );
    }

    handleSearch = (e) => {

        // console.log("dealer handleSearch key: ", e.target.name, "value: ", e.target.value);

        this.state.SearchValues[e.target.name] = { key: e.target.name, value: e.target.value };
        // console.log("data ; ", this.state.filteredDealers);
        let response = handleMultipleSearch(e, status, copyDealers, this.state.SearchValues, this.state.filteredDealers)

        // console.log(response.SearchValues, "response is: ===========> ", response)
        this.setState({
            dealers: response.demoData,
            SearchValues: response.SearchValues
        });
        status = response.copy_status;
        copyDealers = response.copyRequireSearchData;


        // let demoDealers = [];
        // let demoSearchValues = this.state.SearchValues;
        // if (status) {
        //     copyDealers = this.state.dealers;
        //     status = false;
        // }
        // console.log("coppydealers ", copyDealers);

        // let targetName = e.target.name;
        // let targetValue = e.target.value;

        // // if (e.target.value.length) {
        // if (targetValue.length || Object.keys(demoSearchValues).length) {
        //     demoSearchValues[targetName] = { key: targetName, value: targetValue };
        //     this.state.SearchValues[targetName] = { key: targetName, value: targetValue };

        //     // console.log("keyname", e.target.name);
        //     // console.log("value", e.target.value);
        //     // console.log(this.state.dealers);
        //     copyDealers.forEach((dealer) => {
        //         // console.log("device", dealer);
        //         // console.log('dealer amount is', dealer[e.target.name])

        //         let searchColsAre = Object.keys(demoSearchValues).length;
        //         let searchDealers = 0;

        //         if (searchColsAre > 0) {
        //             Object.values(demoSearchValues).forEach((data) => {

        //                 if (data.value == "") {
        //                     searchDealers++;
        //                 }
        //                 else if ((typeof dealer[data.key]) === 'string') {
        //                     if (dealer[data.key].toUpperCase().includes(data.value.toUpperCase())) {
        //                         searchDealers++;
        //                     }
        //                 } else if (dealer[data.key] !== null) {
        //                     if (isArray(dealer[data.key])) {
        //                         // console.log('is it working', data.key)
        //                         if (dealer[data.key][0]['total'].toString().toUpperCase().includes(data.value.toUpperCase())) {
        //                             // demoDealers.push(dealer);
        //                             searchDealers++;
        //                         }
        //                     } else if (dealer[data.key].toString().toUpperCase().includes(data.value.toUpperCase())) {
        //                         searchDealers++;
        //                     }

        //                 } else {
        //                     // demoDevices.push(device);
        //                 }

        //             })

        //             if (searchColsAre === searchDealers) {
        //                 demoDealers.push(dealer);
        //             }

        //         } else {
        //             if (dealer[targetName].toUpperCase().includes(targetValue.toUpperCase())) {
        //                 demoDealers.push(dealer);
        //             }
        //         }

        //     });
        //     // console.log("searched value", demoDealers);
        //     this.setState({
        //         dealers: demoDealers,
        //         SearchValues: demoSearchValues
        //     })
        // } else {
        //     this.setState({
        //         dealers: copyDealers,
        //         SearchValues: demoSearchValues
        //     })
        // }
    }


    handleSearchOnTabChange = (dealers) => {
        // console.log('check 2nd search data:: ', dealers);

        let response = filterData_RelatedToMultipleSearch(dealers, this.state.SearchValues);
        return response;

        // let searchedDealers = [];
        // let searchData = Object.values(this.state.SearchValues);
        // let searchColsAre = Object.keys(this.state.SearchValues).length;

        // if (searchColsAre) {
        //     Dealers.forEach((device) => {
        //         let searchDealers = 0;

        //         for (let search of searchData) {
        //             // console.log('search is: ', search)
        //             // console.log('search key is: ', search.key)
        //             if (search.value == "") {
        //                 searchDealers++;
        //             } else if (isArray(device[search.key])) {
        //                 // console.log('is it working', data.key)
        //                 if (device[search.key].toString().toUpperCase().includes(search.value.toUpperCase())) {
        //                     searchDealers++;
        //                 }
        //             } else if (device[search.key].toString().toUpperCase().includes(search.value.toUpperCase())) {
        //                 searchDealers++;
        //             }

        //         }
        //         if (searchColsAre === searchDealers) {
        //             searchedDealers.push(device);
        //         }

        //     });
        //     return searchedDealers;
        // } else {
        //     return Dealers;
        // }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('Received values of form: ', values);
            }
        });
    }
}


var mapStateToProps = (state) => {
    return {
        isloading: state.dealers.isloading,
        dealers: state.dealers.dealers,
        options: state.settings.dealerOptions,
        suspended: state.dealers.suspended,
        selectedOptions: state.dealers.selectedOptions,
        DisplayPages: state.dealers.DisplayPages,
        action: state.action,
        user: state.auth.authUser,
        locale: state.settings.locale,
        translation: state.settings.translation
    };
}



export default connect(mapStateToProps, { getDealerList, suspendDealer, deleteDealer, activateDealer, undoDealer, updatePassword, editDealer, getDropdown, postDropdown, postPagination, getPagination, resetUploadForm })(Dealers)
