import React, {  Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Spinner from './components/shared/Spinner';

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'));
const Area = lazy(() => import('./views/category/Area/Area'));
const Branch = lazy(() => import('./views/category/Branch/index'));
const Team = lazy(() => import('./views/category/Team/Team'));
const Login = lazy(() => import('./views/home/Login'));

const User = lazy(() => import('./views/user/User'));
const JoinTeam = lazy(() => import('./views/signup/JoinTeam/JoinTeam'));
const Signup = lazy(() => import('./views/signup/Signup/Signup'));

const AppRoutes = React.memo(() => {
    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/category/area" component={Area} />
                <Route exact path="/category/branch" component={Branch} />
                <Route exact path="/category/team" component={Team} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/user" component={User} />
                <Route exact path="/signup"  render={(props) => (<Signup {...props} />)}  component={Signup} />
                <Route exact path="/signup/jointeam"  render={(props) => (<JoinTeam {...props} />)} component={JoinTeam} />

                <Redirect to="/login" />
            </Switch>
        </Suspense>
    );
});

export default AppRoutes;