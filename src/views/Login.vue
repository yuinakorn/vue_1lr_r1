<template>
  <div v-if="isLoading">
    <!-- Show loading spinner or waiting message -->
    <div class="center-box">
      <div class="centered-div">
        <img src="images/loading_ok4.gif" width="300" alt="">
        <p>กำลังตรวจสอบ</p>
      </div>
    </div>
  </div>
  <div v-else>
    <section class="content login-page">
      <iframe class="iframe-thaid" v-if="showIframe" :src="iframeSrc"></iframe>

      <!--    new login -->
      <div class="card shadow-lg">
        <div class="card-body">
          <div class="row">
            <div class="col-md-12 col-sm-12">
              <div style="text-align: center">
                <!-- <img src="images/onelr_new_logo.png" width="180" alt=""> -->
                <!--                <h1 style="font-size: 6rem">1LR</h1>-->
              </div>
              <div class="login-logo mb-2">
                <span class="onelr">One Province One Labor Room</span>
                <div class="province">
                  ห้องคลอดหนึ่งเดียว (OneLR) - เขตสุขภาพที่ 1
                </div>
              </div>
            </div>

            <div class="col-md-6 col-sm-12">
              <div class="img-center">
                <img src="images/onelr_new_logo.png" width="260" alt="">
              </div>

            </div>
            <div class="col-md-6 col-sm-12" style="border-left: solid 1px #e5e5e5">
              <div class="card-body">
                <h5 class="login-box-msg">ลงชื่อเข้าใช้งาน</h5>
                <!-- <div v-if="showAlert" class="alert alert-danger" role="alert">
                  {{ alertMessage }}
                </div> -->
                <form @submit.prevent="login">
                  <div class="mb-3">
                    <p style="font-weight: 400;">เลือกจังหวัด</p>
                    <select v-model="selectedProvince" class="form-control">
                      <option value="0" selected>เลือกจังหวัด</option>
                      <option v-for="(province, index) in provinces" :key="index" :value="province.code">
                        {{ province.name_th }}
                      </option>
                    </select>
                  </div>

                  <div class="mb-3">
                    <!-- <p>กรุณาเลือกโรงพยาบาล: {{ selectedHospital }}</p> -->
                    <p style="font-weight: 400;">เลือกโรงพยาบาล</p>
                    <select class="form-control" v-model="selectedHospital" :disabled="selectedProvince === '0'">
                      <option value="0" selected>เลือกโรงพยาบาล</option>
                      <option v-for="(hospital, index) in filteredHospitals" :key="index" :value="hospital.hoscode">
                        {{ hospital.hosname }}
                      </option>
                    </select>
                  </div>

                  <div class="social-auth-links text-center mb-3">
                    <!-- <p v-if="loggingIn">
                      <img src="/images/Spinner-1s-200px2.gif" width="40">
                    </p>
                    <p v-else>- <i class="fas fa-lock"></i> -</p> -->
                    <div class="cf-turnstile" data-sitekey="0x4AAAAAAAWOTcmZ2DnfO2UO"></div>
                  </div>
                  <a @click="openThaid()" class="btn btn-block btn-primary image-button" :class="{ 'disabled': selectedHospital === '0' }">
                    <img src="/images/thaid.webp" alt="ThaiD">
                    ลงชื่อใช้เข้างานด้วย ThaID
                  </a>

                  <div class="mt-4">
                    <span class="text-secondary" style="font-weight: 300;">ดาวน์โหลดแอปพลิเคชั่น ThaID</span> <a
                      target="_blank" href="https://www.bora.dopa.go.th/app-thaid/">ที่นี่</a>
                  </div>

                </form>
              </div>

            </div>

          </div>
        </div>
      </div>

    </section>
  </div>
</template>

<script>
import axios from "axios";
import qs from "qs";
import Swal from 'sweetalert2';


