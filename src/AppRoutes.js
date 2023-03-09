import React, {  Suspense, lazy } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Spinner from './components/shared/Spinner'

const Dashboard = lazy(() => import('./views/dashboard/Dashboard'))
const Team = lazy(() => import('./views/category/Team'))
const Login = lazy(() => import('./views/home/Login'))
const Status = lazy(() => import('./views/category/status'));
const User = lazy(() => import('./views/user/User'))
const JoinTeam = lazy(() => import('./views/signup/JoinTeam/JoinTeam'))
const Signup = lazy(() => import('./views/signup/Signup/Signup'))
const Template =  lazy(() => import('./views/project/Template/Template'))
const Task =  lazy(() => import('./views/task'))
const TemplateView =  lazy(() => import('./views/project/Template/templateView'))
const TaskType = lazy(() => import('./views/category/taskType'))
const TaskView =  lazy(() => import('./views/task/taskView'))

const AppRoutes = React.memo(() => {
    return (
        <Suspense fallback={<Spinner />}>
            <Switch>
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/category/team" component={Team} />
                <Route exact path="/category/status" component={Status} />
                <Route exact path="/category/tasktype" component={TaskType} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/user" component={User} />
                <Route exact path="/template" component={Template} />
                <Route exact path="/task" component={Task} />
                <Route exact path="/task/create/:id" component={TaskView} />
                <Route exact path="/task/edit/:taskEditId" component={TaskView} />
                <Route exact path="/template/add" component={TemplateView} />
                <Route exact path="/template/:id" component={TemplateView} />
                <Route exact path="/signup"  render={(props) => (<Signup {...props} />)}  component={Signup} />
                <Route exact path="/signup/jointeam"  render={(props) => (<JoinTeam {...props} />)} component={JoinTeam} />
                
                <Redirect to="/login" />
            </Switch>
        </Suspense>
    )
})

export default AppRoutes