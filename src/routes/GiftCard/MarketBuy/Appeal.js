import React, { Component } from 'react';
import { connect } from 'dva';

import { Form, Tabs, Button, Icon, Input, Steps, Avatar, Upload, Modal, message } from 'antd';
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
      fileList: [],
      imageUrls: [],
      textValue: '',
      shouldCleanPic: false,
    };
    //当前订单ID
    this.id = props.orderId;
    this.appealPictures = null;
  }

  handleCancel = () => this.setState({ previewVisible: false });

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
          callback: () => {
            this.props.form.resetFields();
            this.setState({
              fileList: [],
              imageUrls: [],
            });
            message.success('发送成功');
          },
        });
      }
    });
  };

  getMsgContent = text => {
    const { imageUrls = [] } = this.state;
    let content = `<p>${text}</p>`;
    content += imageUrls.length > 0 ? `<ul className="${styles.picbox}">` : '';
    map(imageUrls, (d, i) => {
      content += `<li class="{{float:left}}">
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

  componentDidMount() {
    const { dispatch, detail: { order = {} } } = this.props;
    dispatch({
      type: 'card/fetchChatMsgList',
      payload: {
        order_id: order.id,
        order_msg_type: 2, // 1快捷短语  2 申诉
        goods_type: 2, // 1: 'itunes', 2: '礼品卡'
      },
    });
  }

  changeAppealPic = (info, prefix) => {
    const arr = [];
    info.fileList.map(file => {
      if (!file.response) {
        return false;
      }
      return arr.push(prefix + file.response.hash);
    });
    this.appealPictures = arr;
    this.setState({
      imageUrls: arr,
    });
  };

  getUserType = sender => {
    if (sender.buyer === 1 && sender.type === 'user') return '买家';
    else if (sender.buyer === 0 && sender.type === 'user') return '卖家';
    else if (sender.type === 'admin') return '客服';
    return null;
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  uploadHandler = info => {
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};
    this.changeAppealPic && this.changeAppealPic(info, upload.prefix);
    if (info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true,
      });
    } else if (info.file.status === 'error') {
      this.setState({ uploadLoading: false });
      message.error('上传错误，可能请求已过期，请刷新页面重试');
    }
    this.setState({
      fileList: info.fileList,
    });
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const { card, appealInfo } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { currentUser } = this.props.user || {};
    const { user = {}, upload = {} } = currentUser || {};

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
                          <Upload
                            name="file"
                            accept="image/*"
                            listType="picture-card"
                            fileList={this.state.fileList}
                            onPreview={this.handlePreview}
                            action={upload.domain}
                            onChange={this.uploadHandler}
                            data={{ token: upload.token }}
                          >
                            {this.state.fileList.length < 10 ? (
                              <div>
                                <Icon type="plus" />
                                <div className="ant-upload-text">上传</div>
                              </div>
                            ) : null}
                          </Upload>
                          <Modal
                            visible={this.state.previewVisible}
                            footer={null}
                            onCancel={this.handleCancel}
                          >
                            <img
                              alt="example"
                              style={{ width: '100%' }}
                              src={this.state.previewImage}
                            />
                          </Modal>
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

const AppealInfo = props => {
  const { data = [] } = props;
  return (
    <div>
      <ul className={styles.tabTwoTab}>
        {map(data, d => {
          return (
            <li key={d.id} className={styles.appealItem}>
              <div className={styles.leftAvatar}>
                <span className={styles.avaTop}>
                  <Avatar
                    className={styles.avatar}
                    size="large"
                    src={d.sender && d.sender.avatar}
                  />
                </span>
                <span className={styles.avaName}>{d.sender && d.sender.nickname}</span>
                <br />
                <span>
                  {d.sender &&
                    d.sender.buyer === 1 && <span className={styles.avaIdentify}>买家</span>}
                  {d.sender &&
                    d.sender.buyer !== 1 &&
                    d.sender.type === 'user' && <span className={styles.avaIdentify}>卖家</span>}
                  {d.sender &&
                    d.sender.type === 'admin' && <span className={styles.avaAdmin}>客服</span>}
                </span>
              </div>
              <div className={styles.chatItem}>
                <div className={styles.chatText}>
                  <div
                    className={styles.chatBox}
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
};
