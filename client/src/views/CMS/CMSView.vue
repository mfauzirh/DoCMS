<template>
  <v-app>
    <div v-if="error">Error</div>

    <div v-if="documentation">
      <v-app-bar app dark class="cms-navbar">
        <v-app-bar-nav-icon
          @click.stop="drawer = !drawer"
          v-show="this.$vuetify.breakpoint.mobile"
        ></v-app-bar-nav-icon>

        <v-toolbar-title class="d-flex justify-center align-center px-0">
          <router-link to="/" target="_blank">
            <img :src="documentation.logo" class="logo mr-2" />
          </router-link>
        </v-toolbar-title>
        <div class="ml-auto mr-2 d-flex justify-center align-center">
          <a :href="documentation.githubLink" target="_blank"
            ><v-btn class="mr-6" color="var(--primary-dark)"
              ><v-icon class="mr-2">mdi-github</v-icon>Github</v-btn
            ></a
          >

          <v-menu
            dark
            class="avatar-menu"
            bottom
            min-width="200px"
            rounded
            offset-y
          >
            <template v-slot:activator="{ on }">
              <v-btn 
                id="avatar-dropdown"
                icon 
                x-large 
                v-on="on"
              >
                <v-avatar color="brown" size="48">
                  <img v-if="user.profilePicture" :src="user.profilePicture" alt="profilePicture">
                  <span v-else class="white--text text-h5">{{ user.initials }}</span>
                </v-avatar>
              </v-btn>
            </template>
            <v-card>
              <v-list-item-content class="justify-center">
                <div class="mx-auto text-center">
                  <v-avatar color="brown">
                    <img v-if="user.profilePicture" :src="user.profilePicture" alt="profilePicture">
                    <span v-else class="white--text text-h5">{{ user.initials }}</span>
                  </v-avatar>
                  <h3>{{ user.username }}</h3>
                  <p class="text-caption mt-1">
                    {{ user.email }}
                  </p>
                  <v-divider class="my-3"></v-divider>
                  <v-btn id="profile-button" depressed rounded text :to="{ name: 'cms.profile' }">
                    Edit Profile
                  </v-btn>
                  <v-divider class="my-3"></v-divider>
                  <v-btn id="logout-button" depressed rounded text @click="logout()">
                    Logout
                  </v-btn>
                </div>
              </v-list-item-content>
            </v-card>
          </v-menu>
        </div>
      </v-app-bar>

      <!-- Sidebar -->
      <v-navigation-drawer 
        :permanent="$vuetify.breakpoint.lgAndUp"
        v-model="drawer" 
        dark 
        fixed 
        class="side-bar fontstyle px-0 py-0"
      >
        <v-container class="nav-wrapper">
          <v-container class="nav-link">
            <v-container class="manage-section">
              <v-card-title class="font-weight-bold">Manage</v-card-title>
              <v-list nav dense>
                <v-list-item-group class="text-left">
                  <v-list-item
                    v-for="(menu, index) in menus"
                    v-bind:key="index"
                    :to="menu.ref"
                    :id="['v-step-' + index, 'menu-item-' + index].join(' ')"
                  >
                    <v-list-item-icon>
                      <v-icon
                        v-text="menu.icon"
                        color="var(--primary-purple)"
                      ></v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-left"
                        style="white-space: break-spaces"
                        v-text="menu.title"
                      ></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-container>

            <v-container class="other-section">
              <v-card-title class="font-weight-bold">Other</v-card-title>
              <v-list nav dense>
                <v-list-item-group class="text-left">
                  <v-list-item
                    @click="logout()"
                    style="align-self: flex-end"
                    id="v-step-5 menu-item-5"
                  >
                    <v-list-item-icon>
                      <v-icon color="var(--primary-purple)">mdi-logout</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title
                        class="text-left"
                        style="white-space: break-spaces"
                      >
                        <strong>Logout</strong>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-container>
          </v-container>
        </v-container>
      </v-navigation-drawer>

      <v-main
        class="cms-main"
        :class="{ 'cms-main-mobile': this.$vuetify.breakpoint.mobile }"
      >
        <router-view></router-view>
      </v-main>

      <v-footer
        v-html="documentation.footer"
        class="cms-footer text-center d-flex justify-center align-center mt-5"
        :class="{ 'cms-footer-mobile': this.$vuetify.breakpoint.mobile }"
        dark
      >
      </v-footer>
    </div>

    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center"
      style="width: 100%; height: 100%; z-index: position: absolute;"
    >
      <v-container>
        <img
          src="@/assets/docmslogo.png"
          alt="logo"
          height="400"
          class="mb-16"
        />
        <p class="linear-wipe">Loading your content...</p>
        <div class="animated-gradient progress-bar"></div>
      </v-container>
    </div>

    <v-tour
      name="myTour"
      :steps="steps"
      :options="{ highlight: true, enableScrolling: false }"
      :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd }"
    ></v-tour>
  </v-app>
