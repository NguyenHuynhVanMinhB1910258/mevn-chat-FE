import { createApp } from 'vue'
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'
import "@fortawesome/fontawesome-free/css/all.min.css";
import App from './App.vue'
import router from './router'


createApp(App).use(new VueSocketIO({
    debug: true,
    connection: SocketIO('http://localhost:4000') 

  })
);
createApp(App).use(router).mount("#app")


import 'bootstrap/dist/css/bootstrap.css'

