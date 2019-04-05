import React, { Component } from 'react'
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Table, Button} from "antd";
import { loadDeviceProfile } from "../../../appRedux/actions/ConnectDevice";

import AppList from "./AppList";

class TableHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appColumns: [],
            appData: []
        }
    }
    applyProfile = (app_list) =>{
        this.props.loadDeviceProfile(app_list);
        this.props.showHistoryModal(false,'');
    }
    componentDidMount() {
       //  console.log("componentDidMount", this.props);
        let histories = [];     
        this.props.histories.map((history) => {

           // console.log(history,'object',this.props.type)

            if (this.props.type !== "history" && (this.props.type === history.type) || this.props.type === 'policy') {
                histories.push({
                    key: history.id,
                    history_date: history.name,
                    action: (<Button size="small" className="mb-0" onClick={()=>{ this.applyProfile(history.app_list)}} >Apply</Button>),
                    app_list: history.app_list,
                    controls: history.controls
                })
            } else if (this.props.type === "history") {
                histories.push({
                    key: history.id,
                    history_date: history.created_at,
                    action: (<Button size="small" className="mb-0" onClick={()=>{ this.applyProfile(history.app_list)}} >Apply</Button>),
                    app_list: history.app_list,
                    controls: history.controls
                })
            }
        });
        this.setState({
            appColumns: [
                {
                    title: (this.props.type === "history") ? 'History Date' : `${this.props.type} Name`,
                    dataIndex: 'history_date',
                    key: '1',
                    align: "center"
                },
                {
                    title: "Action",
                    dataIndex: 'action',
                    key: '2',
                    align: "center"
                }
            ],
            appData: histories
        });


    }
    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            // console.log("compnentWillReceiveProps", nextProps);
            let histories = [];
            nextProps.histories.map((history) => {
                if (nextProps.type !== "history" && (this.props.type === history.type) || this.props.type === 'policy') {
                    histories.push( {
                        key: history.id,
                        history_date: history.name,
                        action: (<Button size="small" className="mb-0" onClick={()=>{ this.applyProfile(history.app_list)}} >Apply</Button>),
                        app_list: history.app_list,
                        controls: history.controls
                    })
                } else if (nextProps.type === "history") {
                    histories.push( {
                        key: history.id,
                        history_date: history.created_at,
                        action: (<Button size="small" className="mb-0" onClick={()=>{ this.applyProfile(history.app_list)}} >Apply</Button>),
                        app_list: history.app_list,
                        controls: history.controls
                    })
                }
            });

            this.setState({
                appColumns: [
                    {
                        title: (nextProps.type === "history") ? 'History Date' : `${nextProps.type} Name`,
                        dataIndex: 'history_date',
                        key: '1',
                        align: "center"
                    },
                    {
                        title: "Action",
                        dataIndex: 'action',
                        key: '2',
                        align: "center"
                    }
                ],
                appData: histories
            });
        }
    }
    render() {
        return (
            <Table
                style={{ margin: 0, padding: 0 }}
                size='small'
                bordered={false}
                columns={this.state.appColumns}
                align='center'
                dataSource={this.state.appData}
                pagination={false}
                expandedRowRender={record => {
                    let app_list = JSON.parse(record.app_list);
                    return (<AppList app_list={app_list} style={{ margin: "0px" }} isHistory={true} />);
                }}
            />
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        loadDeviceProfile: loadDeviceProfile

    }, dispatch);
}
var mapStateToProps = ({ routing, device_details }) => {
    // console.log("connect device state");
    // console.log({ routing, device_details });

    return {
        routing: routing,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableHistory)