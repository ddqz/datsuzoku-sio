import React from 'react'
import Obsession from './obsession'
import { wait } from '../scripts/util/misc';
const Obsessions = class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            selected: false,
            data: props.obsessions,
            page: props.page
        }

    }

    changePage = () => {
        const {page} = this.state;
        if(page !== 'obsession'){
            this.props.changePage('obsession');
        }
    };

    selectType = (ev, key) => {
        ev.stopPropagation()
        let {selected, data} = this.state;
        if (key !== selected.name){
            selected = data.find(({name}) => name === key)
        } else {
            selected = false
        }
        this.setState({selected, entity: false})
    }

    selectEntity = (ev, key) => {
        ev.stopPropagation()
        let entity = this.props.allEntities.find(({name}) => name === key.name)
        this.setState({entity})
    }

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
            entity: false
        });

        await wait(2000).then();

        this.setState({ progress: '...idle' })
    };

    closeEntity = (ev, key) => {
        ev.stopPropagation()
        let entity = false;

        this.setState({entity})
    }

    render () {
        const {data, selected, entity} = this.state,
            {page} = this.props,
            keys = data.map(({name}) => name);
        return (
            <div className={`section obsessions ${page === 'obsession' ? 'active' : ''}`} onClick={() => this.changePage()}>
                <div className={`title`}>By Obsession</div>
                {page === 'obsession' && (
                    <div className={`holder ${selected ? 'active' : ''}`}>
                        {keys && keys.map(key => (
                            <Obsession
                                key={key}
                                data={data.find(({name}) => name === key)}
                                selectType={this.selectType}
                                selectEntity={this.selectEntity}
                                updateEntity={this.updateEntity}
                                entityTypes={this.props.entityTypes}
                                closeEntity={this.closeEntity}
                                active={selected.name === key}
                                entity={selected.name === key ? entity : false}
                                gatherer={this.props.gatherer}
                                socket={this.props.socket}
                            />
/*
                            <div key={key} className={`type`} onClick={() => this.selectType(key)}>
                                <div className={`name`}>{key}</div>
                            </div>
*/
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default Obsessions