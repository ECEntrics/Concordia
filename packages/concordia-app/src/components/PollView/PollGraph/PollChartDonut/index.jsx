import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { CHART_TYPE_DONUT } from '../../../../constants/polls/PollGraph';

const PollChartDonut = (props) => {
  const { pollOptions, voteCounts } = props;

  const chartOptions = useMemo(() => ({
    chart: {
      id: 'chart-donut',
    },
    theme: {
      palette: 'palette8',
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
          },
        },
      },
    },
    labels: pollOptions,
    tooltip: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
    },
  }), [pollOptions]);

  return (
      <Chart
        options={chartOptions}
        series={voteCounts}
        type={CHART_TYPE_DONUT}
      />
  );
};

PollChartDonut.propTypes = {
  pollOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  voteCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PollChartDonut;
