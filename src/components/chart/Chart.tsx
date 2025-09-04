import React, { useRef, useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  type ChartEvent,
  type ActiveElement,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import type { ProcessedShareholderData } from '../../types';
import styles from './chart.module.scss';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface Props {
  data: ProcessedShareholderData[];
  isLoading?: boolean;
  isError?: boolean;
}

const Chart: React.FC<Props> = ({ data, isLoading, isError }) => {
  const chartRef = useRef<ChartJS<'pie'>>(null);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop'
  );

  const originalColors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#FF6384',
    '#C9CBCF',
    '#4BC0C0',
    '#FF6384',
  ];

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setScreenSize('mobile');
      } else if (width <= 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const processedData = React.useMemo(() => {
    return data.map((item) => ({
      holder: item.holder,
      share: item.share_percent_number,
    }));
  }, [data]);

  const chartData = {
    labels: processedData.map((item) => item.holder),
    datasets: [
      {
        data: processedData.map((item) => item.share),
        backgroundColor: originalColors,
        borderColor: originalColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '50%',
    plugins: {
      legend: {
        position: (screenSize === 'mobile' ? 'bottom' : 'right') as
          | 'bottom'
          | 'right',
        labels: {
          padding: 15,
          usePointStyle: true,
          boxWidth: 12,
          boxHeight: 12,
          generateLabels: function (chart: ChartJS) {
            const data = chart.data;
            if (data.labels && data.labels.length && data.datasets.length) {
              return data.labels.map((label: unknown, i: number) => {
                const dataset = data.datasets[0];
                const value = dataset.data[i] as number;
                const backgroundColor = dataset.backgroundColor as string[];
                const borderColor = dataset.borderColor as string[];
                return {
                  text: `${String(label)}: ${value.toFixed(2)}%`,
                  fillStyle: backgroundColor[i],
                  strokeStyle: borderColor[i],
                  lineWidth: 1,
                  pointStyle: 'circle' as const,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
        onClick: function (
          _e: ChartEvent,
          legendItem: { index?: number },
          legend: { chart: ChartJS }
        ) {
          if (typeof legendItem.index === 'number') {
            const index = legendItem.index;
            const chart = legend.chart;
            const meta = chart.getDatasetMeta(0);
            const element = meta.data[index] as { hidden?: boolean };
            element.hidden = !element.hidden;
            chart.update();
          }
        },
      },
      title: {
        display: true,
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: { label?: string; parsed: number }) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
      },
    },
    onHover: (_event: ChartEvent, elements: ActiveElement[]) => {
      const chart = chartRef.current;
      if (chart) {
        const dataset = chart.data.datasets[0];

        if (elements.length > 0) {
          const hoveredIndex = elements[0].index;
          dataset.backgroundColor = originalColors.map((color, index) =>
            index === hoveredIndex ? color : color + '40'
          );
        } else {
          dataset.backgroundColor = originalColors;
        }
        chart.update();
      }
    },
  };

  if (isError) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
          color: 'red',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Ошибка загрузки данных для графика
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '50px',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Загрузка графика...
      </div>
    );
  }

  return (
    <div className={styles.chartContainer}>
      <Pie ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default Chart;
