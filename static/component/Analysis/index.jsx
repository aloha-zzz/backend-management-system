import React from 'react';
import { ajax, Url } from './../utilIndex';
import createG2 from 'g2-react';
import { Stat } from 'g2';

import { Select } from 'antd';
const Option = Select.Option;


export default class Analysis extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            userData: [],
            width: 500,
            height: 450,
            userList: []
        }
    }

    componentDidMount() {
        this.getUserTime('');
        this.getAllUserTime();
        this.getUserHasTime();
    }


    getUserTime(userName) {
        ajax({
            url: Url.getUserTime,
            params: { userName },
            cb: (res) => {
                const { data: { code, data } } = res;
                let userData = this.transferDataStruct(data)
                this.setState({
                    userData
                })
            }
        })
    }

    transferDataStruct(arr) {
        let data = arr[0];
        let ans = [
            { name: '发布动态', value: data['activityTime'] },
            { name: '角色管理', value: data['authTime'] },
            { name: '文件信息', value: data['fileInfoTime'] },
            { name: '站内通知', value: data['noticeTime'] },
            { name: '用户信息', value: data['userInfoTime'] }
        ]
        return ans;
    }


    getAllUserTime() {
        ajax({
            url: Url.getAllUserTime,
            cb: (res) => {
                const { data: { code, data } } = res;
                let allData = this.transferDataStruct(data);
                this.setState({
                    allData
                })
            }
        })
    }

    getUserHasTime() {
        ajax({
            url: Url.getUserHasTime,
            cb: (res) => {
                const { data: { code, data } } = res;
                this.setState({
                    userList: data
                })
            }
        })
    }
    handleChange(val) {
        this.getUserTime(val)

    }


    render() {
        const { userData, allData, userList, width, height } = this.state;
        console.log(userList)
        const Pie = createG2(chart => {
            chart.coord('theta', {
                radius: 0.8
            });
            chart.legend('name', {
                position: 'bottom',
                itemWrap: true,
                formatter: function (val) {
                    for (var i = 0, len = userData.length; i < len; i++) {
                        var obj = userData[i];
                        if (obj.name === val) {
                            return val + ': ' + obj.value ;
                        }
                    }
                }
            });
            chart.tooltip({
                title: null,
                map: {
                    value: 'value'
                }
            });
            chart.intervalStack()
                .position(Stat.summary.percent('value'))
                .color('name')
                .label('name*..percent', function (name, percent) {
                    percent = (percent * 100).toFixed(2) + '%';
                    return name + ' ' + percent;
                });
            chart.render();
        });

        const AllPie = createG2(chart => {
            chart.coord('theta', {
                radius: 0.8
            });
            chart.legend('name', {
                position: 'bottom',
                itemWrap: true,
                formatter: function (val) {
                    for (var i = 0, len = allData.length; i < len; i++) {
                        var obj = allData[i];
                        if (obj.name === val) {
                            return val + ': ' + obj.value;
                        }
                    }
                }
            });
            chart.tooltip({
                title: null,
                map: {
                    value: 'value'
                }
            });
            chart.intervalStack()
                .position(Stat.summary.percent('value'))
                .color('name')
                .label('name*..percent', function (name, percent) {
                    percent = (percent * 100).toFixed(2) + '%';
                    return name + ' ' + percent;
                });
            chart.render();
        });


        return (
            <div>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="用户列表"
                    optionFilterProp="children"
                    onChange={(e) => this.handleChange(e)}
                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) > -1}
                >

                    {userList.map((item, index) => {
                        return (
                            <Option key={index} value={item.usr}>{item.usr}</Option>
                        )
                    })}

                </Select>
                <div style={{ width: '1001px', margin: '0 auto' }}>
                    <div style={{ display: 'inline-block' }}>
                        <h2>用户观看行为记录</h2>
                        <Pie
                            data={userData}
                            width={width}
                            height={height}
                        />
                    </div>
                    <div style={{ display: 'inline-block' }}>
                        <h2>所有用户观看行为记录</h2>
                        <AllPie
                            style={{ display: 'inline-block' }}
                            data={allData}
                            width={width}
                            height={height}
                        >
                        </AllPie>
                    </div>
                </div>
            </div>
        )
    }
}