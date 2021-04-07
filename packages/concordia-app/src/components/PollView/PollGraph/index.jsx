import React, { useEffect, useMemo, useState } from 'react';
import { Grid, Statistic, Tab } from 'semantic-ui-react';
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
    const chartBarPane = (
        <Tab.Pane attached={false}>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column />
                    <Grid.Column width={8}>
                        <PollChartBar
                          pollOptions={pollOptions}
                          voteCounts={voteCounts}
                          voterNames={voterNames}
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
                          voterNames={voterNames}
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
  }, [footer, pollOptions, voteCounts, voterNames]);

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
