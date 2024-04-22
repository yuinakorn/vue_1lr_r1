<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <div class="header mb-2">
        <span class="text-muted">วันที่ {{ start_date }} ถึง {{ current_date }}</span>
      </div>
      <div class="row" v-for="(patient, index) in patients" :key="index">
        <div class="col-md-12 col-lg-12">
          <div class="card">
            <div class="card-header border-1"
              style="padding-top: 0.2rem!important; padding-bottom: 0!important; border-bottom: 0">
              <span class="ml-1 fw-600">{{ patient.hosname }}</span>
            </div>
            <div class="card-header" style="padding-top: 0.2rem!important;">
              <div class="user-block">
                <img class="img-circle hover-zoom pt-picture" style="width: 45px; height: 45px;"
                  :src="patient.image ? patient.image : 'images/user.png'" alt="patient_picture">
                <div class="mb-1">
                  <span class="username" style="font-size: 1.2rem;">
                    <router-link :to="'/patient/' + patient.hcode + '/' + patient.an + '/' + patient.cid">
                      <span v-if="patient.title">{{ patient.title }}</span>
                      {{ patient.pname + " " + patient.lname }}
                    </router-link>
                    <span v-if="patient.status === 0"
                      class="alert alert-default-danger preg-status ml-2">ยังไม่คลอด</span>
                    <span v-else class="alert alert-success preg-status ml-2">คลอดแล้ว</span>
                    <span v-if="patient.hosname_consult"
                      class="alert alert-danger-consult preg-status ml-2 pointer">
                      Consulted
                    </span>
                  </span>
                </div>
                <span class="description my-des2"><span style="color: black!important;">HN:</span> {{ patient.hn }}
                  <span class="ml-1" style="color: black!important;">AN:</span> {{ patient.an }}
                  <span class="ml-1" style="color: black!important;"> อายุ:</span> {{ patient.age_y }} ปี</span>

                <span class="description my-des2"><span class="badge bg-info badge-bigger mr-1"><i
                      class="far fa-address-card mr-1"></i></span>{{ patient.cid }}
                  <span class="badge bg-info badge-bigger ml-3 mr-1"><i class="fas fa-procedures"></i></span> {{
                    dateFormat(patient.admit_date) }} น.
                </span>

              </div>
              <!-- /.user-block -->
              <div class="card-tools" style="padding-right: 1rem">
                <div class="row">
                  <div class="col">
                  </div>
                  <div class="col-auto">
                    <span v-if="patient.hematocrit <= 30" class="alert alert-danger pulse">hematocrit ต่ำกว่า 30%</span>

                    <span v-if="patient.ultrasound >= 3500" class="alert alert-danger pulse ml-3">น้ำหนักเด็ก(U/S)เกิน
                      3500 กรัม</span>
                    <!--                    <span class="ml-4"></span>-->
                    <span :class="scoreClass(patient.cpd_risk_score)"> CPD. {{ patient.cpd_risk_score }}</span>
                    <!-- <router-link :to="'/patient/'+patient.hcode+'/'+patient.an+'/'+patient.cid"
                                 class="btn btn-outline btn-sm bg-light">
                      <i class="fas fa-external-link-alt"></i> รายละเอียด
                    </router-link> -->

                    <div class="dropdown">
                      <button class="dropbtn"><i class="fas fa-external-link-alt"></i> เพิ่มเติม</button>
                      <div class="dropdown-content">
                        <router-link :to="'/patient/' + patient.hcode + '/' + patient.an + '/' + patient.cid"><i
                            class="fas fa-eye"></i> ดูข้อมูลเพิ่ม</router-link>
                        <router-link v-if="this.hoscode_main === patient.hcode"
                          :to="'/backend/preg_update/' + patient.hcode + '/' + patient.cid + '/' + patient.an"><i
                            class="fas fa-edit"></i> แก้ไขประวัติ</router-link>
                        <router-link v-if="this.hoscode_main === patient.hcode"
                          :to="'/backend/progress_list/' + patient.hcode + '/' + patient.cid + '/' + patient.an + '/' + patient.hn"><i
                            class="fas fa-clipboard"></i> บันทึก progress</router-link>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
              <!-- /.card-tools -->
            </div>

            <div class="card-footer">
              <div class="row">
                <div><i class="fas fa-venus-mars icon-blue ml-4"></i> ครรภ์ที่ = <span class="text-muted">{{
          patient.gravida }}</span></div>
                <div><i class="fas fa-stethoscope icon-blue ml-4"></i> ANC = <span class="text-muted">{{
          patient.no_of_anc }} ครั้ง</span>
                </div>
                <div><i class="fas fa-child icon-blue ml-4"></i> GA = <span class="text-muted">{{
          patient.ga
        }} สัปดาห์</span></div>
                <div><i class="fas fa-ruler-vertical icon-blue ml-4"></i> ส่วนสูง = <span class="text-muted">{{
            patient.height }} ซม.</span>
                </div>
                <div><i class="fas fa-weight icon-blue ml-4"></i> ส่วนต่าง นน. <span class="text-muted">{{
          patient.weight_before_pregancy }} → {{
          patient.weight_at_delivery
        }} = {{ patient.weight_gain }} กก.</span></div>
                <div><i class="fas fa-arrows-alt-v icon-blue ml-4"></i> ยอดมดลูก = <span class="text-muted">{{
          patient.fundal_height }} ซม.</span></div>
                <div><i class="fas fa-vial icon-blue ml-4"></i> Hematocrit = <span
                    :class="{ 'text-muted': patient.hematocrit >= 30, 'text-red beat': patient.hematocrit <= 30 }">
                    {{ patient.hematocrit }} %
                  </span></div>
                <div><i class="fas fa-baby icon-blue ml-4"></i> Ultrasound = <span
                    :class="{ 'text-muted': patient.ultrasound < 3500, 'text-red beat': patient.ultrasound >= 3500}">{{
                    patient.ultrasound
                    }} กรัม</span></div>
              </div>
            </div>
            <!-- /.card-footer -->
          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "PregAll",
  data() {
    return {
      hoscode_main: '',
      pregs: [],
      patients: [],
      hospital_name: '',
      current_date: '',
      update_time: '',
      score: '',
      patient: {
        image: ''
      },
      consultHosName: '',
      isConsulted: false,
      // isPopoverVisible: false,
    }
  },
  async created() {
    await this.getPatients();
  },
  computed: {
    patientImage() {
      console.log('data:image/jpeg;base64,' + this.patient.image)
      return 'data:image/jpeg;base64,' + this.patient.image;
    }
  },
  mounted() {

    const token = localStorage.getItem('token');
    this.hoscode_main = JSON.parse(atob(token.split('.')[1])).hosCode;

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const thaiLocale = 'th-TH';
    // console.log(date);
    this.current_date = new Date().toLocaleDateString(thaiLocale, options)

    setInterval(() => {
      this.getPatients();
    }, 30 * 1000) // 30 seconds

    this.getCurrentDateTime();
  },

  methods: {
    // showPopover () {
    //   this.isPopoverVisible = true;
    //   console.log(this.isPopoverVisible)
    // },
    // hidePopover () {
    //   this.isPopoverVisible = false;
    //   console.log(this.isPopoverVisible)
    // },

    async getCurrentDateTime() {
      try {
        // Using a public time server endpoint
        const timeServerUrl = 'https://worldtimeapi.org/api/timezone/Asia/Bangkok';

        // Making a GET request to the time server endpoint
        const response = await fetch(timeServerUrl);
        const data = await response.json();

        // Parse the date and time from the response
        const datetime = new Date(data.utc_datetime);

        // current date with Thai locale
        this.current_date = datetime.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' });
        this.start_date = new Date(new Date().setDate(new Date().getDate() - 7)).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (error) {
        console.error('Error fetching date and time:', error);
      }
    },
    async getPatients() {
      this.update_time = new Date().toLocaleTimeString('th-TH', { hour12: false })
      const token = localStorage.getItem('token');
      let payload = JSON.stringify({
        "token": token,
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.VUE_APP_API_URL + '/dashboard/patients/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      };

      await axios.request(config)
        .then((response) => {
          this.patients = response.data;
          this.patient.image = 'data:image/jpeg;base64,' + response.data[0].image; // Prepend the Base64 data
          // console.log(this.patients);

        })
        .catch((error) => {
          console.log(error);
        });
    },

    dateFormat(time) {
      // const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      const thaiLocale = 'th-TH';
      const datetime = new Date(time);
      return datetime.toLocaleDateString(thaiLocale, options)
    },

    scoreClass(cpd_risk_score) {
      if (cpd_risk_score >= 0 && cpd_risk_score < 5) {
        return 'badge px-2 mr-2 rounded-pill text-bigger mr-3 ml-3 bg-success';
      } else if (cpd_risk_score >= 5 && cpd_risk_score <= 9.5) {
        return 'badge px-2 mr-2 rounded-pill text-bigger mr-3 ml-3 bg-warning';
      } else if (cpd_risk_score > 9.5) {
        return 'badge px-2 mr-2 rounded-pill text-bigger pulse mr-3 ml-3 bg-danger';
      }
    }
  },
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

.fw-600 {
  font-weight: 600;
}

a {
  color: #000;
}

.text-bigger {
  font-size: 1.2rem;
}

.badge-bigger {
  font-size: 0.7rem;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.3);
  }

  100% {
    transform: scale(1);
  }
}

.heartbeat {
  animation: heartbeat 1s infinite;
}

.my-des2 {
  font-size: 0.9rem;
}

.icon-blue {
  color: #58a7ff;
}

.bg-success {
  background-color: #04c7aa !important;
  border-color: #04c7aa !important;
}

.bg-success:hover {
  background-color: #02d9b9 !important;
  border-color: #02d9b9 !important;
}

.bg-info {
  background-color: #33bacf !important;
  border-color: #33bacf !important;
}

.hover-zoom {
  transition: transform 0.3s ease;
}

.hover-zoom:hover {
  transform: scale(2.5);
}

.alert {
  padding: 0.1rem 0.5rem !important;
}

.alert-default-danger {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  border: 0 !important;
}

.alert-success {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  background-color: #04c7aa !important;
  border-color: #04c7aa !important;
}

.preg-status {
  font-size: 0.9rem;
  font-weight: 400;
}

.pulse {
  cursor: pointer;
  box-shadow: 0 0 0 rgb(201, 50, 37);
  animation: pulse 2s infinite;
}

.pulse:hover {
  animation: none;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgb(201, 50, 37);
    /* transform: scale(1); */
  }

  70% {
    -webkit-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 13px rgba(204, 169, 44, 0);
    /* transform: scale(1.1); */
  }

  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    /* transform: scale(1); */
  }
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgb(201, 50, 37);
    box-shadow: 0 0 0 0 rgb(201, 50, 37);
    /*transform: scale(1);*/
  }

  70% {
    -moz-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 13px rgba(204, 169, 44, 0);
    /* transform: scale(1.1); */
  }

  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    /* transform: scale(1); */
  }
}

.badge {
  border-radius: 4px !important;
}

.alert-danger-consult {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  color: #be0315;
  background-color: #f2f2f2 !important;
}

.alert-danger {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #cd0317 !important;
}

.bg-danger {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #cd0317 !important;
}

.bg-warning {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #ffc107 !important;
}

.bg-success {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #00d181 !important;
}

.bg-light {
  background-color: #ced8e2 !important;
  border-color: #ced8e2 !important;
}

.dropbtn {
  background-color: #ced8e3;
  color: #1f2d3d;
  padding: 3px 10px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #ced8e3;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #b8c6d4;
}

</style>