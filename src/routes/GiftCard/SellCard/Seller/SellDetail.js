import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Table,
  Tabs,
  Button,
  Icon,
  Pagination,
  Input,
  message,
  InputNumber,
  Avatar,
  Popover,
} from 'antd';
import styles from './SellDetail.less';

@connect(({ card }) => ({
  card,
}))
export default class DealDeatil extends Component {
  constructor(props) {
    super();
    this.state = {
      data: null,
      addDenoVisible: false,
      denoValue: '',
    };

    this.ensureOrder = () => {
      this.props.history.push({
        pathname: `/card/sell-sendCard`,
        //query: { ad_info: record },
      });
      this.props.dispatch({
        type: 'card/ensureOrder',
        payload: this.state.data.id,
      });
      //this.props.history.push({pathname: `/card/buy-stepTwo`});
    };
  }

  changeNum = e => {
    console.log(e);
  };

  componentWillMount() {
    const adInfo = this.props.location.query;
    console.log(this.props);
    this.props
      .dispatch({
        type: 'card/getBuyDetail',
        //payload: this.order_id,
      })
      .then(res => {
        console.log('this.props.card');
        console.log(this.props.card.buyDetail);
        this.setState({
          data: this.props.card.buyDetail,
        });
      });
  }

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    const { card } = this.props;
    let data;

    const addDenoNode = (
      <div className={styles.addDenoNode}>
        <Input
          onChange={e => {
            this.setState({ denoValue: e.target.value });
          }}
          value={this.state.denoValue}
        />

        <h5>可添加面额：1-1000</h5>
        <div>
          <Button onClick={() => this.setState({ addDenoVisible: false })}>取消</Button>
          <Button
            onClick={() => {
              this.setState({ addDenoVisible: false });
            }}
            type="primary"
          >
            确认
          </Button>
        </div>
      </div>
    );

    function passwordType(n) {
      if (n === 1) return '密码';
      if (n === 2) return '图片';
      if (n === 3) return '密码和图片';
    }

    function amountMoney() {
      let a = 0;
      // if (card.buyDetail) {
      //   card.buyDetail.ad_info.cards.map(i => {
      //     return (a += i.count * i.money);
      //   });
      // }
      return a;
    }

    if (card.buyDetail) {
      data = card.buyDetail.data;
      console.log('data');
      console.log(data);
      const info = data;
      const ownerInfo = info.owner;
      const type = CONFIG.card_type;

      return (
        <div className={styles.detailBox}>
          <div className={styles.left}>
            <ul>
              <li className={styles.item}>
                <span className={styles.title}>类型：</span>
                <div className={styles.content}>{type[info.card_type].name}</div>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>包含：</span>
                <div className={styles.content}>{passwordType(info.password_type)}</div>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>单价：</span>
                <div className={styles.content}>{info.unit_price}RMB</div>
              </li>
              <li className={styles.denoList}>
                {data.condition_type === 1 ? (
                  <ul>
                    {info.cards.map((d, index) => {
                      return (
                        <li key={d.money}>
                          <span className={styles.denoTitle}>{d.money}面额：</span>
                          <div className={styles.denoIpt}>
                            <InputNumber
                              min={0}
                              max={d.count}
                              defaultValue={1}
                              onChange={e => this.changeNum(e)}
                            />
                          </div>
                          <span className={styles.last}>库存({d.count})</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
                {data.condition_type === 2 ? (
                  <ul>
                    <li>
                      <Popover
                        content={addDenoNode}
                        trigger="click"
                        visible={this.state.addDenoVisible}
                        onVisibleChange={() =>
                          this.setState({ addDenoVisible: !this.state.addDenoVisible })
                        }
                      >
                        <Button>
                          <Icon type="plus" />
                          添加面额
                        </Button>
                      </Popover>
                    </li>
                  </ul>
                ) : null}
              </li>
              <li className={styles.item}>
                <span className={styles.title}>总价：</span>
                <div className={styles.content}>{amountMoney()}RMB</div>
              </li>
              <li className={styles.item}>
                <span className={styles.title}>保障时间：</span>
                <div className={styles.content}>{info.guarantee_time}分钟</div>
              </li>
            </ul>
            <div className={styles.bottom}>
              <Button>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  this.ensureOrder();
                }}
              >
                确认出售
              </Button>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <Avatar size="large" src={ownerInfo.avatar} />
              </div>
              <div className={styles.avatarRight}>
                <div className={styles.top}>
                  <span className={styles.name}>{ownerInfo.nickname}</span>
                  <span className={styles.online}>&nbsp;</span>
                </div>
                <div className={styles.infoBottom}>
                  <span className={styles.dealTit}>30日成单：</span>
                  <span className={styles.dealNum}>{ownerInfo.month_volume}</span>
                </div>
              </div>
            </div>
            <div className={styles.term}>
              <h3>交易条款：</h3>
              <p>{info.term}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}
