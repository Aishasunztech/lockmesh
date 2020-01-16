import React, { Component } from "react";
import { connect } from "react-redux";
import { Drawer, Layout } from "antd";
import styles from './sidebar.css';
import SidebarContent from "./SidebarContent";
import { toggleCollapsedSideNav, updateWindowWidth } from "appRedux/actions/Setting";
import { generateSupportTicketEvent, systemMessageSocket } from "../../appRedux/actions";
import {
	NAV_STYLE_DRAWER,
	NAV_STYLE_FIXED,
	NAV_STYLE_MINI_SIDEBAR,
	NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
	NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
	TAB_SIZE,
	THEME_TYPE_LITE
} from "../../constants/ThemeSetting";

const { Sider } = Layout;

export class Sidebar extends Component {

	onToggleCollapsedNav = () => {
		this.props.toggleCollapsedSideNav(!this.props.navCollapsed);
	};

	componentDidMount() {
	  console.log('testing here');
	  console.log('this component is mounted');
		window.addEventListener('resize', () => {
			this.props.updateWindowWidth(window.innerWidth)
		});
	}

	componentWillReceiveProps(nextProps){
    if ( nextProps.supportSystemSocket ) {
      this.props.generateSupportTicketEvent(nextProps.supportSystemSocket);
      this.props.systemMessageSocket(nextProps.supportSystemSocket);
    }
  }

	render() {
		const { themeType, navCollapsed, width, navStyle } = this.props;

		let drawerStyle = "gx-collapsed-sidebar";

		if (navStyle === NAV_STYLE_FIXED) {
			drawerStyle = "";
		} else if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
			drawerStyle = "gx-mini-sidebar gx-mini-custom-sidebar";
		} else if (navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
			drawerStyle = "gx-custom-sidebar"
		} else if (navStyle === NAV_STYLE_MINI_SIDEBAR) {
			drawerStyle = "gx-mini-sidebar";
		} else if (navStyle === NAV_STYLE_DRAWER) {
			drawerStyle = "gx-collapsed-sidebar"
		}
		if ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR
			|| navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) && width < TAB_SIZE) {
			drawerStyle = "gx-collapsed-sidebar"
		}
		return (
			<Sider
				className={`gx-app-sidebar ${drawerStyle} ${themeType !== THEME_TYPE_LITE ? 'gx-layout-sider-dark' : null}`}
				trigger={null}
				collapsed={(width < TAB_SIZE ? false : navStyle === NAV_STYLE_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR)}
				theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
				collapsible>
				{
					navStyle === NAV_STYLE_DRAWER || width < TAB_SIZE ?
						<Drawer
							ClassName={`gx-drawer-sidebar ${themeType !== THEME_TYPE_LITE ? 'gx-drawer-sidebar-dark' : null}`}
							placement="left"
							closable={false}
							onClose={this.onToggleCollapsedNav.bind(this)}
							visible={navCollapsed}
						>
							<SidebarContent authUser={this.props.authUser} />
						</Drawer> :
						<SidebarContent authUser={this.props.authUser} />
				}
			</Sider>
		);
	}
}

const mapStateToProps = ({ settings, auth, socket }) => {
	const { themeType, navStyle, navCollapsed, width, locale } = settings;
	const { authUser } = auth;
	const { supportSystemSocket } = socket;
	return { themeType, navStyle, navCollapsed, width, locale, authUser, supportSystemSocket }
};
export default connect(mapStateToProps, { toggleCollapsedSideNav, updateWindowWidth, systemMessageSocket, generateSupportTicketEvent })(Sidebar);
