import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default {
  STATUS_LOADED(state, payload) {
    // console.log('STATUS_LOADED', payload);

    state.appStatus = payload;
  },

  TOTAL_HISTORY_LOADED(state, payload) {
    state.history.total = payload.data;
  },
  CONTAINER_HISTORY_LOADED(state, payload) {
    state.history.containers[payload[0].info.name] = payload;
  },
  HISTORY_STATS_LOADED(state, payload) {
    state.historyStats = payload.data;
  },

  CLEAR_NOTIFICATIONS: state => {
    state.socket.notifications = [];
  },
  CLEAR_TEST_RESPONSE: state => {
    state.socket.testResponse = null;
  },

  SET_ERROR(state, error) {
    // console.log('SET_ERROR', error);
    state.error = error;
  },

  LOADED_PROJECTS(state, data) {
    // console.log('LOADED_PROJECTS', data);
    state.projects = data.map(elem => {
      if (elem.status && elem.status.lastUpdate) {
        elem.status.lastUpdate = dayjs(elem.status.lastUpdate).fromNow();
      } else {
        elem.status = {
          contentLength: 0,
          lastUpdate: 'Unknown',
          status: 'Unknown',
          statusText: 'Unknown',
          time: 0,
        };
      }
      return elem;
    }).sort((a, b) => ((a.name > b.name) ? 1 : -1));
  },

  LOADED_PROJECT(state, data) {
    // console.log('LOADED_PROJECT', data);
    state.project.current = data;
  },

  ADDED_PROJECT(_, data) {
    console.log('ADDED PROJECT - ', data);
  },

  DELETED_PROJECT(_, data) {
    console.log('DELETED PROJECT - ', data);
  },

  SAVED_PROJECT(_, data) {
    console.log('SAVED PROJECT - ', data);
  },

  BACKUP_TASK_SENDED(_, data) {
    console.log('BACKUP TASK SENDED TO QUEUE - ', data);
  },

  SERVERS_STATUS_LOADED(_, data) {
    console.log('SERVERS STATUSE LOADED - ', data);
  },
  SIGN_IN(state, data) {
    state.login = data;
    const JWTtoken = `jwt ${state.login.data.token}`;
    const name = `${state.login.data.name}`;
    localStorage.setItem('token', JWTtoken);
    localStorage.setItem('UserName', name);
    localStorage.setItem('FirstLogin', false);
  },
  SIGN_IN_FAIL() {
    console.log('LOGIN FAIL');
    localStorage.setItem('loginProcces', false);
  },
  AUTH(state, data) {
    console.log('AUTH', data);
  },

  REGISTER(state, data) {
    console.log('REGISTER', data.data.status);
    if (data.data.status === 'failed') {
      state.register = false;
    } else {
      state.register = true;
    }
  },
  REGISTER_FAIL(state, data) {
    state.register = false;
    console.log('REGISTER_FAIL',data);
  },

  USERS(state, data) {
    state.users = data.data;
  },
  DELETED_USER(state, data) {
  },
};
