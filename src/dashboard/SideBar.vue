<template>
  <!-- Main Sidebar Container -->
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <!-- Brand Logo -->
    <router-link :to="{ name: 'dashboard' }" class="brand-link">
      <img src="../assets/img/LOGO_SSJ_1000-1.png" alt="CMSSJ Logo" class="brand-image img-circle elevation-3"
        style="opacity: .8">
      <span class="brand-text font-weight-light">One Labor Room</span>
    </router-link>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar user panel (optional) -->
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="image">
          <img src="images/ONe_LR_White_BG.png" class="img-circle elevation-2" alt="User Image">
        </div>
        <div class="info">
          <a class="d-block">ผู้ใช้งาน: <br>{{ username }}</a>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->
          <li class="nav-header">เมนูหลัก</li>
          <li class="nav-item">
            <router-link :to="{ name: 'dashboard' }"
              :class="{ 'nav-link active': isActive('/#/dashboard'), 'nav-link': !isActive('/#/dashboard') }">
              <i class="nav-icon fas fa-tachometer-alt"></i>
              <p>Dashboard</p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="`/hospital/${this.hoscode}`"
              :class="{ 'nav-link active': isActive('/#/patients'), 'nav-link': !isActive('/#/patients') }">
              <i class="nav-icon fas fa-hospital-user"> </i>
              <p>ผู้ป่วยใน รพ. </p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'patients' }"
              :class="{ 'nav-link active': isActive('/#/patients'), 'nav-link': !isActive('/#/patients') }">
              <i class="nav-icon fas fa-user-friends"></i>
              <p>ผู้ป่วยในเครือข่าย </p>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'patients_conslut' }"
              :class="{ 'nav-link active': isActive('/#/patients/consult'), 'nav-link': !isActive('/#/patients/consult') }">
              <i class="nav-icon fas fa-file-medical-alt"></i>
              <p>เคส consult </p>
            </router-link>
          </li>

          <li class="nav-header">การจัดการ</li>
          <li class="nav-item">
            <a href="/#/backend/preg_create/"
              :class="{ 'nav-link active': isActive('/#/backend/preg_list'), 'nav-link': !isActive('/#/backend/preg_create/') }">
              <i class="nav-icon fas fa-edit"></i>
              <p>ลงทะเบียนรายใหม่</p>
            </a>
          </li>
          <li class="nav-item">
            <a href="/#/backend/preg_list/"
              :class="{ 'nav-link active': isActive('/#/backend/preg_create'), 'nav-link': !isActive('/#/backend/preg_list/') }">
              <i class="nav-icon fas fa-bed"></i>
              <p>ทะเบียนผู้ป่วยคลอด</p>
            </a>
          </li>

        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import axios from "axios";
// import jwt from 'jsonwebtoken';

export default {
  data() {
    return {
      username: '',
      hoscode: '',
      hosname: '',
    }
  },
  mounted() {
    const token = localStorage.getItem('token')
    if (token !== null) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken) {
        this.hoscode = decodedToken.hosCode
        this.username = decodedToken.cid + '@' + decodedToken.hosCode
      }
      axios
        .get(process.env.VUE_APP_API_URL + "/dashboard/hospitals/")
        .then(response => {
          const filteredData = response.data.filter(item => item.hoscode === this.hoscode);
          this.hosname = filteredData[0].hosname
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  methods: {
    isActive(path) {
      return this.$route.path === path;
    }
  }
}
</script>

<style></style>