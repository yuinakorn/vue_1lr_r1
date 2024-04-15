<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <div class="header mb-2">
        <div class="row pt-3">
          <div
            class="col d-flex justify-content-start"
            style="font-size: 1.3rem"
          >
            รายชื่อหญิงรอคลอด
          </div>
          <div class="col d-flex justify-content-end mx-1">
            <!-- Default switch -->
            <div class="custom-control custom-switch mx-2">
              <input
                type="checkbox"
                class="custom-control-input"
                id="waitingSwitch"
                v-model="show_waiting"
                @click="resetshow"
                @change="showchange"
              />
              <label class="custom-control-label" for="waitingSwitch"
                >รอคลอด</label
              >
            </div>
            <div class="custom-control custom-switch mx-2">
              <input
                type="checkbox"
                class="custom-control-input"
                id="deliverSwitch"
                v-model="show_deliver"
                @click="resetshow"
                @change="showchange"
              />
              <label class="custom-control-label" for="deliverSwitch"
                >คลอดแล้ว</label
              >
            </div>
            <div class="custom-control custom-switch mx-2">
              <input
                type="checkbox"
                class="custom-control-input"
                id="referoutSwitch"
                v-model="show_refer_out"
                @click="resetshow"
                @change="showchange"
              />
              <label class="custom-control-label" for="referoutSwitch"
                >รีเฟอร์แล้ว</label
              >
            </div>

            <router-link to="/backend/preg_create">
              <button class="btn btn-success ml-1">เพิ่มข้อมูล</button>
            </router-link>
          </div>
        </div>
      </div>
      <table class="table table-sm table-hover table-striped table-bordered">
        <thead class="table-info">
          <tr>
            <th scope="col" width="40px" class="text-center">#</th>
            <th scope="col" width="60px" class="text-center">
              คำนำ<br />หน้าชื่อ
            </th>
            <th scope="col" class="text-center">ชื่อ</th>
            <th scope="col" class="text-center">สกุล</th>
            <th scope="col" width="125px" class="text-center">CID</th>
            <th scope="col" width="100px" class="text-center">HN</th>
            <th scope="col" width="100px" class="text-center">AN</th>
            <th scope="col" width="100px" class="text-center">
              วันที่<br />Admit
            </th>
            <th scope="col" width="52px" class="text-center">
              Risk<br />score
            </th>
            <th scope="col" width="55px" class="text-center">
              สถานะ<br />คลอด
            </th>
            <th scope="col" width="55px" class="text-center">
              สถานะ<br />Refer
            </th>
            <th scope="col" width="220px" class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(preg, index) in data_show" :key="index">
            <th class="text-center">{{ pregs.length - index }}</th>
            <td class="text-center">{{ preg.title }}</td>
            <td>{{ preg.pname }}</td>
            <td>{{ preg.lname }}</td>
            <td class="text-center">{{ preg.cid }}</td>
            <td class="text-center">{{ preg.hn }}</td>
            <td class="text-center">{{ preg.an }}</td>
            <td class="text-right" style="font-size: 1rem; line-height: 1">
              <span v-html="format_date(preg.admit_date)"></span>
            </td>
            <td v-if="preg.cpd_risk_score < 5" class="text-center">
              <span class="badge bg-success" style="font-size: 1.3rem">{{
                preg.cpd_risk_score
              }}</span>
            </td>
            <td
              v-else-if="preg.cpd_risk_score >= 5 && preg.cpd_risk_score <= 9.5"
              class="text-center"
            >
              <span class="badge bg-warning" style="font-size: 1.3rem">{{
                preg.cpd_risk_score
              }}</span>
            </td>
            <td v-else class="text-center">
              <span class="badge bg-danger" style="font-size: 1.3rem">{{
                preg.cpd_risk_score
              }}</span>
            </td>
            <td v-if="preg.status === 1" class="text-center">
              <span class="badge bg-success" style="font-size: 0.8rem"
                >คลอด<br />แล้ว</span
              >
            </td>
            <td v-else class="text-center">
              <span class="badge bg-danger" style="font-size: 0.8rem"
                >ยังไม่<br />คลอด</span
              >
            </td>
            <td v-if="preg.refer_out_status === 1" class="text-center">
              <span class="badge bg-success" style="font-size: 0.8rem"
                >ส่งตัว<br />แล้ว</span
              >
            </td>
            <td v-else class="text-center">
              <span class="badge bg-danger" style="font-size: 0.8rem"
                >ยังไม่<br />ส่งตัว</span
              >
            </td>
            <td class="text-right">
              <button
                v-if="
                  checkrefer_caution(
                    checkrefer_preg_data(preg),
                    preg.refer_status
                  )
                "
                style="position: relative; float: left"
                class="animated-button1 btn text-light p-0 px-2 py-1 mr-1"
                type="button"
                title="คำแนะนำ : ควรประสานส่งต่อทันที"
                @click="
                  msgshowsuccess(
                    'คำแนะนำ \nควรประสานส่งต่อทันที!!',
                    'warning',
                    true,
                    checkrefer_preg_data(preg),
                    preg.refer_status
                  )
                "
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <div class="heartbeat-animation">
                  <svg
                    class="svg-inline--fa fa-trash fa-w-18"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path
                      fill="currentColor"
                      d="M0 48C0 21.5 21.5 0 48 0H368c26.5 0 48 21.5 48 48V96h50.7c17 0 33.3 6.7 45.3 18.7L589.3 192c12 12 18.7 28.3 18.7 45.3V256v32 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H576c0 53-43 96-96 96s-96-43-96-96H256c0 53-43 96-96 96s-96-43-96-96H48c-26.5 0-48-21.5-48-48V48zM416 256H544V237.3L466.7 160H416v96zM160 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm368-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM176 80v48l-48 0c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V192h48c8.8 0 16-7.2 16-16V144c0-8.8-7.2-16-16-16H240V80c0-8.8-7.2-16-16-16H192c-8.8 0-16 7.2-16 16z"
                    />
                  </svg>
                </div>
              </button>
              <button
                title="ข้อมูลทารกแรกเกิด"
                v-if="preg.status === 1"
                class="btn btn-success btn-sm mx-1 px-2 py-0 pt-1"
                @click="
                  showbaby(
                    preg.cid,
                    preg.an,
                    preg.title,
                    preg.pname,
                    preg.lname
                  )
                "
              >
                <font-awesome-icon
                  :icon="['fas', 'baby']"
                  style="font-size: 1.4rem"
                />
              </button>
              <router-link
                :to="
                  '/backend/preg_update/' +
                  preg.hcode +
                  '/' +
                  preg.cid +
                  '/' +
                  preg.an
                "
              >
                <button
                  class="btn btn-info btn-sm mx-1 pl-2 pr-1 pt-1 pb-0"
                  title="แสดง/แก้ไข ข้อมูล"
                >
                  <svg
                    class="svg-inline--fa fa-w-18"
                    style="font-size: 1.4rem"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                  >
                    <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path
                      d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H322.8c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1H178.3zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z"
                    />
                  </svg>
                </button>
              </router-link>
              <router-link
                :to="
                  '/backend/progress_list/' +
                  preg.hcode +
                  '/' +
                  preg.cid +
                  '/' +
                  preg.an +
                  '/' +
                  preg.hn
                "
              >
                <!-- <button class="btn btn-warning btn-sm mx-2">Progress</button> -->
                <button
                  class="btn btn-warning btn-sm mx-1 pb-0 pr-1 pl-2"
                  title="เพิ่ม/ลบ progress"
                >
                  <svg
                    class="svg-inline--fa fa-w-18"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 512"
                    style="font-size: 1.4rem"
                  >
                    <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                    <path
                      d="M483.2 9.6L524 64h92c13.3 0 24 10.7 24 24s-10.7 24-24 24H512c-7.6 0-14.7-3.6-19.2-9.6L468.7 70.3l-47 99.9c-3.7 7.8-11.3 13.1-19.9 13.7s-16.9-3.4-21.7-10.6L339.2 112H216c-13.3 0-24-10.7-24-24s10.7-24 24-24H352c8 0 15.5 4 20 10.7l24.4 36.6 45.9-97.5C445.9 6.2 453.2 1 461.6 .1s16.6 2.7 21.6 9.5zM320 160h12.7l20.7 31.1c11.2 16.8 30.6 26.3 50.7 24.8s37.9-13.7 46.5-32L461.9 160H544c53 0 96 43 96 96V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V448H352 320 64v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V96C0 78.3 14.3 64 32 64s32 14.3 32 32V352H288V192c0-17.7 14.3-32 32-32zm-144 0a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"
                    />
                  </svg>
                </button>
              </router-link>

              <button
                title="ลบข้อมูล"
                class="btn btn-danger btn-sm ml-1"
                @click="delete_preg(preg.cid, preg.an, preg.pname, preg.lname)"
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
  
