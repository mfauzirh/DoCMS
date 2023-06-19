<template>
  <div>
    <v-container>
      <v-tour 
        name="profileTour" 
        :steps="steps" 
        :options="{ highlight: true, enableScrolling: false }"
        :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd }"
      ></v-tour>
      <h1 class="text-containerh1 mb-3">Profile Settings</h1>
      <v-divider :thickness="4" class="border-opacity-100" color="white"></v-divider>
      <div style="relative">
        <v-row>
          <v-col cols="1" class="mt-8 ml-16" id="v-step-profile-0">
            <div>
              <label for="input-file">
                <div class="circle">
                  <img :src="this.user.profilePicture" id="image-preview" />
                  <div class="placeholder">Choose an image</div>
                </div>
              </label>
              <v-file-input 
                id="input-file" 
                name="image-profile"
                accept="image/*" 
                prepend-icon="mdi-camera" 
                class="camera-input"
                @change="getBase64()" 
              />
            </div>
          </v-col>
        </v-row>
      </div>
      <v-row id="v-step-profile-1">
        <v-col cols="4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-16'">
          <span>Full Name</span>
        </v-col>
        
        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 3" class="mt-1">
          <v-text-field 
          name="firstname"
          dark v-model="user.firstname" 
          :rules="rules.firstname" 
          outlined 
          required
          solo-inverted
          >
        </v-text-field>
        </v-col>
        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 3" class="mt-1">
          <v-text-field 
            name="lastname"
            dark 
            v-model="user.lastname" 
            :rules="rules.lastname" 
            outlined 
            required
            solo-inverted
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row id="v-step-profile-2">
        <v-col cols="4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-16'">
          <span>Username</span>
        </v-col>

        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6" class="mt-1">
          <v-text-field 
            name="username"
            dark 
            v-model="user.username" 
            :rules="rules.username" 
            outlined 
            required
            solo-inverted
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row id="v-step-profile-3">
        <v-col cols="4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-16'">
          <span>Email</span>
        </v-col>

        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6" class="mt-1">
          <v-text-field 
            name="email"
            dark 
            v-model="user.email" 
            :rules="rules.email" 
            outlined 
            required 
            solo-inverted
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row id="v-step-profile-4">
        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 4"  class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-16'">
          <span>Old Password</span>
        </v-col>

        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6" class="mt-1">
          <v-text-field 
            name="old-password"
            dark 
            v-model="oldPassword" 
            :rules="rules.password" 
            :append-icon="is ? 'mdi-eye' : 'mdi-eye-off'"
            :type="is ? 'text' : 'password'" 
            @click:append="is = !is" 
            outlined 
            required 
            solo-inverted
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row id="v-step-profile-5">
        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-16'">
          <span>New Password</span>
        </v-col>

        <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 6" class="mt-1">
          <v-text-field 
            name="new-password"
            dark 
            v-model="newPassword" 
            :rules="rules.password" 
            :append-icon="is ? 'mdi-eye' : 'mdi-eye-off'"
            :type="is ? 'text' : 'password'"
            @click:append="is = !is" 
            outlined 
            required 
            solo-inverted
          ></v-text-field>
        </v-col>
      </v-row>

      <v-divider :thickness="4" class="border-opacity-100 mt-8" color="white"></v-divider>

      <div class="d-flex justify-end">
        <v-btn 
          id="submit-button v-step-profile-6" 
          type="button" 
          class="mt-3 mr-6 colorbtn" 
          @click="save"
        >Save Changes</v-btn>
      </div>
    </v-container>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  components: {},
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      is: false,
      user: null,
      rules: {
        firstname: [
          (v) => !!v || "Firstname is required",
          (v) =>
            (v && v.length >= 4) || "Firstname must be 4 characters at least",
        ],
        lastname: [
          (v) => !!v || "Lastname is required",
          (v) =>
            (v && v.length >= 4) || "Lastname must be 4 characters at least",
        ],
        email: [
          (v) => !!v || "Email is required",
          (v) =>
            (v && v.length >= 4) || "Lastname must be 4 characters at least",
        ],
        logo: [(v) => !!v || "Logo is required"],
        githubLink: [(v) => !!v || "Github link is required"],
        username: [
          (v) => !!v || "Username is required",
          (v) =>
            (v && v.length >= 4) || "Username must be 4 characters at least",
        ],
        password: [
          (v) =>
            (v && v.length >= 4) ||
            v.length == 0 ||
            "Password must be 4 characters at least",
        ],
      },
      steps: [
        {
          target: '#v-step-profile-0',
          content: `<strong>Profile Image</strong><br>Change your profile image by click this button`,
          params: {
            placement: 'right',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-profile-1',
          content: `<strong>Full Name</strong><br>If you want to change firstname and lastname, you can adjust here`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-profile-2',
          content: `<strong>Username</strong><br>Set your username here, your username should be unique`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-profile-3',
          content: `<strong>Email</strong><br>Your email can be adjust here`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-profile-4',
          content: `<strong>Old Password</strong><br>If you want to change your password, first type your old password here`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-profile-5',
          content: `<strong>New Password</strong><br>Then type your new password here`,
          params: {
            placement: 'top'
          }
        },
        {
          target: '#v-step-profile-6',
          content: `<strong>Save Changes</strong><br>Don't forget to save your change by click this button`,
          params: {
            placement: 'top'
          }
        },
      ]
    };
  },
  methods: {
    getBase64() {
      const file = document.getElementById('input-file').files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        document.getElementById('image-preview').src = reader.result;
        this.user.profilePicture = reader.result;
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    },
    async syncUserData() {
      const response = await UserService.getUserById(this.user._id)
      const user = response.data[0]
      delete user.password

      this.user = user;
      localStorage.setItem('user', JSON.stringify(user))
    },
    async save() {
      let user = {
        id: this.user._id,
        email: this.user.email,
        firstname: this.user.firstname,
        lastname: this.user.lastname,
        username: this.user.username,
        profilePicture: this.user.profilePicture
      }
      
      if(this.oldPassword && this.newPassword) {
        user.oldPassword = this.oldPassword;
        user.newPassword = this.newPassword;
      }

      try {
        await UserService.updateProfile(user)
        await this.syncUserData()
        this.$root.SnackBar.show({ message: "Profile successfully updated", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to update profile, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    startTour() {
      if (!this.$vuetify.breakpoint.mobile) {
        const tour = JSON.parse(localStorage.getItem('tour'));
        const isTourHaveBeenDone = tour?.profile;
        if (!isTourHaveBeenDone) {
          this.$tours['profileTour'].start()
        }
      }
    },
    handleTourEnd() {
      let tour = JSON.parse(localStorage.getItem('tour'))
      tour.profile = true;
      tour = JSON.stringify(tour);
      localStorage.setItem('tour', tour)
    }
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
  },
  mounted(){
    this.startTour();
  }
};
</script>

<style>
.text-container {
  text-align: left;
  color: #ffffff;
}

.text-containerh1 {
  text-align: left;
  color: #939aff;
}

.bgc {
  color: #8b949e !important;
  background-color: #8b949e dark !important;
}

.colorbtn {
  background-color: #939aff !important;
  color: black;
}

.colorbtn1 {
  background-color: var(--primary-dark) !important;
  color: white !important;
}

.circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background-color: white;
}

.circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: #ccc;
  background-color: #f5f5f5;
}

#input-file {
  position: absolute;
  left: -99999px;
}

label[for="input-file"] {
  cursor: pointer;
}

.camera-input .v-icon.mdi.mdi-camera {
  margin-bottom: 60px;
  margin-left: 155px;
  background-color: #ff00d6;
  border-radius: 50px;
  padding: 8px;
}

.camera-input .v-input__slot {
  display: none !important;
}

.vue-editor--wrapper {
  background-color: white !important;
}

.vue-editor--wrapper:focus {
  background-color: white;
}
</style>
