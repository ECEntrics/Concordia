import React from 'react';
import { render } from 'react-dom';
import { Router, IndexRedirect, browserHistory } from 'react-router';
import { Route } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { DrizzleProvider } from 'drizzle-react';

// Layout
import CoreLayout from './layouts/CoreLayout/CoreLayout';

// Containers
import LoadingContainer  from './containers/LoadingContainer';
import SignUpContainer from './containers/SignUpContainer';
import HomeContainer from './containers/HomeContainer';
import TopicContainer from './containers/TopicContainer';
import StartTopicContainer from './containers/StartTopicContainer';
import ProfileContainer from './containers/ProfileContainer';
import NotFoundView from './components/NotFoundView';

import store from './redux/store';
import drizzleOptions from './util/drizzleOptions';

import './assets/css/index.css';

// Initialize react-router-redux.
const history = syncHistoryWithStore(browserHistory, store);

render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
        <Router history={history}>
          <Route path="/" component={CoreLayout}>
            <IndexRedirect to="/home" />
            <Route path="/home"
              component={HomeContainer} />
            <Route path="/signup"
              component={SignUpContainer} />
            <Route path="/topic/:topicId(/:postId)"
              component={TopicContainer} />
            <Route path='/profile(/:address)(/:username)'
              component={ProfileContainer} />
            <Route path='/startTopic'
              component={StartTopicContainer} />
            <Route path='/404' component={NotFoundView} />
            <Route path='*' component={NotFoundView} />
          </Route>
        </Router>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);