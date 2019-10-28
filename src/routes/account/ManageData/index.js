
import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Card, Button, Row, Col, Select, Input, Checkbox, Icon } from "antd";

import AppFilter from '../../../components/AppFilter';

import CircularProgress from "components/CircularProgress/index";
import AccountList from "./components/accountList";
import styles from './manage_data.css'

import { componentSearch, getDealerStatus, titleCase, convertToLang } from '../../utils/commonUtils';

import {
    LABEL,
    LABEL_DATA_CHAT_ID,
    LABEL_DATA_SIM_ID,
    LABEL_DATA_PGP_EMAIL,
    LABEL_DATA_VPN,
    LABEL_DATA_CREATED_AT,
} from '../../../constants/LabelConstants';

import {
    MANAGE_DATA,
} from "../../../constants/AccountConstants";

import {
    Appfilter_SearchManageData,
    Appfilter_Export
} from '../../../constants/AppFilterConstants';

import { exportCSV, resyncIds } from '../../../appRedux/actions/Account'

import {
    getAllSimIDs,
    getAllChatIDs,
    getAllPGPEmails,
} from "../../../appRedux/actions/Devices";

var copyInnerContent = [];
var status = true;
class ManageData extends Component {

    constructor(props) {
        super(props);

        const columnsSimids = [
            {
                title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                title: (
                    <Input.Search
                        name="sim_id"
                        key="sim_id"
                        id="sim_id"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_SIM_ID], "SIM ID")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'sim_id',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_SIM_ID], "SIM ID"),
                        dataIndex: 'sim_id',
                        key: 'sim_id',
                        align: 'center',
                        sorter: (a, b) => a.sim_id - b.sim_id,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="created_at"
                        key="created_at"
                        id="created_at"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'created_at',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
                        dataIndex: 'created_at',
                        key: 'created_at',
                        align: 'center',
                        sorter: (a, b) => a.created_at - b.created_at,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
        ]
        const columnsChatids = [
            {
                title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                title: (
                    <Input.Search
                        name="chat_id"
                        key="chat_id"
                        id="chat_id"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_CHAT_ID], "CHAT ID")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'chat_id',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_CHAT_ID], "CHAT ID"),
                        dataIndex: 'chat_id',
                        key: 'chat_id',
                        align: 'center',
                        sorter: (a, b) => a.chat_id - b.chat_id,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="created_at"
                        key="created_at"
                        id="created_at"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'created_at',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
                        dataIndex: 'created_at',
                        key: 'created_at',
                        align: 'center',
                        sorter: (a, b) => a.created_at - b.created_at,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
        ]

        const columnsVpn = [
            {
                title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                title: (
                    <Input.Search
                        name="vpn"
                        key="vpn"
                        id="vpn"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_VPN], "VPN")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'vpn',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_VPN], "VPN"),
                        dataIndex: 'vpn',
                        key: 'vpn',
                        align: 'center',
                        sorter: (a, b) => a.vpn - b.vpn,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="created_at"
                        key="created_at"
                        id="created_at"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'created_at',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
                        dataIndex: 'created_at',
                        key: 'created_at',
                        align: 'center',
                        sorter: (a, b) => a.created_at - b.created_at,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
        ]

        const columnsPgpemails = [
            {
                title: '#',
                dataIndex: 'count',
                align: 'center',
                className: 'row',
                width: 50,
            },
            {
                title: (
                    <Input.Search
                        name="pgp_email"
                        key="pgp_email"
                        id="pgp_email"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_PGP_EMAIL], "PGP EMAIL")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'pgp_email',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_PGP_EMAIL], "PGP EMAIL"),
                        dataIndex: 'pgp_email',
                        key: 'pgp_email',
                        align: 'center',
                        sorter: (a, b) => a.pgp_email - b.pgp_email,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },
            {
                title: (
                    <Input.Search
                        name="created_at"
                        key="created_at"
                        id="created_at"
                        className="search_heading"
                        autoComplete="new-password"
                        placeholder={convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT")}
                        onKeyUp={this.handleSearch}

                    />
                ),
                dataIndex: 'created_at',
                className: '',
                children: [
                    {
                        title: convertToLang(props.translation[LABEL_DATA_CREATED_AT], "CREATED AT"),
                        dataIndex: 'created_at',
                        key: 'created_at',
                        align: 'center',
                        sorter: (a, b) => a.created_at - b.created_at,
                        sortDirections: ['ascend', 'descend'],
                        className: '',
                    }
                ]
            },

        ];
        // console.log('c_length', columns.length);

        this.state = {
            dealers: [],
            loading: false,
            visible: false,
            dealer_type: '',
            innerContent: [],
            chat_ids: [],
            pgp_emails: [],
            sim_ids: [],
            columns: columnsChatids,
            columnsChatids: columnsChatids,
            columnsSimids: columnsSimids,
            columnsPgpemails: columnsPgpemails,
            columnsVpn: columnsVpn,
            options: this.props.options,
            pagination: 10,
            tabselect: 'all',
            innerTabSelect: '1',
            whiteLables: []
        };
    }


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




    componentDidMount() {

        this.props.getAllSimIDs();
        this.props.getAllPGPEmails();
        this.props.getAllChatIDs();
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.innerTabSelect === '1') {
            this.setState({
                innerContent: nextProps.chat_ids
            })
        } else if (this.state.innerTabSelect === '2') {
            this.setState({
                innerContent: nextProps.pgp_emails
            })
        } else if (this.state.innerTabSelect === '3') {
            this.setState({
                innerContent: nextProps.sim_ids
            })
        }

        // console.log(nextProps.whiteLabels);
        if (this.props.chat_ids.length !== nextProps.chat_ids.length || this.props.pgp_emails.length !== nextProps.pgp_emails.length || this.props.sim_ids.length !== nextProps.sim_ids.length) {
            this.setState({
                chat_ids: nextProps.chat_ids,
                pgp_emails: nextProps.pgp_emails,
                sim_ids: nextProps.sim_ids,
            })
        }
        // if (nextProps.whiteLabels.length) {
        //     // console.log(nextProps.whiteLabels);
        //     this.setState({
        //         whiteLables: nextProps.whiteLabels
        //     })
        // }

    }

    handleComponentSearch = (value) => {

        // console.log('searched keyword', value);

        try {
            if (value.length) {
                if (status) {
                    copyInnerContent = this.state.innerContent;
                    status = false;
                }
                let founddealers = componentSearch(copyInnerContent, value);
                // console.log("found dealers", founddealers);
                if (founddealers.length) {
                    this.setState({
                        innerContent: founddealers,
                    })
                } else {
                    this.setState({
                        innerContent: []
                    })
                }
            } else {
                status = true;
                this.setState({
                    innerContent: copyInnerContent,
                })
            }
        } catch (error) {
            // alert(error);
        }
    }


    handlePagination = (value) => {
        this.refs.dealerList.handlePagination(value);
        this.props.postPagination(value, this.state.dealer_type);
    }

    handleChangetab = (value) => {

        if (value === 'all') {
            this.setState({
                tabselect: 'all'
            })
        }
        else {
            this.setState({
                tabselect: value
            })

        }
    }
    handleChangeInnerTab = (value) => {


        switch (value) {
            case '1':
                this.setState({
                    innerContent: this.props.chat_ids,
                    columns: this.state.columnsChatids,
                    innerTabSelect: '1'
                })
                status = true;
                break;
            case '2':
                this.setState({
                    innerContent: this.props.pgp_emails,
                    columns: this.state.columnsPgpemails,
                    innerTabSelect: '2'
                })
                status = true;

                break;
            case "3":
                this.setState({
                    innerContent: this.props.sim_ids,
                    columns: this.state.columnsSimids,
                    innerTabSelect: '3'
                })
                status = true;
                break;
            case '4':
                this.setState({
                    // dealers: this.filterList('suspended', this.props.dealers),
                    innerContent: [],
                    columns: this.state.columnsVpn,
                    innerTabSelect: '4'
                })
                status = true;
                break;


            default:
                this.setState({
                    innerContent: this.props.chat_ids,
                    columns: this.state.columnsChatids,
                    innerTabSelect: '1'
                })
                status = true;
                break;
        }

        // this.handleCheckChange(this.props.selectedOptions)

    }
    resyncIds = () => {
        this.props.getAllSimIDs();
        this.props.getAllPGPEmails();
        this.props.getAllChatIDs();
        setTimeout(() => {
            this.props.resyncIds()
        }, 1000);

    }

    render() {
        const Search = Input.Search;
        // console.log(this.state.tabselect);
        // console.log(this.state.columns, window.location.pathname.split("/").pop(), this.state.options)
        return (

            <div>
                {
                    this.props.isloading ? <CircularProgress /> :

                        <div>
                            <Card >
                                <Row gutter={16} className="filter_top">
                                    <Col className="col-md-6 col-sm-6 col-xs-6 vertical_center">
                                        <span className="font_26"> {convertToLang(this.props.translation[MANAGE_DATA], "Manage ID Inventory")} </span>
                                    </Col>
                                    <Col className="col-md-2 col-sm-6 col-xs-6">
                                        <div className="m_mt-16">
                                            <Select
                                                value={convertToLang(this.props.translation[Appfilter_Export], "Export")}
                                                //  defaultValue={this.state.DisplayPages}
                                                style={{ width: '100%' }}
                                            // onSelect={value => this.setState({DisplayPages:value})}
                                            // onChange={value => this.handlePagination(value)}
                                            >
                                                <Select.Option value="10"
                                                    onClick={() => {
                                                        this.props.exportCSV('sim_ids');
                                                    }}
                                                > {convertToLang(this.props.translation[Appfilter_Export], "Export")} {convertToLang(this.props.translation[LABEL_DATA_SIM_ID], "SIM_ID")} </Select.Option>
                                                <Select.Option value="20"
                                                    onClick={() => {
                                                        this.props.exportCSV('chat_ids');
                                                    }}
                                                > {convertToLang(this.props.translation[Appfilter_Export], "Export")} {convertToLang(this.props.translation[LABEL_DATA_CHAT_ID], "CHAT ID")} </Select.Option>
                                                <Select.Option value="30"
                                                    onClick={() => {
                                                        this.props.exportCSV('pgp_emails');
                                                    }}
                                                > {convertToLang(this.props.translation[Appfilter_Export], "Export")} {convertToLang(this.props.translation[LABEL_DATA_PGP_EMAIL], "PGP EMAIL")} </Select.Option>
                                                <Select.Option value="50"
                                                // onClick={() => {
                                                //     this.exportCSV('vpn');
                                                // }}
                                                > {convertToLang(this.props.translation[Appfilter_Export], "Export")} {convertToLang(this.props.translation[LABEL_DATA_VPN], "VPN")} </Select.Option>
                                            </Select>
                                        </div>
                                    </Col>
                                    <Col className="col-md-2 col-sm-6 col-xs-6 m_mt-16">
                                        <Search
                                            placeholder={convertToLang(this.props.translation[Appfilter_SearchManageData], "Search")}
                                            onChange={e => this.handleComponentSearch(e.target.value)}
                                            style={{ width: '100%' }}
                                        />
                                    </Col>
                                    <Col className="col-md-2 col-sm-6 col-xs-6 m_mt-16">
                                        <div className="">
                                            <Button
                                                type="primary"
                                                style={{ width: '100%' }}
                                                onClick={() => this.resyncIds()}
                                            >
                                                REFRESH ID'S DATA
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <AccountList
                                user={this.props.user}
                                whiteLables={this.state.whiteLables}
                                columns={this.state.columns}
                                dataList={this.state.innerContent}
                                // suspendDealer={this.props.suspendDealer}
                                // activateDealer={this.props.activateDealer}
                                // deleteDealer={this.props.deleteDealer}
                                // undoDealer={this.props.undoDealer}
                                // editDealer={this.props.editDealer}
                                pagination={this.props.DisplayPages}
                                // getDealerList={this.props.getDealerList}
                                tabselect={this.state.tabselect}
                                innerTabSelect={this.state.innerTabSelect}
                                handleChangetab={this.handleChangetab}
                                handleChangeInnerTab={this.handleChangeInnerTab}
                                // updatePassword={this.props.updatePassword}
                                ref='dealerList'
                                translation={this.props.translation}
                            />
                        </div>
                }
            </div>
        );
    }

    handleSearch = (e) => {
        // console.log('hi search val is: ', e.target.value);
        // console.log('hi inner content val is: ', this.state.innerContent);

        let demoItems = [];
        if (status) {
            copyInnerContent = this.state.innerContent;
            status = false;
        }
        // console.log("devices", copyInnerContent);

        if (e.target.value.length) {
            copyInnerContent.forEach((item) => {

                if (item[e.target.name] !== undefined) {
                    if ((typeof item[e.target.name]) === 'string') {
                        if (item[e.target.name].toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoItems.push(item);
                        }
                    } else if (item[e.target.name] !== null) {
                        if (item[e.target.name].toString().toUpperCase().includes(e.target.value.toUpperCase())) {
                            demoItems.push(item);
                        }
                    } else {
                        // demoDevices.push(device);
                    }
                } else {
                    demoItems.push(item);
                }
            });
            // console.log("searched value", demoItems);
            this.setState({
                innerContent: demoItems
            })
        } else {
            this.setState({
                innerContent: copyInnerContent
            })
        }
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
    // console.log("mapStateToProps");
    // console.log(state.dealers.isloading);
    // console.log('state.dealer', state.dealers);
    console.log("state.devices.chat_ids , ", state.devices.chat_ids);
    console.log("state.devices.pgp_emails , ", state.devices.pgp_emails);
    console.log("state.devices.sim_ids , ", state.devices.sim_ids);
    return {
        chat_ids: state.devices.chat_ids,
        pgp_emails: state.devices.pgp_emails,
        sim_ids: state.devices.sim_ids,
        translation: state.settings.translation,
        user: state.auth.authUser
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getAllSimIDs: getAllSimIDs,
        getAllChatIDs: getAllChatIDs,
        getAllPGPEmails: getAllPGPEmails,
        exportCSV: exportCSV,
        resyncIds: resyncIds
    }, dispatch);
}



export default connect(mapStateToProps, mapDispatchToProps)(ManageData)