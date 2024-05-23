<template>
  <section class="content-header">
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-sm-6">
          <h3>{{ pageTitle }}</h3>
        </div>
        <div class="col-sm-6">
          <ol class="breadcrumb float-sm-right">
            <li class="breadcrumb-item"><a href="#">หน้าหลัก</a></li>
            <li class="breadcrumb-item active">ประวัติการเข้าใช้งาน</li>
          </ol>
        </div>
      </div>
    </div>
  </section>
  <section class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="card">
          <table id="datatable" class="table table-striped table-bordered" style="width:100%">
            <thead>
              <tr class="text-center">
                <th class="text-center">id</th>
                <th class="text-center">วันที่เข้าใช้งาน</th>
                <th class="text-center">ผู้ใช้งาน</th>
                <th class="text-center">ตำแหน่ง</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in tableData" :key="index">
                <td class="px-4 py-2">{{ item.client_id }}</td>
                <td class="px-4 py-2 text-left">{{ formatDate(item.created_date) }}</td>
                <td class="px-4 py-2 text-center">{{ item.scope }}</td>
                <td class="px-4 py-2 text-center">{{ item.level_position ? item.level_position : 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </section>

</template>

<script>
import $ from 'jquery';
import 'datatables.net-bs5';
import axios from 'axios';
import 'datatables.net';


// DataTable.use(DataTablesCore);

export default {
  data() {
    return {
      pageTitle: 'ประวัติการเข้าใช้งาน',
      hoscode: '',
      tableData: []
    };
  },

  mounted() {
    this.getHistoryLog();
  },
  methods: {
    async getHistoryLog() {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken) {
        this.hoscode = decodedToken.hosCode;
        this.cid = decodedToken.cid;
      }
      const config = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        url: process.env.VUE_APP_URL_AUTH + '/history/',
        data: {
          account_token: process.env.VUE_APP_ACCOUNT_TOKEN,
          hoscode: this.hoscode,
          cid: this.cid
        }
      };

      try {
        const response = await axios(config);
        this.tableData = response.data; // Assuming the data is in response.data
        this.$nextTick(() => {
          $('#datatable').DataTable({
            pageLength: 25,
            order: [[1, 'desc']],
            
          });
        });
      } catch (error) {
        console.error('Error fetching history log:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  }
};
</script>

<style scoped>
/* Add your page-specific styles here */
.card {
  min-width: 100%;
  padding: 1rem;
}

#logindate {
  text-align: left !important;
}
</style>