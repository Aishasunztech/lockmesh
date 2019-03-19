import React, { Component } from 'react'
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon } from "antd";
// import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import styles from "./appfilter.css";
import Picky from 'react-picky';
import 'react-picky/dist/picky.css';
import { Link } from 'react-router-dom';

export default class AppFilter extends Component {
    constructor(props) {
        super(props);
        // console.log('appfilter constructor', this.props.selectedOptions);
        this.state = {
            selectedDisplayValues: [],
        }
    }

    componentDidMount() {
        //  console.log("componentDidMount selectedOptions appfilter", this.props.selectedOptions);

        this.setState({
            selectedDisplayValues: this.props.selectedOptions
        });

        //this.setDropdowns(this.props.selectedOptions);
        // alert('did mount ', )
        // this.setDropdowns(this.props.selectedOptions);
        // console.log("componentDidMount12", this.state.selectedDisplayValues);
        // this.props.handleCheckChange(this.props.selectedOptions);
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps.selectedOptions, 'component will recieve props', this.props.selectedOptions);

        if (this.props.selectedOptions !== nextProps.selectedOptions) {
            //  console.log(nextProps.selectedOptions, "componentWillReceiveProps selectedOptions", this.props.selectedOptions);
            // console.log("componentWillReceiveProps", this.state.selectedDisplayValues);
            // alert('recive props', nextProps.selectedOptions);
            // console.log(' recive props set dropdwon', nextProps);
            this.setDropdowns(nextProps.selectedOptions);

            //  this.props.handleCheckChange();
        }
    }

    setDropdowns(values) {
        // console.log('values of undefined', values);
        this.setState({
            selectedDisplayValues: values,
        });
        // console.log('values:',this.state.selectedDisplayValues);
        this.props.handleCheckChange(values);
        //  alert('set dropdwon');
        // console.log('set dropdwon');
    }
    handlePagination(value) {
        this.props.handlePagination(value);
    }

    handleComponentSearch = (value) => {
        this.props.handleComponentSearch(value);
    }
    render() {
        let fullScreenClass1 = "";
        let fullScreenClass2 = "";
        if (this.props.isAddButton === false) {
            fullScreenClass1 = "col-md-3";
            fullScreenClass2 = "col-md-3";
        } else {
            fullScreenClass1 = "col-md-3";
            fullScreenClass2 = "col-md-2";
        }

        const Search = Input.Search;

        //  console.log('render ...', this.props.selectedOptions);

        return (
            // className="gutter-example"
            <Card >
                <Row gutter={16} className="filter_top">
                    <Col className={`${fullScreenClass1} col-sm-6 col-xs-12`}>
                        <div className="gutter-box">
                            <Icon type="down" className="down_icon" />
                            <Picky
                                options={this.props.options}
                                value={this.state.selectedDisplayValues}
                                placeholder="Display"
                                className="display_"
                                multiple={true}
                                includeSelectAll={true}
                                onChange={values => this.setDropdowns(values)}
                                dropdownHeight={300}
                                renderSelectAll={({
                                    filtered,
                                    tabIndex,
                                    allSelected,
                                    toggleSelectAll,
                                    multiple
                                }) => {

                                    // Don't show if single select or items have been filtered.
                                    if (multiple && !filtered) {
                                        return (

                                            <li
                                                tabIndex={tabIndex}
                                                role="option"
                                                className={allSelected ? 'option selected' : 'option'}
                                                onClick={toggleSelectAll}
                                                onKeyPress={toggleSelectAll}
                                            >
                                                {/* required to select item */}
                                                {/* <input type="checkbox" checked={isSelected} readOnly /> */}
                                                <Checkbox
                                                    checked={allSelected} className="slct_all"
                                                >SELECT ALL</Checkbox>
                                            </li>
                                        );
                                    }
                                }}
                                render={({
                                    style,
                                    isSelected,
                                    item,
                                    selectValue,
                                    labelKey,
                                    valueKey,
                                    multiple
                                }) => {

                                    return (
                                        <li
                                            style={style} // required
                                            className={isSelected ? 'selected' : ''} // required to indicate is selected
                                            key={item[valueKey]} // required
                                            onClick={() => selectValue(item)}
                                        >
                                            {/* required to select item */}
                                            {/* <input type="checkbox" checked={isSelected} readOnly /> */}
                                            <Checkbox checked={isSelected}>{item}</Checkbox>

                                        </li>
                                    );
                                }}
                            />
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass1} col-sm-6 col-xs-12`}>
                        <div className="gutter-box">
                            {this.props.handleFilterOptions()}
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-6 col-xs-12`}>
                        <div className="gutter-box">
                            <Search
                                
                                placeholder={this.props.searchPlaceholder}
                                onChange={e => this.handleComponentSearch(e.target.value)}
                                style={{ width: '100%' }}
                            />
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-6 col-xs-12`}>
                        <div className="gutter-box">
                            <Select
                                defaultValue={this.props.defaultPagingValue}
                                style={{ width: '100%' }}
                                onChange={value => this.handlePagination(value)}
                            >
                                <Select.Option selected value="10">10</Select.Option>
                                <Select.Option value="20">20</Select.Option>
                                <Select.Option value="30">30</Select.Option>
                                <Select.Option value="50">50</Select.Option>
                                <Select.Option value="100">100</Select.Option>
                            </Select>
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`}>
                        <div className="gutter-box">
                            {
                                (this.props.isAddButton === true) ?
                                    (this.props.toLink!==undefined && this.props.toLink!=='' && this.props.toLink !== null)?
                                    <Button 
                                        type="primary" 
                                        disabled={(this.props.disableAddButton==true)?true:false} 
                                        style={{ width: '100%' }}
                                    >
                                        <Link to={this.props.toLink}>{this.props.addButtonText}</Link>
                                    </Button>
                                :
                                (this.props.AddDeviceModal)?
                                    <Button 
                                        type="primary" 
                                        disabled={(this.props.disableAddButton==true)?true:false} 
                                        style={{ width: '100%' }}
                                        onClick = {()=>this.props.handleDeviceModal(true)}
                                    >
                                        {this.props.addButtonText}
                                    </Button>
                                :
                                <Button 
                                        type="primary" 
                                        disabled={(this.props.disableAddButton==true)?true:false} 
                                        style={{ width: '100%' }}
                                    >
                                    {this.props.addButtonText}
                                </Button>
                                : null
                            }
                        </div>
                    </Col>

                </Row>
            </Card>
        )
    }
}
