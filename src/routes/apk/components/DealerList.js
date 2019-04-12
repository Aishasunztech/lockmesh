import React, { Component, Fragment } from 'react'
import { Input, Modal, Select, Table } from "antd";




const DealerList = (props) => {
    // let selectedDealers = props.selectedDealers;
    const rowSelection = {
        // selectedDealers,
        onChange: props.onSelectChange,
        selectionColumnIndex: 1,
        selectedRows: props.selectedRows
    };
    return (
        <Fragment>
            <Table
                bordered
                rowSelection={rowSelection}
                dataSource={props.dealers}
                columns={props.columns}
                hideDefaultSelections={props.hideDefaultSelections}
            />
        </Fragment>
    )

}

export default DealerList;