</template>

<script>
import { storeToRefs } from "pinia";
import { useDocumentationStore } from "../../stores/DocumentationStore";
import AuthService from "../../services/AuthService";
import DocumentationService from "@/services/DocumentationService";

export default {
  data() {
    return {
      drawer: true,
      menus: [
        {
          title: "Metadata",
          ref: {
            name: "cms.metadata"
          },
          icon: "mdi-database",
        },
        {
          title: "Chapter",
          ref: {
            name: 'cms.chapter'
          },
          icon: "mdi-book",
        },
        {
          title: "Section",
          ref: {
            name: 'cms.section'
          },
          icon: "mdi-file-document",
        },
        {
          title: "Manage Content",
          ref: {
            name: 'cms.version'
          },
          icon: "mdi-folder",
        },
        {
          title: "Profile",
          ref: {
            name: 'cms.profile'
          },
          icon: "mdi-account-multiple",
        },
      ],
      user: null,
      steps: [
        {
          target: "#v-step-0",
          content: `<strong>Manage Metadata</strong><br>If you want to change the setting of content header and footer, you can make adjustments using the metadata menu`,
          params: {
            placement: "right",
          },
        },
        {
          target: "#v-step-1",
          content: `<strong>Manage Chapter</strong><br>If you want to manage “Chapters“, you can customize it using the chapters menu`,
          params: {
            placement: "right",
          },
        },
        {
          target: "#v-step-2",
          content: `<strong>Manage Section</strong><br>If you want to manage "Sections", you can customize it using the sections menu`,
          params: {
            placement: "right",
          },
        },
        {
          target: "#v-step-3",
          content: `<strong>Manage Content</strong><br>If you want to manage "Content" such as manage versions and manage structure, you can customize it using the manage content menu`,
          params: {
            placement: "right",
          },
        },
        {
          target: "#v-step-4",
          content: `<strong>Manage Content</strong><br>If you want to change your profile such as your fullname, username, and password`,
          params: {
            placement: "right",
          },
        },
        {
          target: "#v-step-5",
          content: `<strong>Logout</strong><br>Exit the application using this button`,
          params: {
            placement: "right",
          },
        },
      ],
    };
  },
  setup() {
    // Use documentation store and fetch the data from db
    const documentationStore = useDocumentationStore();
    documentationStore.fetchData();

    // Extract the required data and getters as refs
    const { documentation, loading, error } = storeToRefs(
      useDocumentationStore()
    );

    // Return the data so it's can be used in template
    return {
      documentation,
      loading,
      error,
    };
  },
  methods: {
    async getMetadata() {
      const response = await DocumentationService.getMetadata();
      document.title = "CMS - " + response.data.title;
      this.$router.push("/cms/metadata");
      this.startTour();
    },
    async logout() {
      try {
        await AuthService.logout();
        this.$router.push({
          name: "login",
          params: {
            message: "Logout success!",
            status: true,
            msgtype: "success",
          },
        });
      } catch (error) {
        this.$router.push({
          name: "error",
          params: { message: "Logout failed!", status: true, msgtype: "false" },
        });
      }
    },
    startTour() {
      if (!this.$vuetify.breakpoint.mobile) {
        const isTourHaveBeenDone = JSON.parse(
          localStorage.getItem("tour")
        )?.cms;
        if (!isTourHaveBeenDone) {
          this.$tours["myTour"].start();
        }
      }
    },
    handleTourEnd() {
      let tour = JSON.parse(localStorage.getItem("tour"));
      tour.cms = true;
      if(!tour?.metadata){
        if(this.$route.name == 'cms.metadata') {
          const isTourHaveBeenDone = tour?.metadata;
          if (!isTourHaveBeenDone) {
            this.$tours["metadataTour"].start();
          }
        } else {
          this.$router.push({ name: 'cms.metadata' })
        }
      }

      tour = JSON.stringify(tour);
      localStorage.setItem("tour", tour);
    },
  },
  created() {
    this.getMetadata();
    this.user = JSON.parse(localStorage.getItem("user"));
    this.user.initials = this.user.firstname[0] + this.user.lastname[0];
  },
};
</script>

