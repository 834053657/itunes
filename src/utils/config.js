import { FormattedMessage as FM } from 'react-intl';

import { getSystemUrl } from './utils';

const { base_url, web_name, socket_url } = getSystemUrl(__KG_API_ENV__);

export default {
  socket_url,
  base_url,
  web_name,
  videoAuthConcat: [
    {
      text: '客服电话1',
      account: '123',
    },
    {
      text: '客服电话2',
      account: '1234',
    },
    {
      text: '客服电话3',
      account: '1235',
    },
    {
      text: '客服QQ1',
      account: '312321312321',
    },
  ],
  web_sub_title: 'Itunes & 礼品卡 在线交易平台',
  service_phone: '4000000xxx',
  service_platform: '凯歌交易平台',
  language: {
    zh_CN: '简体中文',
    en_GB: 'English',
  },
  payments: {
    wechat: '微信支付',
    alipay: '支付宝',
    bank: '银行卡',
    site: '站内转账',
  },
  ad_type: {
    1: '买入',
    2: '出售',
  },
  auth_status: {},
  ad_status: {
    1: '已发布',
    2: '已暂停',
    3: '已冻结',
    4: '已取消',
    5: '已删除',
  },
  order_status: {
    1: '打开中',
    2: '待查收',
    3: '保障中',
    4: '申述中',
    5: '已完成',
    6: '已取消',
  },
  goods_type: {
    1: 'itunes',
    2: '礼品卡',
  },
  trans_term_status: {
    1: '未通过',
    2: '审核中',
    3: '已通过',
  },
  message_type_zh_CN: {
    1: '系统资讯',
    11: '您的{auth_type}已通过',
    12: '您的{auth_type}未通过',
    21: '您的{payment_method}{account}审核已通过',
    22: '您的{payment_method}{account}审核未通过',
    31: '您的提现请求审核已通过',
    32: '您的提现请求审核未通过',
    33: '您的充值请求审核已通过',
    34: '您的充值请求审核未通过',
    41: '交易条款"{title}"审核已通过',
    42: '交易条款"{title}"审核未通过',
    51: '尊敬的客户，很抱歉您的账号已被封号，如需恢复，请及时联系客服{service_phone}。',
    52: '尊敬的客户，您的账号已恢复使用，感谢您使用{service_platform}。',
    61: '尊敬的客户，很抱歉您的账号的广告功能已被冻结，所有在线广告已被暂停，如有任何一人请联系客服{service_phone}。',
    62: '尊敬的客户，您的账号的广告功能已恢复，感谢您使{service_platform}。',
    101: '{dealer}向您出售{goods_type}',
    102: '{dealer}向您购买{goods_type}',
    103: '您有新的订单待查收，请在10分钟内确认',
    104: '您有新的订单消息',
    105: '订单{order_no}超出保障时间，已自动释放',
    106: '{dealer}已取消订单',
    107: '{dealer}发起了申诉',
    108: '您有新的申诉消息',
    109: '客服已释放订单{order_no}',
    110: '客服已取消订单{order_no}',
    111: '{dealer}已释放订单{order_no}',
    112: '订单{order_no}超出查收时间，已自动取消',
    113: '订单{order_no}超出发卡时间，已自动取消',
    114: '{dealer}已查收，请耐心等待释放',
    131: '您的广告卡密已经出售完，广告已自动暂停',
    132: '您的余额不足，广告已自动暂停',
    133: '同时处理订单数达到最大，广告已自动暂停',
    134: '尊敬的客户，很抱歉您的广告已被取消，如有任何疑问请联系客服{service_phone}。',
  },
  message_type_en_GB: {
    1: 'System information',
    11: 'Your {auth_type} has passed',
    12: 'Your {auth_type} failed',
    21: 'Your {payment_method}{account} review has passed',
    22: 'Your {payment_method}{account} review failed',
    31: 'Your withdrawal request review has been approved',
    32: 'Your withdrawal request review failed',
    33: 'Your recharge request review has passed',
    34: 'Your recharge request review failed',
    41: 'Transaction term "{title}" have been approved',
    42: 'Transaction term "{title}" failed',
    51: 'Dear customer, I am sorry that your account has been blocked. If you need to recover, please contact customer service {service_phone}.',
    52: 'Dear customer, your account has been restored, thank you for using {service_platform}.',
    61: 'Dear customer, I am sorry that the advertising function of your account has been frozen. All online advertisements have been suspended. If there is any one, please contact customer service {service_phone}.',
    62: 'Dear customer, the advertising function of your account has been restored, thank you for making {service_platform}.',
    101: '{dealer} sells {goods_type} to you',
    102: '{dealer} buy {goods_type} for you',
    103: 'You have a new order to be checked, please confirm within 10 minutes',
    104: 'You have a new order message',
    105: 'Order {order_no} has exceeded the guarantee time and has been automatically released',
    106: '{dealer} has cancelled the order',
    107: '{dealer} initiated a complaint',
    108: 'You have a new appeal message',
    109: 'Customer service has released the order {order_no}',
    110: 'Customer service has cancelled order {order_no}',
    111: '{dealer} has released the order {order_no}',
    112: 'Order {order_no} has exceeded the checkout time and has been automatically cancelled',
    113: 'Order {order_no} has exceeded the time of issuance and has been automatically cancelled',
    114: '{dealer} has been checked, please be patient and wait for release',
    131: 'Your ad card has been sold and the ad has been automatically suspended.',
    132: 'Your balance is running low and your ads are automatically suspended',
    133: 'At the same time, the number of processed orders reached the maximum, and the ads were automatically suspended.',
    134: 'Dear users, I am sorry that your ad has been cancelled. If you have any questions, please contact customer service {service_phone}.',
  },
  cardPwdType: {
    // 1: '密码',
    // 2: '图片',
    // 3: '密码和图片',
    1: '有卡密',
    2: '有卡图',
    3: '有图有卡密',
  },
  tradeType: {
    1: '交易',
    2: '充值',
    3: '提现',
  },
  guarantee_time: [],
  deadline: [],
  card_type: [],
};
