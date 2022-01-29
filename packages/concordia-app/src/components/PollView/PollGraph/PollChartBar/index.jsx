import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { CHART_TYPE_BAR } from '../../../../constants/polls/PollGraph';

const PollChartBar = (props) => {
  const { pollOptions, voteCounts, voterNames } = props;

  const chartOptions = useMemo(() => ({
    chart: {
      id: 'chart-bar',
    },
    theme: {
      palette: 'palette8',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    xaxis: {
      categories: pollOptions,
      tickAmount: 1,
      labels: {
        formatter(val) {
          if (val.toFixed) return val.toFixed(0);
          return val;
        },
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
      y: {
        formatter(value, { dataPointIndex }) {
          return `<div>${voterNames[dataPointIndex].join('</div><div>')}</div>`;
        },
        title: {
          formatter: () => null,
        },
      },
    },
  }), [pollOptions, voterNames]);

  const chartSeries = useMemo(() => [{
    name: 'Votes',
    data: voteCounts,
  }], [voteCounts]);

  return (
      <Chart
        options={chartOptions}
        series={chartSeries}
        type={CHART_TYPE_BAR}
      />
  );
};

PollChartBar.propTypes = {
  pollOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  voteCounts: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default PollChartBar;
