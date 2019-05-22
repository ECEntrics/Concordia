import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { TopicPlaceholderExtra, PostPlaceholderExtra } from '../CustomPropTypes'

import ContentLoader from 'react-content-loader';
import { Card, Button, Divider, Grid, Icon, Label } from 'semantic-ui-react';

class PlaceholderContainer extends Component {
  render() {
    const { placeholderType, extra, history } = this.props;

    switch (placeholderType) {
      case 'Topic':
        return(
          <Card
            link
            className="card"
            onClick={() => {
              history.push(`/topic/${extra.topicID}`);
            }}
          >
            <Card.Content>
              <div>
                <ContentLoader
                  height={5.8}
                  width={300}
                  speed={2}
                  primaryColor="#b2e8e6"
                  secondaryColor="#00b5ad"
                >
                  <rect x="0" y="0" rx="3" ry="3" width="150" height="5.5" />
                </ContentLoader>
              </div>
              <hr />
              <div className="topic-meta">
                <p className="no-margin">
                  <ContentLoader
                    height={5.8}
                    width={300}
                    speed={2}
                    primaryColor="#b2e8e6"
                    secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="60" height="5.5" />
                  </ContentLoader>
                </p>
                <p className="no-margin">
                  <ContentLoader
                    height={5.8}
                    width={300}
                    speed={2}
                    primaryColor="#b2e8e6"
                    secondaryColor="#00b5ad"
                  >
                    <rect x="0" y="0" rx="3" ry="3" width="70" height="5.5" />
                  </ContentLoader>
                </p>
                <p className="topic-date grey-text">
                  <ContentLoader
                    height={5.8}
                    width={300}
                    speed={2}
                    primaryColor="#b2e8e6"
                    secondaryColor="#00b5ad"
                  >
                    <rect x="260" y="0" rx="3" ry="3" width="40" height="5.5" />
                  </ContentLoader>
                </p>
              </div>
            </Card.Content>
          </Card>
        );
      case 'Post':
        return(
          <div className="post">
            <Divider horizontal>
              <span className="grey-text">
#
                {extra.postIndex}
              </span>
            </Divider>
            <Grid>
              <Grid.Row columns={16} stretched>
                <Grid.Column width={1} className="user-avatar">
                  <div className="user-avatar">
                    <ContentLoader
                      height={52}
                      width={52}
                      speed={2}
                      primaryColor="#b2e8e6"
                      secondaryColor="#00b5ad"
                    >
                      <circle cx="26" cy="26" r="26" />
                    </ContentLoader>
                  </div>
                </Grid.Column>
                <Grid.Column width={15}>
                  <div className="">
                    <div className="stretch-space-between">
                      <span className='grey-text'>
                        <strong>Username</strong>
                      </span>
                      <span className="grey-text">
                        <ContentLoader height={5.8} width={300} speed={2} primaryColor="#b2e8e6"
                          secondaryColor="#00b5ad" >
                          <rect x="280" y="0" rx="3" ry="3" width="20" height="5.5" />
                        </ContentLoader>
                      </span>
                    </div>
                    <div className="stretch-space-between">
                      <span className='grey-text' >
                        <strong>
                          <ContentLoader height={5.8} width={300} speed={2} primaryColor="#b2e8e6"
                            secondaryColor="#00b5ad" >
                            <rect x="0" y="0" rx="3" ry="3" width="75" height="5.5" />
                          </ContentLoader>
                        </strong>
                      </span>
                    </div>
                    <div className="post-content">
                      <ContentLoader height={11.2} width={300} speed={2}
                        primaryColor="#b2e8e6" secondaryColor="#00b5ad" >
                        <rect x="0" y="0" rx="3" ry="3" width="180" height="4.0" />
                        <rect x="0" y="6.5" rx="3" ry="3" width="140" height="4.0" />
                      </ContentLoader>
                    </div>
                  </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column floated="right" textAlign="right">
                  {/* TODO
                    <Button icon size="mini" disabled
                      style={{
                        marginRight: '0px'
                      }}
                    >
                      <Icon name="chevron up" />
                    </Button>
                    <Label color="teal">Loading...</Label>
                    <Button icon size="mini" disabled >
                      <Icon name="chevron down" />
                    </Button>
                     */
                  }
                  <Button icon size="mini" disabled >
                    <Icon name="linkify" />
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        );
    }
  }
}

PlaceholderContainer.propTypes = {
  placeholderType: PropTypes.string.isRequired,
  extra: PropTypes.oneOfType([
    TopicPlaceholderExtra.isRequired,
    PostPlaceholderExtra.isRequired
  ])
};

export default withRouter(PlaceholderContainer);
