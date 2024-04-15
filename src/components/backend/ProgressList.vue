<template>
  <div class="content">
    <div class="container-fluid pt-3">
      <div class="row">
        <div class="header mb-2">
          <div style="font-size: 1.6rem">{{ hospital_name }}</div>
          <span class="small text-muted">{{ current_date }}</span>
          <div class="row pt-3 pb-3">
            <div
              class="col d-flex justify-content-start"
              style="font-size: 1.3rem"
            >
              ความก้าวหน้าการคลอด ของ {{ this.pname + " " + this.lname }}
            </div>
          </div>
        </div>
        <div class="form-group col d-flex justify-content-end">
          <button
            v-if="this.refercheck"
            class="animated-button1 btn text-light m-3"
            type="button"
            @click="
              msgshowsuccess(
                'คำแนะนำ \nควรประสานส่งต่อทันที!!',
                'warning',
                true
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

            คำแนะนำ : ควรประสานส่งต่อทันที
          </button>
          <router-link to="/backend/preg_list">
            <button class="btn btn-info m-3">
              <i class="fas fa-home"></i> กลับหน้าหลัก
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <div class="col-md-5">
      <div class="card card-primary">
        <div class="card-header">
          <h3 class="card-title">ปากมดลูกเปิด (Cervix length)</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูล มดลูกเปิด</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>
                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                  <!-- <input
                    type="text"
                    class="form-control"
                    v-model="progress_date_time"
                  /> -->
                </div>
              </div>

              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">ปากมดลูกเปิด</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c01_1"
                    @input="
                      value_c01_1 = this.chknumber(value_c01_1, 10, false, true)
                    "
                    :class="changclassbyval(chkempty(value_c01_1))"
                    :title="
                      showtext(chkempty(value_c01_1), 'กรุณาระบุข้อมูล', '')
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">ซม.</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c01"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC01"
                data-dismiss="modal"
                :disabled="chkempty(value_c01_1) || chkempty(date)"
                :title="
                  showtext(
                    chkempty(value_c01_1) || chkempty(date),
                    'กรุณาระบุข้อมูลให้ครบถ้วน',
                    ''
                  )
                "
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่ เวลา</th>
              <th scope="col" width="40px" class="text-center">ซม.</th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c01, index) in d01" :key="index">
              <th class="text-center">{{ d01.length - index }}</th>
              <td v-html="format_date(c01.progress_date_time)"></td>
              <td class="text-center">{{ c01.value }}</td>
              <td class="text-center">{{ c01.comment }}</td>
              <td>
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c01.cid,
                      c01.an,
                      c01.progress_date_time,
                      c01.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-7">
      <div class="card card-success">
        <div class="card-header">
          <h3 class="card-title">การบีบรัดของมดลูก</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default2"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default2">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูลการบีบรัดของมดลูก</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>

                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">interval (ความถี่)</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c02_1"
                    @input="value_c02_1 = this.chknumber(value_c02_1, 3, true)"
                    :class="changclassbyval(chkempty(value_c02_1))"
                    :title="
                      showtext(chkempty(value_c02_1), 'กรุณาระบุข้อมูล', '')
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text px-2">นาที</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">duration (ความนาน)</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c02_2"
                    @input="value_c02_2 = this.chknumber(value_c02_2, 3, true)"
                    :class="changclassbyval(chkempty(value_c02_2))"
                    :title="
                      showtext(chkempty(value_c02_2), 'กรุณาระบุข้อมูล', '')
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text px-2">วินาที</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">intensity (ความแรง)</div>
                  </div>
                  <select
                    class="form-control"
                    v-model="value_c02_3"
                    :class="changclassbyval(chkempty(value_c02_3))"
                    :title="
                      showtext(chkempty(value_c02_3), 'กรุณาระบุข้อมูล', '')
                    "
                  >
                    <option value="1">ระดับ 1 (mild intensity)</option>
                    <option value="2">ระดับ 2 (moderate intensity)</option>
                    <option value="3">ระดับ 3 (strong intensity)</option>
                  </select>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c02"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC02"
                data-dismiss="modal"
                :disabled="
                  chkempty(value_c02_1) ||
                  chkempty(value_c02_2) ||
                  chkempty(value_c02_3) ||
                  chkempty(date)
                "
                :title="
                  showtext(
                    chkempty(value_c02_1) ||
                      chkempty(value_c02_2) ||
                      chkempty(value_c02_3) ||
                      chkempty(date),
                    'กรุณาระบุข้อมูลให้ครบถ้วน',
                    ''
                  )
                "
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่ เวลา</th>
              <th scope="col" width="80px" class="text-center">
                interval<br />(นาที)
              </th>
              <th scope="col" width="80px" class="text-center">
                duration<br />(วินาที)
              </th>
              <th
                scope="col"
                width="120px"
                class="text-center"
                title="ระดับความแรง จากน้อยไปมาก มี 3 ระดับ"
              >
                intensity<br />ระดับความแรง
              </th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c02, index) in d02" :key="index">
              <th class="text-center">{{ d02.length - index }}</th>
              <td class="text-center">
                {{ format_date(c02.progress_date_time) }}
              </td>
              <td class="text-center">{{ c02.value }}</td>
              <td class="text-center">{{ c02.value2 }}</td>
              <td class="text-center">{{ show_value_c02_3[c02.value3] }}</td>
              <td class="text-center">{{ c02.comment }}</td>
              <td class="text-center">
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c02.cid,
                      c02.an,
                      c02.progress_date_time,
                      c02.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card card-warning">
        <div class="card-header">
          <h3 class="card-title">อัตราการเต้นหัวใจของทารกในครรภ์ (FHR)</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default3"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default3">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูลหัวใจลูก (FHR)</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>

                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">
                      อัตราการเต้นของหัวใจของทารกในครรภ์
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c03_1"
                    @input="value_c03_1 = this.chknumber(value_c03_1, 3, true)"
                    :class="changclassbyval(chkempty(value_c03_1))"
                    :title="
                      showtext(chkempty(value_c03_1), 'กรุณาระบุข้อมูล', '')
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text px-2">ครั้ง/นาที</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c03"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC03"
                data-dismiss="modal"
                :disabled="chkempty(value_c03_1) || chkempty(date)"
                :title="
                  showtext(
                    chkempty(value_c03_1) || chkempty(date),
                    'กรุณาระบุข้อมูลให้ครบถ้วน',
                    ''
                  )
                "
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่ เวลา</th>
              <th scope="col" width="80px" class="text-center">ครั้ง/นาที</th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c03, index) in d03" :key="index">
              <th class="text-center">{{ d03.length - index }}</th>
              <td>{{ format_date(c03.progress_date_time) }}</td>
              <td class="text-center">{{ c03.value }}</td>
              <td class="text-center">{{ c03.comment }}</td>
              <td class="text-center">
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c03.cid,
                      c03.an,
                      c03.progress_date_time,
                      c03.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card card-primary">
        <div class="card-header">
          <h3 class="card-title">การตกเลือดหลังคลอด</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default4"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default4">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูลการตกเลือดหลังคลอด (PPH)</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>

                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">
                      ปริมาณเลือดที่รั่วไหลออกมา
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c04_1"
                    @input="value_c04_1 = this.chknumber(value_c04_1, 10, true)"
                    :class="changclassbyval(chkempty(value_c04_1))"
                    :title="
                      showtext(chkempty(value_c04_1), 'กรุณาระบุข้อมูล', '')
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text px-2">มล.</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c04"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC04"
                data-dismiss="modal"
                :disabled="chkempty(value_c04_1)|| chkempty(date)"
                :title="showtext(chkempty(value_c04_1)|| chkempty(date), 'กรุณาระบุข้อมูลให้ครบถ้วน', '')"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่ เวลา</th>
              <th scope="col" width="65px" class="text-center">มล.</th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c04, index) in d04" :key="index">
              <th class="text-center">{{ d04.length - index }}</th>
              <td>{{ format_date(c04.progress_date_time) }}</td>
              <td class="text-center">{{ c04.value }}</td>
              <td class="text-center">{{ c04.comment }}</td>
              <td class="text-center">
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c04.cid,
                      c04.an,
                      c04.progress_date_time,
                      c04.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card card-success">
        <div class="card-header">
          <h3 class="card-title">หัวใจแม่ (HR)</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default5"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default5">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูลหัวใจแม่</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>

                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">
                      อัตราการเต้นของหัวใจแม่
                    </div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c05_1"
                    @input="value_c05_1 = this.chknumber(value_c05_1, 3, true)"
                    :class="changclassbyval(chkempty(value_c05_1))"
                    :title="
                      showtext(chkempty(value_c05_1), 'กรุณาระบุข้อมูล', '')
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text px-2">ครั้ง/นาที</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c05"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC05"
                data-dismiss="modal"
                :disabled="chkempty(value_c05_1)|| chkempty(date)"
                :title="showtext(chkempty(value_c05_1)|| chkempty(date), 'กรุณาระบุข้อมูลให้ครบถ้วน', '')"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่</th>
              <th scope="col" width="80" class="text-center">ครั้ง/นาที</th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c05, index) in d05" :key="index">
              <th class="text-center">{{ d05.length - index }}</th>
              <td>{{ format_date(c05.progress_date_time) }}</td>
              <td class="text-center">{{ c05.value }}</td>
              <td class="text-center">{{ c05.comment }}</td>
              <td class="text-center">
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c05.cid,
                      c05.an,
                      c05.progress_date_time,
                      c05.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card card-warning">
        <div class="card-header">
          <h3 class="card-title">ความดันแม่ (BP)</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default6"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default6">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูลความดันแม่</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>

                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">SBP/DBP</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="value_c06_1"
                    v-on:input="chkBP"
                    :class="changclassbyval(chkBPformat())"
                    :title="
                      showtext(
                        chkBPformat(),
                        'ตัวอย่างรูปแบบที่ถูกต้อง 100/90 คือ ต้องมีตัวเลข สองชุดที่คั่นด้วยเครื่องหมาย /',
                        ''
                      )
                    "
                    autocomplete="off"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text px-2">mmHg</div>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c06"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC06"
                data-dismiss="modal"
                :disabled="chkBPformat()|| chkempty(date)"
                :title="showtext(chkBPformat()|| chkempty(date), 'กรุณาระบุข้อมูลให้ถูกต้องและครบถ้วน', '')"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่</th>
              <th scope="col" width="85px" class="text-center">
                SBP/DBP<br />(mmHg)
              </th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c06, index) in d06" :key="index">
              <th class="text-center">{{ d06.length - index }}</th>
              <td>{{ format_date(c06.progress_date_time) }}</td>
              <td class="text-center">{{ c06.value }}</td>
              <td class="text-center">{{ c06.comment }}</td>
              <td class="text-center">
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c06.cid,
                      c06.an,
                      c06.progress_date_time,
                      c06.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-5">
      <div class="card card-info">
        <div class="card-header">
          <h3 class="card-title">ลักษณะน้ำคร่ำ</h3>
          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-default btn-sm m-0 p-0 px-1"
              data-toggle="modal"
              data-target="#modal-default7"
              @click="setNewAdd"
            >
              เพิ่มข้อมูล
            </button>
          </div>
        </div>
      </div>

      <div class="modal fade" id="modal-default7">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h4 class="modal-title">เพิ่มข้อมูล ลักษณะน้ำคร่ำ</h4>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <!-- <span aria-hidden="true">&times;</span> -->
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">วันที่ เวลา</div>

                    <VueDatePicker
                      v-model="date"
                      format="yyyy-MM-dd HH:mm"
                      :class="changclassbyval(chkempty(date))"
                      :title="
                        showtext(chkempty(date), 'กรุณาระบุวันที่และเวลา', '')
                      "
                      autocomplete="off"
                    ></VueDatePicker>
                  </div>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">ลักษณะน้ำคร่ำ</div>
                  </div>

                  <!-- ลักษณะน้ำคร่ำ
   1. ใส (clear)
   2. ขี้เทา (meconium)
   3. ประเมินไม่ได้ -->
                  <select class="form-control" v-model="value_c07_1"
                  :class="changclassbyval(chkempty(value_c07_1))"
                    :title="
                      showtext(chkempty(value_c07_1), 'กรุณาระบุข้อมูล', '')"
                  >
                    <option value="1">1. ใส (clear)</option>
                    <option value="2">2. ขี้เทา (meconium)</option>
                    <option value="3">3. ประเมินไม่ได้</option>
                  </select>
                </div>
              </div>
              <div class="form-group col">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <div class="input-group-text px-2">Comment</div>
                  </div>
                  <input
                    type="text"
                    class="form-control"
                    v-model="comment_c07"
                  />
                </div>
              </div>
            </div>
            <div class="modal-footer justify-content-between">
              <button
                type="button"
                class="btn btn-outline-success"
                data-dismiss="modal"
              >
                ปิด
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="createC07"
                data-dismiss="modal"
                :disabled="chkempty(value_c07_1)|| chkempty(date)"
                :title="showtext(chkempty(value_c07_1)|| chkempty(date), 'กรุณาระบุข้อมูลให้ครบถ้วน', '')"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="overflow-auto mb-3" style="height: 15rem">
        <table class="table table-sm table-hover table-striped table-bordered">
          <thead class="table-info sticky-top">
            <tr>
              <th scope="col" width="40px" class="text-center">#</th>
              <th scope="col" width="150px" class="text-center">วันที่</th>
              <th scope="col" width="150px" class="text-center">ลักษณะ</th>
              <th scope="col" class="text-center">หมายเหตุ</th>
              <th scope="col" width="40px" class="text-center">ลบ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(c07, index) in d07" :key="index">
              <th class="text-center">{{ d07.length - index }}</th>
              <td>{{ format_date(c07.progress_date_time) }}</td>
              <td class="text-center">{{ show_value_c07_1[c07.value] }}</td>
              <td class="text-center">{{ c07.comment }}</td>
              <td class="text-center">
                <button
                  class="btn btn-info btn-sm"
                  @click="
                    progress_delete(
                      c07.cid,
                      c07.an,
                      c07.progress_date_time,
                      c07.code
                    )
                  "
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
var axios = require("axios");
import moment from "moment";
import "moment/locale/th";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Swal from "sweetalert2";
// import ref from 'vue';
// const datepicker = ref<VueDatePicker>(null);
// moment.locale();

