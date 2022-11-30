<style>
.chat-name {
  font-size: small;
}

.chat-message {
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 400px;
  background-color: aquamarine;
  margin-top: 4px;
  padding: 0px 10px;
  border-radius: 10px;
}

.chat .chat-body p {
  margin: 0;
  color: #777777;
}

.panel-body {
  overflow-y: auto;
  height: 850px;
}

.chat-form {
  margin: 20px auto;
  width: 80%;
}

.emoji-input {
  border-radius: 20px;
}
</style>
<template>
  <div class='row'>
    <div class="col-12" v-if="room">
      <div class="row" style="border: 1px solid #e5e7eb;">
        <div class="row col-11">
          <img src="/favicon.ico" style="padding: 10px; border-radius: 90px;">
          <h3 style="margin-top: 10px;" v-if="edit==0">
            {{ room.room_name }}
            <i class="fa-solid fa-pen-to-square" style="color: green;" type="button" @click="Edit"></i>
          </h3>   
          <form class="form-inline"  @submit="EditNameRoom" v-else>
            <input type="text" class="form-control" style="margin-top: 5px;" v-model="room.room_name">
            <i class="fa-solid fa-check" style="margin-left: 10px; color: green;" type="submit" @click="EditNameRoom" ></i>
          </form>
        </div>
        <div class="row col-1 justify-content-end"><i class="fa fa-times fa-2x" aria-hidden="true" @click="logout"
            type="button"></i></div>
      </div>

      <div class="panel-body">
        <div v-for="(item, index) in chats" :key="index">
          <div class="row" style="margin-left: 0px; margin-right: 0px;">
            <div class="col-5" v-if="item.nickname !== nickname">
              <div v-if="index > 0">
                <div class="chat-name" v-if="item.nickname !== chats[subIndex(index)].nickname">{{ item.nickname }}
                </div>
              </div>
              <div class="chat-name" v-else>{{ item.nickname }}</div>
              <div class="row justify-content-start chat-message" style="margin-left: 0px; width: max-content;">
                {{ item.message }}</div>
            </div>
          </div>
          <div class="row justify-content-end" style="margin-left: 0px; margin-right: 0px;"
            v-if="item.nickname === nickname">
            <div>
              <div v-if="index > 0">
                <div class="row justify-content-end chat-name" style="margin-left: 0px; margin-right: 0px;"
                  v-if="item.nickname !== chats[subIndex(index)].nickname">you</div>
              </div>
              <div class="row justify-content-end chat-name" style="margin-left: 0px; margin-right: 0px;" v-else>you
              </div>
              <div class="row justify-content-end chat-message" style="margin-left: 0px; margin-right: 0px;">
                {{ item.message }}</div>
            </div>
          </div>
        </div>
      </div>
      <ul v-if="errors && errors.length">
        <li v-for="error of errors">
          {{ error.message }}
        </li>
      </ul>
      <div class="row justify-content-end">
        <div class="col-lg-4 col-md-8">
          <VuemojiPicker v-if="isShoswn" @emojiClick="handleEmojiClick"
            style=" position: absolute; bottom: 0px; " />
        </div>
      </div>

      <form class="form-inline" style="margin-top: 10px;" @submit="onSubmit">
        <div class="input-group col-10">
          <input type="text " class="form-control" v-model.trim="chat.message" style="border-radius: 50px;">
          <!-- <EmojiPicker  class="col-12 emoji-input" picker-type="input" @keyup="message" @select="onSelectEmoji" /> -->
        </div>

        <i class=" fas fa-smile" style="color: rgb(0, 132, 255);" type="button" @click="isShoswn = !isShoswn"></i>
        <svg style="margin-left: 10px;" height="20px" viewBox="0 0 24 24" width="20px" type="button" @click="onSubmit">
          <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 
            3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 
            0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 
            L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 
            22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 
            21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 
            0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 
            C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 
            L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 
            17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 
            16.6915026,12.4744748 Z" fill="#0084ff">
          </path>
        </svg>
      </form>
    </div>
  </div>
</template>
  
<script>
import { ref } from 'vue'
import SocketIO from 'socket.io-client'
import RoomService from "@/service/room.service";
import "../../node_modules/vue3-emoji-picker/dist/style.css";
import RoomList from '../components/RoomList.vue';
import { VuemojiPicker } from "vuemoji-picker";
export default {
  components: {
    VuemojiPicker,
    RoomList
  },
  name: 'ChatRoom',
  data() {
    return {
      room: {},
      chats: [],
      errors: [],
      edit: 0,
      id: this.$route.params.id,
      nickname: this.$route.params.nickname,
      chat: {},
      socket: SocketIO('http://localhost:4000'),
      // container : document.querySelector(".panel-body")
    }
  },
  async created() {
    this.chat.message = ""
    this.room = await RoomService.get(this.id)
    await RoomService.getAllChat(this.id)
      .then(response => {
        this.chats = response
      })
      .catch(e => {
        this.errors.push(e)
      })
    this.socket.on('delete-chat', async function (data) {
      this.chats = await RoomService.getAllChat(this.id)
    }.bind(this))
    this.socket.on('new-name',function(data){
        console.log(data);
        this.room.room_name = data.message.room_name
        // document.querySelector(".panel-body").scrollTop = scrollHeight
    }.bind(this))
    this.socket.on('new-message', function (data) {
      if (data.message.room === this.$route.params.id) {
        this.chats.push(data.message)
        console.log(data.message)
        // document.querySelector(".panel-body").scrollTop = scrollHeight
      }
    }.bind(this))
    this.scrollToend();

  },
  setup() {
    const message = ref("");
    const isShoswn = ref(false);

    function onSelectEmoji(emoji) {
      console.log(emoji);
      message.value += emoji.i;
    }

    function showEmoji(emoji) {
      alert(`emoji ${emoji.i} selected, check console for details`);
      console.log(emoji);
    }

    return {
      message,
      onSelectEmoji,
      showEmoji,
      isShoswn,
    };
  },
  methods: {
    async EditNameRoom(evt){
      evt.preventDefault()
      await RoomService.update(this.id,this.room).then(response =>{
          this.socket.emit('edit-room',this.room);
          this.edit = 0;
      })
    },
    Edit(){
      this.edit = 1;
    },
    handleEmojiClick(e) {
      console.log(e);

      this.chat.message += e.unicode;
    },
    async onSubmit(evt) {
      evt.preventDefault()
      if (this.chat.message !== "") {
        this.chat.room = await this.$route.params.id
        this.chat.nickname = await this.$route.params.nickname
        await RoomService.createchat(this.chat)
          .then(response => {
            this.socket.emit('save-message', response);
            this.chat.message = "";
          })
      }
    },
    subIndex(key) {
      return key - 1;
    },
    async DeleteMessage(id) {
      await RoomService.deleteChat(id)
        .then(response => {
          this.socket.emit("delete-message", response)
        }).catch(e => {
          this.errors.push(e)
        })
    },
    scrollToend() {
      var objDiv = document.querySelector(".panel-body");
      var scrollHeigth = objDiv.scrollHeight;
      objDiv.scrollTop = scrollHeigth;
    },
    async logout() {
      this.chat.room = await this.$route.params.id
      this.chat.nickname = await this.$route.params.nickname
      this.chat.message = await this.nickname + ' left this room'
      await RoomService.createchat(this.chat)
        .then(response => {
          this.socket.emit('save-message', response);
          this.$router.push({
            name: 'Home'
          })
        }).catch(e => {
          this.errors.push(e)
        })
    },

  },
  updated() {
    this.scrollToend();
  }
  // components: {
  // VueEmoji
  // }

}
</script>
  
  