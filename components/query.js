import React from 'react'
import {Input, Select, Form, Button} from 'antd'

const {Option} = Select;


const QueryBuilder = class extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Form className={`search-form ${this.props.collapsed ? ` collapsed` : ``}`} onSubmit={this.props.submitQuery}>
                <Input onChange={ev => this.props.selector(ev, 'query')} placeholder='Query' className={`query`} />
                <Select className={`tags`} mode='tags' tokenSeparators={[',']} filterOption={false} placeholder='Tags (separated by commas)' onChange={ev => this.props.updateTerms(ev, 'tags')}/>
                {this.props.meta.author.data.length > 0 && (<Select mode='tags' onChange={ev => this.props.selector(ev, 'author')} tokenSeparators={[',']} className='query-select author' placeholder='Authors'>
                    {this.props.meta.author.data.filter(obj => !obj.contributor).map(obj => (
                        <Option key={obj._id} value={obj.name}>{obj.name ? obj.name.toUpperCase() : ''}</Option>
                    ))}
                </Select>)}
                {this.props.meta.edition.data.length > 0 && (<Select mode='tags' onChange={ev => this.props.selector(ev, 'edition')} tokenSeparators={[',']} className='query-select edition' placeholder='Editions'>
                    {this.props.meta.edition.data.map(obj => (
                        <Option key={obj._id} value={obj.name}>{obj.name.toUpperCase()}</Option>
                    ))}
                </Select>)}
                {this.props.meta.series.data.length > 0 && (<Select mode='tags' onChange={ev => this.props.selector(ev, 'series')} tokenSeparators={[',']} className='query-select series' placeholder='Series'>
                    {this.props.meta.series.data.map(obj => (
                        <Option key={obj._id} value={obj.slug}>{obj.name.toUpperCase()}</Option>
                    ))}
                </Select>)}
                {this.props.meta.topic.data.length > 0 && (<Select mode='tags' onChange={ev => this.props.selector(ev, 'topic')} tokenSeparators={[',']} className='query-select topics' placeholder='Topics'>
                    {this.props.meta.topic.data.map(obj => (
                        <Option key={obj._id} value={obj.slug}>{obj.name.toUpperCase()}</Option>
                    ))}
                </Select>)}
                {this.props.meta.obsession.data.length > 0 && (<Select mode='tags' onChange={ev => this.props.selector(ev, 'obsession')} tokenSeparators={[',']} className='query-select obsession' placeholder='Obsessions'>
                    {this.props.meta.obsession.data.map(obj => (
                        <Option key={obj._id} value={obj.slug}>{obj.name.toUpperCase()}</Option>
                    ))}
                </Select>)}
                <div className={`advanced`} onClick={() => this.props.collapseAdvanced()}>
                    {this.props.collapsed && (
                        `Show Advanced`
                    )}
                    {!this.props.collapsed && (
                        `Collapse`
                    )}
                </div>
                <Button type="primary" htmlType="submit">
                    Search
                </Button>
            </Form>
        )
    }
};

export default QueryBuilder
