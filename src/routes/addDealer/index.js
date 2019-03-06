

import React, { Component } from 'react';
import { Row, Card, Button, Divider, Form, Input, Select } from 'antd';
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getDealerList, addDealer } from "../../appRedux/actions/Dealers";

const FormItem = Form.Item;
const { Option } = Select;
class AddDealer extends Component {
    constructor(props) {
        super(props);
    
    }

    handleSubmit = (e) => {

        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log('form values',values);
                values.pageType = window.location.pathname.split("/").pop();
               // values.dealerId = this.props.profile.dealerId;
               
                this.props.addDealer(values);
               // message.success('Action done Successfylly');
               this.props.getDealerList('sdealer'); 
             this.props.history.goBack();
           
            }
        });
    }

    componentDidUpdate(prevProps) {

        // console.log('this.props',this.props)
        if (this.props.navigate_to !== prevProps.navigate_to) {

            alert('its working');
        }
    }

    componentDidMount(){
        // console.log('cmp');
        this.props.getDealerList('dealer');
    }
    
    render() {

      //  console.log('my test routs',  this.props.history)
// if(window.location.pathname.split("/").pop() === 'sdealer')
// {
//     this.props.getDealerList( window.location.pathname.split("/").pop());
// }
     
        let dealer_type = window.location.pathname.split("/").pop();
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <div>
                <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 50 }}>

                </Row>

                <div style={{ marginTop: - 90 }}>
                    <Row>

                        <Card style={{ borderRadius: 15, width: '100%', margin: 30, }}>
                            <div>
                                <h1>Add {dealer_type}</h1>
                                <Divider />

            
                                <Form style={{ marginTop: 50 }} >
                                    {
                                        ((dealer_type !== 'dealer') && (dealer_type === 'sdealer') && (localStorage.getItem('type') === 'admin' )) ?

                                            <Form.Item
                                                {...formItemLayout}
                                                label="Select"
                                                hasFeedback
                                            >
                                                {getFieldDecorator('dealerId', {

                                                })(
                                                    <Select placeholder="Select Dealer Name">
                                                     {this.props.dealersList.map((dealer,index) => {
                                                           return(<Option key={index} value={dealer.dealer_id} >{dealer.dealer_name}</Option>)
                                                        })
                                                    }

                                                    </Select>
                                                )}
                                            </Form.Item> : false}

                                    <Form.Item
                                        {...formItemLayout}
                                        label="Name"
                                    >
                                        {getFieldDecorator('name', {
                                            rules: [{
                                                required: true, message: 'Please input your Name!',
                                            }, {
                                                validator: this.validateToNextPassword,
                                            }],
                                        })(
                                            <Input type="text" />
                                        )}
                                    </Form.Item>

                                    <Form.Item
                                        {...formItemLayout}
                                        label="E-mail"
                                    >
                                        {getFieldDecorator('email', {
                                            rules: [{
                                                type: 'email', message: 'The input is not valid E-mail!',
                                            }, {
                                                required: true, message: 'Please input your E-mail!',
                                            }],
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>

                                    <div className='submitButton' style={{ justifycontent: 'right', alignItems: 'right' }} >
                                        <Button className='submitButton' onClick={this.handleSubmit}  >Add Dealer</Button>
                                    </div>

                                </Form>
                            </div>
                        </Card>

                    </Row>
                </div>
            </div>
        )
    }
}

const AddDealerForm = Form.create()(AddDealer);

var mapStateToProps = (dealers) => {
    // console.log("mapStateToProps");
    // console.log(dealers);
    // console.log('dealer', dealers);
    return {
        msg: dealers.dealers.msg,
        dealersList:dealers.dealers.dealers,
        profile: dealers.auth.authUser,
        navigate_to:dealers.navigate_to,
    }
}
export default connect(mapStateToProps, { getDealerList, addDealer })(AddDealerForm)
