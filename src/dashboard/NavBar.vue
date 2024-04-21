<template>
  <!-- Navbar -->
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button">
          <i class="fas fa-bars"></i>
        </a>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'dashboard' }" class="nav-link"><i class="fas fa-tachometer-alt"></i>
          Dashboard</router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'patients' }" class="nav-link"><i class="nav-icon fas fa-user-friends"></i>
          ผู้ป่วยในเครือข่าย </router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'patients_conslut' }" class="nav-link" @click="toReload"> <i
            class="fas fa-file-medical-alt"></i>
          <span v-if="this.notify > 0" class="badge badge-danger navbar-badge">{{ this.notify }}</span>
          เคส consult </router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'logout' }" class="nav-link"><i class="fas fa-sign-out-alt"></i> Logout</router-link>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <!-- Notify message -->
      <!-- <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#" aria-expanded="false">
          <i class="far fa-comments"></i>
          <span class="badge badge-danger navbar-badge">{{ this.notify }}</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right" style="left: inherit; right: 0px;">
          <div v-for="(patient, index) in this.patients" :key="index">
            <a class="dropdown-item pointer">

              <div class="media">
                <img :src="patient.image ? patient.image : 'images/user.png'" alt="patient_picture"
                  class="img-size-50 mr-3 img-circle" style="width: 40px; height: 40px">
                <div class="media-body">
                  <h3 class="dropdown-item-title">
                    <span v-if="patient.title">{{ patient.title }}</span>
                    {{ patient.pname + " " + patient.lname }}
                    <span :class="cpdscore(patient.cpd_risk_score)"><i class="fas fa-circle"></i></span>
                  </h3>
                  <p class="text-sm">{{ patient.hosname }}</p>
                  <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> {{ this.timePassed }}</p>
                </div>
              </div>

            </a>
            <div class="dropdown-divider"></div>
          </div>

          <router-link :to="{ name: 'patients_conslut' }" class="dropdown-item dropdown-footer">ดูทั้งหมด</router-link>
        </div>
      </li> -->

      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="" style="color: #000!important;">
          {{ hosname }}
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item">
            <router-link :to="{ name: 'logout' }" class="nav-link" style="color: black!important;">
              Logout <i class="fas fa-sign-out-alt"></i>
            </router-link>
          </a>
        </div>
      </li>
    </ul>
  </nav>
  <!-- /.navbar -->
</template>

<script>
import axios from "axios";

export default {
  name: 'NavBar',
  data() {
    return {
      hoscode: '',
      hosname: '',
      notify: 0,
      patients: [],
      timePassed: 0
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token !== null) {
      this.getHospitalName(token)
      // this.notiCaseConsult()
      this.notifyCount()
      // do every 5 sec
      setInterval(() => {
        this.notifyCount()
      }, 1.5 * 60 * 1000) // 1.5 min
    }
  },
  methods: {
    toReload() {
      // set time out 0.5 sec
      setTimeout(() => {
        this.$router.go()
      }, 300)
    },

    cpdscore: function (score) {
      if (score >= 0 && score < 5) {
        return 'float-right text-sm text-success'
      } else if (score > 5 && score <= 9.5) {
        return 'float-right text-sm text-warning'
      } else {
        return 'float-right text-sm text-danger'
      }
    },

    async getHospitalName(token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken) {
        this.hoscode = decodedToken.hosCode
      }
      await axios
        .get(process.env.VUE_APP_API_URL + "/dashboard/hospitals/")
        .then(response => {
          const filteredData = response.data.filter(item => item.hoscode === this.hoscode);
          this.hosname = filteredData[0].hosname
        })
        .catch(error => {
          console.log(error);
        });
    },

    async notifyCount() {
      let config = {
        method: 'get',
        url: process.env.VUE_APP_API_URL + "/dashboard/notify_count/" + this.hoscode,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      let response = await axios(config)
      // console.log(response.data.count)
      this.notify = response.data.count

    },

    // async notiCaseConsult() {
    //   console.log('notiCaseConsult')
    //   const token = localStorage.getItem('token');
    //   let payload = JSON.stringify({
    //     "token": token,
    //   });
    //   let config = {
    //     method: 'post',
    //     url: process.env.VUE_APP_API_URL + "/dashboard/pregs_consult/",
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     data: payload
    //   }
    //   const response = await axios(config)
    //   this.notify = response.data.length
    //   this.patients = response.data
    //   console.log(this.patients)

    //   // time passed is calculated from the time of the last consult
    //   this.patients.forEach(patient => {
    //     let lastConsult = new Date(patient.datetime_created)
    //     let now = new Date()
    //     let diff = now - lastConsult
    //     let minutes = Math.floor((diff / 1000) / 60)
    //     let hours = Math.floor(minutes / 60)
    //     let days = Math.floor(hours / 24)
    //     if (days > 0) {
    //       this.timePassed = days + ' วันที่แล้ว'
    //     } else if (hours > 0) {
    //       this.timePassed = hours + ' ชั่วโมงที่แล้ว'
    //     } else {
    //       this.timePassed = minutes + ' นาทีที่แล้ว'
    //     }
    //   })

    // }

  }

}
</script>

<style scoped>
.navbar-badge {
  right: 0 !important;
  font-size: 0.7rem;
}

.badge-success {
  background-color: #00D1B2 !important;
}

.nav-link {
  color: #000 !important;
}

.nav-link:hover {
  color: #676767 !important;
}

.text-success {
  color: #00D1B2 !important;
}

.text-warning {
  color: #FB9847 !important;
}

.pointer {
  cursor: pointer;
}
</style>