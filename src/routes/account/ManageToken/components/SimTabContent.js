import React, { Component } from 'react'
import PricingFrom from "./PricingForm";

export default class SimTabContent extends Component {
    render() {
        return (
            <div>
                <PricingFrom
                    showPricingModal={this.props.showPricingModal}
                    setPrice={this.props.setPrice}
                    price_for={this.props.innerTab}
                />
            </div>
        )
    }
}
