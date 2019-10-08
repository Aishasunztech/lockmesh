import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";
import Settings from "./Settings";
import Auth from "./Auth";
import Devices from "./Devices"
import BulkDevices from "./BulkDevices"
import Dealers from "./Dealer";
import Apk_List from "./Apk";
import ConnectDevice from "./ConnectDevice";
import Account from "./Account"
import Policy from "./Policy";
import Users from "./Users";
import AppMarket from "./AppMarket";
import socket from "./Socket";
import SideBar from "./SideBar"
import Agents from './Agent';
import Dashboard from './Dashboard';

const reducers = combineReducers({
  routing: routerReducer,
  settings: Settings,
  auth: Auth,
  devices: Devices,
  bulkDevices: BulkDevices,
  dealers: Dealers,
  apk_list: Apk_List,
  device_details: ConnectDevice,
  account: Account,
  policies: Policy,
  users: Users,
  appMarket: AppMarket,
  agents: Agents,
  socket: socket,
  sidebar: SideBar,
  dashboard: Dashboard
});

export default reducers;
