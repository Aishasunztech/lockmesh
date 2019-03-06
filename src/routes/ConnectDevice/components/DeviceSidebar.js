import React, { Component } from 'react'
import styles from './AppList';
import { Card, Table, Icon} from "antd";
let make_red = '';
export default class DeviceSidebar extends Component {
    // constructor(props){
    //     super(props);
    // }
    // componentDidMount(){

    // }    

    renderDetailsData(device_details) {
    let device_status = 'Active';
    
        if((device_details.account_status === '') && (device_details.status === 'expired'))
        {
            device_status = 'expired';
            make_red =''
        }
        else if(((device_details.account_status === 'suspended') && (device_details.status === 'expired')) || (device_details.status === 'suspended'))
        {
            device_status = 'Suspended';
             make_red ='make_red'
        }
        else{
            device_status = 'Active';
            make_red =''
        }

        return [
            {
                key: 1,
                name: (<a href="javascript:void(0)">Name:</a>),
                value: device_details.name
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
                value: device_details.chat_id
            },
            {
                key: 5,
                name: (<a href="javascript:void(0)">Client ID:</a>),
                value: device_details.client_id
            },
            {
                key: 6,
                name: (<a href="javascript:void(0)">Dealer ID:</a>),
                value: device_details.dealer_id
            },
            {
                key: 7,
                name: (<a href="javascript:void(0)">Dealer Name:</a>),
                value: device_details.dealer_name
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
                value: <span className={make_red}>{device_details.status}</span>,
            },
            {
                key: 11,
                name: (<a href="javascript:void(0)">Model:</a>),
                value: device_details.model
            },
            {
                key: 12,
                name: (<a href="javascript:void(0)">SIM ID:</a>),
                value: device_details.sim_id
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
                value: device_details.simno2
            },
            {
                key: 17,
                name: (<a href="javascript:void(0)">IP Address:</a>),
                value: device_details.ip_address
            },
            {
                key: 18,
                name: (<a href="javascript:void(0)">Start Date:</a>),
                value: device_details.start_date
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
                className:"device_info",
                width: 100,
            }, {
                title: (<span >{device_details.device_id}<a href="#" className="ref-btn" onClick={()=>{
                    this.props.refreshDevice(device_details.device_id)
                }}><Icon type="sync" spin className="loading_icon"/> <Icon type="reload" /> Refresh</a></span>),
                dataIndex: 'value',
                className:"device_value",
                width: "auto",
            }
        ]
    }

    render() {
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
