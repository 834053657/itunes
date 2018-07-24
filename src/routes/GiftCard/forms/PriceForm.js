import React, { Component, Fragment } from 'react';
import { Form, Button } from 'antd';
import InputNumber from 'components/InputNumber';
import styles from './PriceForm.less';

const FormItem = Form.Item;

@Form.create()
export default class PriceForm extends Component {
  state = {};

  handleCancel = () => {
    this.props.form.resetFields();
    this.props.onCancel && this.props.onCancel();
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.onSubmit && this.props.onSubmit(values.price);
        this.props.form.resetFields();
      }
    });
  };

  // checkCount = (rule, value, callback) => {
  //   const { multiple = 0} = this.props;
  //   if (value && value%multiple !== 0) {
  //     callback(`数量必须是${multiple}的倍数`);
  //   }else {
  //     callback();
  //   }
  // };

  render() {
    const { form: { getFieldDecorator, resetForm, getFieldsError }, min, max } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem extra={`可添加面额 ${min} - ${max}`}>
          {getFieldDecorator('price', {
            rules: [
              {
                required: true,
                message: '请输入面额！',
              },
              {
                type: 'number',
                min,
                max,
                message: `可添加面额为${min} ~ ${max}`,
              },
              // {
              //   validator: this.checkCount,
              // },
            ],
          })(<InputNumber precision={0} style={{ width: 200 }} placeholder="请输入面额" />)}
        </FormItem>

        <FormItem className={styles.buttonBox}>
          <Button key="back" onClick={this.handleCancel}>
            取消
          </Button>
          <Button
            // loading={submitting}
            style={{ marginLeft: 15 }}
            type="primary"
            htmlType="submit"
          >
            添加
          </Button>
        </FormItem>
      </Form>
    );
  }
}
