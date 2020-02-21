import React, { Component, Fragment } from 'react'
import { Card, Button, Row, Col, Select, Input, Checkbox, Icon } from "antd";
// import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';
import styles from "./appfilter.css";
import 'react-picky/dist/picky.css';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { checkIsArray, convertToLang } from '../../routes/utils/commonUtils';
class SimFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate(prevProps) {
        if (this.props.selectedOptions !== prevProps.selectedOptions) {
            this.setDropdowns(this.props.selectedOptions);
        }
    }

    setDropdowns(values) {
        // console.log('setDropdowns val : ', values)   
        this.setState({
            selectedDisplayValues: values,
        });
        // console.log('values:',this.state.selectedDisplayValues);
        this.props.handleCheckChange(values);
        //  alert('set dropdwon');
        // console.log('set dropdwon');
    }
    setPagination(value) {
        // console.log("Set State", value);
        this.setState({
            DisplayPages: value
        })
        this.props.handlePagination(value);
    }

    handlePagination(value) {
        // console.log(value);
        this.setState({ DisplayPages: value })
        this.props.handlePagination(value);
    }

    handleComponentSearch = (value) => {
        this.props.handleComponentSearch(value);
    }

    render() {
        let type = this.props.user.type
        let buttonType = false;

        const { translation } = this.props;

        let fullScreenClass1 = "";
        let fullScreenClass2 = "";
        let fullScreenClass3 = "";

        if (this.props.isAddButton === false) {
            fullScreenClass1 = "col-md-3";
            fullScreenClass2 = "col-md-3";
            fullScreenClass3 = "col-md-3";
        } else {
            fullScreenClass1 = "col-md-3";
            fullScreenClass2 = "col-md-2";
            fullScreenClass3 = "col-md-2";
        }

        return (
            // className="gutter-example"
            <Card className="sticky_top_bar">
                <Row gutter={24} className="filter_top">
                    <Col className={`${fullScreenClass3} col-sm-12 col-xs-12 vertical_center`}>
                        <span className="font_26_vw white_now">
                            {(this.props.pageHeading) ? this.props.pageHeading : ""}
                        </span>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`}>
                        <div className="m_mt-16">
                            {(this.props.typeOptions) ?
                                <div>
                                    <h3>Type</h3>
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        onChange={(value) => this.props.handleTypeChange(value)}
                                        autoComplete="new-password"
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        defaultValue={this.props.selectedTypeOption}
                                        style={{ width: '75%' }}

                                    >
                                        {checkIsArray(this.props.typeOptions).map(item => {
                                            return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                                        })
                                        }

                                    </Select>
                                </div>
                                : null

                            }
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`}>
                        <div className="m_mt-16">
                            <div className="m_mt-16">
                                {(this.props.statusOptions) ?
                                    <div>
                                        <h3>Status</h3>

                                        <Select
                                            showSearch
                                            placeholder={convertToLang(this.props.translation[""], "Select Term")}
                                            optionFilterProp="children"
                                            onChange={(value) => this.props.handleStatusChange(value)}
                                            autoComplete="new-password"
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            defaultValue={this.props.selectedStatusOption}
                                            style={{ width: '75%' }}
                                        >
                                            {checkIsArray(this.props.statusOptions).map(item => {
                                                return <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                                            })
                                            }

                                        </Select>
                                    </div>
                                    : null
                                }
                            </div>
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`}>
                        <div className="m_mt-16">
                            <div className="m_mt-16">
                                {(this.props.totalValue >= 0) ?
                                    <Card>
                                        <h3> Total : {this.props.totalValue}</h3>
                                    </Card>
                                    : null
                                }
                            </div>
                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`}>
                        <div className="m_mt-16">
                            {(this.props.handleComponentSearch) ? (
                                <Input.Search
                                    placeholder={this.props.searchPlaceholder}
                                    onChange={e => this.handleComponentSearch(e.target.value)}
                                    style={{ width: '100%' }}
                                />
                            ) : null}

                        </div>
                    </Col>
                    <Col className={`${fullScreenClass2} col-sm-12 col-xs-12`} style={(buttonType) ? buttonType : { display: "block" }}>
                        <div className="m_mt-16">
                            {
                                (this.props.isAddButton === true) ?
                                    (this.props.isAddSimButton) ?
                                        <Button
                                            type="primary"
                                            // disabled={(this.props.disableAddButton === true) ? true : false}
                                            style={{ width: '100%' }}
                                            onClick={() => this.props.handleAddSimModal(true)}
                                        >
                                            {this.props.addButtonText}
                                        </Button> : null
                                    : null
                            }
                        </div>
                    </Col>
                </Row>
            </Card >
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
    }, dispatch);
}
var mapStateToProps = ({ routing, auth }, otherProps) => {
    return {
        user: auth.authUser,
    };
}

/**
 * @author Usman Hafeez
 * commented withRouter function
 */
export default connect(mapStateToProps, mapDispatchToProps)(SimFilter);

