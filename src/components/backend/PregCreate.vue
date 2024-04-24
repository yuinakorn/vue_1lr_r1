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
                  เพิ่มข้อมูลหญิงตั้งครรภ์
                </h4>
              </div>
            </div>
            <br />

            <form @submit.prevent="search">
              <div class="row">
                <div class="form-group mx-2">
                  <router-link to="/backend/preg_list">
                    <button class="btn btn-success">
                      <i class="fas fa-home"></i> กลับหน้าหลัก
                    </button>
                  </router-link>
                </div>
                <div class="form-group">
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">HN</div>
                    </div>
                    <input type="text" class="form-control" v-model="hnsearch" name="hnsearch" id="hnsearch"
                      placeholder="เลขประจำตัวผู้ป่วย HN" :class="changclassbyval(isButtonSearchEnable)"
                      :title="showtextbyval(isButtonSearchEnable)" @input="validatecid(hnsearch)" autocomplete="off"
                      @keyup="cal_score" :disabled="!editdisable" />
                  </div>
                </div>

                <div class="form-group mx-2">
                  <div v-if="editdisable">
                    <button type="submit" class="btn btn-warning" :title="showtextbyval(isButtonSearchEnable)"
                      :disabled="isButtonSearchEnable">
                      Search
                    </button>
                  </div>
                  <div v-else>
                    <button type="button" class="btn btn-danger" title="reset ข้อมูล เพื่อเริ่มการค้นหาใหม่"
                      @click="resetDataSearch()">
                      reset ข้อมูล
                    </button>
                  </div>
                </div>

                <div class="form-group mx-2">
                  <button type="button" class="btn btn-primary btn-block mx-auto w-100 float-right" name="submit"
                    @click="submitForm" :title="showtext(chkdatainput(), 'กรุณากรอกข้อมูลให้ครบถ้วน', '')
              " :disabled="chkdatainput()">
                    <i class="fas fa-save"></i>
                    บันทึกข้อมูล
                  </button>
                </div>
                <div class="form-group mx-2" v-if="checkrefer()">
                  <button class="animated-button1 btn text-light" type="button" @click="
              msgshowsuccess(
                'คำแนะนำ \nควรประสานส่งต่อทันที!!',
                'warning',
                true
              )
              ">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <div class="heartbeat-animation">
                      <svg class="svg-inline--fa fa-trash fa-w-18" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 512">
                        <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
                        <path fill="currentColor"
                          d="M0 48C0 21.5 21.5 0 48 0H368c26.5 0 48 21.5 48 48V96h50.7c17 0 33.3 6.7 45.3 18.7L589.3 192c12 12 18.7 28.3 18.7 45.3V256v32 64c17.7 0 32 14.3 32 32s-14.3 32-32 32H576c0 53-43 96-96 96s-96-43-96-96H256c0 53-43 96-96 96s-96-43-96-96H48c-26.5 0-48-21.5-48-48V48zM416 256H544V237.3L466.7 160H416v96zM160 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm368-48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM176 80v48l-48 0c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h48v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V192h48c8.8 0 16-7.2 16-16V144c0-8.8-7.2-16-16-16H240V80c0-8.8-7.2-16-16-16H192c-8.8 0-16 7.2-16 16z" />
                      </svg>
                    </div>

                    คำแนะนำ : ควรประสานส่งต่อทันที
                  </button>
                </div>
              </div>
            </form>
            <hr />
            <div class="row">
              <form @submit.prevent="submitForm">
                <div class="row">
                  <div class="form-group col">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">Admit Date</div>
                      </div>
                      <div class="input-group-append">
                        <VueDatePicker v-model="date_select" format="yyyy-MM-dd HH:mm" ref="datePicker"
                          :class="changclassbyval(chkempty(date_select))" :title="showtext(
              chkempty(date_select),
              'กรุณาระบุวันที่และเวลา',
              ''
            )
              " autocomplete="off" :disabled="editdisable"></VueDatePicker>
                        <!-- <VueDatePicker
                          v-model="date_select"
                          format="yyyy-MM-dd HH:mm"
                          ref="datePicker"
                          :class="changclassbyval(chkempty(date_select))"
                          :title="
                            showtext(
                              chkempty(date_select),
                              'กรุณาระบุวันที่และเวลา',
                              ''
                            )
                          "
                          autocomplete="off"
                        ></VueDatePicker> -->
                      </div>
                    </div>
                  </div>
                  <div class="position-absolute p-3" style="top: 0px; right: 0px">
                    <img v-if="image" :src="image" alt="Image" style="width: 148px; height: 178px" />
                  </div>
                </div>
                <div class="row">
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">คำนำหน้าชื่อ</div>
                      </div>
                      <input type="text" class="form-control" v-model="title" :class="changclassbyval(chkempty(title))"
                        :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(title), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score()" />
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">ชื่อ</div>
                      </div>
                      <input type="text" class="form-control" name="pname" id="pname" v-model="pname"
                        :class="changclassbyval(chkempty(pname))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(pname), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score()" />
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">สกุล</div>
                      </div>
                      <input type="text" class="form-control" name="lname" id="lname" v-model="lname"
                        :class="changclassbyval(chkempty(lname))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(lname), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score()" />
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">CID</div>
                      </div>
                      <input type="text" class="form-control show-invalid" name="cid" id="cid" v-model="cid"
                        :class="changclassbyval(chkempty(cid))" :disabled="true" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(hn), 'กรุณากรอกข้อมูล', '')" @input="validatecid(cid)" autocomplete="off"
                        @keyup="cal_score" />
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">HN</div>
                      </div>
                      <input type="text" class="form-control" name="hn" id="hn" v-model="hn"
                        :class="changclassbyval(chkempty(hn))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(hn), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score" />
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">AN</div>
                      </div>
                      <input type="text" class="form-control" name="an" id="an" v-model="an"
                        :class="changclassbyval(chkempty(an))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(an), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score" />
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">อายุ</div>
                      </div>
                      <input type="text" class="form-control" name="age_y" id="age_y" v-model="age_y"
                        @input="risk_age_y" :class="changclassbyval(chkempty(age_y))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(age_y), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="">ปี</div>
                      </div>
                    </div>
                  </div>
                  <!-- </div>

                <div class="row"> -->
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">
                          จํานวนการตั้งครรภ์
                        </div>
                      </div>
                      <input type="text" class="form-control" name="gravida" id="gravida" v-model="gravida"
                        :class="changclassbyval(chkempty(gravida))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(gravida), 'กรุณากรอกข้อมูล', '')
              " @input="gravida = this.chknumber(gravida, 2)" autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="">ครั้ง</div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">
                          จำนวนการคลอดบุตร
                        </div>
                      </div>
                      <input type="text" class="form-control" name="parity" id="parity" v-model="parity"
                        @input="risk_parity" :class="changclassbyval(chkempty(parity))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(parity), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="">ครั้ง</div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">อายุครรภ์</div>
                      </div>
                      <input type="text" class="form-control" name="ga" id="ga" v-model="ga"
                        :class="changclassbyval(chkempty(ga))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(ga), 'กรุณากรอกข้อมูล', '')
              " @input="ga = this.chknumber(ga, 2, true)" autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="">
                          สัปดาห์
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">การฝากครรภ์</div>
                      </div>
                      <select class="form-select form-control" name="anc_check_up" id="anc_check_up"
                        v-model="anc_check_up" :class="changclassbyval(chkempty(anc_check_up))" :disabled="editdisable"
                        :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(anc_check_up),
                'กรุณาระบุข้อมูลการฝากครรภ์',
                ''
              )
              " @keyup="cal_score()">
                        <option value="1">ฝาก</option>
                        <option value="0">ไม่ฝาก</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">ฝากครรภ์</div>
                      </div>
                      <input type="text" class="form-control" name="no_of_anc" id="no_of_anc" v-model="no_of_anc"
                        :class="changclassbyval(chkempty(no_of_anc))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(no_of_anc),
                'กรุณากรอกข้อมูล',
                ''
              )
              " @input="no_of_anc = this.chknumber(no_of_anc, 2)" autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="จำนวนครั้งที่มาฝากครรภ์">
                          ครั้ง
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">
                          น้ําหนักก่อนตั้งครรภ์
                        </div>
                      </div>
                      <input type="text" class="form-control" name="weight_before_pregancy" id="weight_before_pregancy"
                        v-model="weight_before_pregancy" @input="risk_weight_before_pregancy" :class="changclassbyval(chkempty(weight_before_pregancy))
              " :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(weight_before_pregancy),
                'กรุณากรอกข้อมูล',
                ''
              )
              " autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="กิโลกรัม (kg.)">
                          กก.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">
                          น้ําหนักวันมาคลอด
                        </div>
                      </div>
                      <input type="text" class="form-control" name="weight_at_delivery" id="weight_at_delivery"
                        v-model="weight_at_delivery" @input="risk_weight_at_delivery"
                        :class="changclassbyval(chkempty(weight_at_delivery))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(weight_at_delivery),
                'กรุณากรอกข้อมูล',
                ''
              )
              " autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="กิโลกรัม (kg.)">
                          กก.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">
                          น้ําหนักที่เพิ่มขึ้น
                        </div>
                      </div>
                      <input type="text" class="form-control" name="weight_gain" id="weight_gain" v-model="weight_gain"
                        readonly />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="กิโลกรัม (kg.)">
                          กก.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">ส่วนสูง</div>
                      </div>
                      <input type="text" class="form-control" name="height" id="height" v-model="height"
                        @input="risk_height" :class="changclassbyval(chkempty(height))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(chkempty(height), 'กรุณากรอกข้อมูล', '')
              " autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="เซ็นติเมตร (cm.)">
                          ซม.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">ยอดมดลูกสูง</div>
                      </div>
                      <input type="text" class="form-control" name="fundal_height" id="fundal_height"
                        v-model="fundal_height" @input="risk_fundal_height"
                        :class="changclassbyval(chkempty(fundal_height))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(fundal_height),
                'กรุณากรอกข้อมูล',
                ''
              )
              " autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2" title="เซ็นติเมตร (cm.)">
                          ซม.
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-sm-6 col-md-4">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">Hematocrit</div>
                      </div>
                      <input type="text" class="form-control" name="hematocrit" id="hematocrit" v-model="hematocrit"
                        :class="changclassbyval(chkempty(hematocrit))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(hematocrit),
                'กรุณากรอกข้อมูล',
                ''
              )
              " v-on:input="chkfloat" autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2">%</div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group col-md-8 col-xl-6">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text px-2">
                          ประมาณการน้ําหนักเด็กด้วย ultrasound
                        </div>
                      </div>
                      <input type="text" class="form-control" name="ultrasound" id="ultrasound" v-model="ultrasound"
                        :class="changclassbyval(chkempty(ultrasound))" :disabled="editdisable" :title="editdisable
              ? 'ไม่สามารถกรอกข้อมูลได้ เพราะไม่พบข้อมูลผู้ป่วยในระบบ กรุณาค้นหาผู้ป่วยก่อนกรอกข้อมูล'
              : showtext(
                chkempty(ultrasound),
                'กรุณากรอกข้อมูล',
                ''
              )
              " @input="ultrasound = this.chknumber(ultrasound, 4)" autocomplete="off" @keyup="cal_score()" />
                      <div class="input-group-append">
                        <div class="input-group-text px-2">กรัม</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <table class="table col-sm-8 table-striped">
                    <thead class="bg-info">
                      <tr>
                        <th scope="col">ลักษณะเสี่ยง</th>
                        <th scope="col">เคสนี้</th>
                        <th scope="col">การประเมิน</th>
                        <th scope="col">คะแนน</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">อายุมารดา</th>
                        <td>{{ this.age_y }}</td>
                        <td>
                          <div v-if="age_y < 25">ต่ำกว่า 25</div>
                          <div v-else-if="age_y >= 25 && age_y <= 33">
                            25-33
                          </div>
                          <div v-else>สูงกว่า 33</div>
                        </td>
                        <td>
                          <div v-if="age_y < 25">0</div>
                          <div v-else-if="age_y >= 25 && age_y <= 33">1.5</div>
                          <div v-else>3</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">ส่วนสูงมารดา(cm.)</th>
                        <td>{{ this.height }}</td>
                        <td>
                          <div v-if="height < 151">ต่ำกว่า 151</div>
                          <div v-else-if="height >= 151 && height <= 159">
                            151-159
                          </div>
                          <div v-else>สูงกว่า 159</div>
                        </td>
                        <td>
                          <div v-if="height < 151">3</div>
                          <div v-else-if="height >= 151 && height <= 159">
                            1.5
                          </div>
                          <div v-else>0</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">จำนวนการคลอดบุตร</th>
                        <td>{{ this.parity }}</td>
                        <td>
                          <div v-if="parity == 0">Nulliparous</div>
                          <div v-else>Multiparous</div>
                        </td>
                        <td>
                          <div v-if="parity == 0">2.5</div>
                          <div v-else>0</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">
                          น้ำหนักเพิ่มขึ้นระหว่างตั้งครรภ์(kg.)
                        </th>
                        <td>{{ this.weight_gain }}</td>
                        <td>
                          <div v-if="weight_gain < 11.14">ต่ำกว่า 11.14</div>
                          <div v-else-if="weight_gain >= 11.14 && weight_gain <= 22.14
              ">
                            11.14-22.14
                          </div>
                          <div v-else>สูงกว่า 22.14</div>
                        </td>
                        <td>
                          <div v-if="weight_gain < 11.14">0</div>
                          <div v-else-if="weight_gain >= 11.14 && weight_gain <= 22.14
              ">
                            1.5
                          </div>
                          <div v-else>2.5</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">ขนาดยอดมดลูก(cm.)</th>
                        <td>{{ this.fundal_height }}</td>
                        <td>
                          <div v-if="fundal_height < 34">ต่ำกว่า 34</div>
                          <div v-else-if="fundal_height == 34">34</div>
                          <div v-else>สูงกว่า 34</div>
                        </td>
                        <td>
                          <div v-if="fundal_height < 34">0</div>
                          <div v-else-if="fundal_height == 34">1</div>
                          <div v-else>3.5</div>
                        </td>
                      </tr>
                      <tr style="color: blue; font-size: 1.5rem">
                        <th>
                          <span class="text-dark">ผลรวมคะแนนความเสี่ยง</span>
                          <span class="text-danger">(CPD Risk Score)</span>
                        </th>
                        <td></td>
                        <td></td>
                        <th>
                          <span v-if="!chkdatainput()" class="text-danger fw-bold">{{ this.total_score }}</span>
                        </th>
                      </tr>
                    </tbody>
                  </table>
                  <div v-if="chkdatainput()" class="col-sm-4 total_start">
                    <button type="button" class="btn btn-block w-100 h-90">
                      <font size="5rem">
                        <div class="fw-bold text-light text-center">
                          กรุณากรอกข้อมูลให้ครบถ้วนเพื่อคำนวณคะแนนความเสี่ยง
                        </div>
                      </font>
                    </button>
                  </div>
                  <div v-if="!chkdatainput()" class="col-sm-4" :class="total_color">
                    <button type="button" class="btn btn-block w-100 h-90">
                      <font size="4">
                        <div v-html="this.result_score"></div>
                        <br />{{ this.evaluate }}
                      </font>
                    </button>
                  </div>
                </div>

                <!-- <div class="row mt-3" :class="total_color">
                  <div class="col-md-3 p-2">
                    <button
                      type="button"
                      class="btn btn-block mx-auto w-100 h-100"
                    >
                      <font size="5">
                        <div v-html="this.result_score"></div>
                      </font>
                    </button>
                  </div>
                  <div class="col-md-9 p-3">
                    <font size=" 4">
                      {{ this.evaluate }}
                    </font>
                  </div>
                </div> -->
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
import Swal from "sweetalert2";
import moment from "moment";
// import "moment/locale/th";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
// import qs from "qs";

