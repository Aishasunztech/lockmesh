import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table } from "antd";




const DealerList =(props) =>{
    
    const rowSelection = {
        onChange: props.onSelectChange,
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