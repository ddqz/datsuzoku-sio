import React from 'react'
const Content = class extends React.Component {

    constructor (props) {
        super(props);


    }

    makeBlock = (block, refer, i) => {
        if(block.type && block.type === 'header'){
            return (<h2 key={i}>{block.text}</h2>)
        } else {
            if(!refer || /may refer to:|refers to:/i.test(block.text)){
                return (<p key={i}>{block.text}</p>)
            } else {
                let arr = block.text.split(','),
                    copy = arr.slice(1, arr.length).join(','),
                    link = arr[0];

                return (<p key={i}><span className={`wiki-link`} onClick={(ev) => this.props.displaySearch(ev, link)}>{link},</span>{copy}</p>)
            }
        }
    };


    render () {
        const {data, name} = this.props,
            refer = data && data.length > 0 ? 50 > data[0].text.search(/refer to|refers to/i) && data[0].text.search(/refer to|refers to/i) > -1 : false;

        return (
            <div className={`display-content`}>
                <div className={`name`}>{name}</div>
                {!this.props.loading && (
                    <div className={`blocks`}>
                        {data && data.map((block, i) => {
                            return this.makeBlock(block, refer, i)
                        })}
                    </div>
                )}
            </div>
        )
    }
}

export default Content