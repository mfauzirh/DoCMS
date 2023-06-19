import Vue from 'vue';
import VueRouter from 'vue-router';
import AuthService from '@/services/AuthService';

const portalChildRoutes = (prefix) => [
  {
    path: 'docs/:id',
    name: prefix + '.section',
    component: () => import('@/views/Documentation/SectionView.vue'),
    props: true
  }
];

const cmsChildRoutes = (prefix) => [
  {
    path: 'section',
    name: prefix + '.section',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/SectionList.vue'),
    props: true
  },
  {
    path: 'section/:id',
    name: prefix + '.section-editor',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/SectionEditor.vue')
  },
  {
    path: 'chapter',
    name: prefix + '.chapter',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/ChapterList.vue')
  },
  {
    path: 'metadata',
    name: prefix + '.metadata',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/MetadataInfo.vue')
  },
  {
    path: 'version',
    name: prefix + '.version',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/VersioningEditor.vue')
  },
  {
    path: 'profile',
    name: prefix + '.profile',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/ProfileInfo.vue')
  }
];

const routes = [
  {
    path: '/',
    name: 'docs',
    component: () => import('@/views/Documentation/DocsView.vue'),
    children: portalChildRoutes('portal')
  },
  {
    path: '/cms',
    name: 'cms',
    meta: { requireAuth: true },
    component: () => import('@/views/CMS/CMSView.vue'),
    children: cmsChildRoutes('cms')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/LoginView.vue'),
    props: true
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth/RegisterView.vue'),
    props: true
  },
  {
    path: '*',
    component: () => import('@/views/Error/NotFoundView.vue')
  }
];

Vue.use(VueRouter)
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const requireAuth = async (to, from, next) => {
  // Check if the access routes doesn't required an authentication
  if (!to.matched.some((record) => record.meta.requireAuth)) {
    next();
    return;
  }

  // If token doesn't exist
  if(!localStorage.token) {
    next({name: "login", replace: true });
    return;
  }

  try {
    await AuthService.refreshToken();
    next();
  } catch (error) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    next({
      name: "login",
      replace: true,
      params: {
        message: "Your login session is expired",
        status: true,
        msgtype: 'error'
      }
    });
  }
};

router.beforeEach(requireAuth);

export default router;
