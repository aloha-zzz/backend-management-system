import React from 'react';
import UserTable from './userTable';
import { Button, Modal } from 'antd';
import { collectRecord } from './../utilIndex';


export default class UserInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false
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


    componentDidMount() {
        this.recordTime = 0
        this.interval = setInterval(() => this.recordTime += 1, 1000)
    }
    handleSubmit(){
        let d =this.child.handleSearch();
        this.setState({
            data:d
        })
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        collectRecord(this.recordTime, 'userInfo')
    }


    render() {
        return (
            <div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    width='60%'
                    onOk={() => this.handleOk()} onCancel={() => this.handleCancel()}
                    footer={[
                        <Button key="back" onClick={() => this.handleOk()}>返回</Button>,
                        <Button key="submit" type="primary" >
                            提交搜索
                    </Button>,
                    ]}
                />
                <UserTable />
            </div>
        )
    }
}