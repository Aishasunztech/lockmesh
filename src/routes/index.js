import React from "react";
import {Route, Switch} from "react-router-dom";
import Account from "./account/index";
import AddApk from "./addApk/index";
import Devices from "./devices/index";
import Dealers from "./dealers/index";
import ConnectDevice from "./ConnectDevice/index";
import Policy from './policy/index';
import Apk from "./apk/index";
import ApkMain from "./apk/components/index";
import myProfile from './myProfile';
import AddDealer from './addDealer';
import InvalidPage from "./InvalidPage";
import FourOFour from "./404/";
// import Documents from "./documents/index";

const App = ({match}) => {
  // console.log("match url: " + match.url);

  return (<div className="gx-main-content-wrapper">
    <Switch>
      <Route exact path={`${match.url}devices`} component={Devices}/>
      <Route exact path={`${match.url}account`} component={Account}/>
      <Route exact path={`${match.url}dealer/:dealer_type`} component={Dealers}/>
      <Route exact path={`${match.url}policy`} component={Policy} />
      <Route exact path={`${match.url}create-dealer/:dealer_type`} component={AddDealer}/>
      <Route path={`${match.url}profile`} component={myProfile}/>
      <Route exact path={`${match.url}connect-device/:device_id`} component={ConnectDevice}/>
      <Route path={`${match.url}apk-list`} component={ApkMain}/>
      <Route path={`${match.url}upload-apk`} component={AddApk}/>
      <Route path={`${match.url}invalid_page`} component={InvalidPage}/>
      <Route path="*" component={FourOFour} />
    </Switch>
  </div>)
}
  
;

export default App;
