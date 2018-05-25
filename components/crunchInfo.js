import React from 'react'
const CrunchInfo = class extends React.Component {

    constructor (props) {
        super(props);


    }
    getInfo = () => {
        let {data, type} = this.props;
        if(type === 'org'){
            let {name, city, region, country, description, stock_exchange, stock_symbol} = data.org;
            return (
                <div className={`organization`}>
                    <div className={`org-name`}>{name}</div>
                    <div className={`org-location`}>{city}, {region} - {country}</div>
                    <div className={`org-stock`}>{stock_symbol} ({stock_exchange})</div>
                    <div className={`org-description`}>{description}</div>
                </div>
            )
        }
    }

    render () {
        return (
            <div className={`display-crunch`}>
                {this.getInfo()}
            </div>
        )
    }
}

export default CrunchInfo