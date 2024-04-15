<template>
  <div class="content">
    <div class="container-fluid pt-3" >
      <nav aria-label="breadcrumb" >
        <ol class="breadcrumb" style="margin-bottom: 0.35rem !important;">
          <router-link :to="{ name: 'dashboard' }" class="breadcrumb-item">หน้าหลัก</router-link>
          <router-link :to="{ name: 'hospital' }" class="breadcrumb-item">{{ hospital_name }}</router-link>
          <li class="breadcrumb-item active" aria-current="page">ประวัติผู้ป่วย</li>
        </ol>
      </nav>
      <div class="row">
        <div class="container-fluid pb-2">
          <div class="d-flex justify-content-end">
            <!-- make a link class btn -->

            <!-- <a href="#" class="btn btn-primary"><i class="fas fa-print"></i> พิมพ์</a> -->
            <router-link class="btn btn-primary" :to="'/print/'+ this.hoscode + '/' + this.an +'/'+ this.cid + '?hospital_name=' + hospital_name"><i class="fas fa-print"></i> พิมพ์</router-link>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-lg-12">
          <div class="card">
            <div class="card-header border-1">
              <div class="d-flex">
                <div>
                  <img class="float-left img-circle hover-zoom pt-picture mr-3"
                       :src="patients.image ? patients.image : 'images/user.png'"
                       alt="patient_picture">
                </div>
                <p class="d-flex flex-column">
                  <span class="text-bold text-lg"><span v-if="patients.title">{{
                      patients.title
                    }}</span>{{ patients.pname + " " + patients.lname }}
                  <span v-if="patients.status === 0"
                        class="alert alert-default-danger preg-status ml-2">ยังไม่คลอด</span>
                      <span v-else class="alert alert-success preg-status ml-2">คลอดแล้ว</span>
                  </span>
                  <span class="description text-mutedd">HN: {{ patients.hn }} AN: {{ patients.an }}
                    อายุ: {{ patients.age_y }} ปี</span>
                  <span class="description my-des2"><span class="badge bg-info badge-bigger mr-1"><i
                      class="far fa-address-card mr-1"></i></span>{{ patients.cid }}
                    <span class="badge bg-info badge-bigger ml-3 mr-1"><i
                        class="fas fa-procedures"></i></span> {{ dateFormat(patients.admit_date) }} น.
                  </span>
                </p>
<!--                <div v-if="toAlarm" class="ml-auto alert alert-danger pulse text-alert">-->
<!--                  <i class="fas fa-ambulance"></i> คำแนะนำ: ควรประสานให้ส่งต่อทันที !-->
<!--                </div>-->
                <div class="ml-auto d-flex text-right">
                  <div>
                    <span v-if="toAlarm" class="alert alert-danger pulse my-alert"><i class="fas fa-ambulance"></i> <strong>คำแนะนำ: </strong>ควรประสานให้ส่งต่อทันที !</span>
                    <span :class="scoreClass(patients.cpd_risk_score)" style="font-size: 1.2rem"><i class="fab fa-cloudscale"></i> CPD {{ patients.cpd_risk_score }}</span>
                  </div>
                </div>
                <div class="card-tools">
                  <div>
                    <button type="button"
                            class="btn btn-tool"
                            data-card-widget="maximize">
                      <i class="fas fa-expand"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                      <i class="fas fa-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-footer border-bottom-1">
              <div class="row">
                <div><i class="fas fa-venus-mars icon-blue ml-4"></i> ครรภ์ที่ = <span
                    class="text-mutedd">{{ patients.gravida }}</span>
                </div>
                <div><i class="fas fa-stethoscope icon-blue ml-4"></i> ANC = <span
                    class="text-muted"> {{ patients.anc_check_up }}  ครั้ง</span></div>
                <div><i class="fas fa-child icon-blue ml-4"></i> GA = <span class="text-muted">{{
                    patients.ga
                  }} สัปดาห์</span></div>
                <div><i class="fas fa-ruler-vertical icon-blue ml-4"></i> ส่วนสูง = <span
                    class="text-muted"> {{ patients.height }}  ซม.</span>
                </div>
                <div><i class="fas fa-weight icon-blue ml-4"></i> ส่วนต่าง นน. <span
                    class="text-muted">{{ patients.weight_before_pregancy }} → {{
                    patients.weight_at_delivery
                  }} = {{ patients.weight_gain }} กก.</span>
                </div>
                <div><i class="fas fa-arrows-alt-v icon-blue ml-4"></i> ยอดมดลูก = <span
                    class="text-muted">{{ patients.fundal_height }} ซม.</span></div>
                <div><i class="fas fa-vial icon-blue ml-4"></i> Hematocrit = <span
                    :class="{'text-muted': patients.hematocrit >= 30, 'text-red beat': patients.hematocrit <= 30}">
                  {{ patients.hematocrit }} %
                </span></div>
                <div><i class="fas fa-baby icon-blue ml-4"></i> Ultrasound = <span
                    :class="{'text-muted': patients.ultrasound < 3500, 'text-red beat': patients.ultrasound >= 3500}">{{
                    patients.ultrasound
                  }} กรัม</span></div>
              </div>
            </div>
            <div class="card-body" style="padding-top: 0.4rem!important;">
              <div class="row">
                <div class="col-lg-6 col-md-6">
                  <ul class="nav flex-column mylink">
                    <li class="nav-item">
                      <a class="nav-link">
                        ประมาณน้ำหนักเด็ก (U/S)<span
                          :class="{'float-right text-blue bigger-text font-weight-bold': patients.ultrasound < 3500,
                          'float-right text-red heart bigger-text font-weight-bold': patients.ultrasound >= 3500}">
                        {{ patients.ultrasound }}
                    <span class="unit">กรัม</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        ความเข้มเลือด (Hematocrit)
                        <span :class="{'float-right bigger-text text-blue font-weight-bold': true,
                        'float-right bigger-text text-red heart heartbeat font-weight-bold': patients.hematocrit <= 30 }">
