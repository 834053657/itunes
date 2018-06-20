import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button, Icon, Input, Avatar, Badge } from 'antd';
import styles from './SendCard.less';
import StepModel from '../../Step';
import { sendCDK } from '../../../../services/api';
import OnlyPicture from './OnlyPic';
import PicWithText from './PicWithText';

@connect(({ card }) => ({
  card,
}))
export default class Process extends Component {
  constructor(props) {
    super();
    this.state = {
      detail: props.detail,
      user: props.user,
    };
    this.cardsData = [];
    this.data = {
      order_id: this.state.detail.order.id,
      cards: [],
    };
  }

  componentWillMount() {
    const { order_detail = {} } = this.state.detail.order;
    order_detail.map(o => {
      return this.cardsData.push({
        money: o.money,
        cards: [],
      });
    });
  }

  renderInput = (item, index) => {
    const iptArr = [];
    for (let i = 0; i < item.count; i++) {
      iptArr.push({
        password: null,
        picture: null,
      });
    }
    this.cardsData[index].cards = iptArr;
    return iptArr;
  };

  writePassword = (e, item, index, i) => {
    this.cardsData[index].cards[i].password = +e.target.value;
    console.log(this.cardsData);
  };

  sendCDK = () => {
    this.data.cards = this.cardsData;
    console.log(this.data);
    this.props.dispatch({
      type: 'card/sendCDK',
      payload: this.data,
    });
  };

  render() {
    const { user, detail } = this.state;
    const { setStatus } = this.props;
    const { ad = {}, cards = {}, order = {} } = this.state.detail;

    const userInfo = ad.owner;
    console.log(order.order_detail);

    const steps = [{ title: '发送礼品卡' }, { title: '确认信息' }, { title: '完成' }];
    return (
      <div className={styles.sendBox}>
        <StepModel steps={steps} current={0} />
        <div className={styles.top}>
          <div className={styles.orderInfo}>
            <div className={styles.price}>
              <span>类型：</span>
              <p>{order.order_type ? CONFIG.card_type[ad.card_type - 1].name || '-' : '-'}</p>
            </div>
            <div className={styles.price}>
              <span>要求：</span>
              <p>{CONFIG.cardPwdType[ad.password_type] || '-'}</p>
            </div>
            <div className={styles.price}>
              <span>保障时间：</span>
              <p>{ad.guarantee_time}</p>分钟
            </div>
          </div>

          <div className={styles.topRight}>
            <div className={styles.ownerInfo}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <Avatar size="large" src={userInfo.avatar} />
                </div>
                <div className={styles.avatarRight}>
                  <div className={styles.top}>
                    <span className={styles.name}>{userInfo.nickname}</span>
                    <span className={styles.online}>&nbsp;</span>
                  </div>
                  <div className={styles.infoBottom}>
                    <span className={styles.dealTit}>30日成单：</span>
                    <span className={styles.dealNum}>{userInfo.month_volume}</span>
                  </div>
                </div>
              </div>
              <div className={styles.term}>
                <h3>交易条款：</h3>
                <p>{order.term}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.denomination}>
          <div className={styles.bottom}>
            {CONFIG.cardPwdType[ad.password_type] === '密码'
              ? order.order_detail.map((item, index) => {
                  return (
                    <div key={index} className={styles.denomination}>
                      <header>
                        <span>{item.money}</span>
                        面额 ({item.count})
                        <div>
                          <Button>导入</Button>
                        </div>
                      </header>
                      <section className={styles.iptSection}>
                        <div className={styles.left}>
                          <span>卡密：</span>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.iptBox}>
                            <div className={styles.input}>
                              {this.renderInput(item, index).map((n, i) => {
                                return (
                                  <Input
                                    key={i}
                                    type="text"
                                    onChange={e => this.writePassword(e, item, index, i)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  );
                })
              : null}

            {CONFIG.cardPwdType[ad.password_type] === '图片'
              ? order.order_detail.map((item, index) => {
                  return <OnlyPicture key={index} item={item} />;
                })
              : null}

            {CONFIG.cardPwdType[ad.password_type] === '密码和图片'
              ? order.order_detail.map((item, index) => {
                  return <PicWithText key={index} item={item} />;
                })
              : null}

            <div>
              <div className={styles.amount}>
                <h4>
                  <span className={styles.title}>{order.money}</span>
                  <span>总面额：</span>
                </h4>
                <h4>
                  <span className={styles.title}>{ad.unit_price}RMB</span>
                  <span>单价：</span>
                </h4>
                <h4>
                  <span className={styles.title}>{order.money}RMB</span>
                  <span>总价：</span>
                </h4>
              </div>
              <div className={styles.footer}>
                <div>
                  请在&nbsp;
                  <Icon type="delete" />
                  &nbsp; {ad.deadline}分钟内发卡
                </div>
                <Button>取消</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    this.sendCDK();
                  }}
                >
                  发布
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
