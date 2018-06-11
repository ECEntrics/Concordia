import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { DrizzleProvider } from 'drizzle-react';

// Layout
import CoreLayout from './layouts/CoreLayout/CoreLayout';

// Containers
import LoadingContainer  from './containers/LoadingContainer';
import PrivateRouteContainer from './containers/PrivateRouteContainer';

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
            <IndexRoute component={HomeContainer} />
            <Route path="/topic/:topicId(/:topicSubject)(/:postId)"
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

/*<PrivateRouteContainer path="/topic/:topicId(/:topicSubject)(/:postId)"
              component={TopicContainer} />
  <PrivateRouteContainer path='/profile(/:address)(/:username)'
    component={ProfileContainer} />
  <PrivateRouteContainer path='/startTopic'
    component={StartTopicContainer} />*/