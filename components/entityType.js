import React from 'react'
import {Select} from 'antd'
const {Option} = Select;
const EntityTypes = class extends React.Component {

    constructor (props) {
        super(props);

    }

    render () {
        let {entityTypes, value} = this.props;

        return (
            <select className={`entity-types`} value={value} onChange={(ev) =>this.props.changeEntity(ev)}>
                <option key={'default'} value={null}>Select an Entity</option>
                {entityTypes && entityTypes.map(entity => (
                    <option key={entity.abbr} value={entity.abbr}>{entity.abbr}</option>
                ))}

            </select>
        )
    }
}

export default EntityTypes