import React, { Component, Fragment } from 'react';
import { filter, last } from 'lodash';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  Card,
  Form,
  InputNumber,
  Row,
  Col,
  Popconfirm,
} from 'antd';
import styles from './FilterDemoinForm.less';
import SellForm from './SellForm';
import PicUpload from '../../../components/UploadQiNiu/index';

const InputGroup = Input.Group;
const FormItem = Form.Item;

export default class OnlyPassWord extends Component {
  state = {};

  checkMin = (rule, value, callback) => {
    const { form } = this.props;
    const max = form.getFieldValue('max');
    if (value && max && value > max) {
      callback('查询条件不正确!');
    } else {
      if (max) {
        // form.validateFields(['max'], { force: true });
      }
      callback();
    }
  };

  checkMax = (rule, value, callback) => {
    const { form } = this.props;
    const min = form.getFieldValue('min');
    if (value && min && value < min) {
      callback('查询条件不正确!');
    } else {
      if (min) {
        form.validateFields(['min'], { force: true });
      }
      callback();
    }
  };

  handleDelete = id => {
    const items = this.props.form.getFieldValue('items[]');
    const newItems = filter(items, i => i.id !== id);
    //console.log(newItems, items);
    this.props.form.setFieldsValue({
      'items[]': newItems,
    });
  };

  handleAdd = (c, i) => {
    this.props.addMoney(i);
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue, resetForm },
      psw,
      action,
      sendCard,
    } = this.props;

    const formItemLayoutBtn = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };
    const cards = this.props.defaultValue;
    //console.log(cards);
    const cardItems = cards.map((c, index) => {
      console.log(c);
      return (
        <Card
          style={{ marginTop: '10px' }}
          key={c.money}
          title={
            <div>
              <span>{c.money}面额</span>
              <span>({c.items.length})</span>
              {sendCard
                ? null
                : ((psw === 1 && !action) || action === 'edit') && (
                <Button onClick={() => this.props.intoData(index)} style={{ float: 'right' }}>
                      导入
                </Button>
                  )}
              {sendCard
                ? null
                : (!action || action === 'edit') && (
                <div style={{ float: 'right' }}>
                  <Popconfirm
                    title="确定删除吗？"
                    onConfirm={() => this.props.deleteCard(index)}
                    okText="是"
                    cancelText="否"
                  >
                    <Icon className={styles.deleteIcon} type="minus-circle-o" />
                  </Popconfirm>
                </div>
                  )}
            </div>
          }
          className={styles.card}
        >
          {c.items.map((card, littleIndex) => {
            return (
              <div key={littleIndex + 'littleIndex'} className={styles.itemLine}>
                {//密码
                (psw === 1 || psw === 3) && (
                  <FormItem required={false}>
                    {getFieldDecorator(`cards[${index}].items[${littleIndex}].password`, {
                      initialValue: action ? card.password : '',
                      validateTrigger: ['onBlur'],
                      rules: [
                        {
                          required: true,
                          message: '请输入面额',
                        },
                        {
                          min: 4,
                          message: '最小长度不得小于4位',
                        },
                        {
                          max: 50,
                          message: '最大长度不得超过50位',
                        },
                      ],
                    })(
                      <Row>
                        <Col style={{ width: '6%', float: 'left' }}>卡密:</Col>
                        <Col style={{ width: '85%', float: 'left' }}>
                          <Input
                            onChange={e => this.props.changePsw(e, index, littleIndex)}
                            defaultValue={action ? card.password : ''}
                            placeholder="请输入卡密"
                            disabled={
                              (action && action !== 'edit') || (card.status && card.status !== 0)
                            }
                          />
                        </Col>
                        {sendCard
                          ? null
                          : (!action || action === 'edit') && (
                          <Popconfirm
                            title="确定删除吗？"
                            onConfirm={() => this.props.confirm(index, littleIndex)}
                            okText="是"
                            cancelText="否"
                          >
                            <Icon className={styles.deleteIcon} type="minus-circle-o" />
                          </Popconfirm>
                            )}
                      </Row>
                    )}
                  </FormItem>
                )}

                {//图片
                (psw === 2 || psw === 3) && (
                  <FormItem required={false}>
                    {getFieldDecorator(`cards[${index}].items[${littleIndex}].picture`, {
                      initialValue: action ? card.picture : '',
                      //validateTrigger: ['onChange', 'onBlur'],
                      rules: [
                        {
                          required: true,
                          message: '请上传卡图',
                        },
                      ],
                    })(
                      <Row>
                        <Col style={{ width: '6%', float: 'left' }}>卡图:</Col>
                        <Col style={{ width: '85%', float: 'left' }}>
                          <PicUpload
                            onChange={e => this.props.changePic(e, index, littleIndex)}
                            value={card.picture}
                            disabled={action && action !== 'edit'}
                          />
                        </Col>
                        {psw === 2 &&
                          (!action || action === 'edit') && (
                            <Popconfirm
                              title="确定删除吗？"
                              onConfirm={() => this.props.confirm(index, littleIndex)}
                              okText="是"
                              cancelText="否"
                            >
                              <Icon className={styles.deleteIcon} type="minus-circle-o" />
                            </Popconfirm>
                          )}
                      </Row>
                    )}
                  </FormItem>
                )}
              </div>
            );
          })}

          {//凭证
          (psw === 2 || psw === 3) && (
            <FormItem required={false}>
              {getFieldDecorator(`cards[${index}].receipt`, {
                initialValue: action ? c.receipt : '',
                //validateTrigger: ['onChange', 'onBlur'],
                rules: [
                  {
                    required: false,
                    message: '请上传凭证',
                  },
                ],
              })(
                <Row>
                  <Col style={{ width: '6%', float: 'left' }}>凭证:</Col>
                  <Col style={{ width: '85%', float: 'left' }}>
                    <PicUpload
                      onChange={e => this.props.changePZ(e, index)}
                      value={c.receipt}
                      disabled={action && action !== 'edit'}
                    />
                  </Col>
                </Row>
              )}
            </FormItem>
          )}

          {sendCard ? null : (
            <FormItem {...formItemLayoutBtn}>
              <Button
                type="dashed"
                onClick={() => this.handleAdd(c, index)}
                style={{ width: '60%' }}
                disabled={action && action !== 'edit'}
              >
                <Icon type="plus" /> 添加卡密
              </Button>
            </FormItem>
          )}
        </Card>
      );
    });

    return <div>{cardItems}</div>;
  }
}
