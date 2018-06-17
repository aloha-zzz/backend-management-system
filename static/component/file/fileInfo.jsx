import React from 'react';
import { Button, Modal, Input } from 'antd';
import FileTable from './fileTable';

import { collectRecord } from './../utilIndex'

const Search = Input.Search;

export default class FileInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            input: ''
        }
    }
    click() {
        this.setState({
            visible: true
        })
    }
    handleChange(e) {
        this.setState({
            input: e.target.value
        })
    }

    componentDidMount() {
        this.recordTime = 0
        this.interval = setInterval(() => this.recordTime += 1, 1000)
    }
    submit(){
        let d = this.child.handleSearch()
        this.setState({data:d});
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        collectRecord(this.recordTime, 'fileInfo')
    }

    render() {
        const { input } = this.state;
        return (
            <div>
                <Search
                    style={{
                        width: 200
                    }}
                    placeholder="输入文件名搜索"
                    onChange={(e) => this.handleChange(e)}
                    value={input}
                />
                <FileTable
                    searchVal={input}
                />
            </div>

        )
    }
}