import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { Grid, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CASTED_OPTION_COLOR, DEFAULT_OPTION_COLOR } from '../../../constants/polls/PollGraph';

const PollGraph = (props) => {
  const {
    pollOptions, voteCounts, hasUserVoted, selectedOptionIndex,
  } = props;
  const { t } = useTranslation();

  const chartOptions = useMemo(() => ({
    chart: {
      id: 'topic-poll',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    colors: [
      (value) => {
        if (hasUserVoted && value.dataPointIndex === selectedOptionIndex) {
          return CASTED_OPTION_COLOR;
        }
        return DEFAULT_OPTION_COLOR;
      },
    ],
    xaxis: {
      categories: pollOptions,
    },
  }), [hasUserVoted, pollOptions, selectedOptionIndex]);

  const chartSeries = useMemo(() => [{
    name: 'votes',
    data: voteCounts,
  }], [voteCounts]);

  return (
      <Grid columns="equal">
          <Grid.Row>
              <Grid.Column />
              <Grid.Column width={8}>
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="bar"
                  />
              </Grid.Column>
              <Grid.Column />
          </Grid.Row>
          <Grid.Row>
              <Grid.Column textAlign="center">
                  <Header as="h4">
                      {t('topic.poll.tab.results.votes.count', {
                        totalVotes: voteCounts.reduce((accumulator, voteCount) => accumulator + voteCount, 0),
                      })}
                  </Header>
              </Grid.Column>
          </Grid.Row>
      </Grid>
  );
};

PollGraph.defaultProps = {
  hasUserVoted: false,
  selectedOptionIndex: '',
};

PollGraph.propTypes = {
  pollOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  voteCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
  hasUserVoted: PropTypes.bool,
  selectedOptionIndex: PropTypes.string,
};

export default PollGraph;
