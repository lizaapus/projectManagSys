import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        listProject: []
    },

    mutations: {
        SET_PROJECT_LIST: (state, {
            projectlist
        }) => {
            state.listProject = projectlist
        },
    },
    //action需要一个启动的名称，mutations会根据commit的名称来刷新相应的action
    actions: {
        LOAD_PROJECT_LIST: function({
            dispatch,
            commit
        }, params) {
            axios.get('/api/project/getLimitItem', params).then((res) => {
                    commit('SET_PROJECT_LIST', {
                        userList: res.data
                    });
                }

            )
        },
        ADD_NEW_PROJECT: function({
            dispatch,
            commit
        }, params) {
            axios.post('/api/project/addProject', params).then((res) => {
                dispatch('LOAD_USER_LIST')
            })
        },
        DELETE_PROJECT: function({
            dispatch,
            commit
        }, item) {
            axios.delete('api/user/deleteUser?id=' + item).then((res) => {
                dispatch('LOAD_USER_LIST')
            })
        },
    },
    getters: {

    },
})