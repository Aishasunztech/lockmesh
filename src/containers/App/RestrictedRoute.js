import React, { Component } from 'react'
import { Redirect, Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import  RestService  from '../../appRedux/services/RestServices';
import CircularProgress from "../../components/CircularProgress/index";
import { 
  checkComponent,
  getUser
} from "../../appRedux/actions/Auth";

class RestrictedRoute extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const componentRoute = this.props.pathname;
    // this.props.getUser();
    this.props.checkComponent(componentRoute);
    
  }
  
  componentDidMount() {
    
    // console.log("restrictions");

  }
  componentDidUpdate(prevProps) {
    // console.log("prevProps", prevProps);
    // console.log("next props", this.props);
    if (this.props.pathname !== prevProps.pathname && this.pathname !== "/invalid_page") {
      // alert("hello");
      const componentRoute = this.props.pathname;
      // this.props.getUser();
      // console.log(componentRoute);
      this.props.checkComponent(componentRoute);

    }
  }

  render() {
    const Component = this.props.component;
    // console.trace("restricted route allowed", this.props.rest);
    return (
      <Route 
      // {...this.props.rest} 
      render={
        (props) => {
          if(this.props.isRequested){

            if (this.props.authUser.id === null || this.props.authUser.email === null || this.props.authUser.token === null || this.props.authUser.type === null) {
              return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            } else {
              // alert("allowed", this.props.isAllowed);
  
              if(this.props.isAllowed || this.props.location.pathname==="/invalid_page"){
  
              return <Component {...props} />;
              }else{
                // alert("usman hafeez");
                return <Redirect to={{ pathname: '/invalid_page', state: { from: props.location } }} />
              }
            }
          }else{
            return <CircularProgress />
          }
        }
      } />
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    checkComponent: checkComponent,
    getUser: getUser
  }, dispatch);
}

var mapStateToProps = ({ routing ,auth}, otherProps) => {
  // console.log("restricted route", routing);
  // console.log("restricted auth", auth);
  // console.log("restricted other", otherProps);
  return {
    // routing: routing,
    pathname: routing.location.pathname,
    authUser: auth.authUser,
    isAllowed: auth.isAllowed,
    isRequested: auth.isRequested
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RestrictedRoute);
// export default RestrictedRoute;