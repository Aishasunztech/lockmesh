import React, { Component } from 'react'
import { Redirect, Route } from "react-router-dom";
// import {connect} from "react-redux";
// import { bindActionCreators } from "redux";
// import { checkComponent } from "../../appRedux/actions/Auth";

export default class RestrictedRoute extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount(){
    // alert("componentWillMount");
    // console.log("componentWillMount",this.props);
    const componentRoute = this.props.location.pathname;
    this.props.checkComponent(componentRoute);

  }

  componentDidMount() {
    // console.log("restrictions");
    
  }
  componentDidUpdate(prevProps){
    // console.log("prevProps", prevProps);
    // console.log("next props", this.props);
    if((this.props !== prevProps) && this.props.location.pathname!=="/invalid_page"){
      // alert("restrictions");
      // console.log(this.props.location.pathname);
      const componentRoute = this.props.location.pathname;
      this.props.checkComponent(componentRoute);
    }
  }
  
  render() {
    const Component = this.props.component;
    return (
      <Route {...this.props.rest} render={
        (props) => {
          if (this.props.authUser.id === null || this.props.authUser.email === null || this.props.authUser.token === null || this.props.authUser.type === null) {
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
          } else {
            // alert("allowed", this.props.isAllowed);

            // if(this.props.isAllowed || this.props.location.pathname==="/invalid_page"){
    
              return <Component {...props} />;
            // }else{
            //   // alert("usman hafeez");
            //   return <Redirect to={{ pathname: '/invalid_page', state: { from: props.location } }} />
            // }
          }
        }
      } />
    )
  }
}