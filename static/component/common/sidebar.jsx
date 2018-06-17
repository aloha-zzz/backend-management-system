import { Menu, Breadcrumb, Icon } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import Dep from '../../util/event'
const SubMenu = Menu.SubMenu;

require('../../css/frame.css')


export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: ''
        }
    }
    componentDidMount() {
        Dep.addListener('name', (name) => {
            this.setState({ user: name })
        })
    }

    render() {
        return (
            <aside className="ant-layout-sider">
                <div className="ant-layout-logo"><b style={{ color: 'white', fontSize: '20px' }}>{this.state.user === '' ? <Link to="/" >请登录</Link> : <Link to="/" >hello,{this.state.user}</Link>}</b></div>
                <Menu mode="inline" theme="dark"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}>
                    <SubMenu key="sub1" title={<span><Icon type="user" />用户管理</span>}>
                        <Menu.Item key="1"><Link to="/index" >登陆信息</Link></Menu.Item>
                        <Menu.Item key="2"><Link to="/userInfo" >用户信息</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="folder" />文件管理</span>}>
                        <Menu.Item key="3"><Link to="/fileInfo" >文件信息</Link></Menu.Item>

                    </SubMenu>

                    <SubMenu key="sub3" title={<span><Icon type="notification" />信息管理</span>}>
                        <Menu.Item key="5"><Link to="/Activity" >动态管理</Link></Menu.Item>
                        <Menu.Item key="6"><Link to="/notice" >站内通知</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" title={<span><Icon type="solution" />权限管理</span>}>
                        <Menu.Item key="7"><Link to="/character" >角色管理</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub5" title={<span><Icon type="profile" />日志管理</span>}>
                        <Menu.Item key="9"><Link to="/logs" >登录日志</Link></Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub6" title={<span><Icon type="tool" />系统管理</span>}>
                        <Menu.Item key="13"><Link to="/course" >课程管理</Link></Menu.Item>
                        <Menu.Item key="14"><Link to="/Analysis" >用户行为分析</Link></Menu.Item>
                    </SubMenu>
                </Menu>
            </aside>
        )
    }
}