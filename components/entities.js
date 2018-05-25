import React from 'react'
import Entity from './entity'
import EntityDisplay from './entityDisplay'
const Entities = class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            selected: false,
            data: props.entities,
            page: props.page,
            name: false,
            entity: false
        }

    }
    changePage = () => {
        const {page} = this.state;
        if(page !== 'entities'){
            this.props.changePage('entities');
        }
    };

    selectType = (ev, key) => {
        ev.stopPropagation()
        let {selected, data, name} = this.state;
        console.log(key, name)
        if (key !== name){
            selected = data[key];
            name = key;
        } else {
            selected = false;
            name = false;
        }
        this.setState({selected, name, entity: false})
    }
    selectEntity = (ev, key) => {
        ev.stopPropagation()
        let entity = this.props.allEntities.find(({name}) => name === key.name)
        console.log(entity)
        this.setState({entity})
    }

    closeEntity = (ev, key) => {
        ev.stopPropagation()
        let entity = this.state.entity;
        entity = false;
        console.log(entity);
        this.setState({entity})
    }


    render () {
        const {data, name, entity} = this.state,
            {page} = this.props,
            keys = Object.keys(data);
        return (
            <div className={`section entities ${page === 'entities' ? 'active' : ''}`} onClick={() => this.changePage()}>
                <div className={`title`}>By Type</div>
                {page === 'entities' && (
                    <div className={`holder ${name ? 'active' : ''}`}>
                        {keys && keys.map(key => (
                            <Entity
                                key={key}
                                data={data[key]}
                                selectType={this.selectType}
                                selectEntity={this.selectEntity}
                                closeEntity={this.closeEntity}
                                entityTypes={this.props.entityTypes}
                                active={name === key}
                                name={key}
                                entity={name === key ? entity : false}
                                gatherer={this.props.gatherer}
                                socket={this.props.socket}
                            />
                        ))}
                    </div>
                )}
            </div>
        )
    }
}

export default Entities