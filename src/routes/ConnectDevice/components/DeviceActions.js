import React, { Component } from 'react'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { Button } from "antd";

class DeviceActions extends Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     applyBtn: false,
        //     undoBtn: false,
        //     redoBtn: false,
        //     clearBtn: false,
        // }
    }
    componentDidMount() {
        // this.setState({
        //     applyBtn: this.props.applyBtn,
        //     undoBtn: this.props.undoBtn,
        //     redoBtn: this.props.redoBtn,
        //     clearBtn: this.props.clearBtn,
        // })
    }
    componentWillReceiveProps(nextProps) {
        // if(this.props !== nextProps){
        //     this.setState({
        //         applyBtn: this.props.applyBtn,
        //         undoBtn: this.props.undoBtn,
        //         redoBtn: this.props.redoBtn,
        //         clearBtn: this.props.clearBtn,
        //     })
        // }
    }

    render() {
        return (


            <Button.Group>
                <Button type="default" icon="check" disabled={!this.props.applyBtn} onClick={() => { this.props.applyActionButton() }} className="action_btn clr_green" />
                <Button type="default" icon="undo" disabled={!this.props.undoBtn} onClick={() => { this.props.undoApplications() }} className="action_btn clr_orange" />
                <Button type="default" icon="redo" disabled={!this.props.redoBtn} onClick={() => { this.props.redoApplications() }} className="action_btn clr_orange" />
                <Button type="default" icon="close" disabled={!this.props.clearBtn} className="action_btn clr_red" />
                {/* <Button type="default" icon="caret-up" disabled={this.state.apply} className="action_btn" /> */}

            </Button.Group>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}
var mapStateToProps = ({ device_details }) => {
    // console.log("sideActions");

    return {
        applyBtn: device_details.applyBtn,
        undoBtn: device_details.undoBtn,
        redoBtn: device_details.redoBtn,
        clearBtn: device_details.clearBtn,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DeviceActions);