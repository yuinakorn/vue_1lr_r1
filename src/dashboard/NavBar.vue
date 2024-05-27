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
        <router-link :to="{ name: 'dashboard' }" class="nav-link my-nav-link" active-class="my-active"><i class="fas fa-tachometer-alt"></i>
          Dashboard</router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="`/hospital/${this.hoscode}`" class="nav-link my-nav-link" active-class="my-active"><i class="nav-icon fas fa-hospital-user"></i>
          ผู้ป่วยใน รพ. </router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'patients' }" class="nav-link my-nav-link" active-class="my-active"><i class="nav-icon fas fa-user-friends"></i>
          ผู้ป่วยในเครือข่าย </router-link>
      </li>

      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'patients_conslut' }" class="nav-link my-nav-link" active-class="my-active" @click="toReload"> <i
            class="fas fa-file-medical-alt"></i>
          <span v-if="this.notify > 0" class="badge badge-danger navbar-badge">{{ this.notify }}</span>
          เคส consult </router-link>
      </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'logout' }" class="nav-link my-nav-link" active-class="my-active"><i class="fas fa-sign-out-alt"></i> Logout</router-link>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">

      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="" style="color: #000!important;">
          <i class="fas fa-inbox"></i>
          <span class="badge badge-success navbar-badge">{{ this.version_count }}</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-sm-right">
          <a href="#" class="dropdown-item">
            <router-link :to="{ name: 'version' }" class="nav-link" style="color: black!important;">
              <i class="fas fa-code-branch"> </i> รายละเอียด Version
            </router-link>
          </a>
        </div>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="" style="color: #000!important;">
          {{ hosname }}
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item">
            <router-link :to="{ name: 'history' }" class="nav-link" style="color: black!important;">
              <i class="fas fa-history"></i> ประวัติการเข้าใช้งาน
            </router-link>
          </a>
          <a href="#" class="dropdown-item">
            <router-link :to="{ name: 'logout' }" class="nav-link" style="color: black!important;">
              <i class="fas fa-sign-out-alt"></i> Logout
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
      timePassed: 0,
      version_count: 0
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
    this.getVersionDetail();
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
    async getVersionDetail() {
            const config = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: process.env.VUE_APP_API_URL + '/dashboard/version/',
                data: {
                    token: localStorage.getItem('token')
                }
            };
            try {
                const response = await axios(config);
                this.version_count = response.data.length;
                

            } catch (error) {
                console.log(error);
            }
        },

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

.my-nav-link:hover {
  border-bottom: #676767 2px solid !important;
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

.dropdown-item:active {
  color: #676767 !important;
  background-color: #00D1B2;
}

.my-active {
  color: #000 !important;
  border-bottom: #000 2px solid !important;
}

</style>