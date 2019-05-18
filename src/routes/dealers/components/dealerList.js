import React, { Component, Fragment } from 'react'
import { Table, Avatar, Switch, Button, Icon, Card, Modal } from "antd";
import { BASE_URL } from '../../../constants/Application';
import EditDealer from './editDealer';
import { Tabs } from 'antd';
import EditApk from './editDealer';
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
                columns: this.props.columns
            })
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
        list.map((dealer) => {
            const dealer_status = (dealer.account_status === "suspended") ? "ACTIVATE" : "SUSPEND";
            const button_type = (dealer_status === "ACTIVATE") ? "dashed" : "danger";
            const undo_button_type = (dealer.unlink_status === 0) ? 'danger' : "default";
            data.push({
                'row_key': dealer.dealer_id,
                'accounts': <span>
                    <Button type={button_type} size='small' style={{ margin: '0 8px 0 0', width: '60px' }}
                        onClick={() => ((dealer.account_status === '') || (dealer.account_status === null)) ? showConfirm(dealer.dealer_id, this.props.suspendDealer, 'SUSPEND') : showConfirm(dealer.dealer_id, this.props.activateDealer, 'ACTIVATE')}>
                        {(dealer.account_status === '') ? <div>{dealer_status}</div> : <div> {dealer_status}</div>}
                    </Button>
                    <Button type="primary" style={{ margin: '0 8px 0 0' }} size='small' onClick={() => this.refs.editDealer.showModal(dealer, this.props.editDealer)}>EDIT</Button>
                    <Button type={undo_button_type} size='small' style={{ margin: '0', width: '60px' }}
                        onClick={() => (dealer.unlink_status === 0) ? showConfirm(dealer.dealer_id, this.props.deleteDealer, 'DELETE') : showConfirm(dealer.dealer_id, this.props.undoDealer, 'UNDO')}>
                        {(dealer.unlink_status === 0) ? <div> DELETE</div> : <div> UNDO</div>}

                    </Button>
                    <Button type="primary" style={{ margin: '0 0 0 8px' }} size='small' onClick={() => showConfirm(dealer, this.props.updatePassword, 'RESET PASSWORD')} >PASSWORD RESET</Button>
                </span>,
                'dealer_id': dealer.dealer_id ? dealer.dealer_id : 'N/A',
                'dealer_name': dealer.dealer_name ? dealer.dealer_name : 'N/A',
                'dealer_email': dealer.dealer_email ? dealer.dealer_email : 'N/A',
                'link_code': dealer.link_code ? dealer.link_code : 'N/A',
                'parent_dealer': dealer.parent_dealer ? dealer.parent_dealer : 'N/A',
                'parent_dealer_id': dealer.parent_dealer_id ? dealer.parent_dealer_id : 'N/A',
                'connected_devices': dealer.connected_devices[0].total ? dealer.connected_devices[0].total : 'N/A',
                'dealer_token': dealer.dealer_token ? dealer.dealer_token : 'N/A'

            })
        });
        return (data);
    }

    render() {
        // console.log(this.state.pagination)
        return (
            <Card>
                <Table size="middle"
                    className="gx-table-responsive devices table"
                    bordered
                    scroll={{ x: 500 }}
                    columns={this.state.columns}
                    rowKey='row_key'
                    align='center'
                    pagination={{ pageSize: this.state.pagination, size: "midddle" }}
                    dataSource={this.renderList(this.props.dealersList)}
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
            tabselect: this.props.tabselect

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
                selectedOptions: this.props.selectedOptions
            })
        }
    }

    render() {
        return (
            <Fragment>
                <Tabs defaultActiveKey="1" type='card' className="dev_tabs" activeKey={this.state.tabselect} onChange={this.callback}>
                    <TabPane tab="All" key="1" >
                    </TabPane>
                    <TabPane tab={<span className="green">Active</span>} key="2" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="yellow">Suspended</span>} key="4" forceRender={true}>
                    </TabPane>
                    <TabPane tab={<span className="orange">Archived</span>} key="3" forceRender={true}>
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
                />
            </Fragment>

        )
    }
}