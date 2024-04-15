<template>
    <br>
    <div class="container" ref="pdfContent" style="width: 1000px; background-color: white;">
        <div class="row">
            <div class="d-flex justify-content-between col-12 mt-2 border-bottom">
                <div class="col-4">
                    <span>ชื่อ-สกุล: </span>
                    <label class="pl-2">{{ patients.pname }} {{ patients.lname }}</label>
                </div>
                <div class="col">
                    <span>โรงพยาบาล: </span>
                    <label class="pl-2">{{ hospital_name }}</label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="d-flex col-12 border-bottom mt-2">
                <div class="col-2">
                    <span>HN: </span>
                    <label class="pl-2">{{ patients.hn }}</label>
                </div>
                <div class="col-2">
                    <span>AN: </span>
                    <label class="pl-2">{{ patients.an }}</label>
                </div>
                <div class="col-4">
                    <span>Admit: </span>
                    <label class="pl-2">{{ dateFormat(patients.admit_date) }} น.</label>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="d-flex col-12 border-bottom mt-2">
                <span style="margin-left: 0.36rem;"> ครรภ์ที่ = </span>
                <label style="margin-left:0.2rem">{{ patients.gravida }}</label>

                <span class="ml-3"> ANC = </span>
                <label style="margin-left:0.2rem"> {{ patients.anc_check_up }} ครั้ง</label>

                <span class="ml-3"> GA = </span>
                <label style="margin-left:0.2rem">{{ patients.ga }} สัปดาห์</label>

                <span class="ml-3"> ส่วนสูง = </span>
                <label style="margin-left:0.2rem"> {{ patients.height }} ซม.</label>

                <span class="ml-3"> ส่วนต่าง นน. </span>
                <label style="margin-left:0.2rem">จาก {{ patients.weight_before_pregancy }} ไป {{ patients.weight_at_delivery
                }} = {{ patients.weight_gain }}
                    กก.</label>

                <span class="ml-3">ยอดมดลูก = </span>
                <label style="margin-left:0.2rem">{{ patients.fundal_height }} ซม.</label>

                <span class="ml-3"> Hematocrit = </span>
                <label style="margin-left:0.2rem"> {{ patients.hematocrit }} % </label>
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
                    <tr style="font-weight: bold;">
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
                    <tr style="font-weight: bold;">
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
        const hoscode = this.$route.params.hoscode
        const an = this.$route.params.an

        const api_url = 'https://api-onelr.lphis.org/dashboard/patient/' + hoscode + '/' + an
        await axios.post(api_url)
            .then(response => {
                this.patients = response.data;
                console.log(this.patients)
            })
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
        printPage() {
            window.print();
        },
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
            const token = localStorage.getItem('token')

            try {
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
                url: 'https://api-onelr.lphis.org/progress/table/',
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
</style> 