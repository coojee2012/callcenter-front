export default (optionData) => {
  const series = [];
  optionData.series.forEach((item) => {
    series.push({
      name: item.name,
      type: optionData.type,
      stack: optionData.stack,
      data: item.data,
    });
  });

  return {
    title: {
      text: optionData.title,
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: optionData.legend,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: optionData.category,
    },
    yAxis: {
      axisLabel: {
        interval: 10,
        formatter: (val) => {
          return `${((val) * 100).toFixed(2)}%`;
        },
      },
      axisPointer: {
        label: {
          formatter: (params) => {
            return `${((params.value) * 100).toFixed(2)}%`;
          },
        },
      },
      splitNumber: 10,
      splitLine: {
        show: true,
      },
    },
    series,
  };
};
