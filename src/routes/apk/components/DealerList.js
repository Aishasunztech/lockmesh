import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table } from "antd";

const DealerList =(props) =>{
    
    return (
        <Fragment>
            <Table
                dataSource = {props.dealers}
                columns = {props.columns}
            />
        </Fragment>
    )
    
}

export default DealerList;