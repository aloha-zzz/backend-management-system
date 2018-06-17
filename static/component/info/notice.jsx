import React from 'react'
import { Modal, Table, Button, Form, Input, DatePicker, Icon, Divider, message } from 'antd';
import { ajax, timeFormat, Url, addKey, collectRecord } from './../utilIndex';
import NoticeForm from './noticeForm'



export default class Notice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noticeInfo: [],
            changeTitle: '',
            changeContent: ''
        }
    }



    getNoticeInfo() {
        ajax({
            url: Url.getNoticeInfo,
            cb: (res) => {
                const { data: { code, data } } = res;
                addKey(data);
                data.map(item => {
                    item.isEdit = false;
                })
                this.setState({
                    noticeInfo: data
                })
            }
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        collectRecord(this.recordTime, 'notice')
    }

    componentDidMount() {
        this.getNoticeInfo();
        this.recordTime = 0
        this.interval = setInterval(() => this.recordTime += 1, 1000)
    }


    handleDelete(id) {
        console.log(id);
        ajax({
            url: Url.deleteNoticeInfo,
            method: 'delete',
            data: { nid: id },
            cb: (res) => {
                const { data: { code, data } } = res;
                message.success(data);
                this.getNoticeInfo();
            }
        })
    }

    handleEdit(nid) {
        const { noticeInfo, changeTitle, changeContent } = this.state;
        let editLine = -1;
        for (let i = 0; i < noticeInfo.length; i++) {
            if (noticeInfo[i].isEdit === true) {
                message.warn('先取消其他行的编辑状态!');
                return;
            }
            if (noticeInfo[i].nid === nid) {
                editLine = i;
            }

        }
        noticeInfo[editLine].isEdit = true;
        this.setState({
            noticeInfo,
            changeContent: noticeInfo[editLine].content,
            changeTitle: noticeInfo[editLine].title
        })
    }

    handleSave(nid) {
        const { noticeInfo, changeTitle, changeContent } = this.state;
        for (let i = 0; i < noticeInfo.length; i++) {
            if (noticeInfo[i].nid === nid) {
                if (noticeInfo[i].title === changeTitle && noticeInfo[i].content === changeContent) {
                    message.success('没有修改');
                    noticeInfo[i].isEdit = false;
                    this.setState({
                        noticeInfo
                    })
                } else {
                    ajax({
                        method: 'put',
                        url: Url.modifyNotice,
                        data: {
                            nid: noticeInfo[i].nid,
                            title: changeTitle,
                            content: changeContent,
                        },
                        cb: (res) => {
                            message.success('修改成功');
                            this.getNoticeInfo();
                        }
                    })
                }
                break;

            }
        }


    }


    handleTitle(e) {
        this.setState({
            changeTitle: e.target.value
        })
    }

    handleContent(e) {
        this.setState({
            changeContent: e.target.value
        })
    }


    render() {
        const { noticeInfo, changeTitle, changeContent } = this.state;
        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => {
                return (
                    record.isEdit ? <Input value={changeTitle} onChange={(e) => this.handleTitle(e)} /> : <span>{text}</span>
                )
            }
        }, {
            title: '发送者',
            dataIndex: 'fromer',
            key: 'fromer'
        }, {
            title: '接收者',
            dataIndex: 'toer',
            key: 'toer'
        }, {
            title: '发布时间',
            dataIndex: 'ntime',
            key: 'ntime',
            render: (text) => {
                return (
                    <span>{timeFormat(text)}</span>
                )
            }
        }, {
            title: '内容',
            dataIndex: 'content',
            key: 'content',
            render: (text, record) => {
                return (
                    record.isEdit ? <Input value={changeContent} onChange={(e) => this.handleContent(e)} /> : <span>{text}</span>
                )
            }
        }, {
            title: '是否阅读',
            dataIndex: 'isread',
            key: 'isread',
            render: (text) => {
                switch (text.toString()) {
                    case '1':
                        return <span>已读</span>
                    case '2':
                        return <span>未读</span>
                    default:
                        return <span></span>
                }
            }
        }, {
            title: '操作',
            render: (text, record) => {
                return (
                    <div>
                        {record.isEdit ?
                            <a><Icon type="save" onClick={() => this.handleSave(record.nid)} /></a>
                            :
                            <a><Icon type="edit" onClick={() => this.handleEdit(record.nid)} /></a>}
                        <Divider type="vertical" />
                        <a onClick={this.handleDelete.bind(this, record.nid)}>
                            <Icon type="delete" />
                        </a>
                    </div>
                )
            }
        }]

        return (
            <div>
                <NoticeForm
                    getData={this.getNoticeInfo.bind(this)}
                />
                <Table columns={columns} dataSource={noticeInfo}></Table>
            </div>

        )
    }
}