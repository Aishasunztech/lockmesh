import React from "react";
import { Scrollbars } from "react-custom-scrollbars";

const CustomScrollbars = (props) => <Scrollbars  {...props} autoHide
    renderTrackHorizontal={props => <div {...props}
        style={{ display: 'none' }}
        className="track-horizontal Zindex_100" />} />;

export default CustomScrollbars;
 