import React, { Fragment, lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/LoadingScreen';

const routesConfig = [
  {
    exact: true,
    path: '/404',
    layout: MainLayout,
    component: lazy(() => import('./components/NotFound')),
  },
  {
    path: '*',
    layout: MainLayout,
    routes: [
      {
        exact: true,
        path: '/',
        component: lazy(() => import('./components/HomeContainer')),
      },
      {
        component: () => <Redirect to="/404" />,
      },
    ],
  },
];

const renderRoutes = (routes) => (routes ? (
    <Suspense fallback={<LoadingScreen />}>
        <Switch>
            {routes.map((route, i) => {
              const Layout = route.layout || Fragment;
              const Component = route.component;

              const key = route.path ? route.path.concat(i) : ''.concat(i);
              return (
                  <Route
                    key={key}
                    path={route.path}
                    exact={route.exact}
                    render={(props) => (
                        <Layout>
                            {route.routes
                              ? renderRoutes(route.routes)
                              : <Component {...props} />}
                        </Layout>
                    )}
                  />
              );
            })}
        </Switch>
    </Suspense>
) : null);

function Routes() {
  return renderRoutes(routesConfig);
}

export default Routes;
