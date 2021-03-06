import React, { Component } from 'react'
import { Icon, Popover, Checkbox } from 'antd';
// import Styles from "./Applist.css";
import { Encrypted_ALL, GUEST_ALL, Enable_ALL } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';


export default class ExtensionDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guestAll: false,
            encryptedAll: false,
            enableAll: false,
        }

    }
    componentDidMount() {
        // console.log("AppDropdown");
        // console.log(this.props);
        this.setState({
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
            enableAll: this.props.enableAll
        });
    }
    componentWillReceiveProps(nextProps) {
        // if(this.props !== nextProps){
        // alert("hello");
        // console.log("appdropdown nextprops", nextProps);
        // this.state[this.checked_app_id.key] = this.checked_app_id.value;
       
            this.setState({
                guestAll: nextProps.guestAll,
                encryptedAll: nextProps.encryptedAll,
                enableAll: nextProps.enableAll

            })
        // }
    }
    handleCheckedAll = (e, key) => {
        // console.log("hello world");
        // console.log(e.target.checked,key);
        this.props.handleCheckedAll(key, e.target.checked);
    }

    handleCheckedAllPushApps = (e, key) => {
        console.log(e, key, 'handleCheckedAllPushApps')
        this.props.handleCheckedAllPushApps(e.target.checked, key)
    }

    renderDropdown() {
        if (this.props.isPushAppsModal) {
            return (
                <div className="applist_menu">
                    <Checkbox checked={this.state.guestAll ? true : false} onChange={(e) => {
                        this.handleCheckedAllPushApps(e, "guest");
                    }}>{convertToLang(this.props.translation[GUEST_ALL], "Guests All")}</Checkbox><br></br>
                    <Checkbox checked={this.state.encryptedAll ? true : false} onChange={(e) => {
                        this.handleCheckedAllPushApps(e, "encrypted");
                    }}> {convertToLang(this.props.translation[Encrypted_ALL], "Encrypted All")}</Checkbox><br></br>
                    <Checkbox checked={this.state.enableAll ? true : false} onChange={(e) => {
                        this.handleCheckedAllPushApps(e, "enable");
                    }}> {convertToLang(this.props.translation[Enable_ALL], "Enable All")}</Checkbox><br></br>
                </div>
            );
        } else {
            return (
                <div className="applist_menu">
                    <Checkbox checked={this.state.guestAll ? true : false} onChange={(e) => {
                        this.handleCheckedAll(e, "guestAllExt");
                    }}>{convertToLang(this.props.translation[GUEST_ALL], "Guests All")}</Checkbox><br></br>
                    <Checkbox checked={this.state.encryptedAll ? true : false} onChange={(e) => {
                        this.handleCheckedAll(e, "encryptedAllExt");
                    }}> {convertToLang(this.props.translation[Encrypted_ALL], "Encrypted All")}</Checkbox><br></br>
                </div>
            );
        }

    }
    render() {
        return (
            <Popover className={ this.props.isPushAppsModal ? "list_d_down":"list_d_down b-60"} placement="bottomRight" content={this.renderDropdown()} trigger="click">
                <a><Icon type="ellipsis" /></a>
            </Popover>
        )
    }
}
