<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <!-- <div class="row d-flex justify-content-start">
        <span class="ml-2">{{ this.provName }}</span>
      </div> -->
      <div class="row d-flex justify-content-between">
        <h4 class="ml-2 mb-2" style="font-weight: 400;">ข้อมูลวันที่ {{ subdate }} - {{ currentdate }}
          <span>( {{ provName }} )</span>
        </h4>
        <span class="text-muted">อัพเดทเมื่อ {{ update_time }}</span>
      </div>
      <clock-head :jdata_summary="jdata_summary" />
      <div class="card">
        <div class="card-header border-0">
          <span class="card-title">รายชื่อโรงพยาบาลในสังกัด แยกตาม CPD Risk Score</span>
          <!-- <div class="card-tools">
            <a href="#" class="btn btn-tool btn-sm">
              <i class="fas fa-download"></i>
            </a>
            <a href="#" class="btn btn-tool btn-sm">
              <i class="fas fa-bars"></i>
            </a>
          </div> -->
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
                <td class="px-4 py-2 font-badge">
                  <router-link :to="{ name: 'hospital', params: { hoscode: item.hcode } }">
                    {{ item.hosname }}
                  </router-link>
                </td>
                <td class="text-center">
                  <div class="px-3 font-badge-td" v-if="item.green > 0">{{ item.green }}</div>
                  <div v-else>-</div>
                </td>
                <td class="text-center">
                  <div class="px-3 font-badge-td" v-if="item.yellow > 0">{{ item.yellow }}</div>
                  <div v-else>-</div>
                </td>
                <td class="text-center">
                  <div class="px-3 font-badge-td" v-if="item.red > 0">{{ item.red }}</div>
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
      update_time: '',
      provName: '',
      provCode: ''
    }
  },
  async created() {
    // สั่งให้ทำงานทีละขั้นตอน
    await this.getProvince(); // Wait for getProvince to finish
    await this.getHospitals(); // Then call getHospitals
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
          this.provCode = response.data.province_code
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

      let config = {
        method: "post",
        url: process.env.VUE_APP_API_URL + '/dashboard/hospitals/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          provcode: this.provCode
        }
      }
      // console.log(config)
      try {
        await axios(config)
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
      } catch (error) {
        console.log(error)
      }

    },
  }
}
</script>

<style scoped>
.card-header {
  padding: 0.3rem 1.25rem 0.1rem 1.25rem !important;
}

.font-badge {
  font-size: 1rem;
}
.font-badge-td {
  font-size: 1.1rem;
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

tr td {
  padding: 1.6rem auto !important;
}

thead th {
 font-size: 1.1rem;
}


</style>