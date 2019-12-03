import React, { Fragment } from "react";
import { ConnectedRouter } from "react-router-redux";
import { Provider } from "react-redux";
import { Route, Switch } from "react-router-dom";

import "assets/vendors/style";
import "styles/wieldy.less";
import configureStore, { history } from "./appRedux/store";
// import { Detector } from "react-detect-offline";

import App from "./containers/App/index";

history.listen((location, action) => {
  // location is an object like window.location
  // alert("ok");
  // console.log("history listen",action, location)
});
// history.log(1);
export const store = configureStore();

const NextApp = () =>
  <Fragment>
    {/* <Detector
      render={({ online }) => (
        online ? null :
          <div style={{ background: 'red', width: '100%', height: '30px', textAlign: 'center' }}>
            <h3 style={{
              color: 'white', paddingTop: '3px'
            }}>You are currently offline, Please check your internet connection.</h3>
          </div>
      )}
    /> */}
    <Provider store={store}>
      <ConnectedRouter history={history} >
        <Switch>
          <Route path="/" component={App} />

        </Switch>
      </ConnectedRouter>
    </Provider>
  </Fragment>;


export default NextApp;
