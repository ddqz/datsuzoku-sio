import React from 'react'
import EntityDisplay from './entityDisplay'
const Entity = class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            data: props.data,
            active: props.active
        }

    }

    getEntityClass = (tag) => {
        let returner = '';
        if(tag._id){
            returner += 'exists '
        }
        if(!tag.entity){
            returner += 'no-entity'
        } else {
            returner += tag.entity.toLowerCase()
        }
        return returner
    };

    render () {
        const {data} = this.state,
            {active, name, entity} = this.props,
            count = data.length;

        return (
            <div className={`type ${active ? 'active' : ''}`} onClick={(ev) => {if(!active)this.props.selectType(ev, name)}}>
                <div className={`name`} onClick={(ev) => this.props.selectType(ev, name)}>{name}</div>
                {active && (
                    <div className={`meta`}>
                        <div className={`close`} onClick={(ev) => this.props.selectType(ev, name)}>Close</div>
                        <div className={`count`}>Entity Count: {count}</div>
                    </div>
                )}
                {active && (
                    <div className={`list`}>
                        {!entity && data && data.map(tag => (
                            <div key={tag.name} className={`entity ${this.getEntityClass(tag)}`} onClick={(ev) => this.props.selectEntity(ev, tag)}>{tag.name}
                            </div>
                        ))}
                        {entity && (
                            <EntityDisplay data={entity} closeEntity={this.props.closeEntity} gatherer={this.props.gatherer} entityTypes={this.props.entityTypes} socket={this.props.socket}/>
                        )}

                    </div>
                )}
            </div>
        )
    }
}

export default Entity