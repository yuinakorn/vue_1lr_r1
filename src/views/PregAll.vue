<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <div class="header mb-2">
        <!--        <div style="font-size: 1.6rem">{{ hospital_name }}</div>-->
        <span class="small text-muted">{{ current_date }}</span>
      </div>
      <div class="row" v-for="(patient,index) in patients" :key="index">
        <div class="col">
          <div class="card card-widget">
            <div class="card-header" style="padding-top: 0.2rem!important; padding-bottom: 0!important; border-bottom: 0">
              <span class="ml-1" style="font-size: 1rem;">{{ patient.hosname }}</span>
            </div>
            <div class="card-header" style="padding-top: 0.2rem!important;">
              <div class="user-block">
                <img class="img-circle hover-zoom pt-picture" style="width: 45px; height: 45px"
                     :src="patient.image ? patient.image : 'images/user.png'"
                     alt="patient_picture">
                <div class="mb-1">
                  <router-link :to="'/patient/'+patient.hcode+'/'+patient.an+'/'+patient.cid">
                    <div class="username" style="font-size: 1.2rem">{{patient.title + patient.pname + " " + patient.lname }}
                      <span v-if="patient.status === 0"
                            class="alert alert-default-danger preg-status ml-2">ยังไม่คลอด</span>
                      <span v-else class="alert alert-success preg-status ml-2">คลอดแล้ว</span>
                    </div>
                  </router-link>
                </div>

                <span class="description my-des2"><span style="color: black!important;">HN:</span> {{ patient.hn }}
                  <span class="ml-1" style="color: black!important;">AN:</span> {{ patient.an }}
                  <span class="ml-1" style="color: black!important;"> อายุ:</span> {{ patient.age_y }} ปี</span>

                <span class="description my-des2"><span class="badge bg-info badge-bigger mr-1"><i
                    class="far fa-address-card mr-1"></i></span>{{ patient.cid }}
                    <span class="badge bg-info badge-bigger ml-3 mr-1"><i
                        class="fas fa-procedures"></i></span> {{ dateFormat(patient.admit_date) }} น.
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
                  }} = {{ patient.weight_gain }} กก.</span></div>
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

export default {
  name: "HospitalDetail",
  data() {
    return {
      pregs: [],
      patients: [],
      hospital_name: '',
      current_date: '',
      update_time: '',
      score: '',
      patient: {
        image: ''
      },
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
    const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
    const thaiLocale = 'th-TH';
    // console.log(date);
    this.current_date = new Date().toLocaleDateString(thaiLocale, options)

    setInterval(() => {
      this.getPatients();
    }, 30 * 1000) // 30 seconds
  },

  methods: {
    async getPatients() {
      this.update_time = new Date().toLocaleTimeString('th-TH', {hour12: false})
      const token = localStorage.getItem('token');
      let payload = JSON.stringify({
        "token": token,
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.VUE_APP_API_URL + '/dashboard/patients/',
        // url: 'http://localhost:8085/dashboard/patients/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      };

      await axios.request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            this.patients = response.data;

            this.patient.image = 'data:image/jpeg;base64,' + response.data[0].image; // Prepend the Base64 data
          })
          .catch((error) => {
            console.log(error);
          });
    },

    dateFormat(time) {
      // const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
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

.badge {
  border-radius: 4px !important;
}

</style>