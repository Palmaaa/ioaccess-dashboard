import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'

import ManagerArea from './components/ManagerArea.vue'
import DataEditor from './components/DataEditor.vue'
import ReportGenerator from './components/ReportGenerator.vue'

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/area-do-gestor',
      component: ManagerArea
    },
    {
      path: '/',
      redirect: '/area-do-gestor'
    },
    {
      path: '/editor-de-dados',
      component: DataEditor
    },
    {
      path: '/gerar-relatorio',
      component: ReportGenerator
    }
  ]
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
