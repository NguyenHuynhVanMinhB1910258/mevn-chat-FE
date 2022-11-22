<template>
    <div class='row'>
      <div class="col-2"></div>
      <div class="col" v-if="room">
        <h2>
          {{room.room_name}}
          <a href="/">(Room List)</a>
        </h2>
        <!-- <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Nickname">
            <b-form-input id="nickname" :state="state" v-model.trim="chat.nickname"></b-form-input>
          </b-form-group>
          <b-button type="submit" variant="primary">Join</b-button>
        </b-form> -->
        <!-- <form @submit="onSubmit">
          <div class="form-group"  id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Nickname">
              <input type="text" class="form-control" id="nickname" v-model.trim="chat.nickname">
          </div>
          <button type="submit" class="btn btn-primary" >Join</button>
          <button class="btn btn-danger" >Delete</button>
        </form> -->
        <form>
          <div class="form-group">
            <label >Nickname</label>
            <input type="text" class="form-control" 
            placeholder="Enter Nickname" v-model.trim="chat.nickname">
          </div>
          <div class="form-group">
            <label >Password Room</label>
            <input type="password" class="form-control" 
            placeholder="Password" v-model.trim="password">
          </div>
          <button class="btn btn-primary">Submit</button>
        </form>
      </div>
      <div class="col-2"></div>
    </div>
  </template>
    
  <script>
    // import * as io from 'socket.io-client'
    // import axios from 'axios'
    import RoomService from "@/service/room.service";
    // import VueSocketIO from 'vue-3-socket.io'
    import SocketIO from 'socket.io-client'
    // import ChatService from "@/services/chat.service";
    export default {
      name: 'JoinRoom',
      data () {
        return {
          chat: {},
          room: {},
          password: null,
          socket: SocketIO('http://localhost:4000')
        }
      },
      props:{
        id: {type: String, required: true }
      },
      methods: {
        async getroom(id){
            this.room = await RoomService.get(id)
        },
        async onSubmit (evt) {
          evt.preventDefault()
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
          // .catch(e => {
          // this.errors.push(e);
          // })
        }
      },
      created(){
        this.getroom(this.id)
      }
    }
    </script>