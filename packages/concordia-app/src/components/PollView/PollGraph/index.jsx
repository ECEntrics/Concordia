import React, { useEffect, useMemo, useState } from 'react';
import {
  Grid, Header, Statistic, Tab,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PollChartBar from './PollChartBar';
import PollChartDonut from './PollChartDonut';
import './styles.css';

const PollGraph = (props) => {
  const {
    pollOptions, userVoteIndex, voteCounts, voterNames,
  } = props;
  const [totalVotes, setTotalVotes] = useState(voteCounts.reduce((accumulator, voteCount) => accumulator + voteCount, 0));
  const { t } = useTranslation();

  useEffect(() => {
    setTotalVotes(voteCounts.reduce((accumulator, voteCount) => accumulator + voteCount, 0));
  }, [voteCounts]);

  const footer = useMemo(() => (
      <>
          <Statistic size="mini">
              <Statistic.Value>
                  { totalVotes }
              </Statistic.Value>
              <Statistic.Label>
                  { totalVotes !== 1 ? t('topic.poll.tab.results.votes') : t('topic.poll.tab.results.vote') }
              </Statistic.Label>
          </Statistic>
          {userVoteIndex !== -1
          && (
              <div>
                  {t('topic.poll.tab.results.user.vote')}
                  <span className="poll-voted-option">{pollOptions[userVoteIndex]}</span>
              </div>
          )}
      </>
  ), [pollOptions, t, totalVotes, userVoteIndex]);

  const panes = useMemo(() => {
    // TODO: tidy up duplicated code below using CHART_TYPE_BAR and CHART_TYPE_DONUT
    const chartBarPane = (
        <Tab.Pane attached={false}>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column />
                    <Grid.Column width={8} textAlign="center">
                        {totalVotes > 0
                          ? (
                              <PollChartBar
                                pollOptions={pollOptions}
                                voteCounts={voteCounts}
                                voterNames={voterNames}
                              />
                          )
                          : (
                              <Header as="h4">
                                  {t('topic.poll.tab.results.no.votes')}
                              </Header>
                          )}
                    </Grid.Column>
                    <Grid.Column />
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        {totalVotes > 0 && footer}
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
                    <Grid.Column width={8} textAlign="center">
                        {totalVotes > 0
                          ? (
                              <PollChartDonut
                                pollOptions={pollOptions}
                                voteCounts={voteCounts}
                                voterNames={voterNames}
                              />
                          )
                          : (
                              <Header as="h4">
                                  {t('topic.poll.tab.results.no.votes')}
                              </Header>
                          )}
                    </Grid.Column>
                    <Grid.Column />
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column textAlign="center">
                        {totalVotes > 0 && footer}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Tab.Pane>
    );

    return ([
      { menuItem: { key: 'chart-bar', icon: 'chart bar' }, render: () => chartBarPane },
      { menuItem: { key: 'chart-donut', icon: 'chart pie' }, render: () => chartDonutPane },
    ]);
  }, [footer, pollOptions, t, totalVotes, voteCounts, voterNames]);

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
  voterNames: PropTypes.arrayOf(PropTypes.array).isRequired,
  userVoteIndex: PropTypes.number,
};

export default PollGraph;