<!--                        <span class="float-right bigger-text text-blue font-weight-bold">-->
                    {{ checkHemato(patients.hematocrit) }}
                    <span class="unit"> %</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        ความสูงยอดมดลูก <span
                          class="float-right text-blue bigger-text font-weight-bold">
                      {{ patients.fundal_height }}
                    <span class="unit">ซม.</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        ลักษณะน้ำคร่ำ<span
                          class="float-right text-blue bigger-text font-weight-bold">
                      {{ mapArrayC07[c07Value] }}
                    </span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        การตกเลือดหลังคลอด (PPH)
                        <span :class="{'float-right bigger-text text-blue font-weight-bold': true,
                        'float-right bigger-text text-red heart heartbeat font-weight-bold': lastValuePph > 300 }">
                      {{ lastValuePph }}
                    <span class="unit">มล.</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        ปากมดลูกเปิด (Cervix length) <span
                          class="float-right text-blue bigger-text font-weight-bold">
                      {{ lastValuePartogram }}
                    <span class="unit">ซม.</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        อัตราการเต้นหัวใจแม่ (HR) <span
                          class="float-right text-blue bigger-text font-weight-bold">
                      {{ lastValueHr }}
                    <span class="unit">ครั้ง/นาที</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        อัตราการเต้นหัวใจลูก (FHR) <span
                          class="float-right text-blue bigger-text font-weight-bold">
                      {{ lastValueFhs }}
                    <span class="unit">ครั้ง/นาที</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        ความดันโลหิตแม่ (SBP/DBP) <span
                          class="float-right text-blue bigger-text font-weight-bold">
                      {{ lastValueSbp }}/{{ lastValueDbp }}
                    <span class="unit">mmHg.</span></span>
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link">
                        การบีบรัดของมดลูก (interval/duration/intensity)<span
                          class="float-right text-blue bigger-text font-weight-bold">
                     {{ lastValueInterval }} นาที/{{ lastValueDuration }} วินาที/{{ lastValueIntensity }}
                        <!--                    <span class="unit">นาที/ระดับความแรง</span>-->
                      </span>
                      </a>
                    </li>
                  </ul>
                </div>

                <!--                <div :class="{ 'col-lg-3 col-md-3 col-auto': true, 'd-none': lastValuePartogram === null }">-->
                <div class="col-lg-3 col-md-3">
                  <div class="card">
                    <div class="card-header my-card-header">
                      <div class="card-tools">
                        <button type="button"
                                class="btn btn-tool"
                                data-card-widget="maximize">
                          <i class="fas fa-expand"></i>
                        </button>
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>

                    <div class="card-body box-profile my-card-body">
                      <div class="text-center">
                        <div class="d-flex justify-content-center">
                          <div
                              v-bind:class="{ 'coin text-bp bigger-text': true, 'bg-red': overRateLimitPartogram }">
                            {{ lastValuePartogram }}
                          </div>
                        </div>
                      </div>

                      <div class="text-center font-1p3rem">
                        <i class="fas fa-burn beat"></i>
                        Partogram
                      </div>

                      <div class="text-muted text-center mb-1">
                        {{ lastUpdatePartogram }}
                      </div>

                      <ul class="list-group list-group-unbordered mb-3">
                        <li class="list-group-item">
                          <chart-partogram @last-data-partogram="handleLastDataPartogram"
                                           @slow-partogram="handleSlowPartogram"/>
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                </div>

                <!-- บีบรัด -->
                <!--                <div :class="{ 'col-lg-3 col-md-3': true, 'd-none': lastValuePartogram === null }">-->
                <div class="col-lg-3 col-md-3">
                  <div class="card">
                    <div class="card-header my-card-header">
                      <div class="card-tools">
                        <button type="button"
                                class="btn btn-tool"
                                data-card-widget="maximize">
                          <i class="fas fa-expand"></i>
                        </button>
                        <button type="button" class="btn btn-tool" data-card-widget="collapse">
                          <i class="fas fa-minus"></i>
                        </button>
                      </div>
                    </div>

                    <div class="card-body box-profile my-card-body overflow-auto" style="height: 19.3rem">
                      <i class="fas fa-burn beat"></i>
                      <span class="ml-2">การบีบรัดของมดลูก</span>
                      <ul class="list-group list-group-unbordered mb-3">
                        <li class="my-list">
                          <table class="table table-striped" style="font-size: 0.8rem">
                            <thead class="sticky-top">
                            <tr>
                              <th scope="col">Time</th>
                              <th scope="col">Interval</th>
                              <th scope="col">Duration</th>
                              <th scope="col">Intensity</th>
                            </tr>
                            </thead>
                            <tbody style="font-size: 0.85rem">
                            <tr v-for="item in sortedDataC2" :key="item.cid">
                              <td>{{ timeFormat(item.progress_date_time) }} น.</td>
                              <td>{{ item.value }} นาที</td>
                              <td>{{ item.value2 }} วินาที</td>
                              <td>{{ mapArray[item.value3] }}</td>
                            </tr>
                            </tbody>
                          </table>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <!-- /บีบรัด -->

              </div>

              <ul class="nav flex-column mylink">
                <transition name="fade" class="mt-2">
                  <li class="nav-item">
                    <div class="row">
                      <!--   box -->
                      <!-- HR -->
                      <!--                      <div :class="{ 'col-lg-3 col-md-3': true, 'd-none': lastValueHr === null }">-->
                      <div class="col-lg-3 col-md-3">
                        <div class="card">
                          <div class="card-header my-card-header">
                            <div class="card-tools">
                              <button type="button"
                                      class="btn btn-tool"
                                      data-card-widget="maximize">
                                <i class="fas fa-expand"></i>
                              </button>
                              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                              </button>
                            </div>
                          </div>
                          <div class="card-body box-profile my-card-body">
                            <div class="text-center">
                              <div class="d-flex justify-content-center">
                                <div :class="{ 'coin text-bp bigger-text': true, 'bg-red': overRateLimitHr }">
                                  {{ lastValueHr }}
                                </div>
                              </div>
                            </div>

                            <div class="text-center font-1p3rem">
                              <i class="fas fa-heartbeat beat"></i>
                              HR
                            </div>

                            <div class="text-muted text-center mb-1">
                              {{ lastUpdateHr }}
                            </div>

                            <ul class="list-group list-group-unbordered mb-3">
                              <li class="list-group-item">
                                <chart-hr @last-data-hr="handleLastDataHr"/>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <!--                      <div :class="{ 'col-lg-3 col-md-3': true, 'd-none': lastValueFhs === null }">-->
                      <div class="col-lg-3 col-md-3">
                        <div class="card">
                          <div class="card-header my-card-header">
                            <div class="card-tools">
                              <button type="button"
                                      class="btn btn-tool"
                                      data-card-widget="maximize">
                                <i class="fas fa-expand"></i>
                              </button>
                              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                              </button>
                            </div>
                          </div>

                          <div class="card-body box-profile my-card-body">
                            <div class="text-center">
                              <div class="d-flex justify-content-center">
                                <div :class="{ 'coin text-bp bigger-text': true, 'bg-red': overRateLimitFhs }">
                                  {{ lastValueFhs }}
                                </div>
                              </div>
                            </div>

                            <div class="text-center font-1p3rem">
                              <i class="fas fa-stethoscope beat"></i>
                              FHR
                            </div>

                            <div class="text-muted text-center mb-1">
                              {{ lastUpdateFhs }}
                            </div>

                            <ul class="list-group list-group-unbordered mb-3">
                              <li class="list-group-item">
                                <chart-fhs @last-data-fhs="handleLastDataFhs"/>
                              </li>
                            </ul>

                          </div>
                        </div>
                      </div>

                      <!--                      <div :class="{ 'col-lg-3 col-md-3': true, 'd-none': lastValueSbp === null }">-->
                      <div class="col-lg-3 col-md-3">
                        <div class="card">
                          <div class="card-header my-card-header">
                            <div class="card-tools">
                              <button type="button"
                                      class="btn btn-tool"
                                      data-card-widget="maximize">
                                <i class="fas fa-expand"></i>
                              </button>
                              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                              </button>
                            </div>
                          </div>
                          <div class="card-body box-profile my-card-body">
                            <div class="text-center">
                              <div class="d-flex justify-content-center">
                                <div v-bind:class="{ 'coin text-bp': true, 'bg-red': overRateLimitBp }">
                                  {{ lastValueSbp }}/{{ lastValueDbp }}
                                </div>
                              </div>
                            </div>
                            <div class="text-center font-1p3rem ">
                              <i class="fas fa-arrows-alt-v beat"></i>
                              SBP/DBP
                            </div>

                            <div class="text-muted text-center mb-1">
                              {{ lastUpdateBp }}
                            </div>

                            <ul class="list-group list-group-unbordered mb-3">
                              <li class="list-group-item">
                                <chart-bp @last-data-bp="handleLastDataBp"/>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <!--                      <div :class="{ 'col-lg-3 col-md-3 col-auto': true, 'd-none': lastValuePph === null }">-->
                      <div class="col-lg-3 col-md-3">
                        <div class="card">
                          <div class="card-header my-card-header">
                            <div class="card-tools">
                              <button type="button"
                                      class="btn btn-tool"
                                      data-card-widget="maximize">
                                <i class="fas fa-expand"></i>
                              </button>
                              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                                <i class="fas fa-minus"></i>
                              </button>
                            </div>
                          </div>

                          <div class="card-body box-profile my-card-body">
                            <div class="text-center">
                              <div class="d-flex justify-content-center">
                                <div
                                    v-bind:class="{ 'coin text-bp bigger-text': true, 'bg-red': overRateLimitPph }">
                                  {{ lastValuePph }}
                                </div>
                              </div>
                            </div>

                            <div class="text-center font-1p3rem">
                              <i class="fas fa-burn beat"></i>
                              PPH
                            </div>

                            <div class="text-muted text-center mb-1">
                              {{ lastUpdatePph }}
                            </div>

                            <ul class="list-group list-group-unbordered mb-3">
                              <li class="list-group-item">
                                <chart-pph @last-data-pph="handleLastDataPph"/>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </transition>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChartHr from "@/components/chart/ChartHr";
