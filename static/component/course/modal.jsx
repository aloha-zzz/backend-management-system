import React from 'react';
import { Form, Input, Button, Modal, Select, message } from 'antd';
import { ajax, Url } from './../utilIndex'
const FormItem = Form.Item;
const Option = Select.Option;

class AddModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            majorList: []
        }
    }

    click() {
        this.setState({
            visible: true
        })
    }

    componentDidMount() {
        ajax({
            url: Url.getMajor,
            cb: (res) => {
                const { data: { code, data } } = res;
                console.log(data);
                this.setState({
                    majorList: data
                })
            }
        })
    }

    handleOk() {
        const { validateFields } = this.props.form;
        validateFields((err, value) => {
            if (!err) {
                console.log(value)
                ajax({
                    method: 'post',
                    url: Url.addCourse,
                    data: value,
                    cb: (res) => {
                        message.success('修改成功')
                        this.setState({
                            visible: false
                        })
                        this.props.onRefresh(2);
                        this.props.form.resetFields();
                    }
                })
            }
        })
    }

    checkCredit(rules, value, callback) {
        const numReg = /^[0-9]+$/;
        if (value && !numReg.test(value)) {
            callback('输入必须要是数字')
        }
        callback();
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        const { getFieldDecorator } = this.props.form;
        const { visible, majorList } = this.state;


        const child = majorList.map((item, index) => <Option key={index} value={item.mname}>{item.mname}</Option>)
        return (
            <div style={{ display: 'inline-block' }}>
                <Button onClick={() => this.click()} type="primary">添加课程</Button>

                <Modal
                    title="添加新课程"
                    onCancel={() => this.setState({ visible: false })}
                    onOk={() => this.handleOk()}
                    visible={visible}
                >
                    <Form>

                        <FormItem   {...formItemLayout}
                            label="对应专业"
                            hasFeedback
                        >
                            {getFieldDecorator('major', {
                                rules: [{
                                    required: true, message: '请选择课程对应的专业'
                                }]
                            })(
                                <Select
                                    mode='multiple'
                                >
                                    {child}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem   {...formItemLayout}
                            label="课程名称"
                            hasFeedback
                        >
                            {getFieldDecorator('title', {
                                rules: [{
                                    required: true, message: '课程名称不能为空'
                                }]
                            })(
                                <Input></Input>
                            )}
                        </FormItem>
                        <FormItem   {...formItemLayout}
                            label="学分"
                            hasFeedback
                        >
                            {getFieldDecorator('credit', {
                                rules: [{
                                    required: true, message: '学分不能为空'
                                }, {
                                    validator: this.checkCredit.bind(this)
                                }]
                            })(
                                <Input></Input>
                            )}
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        )
    }
}
AddModal = Form.create()(AddModal)
export default AddModal