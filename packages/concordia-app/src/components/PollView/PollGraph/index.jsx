import React, { useMemo } from 'react';
import { Grid, Header, Tab } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PollChartBar from './PollChartBar';
import PollChartDonut from './PollChartDonut';
import './styles.css';

const PollGraph = (props) => {
  const { pollOptions, voteCounts, userVoteIndex } = props;
  const { t } = useTranslation();

  const footer = useMemo(() => (
      <>
          {' '}
          <Header as="h4">
              {t('topic.poll.tab.results.votes.count', {
                totalVotes: voteCounts.reduce((accumulator, voteCount) => accumulator + voteCount, 0),
              })}
          </Header>
          {userVoteIndex !== -1
          && (
              <Header as="h4">
                  {t('topic.poll.tab.results.user.vote', {
                    userVote: pollOptions[userVoteIndex],
                  })}
              </Header>
          )}
      </>
  ), [pollOptions, t, userVoteIndex, voteCounts]);

  const panes = useMemo(() => {
    const chartBarPane = (
        <Tab.Pane attached={false}>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column />
                    <Grid.Column width={8}>
                        <PollChartBar
                          pollOptions={pollOptions}
                          voteCounts={voteCounts}
                        />
                    </Grid.Column>
                    <Grid.Column />
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        {footer}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Tab.Pane>
    );
    const chartDonutPane = (
        <Tab.Pane attached={false}>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column />
                    <Grid.Column width={8}>
                        <PollChartDonut
                          pollOptions={pollOptions}
                          voteCounts={voteCounts}
                        />
                    </Grid.Column>
                    <Grid.Column />
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        {footer}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Tab.Pane>
    );

    return ([
      { menuItem: { key: 'chart-bar', icon: 'chart bar' }, render: () => chartBarPane },
      { menuItem: { key: 'chart-donut', icon: 'chart pie' }, render: () => chartDonutPane },
    ]);
  }, [footer, pollOptions, voteCounts]);

  return (
      <Tab
        menu={{ secondary: true }}
        panes={panes}
      />
  );
};

PollGraph.defaultProps = {
  userVoteIndex: -1,
};

PollGraph.propTypes = {
  pollOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  voteCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  userVoteIndex: PropTypes.number,
};

export default PollGraph;