import ChartPph from "@/components/chart/ChartPph";
import ChartFhs from "@/components/chart/ChartFhs";
import ChartBp from "@/components/chart/ChartBp";
import ChartPartogram from "@/components/chart/ChartPartogram";
import axios from "axios";
import moment from "moment";

export default {
  name: "PatientDetail",
  components: {
    ChartFhs,
    ChartHr,
    ChartBp,
    ChartPartogram,
    ChartPph
  },
  data() {
    return {
      lastValueFhs: null,
      lastUpdateFhs: '',
      lastValueHr: null,
      lastUpdateHr: '',
      lastValuePph: null,
      lastUpdatePph: '',
      lastValueSbp: null,
      lastValueDbp: null,
      lastUpdateBp: '',
      lastValuePartogram: null,
      lastUpdatePartogram: null,
      overRateLimitBp: false,
      overRateLimitHr: false,
      overRateLimitPph: false,
      overRateLimitFhs: false,
      overRateLimitPartogram: false,
      slowPartogram: false,
      patients: [],
      cpd_risk_score: '',
      weight_gain: '',
      score: '',
      pregImage: require('@/assets/img/user.png'),
      toAlarm: false,
      showAlert: false,
      patientData: '',
      mapArray: [null, "mild", "moderate", "strong"],
      c07Data: '-',
      c04Data: '-',
      c07Value: '-',
      mapArrayC07: [null, "ใส (clear)", "ขี้เทา (meconium)", "ประเมินไม่ได้"],
      filteredData: [],
      sortedDataC2: [],
      lastValueInterval: null,
      lastValueDuration: null,
      lastValueIntensity: null,
      hospital_name: null,
      hoscode: '',
      an: '',
      cid: ''
    };
  },
  async created() {
    const hoscode = this.$route.params.hoscode
    this.hoscode = hoscode
    const an = this.$route.params.an
    this.an = an
    this.cid = this.$route.params.cid
    const api_url = 'https://api-onelr.lphis.org/dashboard/patient/' + hoscode + '/' + an
    await axios.post(api_url)
        .then(response => {
          this.patients = response.data;
          this.weight_gain = this.patients.weight_at_delivery - this.patients.weight_before_pregancy
          this.score = this.patients.cpd_risk_score
        })
  },
  mounted() {
    this.getHospital(this.$route.params.hoscode);
    // Fetch data initially
    this.fetchData();

    // Set up polling every 30 seconds (adjust the interval as needed)
    this.pollingInterval = setInterval(this.fetchData, 30 * 1000); // 30 seconds
  },
  beforeUnmount() {
    // Clear the interval to prevent memory leaks
    clearInterval(this.pollingInterval);
  },

  methods: {
    timeFormat(time) {
      return moment(time).format('HH:mm');
    },

    checkHemato(hematocrit) {
      if (hematocrit <= 30) {
        this.toAlarm = true;
        return hematocrit
      } else {
        return hematocrit
      }
    },

    dateFormat(time) {
      // const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
      const options = {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'};
      const thaiLocale = 'th-TH';
      const datetime = new Date(time);
      return datetime.toLocaleDateString(thaiLocale, options)
    },

    getHospital(hoscode) {
      const api_url = 'https://api-onelr.lphis.org/dashboard/hospitals/'
      axios.get(api_url)
          .then(response => {
            this.hospital = response.data;
            for (const item of this.hospital) {
              if (item.hoscode === hoscode) {
                this.hospital_name = item.hosname;
              }
            }
          })
    },

    async fetchData() {
      const token = localStorage.getItem('token')
      let data = JSON.stringify({
        "token": token,
        "hcode": this.$route.params.hoscode,
        "cid": this.$route.params.cid,
        "an": this.$route.params.an
      });

      let config = {
        method: 'post',
        // maxBodyLength: Infinity,
        url: 'https://api-onelr.lphis.org/progress/search/',
        // url: 'http://localhost:8085/progress/search/',
        headers: {
          'Content-Type': 'application/json'
        },
        data: data
      };

      try {
        const response = await axios.request(config);

        // console.log("response.data => " + JSON.stringify(response.data) );

        const c07 = response.data.find(item => item.code === 'C07');
        this.c07Value = c07 ? c07.value : '-';

        this.filteredData = response.data.filter(item => item.code === 'C02');
        // console.log("this.filteredData C02 => " + JSON.stringify(this.filteredData) );

        // Assuming filteredData contains the filtered and updated data
        this.sortedDataC2 = this.filteredData.sort((a, b) => {
          const dateA = new Date(a.progress_date_time);
          const dateB = new Date(b.progress_date_time);
          return dateB - dateA;
        });

        // console.log("this.sortedDataC2 => " + JSON.stringify(this.sortedDataC2) );

        this.lastValueInterval = this.sortedDataC2[0].value;
        this.lastValueDuration = this.sortedDataC2[0].value2;
        this.lastValueIntensity = this.mapArray[this.sortedDataC2[0].value3];
      } catch (error) {
        console.log(error);
      }

    },

    handleLastDataFhs(value) {
      this.lastValueFhs = value.lastValue;
      this.lastUpdateFhs = value.lastUpdate;
      this.overRateLimitFhs = value.overRateLimit;
      // shorten if statement
      this.toAlarm = this.slowPartogram || this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPph;
    },
    handleLastDataHr(value) {
      this.lastValueHr = value.lastValue;
      this.lastUpdateHr = value.lastUpdate;
      this.overRateLimitHr = value.overRateLimit;
      // shorten if statement
      this.toAlarm = this.slowPartogram || this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPph;
    },
    handleLastDataPph(value) {
      this.lastValuePph = value.lastValue;
      this.lastUpdatePph = value.lastUpdate;
      this.overRateLimitPph = value.overRateLimit;
      // shorten if statement
      this.toAlarm = this.slowPartogram || this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPph;
    },
    handleLastDataBp(value) {
      this.lastValueSbp = value.lastValue1;
      this.lastValueDbp = value.lastValue2;
      this.lastUpdateBp = value.lastUpdate;
      this.overRateLimitBp = value.overRateLimit;
      // shorten if statement
      this.toAlarm = this.slowPartogram || this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPph;
    },
    handleLastDataPartogram(value) {
      this.lastValuePartogram = value.lastValue;
      this.lastUpdatePartogram = value.lastUpdate;
      this.overRateLimitPartogram = value.overRateLimit;

      // shorten if statement
      // partogram ไม่ต้องแจ้งเตือน
      // this.toAlarm = this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPartogram;
    },
    handleSlowPartogram(value) {
      this.slowPartogram = value.slowPartogram;
      // console.log("slowPartogram => " + this.slowPartogram);
      // shorten if statement
      this.overRateLimitPartogram = this.slowPartogram;

      this.toAlarm = this.slowPartogram || this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPph;
    },
    showPtg(value) {
      // alert(this.lastValuePartogram)
      alert(value)
      return ''
      // return this.lastValuePartogram !== null;
    },
    scoreClass(cpd_risk_score) {
      if (cpd_risk_score >= 0 && cpd_risk_score < 5) {
        return 'badge px-2 mr-2 text-bigger mr-3 ml-3 bg-success';
      } else if (cpd_risk_score >= 5 && cpd_risk_score <= 9.5) {
        return 'badge px-2 mr-2 text-bigger mr-3 ml-3 bg-warning';
      } else if (cpd_risk_score > 9.5) {
        return 'badge px-2 mr-2 text-bigger pulse mr-3 ml-3 bg-danger';
      }
    }
  },
  computed: {
    // scoreClass() {
    //   if (this.score >= 0 && this.score < 5) {
    //     return 'text-warning text-lg badge rounded-pill bg-success';
    //   } else if (this.score >= 5 && this.score <= 9.5) {
    //     return 'text-warning text-lg badge rounded-pill bg-warning';
    //   } else if (this.score > 9.5) {
    //     return 'text-warning text-lg badge rounded-pill bg-danger';
    //   }
    //   return '';
    // }
  },
}
</script>

<style scoped>
.text-alert {
  font-size: 1.6rem;
  line-height: 1.4rem;
}

.alert {
  border-radius: 0.7rem;
}

.card-header {
  padding-bottom: 0;
}

.border-bottom-1 {
  border-bottom: 1px solid #dee2e6;
}

.my-card-header {
  border-bottom: 0;
  padding-top: 0.1rem;
}

.my-card-body {
  padding-top: 0;
}

.text-bp {
  font-size: 1.15rem;
}

.bg-red {
  background-color: #f6124e;
}

.bg-orange {
  background-color: #ff8c00;
}

.bigger-text {
  font-size: 1.3rem;
}

.icon-blue {
  color: #58a7ff;
}

.card-body .nav-link {
  padding-top: 0.1rem !important;
  padding-bottom: 0 !important;
}

.pulse {
  cursor: pointer;
  box-shadow: 0 0 0 rgb(201, 50, 37);
  animation: pulse 2s infinite;
}

.pulse:hover {
  animation: none;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgb(201, 50, 37);
  //transform: scale(1);
  }
  70% {
    -webkit-box-shadow: 0 0 0 30px rgba(204, 169, 44, 0);
  //transform: scale(1.1);
  }
  100% {
    -webkit-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  //transform: scale(1);
  }
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgb(201, 50, 37);
    box-shadow: 0 0 0 0 rgb(201, 50, 37);
    /*transform: scale(1);*/
  }
  70% {
    -moz-box-shadow: 0 0 0 10px rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 20px rgba(204, 169, 44, 0);
  //transform: scale(1.1);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
    box-shadow: 0 0 0 0 rgba(204, 169, 44, 0);
  //transform: scale(1);
  }
}

.card-body {
  padding-bottom: 0 !important;
}

.my-list {
  list-style-type: none;
}

.heart {
//position: relative; animation: heartbeat 1s infinite;
}


@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.hover-zoom {
  transition: transform 0.3s ease;
}

.hover-zoom:hover {
  transform: scale(2.5);
}

.preg-status {
  font-size: 0.9rem;
  font-weight: 400;
}


.alert-default-danger {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  border: 0 !important;
}

.alert-success {
  padding: 0 0.5rem !important;
  border-radius: 50px;
  background-color: #04c7aa !important;
  border-color: #04c7aa !important;
}

.my-alert {
  font-size: 1.2rem;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}

</style>