<template>
    <br>
    <div class="container" ref="pdfContent" style="width: 1000px; background-color: white;">
        <div class="row">
            <div class="d-flex justify-content-between col-12 mt-2 border-bottom">
                <div class="col-4">
                    <label>ชื่อ-สกุล: </label>
                    <span class="pl-2">{{ patients.pname }} {{ patients.lname }}</span>
                </div>
                <div class="col">
                    <label>โรงพยาบาล: </label>
                    <span class="pl-2">{{ hospital_name }}</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="d-flex col-12 border-bottom mt-2">
                <div class="col-2">
                    <label>HN: </label>
                    <span class="pl-2">{{ patients.hn }}</span>
                </div>
                <div class="col-2">
                    <label>AN: </label>
                    <span class="pl-2">{{ patients.an }}</span>
                </div>
                <div class="col-4">
                    <label>Admit: </label>
                    <span class="pl-2">{{ dateFormat(patients.admit_date) }} น.</span>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="d-flex col-12 border-bottom mt-2">
                <label style="margin-left: 0.36rem;"> ครรภ์ที่ = </label>
                <span style="margin-left:0.2rem">{{ patients.gravida }}</span>

                <label class="ml-3"> ANC = </label>
                <span style="margin-left:0.2rem"> {{ patients.anc_check_up }} ครั้ง</span>

                <label class="ml-3"> GA = </label>
                <span style="margin-left:0.2rem">{{ patients.ga }} สัปดาห์</span>

                <label class="ml-3"> ส่วนสูง = </label>
                <span style="margin-left:0.2rem"> {{ patients.height }} ซม.</span>

                <label class="ml-3"> ส่วนต่าง นน. </label>
                <span style="margin-left:0.2rem">จาก {{ patients.weight_before_pregancy }} ไป {{
                        patients.weight_at_delivery
                    }} = {{ patients.weight_gain }}
                    กก.</span>

                <label class="ml-3">ยอดมดลูก = </label>
                <span style="margin-left:0.2rem">{{ patients.fundal_height }} ซม.</span>

                <label class="ml-3"> HCT. = </label>
                <span style="margin-left:0.2rem"> {{ patients.hematocrit }} % </span>
            </div>
        </div>
        <div class="row">
            <div class="col-12 d-flex justify-content-center mt-3">
                <div class="text-center">
                    ภาพ Partograph
                </div>
            </div>
        </div>
        <div>
            <chart-partogram class="mt-2" @last-data-partogram="handleLastDataPartogram"
                @slow-partogram="handleSlowPartogram" />
        </div>
        <div class="row">
            <div class="col-12 d-flex justify-content-center mt-4 mb-2">
                <div class="text-center">
                    แบบบันทึกการเปลี่ยนแปลงอาการของผู้คลอด ({{ this.hospital_name }})
                </div>
            </div>
        </div>
        <div>
            <table class="table table-bordered text-center align-items-center">
                <thead>
                    <tr style="font-weight: 500;">
                        <td class="center-items" rowspan="2">ว/ด/ป เวลา</td>
                        <td class="center-items" rowspan="2">V/S</td>
                        <td colspan="3">UC</td>
                        <td rowspan="2">FHS</td>
                        <td colspan="2">Cervix</td>
                        <td>ชื่อผู้ตรวจ</td>
                        <td>SOS</td>
                        <td>Med</td>
                        <td>หมายเหตุ</td>
                    </tr>
                    <tr style="font-weight: 500;">
                        <td>D</td>
                        <td>I</td>
                        <td>แรง</td>
                        <td>Cx(cm.)</td>
                        <td>Eff% / St.</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="data in dataTables" :key="data.id">
                        <td>{{ timeFormat(data.progress_date_time) }}</td>
                        <td>{{ data.vs }}</td>
                        <td>{{ data.uc_d }}</td>
                        <td>{{ data.uc_i }}</td>
                        <td>{{ getStatusLabel(data.uc_stage) }}</td>
                        <td>{{ data.fhs }}</td>
                        <td>{{ data.cervix_open }}</td>
                        <td>{{ data.cervix_open_com }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>

                    </tr>
                </tbody>
            </table>
        </div>

    </div>
</template>
<script>
import axios from "axios";
import ChartPartogram from "@/components/chart/ChartPartogram";

export default {
    components: {
        ChartPartogram,
    },
    data() {
        return {
            lastValuePartogram: null,
            lastUpdatePartogram: null,
            overRateLimitPartogram: false,
            slowPartogram: false,
            patients: [],
            patientData: '',
            c07Data: '-',
            c04Data: '-',
            c07Value: '-',
            filteredData: [],
            hospital_name: null,
            hoscode: '',
            an: '',
            cid: '',
            dataTables: [],
        }
    },
    async created() {
        this.hoscode = this.$route.params.hoscode
        this.an = this.$route.params.an
        this.cid = this.$route.params.cid
        this.token = localStorage.getItem('token')

        const api_url = process.env.VUE_APP_API_URL + '/dashboard/patient/'
        let config = {
            method: 'post',
            url: api_url,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "token": this.token,
                "cid": this.cid,
                "an": this.an,
                "hoscode": this.hoscode,
            })
        }
        try {
            const response = await axios.request(config)
            console.log(response.data)
            this.patients = response.data;
        } catch (error) {
            console.log(error);
        }

    },
    mounted() {
        // get query string from url
        this.hospital_name = this.$route.query.hospital_name
        this.fetchData();
        this.fetchProgress();

        //delay 3 sec
        setTimeout(() => {
            window.print();
        }, 3 * 1000);
    },
    methods: {
        getStatusLabel(uc_stage) {
            if (uc_stage === '1') {
                return 'mild'
            } else if (uc_stage === '2') {
                return 'moderate'
            } else if (uc_stage === '3') {
                return 'strong'
            } else {
                return '-'
            }

        },
        dateFormat(time) {
            // const options = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
            const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
            const thaiLocale = 'th-TH';
            const datetime = new Date(time);
            return datetime.toLocaleDateString(thaiLocale, options)
        },
        timeFormat(time) {
            const options = { hour: 'numeric', minute: 'numeric' };
            const thaiLocale = 'th-TH';
            const datetime = new Date(time);
            return datetime.toLocaleDateString(thaiLocale, options)
        },
        async fetchData() {

            try {
                let data = JSON.stringify({
                    "token": this.token,
                    "hcode": this.$route.params.hoscode,
                    "cid": this.$route.params.cid,
                    "an": this.$route.params.an
                });

                let config = {
                    method: 'post',
                    // maxBodyLength: Infinity,
                    url: process.env.VUE_APP_API_URL + '/progress/search/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                const response = await axios.request(config);

                const c07 = response.data.find(item => item.code === 'C07');
                this.c07Value = c07 ? c07.value : '-';

                this.filteredData = response.data.filter(item => item.code === 'C02');

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
        fetchProgress() {
            const token = localStorage.getItem('token')

            let data = JSON.stringify({
                "token": token,
                "hcode": this.$route.params.hoscode,
                "cid": this.$route.params.cid,
                "an": this.$route.params.an
            });

            console.log(data)

            let config = {
                method: 'post',
                url: process.env.VUE_APP_API_URL + '/progress/table/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config).then(response => {
                this.dataTables = response.data;
                console.log(this.dataTables)
            }).catch(error => {
                console.log(error);
            });


        },
        handleLastDataPartogram(value) {
            this.lastValuePartogram = value.lastValue;
            this.lastUpdatePartogram = value.lastUpdate;
            this.overRateLimitPartogram = value.overRateLimit;

        },
        handleSlowPartogram(value) {
            this.slowPartogram = value.slowPartogram;
            this.overRateLimitPartogram = this.slowPartogram;

            this.toAlarm = this.slowPartogram || this.overRateLimitHr || this.overRateLimitFhs || this.overRateLimitBp || this.overRateLimitPph;
        },
    }
};
</script>
<style scope>
label {
    margin-bottom: 0px !important;
}

.center-items {
    /* display: flex; */
    align-items: center;
    justify-content: center;
    height: 100%;
}

tbody {
    font-size: 0.86rem !important;
}

td {
    padding: 0.1rem !important;
}

label {
    font-weight: 500 !important;
}
</style>