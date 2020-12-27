
import Vuex from 'vuex'
import Vue from 'vue'
import * as cookie from "js-cookie";
import { fetchUser, loginUser } from '../api';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
  },

  getters: {
    user(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.user !== null;
    }
  },

  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },

  actions: {
    logout(context) {
      cookie.remove('token');
      context.commit('setUser', null);
    },
    async tryLoadUser(context) {
      const token = cookie.get("token");
      if (token) {
        await context.dispatch('loadUserData');
      }
    },
    async loadUserData(context) {
      const { body, status } = await fetchUser();

      if (status !== 200) {
        return body;
      } else {
        context.commit('setUser', body);
        return true;
      }
    },
    async login(context, user) {
      const { body, status } = await loginUser(user);

      if (status !== 200) {
        return body;
      } else {
        return context.dispatch('loadUserData');
      }
    }
  }
});