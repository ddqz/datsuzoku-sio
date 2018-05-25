import React from 'react'
const Analysis = class extends React.Component {

    constructor() {
        super();
    }

    render() {
        const { authors, obsessions, pronouns, people, orgs, entities, bios } = this.props.data;
        return (
            <div id="analysis" className={`${this.props.collapsed ? `collapsed` : ``}`}>
                <div className={`charts`}>
                    {authors && (
                        <div className='pie' dangerouslySetInnerHTML={{__html: authors.svg}}/>

                    )}
                    {obsessions && (
                        <div className='pie' dangerouslySetInnerHTML={{__html: obsessions.svg}}/>

                    )}
                    {bios && bios.length > 0 && (
                        <div className={`bios`}>
                            <div className={`label`}>Top People</div>
                            {bios.filter(obj => obj).map(obj => (
                                <div className={`bio`} key={obj.name}>
                                    <div className={`bio-img`}>{obj.image && obj.image !== 'https://upload.wikimedia.org/wikipedia/en/5/5f/Disambig_gray.svg' && (
                                        <img src={obj.image} />)}</div>
                                    <div className={`bio-name`}>{obj.name}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {entities && (
                        <div className='stack' dangerouslySetInnerHTML={{__html: entities.svg}}/>

                    )}
                    {pronouns && (
                        <div className='stack' dangerouslySetInnerHTML={{__html: pronouns.svg}}/>

                    )}
                    {orgs && (
                        <div className='pie' dangerouslySetInnerHTML={{__html: orgs.svg}}/>

                    )}
                </div>
            </div>
        )
    }
};

export default Analysis
