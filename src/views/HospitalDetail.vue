<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <router-link :to="{ name: 'dashboard' }" class="breadcrumb-item">หน้าหลัก</router-link>
          <li class="breadcrumb-item active">{{ hospital_name }}</li>
        </ol>
      </nav>
      <div class="header mb-2">
        <div style="font-size: 1.3rem">{{ hospital_name }}</div>
        <span class="small text-muted">วันที่ {{ start_date }} ถึง {{ current_date }}</span>
      </div>
      <div class="row" v-for="(patient, index) in patients" :key="index">
        <div class="col">
          <div class="card card-widget">
            <div class="card-header">
              <div class="user-block">
                <img class="img-circle hover-zoom" style="width: 45px; height: 45px"
                  :src="patient.image ? patient.image : 'images/user.png'" alt="patient image">
                <div class="mb-1">
                  <span class="username" style="font-size: 1.2rem;">
                    <router-link :to="'/patient/' + patient.hcode + '/' + patient.an + '/' + patient.cid">
                      <span v-if="patient.title">{{ patient.title }}</span>
                      {{ patient.pname + " " + patient.lname }}
                    </router-link>
                    <span v-if="patient.status === 0"
                      class="alert alert-default-danger preg-status ml-2">ยังไม่คลอด</span>
                    <span v-else class="alert alert-success preg-status ml-2">คลอดแล้ว</span>
                    <span v-if="patient.hosname_consult" @click="togglePopover"
                      class="alert alert-danger-consult preg-status ml-2">
                      Consulted
                    </span>
                  </span>
                </div>

                <span class="description my-des2"><span style="font-weight: 600;">HN:</span> {{ patient.hn }}
                  <span class="ml-1" style="font-weight: 600;">AN:</span> {{ patient.an }}
                  <span class="ml-1" style="font-weight: 600;"> อายุ:</span> {{
            patient.age_y
          }} ปี</span>
                <span class="description my-des2" style="padding-top: 0.3rem;"><span
                    class="badge bg-info badge-bigger mr-1"><i class="far fa-address-card"></i> </span><span
                    style="font-weight: 600;">CID: </span> {{ patient.cid }}
                  <span class="badge bg-info badge-bigger ml-3 mr-1"><i class="fas fa-procedures"></i></span><span
                    style="font-weight: 600;">วันที่แอดมิท: </span> {{ dateFormat(patient.admit_date) }}
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
                    <span :class="scoreClass(patient.cpd_risk_score)">CPD. {{ patient.cpd_risk_score }}</span>
                    <!-- <router-link :to="'/patient/'+patient.hcode+'/'+patient.an+'/'+patient.cid"
                                 class="btn btn-outline btn-sm bg-light">
                      <i class="fas fa-external-link-alt"></i> รายละเอียด
                    </router-link> -->

                    <div class="dropdown">
                      <button class="dropbtn"><i class="fas fa-external-link-alt"></i> เพิ่มเติม</button>
                      <div class="dropdown-content">
                        <router-link :to="'/patient/' + patient.hcode + '/' + patient.an + '/' + patient.cid"><i
                            class="fas fa-eye"></i> ดูข้อมูลเพิ่ม</router-link>
                        <router-link v-if="hoscode_main === patient.hcode"
                          :to="'/backend/preg_update/' + patient.hcode + '/' + patient.cid + '/' + patient.an"><i
                            class="fas fa-edit"></i> แก้ไขประวัติ</router-link>
                        <router-link v-if="hoscode_main === patient.hcode"
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
          }} = {{ patient.weight_gain }} กก.</span>
                </div>
                <div><i class="fas fa-arrows-alt-v icon-blue ml-4"></i> ยอดมดลูก = <span class="text-muted">{{
            patient.fundal_height }} ซม.</span></div>
                <div><i class="fas fa-vial icon-blue ml-4"></i> Hematocrit = <span
                    :class="{ 'text-muted': patient.hematocrit >= 30, 'text-red beat': patient.hematocrit <= 30 }">
                    {{ patient.hematocrit }} %
                  </span></div>
                <div><i class="fas fa-baby icon-blue ml-4"></i> Ultrasound = <span
                    :class="{ 'text-muted': patient.ultrasound < 3500, 'text-red beat': patient.ultrasound >= 3500 }">{{
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
// import moment from "moment/moment";

export default {
  name: "HospitalDetail",
  data() {
    return {
      hoscode_main: '',
      pregs: [],
      patients: [],
      hospital_name: '',
      current_date: '',
      weight_gain: '',
      score: '',
      patient: {
        image: ''
      },
      sortedDataPatient: []
    }
  },
  // logic to check if the user has access to the hospital
  async beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem('token');
    const hoscode = to.params.hoscode;
    if (token) {
      try {
        let config = {
          method: "post",
          url: process.env.VUE_APP_API_URL + '/auth/hoscode_group/',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            token: token
          }
        };
        let response = await axios(config);
        let hoscode_group = response.data.hoscode_group;
        console.log("hoscode_group: ",hoscode_group);
        let hosArray = hoscode_group.split(',');
        let found = hosArray.find(item => item === hoscode);
        if (found !== undefined) {
          console.log("hoscode อยู่ในชุดข้อมูล");
          next(); // Call next to continue navigation
        } else {
          console.log("hoscode ไม่อยู่ในชุดข้อมูล");
          // eslint-disable-next-line no-undef
          alertify.alert('คำเตือน', 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้ป่วยในโรงพยาบาลนี้', function () {
            next(false); // Pass false to prevent navigation
          }).set({
            buttonClass: 'btn btn-primary'
          });
        }
      } catch (error) {
        console.error(error);
        // eslint-disable-next-line no-undef
        alertify.alert('คำเตือน!', 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้ป่วยในโรงพยาบาลนี้..', function () {
          next(false);
        }).set({
          buttonClass: 'btn btn-primary'
        });
      }
    } else {
      // Handle case when token is null
      alert('token is null')
      next(false); // Prevent navigation
    }
  },
  created() {
    // this.getPatients();
  },
  computed: {
    patientImage() {
      // console.log('data:image/jpeg;base64,' + this.patient.image)
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

    this.getPatients();
    setInterval(async () => {
      await this.getPatients();
    }, 60 * 1000) // 1 minute

    this.getCurrentDateTime();

  },

  methods: {
    dateFormat(time) {
      // const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      };
      const thaiLocale = 'th-TH';
      const datetime = new Date(time);
      return datetime.toLocaleDateString(thaiLocale, options)
    },

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
      this.hoscode = await this.$route.params.hoscode
      await axios.post(process.env.VUE_APP_API_URL + '/dashboard/hospital/' + this.hoscode)
        .then(response => {
          // this.patients = response.data;

          this.sortedDataPatient = response.data.sort((a, b) => {
            const dateA = new Date(a.admit_date);
            const dateB = new Date(b.admit_date);
            return dateB - dateA;
          });

          this.patients = this.sortedDataPatient

          this.hospital_name = response.data[0].hosname
          this.weight_gain = response.data[0].weight_at_delivery - response.data[0].weight_before_pregancy
          this.score = response.data[0].cpd_risk_score
          this.patients.image = 'data:image/jpeg;base64,' + response.data[0].image; // Prepend the Base64 data
        })
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
a {
  color: #000 !important;
}

.text-bigger {
  font-size: 1.2rem;
}

.badge {
  border-radius: 4px !important;
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

.beat {
  animation: heartbeat 1s infinite;
}

.my-des2 {
  font-size: 0.9rem;
  color: black;
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

.alert-success {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  background-color: #04c7aa !important;
  border-color: #04c7aa !important;
}


.alert {
  padding: 0.1rem 0.5rem !important;
}

.alert-default-danger {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  border: 0 !important;
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

.alert-danger {
  background-color: #fff !important;
  border-color: #fff !important;
  color: #be0315 !important;
}

.alert-danger-consult {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  color: #cd0317;
  background-color: #f2f2f2 !important;
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