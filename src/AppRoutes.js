import React, {  Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from './components/shared/Spinner';

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'));
const Area = lazy(() => import('./views/category/Area/Area'));
const Branch = lazy(() => import('./views/category/Branch/index'));
const Login = lazy(() => import('./views/home/Login'));


const AppRoutes = React.memo(() => {
    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/category/area" component={Area} />
                <Route exact path="/category/branch" component={Branch} />
                <Route exact path="/login" component={Login} />

                <Redirect to="/login" />
            </Switch>
        </Suspense>
    );
});

export default AppRoutes;