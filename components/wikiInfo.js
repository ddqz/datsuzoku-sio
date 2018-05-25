import React from 'react'

const WikiInfo = class extends React.Component {

    constructor ( props ) {
        super(props);


    }

    getInfo = () => {
        let { data, type } = this.props,
            info = []

        for ( let key of Object.keys(data) ) {

            info.push(<div key={key} className={`info-block`}>
                <div className={`info-name`}>{key}</div>
                <div className={`properties`}>
                    {Object.keys(data[ key ]).map(prop => {
                        if(typeof data[key][prop] === 'string'){
                            return ( <div key={prop} className={`property`}>
                                <span>{prop}:</span> {data[ key ][ prop ]}
                            </div> )
                        }
                    })}
                </div>
            </div>)
        }

        return info

        /*
                if(publicCompany){
                    let {name, founded, founders, hqLocation, hqLocationCity, hqLocationCountry, keyPeople, numEmployees} = publicCompany;
                    return (
                        <div className={`organization`}>
                            <div className={`org-name`}>{name}</div>
                            <div className={`org-location`}>{hqLocationCity}, {hqLocation} - {hqLocationCountry}</div>
                            {typeof founders === 'object' && (
                                <div className={`founders`}>
                                    {founders.map(founder => (<div className={`founder`}>{founder}</div> ))}
                                </div>
                            )}
                        </div>
                    )
                }
        */
        /*
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
        */
    };

    render () {
        return ( <div className={`display-wiki`}>
            {this.props.image && /jpg|gif|svg/i.test(this.props.image) && (<div className={`wiki-image`} style={{ backgroundImage: `url(${this.props.image})` }}/>)}
                {this.getInfo()}
            </div> )
    }
}

export default WikiInfo