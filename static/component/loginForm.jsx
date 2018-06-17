import { Form, Icon, Input, Button, message, List } from 'antd';
import React from 'react';
import axios from 'axios'
import { ajax, Dep, timeFormat, Url } from './utilIndex';
const FormItem = Form.Item;

class LoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false,
            info: [{ '本次登录时间': 1 }, { '本次登录ip': 2 }, { '上次登录时间': 3 }, { '上次登录ip': 4 }],
        }
    }

    componentDidMount() {
        console.log(this);
        ajax({
            method: 'post',
            url: Url.isLogin,
            data: { time: timeFormat() },
            cb: (res) => {
                const { data: { code, data, user, ip, lastIp, time, lastTime } } = res;
                if (data !== 'no login session') {
                    this.setState({
                        isLogin: true,
                        info: [{ '本次登录时间': time }, { '本次登录ip': ip }, { '上次登录时间': timeFormat(lastTime) }, { '上次登录ip': lastIp }],
                    }, () => {
                        Dep.emit('name', user);
                        sessionStorage.setItem('user', user)
                    })
                }

            }
        })

    }

    handleSubmit(e) { //login
        e.preventDefault();
        this.props.form.validateFields((err, value) => {
            if (!err) {
                axios({
                    method: 'post',
                    url: Url.login,
                    data: {
                        time: timeFormat(),
                        username: value.username,
                        password: value.password
                    },
                    withCredentials: true
                }).then(res => {
                    const { data: { code, data } } = res;
                    if (code === 0) {
                        this.setState({
                            isLogin: true,
                            info: [{ '本次登录时间': data.time }, { '本次登录ip': data.ip }, { '上次登录时间': timeFormat(data.lastTime) }, { '上次登录ip': data.lastIp }],
                        }, () => {
                            message.success(`${data.user}登陆成功`);
                            Dep.emit('name', data.user)
                            sessionStorage.setItem('user', data.user)
                        })
                        return;
                    } else if (code === -2) {
                        message.warn('用户名或密码错误');
                        return;
                    }
                    message.warn('服务内部错误');
                })
            }
        });
    }

    logout() {
        ajax({
            method: 'get',
            url: Url.logout,
            cb: (res) => {
                this.setState({
                    isLogin: false
                }, () => {
                    message.success('logout')
                    Dep.emit('name', '')
                    sessionStorage.removeItem('user');
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const { isLogin } = this.state;
        return (
            isLogin ?
                <div>
                    <Button style={{ marginBottom: '20px' }} onClick={() => this.logout()}>登出</Button>

                    <List
                        header={<div>登录信息</div>}
                        footer={<div>如果上次登录不是您本人，请立刻修改密码</div>}
                        bordered
                        dataSource={this.state.info}
                        renderItem={item => (<List.Item>{Object.keys(item)[0]}:{Object.values(item)[0]}</List.Item>)}
                    />
                </div>
                : <div>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="login-form" style={{ maxWidth: '300px', margin: '0 auto' }}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </div>
                        </FormItem>
                    </Form>
                </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(LoginForm);

export default WrappedNormalLoginForm;