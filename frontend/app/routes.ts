import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  layout('routes/auth-layout.tsx', [
    route('doors', 'routes/doors.tsx'),
    index('routes/home.tsx'),
  ]),
  route('signup', 'routes/signup.tsx'),
  route('login', 'routes/login.tsx'),
] satisfies RouteConfig;
