import React from 'react'
import {Layout, Icon} from 'antd'
import Head from '../components/head'
import Obsessions from '../components/obsessions'
import Entities from '../components/entities'
import Process from '../components/process'
import {wait} from '../scripts/util/misc'
import ObsessionData from '../static/training/training_obsessions'
import EntityData from '../static/training/training_entities'
import fetch from 'isomorphic-unfetch'
import io from 'socket.io-client'

const {Footer} = Layout;

let fetching = false;

const MainPage = class extends React.Component {

    static async getInitialProps(req) {
        const isServer = !!req;
/*

        let meta = {},
            entities = [],
            existing_entity_fetch = await fetch(process.env.API_PATH + 'meta/entity'),
            existing_entities = await existing_entity_fetch.json(),
            entity_data = {},
            obsession_data = [];

        for(let type of Object.keys(EntityData)){
            let tags = EntityData[type];
            entity_data[type] = [];
            tags = tags.map(obj => {
                let exists = existing_entities.data.find(ex => ex.name === obj.name)
                if(!exists){
                    return obj
                } else {

                    return Object.assign({count: obj.count, tag_id: obj.tag_id}, exists)
                }
            });
            for(let entity of tags) {
                let exists = entities.find(( { name } ) => name === entity.name)
                if ( !exists ) {
                    entities.push(entity);
                    entity_data[type].push(entity);
                }
            }
        }
        for(let ob of ObsessionData){
            let new_ob = ob;

            new_ob.tags = ob.tags.map(obj => {
                let full = Object.assign(entities.find(n => n.name === obj.name) || obj, {tag_id: obj._id});
                let exists = existing_entities.data.find(ex => ex.name === full.name);
                if(!exists){
                    return full
                } else {

                    return Object.assign({count: obj.count, tag_id: obj.tag_id}, exists)
                }
            })
            obsession_data.push(new_ob)
        }
        let types = [... new Set([].concat(...entities.map(({entity}) => entity.split(' '))))].filter(o => o);
        let existing_fetch = await fetch(process.env.API_PATH + 'meta/type'),
            existing_types = await existing_fetch.json();
        for(let type of types){
            let exists = existing_types.data.find(({abbr}) => abbr === type);
            if(!exists){
                let new_fetch = await fetch(process.env.API_PATH + 'meta/type', {
                        method: 'POST',
                        body: JSON.stringify({abbr: type}),
                        headers: {'Content-Type': 'application/json'}
                    });
                exists = await new_fetch.json();
                existing_types.data.push(exists)

            }
        }
*/
        return {isServer, query: {}, api: process.env.API_PATH, nlp: process.env.NLP_API, viz: process.env.VIZ_API, gatherer: process.env.GATHERER_API}
        // return {meta, isServer, obsessions: obsession_data, entities: entity_data, allEntities: entities, entityTypes: existing_types.data, query: {}, api: process.env.API_PATH, nlp: process.env.NLP_API, viz: process.env.VIZ_API, gatherer: process.env.GATHERER_API}

    }


    constructor(props) {
        super(props);

        this.state = {
            isServer: props.isServer,
            meta: props.meta,
            obsessions: props.obsessions,
            entities: props.entities,
            allEntities: props.allEntities,
            progress: 'Loading...',
            page: 'home'
        };
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('initialPayload', this.initialPayload);
        this.socket.on('adminProgress', this.updateProgress);
    }

    componentWillUnmount() {
        this.socket.off('initialPayload', this.initialPayload);
        this.socket.off('adminProgress', this.updateProgress);
        this.socket.close()
    }

    updateProgress = ( progress ) => {
        console.log(progress);
        this.setState({ progress })
    };

    handleMessage = (message) => {
        console.log(message)
    };

    initialPayload = async (data) => {
        this.setState(data)
        await wait(50).then();
        this.setState({progress: '...idle'})
    };

    changePage = (p) => {
        this.setState({page: p})
    };

    render() {
        return (
            <div className={`container`}>
                <Head title="SiO2" page="home"/>
                <div className={`menu`}>
                    <div className={`left`}>
                        <div className={`logo`}>SiO2</div>
                        <div className={`progress`}>{this.state.progress}</div>
                    </div>
                    <div className={`right`}>
                        <div className={`sub-menu`}>Search</div>
                        <div className={`sub-menu`}>NER</div>
                    </div>
                </div>
                <div className={`sections ${this.state.page === 'home' ? '' : 'active'}`}>
                    <div className={`process`} onClick={() => this.changePage('process')}><Icon type={`api`}/></div>
                    {this.state.obsessions && (
                        <Obsessions
                        allEntities={this.state.allEntities}
                        entityTypes={this.state.entityTypes}
                        obsessions={this.state.obsessions}
                        page={this.state.page}
                        changePage={this.changePage}
                        gatherer={this.props.gatherer}
                        socket={this.socket}
                    />)}
                    {this.state.page === 'process' && (
                        <Process
                            data={this.state.allEntities}
                            active={true}
                            entityTypes={this.state.entityTypes}
                            entities={this.state.entities}
                            page={this.state.page}
                            changePage={this.changePage}
                            gatherer={this.props.gatherer}
                            api={this.props.api}
                            socket={this.socket}
                        />
                    )}
                    {this.state.entities && (
                        <Entities
                        allEntities={this.state.allEntities}
                        entityTypes={this.state.entityTypes}
                        entities={this.state.entities}
                        page={this.state.page}
                        changePage={this.changePage}
                        gatherer={this.props.gatherer}
                        socket={this.socket}
                    />)}
                </div>
            </div>
        )
    }

};

export default MainPage

