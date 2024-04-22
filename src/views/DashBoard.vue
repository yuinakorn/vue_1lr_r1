<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <!-- <div class="row d-flex justify-content-start">
        <span class="ml-2">{{ this.provName }}</span>
      </div> -->
      <div class="row d-flex justify-content-between">
        <h4 class="ml-2 mb-2" style="font-weight: 400;">ข้อมูลวันที่ {{ subdate }} - {{ currentdate }} 
        <span>( {{ this.provName }} )</span>
        </h4>
        <span class="text-muted">อัพเดทเมื่อ {{ update_time }}</span>
      </div>
      <clock-head :jdata_summary="jdata_summary" />
      <div class="card">
        <div class="card-header border-0">
          <h3 class="card-title">รายชื่อโรงพยาบาลในสังกัด แยกตาม CPD Risk Score</h3>
          <div class="card-tools">
            <a href="#" class="btn btn-tool btn-sm">
              <i class="fas fa-download"></i>
            </a>
            <a href="#" class="btn btn-tool btn-sm">
              <i class="fas fa-bars"></i>
            </a>
          </div>
        </div>
        <div class="card-body table-responsive p-0">
          <table class="table table-striped table-bordered table-valign-middle">
            <thead>
              <tr>
                <th>โรงพยาบาล</th>
                <th class="text-center"><i class="fas fa-circle mr-1 text-green"></i> เสี่ยงน้อย</th>
                <th class="text-center"><i class="fas fa-circle mr-1 text-yellow"></i> เสี่ยงปานกลาง</th>
                <th class="text-center"><i class="fas fa-circle mr-1 text-red"></i> เสี่ยงสูง</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in hospitals" :key="index">
                <td class="px-4">
                  <router-link :to="{ name: 'hospital', params: { hoscode: item.hcode } }">
                    {{ item.hosname }}
                  </router-link>
                </td>
                <td class="text-center">
                  <div class="px-3 font-badge" v-if="item.green > 0">{{ item.green }}</div>
                  <div v-else>-</div>
                </td>
                <td class="text-center">
                  <div class="px-3 font-badge" v-if="item.yellow > 0">{{ item.yellow }}</div>
                  <div v-else>-</div>
                </td>
                <td class="text-center">
                  <div class="px-3 font-badge" v-if="item.red > 0">{{ item.red }}</div>
                  <div v-else>-</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ClockHead from "@/components/ClockHead.vue";

export default {
  name: 'HospitalList',
  components: { ClockHead },
  data() {
    return {
      hospitals: [],
      sum_green: 0,
      sum_yellow: 0,
      sum_red: 0,
      jdata_summary: '',
      subdate: '',
      currentdate: '',
      update_time: ''
    }
  },
  created() {
    // decode token
    // const token = localStorage.getItem('token');
    // try {
    //   const payload = token.split('.')[1];
    //   const decoded = JSON.parse(atob(payload));
    //   console.log(decoded.hosCode);
    // } catch (error) {
    //   console.error(error);
    // }

    // this.getHospitals()
  },
  mounted() {
    this.getHospitals()
    setInterval(async () => {
      await this.getHospitals()
      // this.getTotal()
    }, 30 * 1000) // 30 sec

    this.getProvince();

  },
  methods: {
    async getProvince() {
      const token = localStorage.getItem('token')
      const hcode = JSON.parse(atob(token.split('.')[1])).hosCode
      await axios.post(process.env.VUE_APP_API_URL + '/dashboard/province/' + hcode)
        .then(response => {
          this.provName = 'จังหวัด' + response.data.province_name
        })
        .catch(error => {
          console.log(error)
        })
    },
    async getHospitals() {
      this.sum_green = 0
      this.sum_yellow = 0
      this.sum_red = 0
      this.update_time = new Date().toLocaleTimeString('th-TH', { hour12: false })
      await axios.post(process.env.VUE_APP_API_URL + '/dashboard/hospitals/')
        // await axios.post('http://localhost:8085/dashboard/hospitals/')
        .then(response => {
          this.hospitals = response.data
          // loop to sum total
          this.hospitals.forEach((item) => {
            this.sum_green += item.green
            this.sum_yellow += item.yellow
            this.sum_red += item.red
          })
          this.jdata_summary = [
            { color: 'green', name: 'CPD score เสี่ยงน้อย', value: this.sum_green },
            { color: 'yellow', name: 'CPD score เสี่ยงปานกลาง', value: this.sum_yellow },
            { color: 'red', name: 'CPD score เสี่ยงสูง', value: this.sum_red }
          ]

          const options = { year: 'numeric', month: 'long', day: 'numeric' };
          const thaiLocale = 'th-TH';
          const subdate = new Date(this.hospitals[0].subdate);
          const currentdate = new Date(this.hospitals[0].currentdate);
          this.subdate = subdate.toLocaleDateString(thaiLocale, options);
          this.currentdate = currentdate.toLocaleDateString(thaiLocale, options);

        })
        .catch(error => {
          console.log(error)
        })
    },
  }
}
</script>

<style scoped>
.font-badge {
  font-size: 1.3rem;
  /*font-weight: normal !important;*/
}

.text-green {
  color: #01a68c;
}

.text-yellow {
  color: #ffc107;
}

.text-red {
  color: #e90331 !important;
}

thead th {
  font-weight: 500 !important;
}
</style>