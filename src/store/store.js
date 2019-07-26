import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
import {
    Alert
} from 'element-ui';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        listProject: [],
        searchWebName: '中国政府网',
        searchCity: '北京',
        searchStartUrl: 'www.gov.cn',
    },

    mutations: {
        SET_PROJECT_LIST: (state, {
            projectlist
        }) => {
            state.listProject = projectlist
            console.log(state.listProject);
        },
    },
    //action需要一个启动的名称，mutations会根据commit的名称来刷新相应的action
    actions: {
        LOAD_PROJECT_LIST: function({
            dispatch,
            commit
        }) {
            axios.get('/api/project/getLimitItem').then((res) => {
                commit('SET_PROJECT_LIST', {
                    projectlist: res.data
                });
            })
        },
        ADD_NEW_PROJECT: function({
            dispatch,
            commit
        }, params) {
            axios.post('/api/project/addProject', params).then((res) => {
                dispatch('LOAD_PROJECT_LIST', )
            })
        },
        DELETE_PROJECT: function({
            dispatch,
            commit
        }, item) {
            axios.delete('api/project/deleteUser?id=' + item).then((res) => {
                //commit('delete_user') 
                dispatch('LOAD_PROJECT_LIST')
            })
        },
        SEARCH_PROJECTS: function({
            dispatch,
            commit,
            item
        }) {
            axios.post('api/user/searchItems', params).then((res) => {
                userList: res.data
            })
        }
    },
    getters: {
        listProject: state => {
            return state.listProject;
        },
        sWebName: state => {
            return state.searchWebName;
        },
        sCity: state => {
            return state.searchCity;
        },
        sStartUrl: state => {
            return state.searchStartUrl;
        },
    },
})