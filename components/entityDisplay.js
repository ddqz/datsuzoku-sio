import React from 'react'
import {Icon} from 'antd'
import Content from './content'
import Wiki from './wikiInfo'
import EntityTypes from './entityType'
import {wait} from '../scripts/util/misc'
import {Select} from 'antd'

const Option = Select.Option

const Entity = class extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            data: props.data,
            gatherer: props.gatherer,
            loading: true,
            search_term: props.data.lemma
        }

    }

    componentDidMount = async () => {
        this.props.socket.on('updateSearch', this.updateSearch);
        await this.displaySearch(null)
    }

    componentWillUnmount() {
        this.props.socket.off('updateSearch', this.updateSearch);
    }

    componentWillUpdate = async (nextProps, prevProps) => {
        if(prevProps.data !== nextProps.data){
            this.setState({data: nextProps.data, search_term: nextProps.data.term, loading: false})
            await wait(50).then();
            await this.displaySearch(false)
        }
    }

    displaySearch = async (ev, alt=false) => {
        if(ev) {
            ev.stopPropagation();
        }
        const {data} = this.state,
            {lemma} = data;

        this.setState({loading: true, entity: false, results: false, search_term: alt || lemma});

        if(alt){
            this.props.socket.emit('wikiSearch', {name: alt})
        } else {
            this.props.socket.emit('wikiSearch', data)
        }
    };

    updateSearch = async (data) => {
        let {results} = data,
            {content, info, url, image, name, _id} = results;
        this.setState({results, content, image, url, info, name, wiki_id: _id, loading: false});
        await wait(50).then();
        this.props.socket.emit('adminProgress', '...idle');
        if(this.props.setOutput){
            this.props.setOutput({content, info, url, image, name, _id})
        }
    };

    changeEntity = (ev) => {
        ev.stopPropagation()
        let {data, content, image, url, info, name, wiki_id} = this.state;

        data.entity = ev.target.value;

        this.setState({data});
        if(this.props.setOutput){
            this.props.setOutput({content, image, url, info, name, _id: wiki_id}, ev.target.value)
        }
    };

    lookup = async () => {
        let {search_term} = this.state;
        await this.displaySearch(false, search_term)
    };

    changeSearch = (ev) => {
        let search_term = ev.target.value;
        this.setState({search_term})
    };

    loading = () => {
        this.setState({loading: true})
    };


    render () {
        const {data, info, image, content, loading, search_term} = this.state,
            {name, count, entity} = data;

        return (
            <div className={`display`}>
                <div className={`close`} onClick={(ev) => this.props.closeEntity(ev, name)}>Close</div>
                <div className={`display-meta`}>
                    <input type={`text`} className={`search`} value={search_term} onChange={(ev) => this.changeSearch(ev)}/>
                    <div className={`cta lookup`} onClick={() => this.lookup()}>Lookup</div>
                    <EntityTypes value={entity} entityTypes={this.props.entityTypes} changeEntity={this.changeEntity}/>
                    <div className={`display-count`}>Tag Count: {count}</div>
                    <div className={`cta lookup save`} onClick={async (ev) => {this.loading(); await this.props.saveEntity(ev)}}>Save</div>
                    <Wiki data={info || false} image={image || false}/>
                </div>
                <Content data={content} name={name} loading={loading} displaySearch={this.displaySearch}/>
                {loading && (
                    <div className={`loader`}>
                        <Icon type={`loading`}/>
                    </div>
                )}
            </div>
        )
    }
}

export default Entity