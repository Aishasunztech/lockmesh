// import {
//     DEVICE_ACTIVATED,
//     DEVICE_EXPIRED,
//     DEVICE_PENDING_ACTIVATION,
//     DEVICE_PRE_ACTIVATION,
//     DEVICE_SUSPENDED,
//     DEVICE_UNLINKED
// } from '../../constants/Constants'

const DEALER_SUSPENDED = "suspended";
const DEALER_UNLINKED = "unlinked";
const DEVICE_ACTIVATED = "Active";
const DEVICE_SUSPENDED = "Suspended";
const DEVICE_EXPIRED = "Expired";
const DEVICE_UNLINKED = "Unlinked";
const DEVICE_PENDING_ACTIVATION = "Pending activation";
const DEVICE_PRE_ACTIVATION = "Pre-activated";
const DEVICE_TRIAL = "Trial";
const antd = require('antd');
const react = require('react');
// import React, { Component }  from 'react';

// import react from 'react';
// import { Table, Button, Modal, Row, Col, Spin, Input } from "antd";

module.exports = {

    getStatus: function (status, account_status, unlink_status, device_status, activation_status) {

        if (status === 'active' && (account_status === '' || account_status === null) && unlink_status === 0 && (device_status === 1 || device_status === '1')) {
            return DEVICE_ACTIVATED;
        } else if (status === 'expired') {
            return DEVICE_EXPIRED;
        } else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === null || activation_status === '')) {
            return DEVICE_PENDING_ACTIVATION;
        } else if ((device_status === '0' || device_status === 0) && (unlink_status === '0' || unlink_status === 0) && (activation_status === 0)) {
            return DEVICE_PRE_ACTIVATION;
        } else if ((unlink_status === '1' || unlink_status === 1) && (device_status === 0 || device_status === '0')) {
            // console.log("hello unlinked");
            return DEVICE_UNLINKED;
        } else if (account_status === 'suspended') {
            return DEVICE_SUSPENDED;
        } else {
            return 'N/A';
        }
    },

    getColor: function (status) {
        switch (status) {
            case DEVICE_ACTIVATED:
                return { color: "#008000" };

            case DEVICE_TRIAL:
                return { color: "#008000" };

            case DEVICE_PRE_ACTIVATION:
                return { color: "#0000FF" };

            case DEVICE_EXPIRED:
                return { color: "#FF0000" };
            case DEVICE_UNLINKED:
                return { color: "#FFA500" };
            case DEVICE_SUSPENDED:
                return { color: "#cccc0e" };
            case DEVICE_PENDING_ACTIVATION:
                return { color: "grey" };
            default:
                return {};
        }
    },
    getSortOrder: function (status) {
        switch (status) {
            case DEVICE_ACTIVATED:
                return '1';
            case DEVICE_PRE_ACTIVATION:
                return '4';
            case DEVICE_EXPIRED:
                return '2';
            case DEVICE_UNLINKED:
                return '7';
            case DEVICE_SUSPENDED:
                return '3';
            case DEVICE_PENDING_ACTIVATION:
                return '5';
            default:
                return
        }
    },

    checkValue: function (value) {
        if (value !== undefined && value !== '' && value != null && value !== 'undefined' && value !== 'null') {
            return value;
        } else {
            return 'N/A';
        }
    },
    getDealerStatus: function (unlink_status, account_status) {
        if (unlink_status === 1) {
            return "unlinked";
        } else if ((account_status === '' || account_status === null) && (unlink_status === 0)) {
            return 'active'
        } else if (account_status === 'suspended') {
            return 'suspended';
        } else {
            return 'N/A';
        }
    },

    componentSearch: function (arr, search) {
        let foundDevices = [];
        let obks = Object.keys(arr[0]);
        arr.map((el) => {
            obks.some((obk) => {
                if (obk) {
                    let temp = el[obk];
                    if ((typeof temp) === 'string') {
                        if (temp.toLowerCase().includes(search.toLowerCase())) {
                            foundDevices.push(el);
                            return true;
                        }
                    }
                }
            });
        })
        return foundDevices;
    },
    initCap: (str) => {
        return str.replace(/^\w/, function (chr) { return chr.toUpperCase() })
    },
    titleCase: (str) => {
        var wordsArray = str.toLowerCase().split(/\s+/);
        var upperCased = wordsArray.map(function (word) {
            return word.charAt(0).toUpperCase() + word.substr(1);
        });
        return upperCased.join(" ");
    },
    checkRemainDays: (createDate, validity) => {
        var validDays = 0, createdDateTime, today, days;
        if (validity != null) validDays = validity;

        createdDateTime = new Date(createDate);
        createdDateTime.setDate(createdDateTime.getDate() + validDays);
        today = new Date();
        days = today.getDate() - createdDateTime.getDate();

        if (days <= 0) return "Expire"; else return days;
    },

    dealerColsWithSearch: (searchBar = false, Input, method = true) => {
        var a = [{
            //   title: (
            //     <antd.Input.Search
            //       name="link_code"
            //       key="link_code"
            //       id="link_code"
            //       className="search_heading"
            //       autoComplete="new-password"
            //       placeholder="Dealer Pin"

            //     />
            //   ),
            // title: (<h1>hello</h1>),
            dataIndex: 'link_code',
            className: '',
            children: [
                {
                    title: 'DEALER PIN',
                    dataIndex: 'link_code',
                    key: 'link_code',

                    sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

                    align: 'center',
                    sortDirections: ['ascend', 'descend'],
                    className: '',
                }
            ]
        },
        ]
        var addDealerCols = [
            {
                //   title: (
                //     <Input.Search
                //       name="dealer_id"
                //       key="dealer_id"
                //       id="dealer_id"
                //       className="search_heading"
                //       autoComplete="new-password"
                //       placeholder="Device ID"
                //       onKeyUp={
                //         (e) => {
                //           this.handleSearch(e)
                //         }
                //       }

                //     />
                //   ),
                //   dataIndex: 'dealer_id',
                //   className: '',
                //   children: [
                //     {
                //       title: 'DEALER ID',
                //       dataIndex: 'dealer_id',
                //       key: 'dealer_id',
                //       sortDirections: ['ascend', 'descend'],
                //       sorter: (a, b) => a.dealer_id - b.dealer_id,
                //       align: 'center',
                //       sortDirections: ['ascend', 'descend'],
                //       className: '',
                //     }
                //   ]
            },
            // {
            //   title: (
            //     <Input.Search
            //       name="link_code"
            //       key="link_code"
            //       id="link_code"
            //       className="search_heading"
            //       autoComplete="new-password"
            //       placeholder="Dealer Pin"
            //       onKeyUp={
            //         (e) => {
            //           this.handleSearch(e)
            //         }
            //       }

            //     />
            //   ),
            //   dataIndex: 'link_code',
            //   className: '',
            //   children: [
            //     {
            //       title: 'DEALER PIN',
            //       dataIndex: 'link_code',
            //       key: 'link_code',

            //       sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

            //       align: 'center',
            //       sortDirections: ['ascend', 'descend'],
            //       className: '',
            //     }
            //   ]
            // },
            // {
            //   title: (
            //     <Input.Search
            //       name="dealer_name"
            //       key="dealer_name"
            //       id="dealer_name"
            //       className="search_heading"
            //       autoComplete="new-password"
            //       placeholder="Dealer Name"
            //       onKeyUp={
            //         (e) => {
            //           this.handleSearch(e)
            //         }
            //       }

            //     />
            //   ),
            //   dataIndex: 'dealer_name',
            //   className: '',
            //   children: [
            //     {
            //       title: 'DEALER NAME',
            //       dataIndex: 'dealer_name',
            //       key: 'dealer_name',
            //       // sorter: (a, b) => {
            //       //     console.log(a);
            //       //     // console.log(b);
            //       //     return a.dealer_name.length;
            //       // },
            //       sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

            //       align: 'center',
            //       sortDirections: ['ascend', 'descend'],
            //       className: '',
            //     }
            //   ]
            // },
            // {
            //   title: (
            //     <Input.Search
            //       name="dealer_email"
            //       key="dealer_email"
            //       id="dealer_email"
            //       className="search_heading"
            //       autoComplete="new-password"
            //       placeholder="Dealer Email"
            //       onKeyUp={
            //         (e) => {
            //           this.handleSearch(e)
            //         }
            //       }

            //     />
            //   ),
            //   dataIndex: 'dealer_email',
            //   className: '',
            //   children: [
            //     {
            //       title: 'DEALER EMAIL',
            //       dataIndex: 'dealer_email',
            //       key: 'dealer_email',
            //       // sorter: (a, b) => {
            //       //     console.log(a);
            //       //     // console.log(b);
            //       //     return a.dealer_email.length;
            //       // },
            //       sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

            //       align: 'center',
            //       sortDirections: ['ascend', 'descend'],
            //       className: '',
            //     }
            //   ]
            // },

        ]


        var listDealerCols = [
            {
                title: 'DEALER ID',
                dataIndex: 'dealer_id',
                key: 'dealer_id',
                sorter: (a, b) => a.dealer_id - b.dealer_id,
                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            },
            {
                title: 'DEALER PIN',
                dataIndex: 'link_code',
                key: 'link_code',

                sorter: (a, b) => { return a.link_code.localeCompare(b.link_code) },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            },
            {
                title: 'DEALER NAME',
                dataIndex: 'dealer_name',
                key: 'dealer_name',

                sorter: (a, b) => { return a.dealer_name.localeCompare(b.dealer_name) },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            },
            {
                title: 'DEALER EMAIL',
                dataIndex: 'dealer_email',
                key: 'dealer_email',

                sorter: (a, b) => { return a.dealer_email.localeCompare(b.dealer_email) },

                align: 'center',
                sortDirections: ['ascend', 'descend'],
                className: '',
            },
            {
                title: 'ACTION',
                dataIndex: 'action',
                key: 'action',
                align: 'center',
                className: '',
            },

        ];

        if (searchBar) {

        } else {
            return listDealerCols;
        }

        // console.log('chile Arary')
        // console.log(JSON.stringify(listDealerCols));


        //     // if(searchBar){
        //     //     console.log('with Search');
        //     //     console.log(JSON.stringify(search))

        //     //     console.log('child array: ');
        //     //     console.log(child)

        //     //     console.log('after update for search ');
        //     //     var result = search.map((item,index) => {
        //     //         let flag= true;              
        //     //         for (var i in child) {
        //     //             if (child[i].dataIndex == item.dataIndex) {
        //     //                item.children = [child[i]];
        //     //                flag = false;
        //     //                return item;
        //     //             }
        //     //           }
        //     //           if(flag == true) {
        //     //               return item;
        //     //           }
        //     //     })

        //     //     console.log('result is: ')
        //     //     console.log(result);
        //     // } else {
        //     //     console.log('search false hai');
        //     //     console.log(JSON.stringify(child))
        //     // }
    },
}