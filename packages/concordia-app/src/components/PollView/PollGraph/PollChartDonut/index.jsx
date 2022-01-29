import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { CHART_TYPE_DONUT } from '../../../../constants/polls/PollGraph';

const PollChartDonut = (props) => {
  const { pollOptions, voteCounts, voterNames } = props;

  const chartOptions = useMemo(() => ({
    chart: {
      id: 'chart-donut',
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
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
      enabled: true,
      fillSeriesColor: false,
      y: {
        formatter(value, { seriesIndex }) {
          return `<div>${voterNames[seriesIndex].join('</div><div>')}</div>`;
        },
        title: {
          formatter: () => null,
        },
      },
    },
    legend: {
      position: 'bottom',
    },
  }), [pollOptions, voterNames]);

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
