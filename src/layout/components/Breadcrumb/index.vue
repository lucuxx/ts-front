<template>
  <div id="tags-view-container" class="tags-view-container">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
      :is-disabled="sidebar.hide"
      v-show="!sidebar.hide"
    />
    <breadcrumb
      id="breadcrumb-container"
      class="breadcrumb-container"
      v-if="breadcrumb"
    />
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import { mapGetters } from "vuex";

export default {
  components: { Breadcrumb, Hamburger },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar"]),
    breadcrumb: {
      get() {
        return this.$store.state.settings.breadcrumb;
      },
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.hamburger-container {
  line-height: 34px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}

.breadcrumb-container {
  float: left;
}
</style>
