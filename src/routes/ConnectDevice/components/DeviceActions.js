import React, { Component } from 'react'

import { Button } from "antd";

const DeviceActions = (props) => {
    return (
        <Button.Group>
            {/* <Button type="default" icon="check" disabled={!props.applyBtn} onClick={() => { props.applyActionButton() }} className="action_btn clr_green" >apply</Button>
            <Button type="default" icon="undo" disabled={!props.undoBtn} onClick={() => { props.undoApplications() }} className="action_btn clr_orange" >undo</Button>
            <Button type="default" icon="redo" disabled={!props.redoBtn} onClick={() => { props.redoApplications() }} className="action_btn clr_orange" >redo</Button>
            <Button type="default" icon="close" disabled={!props.clearBtn} onClick={() => { props.clearApplications() }} className="action_btn clr_red" >clear</Button> */}
        </Button.Group>
    )

}
export default DeviceActions;