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
        <div style="font-size: 1.6rem">{{ hospital_name }}</div>
        <span class="small text-muted">{{ current_date }}</span>
      </div>
      <div class="row" v-for="(patient,index) in patients" :key="index">
        <div class="col">
          <div class="card card-widget">
            <div class="card-header">
              <div class="user-block">
                <img class="img-circle hover-zoom" style="width: 45px; height: 45px"
                     :src="patient.image ? patient.image : 'images/user.png'"
                     alt="patient image">
                <div class="mb-1">
                  <router-link :to="'/patient/'+patient.hcode+'/'+patient.an+'/'+patient.cid">
                  <span class="username" style="font-size: 1.2rem;"><a href="#">
                    <span v-if="patient.title">{{ patient.title }}</span>
                    {{ patient.pname + " " + patient.lname }}</a>
                      <span v-if="patient.status === 0"
                            class="alert alert-default-danger preg-status ml-2">ยังไม่คลอด</span>
                      <span v-else class="alert alert-success preg-status ml-2">คลอดแล้ว</span>
                  </span>
                  </router-link>
                </div>

                <span class="description my-des2"><span style="color: black!important;">HN:</span> {{ patient.hn }}
                  <span class="ml-1" style="color: black!important;">AN:</span> {{ patient.an }}
                  <span class="ml-1" style="color: black!important;"> อายุ:</span> {{
                    patient.age_y
                  }} ปี</span>
                <span class="description my-des2" style="padding-top: 0.3rem;"><span
                    class="badge bg-info badge-bigger mr-1"><i
                    class="far fa-address-card"></i> </span>{{ patient.cid }}
                <span class="badge bg-info badge-bigger ml-3 mr-1"><i
                    class="fas fa-procedures"></i></span> {{ dateFormat(patient.admit_date) }}
                </span>

              </div>
              <!-- /.user-block -->

              <div class="card-tools" style="padding-right: 1rem">
                <div class="row">
                  <div class="col">
                  </div>
                  <div class="col-auto">
                    <span v-if="patient.hematocrit <= 30"
                          class="alert alert-danger pulse">hematocrit ต่ำกว่า 30%</span>

                    <span v-if="patient.ultrasound >= 3500"
                          class="alert alert-danger pulse ml-3">น้ำหนักเด็ก(U/S)เกิน 3500 กรัม</span>
                    <!--                    <span class="ml-4"></span>-->
                    <span :class="scoreClass(patient.cpd_risk_score)"><i class="fab fa-cloudscale"></i> CPD {{ patient.cpd_risk_score }}</span>
                    <router-link :to="'/patient/'+patient.hcode+'/'+patient.an+'/'+patient.cid"
                                 class="btn btn-outline btn-sm bg-light">
                      <i class="fas fa-external-link-alt"></i> รายละเอียด
                    </router-link>
                  </div>
                </div>
              </div>
              <!-- /.card-tools -->
            </div>

            <div class="card-footer">
              <div class="row">
                <div><i class="fas fa-venus-mars icon-blue ml-4"></i> ครรภ์ที่ = <span
                    class="text-muted">{{ patient.gravida }}</span></div>
                <div><i class="fas fa-stethoscope icon-blue ml-4"></i> ANC = <span
                    class="text-muted">{{ patient.no_of_anc }} ครั้ง</span>
                </div>
                <div><i class="fas fa-child icon-blue ml-4"></i> GA = <span class="text-muted">{{
                    patient.ga
                  }} สัปดาห์</span></div>
                <div><i class="fas fa-ruler-vertical icon-blue ml-4"></i> ส่วนสูง = <span
                    class="text-muted">{{ patient.height }} ซม.</span>
                </div>
                <div><i class="fas fa-weight icon-blue ml-4"></i> ส่วนต่าง นน. <span
                    class="text-muted">{{ patient.weight_before_pregancy }} → {{
                    patient.weight_at_delivery
                  }} = {{ patient.weight_gain }} กก.</span>
                </div>
                <div><i class="fas fa-arrows-alt-v icon-blue ml-4"></i> ยอดมดลูก = <span
                    class="text-muted">{{ patient.fundal_height }} ซม.</span></div>
                <div><i class="fas fa-vial icon-blue ml-4"></i> Hematocrit = <span
                    :class="{'text-muted': patient.hematocrit >= 30, 'text-red beat': patient.hematocrit <= 30}">
                  {{ patient.hematocrit }} %
                </span></div>
                <div><i class="fas fa-baby icon-blue ml-4"></i> Ultrasound = <span
                    :class="{'text-muted': patient.ultrasound < 3500, 'text-red beat': patient.ultrasound >= 3500}">{{
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
  beforeRouteEnter(to, from, next) {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    if (token !== null) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.hosCode === to.params.hoscode || decodedToken.hosCode === '10714') {
        next();
      } else {
        // Show alert and redirect back to the previous page
        // alert('คุณไม่มีสิทธิ์เข้าถึงข้อมูลนี้')
        // eslint-disable-next-line no-undef
        alertify.alert('คำเตือน', 'คุณไม่มีสิทธิ์เข้าถึงข้อมูลผู้ป่วยในโรงพยาบาลนี้', function () {
          next(false);
        });
        next(false); // Prevent entering the component
      }
    } else {
      // eslint-disable-next-line no-undef
      alertify.alert('คำเตือน', 'Token not found. Redirecting back to the previous page.', function () {
        next(false);
      });
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
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const thaiLocale = 'th-TH';
    // console.log(date);
    this.current_date = new Date().toLocaleDateString(thaiLocale, options)

    this.getPatients();
    setInterval(async () => {
      await this.getPatients();
    }, 60 * 1000) // 1 minute
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

    async getPatients() {
      this.hoscode = await this.$route.params.hoscode
      await axios.post(process.env.VUE_APP_API_URL + '/dashboard/hospital/' + this.hoscode)
          // await axios.post('http://localhost:8085/dashboard/hospital/' + this.hoscode)
          .then(response => {
            this.patients = response.data;

            this.sortedDataPatient = response.data.sort((a, b) => {
              const dateA = new Date(a.admit_date);
              const dateB = new Date(b.admit_date);
              return dateB - dateA;
            });

            this.patient = this.sortedDataPatient

            this.hospital_name = response.data[0].hosname
            this.weight_gain = response.data[0].weight_at_delivery - response.data[0].weight_before_pregancy
            this.score = response.data[0].cpd_risk_score
            this.patient.image = 'data:image/jpeg;base64,' + response.data[0].image; // Prepend the Base64 data
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

.beat {
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
  //transform: scale(1);
  }
  70% {
    -webkit-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 13px rgba(204, 169, 44, 0);
  //transform: scale(1.1);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  //transform: scale(1);
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
  //transform: scale(1.1);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  //transform: scale(1);
  }
}

</style>