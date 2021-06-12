import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import ajax from '../utils/ajax';
import ErrorComponent from '../components/ErrorComponent';

import ToastWrap from './ToastWrap';
import Loading from './Loading';

import { setAuth } from '../reducer/auth';

class App extends React.Component {

   constructor() {
      super();
      this.state = {}
   }

   async componentDidMount() {
      let result = await ajax('/auth/get');
      this.props.setAuth(result.data.admin);
   }

   render() {
      return (
         <>
            <BrowserRouter>
               <Suspense fallback={<div className="hy-suspense"><div className="loader"></div></div>}>
                  <Switch>
                     <Route exact path={`/`} component={lazy(() => import('../components/ExplorerComponent'))} />
                     <Route exact path={`/search`} component={lazy(() => import('../components/ExplorerSearchComponent'))} />
                     <Route exact path={`/viewer`} component={lazy(() => import('../components/SourceViewer'))} />
                     <Route component={ErrorComponent} />
                  </Switch>
               </Suspense>
            </BrowserRouter>

            <Loading />
            <ToastWrap />
         </>
      )
   }
}


const mapDispatchToProps = { setAuth };

export default connect( // 스토어와 연결
   null,
   mapDispatchToProps
)(App);
