import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Grid,
  Header, Statistic, Tab,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PollChartBar from './PollChartBar';
import PollChartDonut from './PollChartDonut';
import './styles.css';
import { CHART_TYPE_BAR, CHART_TYPE_DONUT } from '../../../constants/polls/PollGraph';

const PollGraph = (props) => {
  const {
    pollOptions, userVoteIndex, voteCounts, voterNames,
  } = props;
  const [totalVotes, setTotalVotes] = useState(
    voteCounts.reduce((accumulator, voteCount) => accumulator + voteCount, 0),
  );
  const { t } = useTranslation();

  useEffect(() => {
    setTotalVotes(voteCounts.reduce((accumulator, voteCount) => accumulator + voteCount, 0));
  }, [voteCounts]);

  const footer = useMemo(() => (
      <div>
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
      </div>
  ), [pollOptions, t, totalVotes, userVoteIndex]);

  function calculateChartBarWidth(nOptions) {
    if (nOptions < 6) return 8;
    if (nOptions < 10) return 10;
    if (nOptions < 14) return 12;
    if (nOptions < 18) return 14;
    return 16;
  }

  function calculateChartDonutWidth(nOptions) {
    if (nOptions < 10) return 8;
    if (nOptions < 16) return 10;
    return 12;
  }

  const generatePane = useCallback(
    (type) => (
        <Tab.Pane attached={false}>
            <Grid columns="equal">
                <Grid.Row>
                    <Grid.Column />
                    <Grid.Column
                      width={type === CHART_TYPE_BAR
                        ? calculateChartBarWidth(pollOptions.length)
                        : calculateChartDonutWidth(pollOptions.length)}
                      textAlign="center"
                    >
                        {type === CHART_TYPE_BAR
                          ? (
                              <PollChartBar
                                pollOptions={pollOptions}
                                voteCounts={voteCounts}
                                voterNames={voterNames}
                              />
                          ) : (
                              <PollChartDonut
                                pollOptions={pollOptions}
                                voteCounts={voteCounts}
                                voterNames={voterNames}
                              />
                          )}
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
    ),
    [footer, pollOptions, voteCounts, voterNames],
  );

  const panes = useMemo(() => {
    const chartBarPane = generatePane(CHART_TYPE_BAR);
    const chartDonutPane = generatePane(CHART_TYPE_DONUT);

    return ([
      { menuItem: { key: 'chart-bar', icon: 'chart bar' }, render: () => chartBarPane },
      { menuItem: { key: 'chart-donut', icon: 'chart pie' }, render: () => chartDonutPane },
    ]);
  }, [generatePane]);
  return useMemo(() => (
      <>
          {totalVotes > 0
            ? (
                <Tab
                  menu={{ secondary: true }}
                  panes={panes}
                />
            )
            : (
                <Header as="h4" textAlign="center">
                    {t('topic.poll.tab.results.no.votes')}
                </Header>
            )}
      </>
  ), [panes, t, totalVotes]);
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
