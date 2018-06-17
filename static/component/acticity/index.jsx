import { Table, Icon, Divider, Select, Modal, Form, Input, Button, DatePicker, message } from 'antd';
const Option = Select.Option;
import React from 'react';
const FormItem = Form.Item;
const { TextArea } = Input;

import moment from 'moment'
import { ajax, Url, timeFormat, collectRecord } from './../utilIndex';
require('./index.css');

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            info: [],
            visible: false,
            picName: '',
            picInfo: '',
            isEdit: false,
            loading: false,
            changeId: -1
        }
    }


    getActivity() {
        this.setState({
            loading: true
        })
        ajax({
            url: Url.getActivity,
            cb: (res) => {
                const { data: { code, data } } = res;
                this.setState({
                    info: data,
                    loading: false
                })
            }
        })
    }


    checkContent(rule, value, callback) {
        const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if (!reg.test(value)) {
            callback('仅允许输入汉字、字母、数字和下划线');
            return;
        } else if (value && value.length > 140) {
            callback('文字内容多于140字');
            return;
        }
        callback()
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        collectRecord(this.recordTime, 'activity')
    }

    componentDidMount() {
        this.getActivity();
        this.recordTime = 0
        this.interval = setInterval(() => this.recordTime += 1, 1000)
    }


    changePic(e) {
        let _self = this;
        let imgData = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function () {
            _self.setState({
                picInfo: this.result
            })
        };
        reader.readAsDataURL(imgData);

        this.setState({
            picName: imgData.name
        })
    }

    showModal() {
        const { resetFields } = this.props.form;
        resetFields();
        this.setState({
            visible: true,
            picName: '',
            picInfo: ''
        })
    }

    handleOK() {
        const { picName, picInfo, info, isEdit, changeId } = this.state;
        if (picName === '' || picInfo === '') {
            message.warn('请添加图片');
            return;
        }
        this.props.form.validateFields((err, value) => {
            if (!err) {
                console.log(value)
                let data = {
                    title: value.title,
                    time: timeFormat(value.ntime),
                    content: value.content,
                    img: picInfo,
                    imgName: picName
                }

                if (isEdit) {
                    data.aid = this.state.changeId
                    ajax({
                        url: Url.modifyActivity,
                        method: 'put',
                        data,
                        cb: (res) => {
                            message.success('编辑成功');
                            this.setState({
                                visible: false,
                                isEdit: false
                            }, () => {
                                this.getActivity();
                            })
                        }
                    })
                } else {
                    ajax({
                        url: Url.addActivity,
                        method: 'post',
                        data,
                        cb: (res) => {
                            message.success('添加成功');
                            this.setState({
                                visible: false
                            }, () => {
                                this.getActivity();
                            })
                        }
                    })
                }

            }
        })
    }

    handleDelete(id) {
        console.log(id)
        ajax({
            method: 'delete',
            url: Url.deleteActivity,
            data: { id },
            cb: (res) => {
                message.success('删除成功');
                this.getActivity();
            }
        })
    }

    handleEdit(record) {
        this.setState({
            isEdit: true,
            visible: true,
            picName: record.imgName,
            picInfo: record.img,
            changeId: record.aid
        })
        this.props.form.setFieldsValue({
            title: record.title,
            ntime: moment(record.pubtime),
            content: record.descs
        })
    }

    render() {
        const { info, visible, picName, picInfo, loading, isEdit } = this.state;
        const { getFieldDecorator } = this.props.form;
        const dateFormat = 'YYYY-MM-DD';
        const today = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();

        const columns = [{
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        }, {
            title: '图片',
            dataIndex: 'img',
            key: 'img',
            render: (text) => {
                return (
                    <img style={{ width: '300px', height: '100px' }} src={text} />
                )
            }
        }, {
            title: '发布者',
            dataIndex: 'pubuser',
            key: 'pubuser',
        }, {
            title: '阅读量',
            dataIndex: 'scancnt',
            key: 'scancnt',
        }, {
            title: '发布时间',
            dataIndex: 'pubtime',
            key: 'pubtime',
            render: (text) => {
                return (
                    <span>{timeFormat(text)}</span>
                )
            }
        }, {
            title: '描述',
            dataIndex: 'descs',
            key: 'descs',
            render: (text) => {
                return (
                    <span>{text}</span>
                )
            }
        }, {
            title: '操作',
            key: 'action',
            render: (text, record) => (
                <span>
                    <a onClick={() => this.handleEdit(record)}><Icon type="edit" /></a>
                    <Divider type="vertical" />
                    <a onClick={() => this.handleDelete(record.aid)} className="ant-dropdown-link">
                        <Icon type="close-circle-o" />
                    </a>
                </span>
            ),
        }];

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }

        return (
            <div>
                <Modal
                    visible={visible}
                    title={isEdit ? '编辑动态' : '添加新动态'}
                    onCancel={() => { this.setState({ visible: false }) }}
                    onOk={() => this.handleOK()}
                >
                    <Form>
                        <FormItem
                            label="标题："
                            {...formItemLayout}
                            hasFeedback
                        >
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true, message: '标题不能为空'
                                }]
                            })(
                                <Input placeholder='请输入标题' />
                            )}
                        </FormItem>
                        <FormItem
                            label="发布时间"
                            {...formItemLayout}
                            hasFeedback
                        >
                            {getFieldDecorator('ntime', {
                                rules: [{
                                    required: true, message: "必须填写发布时间"
                                }],
                                initialValue: moment(today, dateFormat)
                            })(
                                <DatePicker dateFormat={dateFormat} />
                            )}
                        </FormItem>
                        <FormItem
                            label="动态描述"
                            {...formItemLayout}
                            hasFeedback
                        >
                            {getFieldDecorator('content', {
                                rules: [{
                                    required: true, message: "动态描述不能为空"
                                }, {
                                    validator: this.checkContent.bind(this)
                                }]
                            })(
                                <TextArea placeholder="动态描述最多为140字" autosize={{ minRows: 2, maxRows: 6 }} />
                            )}
                        </FormItem>
                        <div className='pic_outer'>
                            <input accept="image/png, image/jpeg, image/gif, image/jpg" onChange={(e) => this.changePic(e)} className="inputPic" type='file' />
                            <Button className='addbtn'><Icon type="plus" />选择图片</Button>
                            <span className="picName" >{picName || '未选取任何图片'}</span>
                            <img style={{ display: picInfo === '' ? 'none' : 'block' }} className="imgContent" src={picInfo || ''} ></img>
                        </div>
                    </Form>
                </Modal>
                <Button type='primary' onClick={() => this.showModal()}>添加新动态</Button>
                <Table loading={loading} rowKey='aid' columns={columns} dataSource={info} />
            </div>

        )
    }
}

Activity = Form.create()(Activity)
export default Activity