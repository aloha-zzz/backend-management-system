import * as React from 'react';
import { Row, Col } from 'antd';
import { timeFormat } from './../utilIndex'


export default class userDetail extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { info } = this.props;
        console.log(info)
        return (
            <div className="detail">
                <h2>详细信息</h2>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>用户名：</Col>
                    <Col offset={1} span={15}>{info.usr}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>电话：</Col>
                    <Col offset={1} span={15}>{info.phone}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>邮箱：</Col>
                    <Col offset={1} span={15}>{info.mail}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>qq：</Col>
                    <Col offset={1} span={15}>{info.qq}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>注册时间：</Col>
                    <Col offset={1} span={15}>{timeFormat(info.regtime)}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>注册ip：</Col>
                    <Col offset={1} span={15}>{info.regip}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>最近一次登陆时间：</Col>
                    <Col offset={1} span={15}>{timeFormat(info.lasttime)}</Col>
                </Row>
                <Row>
                    <Col span={8} style={{ textAlign: 'right' }}>最近一次登陆ip：</Col>
                    <Col offset={1} span={15}>{info.lastip}</Col>
                </Row>
            </div>
        )
    }
}