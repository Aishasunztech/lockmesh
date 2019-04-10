import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table } from "antd";


const onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    // this.setState({ selectedRowKeys });
}
const rowSelection = {
    onChange: onSelectChange,
};

const DealerList =(props) =>{
    
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