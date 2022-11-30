<template>
 
      <div class='row'>
        <div class="row col-12" style="margin-left: 0px; border: 1px solid #e5e7eb;">
          <div class="row col-11">
            <img src="/favicon.ico" style=" padding:10px; border-radius: 90px;">
            <h3 style="margin-top: 10px;">
              Join Room {{ room_name }}
            </h3>
          </div>
          <div class="row col-1 justify-content-end">
            <router-link :to="{ name: 'Home' }" style="color: green;">
              <i class="fa fa-times fa-2x" aria-hidden="true" type="button"></i>
            </router-link>
          </div>
        </div>
        <div class="col-2"></div>
        <div class="col" v-if="room_name">
          <Form v-if="id" :validation-schema="JoinRoomFormSchema">
            <div class="form-group">
              <label>Nickname</label>
              <Field type="text" name="Nickname" class="form-control" placeholder="Enter Nickname"
                v-model.trim="chat.nickname" />
              <ErrorMessage name="Nickname" class="error-feedback" />
            </div>
            <div class="form-group">
              <label>Password Room</label>
              <Field type="password" name="password" class="form-control" placeholder="Password"
                v-model.trim="password" />
              <ErrorMessage name="password" class="error-feedback" />
              <p v-if="message">{{ message }}</p>
            </div>
            <button class="btn btn-primary" @click="onSubmit">Submit</button>
            <button type="button" style="margin-left: 10px ;" class="btn btn-danger"
              @click="deleteRoom(id)">Remove</button>
          </Form>
        </div>
        <div class="col-2"></div>
      </div>

</template>
  
<script>
import RoomService from "@/service/room.service";
import { Form, Field, ErrorMessage } from "vee-validate";
import RoomList from "../components/RoomList.vue";
import SocketIO from 'socket.io-client'
import * as yup from "yup";
// import ChatService from "@/services/chat.service";
export default {
  
  name: 'JoinRoom',
  components: {
        Form,
        Field,
        ErrorMessage,
        RoomList
  },
  data() {
    const JoinRoomFormSchema = yup.object().shape({
      Nickname: yup
        .string()
        .required("Nickname phải có giá trị.")
        .min(2, "Nickname phải ít nhất 3 ký tự.")
        .max(50, "Nickname có nhiều nhất 50 ký tự."),
      password: yup
        .string()
        .required("Password phải có giá trị.")
        .min(8, "Password phải ít nhất 8 ký tự."),
    });
    return {
      chat: {},
      room: {},
      errors: [],
      message: '',
      password: '',
      JoinRoomFormSchema,
      socket: SocketIO('http://localhost:4000')
    }
  },
  props:{
    id: {type: String, required: true },
    room_name: {type: String, required: true}
  },
  methods: {
    async getroom(id){
        this.room = await RoomService.get(id)
    },
    async deleteRoom(id) {
      // await RoomService.DeleteAllChatRoom(id);
      const room_check = await RoomService.get(this.id)
      if(room_check.password === this.password){
      await RoomService.deleteRoom(id).then(response => {
      this.socket.emit('delete-room', response)
      this.$router.push({
          name: 'Home'
        })
      }).catch(e => {
        this.errors.push(e)
      });
    }else this.message = 'Sai mật khẩu'
    },
    async onSubmit (evt) {
      evt.preventDefault()
      const room_check = await RoomService.get(this.id)
      if(room_check.password === this.password){
      this.chat.room = await this.$route.params.id
      this.chat.message = await this.chat.nickname + ' join the room'
      await RoomService.createchat(this.chat)
      .then(response => {
      this.socket.emit('save-message', { room: this.chat.room, nickname: this.chat.nickname, message: 'Join this room', created_date: new Date() });
      this.$router.push({
          name: 'ChatRoom',
          params: { id: this.$route.params.id, nickname: this.chat.nickname }
        })
      })
      }else this.message = 'Sai mật khẩu'
      
      // .catch(e => {
      // this.errors.push(e);
      // })
    }
  },
  updated(){
    this.getroom(this.id);
  }
}
</script>