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
            <div class="col-md-12">
              <div style="text-align: center">
                <!-- <img src="images/onelr_new_logo.png" width="180" alt=""> -->
                <!--                <h1 style="font-size: 6rem">1LR</h1>-->
              </div>
              <div class="login-logo mb-2">
                <span class="onelr">One Province One Labor Room</span>
                <div class="province">
                  เขตสุขภาพที่ 1
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="img-center">
                <img src="images/onelr_new_logo.png" width="260" alt="">
              </div>

            </div>
            <div class="col-md-6" style="border-left: solid 1px #e5e5e5">
              <div class="card-body">
                <h5 class="login-box-msg">ลงชื่อใช้งานด้วย HIS</h5>
                <div v-if="showAlert" class="alert alert-danger" role="alert">
                  {{ alertMessage }}
                </div>
                <form @submit.prevent="login">
                  <div class="mb-3">
                    <p>กรุณาเลือกโรงพยาบาล: {{ selectHospital }}</p>
                    <select class="form-control" v-model="selectHospital">
                      <option value="0" selected>เลือกโรงพยาบาล</option>
                      <option v-for="(hospital, index) in hospitals" :key="index" :value="hospital.hoscode">
                        {{ hospital.hosname }}
                      </option>
                    </select>

                  </div>
                  <div class="input-group mb-3">
                    <input type="text" v-model="username" class="form-control" placeholder="Username" required />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-user-alt"></span>
                      </div>
                    </div>
                  </div>
                  <div class="input-group mb-3">
                    <input type="password" v-model="password" class="form-control" placeholder="Password" required />
                    <div class="input-group-append">
                      <div class="input-group-text">
                        <span class="fas fa-lock"></span>
                      </div>
                    </div>
                  </div>

                  <div class="social-auth-links text-center mb-3">
                    <p v-if="loggingIn">
                      <!--               import svg  -->
                      <img src="/images/Spinner-1s-200px2.gif" width="40">
                    </p>
                    <p v-else>- <i class="fas fa-lock"></i> -</p>
                    <button type="submit" class="btn btn-block btn-primary">
                      Sign in
                    </button>
                  </div>
                </form>
              </div>

            </div>

            <!-- <div class="col-md-6" style="border-left: solid 1px #e5e5e5">
              <div class="card-body">
                <h5 class="login-box-msg">ลงชื่อใช้งานด้วย ThaID</h5>
                <p class="card-text box">สแกน QR Code ด้วยแอปพลิเคชั่น ThaID</p>
                <div class="box my-5">
                  <a href="#">
                    <img class="pic-icon shadow" src="/images/thaid.webp" width="96" alt="thaID logo">
                  </a>
                </div>
                <div class="box mt-4">
                  <a @click="toggleIframe" type="submit" class="btn btn-block btn-primary mt-4">
                    คลิกเพื่อสแกน QR Code <span style="color: #ffc300">(โปรดสแกนภายใน {{ countdown }} วินาที)</span>
                  </a>
                </div>
                <p class="card-text box mt-4">*สิทธิการเข้าใช้งานตั้งค่าผ่าน iHIMS</p>
              </div>
            </div> -->

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
      showAlert: false,
      alertMessage: '',
      selectHospital: '',
      loggingIn: false,
      showIframe: false,
      data_client: '',
      iframeSrc: '',
      isLoading: false,
      account_token: '',
      countdown: 20,
    };
  },
  beforeCreate() {
    localStorage.removeItem('token'); // remove the token from LocalStorage
  },
  created() {
    //   call api using Axios
    axios.get('https://api-onelr.lphis.org/dashboard/hospitals/')
      .then(response => {
        this.hospitals = response.data
      })
      .catch(error => {
        console.log(error)
      }
      )
  },
  computed: {},
  methods: {
    // toggle to open new tab
    async toggleIframe() {
      // แสดงตัวนับถอยหลัง
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--; // Decrement countdown value
        } else if (this.countdown === 0) {
          // set timeout 3 sec.
          setTimeout(() => {
            this.countdown = 15;
            clearInterval(this.countdownInterval);
          }, 3000);
        } else {
          clearInterval(this.countdownInterval);
        }
      }, 1000); // Update every second (1000 milliseconds)

      this.showToastAlert(this.countdown * 1000, "info", "กำลังเปิดหน้าต่างสแกน QR Code เพื่อตรวจสอบสิทธิ");
      // open iframe
      // this.showIframe = !this.showIframe;
      try {
        // Make an API request using Axios with async/await
        const response = await axios.get('https://authen.chiangmaihealth.go.th/client/');
        // Set the received data to the component's data property
        this.data_client = response.data;
        // console.log(this.data_client);

      } catch (error) {
        // If an error is thrown, set the error message to the component's data property
        // this.error = error.message;
        console.log(error.message);
      }

      try {
        // Step 1: Generate QR Code
        const client_id_random = Math.random().toString(36).substring(2, 10);
        const province = '51';
        let hcode = 'oneLR';
        const ipAddress = this.data_client.client_ip;
        // const os = (this.data_client.os.trim() + this.data_client.browser.trim());
        const os = "oneLRWeb";

        const state = {
          state: `2|${client_id_random}|${province}|${hcode}|${ipAddress}|${os}`,
        };
        const state_encode = qs.stringify(state);
        const url = 'https://authen.chiangmaihealth.go.th/gen_qrcode/?' + state_encode;
        // console.log('url ที่ขออนุญาต ' + url)

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
        // Step 2: open iframe
        axios.request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data.url));
            // console.log("url ที่ iframe เอาไปเปิด => " + response.data.url);
            // this.iframeSrc = response.data.url;
            this.openAndCloseTab(response.data.url)

            // Step 3: check active from database
            //   do after 7 sec pass wait for user scan QR code
            setTimeout(() => {
              this.callApi(client_id_random);
            }, 7000);
          })
          .catch((error) => {
            console.log(error);
          });

      } catch (error) {
        console.log(error);
      }
    },
    // Step 4: Check active from api
    async callApi(client_id) {
      // do every 2 sec until get data
      this.interval = setInterval(() => {
        this.checkActive(client_id);
      }, 2000);
      //   set timout 2 min if not get data will close iframe
      setTimeout(() => {
        clearInterval(this.interval);
        this.showIframe = false;
      }, 2 * 60000); // 2 min
    },
    // 4.1: check active by client id from database
    async checkActive(client_id) {
      try {
        let data = JSON.stringify({
          "account_token": this.account_token,
        });

        let config = {
          method: 'post',
          url: `https://authen.chiangmaihealth.go.th/active_by_id/?client_id=${client_id}`,
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

              // get CID from response scope and send to ihims for check permission
              const res_scope = response.data.scope.split(',');
              this.checkIhims(res_scope[0]);
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
    // Step 5: check permission from ihims
    async checkIhims(cid) {
      // show loading...
      this.isLoading = true;
      const nodehis = 'lphis'
      let config = {
        method: 'post',
        url: `https://ihimsapi.cmhis.org/users/${nodehis}/${cid}`,
      };
      // Step 5.1: Check position allow
      const position_allow = ['พยาบาล', 'แพทย์'];
      // const position_allow = ['แพทย์'];
      try {
        await axios.request(config)
          .then((response) => {
            // console.log("in checkIhims function");
            // console.log(JSON.stringify(response.data));
            const data = response.data;
            const filteredData = data.flatMap(innerArray => innerArray)
              .filter(item => position_allow.includes(item.permission_group))
              .map(({ citizenId, hospitalCode, username }) => ({ citizenId, hospitalCode, username }));

            // console.log(filteredData);
            // count if have more than 0
            if (filteredData.length > 0 && response.status === 200) {
              // console.log(filteredData[0].hospitalCode);
              this.createToken(filteredData[0].hospitalCode, filteredData[0].username, cid);
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

    createToken: async function (hoscode, username, cid) {
      this.loggingIn = true;
      // ใช้ token สร้างเอง
      const url = 'https://authen.chiangmaihealth.go.th/viewer/';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_token: this.account_token,
          hosCode: hoscode,
          cid: cid,
          patientCid: '0000000000000',
          patientHosCode: hoscode,
        }),
      });

      const data = await response.json();
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
        text: 'กรุณาแจ้งผู้ดูแลระบบ ตรวจสอบสิทธิในระบบ iHIMS',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#016b5f',
      });
    },
    openAndCloseTab(url) {
      const url_open = url
      // Open a new tab
      const newTab = window.open(url_open, '_blank');

      // Close the new tab after 2 seconds
      setTimeout(() => {
        newTab.close();
        // close api to check active every 2 sec.
        clearInterval(this.interval);
      }, this.countdown * 1000);
    },
    login: async function () {
      try {
        this.loggingIn = true;
        var api_url = ''
        api_url = this.selectHospital === '10714' ?
          'https://api-onelr.lphis.org/auth/login' : 'https://api.cmhis.org/cmhis/auth/login/his/viewer';
        const response = await fetch(api_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
            hosCode: this.selectHospital,
            cid: '0000000000000',
            patientCid: '1111111111111',
            patientHosCode: this.selectHospital,
          }),
        });

        const data = await response.json();
        const status_code = response.status;

        if (status_code === 200 && data.status === 'success') {
          const token = data.tokenViewer
          // set token to local storage
          localStorage.setItem('token', token);
          // set isAuthenticated to true

          // cosole log localStorage.getItem
          // console.log(localStorage.getItem('token'))
          // eslint-disable-next-line no-undef
          alertify.set('notifier', 'position', 'top-right');
          // eslint-disable-next-line no-undef
          alertify.success('Login สำเร็จ!');

          // from LINE
          if (this.$route.query.path && this.$route.query.hcode && this.$route.query.an && this.$route.query.cid) {
            this.$router.push('/' + this.$route.query.path + '/' + this.$route.query.hcode + '/' + this.$route.query.an + '/' + this.$route.query.cid);
          } else {
            this.$router.push('/dashboard');
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
      } catch (error) {
        this.loggingIn = false;
        console.error(error);
        // Handle login error
      }
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

.login-page {
  /* background: linear-gradient(to bottom right, #016b5f, #52B7A8); */
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
  font-weight: bold;
}

.province {
  font-size: 1.3rem;
  font-weight: bold;
  color: #000;

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
</style>