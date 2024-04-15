<template>
  <div>
    <canvas id="ChartUcon"></canvas>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChartUcon",
  data() {
    return {
      chart: null, // Reference to the Chart.js chart instance
      data: [], // Array to store the data
      intervalId: null, // ID of the setInterval timer

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
    }, 6 * 1000); // 15 seconds
  },
  methods: {
    async fetchData() {
      try {
        const hoscode = this.$route.params.hoscode
        const an = this.$route.params.an
        const apiUrl = `https://api-onelr.lphis.org/dashboard/chart/${hoscode}/${an}`;
        const response = await axios.post(apiUrl);
        const bpData = response.data.find(item => Object.prototype.hasOwnProperty.call(item, 'bp'));
        this.data = bpData.bp.sort((a, b) => (a.update_time > b.update_time) ? 1 : -1);
        // console.log(this.data)
        this.lastValue1 = this.data[this.data.length - 1].value1;
        this.lastValue2 = this.data[this.data.length - 1].value2;
        this.lastUpdate = this.data[this.data.length - 1].update_time;

        this.diffData1 = this.data[this.data.length - 1].value1 - this.data[this.data.length - 2].value1;
        this.diffData2 = this.data[this.data.length - 1].value2 - this.data[this.data.length - 2].value2;

        // convert negative number to positive number
        // console.log("diffData1 => " + Math.abs(this.diffData1))
        // console.log("diffData2 => " + Math.abs(this.diffData2))

        // short if statement
        this.overRateLimit = Math.abs(this.diffData1) > 30 || Math.abs(this.diffData2) > 20;

        // Emit a last-value event with the lastValue as the payload
        this.$emit('last-data-bp', {
          lastValue1: this.lastValue1,
          lastValue2: this.lastValue2,
          lastUpdate: this.lastUpdate,
          overRateLimit: this.overRateLimit,
        });

      } catch (error) {
        console.error(error);
      }
    },
    renderChart() {
      const ctx = document.getElementById('ChartBp').getContext('2d');
      const labels = this.data.map(item => item.time)
      const values1 = this.data.map((item) => item.value1);
      const values2 = this.data.map((item) => item.value2);

      // console.log("value1 => " + values1)
      // console.log("value2 => " + values2)

      // const chartData1 = data.map((item) => item.value1);
      // const chartData2 = data.map((item) => item.value2);

      // eslint-disable-next-line no-undef
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'SBP',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              data: values1,
              tension: 0,

            },
            {
              label: 'DBP',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
              data: values2,
              tension: 0,

            }
          ]
        },
        options: this.chartOptions
      });
    },
    updateChart() {
      this.chart.data.labels = this.data.map(item => item.time);
      this.chart.data.datasets[0].data = this.data.map(item => item.value1);
      this.chart.data.datasets[1].data = this.data.map(item => item.value2);

      // console.log("u-value1 => " + this.data.map(item => item.value1))
      // console.log("u-value2 => " + this.data.map(item => item.value2))

      // this.chart.update();
      this.chart.options.scales.yAxes[0].ticks.max = Math.max(...this.data.map(item => item.value1));
      // this.chart.options.scales.yAxes[1].ticks.max = Math.max(...this.data.map(item => item.value2));
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