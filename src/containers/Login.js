import React from "react";
import {Button, Form, Icon, Input, message} from "antd";
import {connect} from "react-redux";
// import {Link} from "react-router-dom";

import {
  hideMessage,
  showAuthLoader,
  loginUser
} from "appRedux/actions/Auth";
import IntlMessages from "util/IntlMessages";
import CircularProgress from "components/CircularProgress/index";

const FormItem = Form.Item;

class Login extends React.Component {

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, user) => {
      if (!err) {
        this.props.showAuthLoader();
        this.props.loginUser(user);
      }
    });
  };
  componentDidMount(){
    // console.log("componentDidMount Login");

  }
  componentDidUpdate() {
    // alert("componentDidUpdate Login")

    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }

    if (this.props.authUser.id != null && this.props.authUser.email != null && this.props.authUser.token != null && this.props.authUser.type != null) {
      this.props.history.push('/');
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {showMessage, loader, alertMessage} = this.props;

    return (
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg">
                {/* <img src="https://via.placeholder.com/272x395" alt='Neature'/> */}
              </div>
              <div className="gx-app-logo-wid">
                {/* <h1><IntlMessages id="app.userAuth.signIn"/></h1>
                <p><IntlMessages id="app.userAuth.bySigning"/></p>
                <p><IntlMessages id="app.userAuth.getAccount"/></p> */}
              </div>
              <div className="gx-app-logo">
                   <p className="mb-0" style={{fontSize:18}}><Icon type='lock' /> LockMesh</p>
                {/* <img alt="example" src={require("assets/images/logo.png")}/> */}
              </div>
            </div>
            <div className="gx-app-login-content">
              <Form onSubmit={this.handleSubmit} className="gx-signin-form gx-form-row0">

                <FormItem>
                  {getFieldDecorator('demail', {
                    initialValue: "",
                    rules: [{
                      required: true, type: 'email', message: "Doesn't seem to be a valid Email ID",
                    }],
                  })(
                    <Input placeholder="Email"/>
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('pwd', {
                    initialValue: "",
                    rules: [{required: true, message: 'You forgot to enter your password'}],
                  })(
                    <Input type="password" placeholder="Password"/>
                  )}
                </FormItem>
                
                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    <IntlMessages id="app.userAuth.signIn"/>
                  </Button>
                </FormItem>
                
              </Form>
            </div>

            {loader ?
              <div className="gx-loader-view">
                <CircularProgress/>
              </div> : null}
            {showMessage ?
              message.error(alertMessage.toString()) : null}
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(Login);

const mapStateToProps = ({auth}) => {
  // console.log(auth);

  const {loader, alertMessage, showMessage, authUser} = auth;
  return {loader, alertMessage, showMessage, authUser}
};

export default connect(mapStateToProps, {
  loginUser,
  hideMessage,
  showAuthLoader
})(WrappedNormalLoginForm);