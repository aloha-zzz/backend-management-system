import React from 'react';
import { Button, Modal, Select, Table, Icon, Divider, Input, message } from 'antd';
import { ajax, Url, addKey } from './../utilIndex'
import AddModal from './modal'
const Option = Select.Option;

export default class Course extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			courseInfo: [],
			showInfo: [],
			selectOne: ['所有学院'],
			selectTwo: { '所有学院': ['所有专业'] },
			selectedOne: '所有学院',
			selectedTwo: '所有专业',
			TwoList: ['所有专业'],
			isEdit: false,
			inputClassName: '',
			inputCredit: '',
		}
	}


	click() {
		this.setState({
			visible: true
		})
	}

	handleOk() {
		this.setState({
			visible: false
		})
	}

	handleCancel() {
		this.setState({
			visible: false
		})
	}

	handleSave(id) {
		const { showInfo, inputClassName, inputCredit } = this.state;
		const numReg = /^[0-9]+$/;

		if (!numReg.test(inputCredit)) {
			message.warn('学分只允许为数字');
			return;
		}
		showInfo.map(item => {
			if (item.cid === id) {
				if (inputClassName === item.cname && inputCredit === item.credit) {
					message.success('没有修改');
					item.isEdit = false;
					this.setState({
						showInfo,
						isEdit: false
					});
					return;
				} else {
					item.isEdit = false;
					item.credit = Number(inputCredit);
					item.cname = inputClassName;
					ajax({
						method: 'put',
						url: Url.modifyCourse,
						data: { cid: item.cid, cname: item.cname, credit: item.credit },
						cb: (res) => {
							message.success('修改成功');
							this.setState({
								isEdit: false,
								showInfo,
							})
						}
					})
					return;
				}
			}
		})
	}

	handleInput(e, type) {
		if (type === 'className') {
			this.setState({ inputClassName: e.target.value })
		}
		if (type === 'credit') {
			this.setState({ inputCredit: e.target.value })
		}
	}

	handleEdit(id) {
		const { showInfo, isEdit } = this.state;
		if (isEdit) {
			message.warn('有其他行正在编辑');
			return;
		}
		let inputClassName = '';
		let inputCredit = '';
		showInfo.map(item => {
			if (item.cid === id) {
				item.isEdit = true;
				inputCredit = item.credit;
				inputClassName = item.cname;
				return;
			}
		})
		this.setState({
			showInfo,
			inputCredit,
			inputClassName
		})
	}

	handleDelete(id) {
		ajax({
			method: 'delete',
			url: Url.deleteCourse,
			data: { cid: id },
			cb: (res) => {
				message.success('删除成功');
				this.getCourseList()
			}
		})
	}

	getCourseList(time) {
		const { selectOne, selectTwo, TwoList, selectedTwo } = this.state;

		ajax({
			url: Url.getCourse,
			cb: (res) => {
				const { data: { code, data } } = res;
				addKey(data);
				if (time) {
					data.map(item => {                  // xname 学院 mname 专业
						if (selectOne.indexOf(item.xname) > -1) {  // 如果存在selectOne内
							if (selectTwo[item.xname].indexOf(item.mname) < 0) {
								selectTwo[item.xname].push(item.mname);
							}
						} else {
							selectOne.push(item.xname);
							selectTwo[item.xname] = ['所有专业', item.mname];
						}

						// 添加所有学院列表
						if (selectTwo['所有学院'].indexOf(item.mname) < 0) {
							selectTwo['所有学院'].push(item.mname)
						}
					});
					let Arr = [];
					if (TwoList.indexOf('所有专业') > -1) {
						Arr = selectTwo[selectOne[0]]
					} else {
						Arr = ['所有专业'].concat(...selectTwo[selectOne[0]])
					}
					this.setState({
						selectOne,
						selectTwo,
						TwoList: Arr
					})
				}
				if (time === 2) {
					if (selectedTwo === '所有专业') {
						this.setState({
							scourseInfo: data,
							showInfo: data,
						})
						return;
					} else {
						let showInfoArr = [];
						data.map(item => {
							if (item.mname === selectedTwo) {
								showInfoArr.push(item)
							}
						});
						this.setState({
							courseInfo: data,
							showInfo: showInfoArr
						})
						return;
					}
				}

				this.setState({
					courseInfo: data,
					showInfo: data,
				})
			}
		})
	}

	componentDidMount() {
		this.getCourseList(1);
	}

	handleSelectOne(val) {
		const { selectTwo, TwoList } = this.state;
		this.setState({
			selectedOne: val,
			TwoList: selectTwo[val],
		})
	}
	handleSelectTwo(val) {
		const { selectTwo, courseInfo, showInfo } = this.state;

		if (val === '所有专业') {
			this.setState({
				showInfo: courseInfo,
				selectedTwo: val,
			})
			return;
		}
		let showInfoArr = [];
		courseInfo.map(item => {
			if (item.mname === val) {
				showInfoArr.push(item)
			}
		})
		this.setState({
			selectedTwo: val,
			showInfo: showInfoArr,
		})
	}
	render() {
		const { selectTwo, showInfo, selectOne, selectedTwo, selectedOne, TwoList, inputClassName, inputCredit } = this.state
		console.log(selectTwo)
		const columns = [{
			title: '学院',
			dataIndex: 'xname',
			key: 'xname',
		}, {
			title: '专业',
			dataIndex: 'mname',
			key: 'fromer'
		}, {
			title: '课程名称',
			dataIndex: 'cname',
			key: 'cname',
			render: (text, record) => {
				return (
					<div>
						{record.isEdit ?
							<Input defaultValue={text} value={inputClassName} onChange={(e) => this.handleInput(e, 'className')}></Input> :
							<span>{text}</span>}
					</div>
				)
			}
		}, {
			title: '学分',
			dataIndex: 'credit',
			key: 'credit',
			render: (text, record) => {
				return (
					<div>
						{
							record.isEdit ?
								<Input defaultValue={text} value={inputCredit} onChange={(e) => this.handleInput(e, 'credit')}></Input> :
								<span>{text}</span>
						}
					</div>
				)
			}
		}, {
			title: '操作',
			render: (text, record) => {
				return (
					<div>
						{record.isEdit ?
							<a><Icon type="save" onClick={() => this.handleSave(record.cid)} /></a>
							:
							<a><Icon type="edit" onClick={() => this.handleEdit(record.cid)} /></a>}
						<Divider type="vertical" />
						<a onClick={this.handleDelete.bind(this, record.cid)}>
							<Icon type="delete" />
						</a>
					</div>
				)
			}
		}]

		const one = selectOne.map((item, index) => <Option value={item} key={index}>{item}</Option>);
		const two = TwoList.map((item, index) => <Option value={item} key={index}>{item}</Option>)

		return (<div>
			<Select value={selectedOne} style={{ width: 150 }} onChange={(e) => this.handleSelectOne(e)}>
				{one}
			</Select>
			<Select value={selectedTwo} style={{ width: 150, marginRight: 30 }} onChange={(e) => this.handleSelectTwo(e)}>
				{two}
			</Select>
			<AddModal
				onRefresh={(e) => this.getCourseList(e)}
			></AddModal>
			<Table
				dataSource={showInfo}
				columns={columns}
			>
			</Table>
		</div>)
	}
}