const wikijs = require('wikijs').default;
const wait = time => new Promise((resolve) => setTimeout(resolve, time));


const Wiki = {
    lookup: async (term) => {
        let returner = {result: false},
            search = await wikijs().search(term).then(),
            result = search.results.find(obj => obj.toLowerCase() === term.toLowerCase());

        if(result){
            let page = await wikijs().page(result);
            if(page){
                returner.result = {name: result, image: await page.mainImage(), summary: await page.summary(), categories: await page.categories(), title: await page.info('title')}
            }
        }

        return returner

    },
    parse: (data) => {
        let sentences = data.sections.map(obj => obj.sentences).reduce((a, b) => a.concat(b), []),
            links = {},
            messages = [];

        for (let section of data.sections){
            for (let link of section.rellinks){
                links[link] = links[link] ? links[link] + 1 : 1;
            }
        }
        let link_keys = Object.keys(links).sort((a, b) => {
            return links[b] - links[a]
        });

        messages.push({
            text: data.first
        });
        messages.push({
            attachments: [
                {
                    color: '#9b90c2',
                    title: 'Related Articles',
                    text: link_keys.slice(0,5).join(', ')}
            ]
        });
        messages.push({
            text: sentences[0].text
        });

        return messages

    }
};

export default Wiki