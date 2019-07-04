import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal } from "antd";
import { BASE_URL } from '../../../constants/Application';
import IntlMessages from "../../../util/IntlMessages";
import EditDealer from './editDealer';
import { Tabs } from 'antd';
import EditApk from './editDealer';
import { ADMIN } from '../../../constants/Constants';
import DealerDevicesList from '../../users/components/UserDeviceList';
import { Redirect } from 'react-router-dom';
const TabPane = Tabs.TabPane;

let data = [];
const confirm = Modal.confirm;
class DealerList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchText: '',
            columns: [],
            pagination: this.props.pagination,
            expandedRowKeys: [],
            redirect: false,
            dealer_id: '',

        };
        this.renderList = this.renderList.bind(this);
    }

    handlePagination = (value) => {
        // console.log(value)
        var x = Number(value)
        this.setState({
            pagination: x,
        });
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {
            this.setState({
                columns: this.props.columns,
                expandedRowKeys: this.props.expandedRowKeys
            })
        }
    }

    customExpandIcon(props) {
        if (props.expanded) {
            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-down" /> </a>
        } else {

            return <a style={{ fontSize: 22, verticalAlign: 'sub' }} onClick={e => {
                props.onExpand(props.record, e);
            }}><Icon type="caret-right" /></a>
        }
    }

    onExpandRow = (expanded, record) => {
        // console.log(expanded, 'data is expanded', record);
        if (expanded) {
            if (!this.state.expandedRowKeys.includes(record.row_key)) {
                this.state.expandedRowKeys.push(record.row_key);
                this.setState({ expandedRowKeys: this.state.expandedRowKeys })
            }
        } else if (!expanded) {
            if (this.state.expandedRowKeys.includes(record.row_key)) {
                let list = this.state.expandedRowKeys.filter(item => item != record.row_key)
                this.setState({ expandedRowKeys: list })
            }
        }
    }


    handleCheckChange = (values) => {

        let dumydata = this.state.columns;

        try {
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
        } catch (error) {
            alert(error, 'errro');
        }


        this.props.postDropdown(values, this.state.dealer_type);
    }





    renderList(list) {
        data = [];
        list.map((dealer, index) => {
            const dealer_status = (dealer.account_status === "suspended") ? (<IntlMessages id="button.Activate" />) : (<IntlMessages id="button.Suspend" />);
            const button_type = (dealer_status === "ACTIVATE") ? "dashed" : "danger";
            const undo_button_type = (dealer.unlink_status === 0) ? 'danger' : "default";
            data.push({
                'row_key': dealer.dealer_id,
                'accounts': <span>
                    <Button type={button_type} size='small' style={{ margin: '0 8px 0 0', textTransform: "uppercase" }}
                        onClick={() => ((dealer.account_status === '') || (dealer.account_status === null)) ? showConfirm(dealer.dealer_id, this.props.suspendDealer, 'SUSPEND') : showConfirm(dealer.dealer_id, this.props.activateDealer, 'ACTIVATE')}>
                        {(dealer.account_status === '') ? <div>{dealer_status}</div> : <div> {dealer_status}</div>}
                    </Button>
                    <Button type="primary" style={{ margin: '0 8px 0 0', textTransform: "uppercase" }} size='small' onClick={() => this.refs.editDealer.showModal(dealer, this.props.editDealer)}><IntlMessages id="button.Edit" /></Button>
                    <Button type={undo_button_type} size='small' style={{ margin: '0', textTransform: "uppercase" }}
                        onClick={() => (dealer.unlink_status === 0) ? showConfirm(dealer.dealer_id, this.props.deleteDealer, 'DELETE') : showConfirm(dealer.dealer_id, this.props.undoDealer, 'UNDO')}>
                        {(dealer.unlink_status === 0) ? <div> <IntlMessages id="button.Delete" /></div> : <div>  <IntlMessages id="button.Undo" /></div>}

                    </Button>
                    <Button type="primary" style={{ margin: '0 0 0 8px', textTransform: "uppercase" }} size='small' onClick={() => showConfirm(dealer, this.props.updatePassword, 'RESET PASSWORD')} ><IntlMessages id="button.passwordreset" /></Button>
                    {(this.props.user.type === ADMIN) ?
                        <Button style={{ margin: '0 0 0 8px', textTransform: "uppercase" }} size='small' onClick={() => { }} ><IntlMessages id="button.Connect" /></Button>
                        :
                        null
                    }
                </span>,
                'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
                'counter': ++index,
                'dealer_name': dealer.dealer_name ? dealer.dealer_name : 'N/A',
                'dealer_email': dealer.dealer_email ? dealer.dealer_email : 'N/A',
                'link_code': dealer.link_code ? dealer.link_code : 'N/A',
                'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
                'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
                'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
                'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A',
                'devicesList': dealer.devicesList

            })
        });
        return (data);
    }

    render() {
        console.log(this.props.dealersList, 'dealers list console');

        return (
            <Card className="border_top_0">
                <Table
                    size="middle"
                    className="gx-table-responsive devices table"
                    bordered={true}
                    scroll={
                        {
                            x: 500,
                        }
                    }
                    columns={this.state.columns}
                    rowKey='row_key'
                    align='center'
                    rowClassName={(record, index) => this.state.expandedRowKeys.includes(record.row_key) ? 'exp_row' : ''}
                    pagination={false}
                    dataSource={this.renderList(this.props.dealersList)}
                    expandIcon={(props) => this.customExpandIcon(props)}
                    expandedRowRender={(record) => {
                        // console.log("table row", record);
                        return (
                            <DealerDevicesList
                                ref='dealerDeviceList'
                                record={record} />
                            // <span>its working</span>
                        );
                    }}
                    expandIconColumnIndex={2}
                    expandedRowKeys={this.state.expandedRowKeys}
                    onExpand={this.onExpandRow}
                    expandIconAsCell={false}
                    defaultExpandedRowKeys={(this.props.location.state) ? [this.props.location.state.id] : []}
                />
                <EditDealer ref='editDealer' getDealerList={this.props.getDealerList} />

            </Card>
        )
    }
}

