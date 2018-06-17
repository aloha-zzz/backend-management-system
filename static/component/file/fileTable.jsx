import { Table, Icon, Divider, Select, Input, Modal, message } from 'antd';
const Option = Select.Option;
import React from 'react';

import { ajax, Url, timeFormat, addKey } from './../utilIndex';

export default class FileTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showResult: [],
            result: [],
            visible: false,
            opData: []
        }
    }

    componentDidMount() {
        ajax({
            url: Url.getFileInfo,
            cb: (res) => {
                const { data: { code, data } } = res;
                data.map((item, index) => {
                    item.key = index;
                    item.uptime = timeFormat(item.uptime)
                })
                this.setState({
                    result: data,
                    showResult: data,
                })
            }
        })
    }

    componentWillReceiveProps(nextProps) {
        const { showResult, result } = this.state;
        let search = nextProps.searchVal;
        let ansArr = [];
        result.map((item) => {
            if (item.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
                ansArr.push(item)
            }
        })
        this.setState({
            showResult: ansArr
        })
    }

    showInfo(record) {
        this.setState({
            visible: true
        })
        ajax({
            url: Url.getFileOp,
            params: { fid: record.fid },
            cb: (res) => {
                const { data: { code, data } } = res;

                addKey(data);
                this.setState({
                    fileOp: data
                })

            }
        })
    }

    handleCancel() {
        this.setState({
            visible: false
        })
    }

    handleChange({ fid, status }) {
        let user = sessionStorage.getItem('user')
        if (user === undefined) {
            message.warn('请先登录');
            return;
        }

        ajax({
            method: 'post',
            url: Url.changeFileStatus,
            data: {
                user,
                fid,
                status,
                time: timeFormat(),
            },
            cb: (res) => {
                message.success('修改成功')
            }
        })
    }

    renderfileOp() {
        const { fileOp } = this.state;
        const columns = [{
            title: '操作用户',
            dataIndex: 'usr',
            key: 'usr'
        }, {
            title: '文件名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '操作时间',
            dataIndex: 'optime',
            key: 'optime',
            render: (text) => {
                return (<span>{timeFormat(text)}</span>)
            }
        }, {
            title: '操作ip',
            dataIndex: 'opip',
            key: 'opip'
        }, {
            title: '操作内容',
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                switch (text.toString()) {
                    case "1":
                        return <span>上传</span>
                    case "2":
                        return <span>下载</span>
                    case "3":
                        return <span>删除</span>
                    case "4":
                        return <span>修改文件状态</span>
                    default:
                        return '';
                }
            }
        }]
        return (
            <Table columns={columns} dataSource={fileOp}></Table>
        )
    }
    render() {
        const columns = [{
            title: '文件id',
            dataIndex: 'fid',
            key: 'fid',
        }, {
            title: '文件名',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '上传者',
            dataIndex: 'usr',
            key: 'usr',

        }, {
            title: '上传时间',
            dataIndex: 'uptime',
            key: 'uptime',
        }, {
            title: '下载次数',
            dataIndex: 'dncnt',
            key: 'dncnt',
        }, {
            title: '原创',
            dataIndex: 'origin',
            key: 'origin',
            render: (text, record) => {
                //0 非原创 ；1 原创
                switch (text.toString()) {
                    case '0':
                        return <span>非原创</span>
                    case '1':
                        return <span>原创</span>
                    default:
                        return ''
                }
            }
        }, {
            title: '文件状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return (<Select defaultValue={text.toString()} style={{ width: 120 }} onChange={(value) => this.handleChange({ fid: record.fid, status: value })}>
                    <Option value="1">正常</Option>
                    <Option value="4">封禁</Option>
                </Select>)
            }
        }, {
            title: '所属课程',
            dataIndex: 'cname',
            key: 'cname',
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <a onClick={() => this.showInfo(record)}>
                    详情
                </a>
            ),
        }];
        const { result, visible, showResult } = this.state;
        return (
            <div>
                <Modal width={'60%'} footer={null} onCancel={() => this.handleCancel()} visible={visible}>
                    {this.renderfileOp()}
                </Modal>
                <Table columns={columns} dataSource={showResult} pagination={{ pageSize: 6 }} />
            </div>
        )
    }
}