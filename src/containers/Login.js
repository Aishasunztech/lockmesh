import React from "react";
import { Button, Form, Icon, Input, message } from "antd";
import { connect } from "react-redux";
// import {Link} from "react-router-dom";
import { convertToLang } from '../routes/utils/commonUtils';
import {
  hideMessage,
  showAuthLoader,
  loginUser
} from "appRedux/actions/Auth";
import CircularProgress from "components/CircularProgress/index";
import { AUTO_UPDATE_ADMIN, SIGN_IN } from "../constants/Constants";
import { APP_TITLE } from "../constants/Application";

const FormItem = Form.Item;
var LoginExp = true;
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
  componentDidMount() {
    // console.log("componentDidMount Login");

  }
  componentDidUpdate(prevProps) {

    if (this.props.showMessage) {
      setTimeout(() => {
        this.props.hideMessage();
      }, 100);
    }
    const { authUser, alertMessage } = this.props;
    // console.log(this.props.auth);
    if (this.props.auth.two_factor_auth === true || this.props.auth.two_factor_auth === 1 || this.props.auth.two_factor_auth === 'true') {
      // console.log("asdaddsa");
      this.props.history.push('/verify-auth');
    }

    if (authUser.id !== null && authUser.email !== null && authUser.token !== null && authUser.type === AUTO_UPDATE_ADMIN) {
      // console.log("Updater");
      this.props.history.push('/apk-list/autoupdate');
    }
    else if (authUser.id !== null && authUser.email !== null && authUser.token !== null && authUser.type !== null) {
      this.props.history.push('/');
    }

    if (this.props.showMessage) {
      if (alertMessage == 'Login expired' && LoginExp) {
        message.error(alertMessage.toString())
        LoginExp = false;
      } else if(this.props.loginFailedStatus != prevProps.loginFailedStatus) {
        message.error(alertMessage.toString())
        // LoginExp = false;
      }

    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { showMessage, loader, alertMessage } = this.props;

    return (
      <div className="gx-app-login-wrap">
        <div className="gx-app-login-container">
          <div className="gx-app-login-main-content">
            <div className="gx-app-logo-content">
              <div className="gx-app-logo-content-bg">
              </div>
              <div className="gx-app-logo-wid">
              </div>
              <div className="gx-app-logo">
                <p className="mb-0" style={{ fontSize: 18 }}><Icon type='lock' />{APP_TITLE}</p>
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
                    <Input placeholder="Email" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('pwd', {
                    initialValue: "",
                    rules: [{ required: true, message: 'You forgot to enter your password' }],
                  })(
                    <Input type="password" placeholder="Password" />
                  )}
                </FormItem>

                <FormItem>
                  <Button type="primary" className="gx-mb-0" htmlType="submit">
                    {convertToLang(this.props.translation[SIGN_IN], SIGN_IN)}
                    {/* <IntlMessages id="app.userAuth.signIn" /> */}
                  </Button>
                </FormItem>

              </Form>
            </div>

            {loader ?
              <div className="gx-loader-view">
                <CircularProgress />
              </div> : null}
            {/* {showMessage ?
              message.error(alertMessage.toString()) : null} */}
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(Login);

const mapStateToProps = ({ auth, settings }) => {
  // console.log(auth);

  const { loader, alertMessage, showMessage, authUser, loginFailedStatus } = auth;
  return {
    loader, alertMessage, showMessage, authUser, auth, loginFailedStatus, 
    translation: settings.translation
  }
};

export default connect(mapStateToProps, {
  loginUser,
  hideMessage,
  showAuthLoader
})(WrappedNormalLoginForm);
