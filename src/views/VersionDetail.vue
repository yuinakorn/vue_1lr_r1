<template>
    <section class="content-header">
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h3>{{ pageTitle }}</h3>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb float-sm-right">
                        <li class="breadcrumb-item"><a href="#">หน้าหลัก</a></li>
                        <li class="breadcrumb-item active">รายละเอียดเวอร์ชั่น</li>
                    </ol>
                </div>
            </div>
        </div>
    </section>
    <section class="content">
        <div class="container-fluid">
            <div class="row">
                <div class="card">
                    <table id="datatable" class="table table-striped table-bordered" style="width:100%">
                        <thead>
                            <tr class="text-center">
                                <th class="text-center">version</th>
                                <th class="text-center">เรื่อง</th>
                                <th class="text-center">รายละเอียด</th>
                                <th class="text-center">วันที่ปรับปรุง</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in tableData" :key="index">
                                <td class="px-4 py-2">{{ item.version }}</td>
                                <td class="px-4 py-2 text-left">{{ item.subject }}</td>
                                <td class="px-4 py-2 text-left">{{ item.detail }}</td>
                                <td class="px-4 py-2 text-left" width="15%">{{ formatDate(item.created_date) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

</template>

<script>
import $ from 'jquery';
import 'datatables.net-bs5';
import axios from 'axios';
import 'datatables.net';

export default {
    data() {
        return {
            pageTitle: 'รายละเอียดเวอร์ชั่น',
            hoscode: '',
            tableData: []
        };
    },

    mounted() {
        this.getVersionDetail();
    },
    methods: {
        async getVersionDetail() {
            const config = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                url: process.env.VUE_APP_API_URL + '/dashboard/version/',
                data: {
                    token: localStorage.getItem('token')
                }
            };
            console.log(config)
            try {
                const response = await axios(config);
                this.tableData = response.data; // Assuming the data is in response.data
                console.log(this.tableData)
                this.$nextTick(() => {
                    $('#datatable').DataTable({
                        pageLength: 25,
                        order: [[0, 'desc']],

                    });
                });
            } catch (error) {
                console.log(error);
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
    }
}
</script>

<style scoped>
.card {
    min-width: 100%;
    padding: 1rem;
}
</style>