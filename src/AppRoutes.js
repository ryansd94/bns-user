import React, { Suspense, lazy } from "react"
import { Switch, Route, Redirect } from "react-router-dom"
import Spinner from "./components/shared/Spinner"

const Dashboard = lazy(() => import("./views/dashboard/Dashboard"))
const Team = lazy(() => import("./views/category/Team"))
const Login = lazy(() => import("./views/home/Login"))
const Status = lazy(() => import("./views/category/status"))
const User = lazy(() => import("./views/user/User"))
const JoinTeam = lazy(() => import("./views/signup/JoinTeam/JoinTeam"))
const Signup = lazy(() => import("./views/signup/Signup/Signup"))
const Template = lazy(() => import("./views/project/Template/Template"))
const Task = lazy(() => import("./views/task"))
const TaskCalendar = lazy(() => import("./views/taskCalendar"))
const TemplateView = lazy(() =>
  import("./views/project/Template/templateView"),
)
const TaskType = lazy(() => import("./views/category/taskType"))
const TaskView = lazy(() => import("./views/task/taskView"))
const Priority = lazy(() => import("./views/category/priority"))
const Project = lazy(() => import("./views/project/project"))
const Summary = lazy(() => import("./views/dashboard/summary"))
const ViewPermission = lazy(() =>
  import("./views/permission/viewPermission/viewPermission"),
)
const NotPermission = lazy(() =>
  import("./views/permission/notPermission/notPermission"),
)

const AppRoutes = React.memo(() => {
  return (
    // <Suspense fallback={<Spinner />}>
    <Suspense fallback={""}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/access-denied" component={NotPermission} />
        <Route
          exact
          path="/signup"
          render={(props) => <Signup {...props} />}
          component={Signup}
        />
        <Route
          exact
          path="/signup/jointeam"
          render={(props) => <JoinTeam {...props} />}
          component={JoinTeam}
        />
        <Route exact path="/:organization/dashboard" component={Dashboard} />
        <Route exact path="/:organization/category/team" component={Team} />
        <Route exact path="/:organization/category/status" component={Status} />
        <Route
          exact
          path="/:organization/category/priority"
          component={Priority}
        />
        <Route
          exact
          path="/:organization/category/tasktype"
          component={TaskType}
        />
        <Route exact path="/:organization/user" component={User} />
        <Route exact path="/:organization/template" component={Template} />
        <Route exact path="/:organization/task" component={Task} />
        <Route exact path="/:organization/task-calendar" component={TaskCalendar} />
        
        <Route
          exact
          path="/:organization/task/create/:id"
          component={TaskView}
        />
        <Route
          exact
          path="/:organization/task/edit/:taskEditId"
          component={TaskView}
        />
        <Route
          exact
          path="/:organization/template/add"
          component={TemplateView}
        />
        <Route
          exact
          path="/:organization/template/:id"
          component={TemplateView}
        />
        <Route exact path="/:organization/project" component={Project} />
        <Route
          exact
          path="/:organization/viewPermission"
          component={ViewPermission}
        />
        <Route
          exact
          path="/:organization/overview/summary"
          component={Summary}
        />

        <Route
          exact
          path="/:organization/:projectCode/overview/summary"
          component={Summary}
        />
        <Route
          exact
          path="/:organization/:projectCode/overview/dashboard"
          component={Dashboard}
        />
        <Route exact path="/:organization/:projectCode/task" component={Task} />
        <Route exact path="/:organization/:projectCode/task-calendar" component={TaskCalendar} />
        <Route
          exact
          path="/:organization/:projectCode/task/create/:id"
          component={TaskView}
        />
        <Route
          exact
          path="/:organization/:projectCode/task/edit/:taskEditId"
          component={TaskView}
        />
        <Redirect to="/login" />
      </Switch>
    </Suspense>
  )
})

export default AppRoutes
