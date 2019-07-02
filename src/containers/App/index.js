import React, { Component } from "react";
import { connect } from "react-redux";
import URLSearchParams from 'url-search-params'
import { Redirect, Route, Switch } from "react-router-dom";
import { LocaleProvider } from "antd";
import { IntlProvider } from "react-intl";

import MainApp from "./MainApp";

import Login from "../Login";

import VerifyAuthCode from "../VerifyAuthCode";

// import SignUp from "../SignUp";
import { setInitUrl } from "appRedux/actions/Auth";
import { onLayoutTypeChange, onNavStyleChange, setThemeType, getLanguage, languages } from "../../appRedux/actions/Setting";

import { checkComponent } from "../../appRedux/actions/Auth";

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
    // console.log("componentWillMount");
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
    this.props.getLanguage();
    this.props.languages();
  }


  componentWillReceiveProps(nextProps) {

    if (this.props.isSwitched != nextProps.isSwitched) {
      this.props.getLanguage();
      // this.setState({
      //   re_render: !this.state.re_render
      // })
    }
  }

  render() {

    const { match, location, layoutType, navStyle, locale, authUser, initURL } = this.props;

    if (location.pathname === '/') {
      if (authUser.id === null || authUser.email === null || authUser.token === null || authUser.type === null) {
        return (<Redirect to={'/login'} />);
      } else if ((initURL === '' || initURL === '/' || initURL === '/login')) {
        return (<Redirect to={'/devices'} />);

      } else {
        return (<Redirect to={initURL} />);
      }
    }


    this.setLayoutType(layoutType);

    this.setNavStyle(navStyle);


    return (

      < LocaleProvider
      >
        <IntlProvider
        >
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path="/verify-auth" component={VerifyAuthCode} />
            <RestrictedRoute
              authUser={authUser}
              path={`${match.url}`}
              // authUser={authUser}
              re_render={this.state.re_render}
              component={MainApp}

            />

          </Switch>
        </IntlProvider>
      </ LocaleProvider>
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
export default connect(mapStateToProps, { setInitUrl, setThemeType, onNavStyleChange, onLayoutTypeChange, checkComponent, getLanguage, languages })(App);
