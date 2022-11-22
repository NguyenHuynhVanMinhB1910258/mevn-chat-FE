import { createWebHistory, createRouter } from "vue-router";
// import RoomList from '@/views/RoomList.vue'
// import AddRoom from '@/components/AddRoom.vue'
// import JoinRoom from '@/components/JoinRoom.vue'
// import ChatRoom from '@/components/ChatRoom.vue'


const routes = [
      {
        path: '/',
        name: 'Home',
        component: () => import("@/views/Mevn-Chat.vue")
      },
      {
        path: "/:pathMatch(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
        props: true
      },
      {
        path: '/add-room',
        name: 'AddRoom',
        component: () => import("@/views/AddRoom.vue")
      },
      {
        path: '/join-room/:id/:room_name',
        name: 'JoinRoom',
        component: () => import("@/views/JoinRoom.vue"),
        props: true
      },
      {
        path: '/chat-room/:id/:nickname',
        name: 'ChatRoom',
        component: () => import("@/views/ChatRoom.vue"),
        props: true
      }
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;