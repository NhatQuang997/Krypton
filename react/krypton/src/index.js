import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
const store = createStore(mainReducer);
import { createStore } from "redux";
import { Provider } from "react-redux";
import mainReducer from "./reducers/RootReducer";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <Route path={`/`} component={AdminLayout} />
        <Redirect from={`/`} to="/dashboard" />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
 