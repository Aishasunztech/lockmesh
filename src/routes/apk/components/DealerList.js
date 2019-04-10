import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table } from "antd";




const DealerList =(props) =>{
    // let selectedDealers = props.selectedDealers;
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex:1
    };
    return (
        <Fragment>
            <Table
                rowSelection={rowSelection}
                dataSource = {props.dealers}
                columns = {props.columns}
            />
        </Fragment>
    )

}

export default DealerList;