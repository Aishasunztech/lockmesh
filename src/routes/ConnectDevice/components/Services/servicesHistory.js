import React, { Component, Fragment } from 'react';
import { Modal, message, Input, Table, Switch, Avatar } from 'antd';
import { componentSearch, getFormattedDate, convertToLang, checkValue } from '../../../utils/commonUtils';
import Moment from 'react-moment';
import { SECURE_SETTING, DATE, PROFILE_NAME, SEARCH } from '../../../../constants/Constants';
import { BASE_URL } from '../../../../constants/Application';
import { PREVIOUSLY_USED_SIMS, ICC_ID } from '../../../../constants/DeviceConstants';

var copyServices = [];
var status = true;
export default class ServicesHistory extends Component {

    constructor(props) {
        super(props);
        this.innerColumns = [
            {
                title: "TYPE",
                dataIndex: 'type',
                key: '1',
            }, {
                title: "Name",
                dataIndex: 'name',
                key: '2',
            }, {
                title: "TERM",
                dataIndex: 'term',
                key: '3',
            }
        ];

        var columns = [
            {
                title: convertToLang(this.props.translation["STATUS"], "STATUS"),
                align: "center",
                dataIndex: 'status',
                key: "status",
                className: '',
                sorter: (a, b) => { return a.status.localeCompare(b.status) },
                sortDirections: ['ascend', 'descend'],
            },
            // {
            //     title: convertToLang(this.props.translation["TYPE"], "TYPE"),
            //     align: "center",
            //     dataIndex: 'type',
            //     key: "type",
            //     className: '',
            //     sorter: (a, b) => { return a.type.localeCompare(b.type) },
            //     sortDirections: ['ascend', 'descend'],
            // },
            {
                title: convertToLang(this.props.translation["NAME"], "NAME"),
                align: "center",
                dataIndex: 'name',
                key: "name",
                className: '',
                sorter: (a, b) => { return a.name.localeCompare(b.name) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["TERM"], "TERM"),
                align: "center",
                dataIndex: 'term',
                key: "term",
                className: '',
                sorter: (a, b) => { return a.term.localeCompare(b.term) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["START DATE"], "START DATE"),
                align: "center",
                dataIndex: 'start_date',
                key: "start_date",
                className: '',
                sorter: (a, b) => { return a.start_date.localeCompare(b.start_date) },
                sortDirections: ['ascend', 'descend'],
            },
            {
                title: convertToLang(this.props.translation["END DATE"], "END DATE"),
                align: "center",
                dataIndex: 'updated_at',
                key: "updated_at",
                className: '',
                sorter: (a, b) => { return a.updated_at.localeCompare(b.updated_at) },
                sortDirections: ['ascend', 'descend'],
                defaultSortOrder: 'descend'
            },
        ]

        this.state = {
            columns: columns,
            visible: props.visible,
            // services: props.servicesHistoryList,
            expandedRowKeys: [],
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
            // services: this.props.servicesHistoryList

        });
    }

    handleCancel = () => {
        this.setState({ visible: false });
    }

    handleComponentSearch = (e) => {
        try {
            let value = e.target.value;
            if (value.length) {
                if (status) {
                    copyServices = this.state.services;
                    status = false;
                }
                let foundSims = componentSearch(copyServices, value);
                if (foundSims.length) {
                    this.setState({
                        services: foundSims,
                    })
                } else {
                    this.setState({
                        services: [],
                    })
                }
            } else {
                status = true;
                this.setState({
                    services: copyServices,
                })
            }

        } catch (error) {
            console.log('error')
        }
    }


    // renderHistory = (data) => {
    //     return data.map((row, index) => {
    //         console.log("row ", row);
    //         if (row.type === "PACKAGE") {
    //             return {
    //                 key: index,
    //                 type: checkValue(row.type),
    //                 name: checkValue(row.pkg_name),
    //                 term: checkValue(row.pkg_term),
    //                 // expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
    //             }
    //         } else if (row.type === "PRODUCT") {
    //             return {
    //                 key: index,
    //                 type: checkValue(row.type),
    //                 name: checkValue(row.price_for),
    //                 term: checkValue(row.price_term),
    //                 // expiry_date: checkValue(moment(row.service_expiry_date).format("YYYY/MM/DD")),
    //             }
    //         } else {

    //             return ({
    //                 key: index,
    //                 type: checkValue(row.type),
    //                 name: checkValue(row.price_for),
    //                 term: checkValue(row.term),
    //             });
    //         }
    //     });
    // }

    onExpandRow = (expanded, record) => {
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.key)) {
                this.state.expandedRowKeys.push(record.key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.key)) {
                let list = this.state.expandedRowKeys.filter(item => item !== record.key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }

    filterServices = (checkServices) => {

        let allServices = [];
        // checkServices.map((services) => {
        checkServices.forEach((services) => {

            let packages = [];
            let products = [];

            if (services && services.packages) {
                packages = JSON.parse(services.packages).map((item) => {
                    item.type = "PACKAGE";
                    item.status = services.status;
                    item.updated_at = services.updated_at;
                    return item;
                });
            }
            // if (services && services.products) {
            //     products = JSON.parse(services.products).map((item) => {
            //         item.type = "PRODUCT";
            //         item.status = services.status;
            //         item.updated_at = services.updated_at;
            //         return item;
            //     });
            // }

            console.log("packages ", packages)
            // console.log("products ", products)

            // if (packages.length === 0 && products.length === 0) {
            //     continue;
            // }
            if (packages && packages.length) {
                allServices.push(...packages)
            }
            // if (products && products.length) {
            //     allServices.push(...products)
            // }

            // return [...packages, ...products];
        })
        return allServices;
    }

    renderList = (data) => {
        console.log('data is: ', data)
        // let data = this.state.services;
        if (data && data.length) {
            return data.map((row, index) => {
                console.log(row);
                return {
                    key: index,
                    status: checkValue(row.status).toUpperCase(),
                    type: checkValue(row.type),
                    name: checkValue(row.pkg_name),
                    term: checkValue(row.pkg_term),
                    updated_at: getFormattedDate(row.updated_at),
                    data: row
                }


            })
        } else {
            return []
        }
    }

    render() {
        const { visible } = this.state;
        var { servicesHistoryList } = this.props;
        // console.log("servicesHistoryList history ", this.props.servicesHistoryList)

        let allServices = this.filterServices(servicesHistoryList);
        // console.log("allServices ", allServices);
        return (
            <div>
                <Modal
                    maskClosable={false}
                    visible={visible}
                    title={<div>Services History <small>(Returned, Cancelled & Completed)</small></div>} //{convertToLang(this.props.translation["PREVIOUSLY_USED_SIMS"], "Services History")}
                    onCancel={this.handleCancel}
                    footer={null}
                >
                    <Input.Search
                        name="search"
                        key="search"
                        id="search"
                        onKeyUp={
                            (e) => {
                                this.handleComponentSearch(e)
                            }
                        }
                        placeholder={convertToLang(this.props.translation[SEARCH], "Search")}
                    />
                    <Table
                        columns={this.state.columns}
                        bordered
                        dataSource={this.renderList(allServices)}
                        pagination={false}
                    />
                </Modal>
            </div>
        )
    }
}
