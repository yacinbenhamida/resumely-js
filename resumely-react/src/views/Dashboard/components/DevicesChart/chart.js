// Palette
import palette from 'theme/palette';

// Chart data
export const data = {
  datasets: [
    {
      data: [63, 15, 22],
      backgroundColor: [
        palette.primary.main,
        palette.danger.main,
        palette.warning.main
      ],
      borderWidth: 8,
      borderColor: palette.common.white,
      hoverBorderColor: palette.common.white
    }
  ],
  labels: ['Desktop', 'Tablet', 'Mobile']
};

// Chart options
export const options = {
  legend: {
    display: false,
    position : 'bottom',
  },
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  cutoutPercentage: 70,
  layout: { padding: 0 },
  tooltips: {
    enabled: true,
    mode: 'index',
    intersect: true,
    borderWidth: 0,
    borderColor: palette.border,
  }
};
