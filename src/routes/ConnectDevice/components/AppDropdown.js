import React, { Component } from 'react'
import { Icon, Popover, Checkbox } from 'antd';
import Styles from "./Applist.css";


export default class AppDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guestAll: false,
            encryptedAll: false,
            enableAll: false
        }
    }
    componentDidMount() {
        // console.log("AppDropdown");
        // console.log(this.props);
        this.setState({
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll,
        });
    }
    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps");
        // console.log(nextProps);
        this.setState({
            guestAll: nextProps.guestAll,
            encryptedAll: nextProps.encryptedAll,
            enableAll: nextProps.enableAll,
        })
    }
    handleCheckedAll = (e,key) => {
        // console.log("hello world");
        // console.log(e.target.checked,key);
        this.props.handleCheckedAll(key, e.target.checked);
    }
    renderDropdown() {
        return (
            <div className="applist_menu">
                <Checkbox defaultChecked={this.state.guestAll ? true : false} onChange={(e) => {
                    this.handleCheckedAll(e, "guestAll");
                }}>Turn on Guests All</Checkbox><br></br>
                <Checkbox defaultChecked={this.state.encryptedAll ? true : false} onChange={(e) => {
                    this.handleCheckedAll(e, "encryptedAll");
                }}>Turn On Encrypted All</Checkbox><br></br>
                <Checkbox defaultChecked={this.state.enableAll ? true : false} onChange={(e) => {
                    this.handleCheckedAll(e, "enableAll");
                }}>Enable All</Checkbox>
            </div>
        );
    }
    render() {
        return (
            <Popover className="list_d_down" placement="bottomLeft" content={this.renderDropdown()} trigger="click">
                <a><Icon type="ellipsis" /></a>
            </Popover>
        )
    }
}
