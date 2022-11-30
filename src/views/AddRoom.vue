<template>
  <!-- <div class="row">
    <div class="col-xl-3 col-sm-5" style="width: 25%;  border-right: 1px solid #e5e7eb;">
      <RoomList></RoomList>
    </div> -->
    <!-- <div class="col-xl-9 col-sm-7"> -->
      <div class="row">
        <div class="row col-12" style="margin-left: 0; border: 1px solid #e5e7eb;">
          <div class="row col-11">
            <h3 style="margin-top: 10px;">
              Add Room
            </h3>
          </div>
          <div class="row col-1 justify-content-end">
            <router-link :to="{ name: 'Home' }" style="color: green;">
              <i class="fa fa-times fa-2x" aria-hidden="true" type="button"></i>
            </router-link>
          </div>
        </div>
        <div class="col-2"></div>
        <div class="col" align-self="center">
          <Form @submit="onSubmit" :validation-schema="AddRoomFormSchema">
            <div class="form-group">
              <label>Room Name</label>
              <Field type="text" name="room_name" class="form-control" placeholder="Enter Nickname"
                v-model="room.room_name" />
              <ErrorMessage name="room_name" class="error-feedback" />
            </div>
            <div class="form-group">
              <label>Password Room</label>
              <Field type="password" name="password" class="form-control" placeholder="Password"
                v-model="room.password" />
              <ErrorMessage name="password" class="error-feedback" />
            </div>
            <div class="form-group">
              <label>Confirm Password</label>
              <Field type="password" name="confirm_password" class="form-control" placeholder="Password"
                v-model="room.confirm_password" />
              <ErrorMessage name="confirm_password" class="error-feedback" />
              <p v-if="message">{{ message.message }}</p>
            </div>
            <button class="btn btn-primary">Submit</button>
          </Form>
        </div>
        <div class="col-2"></div>
      </div>
    <!-- </div> -->
  <!-- </div> -->
</template>
  
<script>

import RoomService from "@/service/room.service";
// import { Socket } from "engine.io-client";
import RoomList from "../components/RoomList.vue";
import SocketIO from "socket.io-client"
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    RoomList
  },
  name: 'AddRoom',
  data() {
    const AddRoomFormSchema = yup.object().shape({
      room_name: yup
        .string()
        .required("Nickname phải có giá trị.")
        .min(2, "Nickname phải ít nhất 3 ký tự.")
        .max(50, "Nickname có nhiều nhất 50 ký tự."),
      password: yup
        .string()
        .required("Password phải có giá trị.")
        .min(8, "Password phải ít nhất 8 ký tự."),
      confirm_password: yup
        .string()
        .required("Confirm Password phải có giá trị.")
        .min(8, "Confirm Password phải ít nhất 8 ký tự."),
    });
    return {
      room: {},
      message: "",
      AddRoomFormSchema,
      socket: SocketIO('http://localhost:4000')
    }
  },
  methods: {
    onSubmit() {
      if (this.room.password == this.room.confirm_password) {
        RoomService.createroom({ room_name: this.room.room_name, password: this.room.password })
          .then(response => {
            this.socket.emit("add-room", response)
            this.message = { message: 'Thêm Phòng Thành Công' }
            this.$router.push({
              name: 'RoomList'
            })
          })
          .catch(e => {
            this.errors.push(e)
          })
      } else this.message = { message: 'Password Không Khớp' }
    }
  }
}
</script>