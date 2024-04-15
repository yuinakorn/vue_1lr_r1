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
        <router-link :to="{ name: 'dashboard' }" class="nav-link">Dashboard</router-link>
      </li>
            <li class="nav-item d-none d-sm-inline-block">
              <router-link :to="{ name: 'patients' }" class="nav-link">ผู้ป่วยทั้งหมด </router-link>
            </li>
      <li class="nav-item d-none d-sm-inline-block">
        <router-link :to="{ name: 'logout' }" class="nav-link">Logout</router-link>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">

      <!-- Messages Dropdown Menu -->
      <!--      <li class="nav-item dropdown">-->
      <!--        <a class="nav-link" data-toggle="dropdown" href="">-->
      <!--          <i class="far fa-bell"></i>-->
      <!--          <span class="badge badge-danger navbar-badge">3</span>-->
      <!--        </a>-->
      <!--        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">-->
      <!--          <a href="#" class="dropdown-item">-->
      <!--            &lt;!&ndash; Message Start &ndash;&gt;-->
      <!--            <div class="media">-->
      <!--              <img src="../assets/img/user1-128x128.jpg" alt="User Avatar" class="img-size-50 mr-3 img-circle">-->
      <!--              <div class="media-body">-->
      <!--                <h3 class="dropdown-item-title">-->
      <!--                  Brad Diesel-->
      <!--                  <span class="float-right text-sm text-danger"><i class="fas fa-star"></i></span>-->
      <!--                </h3>-->
      <!--                <p class="text-sm">Call me whenever you can...</p>-->
      <!--                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            &lt;!&ndash; Message End &ndash;&gt;-->
      <!--          </a>-->
      <!--          <div class="dropdown-divider"></div>-->
      <!--          <a href="" class="dropdown-item">-->
      <!--            &lt;!&ndash; Message Start &ndash;&gt;-->
      <!--            <div class="media">-->
      <!--              <img src="../assets/img/user8-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3">-->
      <!--              <div class="media-body">-->
      <!--                <h3 class="dropdown-item-title">-->
      <!--                  John Pierce-->
      <!--                  <span class="float-right text-sm text-muted"><i class="fas fa-star"></i></span>-->
      <!--                </h3>-->
      <!--                <p class="text-sm">I got your message bro</p>-->
      <!--                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            &lt;!&ndash; Message End &ndash;&gt;-->
      <!--          </a>-->
      <!--          <div class="dropdown-divider"></div>-->
      <!--          <a href="#" class="dropdown-item">-->
      <!--            &lt;!&ndash; Message Start &ndash;&gt;-->
      <!--            <div class="media">-->
      <!--              <img src="../assets/img/user3-128x128.jpg" alt="User Avatar" class="img-size-50 img-circle mr-3">-->
      <!--              <div class="media-body">-->
      <!--                <h3 class="dropdown-item-title">-->
      <!--                  Nora Silvester-->
      <!--                  <span class="float-right text-sm text-warning"><i class="fas fa-star"></i></span>-->
      <!--                </h3>-->
      <!--                <p class="text-sm">The subject goes here</p>-->
      <!--                <p class="text-sm text-muted"><i class="far fa-clock mr-1"></i> 4 Hours Ago</p>-->
      <!--              </div>-->
      <!--            </div>-->
      <!--            &lt;!&ndash; Message End &ndash;&gt;-->
      <!--          </a>-->
      <!--          <div class="dropdown-divider"></div>-->
      <!--          <a href="#" class="dropdown-item dropdown-footer">See All Messages</a>-->
      <!--        </div>-->
      <!--      </li>-->

      <!--       Messages Dropdown Menu -->
      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="" style="color: #000!important;">
          {{ hosname }}
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <a href="#" class="dropdown-item" >
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
      hosname: ''
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token !== null) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken) {
        this.hoscode = decodedToken.hosCode
      }
      axios
          .get("https://api-onelr.lphis.org/dashboard/hospitals/")
          .then(response => {
            const filteredData = response.data.filter(item => item.hoscode === this.hoscode);
            this.hosname = filteredData[0].hosname
          })
          .catch(error => {
            console.log(error);
          });
    }
  }
}
</script>

<style>
.badge-success {
  background-color: #00D1B2 !important;
}

</style>