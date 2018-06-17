import { Table, Icon, Button, Divider, Select, Input, Modal, message } from 'antd';
const Option = Select.Option;
import React from 'react';
import UserDetail from './userDetail'
import { ajax, Url, addKey } from './../utilIndex';
require('./index.css')

export default class UserTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userInfo: [],
			visible: false,
			detailInfo: {}
		}
	}



	componentDidMount() {
		ajax({
			url: Url.getUserInfo,
			cb: (res) => {
				const { data: { code, data } } = res;
				addKey(data);
				this.setState({
					userInfo: data
				})
			}
		})
	}

	showDetail({ uid }) {
		console.log(uid);
		ajax({
			url: Url.getUserDetail,
			params: { uid },
			cb: (res) => {
				const { data: { code, data } } = res;
				console.log(data)
				this.setState({
					detailInfo: data[0],
					visible: true
				})
			}
		})
	}

	handleCancle() {
		this.setState({
			visible: false
		})
	}

	handleChange(val, uid) {
		ajax({
			method: 'post',
			url: Url.changeUserStatus,
			data: {
				status: val,
				uid,
			},
			cb: (res) => {
				message.success('修改成功');
			}
		})
	}

	render() {
		const columns = [{
			title: '用户id',
			dataIndex: 'uid',
			key: 'uid',
		}, {
			title: '用户名',
			dataIndex: 'usr',
			key: 'usr',
			render: (text) => {
				return (<span style={{ width: '50px' }} >{text}</span>)

			}
		}, {
			title: '学院',
			dataIndex: 'xname',
			key: 'xname',
			render: (text) => {
				return (<span style={{ width: '50px' }} >{text}</span>)
			}
		}, {
			title: '专业',
			dataIndex: 'mname',
			key: 'mname',
			render: (text) => {
				return (<span style={{ width: '50px' }} >{text}</span>)
			}
		}, {
			title: '上传资源数',
			dataIndex: 'upcnt',
			key: 'upcnt',
		}, {
			title: '下载资源数',
			dataIndex: 'dncnt',
			key: 'dncnt',
		}, {
			title: '用户状态',
			dataIndex: 'status',
			key: 'status',
			render: (text, record) => {
				//0 正常 ；1 封禁        
				return (<Select defaultValue={text.toString()} onChange={(val) => this.handleChange(val, record.uid)} style={{ width: 120 }} >
					<Option disabled value="0">邮箱未激活</Option>
					<Option value="1">正常</Option>
					<Option value="2">封禁</Option>
				</Select>)
			}
		}, {
			title: '详情',
			key: 'detail',
			render: (text, record) => (
				<a onClick={() => this.showDetail(record)}>详情</a>
			),
		}];

		const { userInfo, visible, detailInfo } = this.state

		return (
			<div>
				<Modal onCancel={() => this.handleCancle()} footer={[<Button type="info" key='confirm' onClick={() => this.handleCancle()}>确定</Button>]} visible={visible}>
					<UserDetail info={detailInfo}></UserDetail>
				</Modal>
				<Table columns={columns} dataSource={userInfo} pagination={{ pageSize: 10 }} />
			</div>

		)
	}
}