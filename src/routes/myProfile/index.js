
import React, {Component} from 'react';
import { connect } from "react-redux";
import { updatePassword  } from "../../appRedux/actions/Dealers";
import { updateUserProfile  } from "../../appRedux/actions/Auth";
import { Row,Col,Card,Table,Button, Divider} from 'antd';
import ChangePassword from './components/changePassword';
import ChangeProfile from './components/change_profile';
// import {Link} from 'react-router-dom';

 class Profile extends Component {

    render()
    {
        const dataSource = [{
            key: '1',
            name: 'Name',
            age: this.props.profile.firstName+' '+this.props.profile.lastName,
        
          }, {
            key: '2',
            name: 'Dealer ID',
            age: this.props.profile.id,
          },  {
            key: '3',
            name: 'Login Email',
            age: this.props.profile.email,
          }];
        
        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
          }, {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          }];

        return(
            <div>
                <Row justify='center' style={{backgroundColor:'#012346',height:150,paddingTop:50}}>
                </Row>
                <div style={{marginTop:-60}}>
                    <Row>
                        <Col  xs={24} sm={24} md={16} lg={16} xl={16}>
                            <div>
                                <Card style={{borderRadius:12}}>
                                    <div className="profile_table">
                                        <Row>
                                            <Col span={20}>
                                            <h1>Your Profile</h1>
                                            </Col>
                                            <Col span={4} style={{textAlign:"center"}}>
                                            <a href="#" onClick={()=> this.refs.change_profile.showModal()} >Edit</a>
                                            </Col>
                                        </Row>
                                       
                                        
                                        <Divider />
                                        <Table columns={columns} dataSource={dataSource} bordered={true} pagination={false} showHeader={false}   >
                                            
                                        </Table>
                                    </div>
                                </Card>
                            </div>
                        </Col>
                        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div>
                                <Card style={{borderRadius:12}}>
                                    <div>
                                        <h1>Your Profile</h1>
                                        <Divider className="mb-0"/>
                                        <Row style={{padding:16}}>
                                            <Col span={9}  style={{padding:0,textAlign:"center"}}>
                                                <img src={require("../../assets/images/profile-image.png")} style={{height:'auto',width:'100%',borderRadius:50}} />
                                            </Col>
                                            <Col span={15}>
                                                {(this.props.profile.firstName!==null)?<h1>{this.props.profile.firstName+' '+this.props.profile.lastName}</h1>:<h1>{this.props.profile.name}</h1>}
                                            
                                               <p>({this.props.profile.type})</p>
                                            </Col>
                                        </Row>
                                        <Row justify='center'>
                                            <Col span={12} style={{padding:"0px 8px 0px 16px"}} className="change_pass">
                                            <Button  type="primary" style={{ width: "100%" }}
                                                onClick={()=> this.refs.change_password.showModal()}
                                                icon="unlock">Change Password</Button>                                                
                                            </Col>
                                            <Col span={12} style={{padding:"0px 16px 0px 8px"}} className="change_email">
                                            <Button disabled type="primary" style={{ width: "100%" }} icon="mail">Change Email</Button>                                                
                                            </Col>
                                        </Row>
                                        
                                    </div>
                                </Card>
                            </div>
                        </Col> 
                        
                    </Row>
                </div>
                <ChangePassword ref="change_password" profile={this.props.profile} func={this.props.updatePassword} />
                <ChangeProfile 
                    ref="change_profile" 
                    profile={this.props.profile}  
                    func={this.props.updatePassword}
                    updateUserProfile={this.props.updateUserProfile}
                      />
            </div>
        )
    }
}

var mapStateToProps = (state) => {
    // console.log("mapStateToProps");
    // console.log(state.auth.authUser);
    
    return {
        isloading: state.isloading,
         profile:state.auth.authUser

    };
}


export default connect(mapStateToProps, { updatePassword, updateUserProfile })(Profile)