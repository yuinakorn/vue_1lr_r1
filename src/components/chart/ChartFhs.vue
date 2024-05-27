<template>
  <div>
    <canvas id="ChartFhs"></canvas>
  </div>
</template>

<script>
import axios from 'axios';
// import Chart from 'chart.js';
export default {
  name: "ChartFhs",
  data() {
    return {
      lastValue: 0,
      chart: null, // Reference to the Chart.js chart instance
      data: '', // Array to store the data
      intervalId: null, // ID of the setInterval timer
      //apiUrl: 'http://localhost:8085/dashboard/chart', // API URL
      chartOptions: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            }
          }]
        },
        animation: {
          duration: 0, // disable animations on initial render
        },
      }
    };
  },
  async mounted() {
    // Fetch data from API and render chart
    await this.fetchData();
    await this.renderChart();

    // Set up timer to periodically update chart with new data
    this.intervalId = setInterval(async () => {
      await this.fetchData();
      this.updateChart();
    }, 30 * 1000); // 30 seconds
  },
  methods: {
    async fetchData() {
      try {
        const hoscode = this.$route.params.hoscode
        const an = this.$route.params.an
        const apiUrl = process.env.VUE_APP_API_URL + `/dashboard/chart/${hoscode}/${an}`;
        const response = await axios.post(apiUrl)
        const fhsData = response.data.find(item => Object.prototype.hasOwnProperty.call(item, 'fhs'));
        // const fhsValues = fhsData.fhs.map(item => item.value);
        // console.log("fhs values => ", fhsData)
        // sort by time ascending (ASC)
        this.data = fhsData.fhs.sort((a, b) => (a.update_time > b.update_time) ? 1 : -1);

        // Get the last value from the API data
        this.lastValue = this.data[this.data.length - 1].value;
        this.lastUpdate = this.data[this.data.length - 1].update_time;

        //  set rate limit here
        // set rate limit < 110 or > 170

        this.overRateLimit = Math.abs(this.data[this.data.length - 1].value) < 110 || Math.abs(this.data[this.data.length - 1].value) > 170;

        // Emit a last-value event with the lastValue as the payload
        this.$emit('last-data-fhs', {
          lastValue: this.lastValue,
          lastUpdate: this.lastUpdate,
          overRateLimit: this.overRateLimit
        });

        // console.log(this.lastValue)
      } catch (error) {
        console.error(error);
      }
    },
    renderChart() {
      const ctx = document.getElementById('ChartFhs').getContext('2d');
      // const ctx = this.$refs.myChart.getContext('2d');
      const labels = this.data.map(item => item.time)
      const values = this.data.map((item) => item.value);
      // eslint-disable-next-line no-undef
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'FHS',
            data: values,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1
          }]
        },
        options: this.chartOptions
      });
    },
    updateChart() {
      this.chart.data.labels = this.data.map(item => item.time);
      this.chart.data.datasets[0].data = this.data.map(item => item.value);
      // this.chart.update();
      this.chart.options.scales.yAxes[0].ticks.max = Math.max(...this.data.map(item => item.value));
      // Animate the chart with the new data
      this.chart.update({
        duration: 500, // Duration of the animation in milliseconds
        easing: 'linear' // Easing function to use for the animation
      });
    }
  },
  beforeUnmount() {
    clearInterval(this.intervalId); // Clear the setInterval timer when the component is destroyed
  }

}
</script>

<style scoped>

</style>