export default {
  components: { VueDatePicker },
  name: "ProgressList",
  data() {
    return {
      d01: [],
      d02: [],
      d03: [],
      d04: [],
      d05: [],
      d06: [],
      d07: [],
      token: "",
      hcode: "",
      cid: "",
      an: "",
      // progress_date_time: moment().format("YYYY-MM-DD HH:mm"),
      progress_date_time: "",
      value: "",
      comment: "",
      dataTime: null,
      pname: "",
      lname: "",
      datereturn: "",
      date: new Date(),
      value_c01_1: "",
      comment_c01: "",
      value_c02_1: "",
      value_c02_2: "",
      value_c02_3: "",
      comment_c02: "",
      show_value_c02_3: ["", "mild", "moderate", "strong"],
      value_c03_1: "",
      comment_c03: "",
      value_c04_1: "",
      comment_c04: "",
      value_c05_1: "",
      comment_c05: "",
      value_c06_1: "",
      comment_c06: "",
      value_c07_1: "",
      comment_c07: "",
      show_value_c07_1: [
        "",
        "ใส (clear)",
        "ขี้เทา (meconium)",
        "ประเมินไม่ได้",
      ],
      hospital_name: "",
      current_date: "",
      refercheck: false,
      checkrefer_c01: false,
      checkrefer_c02: false,
      checkrefer_c03: false,
      checkrefer_c04: false,
      checkrefer_c05: false,
      checkrefer_c06: false,
      checkrefer_c06_drop: false,
      checkrefer_c07: false,
      preg_data: [],
      refer_status: "",
    };
  },

  created() {
    this.loadData();
  },

  methods: {
    async loadData() {
      const token = localStorage.getItem("token");
      this.token = token;
      console.log(token);
      this.$route.params.hcode;
      this.$route.params.cid;
      this.$route.params.an;
      this.currentDateTime;

      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/search/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          this.reset_checkrefer();

          this.data = response.data.sort((a, b) =>
            a.progress_date_time < b.progress_date_time ? 1 : -1
          );

          this.d01 = response.data;
          this.d01 = this.d01.filter((item) => item.code == "C01");
          this.check_slow_progress(this.d01);

          this.d02 = response.data;
          this.d02 = this.d02.filter((item) => item.code == "C02");

          this.d03 = response.data;
          this.d03 = this.d03.filter((item) => item.code == "C03");
          this.checkrefer_FHR(this.d03);

          this.d04 = response.data;
          this.d04 = this.d04.filter((item) => item.code == "C04");
          this.checkrefer_PPH(this.d04);

          this.d05 = response.data;
          this.d05 = this.d05.filter((item) => item.code == "C05");
          this.checkrefer_HR(this.d05);

          this.d06 = response.data;
          this.d06 = this.d06.filter((item) => item.code == "C06");
          this.checkrefer_BP(this.d06);

          this.d07 = response.data;
          this.d07 = this.d07.filter((item) => item.code == "C07");
          this.checkrefer();
        })
        .catch((error) => {
          console.log(error);
        });

      let config2 = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/pregs/search/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      await axios
        .request(config2)
        .then((response) => {
          // console.log("sssss");
          console.log(JSON.stringify(response.data));
          this.preg_data = response.data;
          this.pname = response.data.pname;
          this.lname = response.data.lname;
        })
        .catch((error) => {
          console.log(error);
        });

      // console.log("show refercheck", this.refercheck);
      // console.log("show preg_data length", this.preg_data);
      if (this.refercheck) {
        // console.log("in check refer update");
        var chkval1 = "4";
        var chkval2 = "4";
        var chkval3 = "4";
        if (this.checkrefer_c01 && this.checkrefer_c03) {
          chkval1 = "3";
        } else if (this.checkrefer_c01 && !this.checkrefer_c03) {
          chkval1 = "1";
        } else if (this.checkrefer_c03 && !this.checkrefer_c01) {
          chkval1 = "2";
        }
        if (this.checkrefer_c04 && this.checkrefer_c05) {
          chkval2 = "3";
        } else if (this.checkrefer_c04 && !this.checkrefer_c05) {
          chkval2 = "1";
        } else if (this.checkrefer_c05 && !this.checkrefer_c04) {
          chkval2 = "2";
        }
        if (this.checkrefer_c06 && this.checkrefer_c06_drop) {
          chkval3 = "3";
        } else if (this.checkrefer_c06 && !this.checkrefer_c06_drop) {
          chkval3 = "1";
        } else if (this.checkrefer_c06_drop && !this.checkrefer_c06) {
          chkval3 = "2";
        }

        var refernewcheck = chkval1 + chkval2 + chkval3;
        // console.log("refernew:", refernewcheck);
        if (refernewcheck != this.preg_data.refer_status) {
          this.refer_status = refernewcheck;
          this.update_refer_status();
        }
      } else {
        var refercheck = "444";
        if (refercheck != this.preg_data.refer_status) {
          this.refer_status = refercheck;
          this.update_refer_status();
        }
      }
    },
    async createC01() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C01",
        value: this.value_c01_1,
        value2: "",
        value3: "",
        comment: this.comment_c01,
      });
      console.log(data);
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      console.log(config);
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },

    async createC02() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C02",
        value: this.value_c02_1,
        value2: this.value_c02_2,
        value3: this.value_c02_3,
        comment: this.comment_c02,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      // console.log(data);
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },

    async createC03() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C03",
        value: this.value_c03_1,
        value2: "",
        value3: "",
        comment: this.comment_c03,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
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
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },

    async createC04() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C04",
        value: this.value_c04_1,
        value2: "",
        value3: "",
        comment: this.comment_c04,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
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
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },

    async createC05() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C05",
        value: this.value_c05_1,
        value2: "",
        value3: "",
        comment: this.comment_c05,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
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
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },

    async createC06() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C06",
        value: this.value_c06_1,
        value2: "",
        value3: "",
        comment: this.comment_c06,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
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
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },
    async createC07() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.$route.params.hcode,
        cid: this.$route.params.cid,
        an: this.$route.params.an,
        hn: this.$route.params.hn,
        progress_date_time: moment(this.date).format("YYYY-MM-DD HH:mm:ss"),
        code: "C07",
        value: this.value_c07_1,
        value2: "",
        value3: "",
        comment: this.comment_c07,
      });
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/progress/create/",
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
          this.loadData();
          this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },
    async update_refer_status() {
      const axios = require("axios");
      let data = JSON.stringify({
        token: this.token,
        hcode: this.preg_data.hcode,
        cid: this.preg_data.cid,
        title: this.preg_data.title,
        pname: this.preg_data.pname,
        lname: this.preg_data.lname,
        hn: this.preg_data.hn,
        an: this.preg_data.an,
        age_y: this.preg_data.age_y,
        gravida: this.preg_data.gravida,
        parity: this.preg_data.parity,
        ga: this.preg_data.ga,
        anc_check_up: this.preg_data.anc_check_up,
        no_of_anc: this.preg_data.no_of_anc,
        weight_before_pregancy: this.preg_data.weight_before_pregancy,
        weight_at_delivery: this.preg_data.weight_at_delivery,
        weight_gain: this.preg_data.weight_gain,
        height: this.preg_data.height,
        fundal_height: this.preg_data.fundal_height,
        hematocrit: this.preg_data.hematocrit,
        ultrasound: this.preg_data.ultrasound,
        cpd_risk_score: this.preg_data.cpd_risk_score,
        status: this.preg_data.status,
        refer_status: this.refer_status, //สถานะ refer เริ่มที่ 0
        admit_date: this.preg_data.admit_date, //เวลาที่เลือก
        create_date: this.preg_data.create_date, //เวลาปัจจุบันที่เข้ามากรอกข้อมูล
        modify_date: this.preg_data.modify_date, //เวลาปัจจุบันที่เข้ามากรอกข้อมูล
        user_create: this.preg_data.user_create,
        user_last_modify: this.preg_data.user_last_modify,
        image: this.preg_data.image,
      });
      let config = {
        method: "put",
        maxBodyLength: Infinity,
        url: "https://api-onelr.lphis.org/pregs/update/",
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };
      console.log(config);
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          // this.loadData();
          // this.msgshowsuccess("เพิ่มข้อมูลสำเร็จ", "success");
          // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
          // window.location.href = "#/backend/preg_list";
        })
        .catch((error) => {
          // this.msgshowsuccess("เพิ่มข้อมูลไม่สำเร็จ", "error");
          console.log(error);
        });
    },
    format_date(value) {
      var datereturn;
      if (value) {
        datereturn = moment(String(value)).format("YYYY-MM-DD HH:mm");
        // datereturn = datereturn.split(" ");
        // datereturn = "<div class='btn btn-secondary'>" + datereturn[0] + "<span class='badge badge-light'>"+ datereturn[1] +"</span></div>";
        return datereturn;
      }
    },
    setNewAdd() {
      this.date = new Date();
      // this.date = new Date();
      this.value = "";
      this.comment = "";
    },
    progress_delete(delcid, delan, deltime, delcode) {
      // this.reset_checkrefer();
      // this.checkrefer();
      var showtext_code = [];
      showtext_code["C01"] = "ปากมดลูกเปิด";
      showtext_code["C02"] = "การบีบรัดของมดลูก";
      showtext_code["C03"] = "หัวใจลูก FHR";
      showtext_code["C04"] = "การตกเลือดหลังคลอด";
      showtext_code["C05"] = "หัวใจแม่ HR";
      showtext_code["C06"] = "ความดันแม่ BP";
      showtext_code["C07"] = "ลักษณะน้ำคร่ำ";
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
          text: "คุณกำลังจะลบข้อมูล" + showtext_code[delcode] + "!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "ยืนยัน!",
          cancelButtonText: "ยกเลิก!",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            console.log(delcid, delan, deltime, delcode);
            const axios = require("axios");
            let data = JSON.stringify({
              token: this.token,
              cid: delcid,
              an: delan,
              progress_date_time: deltime,
              code: delcode,
            });
            let config = {
              method: "delete",
              maxBodyLength: Infinity,
              url: "https://api-onelr.lphis.org/progress/delete/",
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
                this.loadData();
                this.msgshowsuccess("ลบข้อมูลสำเร็จ", "success");
                // alert("บันทึกข้อมูลเสร็จเรียบร้อย")
                // window.location.href = "#/backend/preg_list";
              })
              .catch((error) => {
                this.msgshowsuccess("ลบข้อมูลไม่สำเร็จ", "error");
                console.log(error);
              });
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            // swalWithBootstrapButtons.fire(
            //   "ยกเลิก การลบข้อมูล",
            //   "Your imaginary file is safe :)",
            //   "error"
            // );
          }
        });
    },
    msgshowsuccess(txtshow, statusshow, html = false) {
      if (html) {
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
        if (this.checkrefer_c01) {
          show_caution_c01 = span_danger + show_caution_c01 + span_danger_close;
        }
        if (this.checkrefer_c03) {
          show_caution_c03 = span_danger + show_caution_c03 + span_danger_close;
        }
        if (this.checkrefer_c04) {
          show_caution_c04 = span_danger + show_caution_c04 + span_danger_close;
        }
        if (this.checkrefer_c05) {
          show_caution_c05 = span_danger + show_caution_c05 + span_danger_close;
        }
        if (this.checkrefer_c06) {
          show_caution_c06 = span_danger + show_caution_c06 + span_danger_close;
        }
        if (this.checkrefer_c06_drop) {
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
    checkvalue(chkvalue) {
      if (isNaN(chkvalue) || chkvalue.trim() === "") {
        this.msgshowsuccess("คุณกรอกค่าไม่ถูกต้อง กรุณาตรวจสอบ", "error");
      }
    },
    checkrefer() {
      if (
        this.checkrefer_c01 ||
        this.checkrefer_c03 ||
        this.checkrefer_c04 ||
        this.checkrefer_c05 ||
        this.checkrefer_c06 ||
        this.checkrefer_c06_drop
      ) {
        this.refercheck = true;
      } else {
        this.refercheck = false;
      }
    },
    reset_checkrefer() {
      this.checkrefer_c01 = false;
      this.checkrefer_c03 = false;
      this.checkrefer_c04 = false;
      this.checkrefer_c05 = false;
      this.checkrefer_c06 = false;
      this.checkrefer_c06_drop = false;
    },
    check_slow_progress(valchk) {
      //ปากมดลูก Progress ช้า น้อยกว่า 1 เซนติเมตร ใน 2 ชั่วโมง
      if (valchk != "") {
        // console.log("value c01 : ", valchk);
        if (valchk.length >= 3) {
          valchk.forEach((value, index, array) => {
            // console.log("index", index, "value", value);
            if (index < array.length - 2) {
              const firstIndex = index;
              const secondIndex = index + 2;

              if (array[firstIndex].value === array[secondIndex].value) {
                this.checkrefer_c01 = true;
              }
            }
          });
        }
      }
    },
    checkrefer_FHR(valchk) {
      //อัตราการเต้นหัวใจของทารกในครรภ์ (FHR) ต่ำกว่า 110 ครั้ง/นาที หรือมากกว่า 170 ครั้ง/นาที
      if (valchk != "") {
        // console.log("value c03 : ", valchk);
        if (valchk.length > 0) {
          valchk.forEach((value) => {
            // console.log("index", index, "value", value);
            if (value.value != "") {
              if (value.value < 110 || value.value > 170) {
                this.checkrefer_c03 = true;
              }
            }
          });
        }
      }
    },
    checkrefer_PPH(valchk) {
      //การตกเลือดหลังคลอด (PPH) มากกว่า 300 มิลลิลิตร
      if (valchk != "") {
        // console.log("value c04 : ", valchk);
        if (valchk.length > 0) {
          valchk.forEach((value) => {
            // console.log("value", value);
            if (value.value != "") {
              // console.log(" in if : ", value.value);
              // var vnumber = Number(value.value)
              if (value.value > 300) {
                // console.log(" in if > 300 : ", vnumber)
                this.checkrefer_c04 = true;
              }
            }
          });
        }
      }
    },
    checkrefer_HR(valchk) {
      //อัตราการเต้นหัวใจแม่ (HR) มากกว่า 100 ครั้ง/นาที
      if (valchk != "") {
        // console.log("value c03 : ", valchk);
        if (valchk.length > 0) {
          valchk.forEach((value) => {
            // console.log("index", index, "value", value);
            if (value.value != "") {
              if (value.value > 100) {
                this.checkrefer_c05 = true;
              }
            }
          });
        }
      }
    },
    checkrefer_BP(valchk) {
      if (valchk != "") {
        // console.log("value c06 : ", valchk);
        //ความดันแม่(BP) เท่ากับหรือมากกว่า 150/100
        if (valchk.length > 0) {
          valchk.forEach((value) => {
            // console.log("index", index, "value", value);
            if (value.value != "") {
              var chkindex = value.value.indexOf("/");
              if (chkindex !== -1) {
                var c06_chk = value.value.split("/");
                var val1 = 0;
                var val2 = 0;
                if (c06_chk[0] != "") {
                  val1 = c06_chk[0];
                }
                if (c06_chk[1] != "") {
                  val2 = c06_chk[1];
                }
                if (val1 >= 150 || val2 >= 100) {
                  this.checkrefer_c06 = true;
                }
              }
            }
          });
        }

        if (valchk.length >= 2) {
          //BP Systolic drop > 30 หรือ Diastolic drop > 20
          valchk.forEach((value, index, array) => {
            // console.log("index", index, "value", value);
            if (index < array.length - 1) {
              const firstIndex = index;
              const secondIndex = index + 1;
              var chkindex = array[firstIndex].value.indexOf("/");
              var chkindex2 = array[secondIndex].value.indexOf("/");
              if (chkindex !== -1 && chkindex2 !== -1) {
                var c06_chk_1 = array[firstIndex].value.split("/");
                var c06_chk_2 = array[secondIndex].value.split("/");
                var diff_sbp = 0;
                var diff_dbp = 0;
                if (c06_chk_1[0] != "" && c06_chk_2[0] != "") {
                  diff_dbp = c06_chk_1[0] - c06_chk_2[0];
                  if (Math.abs(diff_dbp) > 30) {
                    this.checkrefer_c06_drop = true;
                  }
                }
                if (c06_chk_1[1] != "" && c06_chk_2[1] != "") {
                  diff_sbp = c06_chk_1[1] - c06_chk_2[1];
                  if (Math.abs(diff_sbp) > 20) {
                    this.checkrefer_c06_drop = true;
                  }
                }
              }
            }
          });
        }
      }
    },
    chknumber(
      valchk,
      numberlength = 6,
      checkzerofirst = false,
      typefloat = false
    ) {
      // console.log("chknumber", valchk);
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
    chkBPformat() {
      let pattern = /^\d{1,3}\/\d{1,3}$/;
      if (!pattern.test(this.value_c06_1)) {
        return true;
      } else {
        return false;
      }
    },
    chkBP(event) {
      var valchk = event.target.value;
      let pattern = /^\d{1,3}\/\d{1,3}$/;
      if (event.data == null && event.inputType != "insertText") {
        //ถ้าไม่ใช่การใส่ตัวอักษรให้ออกจากการตรวจสอบ
        return;
      }
      if (!pattern.test(valchk)) {
        // ถ้ารูปแบบไม่ถูกต้อง
        // ลบตัวอักษรที่ไม่ใช่ตัวเลขและ /
        valchk = valchk.replace(/\/\//g, "/"); // ตัด / ที่ซ้ำให้เหลือตัวเดียว
        valchk = valchk.replace(/[^\d/]/g, ""); // ตัดตัวอักษรให้เหลือแค่ตัวเลข และ /
        if (valchk != "") {
          var chkindex = valchk.indexOf("/");
          if (chkindex !== -1) {
            var c06_chk = valchk.split("/");
            var val1 = "";
            var val2 = "";
            if (c06_chk[0] != "") {
              val1 = this.chknumber(c06_chk[0], 3);
            }
            if (c06_chk[1] != "") {
              val2 = this.chknumber(c06_chk[1], 3);
            }
            if (val1 != "" && val2 != "") {
              valchk = val1 + "/" + val2;
            } else {
              valchk = val1 + "/";
            }
          } else {
            if (valchk.length >= 3) {
              valchk = this.chknumber(valchk, 3) + "/";
            }
          }
        }
        event.target.value = valchk;
      } else {
        event.target.value = valchk;
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
        // console.log("chkempty", valchk);
        valchk = String(valchk);
        if (valchk.trim() != "") {
          return false;
        } else {
          return true;
        }
      }
    },
  },
};
</script>

<style scoped>
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