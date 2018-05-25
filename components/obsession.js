import React from 'react'
import EntityDisplay from './entityDisplay'
import { wait } from '../scripts/util/misc';
const Obsession = class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            data: props.data,
            active: props.active,
            entity: props.entity
        }

    }

    componentDidMount () {
        this.props.socket.on('updateEntity', this.props.updateEntity);
    }

    componentWillUnmount () {
        this.props.socket.off('updateEntity', this.props.updateEntity);
    }


    selectType = (key) => {
        let selected = this.state.data.find(({name}) => name === key);
        this.setState({selected})
    };

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

    setOutput = ( value, ent=false ) => {
        if ( value ) {
            let { content, image, info, name, url, _id } = value, { entity } = this.props;
            if(entity && entity.entity && ent) entity.entity = ent;
            this.setState({
                output: {
                    entity: {
                        entity: entity.entity,
                        name: entity.name,
                        _id: entity._id,
                        lemma: entity.lemma,
                        tag_id: entity.tag_id
                    },
                    wikipedia: {
                        _id,
                        title: name,
                        url,
                        image,
                        info,
                        blocks: content
                    }
                }
            })
        }
    };



    saveEntity = async ( ev ) => {
        ev.stopPropagation();
        let { output } = this.state;
        if ( output ) {
            this.props.socket.emit('processEntity', output)
        }
    };


    render () {
        const {data} = this.state,
            {active, entity} = this.props,
            {name, count, tags} = data;
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
                        {tags && tags.map(tag => (
                            <div key={tag.name} className={`entity ${this.getEntityClass(tag)}`} onClick={(ev) => this.props.selectEntity(ev, tag)}>{tag.name}
                            </div>
                        ))}
                        {entity && (
                            <EntityDisplay data={entity} closeEntity={this.props.closeEntity} gatherer={this.props.gatherer} entityTypes={this.props.entityTypes} setOutput={this.setOutput}
                                           saveEntity={this.saveEntity} socket={this.props.socket}/>
                        )}

                    </div>
                )}
            </div>
        )
    }
}

export default Obsession