import React, { Component } from 'react';
import { Row, Card, Button, Divider, Form, Input, Select, Modal } from 'antd';
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { getDealerList, addDealer } from "../../appRedux/actions/Dealers";
import { ADMIN, DEALER, SDEALER } from "../../constants/Constants";

// const FormItem = Form.Item;
const { Option } = Select;
class AddDealer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validateStatus: 'success',
            help: null
        }

    }

    handleNameValidation = (event) => {
        var fieldvalue = event.target.value;

        // console.log('rest ', /[^A-Za-z \d]/.test(fieldvalue));
        // console.log('vlaue', fieldvalue)


        if (/[^A-Za-z \d]/.test(fieldvalue)) {
            this.setState({
                validateStatus: 'error',
                help: 'Please insert only alphabets and numbers'
            })
        }
        else {
            this.setState({
                validateStatus: 'success',
                help: null,
            })
        }
    }
    handleSubmit = (e) => {


        this.props.form.validateFields((err, values) => {
            if(values.name === ''){
                this.setState({
                    validateStatus: 'error',
                    help: 'Name is Required'
                })
            }
            if (!err) {

                if (/[^A-Za-z \d]/.test(values.name)) {
                    this.setState({
                        validateStatus: 'error',
                        help: 'Please insert only alphabets and numbers'
                    })
                }else{
                    values.pageType = window.location.pathname.split("/").pop();
                    // values.dealerId = this.props.profile.dealerId;
    
                    this.props.addDealer(values);
                    // message.success('Action done Successfylly');
                    //  this.props.history.goBack();
                    //  this.props.getDealerList(window.location.pathname.split("/").pop()); 
                    setTimeout(() => {
                        this.props.handleCancel();
                    }, 1000);
                }
                // console.log('form values',values);
                

            }
        });
    }

    // componentDidUpdate(prevProps) {
    //     // console.log('this.props',this.props)
    //     if (this.props.navigate_to !== prevProps.navigate_to) {

    //         alert('its working');
    //     }
    // }

    componentDidMount() {
        // console.log('cmp');
        this.props.getDealerList('dealer', false);
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
                {/* <Row justify='center' style={{ backgroundColor: '#012346', height: 150, paddingTop: 50 }}>

                </Row>

                <div style={{ marginTop: - 90 }}>
                    <Row>
                     
                        <Card style={{ borderRadius: 15, width: '100%', margin: 30, }}>
                            <div>
                                <h1 style={{float:"left", marginTop:"5px"}}>Add {dealer_type}</h1>
                                <Link to={`/dealer/${window.location.pathname.split("/").pop()}`} ><Button type="primary" style={{float:"right", marginBottom:"16px"}}>Back</Button></Link>
                                <Divider />   
                                 */}

                <Form  >
                    {
                        ((dealer_type !== DEALER) && (dealer_type === SDEALER) && (this.props.profile.type === ADMIN)) ?

                            <Form.Item
                                {...formItemLayout}
                                label="Select"
                                hasFeedback


                            >
                                {getFieldDecorator('dealerId', {

                                })(
                                    <Select placeholder="Select Dealer Name">
                                        {this.props.dealersList.map((dealer, index) => {
                                            return (<Option key={index} value={dealer.dealer_id} ><strong>{dealer.dealer_name}</strong> ({dealer.dealer_email})</Option>)
                                        })
                                        }

                                    </Select>
                                )}
                            </Form.Item> : false}

                    <Form.Item
                        {...formItemLayout}
                        label="Name"
                        validateStatus={this.state.validateStatus}
                        help={this.state.help}
                    >
                        {getFieldDecorator('name', {
                            rules: [{
                                required: true, message: 'Please input your Name!',
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input onChange={(e) => this.handleNameValidation(e)} />
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
                        <Button className='submitButton' onClick={this.handleSubmit}  >{'Add '+ this.props.dealer_type}</Button>
                        {/* <Button className='submitButton' onClick={this.showModal}  >Add Dealer </Button> */}
                    </div>

                </Form>

                {/* </div>
                        </Card>
                     

                    </Row>
                </div> */}
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
        dealersList: dealers.dealers.dealers2,
        profile: dealers.auth.authUser,
        navigate_to: dealers.navigate_to,
    }
}
export default connect(mapStateToProps, { getDealerList, addDealer })(AddDealerForm)
