import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import './assets/tailwind.css'


createApp(App).use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
        path: '/',
        component: HomePage,
    }, {
        path: '/:pathMatch(.*)*',
        component: NotFoundPage,
    }]
})).mount('#app')
