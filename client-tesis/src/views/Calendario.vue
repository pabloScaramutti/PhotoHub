<template>
  <div>
    <v-date-picker
      class="calendario"
      v-model="date2"
      :event-color="(date) => (date[9] % 2 ? 'red' : 'yellow')"
      :events="functionEvents"
      :full-width="true"
      locale="es"
    ></v-date-picker>
  </div>
</template>

<script>
export default {
  data: () => ({
    arrayEvents: null,
    date1: new Date().toISOString().substr(0, 10),
    date2: new Date().toISOString().substr(0, 10),
  }),

  mounted() {
    this.arrayEvents = [...Array(6)].map(() => {
      const day = Math.floor(Math.random() * 30);
      const d = new Date();
      d.setDate(day);
      return d.toISOString().substr(0, 10);
    });
  },

  methods: {
    functionEvents(date) {
      const [, , day] = date.split("-");
      if ([12, 17, 28].includes(parseInt(day, 10))) return true;
      if ([1, 19, 22].includes(parseInt(day, 10))) return ["red", "#00f"];
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
.calendario {
  width: 100%;
  height: 100%;
}
</style>