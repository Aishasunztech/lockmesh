import React, { Component } from 'react'
import IntlMessages from "../../../util/IntlMessages";
import { Button } from "antd";

const DeviceActions = (props) => {
    return (
        <Button.Group className="act_b_grp">
            <Button type="default" icon="check" disabled={!props.applyBtn} onClick={() => { props.applyActionButton() }} className="action_btn clr_green" >
                <IntlMessages id="button.Apply" />
            </Button>
            <Button type="default" icon="undo" disabled={!props.undoBtn} onClick={() => { props.undoApplications() }} className="action_btn clr_orange" >
                <IntlMessages id="button.Undo" />
            </Button>
            <Button type="default" icon="redo" disabled={!props.redoBtn} onClick={() => { props.redoApplications() }} className="action_btn clr_orange" >
                <IntlMessages id="button.Redo" />
            </Button>
            <Button type="default" icon="close" disabled={!props.clearBtn} onClick={() => { props.clearApplications() }} className="action_btn clr_red" >
                <IntlMessages id="button.Clear" />
            </Button>
        </Button.Group>
    )

}
export default DeviceActions;