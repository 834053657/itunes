import { message } from 'antd';
import { mapKeys } from 'lodash';
import {
  queryNotices,
  queryStatistics,
  queryConfigs,
  queryBanners,
  postVerify,
  postVerifyCaptcha,
  queryMessageList,
  readMessage,
} from '../services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    statistics: {},
    banners: [],
  },

  effects: {
    *fetchBanners(_, { call, put }) {
      const response = yield call(queryBanners);

      if (response && response.code === 0) {
        yield put({
          type: 'setBanners',
          payload: response.data,
        });
      }
    },
    *fetchConfigs(_, { call, put }) {
      // 获取服务器字典
      const response = yield call(queryConfigs) || {};
      if (response && response.code === 0) {
        CONFIG = { ...CONFIG, ...response.data };
        CONFIG.countrysMap = mapKeys(response.data.countrys, 'id');
      }
    },
    *fetchNotices({ payload }, { call, put }) {
      const res = yield call(queryMessageList, payload);

      // only for ui test
      if (payload && payload.type === 2)
        res.data.items = []
      if (payload && payload.type === 3)
        res.data.items = res.data.items.slice(0, 2);

      yield put({
        type: 'saveNotices',
        payload: res,
      });
    },
    *fetchNotices_bak(_, { call, put }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: data.length,
      });
    },
    *fetchStatistics(_, { call, put }) {
      const res = yield call(queryStatistics);
      yield put({
        type: 'saveStatistics',
        payload: res.data,
      });
    },
    *clearNotices_bak({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      });
    },
    *clearNotices({ payload, callback }, { call, put }) {
      const res = yield call(readMessage, payload);
      yield put({
        type: 'setReadMessage',
        payload: res,
      });
      if (callback) callback();
    },
    *readNotices({ payload, callback }, { call, put }) {
      const res = yield call(readMessage, payload);
      yield put({
        type: 'setReadMessage',
        payload: res,
      });
      if (callback) callback();
    },
    *sendVerify({ payload, callback }, { call }) {
      const res = yield call(postVerify, payload);
      if (res.code === 0) {
        message.success('发送成功');
        callback && callback();
      } else {
        message.error(res.errmsg || '操作失败');
      }
    },
    *verifyCaptcha({ payload, callback }, { call }) {
      const res = yield call(postVerifyCaptcha, payload);
      if (res.code === 0) {
        callback && callback(res.data);
      } else {
        message.error(res.errmsg || '操作失败');
      }
    },
  },

  reducers: {
    setBanners(state, { payload }) {
      return {
        ...state,
        banners: payload,
      };
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      const { data: { items } } = payload || {};
      console.log('savenotices',items)
      return {
        ...state,
        notices: items || [],
      };
    },
    saveStatistics(state, { payload }) {
      return {
        ...state,
        statistics: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    setReadMessage(state, { payload }) {
      console.log(payload);
      return {
        ...state,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
