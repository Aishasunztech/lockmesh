import React, { Component } from 'react'
import { Icon, Popover, Checkbox } from 'antd';
import Styles from "./Applist.css";
import { Encrypted_ALL, GUEST_ALL } from '../../../constants/Constants';
import { convertToLang } from '../../utils/commonUtils';


export default class ExtensionDropdown extends Component {

    constructor(props) {
        super(props);
        this.state = {
            guestAll: false,
        }

    }
    componentDidMount() {
        // console.log("AppDropdown");
        // console.log(this.props);
        this.setState({
            guestAll: this.props.guestAll,
            encryptedAll: this.props.encryptedAll,
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

        })
        // }
    }
    handleCheckedAll = (e, key) => {
        // console.log("hello world");
        // console.log(e.target.checked,key);
        this.props.handleCheckedAll(key, e.target.checked);
    }
    renderDropdown() {
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
    render() {
        return (
            <Popover className="list_d_down b-60" placement="bottomRight" content={this.renderDropdown()} trigger="click">
                <a><Icon type="ellipsis" /></a>
            </Popover>
        )
    }
}
