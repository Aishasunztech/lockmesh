import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class SessionTimeOut extends Component {
    render() {
        return (
            <div style={{ justifyContent: 'center', alignContent: 'center', backgroundColor: 'blue', height: 'auto' }}>
                <h1><i className="icon icon-apps" />  Lockmesh</h1>
                <h2>Session Timed Out</h2>
                <p>Your session has timed out due to inactivity</p>

                <Link to="/login">
                    <p>Click here to login again</p>
                </Link>
            </div>
        )
    }
}