export default {
  components: { VueDatePicker },
  name: "PregCreate",
  data() {
    return {
      hcode: "",
      cid: "",
      title: "",
      pname: "",
      lname: "",
      hn: "",
      an: "",
      age_y: "",
      gravida: "",
      parity: "",
      ga: "",
      anc_check_up: "",
      no_of_anc: "",
      weight_before_pregancy: "",
      weight_at_delivery: "",
      weight_gain: "",
      height: "",
      fundal_height: "",
      hematocrit: "",
      ultrasound: "",
      cpd_risk_score: "",
      status: "",
      refer_status: "",
      token: "",
      total_score: "",
      result_score: "",
      username: "",
      current_date: new Date(),
      date_select: new Date(),
      admit_date: "",
      modify_date: "",
      user_create: "",
      user_last_modify: "",
      image: "",
      isButtonSearchEnable: true,
      total_color: "total_start",
      evaluate: "กรุณากรอกข้อมูลให้ครบถ้วนเพื่อคำนวณคะแนนความเสี่ยง",
      wait_response: "",
      check_hemotocrit: false,
      check_ultrasound: false,
      check_cpd_risk_score: false,
      editdisable: true,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    this.token = token;
    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      this.hcode = decoded.hosCode;
      this.username = decoded.username;
      // eslint-disable-next-line
    } catch (error) { }
  },
  methods: {
    async search() {
      if (!this.isButtonSearchEnable) {
        this.wait_response = true;
        var loadingAlert = Swal.fire({
          title: "กำลังทำการค้นหาข้อมูล",
          html: "กรุณารอสักครู่",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        this.resetData();
        let data = JSON.stringify({
          token: this.token,
          cid: this.hnsearch,
          hcode: this.hcode,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: process.env.VUE_APP_API_URL + "/pregs/his/search/",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            this.editdisable = true;
            if (response.data[0]) {
              if (response.data[0].length === 0) {
                this.editdisable = true;
                this.msgshowsuccess(
                  "ไม่พบข้อมูล \nไม่สามารถกรอกข้อมูลได้ \nกรุณาค้นหาอีกครั้ง",
                  "error"
                );
              } else {
                this.editdisable = false;
                this.data = response.data[0];
                this.title = response.data[0].title;
                this.pname = response.data[0].pname;
                this.lname = response.data[0].lname;
                this.cid = response.data[0].cid;
                this.hn = response.data[0].hn;
                this.an = response.data[0].an;
                this.admit_date = response.data[0].admit_date;
                if (this.admit_date != "") {
                  this.date_select = moment
                    .utc(this.admit_date)
                    .format("YYYY-MM-DD HH:mm:ss");
                }
                this.age_y = response.data[0].age_y;
                this.gravida = response.data[0].gravida;
                this.parity = response.data[0].parity;
                this.ga = response.data[0].ga;
                this.anc_check_up = response.data[0].anc_check_up;
                this.no_of_anc = response.data[0].no_of_anc;
                this.weight_before_pregancy =
                  response.data[0].weight_before_pregancy;
                this.weight_at_delivery = response.data[0].weight_at_delivery;
                this.weight_gain = response.data[0].weight_gain;
                this.height = response.data[0].height;
                this.fundal_height = response.data[0].fundal_height;

                this.hematocrit = response.data[0].hematocrit;
                this.ultrasound = response.data[0].ultrasound;
                this.image = response.data[0].image;
                this.status = response.data[0].status;
                this.refer_status = response.data[0].refer_status;
                this.cal_score();
                this.msgshowsuccess(
                  "พบข้อมูล \nกรุณาตรวจสอบข้อมูล\nก่อนทำการบันทึก",
                  "success"
                );
              }
            } else {
              this.editdisable = true;
              this.msgshowsuccess(
                "ไม่พบข้อมูล \nไม่สามารถกรอกข้อมูลได้ \nกรุณาค้นหาอีกครั้ง",
                "error"
              );
            }
            loadingAlert.close();
          })
          .catch((error) => {
            this.msgshowsuccess(
              "เกิดความผิดพลาดในการค้นหา ( " + error + " )",
              "error"
            );
          });
        this.wait_response = false;
      }
    },

    async submitForm() {
      const axios = require("axios");
      var loadingSave = Swal.fire({
        title: "กำลังทำการบันทึกข้อมูล",
        html: "กรุณารอสักครู่",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      var time_select = moment(this.date_select).format("YYYY-MM-DD HH:mm:ss");
      var time_create = moment(this.current_date).format("YYYY-MM-DD HH:mm:ss");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.hcode,
        cid: this.cid,
        title: this.title,
        pname: this.pname,
        lname: this.lname,
        hn: this.hn,
        an: this.an,
        age_y: this.age_y,
        gravida: this.gravida,
        parity: this.parity,
        ga: this.ga,
        anc_check_up: this.anc_check_up,
        no_of_anc: this.no_of_anc,
        weight_before_pregancy: this.weight_before_pregancy,
        weight_at_delivery: this.weight_at_delivery,
        weight_gain: this.weight_gain,
        height: this.height,
        fundal_height: this.fundal_height,
        hematocrit: this.hematocrit,
        ultrasound: this.ultrasound,
        cpd_risk_score: this.total_score,
        status: this.status,
        refer_status: "0", //สถานะ refer เริ่มที่ 0
        refer_out_status: "0", //สถานะ refer เริ่มที่ 0
        admit_date: time_select, //เวลาที่เลือก
        create_date: time_create, //เวลาปัจจุบันที่เข้ามากรอกข้อมูล
        modify_date: time_create, //เวลาปัจจุบันที่เข้ามากรอกข้อมูล
        user_create: this.username,
        user_last_modify: this.username,
        image: this.image,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: process.env.VUE_APP_API_URL + "/pregs/create/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      // console.log(data);

      try {
        axios(config)
          .then((response) => {
            loadingSave.close();
            if (response.data.message == "ok") {
              this.msgshowsuccess("บันทึกข้อมูลสำเร็จ", "success");
              this.goToAbout_nohistory("/backend/preg_list");
            } else {
              this.msgshowsuccess("บันทึกข้อมูลไม่สำเร็จ", "error");
            }
          })
          .catch((error) => {
            // YuiNakorn Handle error
            // Default error message
            let errorMessage = "API Error or Duplicate data.";

            if (error.response) {
              console.error('Error response:', error.response);
              let res = error.response.data;
              errorMessage = res.detail || errorMessage;
            } else if (error.message) {
              // Network error occurred
              console.error('Network error:', error.message);
              errorMessage = error.message;
            } else {
              // Other types of errors
              console.error('Unknown error:', error);
            }

            this.msgshowsuccess(
              "เกิดความผิดพลาดในการบันทึกข้อมูล ( " + errorMessage + " )",
              "error"
            );
          });
      }
      catch (error) {
        console.log(error);
      }

    },

    risk_age_y(event) {
      this.age_y = this.chknumber(event.target.value, 3, true);
    },

    risk_height(event) {
      this.height = this.chknumber(event.target.value, 5, true, true);
    },

    risk_parity(event) {
      this.parity = this.chknumber(event.target.value, 2);
    },

    risk_weight_before_pregancy(event) {
      this.weight_before_pregancy = this.chknumber(
        event.target.value,
        5,
        true,
        true
      );
    },

    risk_weight_at_delivery(event) {
      this.weight_at_delivery = this.chknumber(
        event.target.value,
        5,
        true,
        true
      );
    },

    risk_weight_gain(event) {
      this.weight_gain = event.target.value;
    },
    risk_fundal_height(event) {
      this.fundal_height = this.chknumber(event.target.value, 4, true, true);
    },

    cal_score() {
      this.total_color = "total_start";
      this.evaluate = "กรุณากรอกข้อมูลให้ครบถ้วนเพื่อคำนวณคะแนนความเสี่ยง";
      this.total_score = 0;
      if (this.weight_before_pregancy != "" && this.weight_at_delivery != "") {
        this.weight_gain =
          this.weight_at_delivery - this.weight_before_pregancy;
        this.weight_gain = parseFloat(this.weight_gain).toFixed(2);
      }
      if (this.chkdatainput()) {
        return;
      }
      if (this.age_y < 25) {
        this.score_age_y = 0;
      } else if (this.age_y >= 25 && this.age_y <= 33) {
        this.score_age_y = 1.5;
      } else {
        this.score_age_y = 3;
      }
      this.total_score = this.score_age_y;
      if (this.height < 151) {
        this.score_height = 3;
      } else if (this.height >= 151 && this.height <= 159) {
        this.score_height = 2;
      } else {
        this.score_height = 0;
      }
      this.total_score += this.score_height;
      if (this.parity == 0) {
        this.score_parity = 2.5;
      } else {
        this.score_parity = 0;
      }
      this.total_score += this.score_parity;
      if (this.weight_gain < 11.14) {
        this.score_weight_gain = 0;
      } else if (this.weight_gain >= 11.14 && this.weight_gain <= 22.14) {
        this.score_weight_gain = 1.5;
      } else {
        this.score_weight_gain = 2.5;
      }
      this.total_score += this.score_weight_gain;
      if (this.fundal_height < 34) {
        this.score_fundal_height = 0;
      } else if (this.fundal_height == 34) {
        this.score_fundal_height = 1;
      } else {
        this.score_fundal_height = 3.5;
      }
      this.total_score += this.score_fundal_height;
      if (this.total_score < 5) {
        this.total_color = "total_green";
        this.result_score = "ความเสี่ยงน้อย <br> คะแนน < 5";
        this.evaluate =
          "ให้ความมั่นใจแก่มารดา สามารถคลอดทางช่อง คลอดได้ ดูแลความก้าวหน้าของการเจ็บครรภ์จาก กราฟดูแลการคลอด";
      } else if (this.total_score >= 5 && this.total_score <= 9.5) {
        this.total_color = "total_yellow";
        this.result_score = "ความเสี่ยงปานกลาง <br>คะแนน 5-9.5";
        this.evaluate =
          "ดูแล ความก้าวหน้าของการเจ็บครรภ์จากกราฟดูแลการ คลอด หากไม่มีความ ก้าวหน้าจากกราฟดูแลการ คลอดและมีข้อบ่งชี้ผ่าตัดคลอดจากเกณฑ์ของราช วิทยาลัยสูติฯ ให้พิจารณาผ่าตัดคลอด";
      } else {
        this.total_color = "total_red";
        this.result_score = "ความเสี่ยงสูง <br> คะแนน >= 10";
        this.evaluate =
          "ความเสี่ยงสูงที่จะได้รับการผ่าตัดคลอดให้งดอาหาร และน้ํา ประเมินความก้าวหน้าของการคลอด เตรียมความพร้อมของห้องผ่าตัด";
      }
    },
    changclassbyval(valchk) {
      // ตรวจสอบเงื่อนไขและคืนค่าคลาสที่ต้องการ
      if (valchk === true) {
        return "show-invalid";
      } else {
        return "show-valid";
      }
    },
    showtextbyval(valchk) {
      if (this.cid !== null && valchk !== null) {
        if (this.cid.trim() != "") {
          if (valchk) {
            return (
              "กดเพื่อค้นหา"
            );
          } else {
            return "กดเพื่อค้นหา";
          }
        } else {
          return "กดเพื่อค้นหา";
        }
      }
    },
    showtext(valchk, txttrue, txtfalse) {
      if (valchk) {
        return txttrue;
      } else {
        return txtfalse;
      }
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
    chkfloat(event) {
      //ตรวจสอบตัวเลขทศนิยม
      var valchk = event.target.value;
      var maxval = 100;
      if (event.data == null && event.inputType != "insertText") {
        //ถ้าไม่ใช่การใส่ตัวอักษรให้ออกจากการตรวจสอบ
        return;
      }
      if (valchk.length <= 1) {
        valchk = valchk.replace(/[^0-9]/g, "");
      }
      valchk = valchk.replace(/\.{2}/g, ".");
      valchk = valchk.replace(/[^0-9.]/g, "");
      // if (valchk.length >= 3) {
      if (valchk > maxval) {
        valchk = maxval;
      }
      // }
      if (isNaN(valchk)) {
        valchk = 0;
      }
      if (valchk.length >= 3) {
        valchk = parseFloat(valchk).toFixed(2);
      }
      this.hematocrit = valchk;
    },
    chknumber(
      valchk,
      numberlength = 6,
      checkzerofirst = false,
      typefloat = false
    ) {
      if (checkzerofirst) {
        //ตรวจสอบค่า 0 ตัวแรก
        if (valchk.charAt(0) == "0") {
          valchk = valchk.replace(/^0/, "");
        }
      }
      if (valchk.length > numberlength) {
        var string = valchk;
        var length = numberlength;
        var trimmedString = string.substring(0, length);
        valchk = trimmedString;
      }
      if (typefloat) {
        //ตรวจสอบตัวเลขทศนิยม
        return valchk.replace(/[^0-9.]/g, "");
      } else {
        return valchk.replace(/\D/g, "");
      }
    },
    validatecid() {
      // ตรวจสอบเงื่อนไขและคืนค่าคลาสที่ต้องการ
      // กำหนดรูปแบบของตัวเลขที่ยอมรับ (ในที่นี้เป็นตัวเลขเท่านั้น)
      if (this.hnsearch === null) {
        return;
      }
      const numericRegex = /^[0-9]*$/;

      // ตรวจสอบว่าค่าที่รับเข้ามาตรงกับรูปแบบหรือไม่
      if (!numericRegex.test(this.hnsearch)) {
        // ถ้าไม่ตรงกับรูปแบบ กำหนดค่าให้ว่าง
        this.hnsearch = this.hnsearch.replace(/\D/g, "");
      }
      if (this.hnsearch == "") {
        this.isButtonSearchEnable = true;
      } else {
        this.isButtonSearchEnable = false;
      }
      // if (this.hnsearch.length > 13) {
      //   var string = this.hnsearch;
      //   var length = 13;
      //   var trimmedString = string.substring(0, length);
      //   this.hnsearch = trimmedString;
      // }
      if (this.hnsearch.trim() != "") {
        this.hnsearch = this.hnsearch.replace(/-/g, "");
        this.isButtonSearchEnable = false;
      } else {
        // alert('เลขบัตรไม่ถูกต้อง')
        this.isButtonSearchEnable = true;
      }
    },
    Script_checkID(id) {
      if (id.substring(0, 1) == 0) return false;
      if (id.length != 13) return false;
      for (var i = 0, sum = 0; i < 12; i++)
        sum += parseFloat(id.charAt(i)) * (13 - i);
      if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false;
      return true;
    },
    msgshowsuccess(txtshow, statusshow, html = false) {
      if (html) {
        var show_caution_hema =
          "- ความเข้มข้นของเลือดก่อนคลอด(Hematocrit) น้อยกว่าหรือเท่ากับ 30%";
        var show_caution_ultra =
          "- ประเมินน้ำหนักเด็กมากกว่าหรือเท่ากับ 3500 กรัม";
        var show_caution_cpd =
          "- การประเมินคะแนนความเสี่ยง(CPD Risk Score) มากกว่าหรือเท่ากับ 10 คะแนน";
        var span_danger = "<span class='text-danger'><b>";
        var span_danger_close = "</b></span>";
        if (this.check_hemotocrit) {
          show_caution_hema =
            span_danger + show_caution_hema + span_danger_close;
        }
        if (this.check_ultrasound) {
          show_caution_ultra =
            span_danger + show_caution_ultra + span_danger_close;
        }
        if (this.check_cpd_risk_score) {
          show_caution_cpd = span_danger + show_caution_cpd + span_danger_close;
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
            "</div>",
          showConfirmButton: true,
          //timer: 1500,
        });
      } else {
        Swal.fire({
          position: "center",
          icon: statusshow,
          title: txtshow,
          showConfirmButton: true,
          //timer: 1500,
        });
      }
    },
    resetData() {
      this.wait_response = true;
      this.pname = "";
      this.lname = "";
      this.hn = "";
      this.an = "";
      this.age_y = "";
      this.gravida = "";
      this.parity = "";
      this.ga = "";
      this.anc_check_up = "";
      this.no_of_anc = "";
      this.weight_before_pregancy = "";
      this.weight_at_delivery = "";
      this.weight_gain = "";
      this.height = "";
      this.fundal_height = "";
      this.hematocrit = "";
      this.ultrasound = "";
      this.cpd_risk_score = "";
      this.status = "";
      this.total_score = "";
      this.result_score = "";
      this.current_date = new Date();
      this.total_color = "total_start";
      this.evaluate = "กรุณากรอกข้อมูลให้ครบถ้วนเพื่อคำนวณคะแนนความเสี่ยง";
    },
    chkdatainput() {
      if (
        this.chkempty(this.cid) ||
        this.chkempty(this.pname) ||
        this.chkempty(this.lname) ||
        this.chkempty(this.hn) ||
        this.chkempty(this.an) ||
        this.chkempty(this.age_y) ||
        this.chkempty(this.gravida) ||
        this.chkempty(this.parity) ||
        this.chkempty(this.ga) ||
        this.chkempty(this.anc_check_up) ||
        this.chkempty(this.no_of_anc) ||
        this.chkempty(this.weight_before_pregancy) ||
        this.chkempty(this.weight_at_delivery) ||
        this.chkempty(this.weight_gain) ||
        this.chkempty(this.height) ||
        this.chkempty(this.fundal_height) ||
        this.chkempty(this.hematocrit) ||
        this.chkempty(this.ultrasound) ||
        this.chkempty(this.date_select) ||
        this.isButtonSearchEnable
      ) {
        return true;
      } else {
        return false;
      }
    },
    showloading() {
      this.loadingAlert = Swal.fire({
        title: "กำลังทำการค้นหาข้อมูล",
        html: "กรุณารอสักครู่",
        didOpen: () => {
          this.loadingAlert.showLoading();
        },
      });
    },
    checkrefer() {
      if (this.hematocrit <= 30 && !this.chkempty(this.hematocrit)) {
        this.check_hemotocrit = true;
      } else {
        this.check_hemotocrit = false;
      }
      if (this.ultrasound >= 3500 && !this.chkempty(this.ultrasound)) {
        this.check_ultrasound = true;
      } else {
        this.check_ultrasound = false;
      }
      if (this.total_score >= 10 && !this.chkempty(this.total_score)) {
        this.check_cpd_risk_score = true;
      } else {
        this.check_cpd_risk_score = false;
      }

      if (
        this.check_hemotocrit ||
        this.check_ultrasound ||
        this.check_cpd_risk_score
      ) {
        return true;
      } else {
        return false;
      }
    },
    goToAbout_nohistory(urllink) {
      this.$router.replace(urllink); // เปลี่ยนเส้นทางไปยัง urllink โดยไม่เก็บประวัติ
    },
    resetDataSearch() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false,
      });

      swalWithBootstrapButtons
        .fire({
          title: "ยืนยันการ reset ข้อมูล?",
          text: "คุณกำลังจะ reset ข้อมูล เพื่อเริ่มการค้นหาใหม่ กรุณายืนยัน เพื่อทำการเริ่มค้นหาผู้ป่วยรายใหม่!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน!",
          cancelButtonText: "ยกเลิก!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
    },
  },
};
</script>

<style scoped>
.total_green {
  background-color: #4cda4c;
}

.total_yellow {
  background-color: #e9e556;
}

.total_red {
  background-color: #ee5c5c;
}

.total_start {
  background-color: #909090;
}

.show-invalid {
  border-color: #dc3545;
  padding-right: 2.25rem !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27 viewBox=%270 0 12 12%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.show-valid {
  border-color: #28a745;
  padding-right: 2.25rem !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%278%27 height=%278%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%2328a745%27 d=%27M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}
</style>
<style>
/*
 * Animated CSS button
 * Copyright Alexander Bodin 2019-09-07
 *
 * Useage: .class {@import button($button-size, $hue, $sat);}
 */
.animated-button1 {
  /*   background: linear-gradient(-30deg, #3d0b0b 50%, #2b0808 50%); */
  background: #3d0b0b;
  padding: 6px 15px;
  /* margin: 12px; */
  display: inline-block;
  -webkit-transform: translate(0%, 0%);
  transform: translate(0%, 0%);
  overflow: hidden;
  color: #f7d4d4;
  /* font-size: 20px; */
  letter-spacing: 2.5px;
  text-align: center;
  text-transform: uppercase;
  text-decoration: none;
  -webkit-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
}

.animated-button1::before {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #ad8585;
  opacity: 0;
  -webkit-transition: 0.2s opacity ease-in-out;
  transition: 0.2s opacity ease-in-out;
}

.animated-button1:hover::before {
  opacity: 0.2;
}

.animated-button1 span {
  position: absolute;
}

.animated-button1 span:nth-child(1) {
  top: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background: -webkit-gradient(linear,
      right top,
      left top,
      from(rgba(43, 8, 8, 0)),
      to(#d92626));
  background: linear-gradient(to left, rgba(43, 8, 8, 0), #d92626);
  -webkit-animation: 2s animateTop linear infinite;
  animation: 2s animateTop linear infinite;
}

@keyframes animateTop {
  0% {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }

  100% {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }
}

.animated-button1 span:nth-child(2) {
  top: 0px;
  right: 0px;
  height: 100%;
  width: 2px;
  background: -webkit-gradient(linear,
      left bottom,
      left top,
      from(rgba(43, 8, 8, 0)),
      to(#d92626));
  background: linear-gradient(to top, rgba(43, 8, 8, 0), #d92626);
  -webkit-animation: 2s animateRight linear -1s infinite;
  animation: 2s animateRight linear -1s infinite;
}

@keyframes animateRight {
  0% {
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
  }

  100% {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
  }
}

.animated-button1 span:nth-child(3) {
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 2px;
  background: -webkit-gradient(linear,
      left top,
      right top,
      from(rgba(43, 8, 8, 0)),
      to(#d92626));
  background: linear-gradient(to right, rgba(43, 8, 8, 0), #d92626);
  -webkit-animation: 2s animateBottom linear infinite;
  animation: 2s animateBottom linear infinite;
}

@keyframes animateBottom {
  0% {
    -webkit-transform: translateX(-100%);
    transform: translateX(-100%);
  }

  100% {
    -webkit-transform: translateX(100%);
    transform: translateX(100%);
  }
}

.animated-button1 span:nth-child(4) {
  top: 0px;
  left: 0px;
  height: 100%;
  width: 2px;
  background: -webkit-gradient(linear,
      left top,
      left bottom,
      from(rgba(43, 8, 8, 0)),
      to(#d92626));
  background: linear-gradient(to bottom, rgba(43, 8, 8, 0), #d92626);
  -webkit-animation: 2s animateLeft linear -1s infinite;
  animation: 2s animateLeft linear -1s infinite;
}

@keyframes animateLeft {
  0% {
    -webkit-transform: translateY(-100%);
    transform: translateY(-100%);
  }

  100% {
    -webkit-transform: translateY(100%);
    transform: translateY(100%);
  }
}
</style>
<style>
@keyframes heartbeat {
  0% {
    transform: scale(1);
    /* ขนาดเริ่มต้น */
  }

  50% {
    transform: scale(1.2);
    /* ขยายภาพ */
  }

  100% {
    transform: scale(1);
    /* ขนาดกลับสู่ขนาดเดิม */
  }
}

.heartbeat-animation svg {
  animation: heartbeat 1s infinite;
  /* ระยะเวลาที่ใช้ในการเล่น animation */
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