function showConfirm(id, action, btn_title) {
    confirm({
        title: 'Do you want to ' + btn_title + ' of this ' + window.location.pathname.split("/").pop() + ' ?',
        onOk() {
            return new Promise((resolve, reject) => {
                setTimeout(Math.random() > 0.5 ? resolve : reject);
                if (btn_title === 'RESET PASSWORD') {
                    id.pageName = 'dealer'
                }
                action(id);
                //  success();

            }).catch(() => console.log('Oops errors!'));
        },
        onCancel() { },
    });
}
export default class Tab extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dealersList: this.props.dealersList,
            tabselect: this.props.tabselect,
            selectedOptions: this.props.selectedOptions,
            tabselect: this.props.tabselect,
            expandedRowKeys: []

        }
    }
    callback = (key) => {
        // alert('callback');
        // console.log(key);
        this.props.handleChangetab(key);
    }

    handlePagination = (value) => {
        this.refs.dealersList.handlePagination(value);
    }

    componentDidUpdate(prevProps) {

        if (this.props !== prevProps) {

            this.setState({
                dealersList: this.props.dealersList,
                columns: this.props.columns,
                tabselect: this.props.tabselect,
                selectedOptions: this.props.selectedOptions,
                expandedRowKeys: this.props.expandedRowsKey
            })
        }
    }

    render() {
        // console.log(this.state.expandedRowsKey, 'key')
        return (
            <Fragment>
                <Tabs defaultActiveKey="1" type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                    <TabPane tab={<span><IntlMessages id="tab.All" /> ({this.props.allDealers})</span>} key="1" >
                    </TabPane>
                    <TabPane tab={<span className="green"><IntlMessages id="tab.Active" /> ({this.props.activeDealers})</span>} key="2" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="yellow"><IntlMessages id="tab.Suspended" /> ({this.props.suspendDealers})</span>} key="4" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="orange"><IntlMessages id="tab.Archived" /> ({this.props.unlinkedDealers})</span>} key="3" forceRender={true}>
                    </TabPane>
                </Tabs>
                <DealerList
                    dealersList={this.state.dealersList}
                    suspendDealer={this.props.suspendDealer}
                    activateDealer={this.props.activateDealer}
                    deleteDealer={this.props.deleteDealer}
                    undoDealer={this.props.undoDealer}
                    columns={this.props.columns}
                    selectedOptions={this.state.selectedOptions}
                    ref="dealersList"
                    pagination={this.props.pagination}
                    editDealer={this.props.editDealer}
                    updatePassword={this.props.updatePassword}
                    location={this.props.location}
                    expandedRowKeys={this.state.expandedRowKeys}
                    user={this.props.user}
                />
            </Fragment>

        )
    }
}