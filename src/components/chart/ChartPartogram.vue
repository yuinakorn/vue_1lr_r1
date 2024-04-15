<template>
  <div>
    <canvas id="ChartPartogram"></canvas>
  </div>
</template>

<script>
import axios from 'axios';
// import Chart from 'chart.js';
export default {
  name: "ChartPartogram",
  data() {
    return {
      lastValue: 0,
      chart: null, // Reference to the Chart.js chart instance
      data: '', // Array to store the data
      intervalId: null, // ID of the setInterval timer
      slowPartogram: false,
      chartOptions: {
        // maintainAspectRatio: false,
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
      },
      options: {
        responsive: true,
        height: 400
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
    }, 30 * 1000); // Update chart every 30 seconds
  },
  methods: {
    async fetchData() {
      try {
        const hoscode = this.$route.params.hoscode
        const an = this.$route.params.an
        const apiUrl = `https://api-onelr.lphis.org/dashboard/chart/${hoscode}/${an}`;
        const response = await axios.post(apiUrl);
        const cervixData = response.data.find(item => Object.prototype.hasOwnProperty.call(item, 'cervix_open'));
        this.data = cervixData.cervix_open.sort((a, b) => (a.update_time > b.update_time) ? 1 : -1);
        // this.data = response.data.partogram;
        // console.log(this.data)
        // Get the last value from the API data
        this.lastValue = this.data[this.data.length - 1].value;
        this.lastUpdate = this.data[this.data.length - 1].update_time;

        //  set rate limit here
        this.overRateLimit = Math.abs(this.data[this.data.length - 1].value) >= 10;
        // console.log('partogram => '+this.overRateLimit)

        // Emit a last-value event with the lastValue as the payload
        this.$emit('last-data-partogram', {
          lastValue: this.lastValue,
          lastUpdate: this.lastUpdate,
          overRateLimit: this.overRateLimit,
          // extra for Partogram chart
          // slowRateAlert: this.slowRateAlert
        });

        // console.log(this.lastValue)
      } catch (error) {
        console.error(error);
      }
    },
    calculateFirstValue(firstValue, values) {
      var newValues = '';
      if (firstValue === '3') {
        const repeatedValue = Array(8).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '4') {
        const repeatedValue = Array(9).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '5') {
        const repeatedValue = Array(10).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '6') {
        const repeatedValue = Array(11).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '7') {
        const repeatedValue = Array(12).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '8') {
        const repeatedValue = Array(13).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '9') {
        const repeatedValue = Array(14).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else if (firstValue === '10') {
        const repeatedValue = Array(15).fill(firstValue);
        newValues = repeatedValue.concat(values);
      } else {
        const repeatedValue = Array(8).fill(firstValue);
        newValues = repeatedValue.concat(values);
      }
      return newValues;
    },
    renderChart() {
      const ctx = document.getElementById('ChartPartogram').getContext('2d');
      // const ctx = this.$refs.myChart.getContext('2d');

      // value to plot on the chart
      // const labels = this.data.map(item => item.time)
      const values = this.data.map((item) => item.value);
      // find the first value and repeat it 10 times
      const firstValue = values[0];
      var newValues = this.calculateFirstValue(firstValue, values);

      var lastThree = values.slice(-3);
      if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
        this.slowPartogram = true;
        this.$emit('slow-partogram', {
          slowPartogram: this.slowPartogram
        });
      } else {
        this.slowPartogram = false;
        this.$emit('slow-partogram', {
          slowPartogram: this.slowPartogram
        });
      }

      // eslint-disable-next-line no-undef
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          // labels: Array.from({length: 24}, (_, i) => `${i + 1} hours`),
          // labels: Array.from({length: 24}, (_, i) => `${i + 1} `),
          labels: Array.from({length: 25}, (_, i) => i),
          datasets: [
            {
              label: 'Cervix length',
              // data: [1, 2, 3, 4, 5, 5, 5],
              data: newValues,
              borderColor: 'rgb(5,204,157)',
              backgroundColor: 'rgba(105,189,168,0.2)',
              borderWidth: 2,
              tension: 0,
              fill: true
            },
            {
              label: 'Alert line',
              data: [3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10],
              borderColor: 'red',
              borderWidth: 2,
              tension: 0,
              fill: false
            },
            {
              label: 'Action line',
              data: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10],
              borderColor: 'blue',
              borderWidth: 2,
              tension: 0,
              fill: false
            },

          ]
        },
        options: this.chartOptions
      });
    },
    updateChart() {
      // this.chart.data.labels = this.data.map(item => item.time);
      // this.chart.data.labels = Array.from({length: 24}, (_, i) => `${i + 1} hours`)
      this.chart.data.labels = Array.from({length: 25}, (_, i) => i);

      // original code
      // this.chart.data.datasets[2].data = this.data.map(item => item.value);
      const values = this.data.map((item) => item.value);
      // find the first value and repeat it 10 times
      const firstValue = values[0];
      // original code
      // const repeatedValue = Array(10).fill(firstValue);
      // this.chart.data.datasets[0].data = repeatedValue.concat(values);
      this.chart.data.datasets[0].data = this.calculateFirstValue(firstValue, values)

      var lastThree = values.slice(-3);
      if (lastThree[0] === lastThree[1] && lastThree[1] === lastThree[2]) {
        this.slowPartogram = true;
        this.$emit('slow-partogram', {
          slowPartogram: this.slowPartogram
        });
      } else {
        this.slowPartogram = false;
        this.$emit('slow-partogram', {
          slowPartogram: this.slowPartogram
        });
      }

      // this.chart.update();

      // this.chart.options.scales.yAxes[0].ticks.max = Math.max(...this.data.map(item => item.value));
      // max of chart limit 10 cm
      this.chart.options.scales.yAxes[0].ticks.max = 10;

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