export default {
  name: "LoginUser",
  data() {
    return {
      username: '',
      password: '',
      hospitals: [],
      provinces: [],
      showAlert: false,
      alertMessage: '',
      selectHospital: 0,
      loggingIn: false,
      showIframe: false,
      data_client: '',
      iframeSrc: '',
      isLoading: false,
      selectedProvince: '0',
      selectedHospital: '0',
      client_id_random: "",
      cid_thaid: "",
      countdown: process.env.VUE_APP_TIME_COUNTDOWN,
      serviceId: process.env.VUE_APP_SERVICE_ID,
      account_token: process.env.VUE_APP_ACCOUNT_TOKEN,
    };
  },
  beforeCreate() {
    localStorage.removeItem('token'); // remove the token from LocalStorage
  },
  created() {
    // [UI] สร้างตัวเลือกจังหวัด
    const url_province = process.env.VUE_APP_API_URL + '/dashboard/provinces/';
    axios.get(url_province)
      .then(response => {
        // จะได้ provinces ที่เป็น array ของ object ที่มี code และ name_th
        this.provinces = response.data
      })
      .catch(error => {
        console.log(error)
      }
      )

    // [UI] สร้างตัวเลือกโรงพยาบาล
    const url_hospitals = process.env.VUE_APP_API_URL + '/dashboard/hospitals/';
    axios.get(url_hospitals)
      .then(response => {
        this.hospitals = response.data
      })
      .catch(error => {
        console.log(error)
      }
      )
  },
  computed: {
    // [UI] ฟังก์ชั่นการกรองโรงพยาบาลตามจังหวัดที่เลือก
    filteredHospitals() {
      // return this.hospitals.filter(hospital => hospital.provinceCode === this.selectedProvince);
      if (this.selectedProvince === "0") {
        return [];
      }
      return this.hospitals.filter(hospital => hospital.provinceCode === this.selectedProvince);
    }
  },

  methods: {
    // [UI-action] เปิดหน้าต่างสแกน QR Code thaid
    async openThaid() {
      console.log("open thaid");
      console.log('Selected Province:', this.selectedProvince);
      console.log('Selected Hospital:', this.selectedHospital);
      if (this.selectedHospital === "0") return;

      this.countDown(this.countdown);
      this.showToastAlert(this.countdown * 1000, "info", "กำลังเปิดหน้าต่างสแกน QR Code เพื่อตรวจสอบสิทธิ");

      // Step 0. make a logger client
      try {
        const response = await axios.get(`${process.env.VUE_APP_URL_AUTH}/client/`);
        // Set the received data to the component's data property
        this.data_client = response.data;
        // console.log(this.data_client);
      } catch (error) {
        console.log(error);
      }

      // Step 1: Generate QR Code
      try {
        this.client_id_random = process.env.VUE_APP_SERVICE_NAME + '-' + Math.random().toString(36).substring(2, 10);

        const ipAddress = this.data_client.client_ip;
        const os = (this.data_client.os.trim() + this.data_client.browser.trim());

        this.province = this.selectedProvince
        this.hcode = this.selectedHospital

        // console.log("province " + this.province);
        // console.log("hcode " + this.hcode);

        const state = {
          state: `${this.serviceId}|${this.client_id_random}|${this.province}|${this.hcode}|${ipAddress}|${os}`,
        };

        // console.log("provice " + this.province);
        const state_encode = qs.stringify(state);
        const url = `${process.env.VUE_APP_URL_AUTH}/gen_qrcode/?${state_encode}`;
        // console.log('url ที่ขออนุญาต ' + url)()

        let body = JSON.stringify({
          "account_token": this.account_token,
        });

        let config = {
          method: 'post',
          url: url,
          headers: {
            'Content-Type': 'application/json'
          },
          data: body
        };

        // Step 2: open new window and scan QR code ########################################
        await axios.request(config)
          .then((response) => {

            this.openAndCloseTab(response.data.url);

            // Step 3: check active from database
            // do after 5 sec pass wait for user scan QR code after that check database
            setTimeout(() => {
              this.callApi(this.client_id_random);
            }, 5000);
          })
          .catch((error) => {
            console.log(error);
          });

      } catch (error) {
        console.log(error);
      }
    },
    // Step 4: Check active from api ตรวจสอบ random client id ใน db
    async callApi(client_id) {
      // do every 2 sec until get data ทุก ๆ 2 วินาที เรียกใช้ฟังก์ชั่น checkActive
      this.interval = setInterval(() => {
        this.checkActive(client_id);
      }, 2000);
      //   set timout 2 min if not get data will close iframe
      setTimeout(() => {
        clearInterval(this.interval);
        this.showIframe = false;
      }, 2 * 60000); // 2 min
    },
    // 4.1: check active by client id from database #####################
    // client_id สร้างจาก random เอาไว้เช็ค
    async checkActive(client_id) {
      try {
        let data = JSON.stringify({
          "account_token": this.account_token,
        });

        let config = {
          method: 'post',
          url: process.env.VUE_APP_URL_AUTH + `/active_by_id/?client_id=${client_id}`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };
        // Step 4.2: if active get data from database
        axios.request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
            if (response.status !== 200) {
              // still not get data
              throw new Error('Cannot get data');
            } else {
              // until get data and api will remove client id from database for security
              // console.log('status code: ' + response.status);
              // close iframe
              this.showIframe = false;
              this.cid_thaid = response.data.scope.split(',')[0];

              // get CID from response scope and send to ihims for check permission
              // const res_scope = response.data.scope.split(',');

              console.log("level_position => ", response.data.level_position);

              // ตรงนี้จะได้เลขบัตรประชาชน เอาไปเช็คกับ his ของตนเอง
              this.checkPositAllow(response.data.level_position);
              // ปิดการเช็ค active
              clearInterval(this.interval);
            }
          })
        // .catch((error) => {
        //   console.log(error);
        // });

      } catch (error) {
        // console.log(error);
      }
    },
    // Step 5: check permission from web service
    async checkPositAllow(position_check) {
      // show loading...
      this.isLoading = true;
      let config = {
        method: 'post',
        url: process.env.VUE_APP_URL_AUTH + `/check_posit_allow/?position_check=${position_check}`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          "account_token": this.account_token,
        })
      };
      // use axios เอาตำแหน่งไปเช็คกับ his ของตนเอง
      // console.log(config)
      try {
        await axios.request(config)
          .then((response) => {

            if (response.data.result === 200) {
              // เรียกฟังก์ชั่น createToken เพื่อสร้าง token
              this.createToken(this.selectedHospital, this.cid_thaid);
              // alert("เข้าสู่ระบบสำเร็จ")
            } else {
              this.showRedAlert();
            }

          })
          .catch(() => {
            // console.log(error);
            this.showRedAlert();
          }).finally(() => {
            // close iframe
            this.showIframe = false;
            this.isLoading = false;
            // ปิดการเช็ค active ทุก ๆ 2 วินาที
            clearInterval(this.interval);
          });
      } catch (error) {
        console.log(error)
      }

    },

    createToken: async function (hoscode, cid) {
      this.loggingIn = true;
      // ใช้ token สร้างเอง
      const url = process.env.VUE_APP_URL_AUTH + '/viewer/' + `?exp=${process.env.VUE_APP_EXPIRES_IN}`;
      alert
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_token: this.account_token,
          hosCode: hoscode,
          cid: cid,
          patientCid: cid,
          patientHosCode: hoscode,
          ip: this.data_client.client_ip,
        }),
      });

      const data = await response.json();
      // console.log(data);
      const status_code = response.status;


      if (status_code === 200 && data.access_token !== null) {
        const token = data.access_token
        // set token to local storage
        localStorage.setItem('token', token);
        // eslint-disable-next-line no-undef
        // alertify.set('notifier', 'position', 'top-right');
        // eslint-disable-next-line no-undef
        // alertify.success('Login สำเร็จ!');

        // redirect to dashboard
        if (this.$route.query.path && this.$route.query.hcode && this.$route.query.an && this.$route.query.cid) {
          this.$router.push('/' + this.$route.query.path + '/' + this.$route.query.hcode + '/' + this.$route.query.an + '/' + this.$route.query.cid);
        } else {
          this.$router.push('/dashboard');
          // show toast alert
          this.showToastAlert(6000, "success", "เข้าสู่ระบบสำเร็จ!");
        }

      } else {
        this.loggingIn = false;
        this.showAlert = true;
        this.alertMessage = 'Login ไม่สำเร็จ! กรุณาตรวจสอบสิทธิของท่านอีกครั้ง';
        // eslint-disable-next-line no-undef
        alertify.set('notifier', 'position', 'top-right');
        // eslint-disable-next-line no-undef
        alertify.error('Error: Login failed');
        throw new Error('Login failed');
      }
    },
    showToastAlert(time, icon, title) {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: time,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: icon,
        title: title,
      });
    },
    showRedAlert() {
      Swal.fire({
        title: 'ไม่สามารถเข้าใช้งานได้!!!',
        text: 'ติดต่อไอทีของท่าน เพื่อตรวจสอบสิทธิการเข้าใช้งานระบบ',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#016b5f',
      }).then((result) => {
        if (result.isConfirmed) {
          location.reload();
        }
      });
    },
    openAndCloseTab(url) {
      const url_open = url
      console.log("open url => " + url_open);
      // Open a new tab
      const newTab = window.open(url_open, '_blank');

      // Close the new tab after 2 seconds
      setTimeout(() => {
        newTab.close();
        // close api to check active every 2 sec.
        clearInterval(this.interval);
      }, this.countdown * 1000);
    },
    countDown(n) {
      // แสดงตัวนับถอยหลัง
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--; // Decrement countdown value
        } else if (this.countdown === 0) {
          // set timeout 3 sec.
          setTimeout(() => {
            this.countdown = n;
            clearInterval(this.countdownInterval);
          }, 1000); // Update every second (1 sec)
        }
        else {
          clearInterval(this.countdownInterval);
        }
      }, 1000); // Update every second (1000 milliseconds)
    },

  },
}
</script>

