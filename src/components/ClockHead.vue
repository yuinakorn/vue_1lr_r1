<template>
  <div class="row">
    <div class="col-lg-3 col-6" v-for="(item,index) in jdata_summary" :key="index">
      <div :class="getBoxClass(item.color)">
        <div class="inner">
          <p style="font-size: 1.1rem"><i class="fas fa-circle mr-1"></i><span style="color: black;">{{ item.name }}</span></p>
          <h3 style="font-weight: 400;">{{ item.value }}<sup class="text-muted" style="font-size: 20px; font-weight: normal;"> ราย</sup></h3>
        </div>
        <div class="icon">
          <i class="ion ion-stats-bars"></i>
        </div>
<!--        <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>-->
      </div>
    </div>
    <div class="col-lg-3 col-6">
      <div class="small-box bg-info">
        <div class="inner text-center">
          <p style="font-size: 1.1rem">เวลาปัจจุบัน</p>
          <h3 style="font-weight: 400;">{{ currentTime }}</h3>
        </div>
        <div class="icon">
          <i class="ion ion-bag"></i>
        </div>
<!--        <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>-->
      </div>
    </div>

  </div>

</template>

<script>
export default {
  name: "ClockHead",
  props: ["jdata_summary"],
  data() {
    return {
      currentTime: null
    };
  },
  mounted() {
    // setInterval(() => {
    //   const now = new Date();
    //   const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
    //   const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
    //   const seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();
    //   this.currentTime = `${hours}:${minutes}:${seconds}`;
    // }, 1000);

    const updateCurrentTime = () => {
      fetch('https://worldtimeapi.org/api/timezone/Asia/Bangkok')
        .then(response => response.json())
        .then(data => {
          // Extract the current time from the API response
          const currentTime = new Date(data.utc_datetime);

          // Format the time as H:i:s
          const hours = currentTime.getHours() < 10 ? `0${currentTime.getHours()}` : currentTime.getHours();
          const minutes = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
          const seconds = currentTime.getSeconds() < 10 ? `0${currentTime.getSeconds()}` : currentTime.getSeconds();
          const formattedTime = `${hours}:${minutes}:${seconds}`;

          // Update currentTime data property
          this.currentTime = formattedTime;
        })
        .catch(error => {
          console.error('Error fetching time:', error);
        });
    };
    // Call the function immediately to update the time initially
    updateCurrentTime();

    // Call the function repeatedly at intervals of 1 second
    setInterval(updateCurrentTime, 1000);

  },
  methods: {
    getBoxClass(color) {
      if (color === 'green') {
        return 'small-box bg-success';
      } else if (color === 'yellow') {
        return 'small-box bg-warning';
      } else {
        return 'small-box bg-danger';
      }
    }
  }
}
</script>

<style scoped>
.clock {
  text-align: center;
  background-color: #343a40;
  padding: 0.5rem 0.3rem;
  display: inline-block;
  border-radius: 10px;
  width: 13rem;
  margin-bottom: 1rem;
}

.time {
  color: #ec2f7b;
  font-size: 48px;
  font-weight: bold;
}

h3 {
  font-size: 3rem !important;
  line-height: 2.4rem !important;
}

.small-box > .inner {
  padding-bottom: 3px !important;
  padding-left: 1.5rem !important;
}

.bg-info {
  background-color: #fff !important;
  color: #343A40 !important;
}

.bg-success {
  background-color: #fff !important;
  /* color: #01a68c !important; */
  color: #28a745 !important;
}

.bg-success h3 {
  color: black!important;
}

.bg-danger {
  background-color: #fff !important;
  /* color: #de163d !important; */
  color: #e90331 !important;
}

.bg-danger h3 {
  color: black!important;
}

.bg-warning {
  background-color: #fff !important;
  /* color: #ea9114 !important; */
  color: #ffc107 !important;
}

.bg-warning h3 {
  color: black!important;
}
</style>