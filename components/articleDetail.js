import React from 'react'
import {Card, Icon, Layout} from 'antd'
import entities from 'html-entities'

const {Meta} = Card;

const ArticleDetail = class extends React.Component {

    constructor() {
        super();
    }

    render() {
        const { analysis } = this.props.data
        return (
            <div className="detail">
                <Card
                    cover={
                        <div className={`cover`}>
                            <img alt="example" width='100%' src={this.props.data.hero ? this.props.data.hero.url.split('w=')[0] +'w=1280' : false}/>
                            <div className={`overlay`}/>
                            <div className={`title`}>{this.props.data.title}</div>
                            <div className={`date`}>{new Date(this.props.data.date.published).toDateString()}</div>
                            <div className={`authors`}>{this.props.data.byline.authors && (this.props.data.byline.authors.map(obj => obj.name).join(', '))}</div>
                        </div>
                    }
                >

                    <div className={`close`} onClick={ev => this.props.closeCard()}>&times;</div>
                    <Meta description={this.props.data.summary}/>
                    <div className={`charts`}>
                    {analysis.entities && (
                        <div className={`chart word-cloud`} dangerouslySetInnerHTML={{__html: analysis.entities.svg}}/>
                )}
                    {analysis.bios && analysis.bios.length > 0 && (
                        <div className={`chart bios`}>
                            <div className={`label`}>Top People</div>
                            {analysis.bios.map(obj => (
                                <div className={`bio`} key={obj.name}>
                                    <div className={`bio-img`}><img src={obj.image} /></div>
                                    <div className={`bio-name`}>{obj.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {analysis.pronouns && (
                        <div className={`chart word-cloud`} dangerouslySetInnerHTML={{__html: analysis.pronouns.svg}}/>
                    )}
{/*
                    {analysis.people && (
                        <div className={`chart word-cloud`} dangerouslySetInnerHTML={{__html: analysis.people.svg}}/>
                    )}
*/}
                    {analysis.orgs && (
                        <div className={`chart word-cloud`} dangerouslySetInnerHTML={{__html: analysis.orgs.svg}}/>
                    )}
                    </div>
                </Card>
            </div>
        )
    }
};

export default ArticleDetail