<style scoped>
/* backgroud images */

.content {
  background: url('../../public/images/blurred-abstract.jpg') no-repeat center center fixed;
  background-size: cover;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.btn-primary {
  background-color: #71b6eb;
  border-color: #71b6eb;
}

.btn-primary:active {
  background-color: #71b6eb !important;
  border-color: #71b6eb !important;
}

.btn-primary:hover {
  background-color: #559CD1;
  border-color: #559CD1;
}

.onelr {
  color: #2f76ac;
  font-size: 1.9rem;
  font-weight: 500;
}

.province {
  font-size: 1rem;
  font-weight: 400;
  color: #303030;
}

.card {
  width: 60%;
  border-radius: 20px !important;
}

.pic-icon {
  border-radius: 25px;
}

.box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  /*background-color: #016b5f;*/
  /* padding: 0.4rem; 
  border-radius: 6px; */
}

.iframe-thaid {
  width: 100%;
  height: 100%;
  border: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: white;
}

.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  /* background-color: #33CDBC;  */
  /* background-color: #E2F4E5; */
}

.centered-div {
  width: 300px;
  /* Set your desired width */
  height: 300px;
  /* Set your desired height */
  text-align: center;
  /* line-height: 200px;  */
  /* Vertically center content */
}

.img-center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.image-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  /* Button text color */
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.image-button img {
  margin-right: 5px;
  /* Adjust spacing between image and text */
  max-width: 30px;
  /* Adjust the size of the image */
}
</style>