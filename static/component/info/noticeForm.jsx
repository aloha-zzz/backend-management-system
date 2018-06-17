import * as React from 'react';

import { Modal, message, Button, Form, Input, DatePicker, Icon, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const { TextArea } = Input;
import { ajax, Url, timeFormat } from './../utilIndex'
import moment from 'moment';
// import { ENOTEMPTY } from 'constants';

const Option = Select.Option;

class NoticeFrom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            selectUser: [],
            userName: [],
            input: '', // 接收者的信息
        }
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



    checkTitle(rule, value, callback) {
        const reg = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        const num = /[0-9]/;
        if (value === undefined) {
            callback();
            return;
        }
        if (!reg.test(value)) {
            callback('仅允许输入汉字、字母、数字和下划线');
            return;
        } else if (value && value[0] === '_' || num.test(value[0])) {
            callback('不允许以数字或下划线开头');
            return;
        }
        callback()
    }


    handleCancel() {
        this.setState({
            visible: false
        })
    }
    handleClick() {
        this.setState({
            visible: true
        })
    }

    handleClose(index) {
        const { userName, selectUser } = this.state;
        console.log(selectUser[index])
        for (let i = 0; i < userName.length; i++) {
            if (userName[i].usr === selectUser[index]) {
                userName[i].selected = false;
                break;
            }
        }
        selectUser.splice(index, 1);
        this.setState({
            userName,
            selectUser
        })
    }

    handleSelect(value) {
        console.log(`selected ${value}`);
        this.setState({
            input: value
        })
    }

    handleOk() {
        const { selectUser, userName } = this.state;
        if (selectUser.length === 0) {
            message.warn('请添加接受方');
            return;
        }
        if (sessionStorage.getItem('user') === undefined) {
            message.warn('请重新登陆');
            return;
        }
        let data = {};
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                console.log(values.ntime.format('YYYY-MM-DD HH:mm:ss'))
                data.time = values.ntime.format('YYYY-MM-DD HH:mm:ss');
                data.title = values.title;
                data.content = values.content;
                data.fromer = sessionStorage.getItem('user');
                data.toer = selectUser;
                ajax({
                    method: 'post',
                    url: Url.sendNotice,
                    data,
                    cb: (res) => {
                        message.success('发送成功');
                        this.setState({
                            visible: false
                        }, () => {
                            this.props.getData();
                            userName.map(item => {
                                item.selected = false;
                            })
                            this.props.form.resetFields();
                            this.setState({
                                userName,
                                selectUser: [],
                                input: ''
                            })
                        })
                    }
                })
            }
        });
    }

    addReceiver() {
        const { input, selectUser, userName } = this.state;
        if (input.length === 0) {
            message.warn('当前未选择用户');
            return;
        }
        for (let i = 0; i < userName.length; i++) {
            if (userName[i].usr === input) {
                userName[i].selected = true;
                break;
            }
        }

        selectUser.push(input);
        this.setState({
            input: '',
            selectUser,
            userName,
        })
    }

    componentDidMount() {
        this.getAllUserName();
    }

    getAllUserName() {
        ajax({
            url: Url.getUsername,
            cb: (res) => {
                const { data: { code, data } } = res;

                data.map(item => {
                    item.selected = false
                })
                this.setState({
                    userName: data
                })
            }
        })
    }

    render() {
        const { visible, userName, selectUser } = this.state
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
        }
        const { getFieldDecorator } = this.props.form;

        const dateFormat = 'YYYY-MM-DD';

        const today = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate();

        return (
            <div>
                <Button type="primary" onClick={this.handleClick.bind(this)}>发布通知</Button>
                <Modal
                    onCancel={() => this.handleCancel()}
                    onOk={() => this.handleOk()}
                    title={'发布通知'} visible={visible}
                    footer={[
                        <Button key="back" onClick={() => this.handleCancel}>取消</Button>,
                        <Button key="submit" type="primary" onClick={() => this.handleOk()}>
                            提交
                    </Button>,
                    ]}
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
                                }, {
                                    validator: this.checkTitle.bind(this)
                                }]
                            })(
                                <Input placeholder='请输入标题' />
                            )}
                        </FormItem>
                        <Row style={{
                            marginBottom: 18
                        }}>
                            <Col span={4}>
                                <label style={{ float: 'right', lineHeight: '32px' }}>接收方：</label>
                            </Col>
                            <Col span={16}>
                                <Select style={{ width: 150 }}
                                    showSearch
                                    placeholder='请选择用户名'
                                    onChange={this.handleSelect.bind(this)}
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) > -1}
                                    value={this.state.input}
                                >
                                    {
                                        userName.map((item, index) => {
                                            if (item.selected) {
                                                return;
                                            }
                                            return (
                                                <Option key={index} value={item.usr}>{item.usr}</Option>
                                            )
                                        })
                                    }
                                </Select>
                                <a
                                    style={{
                                        display: "inline-block",
                                        margin: "0 20px"
                                    }}
                                    onClick={this.addReceiver.bind(this)}
                                >
                                    <Icon type="plus-circle" style={{ color: "#108ee9", transform: "scale(1.5)" }} />
                                </a>
                            </Col>
                        </Row>
                        <Row style={{
                            marginBottom: 18
                        }}>
                            <Col span={4}>
                                <label style={{ float: 'right', lineHeight: '32px' }}>已选择：</label>
                            </Col>
                            {
                                selectUser.map((item, index) => {
                                    return (
                                        <Button style={{ marginRight: 10, marginBottom: 10 }} key={index}>
                                            {item}
                                            <a
                                                onClick={this.handleClose.bind(this, index)}
                                                style={{
                                                    position: 'relative',
                                                    left: '10px',
                                                    bottom: '8px'
                                                }}
                                            >×</a>
                                        </Button>
                                    )
                                })
                            }
                        </Row>
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
                            label="发布内容"
                            {...formItemLayout}
                            hasFeedback
                        >
                            {getFieldDecorator('content', {
                                rules: [{
                                    required: true, message: "发布内容不能为空"
                                }, {
                                    validator: this.checkContent.bind(this)
                                }]
                            })(
                                <TextArea placeholder="内容最多为140字" autosize={{ minRows: 2, maxRows: 6 }} />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}

NoticeFrom = Form.create({})(NoticeFrom)
export default NoticeFrom;