import { createRouter, createWebHashHistory } from 'vue-router'
import Dashboard from '@/views/DashBoard.vue'
import HospitalDetail from "@/views/HospitalDetail.vue";
import PatientDetail from "@/views/PatientDetail.vue";
import PrintPdf from "@/views/PrintPdf.vue";
import PregCreate from "@/components/backend/PregCreate.vue";
import Login from "@/views/Login.vue";
import Logout from "@/views/Logout.vue";
import PregList from "@/components/backend/PregList.vue";
import PregAll from "@/views/PregAll.vue";
import PregAllConsult from "@/views/PregAllConsult.vue";
import PregUpdate from "@/components/backend/PregUpdate.vue";
import ProgressList from "@/components/backend/ProgressList.vue";
import ProgressCreate from "@/components/backend/ProgressCreate.vue";
import InfantList from "@/components/backend/InfantList.vue";
import HistoryLog from "@/views/HistoryLog.vue";
import axios from "axios";

// import jwt from 'jsonwebtoken';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            layout: 'login-layout',
            requiresAuth: false
        }
    },
    {
        path: '/logout',
        name: 'logout',
        component: Logout,
        meta: {
            layout: 'login-layout',
            requiresAuth: true
        }
    },
    {
        path: '/',
        name: 'root',
        component: Dashboard,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/hospital/:hoscode',
        name: 'hospital',
        component: HospitalDetail,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/patients',
        name: 'patients',
        component: PregAll,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/patients-consult',
        name: 'patients_conslut',
        component: PregAllConsult,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/history',
        name: 'history',
        component: HistoryLog,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/patient/:hoscode/:an/:cid',
        name: 'patient',
        component: PatientDetail,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/print/:hoscode/:an/:cid',
        name: 'print',
        component: PrintPdf,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/backend/preg_create/',
        name: 'preg_create',
        component: PregCreate,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/backend/preg_list/',
        name: 'preg_list',
        component: PregList,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/backend/preg_update/:hcode/:cid/:an',
        name: 'preg_update',
        component: PregUpdate,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/backend/progress_list/:hcode/:cid/:an/:hn',
        name: 'progress_list',
        component: ProgressList,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/backend/progress_create/:hcode/:cid/:an/:hn/:code',
        name: 'prog_create',
        component: ProgressCreate,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
    {
        path: '/backend/infant_list',
        name: 'infant_list',
        component: InfantList,
        meta: {
            layout: 'default-layout',
            requiresAuth: true
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// original code
// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem('token');
//     if (to.meta.requiresAuth && !isAuthenticated) {
//         next('/login');
//     } else {
//         next();
//     }
// });


router.beforeEach(async (to, from, next) => {

    const isAuthenticated = await new Promise((resolve) => {

        try {
            // เพิ่มมาในส่วนของ auto refresh
            // if (from && from.meta.refreshInterval) {
            //     clearInterval(from.meta.timer);
            // }
            // if (to.meta.refreshInterval && !to.meta.timer) {
            //     to.meta.timer = setInterval(() => {
            //         router.go(); // this depends on your routing setup; might need adjustment
            //     }, to.meta.refreshInterval);
            // }
            // next();
            // end auto refresh


            const token = localStorage.getItem('token');
            // console.log("token => "+token)
            if (token === null) {
                resolve(false);
            } else {
                let data = JSON.stringify({ "token": token });
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: process.env.VUE_APP_API_URL + '/auth/check/token/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        if (response.status === 200) {
                            // console.log(JSON.stringify(response.status));
                            if (to.meta.requiresAuth && response.data) {
                                resolve(true);
                            }
                        } else {
                            console.log(response.status);
                            resolve(false);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        resolve(false);
                    });
            }
        } catch (error) {
            // Token is invalid or has an invalid format
            resolve(false);
        }
    });

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else {
        next();
    }
});

// เพิ่มมาในส่วนของ auto refresh
// router.afterEach((to, from) => {
//     if (from && from.meta.refreshInterval) {
//         clearInterval(from.meta.timer);
//         delete from.meta.timer;
//     }
// });
// end auto refresh


export default router
