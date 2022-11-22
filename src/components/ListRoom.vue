<template>
    <div class="col room-list">
        <div v-for="(room, index) in rooms" 
            :key="room._id" 
            :class="{ active: index === activeIndex }">
            <router-link :to="{
                name: 'JoinRoom',
                params: { id: room._id, room_name: room.room_name },
            }" style=" text-decoration: none;">
                <button class="room row btn btn-light"
                    style=" border-radius: 10px;display: inline-flex; text-align:left ; width: 100%;">
                    <div class="col-xl-2 col-sm-4"><img src="/favicon.ico" style=" padding:10px; border-radius: 90px;">
                    </div>
                    <div class="col-xl-10 col-sm-8">
                        <b>
                            <p>{{ room.room_name }}</p>
                        </b>
                        <p style="font-size:13px ;">{{ room.created_date }}</p>

                    </div>
                </button>
            </router-link>
        </div>
        <!-- </div> -->
    </div>
</template>
<script>
export default {
    props: {
        rooms: { type: Array, default: [] },
        activeIndex: { type: Number, default: -1 },
    },
};
</script>
<style>
.room-list{
    height: 850px;
    overflow-y: auto;
}
.room{
    border-radius: 300px;
}
button.room:active{
    background: aqua;
}
</style>