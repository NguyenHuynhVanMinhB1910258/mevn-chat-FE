<template>
  <!-- Another variation with a button -->
  <div class="row">
    <div class="col-lg-10 col-md-8 col-sm-6 input-group">
      <input 
        type="text" 
        class="form-control" 
        placeholder="Search for rooms in this list..." 
        style="border-radius: 20px;"
        :value="modelValue" 
        @input="updateModelValue" 
        @keyup.enter="submit">
    </div>
    <router-link :to="{ name: 'AddRoom' }">
      <i class="col-lg-2 col-md-4 col-sm-6 fa fa-plus-circle" aria-hidden="true" type="button" style="padding: 10px;"></i>
    </router-link>
  </div>
</template>
<script>
export default {
    props: {
        modelValue: { type: String, default: "" },
    },
    emits: ["submit", "update:modelValue"],
    methods: {
        updateModelValue(e) {
            this.$emit("update:modelValue", e.target.value);
        },
        submit() {
            this.$emit("submit");
        },
    },
};
</script>