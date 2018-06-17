import { Menu, Breadcrumb, Icon } from 'antd'
import React from 'react'
import Sidebar from './common/sidebar'
import { Route, Redirect } from 'react-router-dom'
import Home from './loginForm';
import Notice from './info/notice';
import Activity from './acticity/index';
import FileInfo from './file/fileInfo'
import UserInfo from './user/userInfo';
import Logs from './logs/index';

import Course from './course/index'
import Character from './auth/character';
import Analysis from './Analysis/index'

const SubMenu = Menu.SubMenu;
require('../css/frame.css')

export default class Frame extends React.Component {
    render() {
        return (
            <div className="ant-layout-aside">
                < Sidebar />
                < div className="ant-layout-main">
                    < div className="ant-layout-header"></div>
                    < div className="ant-layout-container">
                        < div className="ant-layout-content">
                            < div >
                                < Route exact path='/' render={() => <Redirect to='/index'></Redirect>} />
                                < Route path='/index' component={Home} />
                                < Route path='/userInfo' component={UserInfo} />
                                < Route path='/fileInfo' component={FileInfo} />
                                < Route path='/notice' component={Notice} />
                                < Route path='/Activity' component={Activity} />
                                < Route path='/character' component={Character} />
                                < Route path='/logs' component={Logs} />
                                < Route path='/course' component={Course} />
                                < Route path='/Analysis' component={Analysis} />
                            </div >
                        </div>
                    </div >
                </div >
            </div>
        )
    }
}