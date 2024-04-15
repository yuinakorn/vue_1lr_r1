<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>

<script>
export default {
  name: "ChartComponent",
  mounted() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 60 * 1000);
  },
  methods: {
    fetchData() {
      fetch('http://localhost:3003/')
          .then(response => response.json())
          .then(data => {
            const chartData = data.map(item => ({
              time: item.time,
              value: item.value,
            }));
            this.renderChart(chartData);
          })
          .catch(error => {
            console.error(error);
          });
    },

    renderChart(data) {
      const ctx = document.getElementById('myChart').getContext('2d');
      const labels = data.map((item) => item.time);
      const chartData = data.map((item) => item.value);
      // เอามาจาก cdn แล้ว
      // eslint-disable-next-line no-undef
      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Heart Rate',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            // lineTension: 0.5,
            data: chartData,
          }]
        },
        options: {
          animation: {
            duration: 0, // disable animations on initial render
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },

        },
      });
    },

  }
}
</script>

<style scoped>

</style>