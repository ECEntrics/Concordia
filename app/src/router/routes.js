import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import CoreLayoutContainer from '../components/CoreLayoutContainer';
import HomeContainer from '../components/HomeContainer';
import SignUpContainer from '../components/SignUpContainer';
import StartTopicContainer from '../components/StartTopicContainer';
import TopicContainer from '../components/TopicContainer';
import ProfileContainer from '../components/ProfileContainer';
import NotFound from '../components/NotFound';

const routes = (
  <div>
    <CoreLayoutContainer>
      <Switch>
        <Route exact path="/" component={HomeContainer} />
        <Redirect from="/home" to="/" />
        <Route path="/signup" component={SignUpContainer} />
        <Route path="/startTopic" component={StartTopicContainer} />
        <Route path="/topic/:topicId/:postId?" component={TopicContainer} />
        <Route
          path="/profile/:address?/:username?"
          component={ProfileContainer}
        />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </CoreLayoutContainer>
  </div>
);

export default routes;
