import { Table, Icon, Select } from 'antd';
import React from 'react';

import { ajax, timeFormat, Url, addKey } from './../utilIndex';



export default class Logs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: []
        }
    }

    componentDidMount() {
        ajax({
            url: Url.getLogs,
            cb: (res) => {
                const { data: { code, data } } = res;
                addKey(data)
                console.log(data)
                this.setState({
                    info: data
                })
            }
        })
    }

    render() {
        const { info } = this.state;
        const columns = [{
            title: '用户名',
            dataIndex: 'usr',
            key: 'usr',

        }, {
            title: '登陆时间',
            dataIndex: 'logintime',
            key: 'logintime',
            render: (text) => {
                return (
                    <span>{timeFormat(text)}</span>
                )
            }
        }, {
            title: '登出时间',
            dataIndex: 'logouttime',
            key: 'logouttime',
            render: (text) => {
                return (
                    <span>{timeFormat(text)}</span>
                )
            }
        }, {
            title: '登陆ip地址',
            dataIndex: 'opip',
            key: 'opip',
        }];
        return (
            <div>
                <Table columns={columns} dataSource={info} />
            </div>
        )
    }
}