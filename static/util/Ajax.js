import axios from 'axios';
import { message } from 'antd';


export default function http({ url, data, method, params, cb }) {
    if (typeof cb !== 'function') {
        message.warn('http请求有误')
        return;
    }
    return axios({
        method: method || 'get',
        url,
        data,   // post, put, delete
        params, // get
        withCredentials: true
    }).then(data => {
        if (data.status !== 200) {
            message.warn('服务器内部异常');
            return;
        }
        if (data.data.code === 0) {
            console.log('success')
            cb(data)
            return;
        }
        if (data.data.code === 3) {
            message.warn('请先登陆')
            return;
        }
        if (data.data.code === -1) {
            message.warn('服务器内部错误');
            return;
        }
        message.warn(data.data.wrongInfo);
    }).catch(err => {
        message.warn('网络连接异常')
    })
}
