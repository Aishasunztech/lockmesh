import React, { Component } from "react";
import { connect } from "react-redux";
import URLSearchParams from 'url-search-params'
import { Redirect, Route, Switch } from "react-router-dom";
import MainApp from "./MainApp";

import Login from "../Login";

import VerifyAuthCode from "../VerifyAuthCode";


import { 
  setInitUrl,
  checkComponent, 
  onLayoutTypeChange, 
  onNavStyleChange, 
  setThemeType, 
  // getLanguage, 
  // getAll_Languages 
} from '../../appRedux/actions'

import {
  LAYOUT_TYPE_BOXED,
  LAYOUT_TYPE_FRAMED,
  LAYOUT_TYPE_FULL,
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL
} from "../../constants/ThemeSetting";
import RestrictedRoute from "./RestrictedRoute";
import { APP_TITLE } from "../../constants/Application";
import SessionTimeOut from "../Session_timeout";

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      re_render: true
    }
  }

  setLayoutType = (layoutType) => {
    if (layoutType === LAYOUT_TYPE_FULL) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('full-layout');
    } else if (layoutType === LAYOUT_TYPE_BOXED) {
      document.body.classList.remove('full-layout');
      document.body.classList.remove('framed-layout');
      document.body.classList.add('boxed-layout');
    } else if (layoutType === LAYOUT_TYPE_FRAMED) {
      document.body.classList.remove('boxed-layout');
      document.body.classList.remove('full-layout');
      document.body.classList.add('framed-layout');
    }
  };

  setNavStyle = (navStyle) => {
    if (navStyle === NAV_STYLE_DEFAULT_HORIZONTAL ||
      navStyle === NAV_STYLE_DARK_HORIZONTAL ||
      navStyle === NAV_STYLE_INSIDE_HEADER_HORIZONTAL ||
      navStyle === NAV_STYLE_ABOVE_HEADER ||
      navStyle === NAV_STYLE_BELOW_HEADER) {
      document.body.classList.add('full-scroll');
      document.body.classList.add('horizontal-layout');
    } else {
      document.body.classList.remove('full-scroll');
      document.body.classList.remove('horizontal-layout');
    }
  };

  componentWillMount() {
    
    if (this.props.initURL === '') {
      this.props.setInitUrl(this.props.history.location.pathname);
    }
    const params = new URLSearchParams(this.props.location.search);

    if (params.has("theme")) {
      this.props.setThemeType(params.get('theme'));
    }
    if (params.has("nav-style")) {
      this.props.onNavStyleChange(params.get('nav-style'));
    }
    if (params.has("layout-type")) {
      this.props.onLayoutTypeChange(params.get('layout-type'));
    }
  }

  componentDidMount() {
    document.title = APP_TITLE + ' - Admin Dashboard';
    // this.props.getLanguage();
    // this.props.getAll_Languages();

  }

  componentWillReceiveProps(nextProps) {

    // if (this.props.isSwitched !== nextProps.isSwitched) {
    //   this.props.getLanguage();
    //   // this.setState({
    //   //   re_render: !this.state.re_render
    //   // })
    // }
  }

  componentWillUnmount(){
    
  }

  render() {

    const { match, location, layoutType, navStyle, locale, authUser, initURL } = this.props;
    
    if (location.pathname === '/') {
      if ( !authUser.id || !authUser.email || !authUser.token || !authUser.type) {
        return (<Redirect to={'/login'} />);
      } else if ((initURL === '' || initURL === '/' || initURL === '/login' || initURL === '/session_timeout')) {
        return (<Redirect to={'/dashboard'} />);
      } else {
        // this condition will not match anymore #usman
        return (<Redirect to={initURL} />);
      }
    }

    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);

    return (

      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path="/verify-auth" component={VerifyAuthCode} />
        <Route exact path="/session_timeout" component={SessionTimeOut} />

        <RestrictedRoute
          authUser={authUser}
          path={`${match.url}`}
          re_render={this.state.re_render}
          component={MainApp}

        />
      </Switch>

    )
  }

  newMethod(location) {
    return location.pathname;
  }
}

const mapStateToProps = ({ settings, auth }) => {

  const { locale, navStyle, layoutType, isSwitched } = settings;
  const { authUser, initURL, isAllowed } = auth;
  return { locale, navStyle, layoutType, authUser, initURL, isAllowed, isSwitched }
};
export default connect(mapStateToProps, { setInitUrl, setThemeType, onNavStyleChange, onLayoutTypeChange, checkComponent })(App);
