import React from 'react'
import EntityDisplay from './entityDisplay'
import { wait } from '../scripts/util/misc'
import fetch from 'isomorphic-unfetch'
import io from 'socket.io-client';

const Process = class extends React.Component {

    constructor ( props ) {
        super(props);

        this.state = {
            data: props.data,
            active: props.active,
            entity: false,
            output: false,
            progress: 'Welcome Admin'
        };

    }

    componentDidMount () {
        this.props.socket.on('updateEntity', this.updateEntity);
        this.props.socket.on('adminProgress', this.updateProgress);
    }

    componentWillUnmount () {
        this.props.socket.off('updateEntity', this.updateEntity);
        this.props.socket.off('adminProgress', this.updateProgress);
    }


    selectType = ( ev, key ) => {
        ev.stopPropagation()
        let { selected, data } = this.state;
        if ( key !== selected.name ) {
            selected = data.find(( { name } ) => name === key)
        } else {
            selected = false
        }
        this.setState({
            selected,
            entity: false
        })
    }

    selectEntity = ( ev, key ) => {
        ev.stopPropagation()
        let { entity } = this.state;
        entity = this.state.data.find(( { name } ) => name === key.name);
        this.setState({ entity })
    };

    closeEntity = ( ev, key ) => {
        ev.stopPropagation()
        let entity = false;

        this.setState({ entity })
    };

    updateEntity = async ( update ) => {
        let data = this.state.data.map(obj => {
            if ( obj.name === update.entity.name ) {
                let {_id, lemma, entity, name} = update.entity;
                return Object.assign({
                    count: obj.count,
                    tag_id: obj.tag_id
                }, {_id, lemma, entity, name})
            } else {
                return obj
            }
        });

        this.setState({
            data,
            output: false,
            entity: false
        });

        await wait(2000).then();

        this.setState({ progress: '...idle' })
    };

    setOutput = ( value, ent=false ) => {
        if ( value ) {
            let { content, image, info, name, url, _id } = value, { entity } = this.state;
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

    getEntityClass = ( tag ) => {
        let returner = '';
        if ( tag._id ) {
            returner += 'exists '
        }
        if ( !tag.entity ) {
            returner += 'no-entity'
        } else {
            returner += tag.entity.toLowerCase()
        }
        return returner
    };

    saveEntity = async ( ev ) => {
        ev.stopPropagation();
        let { output } = this.state;
        if ( output ) {
            this.props.socket.emit('processEntity', output)
        }
    };

    updateProgress = ( progress ) => {
        this.setState({ progress })
    };

    startBatch = (ev, count) => {
        ev.stopPropagation();
        let batch = this.state.data.filter(obj => !obj._id).sort(( a, b ) => b.count - a.count).slice(0, count);
        this.props.socket.emit('batchEntity', batch);
    };


    render () {
        const { data, entity } = this.state, { active } = this.props;

        return ( <div className={`section process ${active ? 'active' : ''}`}>
                <div className={`console`}>
                    <div className={`title`}>NER Console</div>
                    <div className={`label`}>Actions</div>
                    <div className={`actions`}>
                        <div className={`action`} onClick={(ev) => this.startBatch(ev, 10)}>Batch Process [ 10 ]</div>
                        <div className={`action`} onClick={(ev) => this.startBatch(ev, 50)}>Batch Process [ 50 ]</div>
                        <div className={`action`} onClick={(ev) => this.startBatch(ev, 500)}>Batch Process [ 500 ]</div>
                    </div>
                    <div className={`label`}>Outputs</div>
                    <div className={`code`}>
                        {this.state.output && ( <pre>{JSON.stringify(this.state.output, null, 4)}</pre> )}
                    </div>
                </div>
                <div className={`dashboard`}>
                    {entity && (
                        <EntityDisplay data={entity} closeEntity={this.closeEntity} gatherer={this.props.gatherer}
                                       entityTypes={this.props.entityTypes} setOutput={this.setOutput}
                                       saveEntity={this.saveEntity} socket={this.props.socket}/> )}
                    {active && ( <div className={`list`}>
                            {data && data.filter(obj => !obj._id || !obj.entity).sort(( a, b ) => b.count - a.count).slice(0, 500).map(tag => (
                                <div key={tag.name} className={`entity ${this.getEntityClass(tag)}`}
                                     onClick={( ev ) => this.selectEntity(ev, tag)}>{tag.name}
                                </div> ))}

                        </div> )}
                </div>
            </div> )
    }
}

export default Process