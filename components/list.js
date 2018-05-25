import React from 'react'
import {Card, Icon, Layout} from 'antd'
import entities from 'html-entities'

const {Meta} = Card;
const {Footer} = Layout;

const List = class extends React.Component {

    constructor() {
        super();
    }

    getActions = (obj) => {
        return (
            [<div className={`edition`}>{obj.permalink.split('qz.com')[0].split('//')[1] + 'qz.com'}</div>,<div className='icons'><div className='view-icon'/></div>]
        )
    }

    render() {
        return (
            <div className={this.props.className} id={this.props.id}>
                {this.props.data && this.props.data.map(obj => {
                    if (obj.hero && obj.hero.url) {
                        return (
                            <Card
                                key={obj._id}
                                title={entities.XmlEntities.decode(obj.title)}
                                actions={this.getActions(obj)}
                                cover={<img alt="example" width='360' src={obj.hero ? obj.hero.url.split('w=')[0] +'w=360' : false}/>}
                                onClick={() => this.props.showArticle(obj)}
                            >
                                <Meta
                                    description={`${new Date(obj.date.published).toDateString()} - ` + entities.XmlEntities.decode(obj.summary).replace('&hellip;', '...')}/>

                            </Card>
                        )
                    } else {
                        return (
                            <Card
                                key={obj._id}
                                title={entities.XmlEntities.decode(obj.title)}
                                actions={this.getActions(obj)}
                                onClick={() => this.props.showArticle(obj)}
                            >
                                <Meta
                                      description={`${new Date(obj.date.published).toLocaleDateString()} - ` + entities.XmlEntities.decode(obj.summary).replace('&hellip;', '...')}/>
                            </Card>
                        )
                    }
                })}
            </div>
        )
    }
};

export default List
