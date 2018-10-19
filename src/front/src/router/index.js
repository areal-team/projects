import Vue from 'vue';
import Router from 'vue-router';

import Dashboard from '../pages/Dashboard';
import Services from '../pages/Services';
import Settings from '../pages/Settings';
import Projects from '../pages/Projects';
import Project from '../pages/Project';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
  },
  {
    path: '/services',
    name: 'Services',
    component: Services,
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
  },
  {
    path: '/projects',
    name: 'Projects',
    component: Projects,
  },
  {
    path: '/projects/:id',
    name: 'Project',
    component: Project,
  },
];

export default new Router({
  mode: 'history',
  routes,
});
