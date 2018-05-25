import visualize from './visualize';
import fetch from 'isomorphic-unfetch';
import wiki from '../wiki'

const Analysis = {
    process: async (data, color, theme) => {
        let people, orgs, gpe, norp, pronouns, timeline, authors, obsessions, entities, bios = [];

        if (data.people && data.people.length > 1) {
            let people_data = {
                data: {
                    rows: data.people.map(obj => [obj.name, obj.count]).slice(0, 8),
                    column_labels: ['Person', 'Frequency'],
                    title: 'Top People'
                }, type: 'pie', max: 8, color, theme
            };
            let people_fetch = await fetch(process.env.VIZ_API + 'make', {
                method: 'post', body: JSON.stringify(people_data), headers: {'Content-Type': 'application/json'}
            });
            people = await people_fetch.json()

            let names = data.people.map(obj => obj.name).slice(0, 8);

            let name_fetch = await fetch(process.env.API_PATH + 'wiki', {
                method: 'post', body: JSON.stringify({names}), headers: {'Content-Type': 'application/json'}
            });
            bios = await name_fetch.json();

            bios = bios.map(obj => obj.results).filter(obj => obj.result).map(obj => obj.result).slice(0,4)

        }

        if (data.orgs && data.orgs.length > 1) {
            let org_data = {
                data: {
                    rows: data.orgs.map(obj => [obj.name, obj.count]).slice(0, 8),
                    column_labels: ['Person', 'Frequency'],
                    title: 'Top Orgs'
                }, type: 'pie', max: 8, color, theme
            };
            let org_fetch = await fetch(process.env.VIZ_API + 'make', {
                method: 'post', body: JSON.stringify(org_data), headers: {'Content-Type': 'application/json'}
            });
            orgs = await org_fetch.json()
        }

        if (data.pronouns && data.pronouns.length > 0) {
            let pronouns_list = [];
            for (let pronoun of data.pronouns) {
                let cat = Analysis.classifyPronoun(pronoun.name),
                    item = pronouns_list.find(obj => obj.name === cat);
                if(cat) {
                    if (item) {
                        item.count++
                    } else {
                        pronouns_list.push({name: cat, count: 1})
                    }
                }
            }
            let pronouns_data = {
                data: {
                    rows: pronouns_list.map(obj => [obj.name, obj.count]).slice(0, 8),
                    column_labels: ['Pronoun Type', 'Count'],
                    title: 'Pronoun Usage'
                }, type: 'stack', max: 8, color, theme
            };
            let pronouns_fetch = await fetch(process.env.VIZ_API + 'make', {
                method: 'post', body: JSON.stringify(pronouns_data), headers: {'Content-Type': 'application/json'}
            });
            pronouns = await pronouns_fetch.json()

        }

        if (data.authors && data.authors.length > 0){
            let author_data = {
                data: {
                    rows: data.authors.map(obj => [obj.name, obj.count]).slice(0,5),
                    column_labels: ['Person', 'Frequency'],
                    title: 'Top Authors'
                }, type: 'horizontalbar', max: 5, color, theme
            };
            let author_fetch = await fetch(process.env.VIZ_API + 'make', {
                method: 'post', body: JSON.stringify(author_data), headers: {'Content-Type': 'application/json'}
            });
            authors = await author_fetch.json()

        }

        if (data.obsessions && data.obsessions.length > 0){
            let obsession_data = {
                data: {
                    rows: data.obsessions.map(obj => [obj.name, obj.count]).slice(0,5),
                    column_labels: ['Person', 'Frequency'],
                    title: 'Top Obsessions'
                }, type: 'horizontalbar', max: 5, color, theme
            };
            let obsession_fetch = await fetch(process.env.VIZ_API + 'make', {
                method: 'post', body: JSON.stringify(obsession_data), headers: {'Content-Type': 'application/json'}
            });
            obsessions = await obsession_fetch.json()

        }

        if (data.timeline && data.timeline.length > 1) {
            timeline = await visualize.createTimeline([data.timeline]);
        }

        if(data.entities && data.entities.length > 3) {
            let ents = data.entities.filter(obj => obj.count > 1).map(obj => [obj.text, obj.count]);

            ents = ents.concat(data.entities.filter(obj => obj.count > 1 && ents.filter(ent => ent[0] === obj.text).length === 0).map(obj => [
                obj.text,
                obj.count
            ])).sort((a, b) => b[1] - a[1]);

            if (ents.length > 3) {
                let word_data = {
                    data: {
                        rows: ents.slice(0, 8),
                        column_labels: ['Term', 'Frequency'],
                        title: 'Top Terms'
                    }, type: 'word', max: 8, color
                };
                let word_fetch = await fetch(process.env.VIZ_API + 'make', {
                    method: 'post', body: JSON.stringify(word_data), headers: {'Content-Type': 'application/json'}
                });
                entities = await word_fetch.json()
            }
        }
        // console.log(entities, data);
        return {
            people, obsessions, orgs, timeline, pronouns, authors, entities, bios
        }

    },

    classifyPronoun: (pronoun) => {
        if (['he', 'him', 'his', 'himself'].includes(pronoun.toLowerCase())) {
            return 'male'
        } else if (['she', 'her', 'hers', 'herself'].includes(pronoun.toLowerCase())) {
            return 'female'
        } else if ([
                'you', 'i', 'me', 'my', 'your', 'yours', 'you\'ll', 'i\'m', 'we', 'yourself', 'myself', 'ourselves',
                'our', 'us'
            ].includes(pronoun.toLowerCase())) {
            return 'personal'
        } else if (['it', 'it\'s', 'itself', 'one', 'oneself'].includes(pronoun.toLowerCase())) {
            return 'neutral'
        } else if (['they', 'them', 'their', 'theirs', 'themself', 'themselves'].includes(pronoun.toLowerCase())) {
            return 'neutral'
        } else {
            // console.log(pronoun)
            return false
        }
    }

};

export default Analysis