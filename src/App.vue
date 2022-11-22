<template>
    <div class="row">
      <div class="col-xl-3 col-sm-5" style="width: 25%;  border-right: 1px solid #e5e7eb;">
        <RoomListVue></RoomListVue>
      </div>
      <div class="col-xl-9 col-sm-7">
        <router-view></router-view>
      </div>
    </div>   
</template>
<script>
import RoomListVue from './components/RoomList.vue';

export default{
  components: {
    RoomListVue,  
  },
}
</script>