import React from 'react';
import {Switch, Route} from 'react-router'
import { BrowserRouter } from "react-router-dom";

import Home, {Layout, Invalid} from './Component/Home'
import Request from './Component/Request'
import Node from './Component/Node'
import ErrorCode from './Component/ErrorCode'

function App() {
  return (
    <Layout>
      <BrowserRouter>
        <Switch>
          <Route path="/node/:nodeID" component={Node} />
          <Route path="/request/:requestID" component={Request} />
          <Route path="/error_code/:type" component={ErrorCode} />
          <Route exact path="/" component={Home} />
          <Route path="/" component={Invalid} />
        </Switch>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
