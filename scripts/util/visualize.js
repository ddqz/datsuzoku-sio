const moment = require('moment'),
    fetch = require('isomorphic-unfetch'),
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const Visual = {
    createTimeline: async (data) => {

        let time_data = data.map(obj => obj.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())),
            start = moment(time_data[0][0].date),
            end = moment(time_data[0][time_data[0].length - 1].date),
            start_year = start.year(),
            start_month = start.month(),
            start_date = start.date(),
            start_hour = start.hour(),
            end_year = end.year(),
            end_month = end.month() ,
            end_date = end.date(),
            end_hour = end.hour(),
            diff = moment.duration(end.diff(start)),
            type,
            timeline = [];
        if(diff.years() > 0 || (diff.years() === 0 && diff.months() > 6)){
            type = 'month'
        } else if (diff.months() >= 1 || (diff.months() < 1 && diff.days > 7)){
            type = 'day'
        } else {
            type = 'hour'
        }
        for(let y = start_year; y<end_year +1; y++) {
            let begin_month = 0, final_month = 11;
            if (y === start_year) {
                begin_month = start_month
            }
            if (y === end_year) {
                final_month = end_month
            }
            for (let m = begin_month; m < final_month + 1; m++) {
                if(type === 'month') {
                    let arr = Array(time_data.length + 1).fill(0);
                    arr[0] = new Date(y+'-'+(m+1)+'-01 01:00');
                    timeline.push(arr)

                } else {
                    let begin_date = 1, final_date = m === 1 ? 28 : 31;
                    if (m === start_month) {
                        begin_date = start_date
                    }
                    if (m === end_month) {
                        final_date = end_date
                    }
                    for (let d = begin_date; d < final_date + 1; d++) {
                        if (type === 'day') {
                            let arr = Array(time_data.length + 1).fill(0);
                            arr[0] = new Date(y+'-'+m+'-'+d);
                            timeline.push(arr)
                        } else {
                            let begin_hour = 0;
                            let final_hour = 23;
                            if (d === start_date) {
                                begin_hour = start_hour;
                            }
                            if (d === end_date) {
                                final_hour = end_hour
                            }
                            for (let h = begin_hour; h < final_hour + 1; h++) {
                                let arr = Array(time_data.length + 1).fill(0);
                                arr[0] = new Date(y+'-'+m+'-'+d+' '+h);
                                timeline.push(arr)
                            }
                        }
                    }
                }
            }
        }
        for(let i=0, len = time_data.length; i<len; i++){
            for(let time of time_data[i]){
                let date_obj = new Date(time.date),
                    date = type === 'month' ? new Date(date_obj.getFullYear()+'-'+(date_obj.getMonth() + 1)+'-01 01:00') : date_obj,
                    time_point = timeline.find(obj => obj[0].getTime() === date.getTime());
                if(time_point){
                    time_point[i+1] ++
                }
            }
        }
        for(let t=0,len=timeline.length; t<len; t++){
            if(type === 'month'){
                let date = timeline[t][0];
                if(t===0 || t === len-1 || date.getMonth() === 0) {
                    timeline[t][0] = '  ' + months[date.getMonth()] + ' ' + date.getFullYear()
                } else {
                    timeline[t][0] = '-'
                }
            }
        }
        let viz_fetch = await fetch(process.env.VIZ_API + 'make', {
            method: 'POST',
            body: JSON.stringify({data: {title: 'Total articles by ' + type + ': ' + timeline[0][0] + ' - ' + timeline[timeline.length-1][0], rows: timeline, column_labels: ['Date', 'Article Count']}, type: 'linestack', max: timeline.length, color: {base: '#d5c9ff', direction: -1, steps: 10}, theme: 'dark', scale: 600}),
            headers: {'Content-Type': 'application/json'}
        });

        return await viz_fetch.json();

    }
};

export default Visual