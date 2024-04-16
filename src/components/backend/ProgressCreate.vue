<template>
  <div class="container-fluid pt-3">
    <div class="row">
      <div class="col-md-12">
        <div class="card shadow">
          <div class="card-header border-0 pt-4">
            <div class="row">
              <div class="col-md-12">
                <h4>
                  <i class="fas fa-users"></i>
                  เพิ่มข้อมูลมดลูกเปิด
                </h4>
              </div>
            </div>
            <br />

            <div class="row">
              <div class="form-group mx-2">
                <router-link to="/backend/progress_list">
                  <button class="btn btn-success">
                    <i class="fas fa-list"></i> กลับหน้าความก้าวหน้าการคลอด
                  </button>
                </router-link>
              </div>
              <div class="form-group mx-2">
                <button
                  type="button"
                  class="btn btn-primary btn-block mx-auto w-100 float-right"
                  name="submit"
                  @click="submitForm"
                >
                  <i class="fas fa-save"></i>
                  บันทึกข้อมูล
                </button>
              </div>
            </div>

            <hr />
            <div class="row">
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="form-group col-sm-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">วันที่</div>
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        name="progress_date_time"
                        id="progress_date_time"
                        v-model="progress_date_time"
                      />
                    </div>
                  </div>
                  <div class="form-group col-sm-2">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">ค่า</div>
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        name="value"
                        id="value"
                        v-model="value"
                      />
                    </div>
                  </div>
                  <div class="form-group col-sm-6">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">Comment</div>
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        name="comment"
                        id="comment"
                        v-model="comment"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProgressUpdate",
  data() {
    return {
      hcode: "",
      cid: "",
      pname: "",
      lname: "",
      hn: "",
      an: "",
      progress_date_time: "",
      value: "",
      comment: "",
      currentDateTime: new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', ''),
    };
  },
  created() {
    const token = localStorage.getItem("token");
    this.token = token;
    console.log(token);
    this.$route.params.hcode;
    this.$route.params.cid;
    this.$route.params.an;
    this.$route.params.hn;
    this.$route.params.progress_date_time;
    this.$route.params.code;
    this.$route.params.value;
    this.$route.params.comment;

    const date = new Date();
    console.log(date);
    this.current_date = date;
    this.status = 0;

    let data = JSON.stringify({
      token: this.token,
      cid: this.$route.params.cid,
      an: this.$route.params.an,
      hn: this.$route.params.hn,
      progress_date_time: this.$route.params.progress_date_time,
      code: this.$route.params.code,
      value: this.$route.params.value,
      comment: this.$route.params.comment,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: process.env.VUE_APP_API_URL + "/progress/search/",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        this.data = response.data;
        this.pname = response.data.pname;
        this.lname = response.data.lname;
        this.cid = response.data.cid;
        this.an = response.data.an;
        this.hn = response.data.hn;
        this.progress_date_time = response.data.progress_date_time;
        this.value = response.data.value;
        this.comment = response.data.comment;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    async submitForm() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.hcode,
        cid: this.cid,
        pname: this.pname,
        lname: this.lname,
        hn: this.hn,
        an: this.an,
        progress_date_time: this.progress_date_time,
        value: this.value,
        comment: this.comment,
      });

      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: process.env.VUE_APP_API_URL + "/progress/update/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      console.log(data);
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href='#/backend/preg_list'
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
  
<style scoped>
</style>