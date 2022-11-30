<template>
    <div class="row">
        <div class="col-12">
            <router-link :to="{name:'Home'}" style="text-decoration: none; color: black;">
            <h4 style=" text-align: center ;" type="button">
                Me<img src="/favicon.ico">n Chat
            </h4>
            </router-link>
            <SreachRoomVue v-model="searchText" style="padding: 10px; border-bottom: 1px solid #e5e7eb;" ></SreachRoomVue>
        <div class="col room-list">
        <ListRoomVue  
            v-if="filteredRoomsCount > 0"
            :rooms="filteredRooms"
            v-model:activeIndex="activeIndex">
        </ListRoomVue>
        </div>
            <ul v-if="errors && errors.length">
                <li v-for="error of errors">
                    {{ error.message }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
<script>

//   import axios from 'axios'
import SreachRoomVue from "./SreachRoom.vue";
import ListRoomVue from "./ListRoom.vue";
import RoomService from "@/service/room.service";
import SocketIO from 'socket.io-client'
export default {
    name: 'BookList',
    components:{
        SreachRoomVue,
        ListRoomVue
    },
    watch: {
    // Giám sát các thay đổi của biến searchText.
    // Bỏ chọn phần tử đang được chọn trong danh sách.
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
    // Chuyển các đối tượng room thành chuỗi để tiện cho tìm kiếm.
        roomStrings() {
            return this.rooms.map((room) => {
                const {room_name} = room;
                return [room_name].join("");
            });
        },
    // Trả về các room có chứa thông tin cần tìm kiếm.
        filteredRooms() {
            if (!this.searchText) return this.rooms;
                return this.rooms.filter((_room, index) =>
                this.roomStrings[index].includes(this.searchText)
            );
        },
        activeRoom() {
            if (this.activeIndex < 0) return null;
                return this.filteredRooms[this.activeIndex];
        },
        filteredRoomsCount() {
            return this.filteredRooms.length;
        },
    },
    data() {
        return {
            fields: {
                room_name: { label: 'Room Name', sortable: true, 'class': 'text-center' },
                created_date: { label: 'Created Date', sortable: true },
                actions: { label: 'Action', 'class': 'text-center' },

            },
            rooms: [],
            errors: [],
            searchText: "",
            activeIndex: -1,
            socket: SocketIO('http://localhost:4000'),
        }
    },
    // emits: ["update:activeIndex"],
    methods: {
        // join (id) {
        //   this.$router.push({
        //     name: 'JoinRoom',
        //     params: { id: id }
        //   })
        // },
        // async Delete(id) {
        //     // await RoomService.DeleteAllChatRoom(id);
        //     await RoomService.deleteRoom(id).then(response => {
        //         this.socket.emit('delete-room', response)
        //     }).catch(e => {
        //         this.errors.push(e)
        //     });
        // },
        async getAllRoom() {
            try {
                this.rooms = await RoomService.getAll()
            } catch (error) {
                this.errors.push(error);
            }
        },
    },
    created() {
        this.getAllRoom()

        this.socket.on('Delete-Room', async function (data) {
            this.rooms = await RoomService.getAll()
            console.log(this.rooms);
        }.bind(this))
        this.socket.on('new-name', async function (data) {
            this.rooms = await RoomService.getAll()
            console.log(this.rooms);
        }.bind(this))
        this.socket.on('new-room', async function (data) {
            this.rooms.push(data.message);
            console.log(this.rooms);
        }.bind(this))
    }
}
</script>