<script>
import { useRouter } from "vue-router";
import moment from "moment";
// import "moment/locale/th";
import Swal from "sweetalert2";
var axios = require("axios");
export default {
  name: "PregList",
  data() {
    return {
      pregs: [],
      data_show: [],
      data_waiting: [],
      data_deliver: [],
      data_refer_out: [],
      token: "",
      cid: "",
      an: "",
      hn: "",
      vfor_check_preg: [],
      vfor_check_progress: [],
      baby: "",
      wait_response: "",
      show_all: false,
      show_waiting: true,
      show_deliver: false,
      show_refer_out: false,
    };
  },
  async created() {
    this.loadData();
  },
  methods: {
    async getPregupdate(hcode, cid, an) {
      const router = useRouter();
      router.push({
        name: "preg_update",
        params: { hcode: hcode, cid: cid, an: an },
      });
    },
    format_date(value) {
      var datereturn;
      var datesplit;
      if (value) {
        datereturn = moment(String(value)).format("YYYY-MM-DD HH:mm");
        datesplit = datereturn.split(" ");
        if (Array.isArray(datesplit) && datesplit.length > 1) {
          datereturn = datesplit[0] + "<br/>" + datesplit[1];
        }
        // datereturn = "<div class='btn btn-secondary'>" + datereturn[0] + "<span class='badge badge-light'>"+ datereturn[1] +"</span></div>";
        return datereturn;
      }
    },
    loadData() {
      this.token = localStorage.getItem("token");
      let data = JSON.stringify({
        token: this.token,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/pregs/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          this.data = response.data.sort((a, b) =>
            a.admit_date < b.admit_date ? 1 : -1
          );
          this.pregs = response.data;
          this.data_waiting = this.pregs.filter((item) => item.status == "0");
          this.data_deliver = this.pregs.filter((item) => item.status == "1");
          this.data_refer_out = this.pregs.filter(
            (item) => item.refer_out_status == "1"
          );
          this.data_show = this.data_waiting;
        })
        // eslint-disable-next-line
        .catch((error) => {});
    },
    delete_preg(cid, an, pname, lname) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "ยืนยันการลบข้อมูล?",
          text: "คุณกำลังจะลบข้อมูลของ " + pname + " " + lname + "!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน!",
          cancelButtonText: "ยกเลิก!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            const axios = require("axios");
            let data = JSON.stringify({
              token: this.token,
              cid: cid,
              an: an,
            });
            let config = {
              method: "delete",
              maxBodyLength: Infinity,
              url: "https://api-onelr.lphis.org/pregs/delete/",
              headers: {
                "Content-Type": "application/json",
              },
              data: data,
            };
            axios
              .request(config)
              // eslint-disable-next-line
              .then((response) => {
                this.loadData();
                this.msgshowsuccess("ลบข้อมูลสำเร็จ", "success");
              })
              // eslint-disable-next-line
              .catch((error) => {
                this.msgshowsuccess("ลบข้อมูลไม่สำเร็จ", "error");
              });
          }
        });
    },
    msgshowsuccess(
      txtshow,
      statusshow,
      html = false,
      preg_data = [false, false, false],
      val_refer_status = 0
    ) {
      if (html) {
        var chkprogress_1 = 0;
        var chkprogress_2 = 0;
        var chkprogress_3 = 0;
        if (
          val_refer_status !== 0 &&
          typeof val_refer_status != "undefined" &&
          val_refer_status !== null
        ) {
          var str_refer_status = String(val_refer_status).split("");
          chkprogress_1 = str_refer_status[0];
          chkprogress_2 = str_refer_status[1];
          chkprogress_3 = str_refer_status[2];
        }
        var show_caution_hema =
          "- ความเข้มข้นของเลือดก่อนคลอด(Hematocrit) น้อยกว่าหรือเท่ากับ 30%";
        var show_caution_ultra =
          "- ประเมินน้ำหนักเด็กมากกว่าหรือเท่ากับ 3500 กรัม";
        var show_caution_cpd =
          "- การประเมินคะแนนความเสี่ยง(CPD Risk Score) มากกว่าหรือเท่ากับ 10 คะแนน";
        var show_caution_c01 =
          "- ปากมดลูก Progress ช้า น้อยกว่า 1 เซนติเมตร ใน 2 ชั่วโมง";
        var show_caution_c03 =
          "- อัตราการเต้นหัวใจของทารกในครรภ์ (FHR) ต่ำกว่า 110 ครั้ง/นาที หรือมากกว่า 170 ครั้ง/นาที";
        var show_caution_c04 =
          "- การตกเลือดหลังคลอด (PPH) มากกว่า 300 มิลลิลิตร";
        var show_caution_c05 =
          "- อัตราการเต้นหัวใจแม่ (HR) มากกว่า 100 ครั้ง/นาที";
        var show_caution_c06 = "- ความดันแม่(BP) เท่ากับหรือมากกว่า 150/100 ";
        var show_caution_c06_drop =
          "- BP Systolic drop > 30 หรือ Diastolic drop > 20";
        var span_danger = "<span class='text-danger'><b>";
        var span_danger_close = "</b></span>";

        if (preg_data[0]) {
          show_caution_hema =
            span_danger + show_caution_hema + span_danger_close;
        }
        if (preg_data[1]) {
          show_caution_ultra =
            span_danger + show_caution_ultra + span_danger_close;
        }
        if (preg_data[2]) {
          show_caution_cpd = span_danger + show_caution_cpd + span_danger_close;
        }
        if (chkprogress_1 == 1 || chkprogress_1 == 3) {
          show_caution_c01 = span_danger + show_caution_c01 + span_danger_close;
        }
        if (chkprogress_1 == 2 || chkprogress_1 == 3) {
          show_caution_c03 = span_danger + show_caution_c03 + span_danger_close;
        }
        if (chkprogress_2 == 1 || chkprogress_2 == 3) {
          show_caution_c04 = span_danger + show_caution_c04 + span_danger_close;
        }
        if (chkprogress_2 == 2 || chkprogress_2 == 3) {
          show_caution_c05 = span_danger + show_caution_c05 + span_danger_close;
        }
        if (chkprogress_3 == 1 || chkprogress_3 == 3) {
          show_caution_c06 = span_danger + show_caution_c06 + span_danger_close;
        }
        if (chkprogress_3 == 2 || chkprogress_3 == 3) {
          show_caution_c06_drop =
            span_danger + show_caution_c06_drop + span_danger_close;
        }
        Swal.fire({
          position: "center",
          icon: statusshow,
          title: txtshow,
          html:
            "<b>เนื่องจากเข้าเงื่อนไข ข้อบ่งชี้การส่งต่อ ในข้อใดข้อหนึ่งดังนี้ </b><br/>" +
            "<div class='text-left'>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_hema +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_ultra +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_cpd +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_c01 +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_c03 +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_c04 +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_c05 +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_c06 +
            "<br/>" +
            "&nbsp;&nbsp;&nbsp; " +
            show_caution_c06_drop +
            "<br/>",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: statusshow,
          title: txtshow,
          showConfirmButton: true,
        });
      }
    },
    async showbaby(cid, an, prefix, pname, lname) {
      var loadingAlert = Swal.fire({
        title: "กำลังทำการค้นหาข้อมูล",
        html: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      this.token = localStorage.getItem("token");
      let data = JSON.stringify({
        token: this.token,
        cid: cid,
        an: an,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/infants/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          var baby = response.data;
          if (baby != "") {
            if (baby.length > 0) {
              // สร้าง HTML สำหรับแต่ละรายการข้อมูล
              var html = "";
              var showsex = [];
              showsex[1] = "ชาย";
              showsex[2] = "หญิง";

              html +=
                '<table class="table table-sm table-hover table-striped table-bordered">';
              html += "<tr>";
              html += '<th scope="col" width="40px" class="text-center">#</th>';
              html +=
                '<th scope="col" width="65px" class="text-center">Hcode</th>';
              html +=
                '<th scope="col" width="50px" class="text-center">เพศ</th>';
              html +=
                '<th scope="col" class="text-center">น้ำหนัก<br/>(กรัม)</th>';
              html +=
                '<th scope="col" class="text-center">apgar score<br/>1 min</th>';
              html +=
                '<th scope="col" class="text-center">apgar score<br/>5 min</th>';
              html += "</tr>";

              for (var i = 0; i < baby.length; i++) {
                var item = baby[i];
                html += "<tr>";
                html += "<th class='text-center'>" + item.infant_no + "</th>";
                html += "<td class='text-center'>" + item.hcode + "</td>";
                html +=
                  "<td class='text-center'>" + showsex[item.sex] + "</td>";
                html += "<td class='text-center'>" + item.bw + "</td>";
                html +=
                  "<td class='text-center'>" + item.apgar_score_1_min + "</td>";
                html +=
                  "<td class='text-center'>" + item.apgar_score_5_min + "</td>";
                html += "</tr>";
              }
              html += "</table>";
              Swal.fire({
                position: "center",
                icon: "info",
                title: "ข้อมูลทารกแรกเกิด\nของ " + prefix + pname + " " + lname,
                html: html,
                showConfirmButton: true,
                width: 600,
              });
            }
          } else {
            this.msgshowsuccess(
              "ไม่พบข้อมูลทารกแรกเกิดของ " + prefix + pname + " " + lname,
              "warning"
            );
          }
          loadingAlert.close();
        })
        // eslint-disable-next-line
        .catch((error) => {});
    },
    checkrefer_caution(
      preg_data = [false, false, false],
      val_refer_status = 0
    ) {
      var chkprogress_1 = 0;
      var chkprogress_2 = 0;
      var chkprogress_3 = 0;
      if (val_refer_status != 0 && val_refer_status != 444) {
        var str_refer_status = String(val_refer_status).split("");
        chkprogress_1 = str_refer_status[0];
        chkprogress_2 = str_refer_status[1];
        chkprogress_3 = str_refer_status[2];
      }
      if (
        preg_data[0] ||
        preg_data[1] ||
        preg_data[2] ||
        chkprogress_1 == 1 ||
        chkprogress_1 == 2 ||
        chkprogress_1 == 3 ||
        chkprogress_2 == 1 ||
        chkprogress_2 == 2 ||
        chkprogress_2 == 3 ||
        chkprogress_3 == 1 ||
        chkprogress_3 == 2 ||
        chkprogress_3 == 3
      ) {
        return true;
      } else {
        return false;
      }
    },

    checkrefer_preg_data(valchk) {
      var check_hemotocrit = false;
      var check_ultrasound = false;
      var check_cpd_risk_score = false;
      if (valchk.hematocrit <= 30 && !this.chkempty(valchk.hematocrit)) {
        check_hemotocrit = true;
      } else {
        check_hemotocrit = false;
      }
      if (valchk.ultrasound >= 3500 && !this.chkempty(valchk.ultrasound)) {
        check_ultrasound = true;
      } else {
        check_ultrasound = false;
      }
      if (
        valchk.cpd_risk_score >= 10 &&
        !this.chkempty(valchk.cpd_risk_score)
      ) {
        check_cpd_risk_score = true;
      } else {
        check_cpd_risk_score = false;
      }
      var preg_data = [];
      preg_data[0] = check_hemotocrit;
      preg_data[1] = check_ultrasound;
      preg_data[2] = check_cpd_risk_score;
      return preg_data;
    },
    chkempty(valchk) {
      //true == in-valid
      if (valchk === null || typeof valchk === "undefined") {
        return true;
      } else {
        valchk = String(valchk);
        if (valchk.trim() != "") {
          return false;
        } else {
          return true;
        }
      }
    },
    showclass(show) {
      var addClass = "btn-secondary h1";
      if (show) {
        addClass = "btn-primary";
      }
      return addClass;
    },
    showchange() {
      //this.resetshow();
      if (this.show_waiting || this.show_deliver || this.show_refer_out) {
        if (this.show_waiting) {
          this.data_show = this.data_waiting;
        }
        if (this.show_deliver) {
          this.data_show = this.data_deliver;
        }
        if (this.show_refer_out) {
          this.data_show = this.data_refer_out;
        }
      } else {
        this.data_show = this.pregs;
      }
    },
    resetshow() {
      this.show_all = false;
      this.show_waiting = false;
      this.show_deliver = false;
      this.show_refer_out = false;
    },
  },
};
</script>
<style>
.swal2-confirm {
  margin-left: 1rem;
}
</style>
<style>
@keyframes heartbeat {
  0% {
    transform: scale(1); /* ขนาดเริ่มต้น */
  }
  50% {
    transform: scale(1.2); /* ขยายภาพ */
  }
  100% {
    transform: scale(1); /* ขนาดกลับสู่ขนาดเดิม */
  }
}

.heartbeat-animation svg {
  animation: heartbeat 1s infinite; /* ระยะเวลาที่ใช้ในการเล่น animation */
}

.heartbeat-animation {
  display: inline-block;
  /* width: 100px; ปรับขนาดของพื้นที่ SVG ตามต้องการ  */
  /* height: 100px; */
}
/* 
.heartbeat-animation svg {
  width: 100%;
  height: 100%;
  fill: #ff0000; //ปรับสีของ SVG ตามต้องการ 
} 
*/
</style>
<style>
.btn-toggle {
  position: relative;
  width: 60px;
  height: 34px;
}

.btn-toggle .handle {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 26px;
  height: 26px;
  background-color: #fff;
  border-radius: 50%;
  transition: left 0.3s;
}

.btn-toggle[aria-pressed="true"] .handle {
  left: 30px;
}

.btn-toggle:focus {
  outline: none;
  box-shadow: none;
}
</style>