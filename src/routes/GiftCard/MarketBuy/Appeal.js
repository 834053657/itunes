import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Tabs, Button, Icon, Input, Steps, Avatar, Upload, Modal } from 'antd';
import { map } from 'lodash';
import moment from 'moment';
import styles from './appeal.less';
import StepModel from '../Step';
import UploadComponent from './Upload';

const TabPane = Tabs.TabPane;
const { TextArea } = Input;

const FormItem = Form.Item;
@connect(({ card, user }) => ({
  user,
  card,
}))
@Form.create()
export default class Appeal extends Component {
  constructor(props) {
    super();
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [
        {
          uid: -1,
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ],
      imageUrls: [],
    };
    //当前订单ID
    this.id = props.orderId;
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleSubmit = e => {
    const { dispatch, detail: { order = {} } } = this.props;

    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);

        dispatch({
          type: 'send_message',
          payload: {
            order_id: order.id,
            content: this.getMsgContent(values.content),
          },
          // callback: () => {}, // todo re-load appeal details
        });
      }
    });
  };

  getMsgContent = text => {
    const { imageUrls = [] } = this.state;
    let content = `<p>${text}</p>`;

    content += imageUrls.length > 0 ? `<ul className="picBox">` : '';
    map(imageUrls, (d, i) => {
      content += `<li>
                  <img
                    height="120px"
                    src="${d}"
                    alt="#"
                  />
                </li>`;
    });
    content += imageUrls.length > 0 ? `</ul>` : '';

    return content;
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  componentWillMount() {
    /* console.log(this.id);
    this.props.dispatch({
      type: 'card/getAppealInfo',
      payload: {
        order_id: this.id,
        order_msg_type: 2,
        goods_type: 2,
      },
    }); */
  }

  componentDidMount() {
    const { dispatch, detail: { order = {} } } = this.props;
    // dispatch({
    //   type: 'card/fetchChatMsgList',
    //   payload: {
    //     order_id: order.id,
    //     order_msg_type: 2, // 1快捷短语  2 申诉
    //     goods_type: 2, // 1: 'itunes', 2: '礼品卡'
    //   }
    // });
  }

  componentWillUnmount() {
    // this.props.dispatch({
    //   type: 'leave_chat_room',
    //   payload: {
    //     order_id: this.id,
    //     room_id: 'xxx',
    //   },
    // });
  }

  getImgsUrl = url => {
    this.setState({
      imageUrls: url,
    });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { card, appealInfo } = this.props;
    const { getFieldDecorator } = this.props.form;

    const { order, ad, cards, trader } = this.props.detail;
    const { pageStatus, setStatus } = this.props;
    const { chatMsgList = [] } = card;

    let steps = null;
    steps = [{ title: '打开交易' }, { title: '确认信息' }, { title: '完成' }];

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    return (
      <div className={styles.appeal}>
        <StepModel steps={steps} current={1} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <h5>
              <span>订单：</span>
              <span>{order.order_no || '-'}</span>
            </h5>
            <div className={styles.orderDescribe}>
              {pageStatus === 20
                ? `${trader.nickname}向您出售总面额${order.money}的${
                    CONFIG.card_type[order.order_type - 1].name
                  }`
                : null}
              {pageStatus === 21
                ? `您向${ad.owner.nickname}出售总面额${order.money}的${
                    CONFIG.card_type[order.order_type - 1].name
                  }`
                : null}
              {pageStatus === 22
                ? `您向${ad.owner.nickname}购买总面额${order.money}的${
                    CONFIG.card_type[order.order_type - 1].name
                  }`
                : null}
              {pageStatus === 23
                ? `${trader.nickname}向您购买总面额${order.money}的${
                    CONFIG.card_type[order.order_type - 1].name
                  }`
                : null}
            </div>
          </div>
          <div className={styles.tabs}>
            <Tabs
              onChange={e => {
                if (+e === 1) {
                  this.props.setStatus('pageStatus', 14);
                }
              }}
              animated={false}
              defaultActiveKey="2"
            >
              <TabPane tab="订单详情" key="1">
                d
              </TabPane>
              <TabPane tab="申诉中" key="2">
                <AppealInfo data={chatMsgList} />
                <Form onSubmit={this.handleSubmit}>
                  <div className={styles.submitAppeal}>
                    <div>
                      <div className={styles.addPic}>
                        <span className={styles.addTitle}>上传图片:</span>
                        <div className={styles.addBox}>
                          <UploadComponent picNum={1000} appealPic={this.getImgsUrl} />
                        </div>
                      </div>
                    </div>
                    <FormItem label="" {...formItemLayout}>
                      {getFieldDecorator('content', {
                        rules: [
                          {
                            required: true,
                            message: '请输入您要提交的内容',
                          },
                        ],
                      })(
                        <TextArea
                          style={{ minHeight: 32 }}
                          placeholder="您的建议会督促我做得更好~"
                          rows={4}
                        />
                      )}
                    </FormItem>
                    <Button
                      // loading={submitting}
                      className={styles.submit}
                      type="primary"
                      htmlType="submit"
                    >
                      提交
                    </Button>
                  </div>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

function AppealInfo(props) {
  const { data = [] } = props;
  return (
    <div>
      <ul className={styles.tabTwoTab}>
        {map(data, d => {
          return (
            <li className={styles.appealItem}>
              <div className={styles.leftAvatar}>
                <span className={styles.avaTop}>
                  <Avatar
                    className={styles.avatar}
                    size="large"
                    src={d.sender && d.sender.avatar}
                  />
                </span>
                <span className={styles.avaName}>{d.sender && d.sender.nickname}</span>
              </div>
              <div className={styles.chatItem}>
                <div className={styles.chatText}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: d.content && d.content.content,
                    }}
                  />
                </div>
                <div className={styles.chatTime}>
                  {moment(d.created_at * 1000).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AppealInfoAppealInfo2(props) {
  const { info } = props;
  return (
    <div>
      <ul className={styles.tabTwoTab}>
        <li className={styles.appealItem}>
          <div className={styles.leftAvatar}>
            <span className={styles.avaTop}>
              <Avatar className={styles.avatar} size="large" src="" />
            </span>
            <span className={styles.avaName}>i.user_name</span>
          </div>
          <div className={styles.chatItem}>
            <div className={styles.chatText}>
              <p>
                i.打撒奥所多sad水电费价格杜甫的说法吧时代峰峻的手法规及进度GV觉得很失败是觉得很舒服是dsvjdsf
                机话费圣诞节回复的er_name打撒奥所多sad水电费价格杜甫的说法吧时代峰峻的手法规及进度GV觉得很失败是觉得很舒服是dsvjdsf
                机话费圣诞节回复的er_name
              </p>
              <ul className={styles.picBox}>
                <li>
                  <img
                    height="120px"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="#"
                  />
                </li>
                <li>
                  <img
                    height="120px"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="#"
                  />
                </li>
                <li>
                  <img
                    height="120px"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="#"
                  />
                </li>
                <li>
                  <img
                    height="120px"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="#"
                  />
                </li>
                <li>
                  <img
                    height="120px"
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                    alt="#"
                  />
                </li>
              </ul>
            </div>
            <div className={styles.chatTime}>{new Date().toLocaleDateString()}</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
