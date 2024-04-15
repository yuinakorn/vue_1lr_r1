<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <div class="row">
        <div id="column-left" class="col-lg-6 col-md-6">
          <!--                        card start here -->
          <h3>รอคลอด</h3>
          <div class="in-progress" v-for="(visit,index) in visits" :key="index">
            <div class="card card-success card-outline"
                 style="transition: all 0.15s ease 0s; height: inherit; width: inherit;"
                 v-if="visit.v_status">
              <div class="card-header">
                <div class="card-title">
                  <div><span class="my-hos-title">{{ visit.hosname }}</span></div>
                  <div class="my-sub-title1">วันที่รับแอดมิท: {{ visit.admit_date }}</div>
                </div>
                <div class="card-tools">
                  <div>
                    <button type="button" class="btn btn-tool" data-card-widget="card-refresh"
                            data-source="widgets.html"
                            data-source-selector="#card-refresh-content"
                            data-load-on-init="false">
                      <i class="fas fa-sync-alt"></i>
                    </button>
                    <button @click="isVisible = !isVisible" type="button" class="btn btn-tool"
                            data-card-widget="maximize">
                      <i class="fas fa-expand"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                      <i class="fas fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="remove">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div id="column-right" class="card-body" style="display: block;">
                <ul class="nav flex-column mylink">
                  <li class="nav-item" style="border-bottom: none!important">
                    <a class="nav-link">
                      <img class="float-left img-circle pt-picture mr-3"
                           src="../assets/img/pt-profile.jpeg" alt="patient_picture">
                      ชื่อ-สกุล: {{ visit.pname }} {{ visit.fname }} {{ visit.lname }}
                      <br>
                      อายุ: <span class="mr-2">{{ visit.age_y }} </span>
                      ครรถ์ที่: <span
                        class="badge bg-success rounded-pill px-2 mr-2"> {{ visit.gravida }}</span>
                      อายุครรภ์: <span
                        class="badge bg-danger rounded-pill px-2">{{ visit.ga }}</span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      <span>CPD Risk Score</span>
                      <span class="float-right text-orange bigger-text font-weight-bold">{{
                          visit.cpd_risk_score
                        }} <span
                            class="unit">คะแนน</span></span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      ความเข้มเลือด (Hematocrit) <span
                        class="float-right bigger-text text-blue font-weight-bold">
                                                    {{ visit.hematocrit }}
                                                    <span class="unit"> %</span></span>

                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      น้ำหนักก่อนตั้งครรภ์/ขณะคลอด/เพิ่มขึ้น<span
                        class="float-right text-blue bigger-text font-weight-bold">
                                                    {{ visit.weight_before_pregancy }} → {{ visit.weight_at_delivery }} = {{
                        visit.weight_gain
                      }}
                                                    <span class="unit">กก.</span></span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      ความสูงของมดลูก <span
                        class="float-right text-blue bigger-text font-weight-bold">
                                                    {{ visit.fundal_height }} <span class="unit">ซ.ม.</span></span>
                    </a>
                  </li>
                  <transition name="fade" class="mt-3">

                    <li class="nav-item" v-if="isVisible">
                      <div class="nav-link">
                        <div class="row">
                          <!--   box -->
                          <div class="col-lg-3 col-md-3">
                            <div class="card card-primary">
                              <div class="card-body box-profile">
                                <div class="text-center">
                                  <div class="d-flex justify-content-center">
                                    <div class="coin bigger-text">110</div>
                                  </div>
                                </div>

                                <h3 class="profile-username text-center">
                                  <i class="fas fa-stethoscope beat"></i>
                                  FHS</h3>

                                <p class="text-muted text-center">
                                  {{ visit.modify_date }}</p>

                                <ul class="list-group list-group-unbordered mb-3">
                                  <li class="list-group-item">
                                    <b>เวลา 14:25:00</b> <a class="float-right">112</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 14:01:30</b> <a class="float-right">120</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 13:55:15</b> <a class="float-right">115</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 13:45:00</b> <a class="float-right">115</a>
                                  </li>
                                </ul>

                                <a href="#" class="btn btn-primary btn-block"><b>บันทึกเพิ่ม</b></a>
                              </div>
                              <!-- /.card-body -->
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-3">
                            <div class="card card-primary">
                              <div class="card-body box-profile">
                                <div class="text-center">
                                  <div class="d-flex justify-content-center">
                                    <div class="coin bigger-text">120</div>
                                  </div>
                                </div>

                                <h3 class="profile-username text-center">
                                  <i class="fas fa-heartbeat beat"></i>
                                  HR</h3>

                                <p class="text-muted text-center">
                                  {{ visit.modify_date }}</p>

                                <ul class="list-group list-group-unbordered mb-3">
                                  <li class="list-group-item">
                                    <chart-component/>
                                    <!--                                    <chart-component-->
                                    <!--                                        :data="chartData"></chart-component>-->
                                  </li>
                                </ul>

                                <a href="#" class="btn btn-primary btn-block"><b>บันทึกเพิ่ม</b></a>
                              </div>
                              <!-- /.card-body -->
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-3">
                            <div class="card card-primary">
                              <div class="card-body box-profile">
                                <div class="text-center">
                                  <div class="d-flex justify-content-center">
                                    <div class="coin bigger-text"
                                         style="background-color: #f6124e">
                                      110/88
                                    </div>
                                  </div>
                                </div>

                                <h3 class="profile-username text-center">
                                  BPS/BPD</h3>

                                <p class="text-muted text-center">
                                  {{ visit.modify_date }}</p>

                                <ul class="list-group list-group-unbordered mb-3">
                                  <li class="list-group-item">
                                    <b>เวลา 14:25:00</b> <a class="float-right">111/90</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 14:01:30</b> <a class="float-right">100/88</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 13:55:15</b> <a class="float-right">130/95</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 13:45:00</b> <a class="float-right">150/100</a>
                                  </li>
                                </ul>

                                <a href="#" class="btn btn-primary btn-block"><b>บันทึกเพิ่ม</b></a>
                              </div>
                              <!-- /.card-body -->
                            </div>
                          </div>
                          <div class="col-lg-3 col-md-3">
                            <div class="card card-primary">
                              <div class="card-body box-profile">
                                <div class="text-center">
                                  <div class="d-flex justify-content-center">
                                    <div class="coin bigger-text">260</div>
                                  </div>
                                </div>

                                <h3 class="profile-username text-center">PPH</h3>

                                <p class="text-muted text-center">
                                  {{ visit.modify_date }}</p>

                                <ul class="list-group list-group-unbordered mb-3">
                                  <li class="list-group-item">
                                    <b>เวลา 14:25:00</b> <a class="float-right">255</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 14:01:30</b> <a class="float-right">220</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 13:55:15</b> <a class="float-right">160</a>
                                  </li>
                                  <li class="list-group-item">
                                    <b>เวลา 13:45:00</b> <a class="float-right">150</a>
                                  </li>
                                </ul>

                                <a href="#" class="btn btn-primary btn-block"><b>บันทึกเพิ่ม</b></a>
                              </div>
                              <!-- /.card-body -->
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

        <div id="column-left" class="col-lg-6 col-md-6">
          <h3>หลังคลอด</h3>
          <!--                        card start here -->
          <div class="in-progress" v-for="(visit,index) in visits" :key="index">
            <div class="card card-danger card-outline"
                 style="transition: all 0.15s ease 0s; height: inherit; width: inherit;"
                 v-if="!visit.v_status">

              <div class="card-header">
                <div class="card-title">
                  <div><span class="my-hos-title">{{ visit.hosname }}</span></div>
                  <div class="my-sub-title1">วันที่รับแอดมิท: {{ visit.admit_date }}</div>
                </div>
                <div class="card-tools">
                  <div>
                    <button type="button" class="btn btn-tool" data-card-widget="card-refresh"
                            data-source="widgets.html"
                            data-source-selector="#card-refresh-content"
                            data-load-on-init="false">
                      <i class="fas fa-sync-alt"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="maximize">
                      <i class="fas fa-expand"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="collapse">
                      <i class="fas fa-minus"></i>
                    </button>
                    <button type="button" class="btn btn-tool" data-card-widget="remove">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div id="column-right" class="card-body" style="display: block;">
                <ul class="nav flex-column mylink">
                  <li class="nav-item" style="border-bottom: none!important">
                    <a class="nav-link">
                      <img class="float-left img-circle pt-picture mr-3"
                           src="../assets/img/pt-profile.jpeg" alt="patient_picture">
                      ชื่อ-สกุล: {{ visit.pname }} {{ visit.fname }} {{ visit.lname }}
                      <br>
                      อายุ: <span class="mr-2">{{ visit.age_y }} </span>
                      ครรถ์ที่: <span
                        class="badge bg-success rounded-pill px-2 mr-2"> {{ visit.gravida }}</span>
                      อายุครรภ์: <span
                        class="badge bg-danger rounded-pill px-2">{{ visit.ga }}</span>

                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      <span>CPD Risk Score</span>
                      <span class="float-right text-orange bigger-text font-weight-bold">
                        {{ visit.cpd_risk_score }}
                      <span class="unit">คะแนน</span>
                      </span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      น้ำหนักลูก <span
                        class="float-right bigger-text text-blue font-weight-bold">{{ visit.ultrasound }}<span
                        class="unit"> กรัม</span></span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      น้ำหนักเด็ก (U/S) <span
                        class="float-right text-blue bigger-text font-weight-bold">{{ visit.ultrasound }} <span
                        class="unit">กรัม</span></span>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link">
                      ความสูงของมดลูก <span
                        class="float-right text-blue bigger-text font-weight-bold">{{ visit.fundal_height }} <span
                        class="unit">ซ.ม.</span></span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import ChartComponent from "../components/ChartComponent.vue";


export default {
  components: {
    ChartComponent
  },
  data() {
    return {
      visits: [],
      isVisible: false,
      hoscode: ''
    }
  },
  created() {
    // this.getVisit();
  },
  mounted() {
    // auto refresh every minute
    // setInterval(() => {
    //   this.getVisit();
    // }, 60 * 1000)
  },
  // methods: {
  //   getVisit() {
  //     this.hoscode = this.$route.params.hoscode
  //     axios.get('http://localhost:3003/hospitaldetail/' + this.hoscode)
  //         .then(response => {
  //           console.log('http://localhost:3003/hospitaldetail/' + this.hoscode)
  //           // console.log(response.data)
  //           this.visits = response.data;
  //
  //         })
  //   }
  // },

}

</script>

<style>


</style>