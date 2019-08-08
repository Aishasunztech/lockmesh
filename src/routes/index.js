import React from "react";
import { Route, Switch } from "react-router-dom";
import Account from "./account/index";
import AddApk from "./addApk/index";
import AutoUpdate from "./autoUpdate/index";
import Devices from "./devices/index";
import Dealers from "./dealers/index";
import ConnectDevice from "./ConnectDevice/index";
import Policy from './policy/index';
import Apk from "./apk/index";
import ApkMain from "./apk/components/index";
import myProfile from './myProfile';
import AddDealer from './addDealer';
import Users from './users';
import InvalidPage from "./InvalidPage";
import FourOFour from "./404/";
import AppMarket from "./appMaket/index";
import ManageData from './account/ManageData/index'
import SetPrice from './account/PricesPakages/index'
import DealerAgent from './dealerAgent/index'
// import Documents from "./documents/index";

const App = ({ match }) => {
  // console.log("match url: " + match.url);

  return (
    <div className="gx-main-content-wrapper">
      <Switch>
        <Route
          exact
          path={`${match.url}devices`}
          component={Devices}
        />
        <Route
          exact
          path={`${match.url}users`}
          component={Users}
        />
        <Route
          exact
          path={`${match.url}account`}
          component={Account}
        />
        <Route
          exact
          path={`${match.url}dealer/:dealer_type`}
          component={Dealers}
        />
        <Route
          exact
          path={`${match.url}policy`}
          component={Policy}
        />
        <Route
          exact
          path={`${match.url}create-dealer/:dealer_type`}
          component={AddDealer}
        />
        <Route
          exact
          path={`${match.url}settings`}
          component={myProfile}
        />
        <Route
          exact
          path={`${match.url}connect-device/:device_id`}
          component={ConnectDevice}
        />
        <Route
          exact
          path={`${match.url}apk-list`}
          component={Apk}
        />
        <Route
          exact
          path={`${match.url}apk-list/autoupdate`}
          component={AutoUpdate}
        />
        <Route
          exact
          path={`${match.url}app`}
          component={ApkMain}
        />
        <Route
          exact
          path={`${match.url}upload-apk`}
          component={AddApk}
        />
        <Route
          exact
          path={`${match.url}invalid_page`}
          component={InvalidPage}
        />
        <Route
          exact
          path={`${match.url}app-market`}
          component={AppMarket}
        />
        <Route
          exact
          path={`${match.url}account/managedata`}
          component={ManageData}
        />
        <Route
          exact
          path={`${match.url}set-prices`}
          component={SetPrice}
        />
        <Route
          exact
          path={`${match.url}dealer-agents`}
          component={DealerAgent}
        />
        <Route
          exact
          path="*"
          component={FourOFour}
        />
      </Switch>
    </div>
  )
}


export default App;
