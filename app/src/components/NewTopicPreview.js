import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Divider, Grid } from 'semantic-ui-react';

import TimeAgo from 'react-timeago';
import UserAvatar from 'react-user-avatar';
import ReactMarkdown from 'react-markdown';

const Post = ({ user, date, subject, content }) => (
  <div className="post">
    <Divider horizontal>
      <span className="grey-text">#0</span>
    </Divider>
    <Grid>
      <Grid.Row columns={16} stretched>
        <Grid.Column width={1} className="user-avatar">
          <UserAvatar
            size="52"
            className="inline"
            src={user.avatarUrl}
            name={user.username}
          />
        </Grid.Column>
        <Grid.Column width={15}>
          <div className="">
            <div className="stretch-space-between">
              <span>
                <strong>
                  {user.username}
                </strong>
              </span>
              <span className="grey-text">
                <TimeAgo date={date} />
              </span>
            </div>
            <div className="stretch-space-between">
              <span>
                <strong>
                                        Subject:
                  {' '}
                  {subject}
                </strong>
              </span>
            </div>
            <div className="post-content">
              <ReactMarkdown source={content} />
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>
);

Post.propTypes = {
  subject: PropTypes.string,
  date: PropTypes.string,
  content: PropTypes.string,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Post);
