import React, { Component } from 'react'
import styles from './AppList';
import { Card, Table, Icon } from "antd";
let make_red = 'captilize';
export default class DeviceSidebar extends Component {
    // constructor(props){
    //     super(props);
    // }
    // componentDidMount(){

    // }    

    renderDetailsData(device_details) {
        let device_status = 'Active';

        if ((device_details.status === 'expired')) {
            device_status = 'Expired';
            make_red = 'make_red captilize'
        } else if (device_details.account_status === 'suspended') {
            device_status = 'Suspended';
            make_red = 'make_red captilize'
        } else if(device_details.unlink_status==1){
            device_status = 'Unlinked';
            make_red = 'make_red captilize'
        } else {
            device_status = 'Active';
            make_red = 'captilize'
        }

        return [
            {
                key: 1,
                name: (<a href="javascript:void(0)">Name:</a>),
                value:(<span className="captilize">{device_details.name}</span>)
            },
            {
                key: 2,
                name: (<a href="javascript:void(0)">Account Email:</a>),
                value: device_details.email
            },
            {
                key: 3,
                name: (<a href="javascript:void(0)">PGP Email:</a>),
                value: device_details.pgp_email
            },
            {
                key: 4,
                name: (<a href="javascript:void(0)">Chat ID:</a>),
                value: (device_details.chat_id === 'null' || device_details.chat_id === null || device_details.chat_id ==='')?'N/A':device_details.chat_id
            },
            {
                key: 5,
                name: (<a href="javascript:void(0)">Client ID:</a>),
                value: (device_details.client_id === 'null' || device_details.client_id === null || device_details.client_id ==='')?'N/A':device_details.client_id
            },
            {
                key: 6,
                name: (<a href="javascript:void(0)">Dealer ID:</a>),
                value: device_details.dealer_id
            },
            {
                key: 7,
                name: (<a href="javascript:void(0)">Dealer Name:</a>),
                value: (<span className="captilize">{(device_details.dealer_name === 'null' || device_details.dealer_name === null || device_details.dealer_name ==='')?'N/A':device_details.dealer_name}</span>)
            },
            {
                key: 8,
                name: (<a href="javascript:void(0)">Link Code:</a>),
                value: device_details.link_code
            },
            {
                key: 9,
                name: (<a href="javascript:void(0)">Mac Address:</a>),
                value: device_details.mac_address
            },
            {
                key: 10,
                name: (<a href="javascript:void(0)" >Status:</a>),
                value: <span className={make_red}>{(device_details.account_status=="suspended")?"Suspended":(device_status.unlink_status==1)?"Unlinked":(device_details.status=="active")?"Active":"Expired"}</span>,
            },
            {
                key: 11,
                name: (<a href="javascript:void(0)">Model:</a>),
                value: (device_details.model === 'null' || device_details.model === null || device_details.model ==='')?'N/A':device_details.model
            },
            {
                key: 12,
                name: (<a href="javascript:void(0)">SIM ID:</a>),
                value:(device_details.sim_id === 'null' || device_details.sim_id === null || device_details.sim_id ==='')?'N/A':device_details.sim_id
            },
            {
                key: 13,
                name: (<a href="javascript:void(0)">IMEI 1:</a>),
                value: device_details.imei
            },
            {
                key: 14,
                name: (<a href="javascript:void(0)">SIM 1:</a>),
                value: device_details.simno
            },
            {
                key: 15,
                name: (<a href="javascript:void(0)">IMEI 2:</a>),
                value: device_details.imei2
            },
            {
                key: 16,
                name: (<a href="javascript:void(0)">SIM 2:</a>),
                value:(device_details.simno2 === 'null' || device_details.simno2 === null || device_details.simno2 ==='')?'N/A':device_details.simno2
            },
            {
                key: 17,
                name: (<a href="javascript:void(0)">IP Address:</a>),
                value: device_details.ip_address
            },
            {
                key: 18,
                name: (<a href="javascript:void(0)">Start Date:</a>),
                // value: (Date(device_details.start_date,'mm-dd-Y'))
                value: (device_details.start_date)
            },
            {
                key: 19,
                name: (<a href="javascript:void(0)">Expiry Date:</a>),
                value: device_details.expiry_date
            }
        ]
    }

    renderDetailsColumns(device_details) {
        return [
            {
                title: 'Device ID:',
                dataIndex: 'name',
                className: "device_info",
                width: 100,
            }, {
                key: 0,
                title: (<span >{device_details.device_id}<a href="#" className="ref-btn" onClick={() => {
                    this.props.refreshDevice(device_details.device_id)
                }}><Icon type="sync" spin className="loading_icon" /> <Icon type="reload" /> Refresh</a></span>),
                dataIndex: 'value',
                className: "device_value",
                width: "auto",
            }
        ]
    }

    render() {
        // console.log('device detail', this.props.device_details)
        return (
            <Card>
                <Table
                    columns={
                        this.renderDetailsColumns(this.props.device_details)
                    }
                    dataSource={
                        this.renderDetailsData(this.props.device_details)
                    }
                    scroll={{ y: 562 }}
                    pagination={false}
                />
            </Card>
        )
    }
}