<style scoped>
.linear-wipe {
  --bg-size: 400%;
  font-weight: bold;
  background: linear-gradient(
      90deg,
      var(--secondary-purple),
      var(--secondary-blue),
      var(--secondary-purple)
    )
    0 0 / var(--bg-size) 100%;
  color: transparent;
  background-clip: text;
}

@media (prefers-reduced-motion: no-preference) {
  .linear-wipe {
    animation: move-bg 8s linear infinite;
  }

  @keyframes move-bg {
    to {
      background-position: var(--bg-size) 0;
    }
  }
}

.progress-bar {
  width: 100%;
  height: 20px;
}

.animated-gradient {
  background: repeating-linear-gradient(
    to right,
    var(--secondary-purple) 0%,
    var(--secondary-blue) 50%,
    var(--secondary-purple) 100%
  );
  width: 100%;
  background-size: 200% auto;
  background-position: 0 100%;
  animation: gradient 2s infinite;
  animation-fill-mode: forwards;
  animation-timing-function: linear;
}

@keyframes gradient {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.cms-navbar {
  z-index: 99999 !important;
  background-color: var(--primary-blue-lighter) !important;
}

.side-bar {
  /* margin-top: 64px; */
  background-color: var(--primary-dark) !important;
}

.cms-main {
  margin-top: 86px;
  margin-left: 270px;
  padding-top: 0 !important;

  /* background: #212542;
    background: -moz-radial-gradient(top right, ellipse cover, #272c52 0%, var(--primary-dark) 57%);
    background: -webkit-gradient(radial, top right, 0px, top right, 100%, color-stop(0%,#272c52), color-stop(57%,var(--primary-dark)));
    background: -webkit-radial-gradient(top right, ellipse cover, #272c52 0%,var(--primary-dark) 57%);
    background: -o-radial-gradient(top right, ellipse cover, #272c52 0%,var(--primary-dark) 57%);
    background: -ms-radial-gradient(top right, ellipse cover, #272c52 0%,var(--primary-dark) 57%);
    background: radial-gradient(ellipse at top right, #272c52 0%,var(--primary-dark) 57%); */
  background-color: var(--primary-dark);
}

.cms-main-mobile {
  margin-left: 0;
  background-size: 100% auto;
}

.nav-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.side-bar .v-card__title {
  color: var(--primary-purple);
}

.logo {
  max-height: 60px;
}

.v-menu__content {
  margin-top: 8px;
}
.v-menu__content .v-list-item__content {
  margin-top: 6px;
  background-color: var(--primary-blue-lighter);
}

.container {
  margin: auto;
}

button {
  text-transform: none;
}

.cms-footer {
  background: #212542 !important;
  margin-left: 256px !important;
  padding-top: 16px !important;
  background-color: #16192d !important;
  border-top: 1px solid #282d4b !important;
  color: #94a3b8 !important;
}

.cms-footer-mobile {
  margin-left: 0 !important;
}
.v-tour__target--highlighted {
  box-shadow: 0 0 0 99999px rgba(0, 0, 0, 0.4);
}
</style>
