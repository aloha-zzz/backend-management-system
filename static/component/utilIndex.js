import ajax from './../util/Ajax';
import Url from './../util/API';
import Dep from './../util/event';
import timeFormat from './../util/timeFormat';
import addKey from './../util/forReactDiff';


function collectRecord(time, type) {
    ajax({
        method: 'post',
        url: Url.collectRecord,
        data: {
            time,
            type
        },
        cb: (res) => {
            console.log('你看不到我~')
        }
    })
}

export {
    ajax,
    Url,
    Dep,
    timeFormat,
    addKey,
    collectRecord
};