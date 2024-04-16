<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <div class="header mb-2">
        <div style="font-size: 1.6rem">{{ hospital_name }}</div>
        <span class="small text-muted">{{ current_date }}</span>
        <div class="row pt-3">
          <div
            class="col d-flex justify-content-start"
            style="font-size: 1.3rem"
          >
            รายชื่อหญิงรอคลอด
          </div>
          <div class="col d-flex justify-content-end mx-1">
            <router-link to="/backend/preg_create">
              <button class="btn btn-success">เพิ่มข้อมูล</button>
            </router-link>
          </div>
        </div>
      </div>
      <table class="table table-sm table-hover table-striped table-bordered">
        <thead class="table-info">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Hcode</th>
            <th scope="col">ชื่อ</th>
            <th scope="col">สกุล</th>
            <th scope="col">HN</th>
            <th scope="col">AN</th>
            <th scope="col">วันที่ Admit</th>
            <th scope="col">คะแนนความเสี่ยง</th>
            <th scope="col">สถานะคลอด</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(preg, index) in pregs" :key="index">
            <th>{{ index + 1 }}</th>
            <td>{{ preg.hcode }}</td>
            <td>{{ preg.pname }}</td>
            <td>{{ preg.lname }}</td>
            <td>{{ preg.hn }}</td>
            <td>{{ preg.an }}</td>
            <td>{{ preg.admit_date }}</td>
            <td v-if="preg.cpd_risk_score < 5"><span class="badge bg-success">{{ preg.cpd_risk_score }}</span></td>
            <td v-else-if="preg.cpd_risk_score >= 5 && preg.cpd_risk_score <= 9.5"><span class="badge bg-warning">{{ preg.cpd_risk_score }}</span></td>
            <td v-else><span class="badge bg-danger">{{ preg.cpd_risk_score }}</span></td>
            <td v-if="preg.status === 1"><span class="badge bg-success">คลอดแล้ว</span></td>
            <td v-else><span class="badge bg-danger">ยังไม่คลอด</span></td>
            <td>
              <router-link :to="'/backend/preg_update/' + preg.hcode+'/'+preg.cid+'/'+preg.an">
                <button class="btn btn-primary btn-sm mx-2">แก้ไข</button>
              </router-link>
              <button class="btn btn-danger btn-sm">ลบ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
import { useRouter } from "vue-router";
var axios = require("axios");
export default {
  name: "PregList",
  data() {
    return {
      pregs: [],
      token: "",
      cid: "",
      an: "",
    };
  },
  async created() {
    this.token = localStorage.getItem("token");
    let data = JSON.stringify({
      token: this.token,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.VUE_APP_API_URL + "/pregs/",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.pregs = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    
    async getPregupdate(hcode, cid, an) {
      console.log(hcode);
      console.log(cid);
      console.log(an);
      const router = useRouter();
      router.push({
        name: "preg_update",
        params: { hcode: hcode, cid: cid, an: an },
      });
    },
  },
};
</script>