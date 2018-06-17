import React from 'react'
import {
    Menu, Breadcrumb, Icon, Select, Row,
    Col, Button, Table, Tabs, Input, message, Modal, Form
} from 'antd';

const FormItem = Form.Item;
import { ajax, Url, collectRecord } from './../utilIndex'
const TabPane = Tabs.TabPane;
const Search = Input.Search;


class Character extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            showUser: [],
            user: [],
            manager: [],
            input: '',
            visible: false,
            uid: 0,
        }
    }

    getUserInfo() {
        ajax({
            url: Url.getAuthUserInfo,
            cb: (res) => {
                const { data: { code, data } } = res;
                console.log(data)
                let user = [];
                let manager = [];
                data.map(item => {
                    if (item.auth === 0) {
                        user.push(item)
                    } else {
                        manager.push(item)
                    }
                })
                this.setState({
                    user,
                    manager,
                    showUser: user
                })
            }
        })
    }


    componentDidMount() {
        this.getUserInfo();
        this.recordTime = 0
        this.interval = setInterval(() => this.recordTime += 1, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        collectRecord(this.recordTime, 'auth')
    }


    handleOk() {
        const { validateFields } = this.props.form;

        validateFields((err, value) => {
            if (!err) {
                console.log(value);
                ajax({
                    url: Url.verifyLogin,
                    method: 'post',
                    data: {
                        password: value.password
                    },
                    cb: (res) => {
                        this.addAuth();
                        this.setState({
                            visible: false
                        })
                    }
                })
            }
        })
    }

    tabChange(e) {
        console.log(e)
        this.setState({
            index: e
        })
    }

    handleChange(e) {
        const { user, showUser } = this.state;

        let input = e.target.value;
        let showUserArr = [];
        user.map(item => {
            if (item.usr.toLowerCase().indexOf(input.toLowerCase()) > -1 || item.mail.toLowerCase().indexOf(input.toLowerCase()) > -1) {
                showUserArr.push(item);
            }
        })


        this.setState({
            input: e.target.value,
            showUser: showUserArr
        })
    }



    addAuth() {
        const { uid } = this.state;
        ajax({
            method: 'put',
            data: { uid },
            url: Url.changeAuth,
            cb: (res) => {
                const { data: { code, data } } = res;
                message.success(data);
                this.getUserInfo();
                this.setState({
                    index: 1
                })
            }
        })
    }

    handleAdd(uid) {
        const { resetFields } = this.props.form;
        resetFields()
        this.setState({
            visible: true,
            uid
        });
    }


    render() {
        const { index, user, manager, showUser, input, visible } = this.state;


        const { getFieldDecorator } = this.props.form;
        const colunms = [{
            title: '用户名',
            dataIndex: 'usr',
            key: 'usr',
        }, {
            title: '邮箱',
            dataIndex: 'mail',
            key: 'mail',
        }, {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        }, {
            title: 'qq',
            dataIndex: 'qq',
            key: 'qq',
        }, {
            title: '学院',
            dataIndex: 'xname',
            key: 'xname',
        }]

        let userColumn = colunms.concat({
            title: '操作',
            render: (text, record) => {
                let uid = record.uid
                return (
                    <a onClick={() => this.handleAdd(uid)}>
                        <Icon type="user-add" style={{ color: "#108ee9", transform: "scale(1.5)" }} />
                    </a>

                )
            }
        })

        let managerColumn = colunms.concat({
            title: '身份',
            render: () => {
                return (
                    <span>管理员</span>
                )
            }
        })


        return (
            <div>
                <Search
                    style={{
                        display: Number(index) === 0 ? 'block' : 'none',
                        width: 200
                    }}
                    placeholder="输入用户名/邮箱搜索"
                    onChange={(e) => this.handleChange(e)}
                    value={input}
                />
                <Modal
                    visible={visible}
                    onOk={() => this.handleOk()}
                    onCancel={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                >
                    <Form>
                        <FormItem label='请再次输入登陆密码'>
                            {getFieldDecorator('password', {
                                rules: [{
                                    required: true, message: '登陆密码不能为空'
                                }]
                            })(
                                <Input type='password' placeholder='请再次输入密码确认' />
                            )}
                        </FormItem>
                    </Form>
                </Modal>
                <Tabs activeKey={index.toString()} onChange={this.tabChange.bind(this)}>
                    <TabPane tab="用户" key="0">
                        <Table
                            columns={userColumn}
                            dataSource={showUser}
                            rowKey='uid'
                        >
                        </Table>
                    </TabPane>
                    <TabPane tab="管理员" key="1">
                        <Table
                            columns={managerColumn}
                            dataSource={manager}
                            rowKey='uid'
                        >
                        </Table>
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}


Character = Form.create()(Character)
export default Character