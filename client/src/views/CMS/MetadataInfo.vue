<template>
  <v-container>
    <v-tour 
      name="metadataTour" 
      :steps="steps" 
      :options="{ highlight: true, enableScrolling: false }" 
      :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd }"
    ></v-tour>
    <h1 class="text-containerh1 mb-3" id="v-step-metadata-0">
      Metadata Settings
    </h1>
    <v-divider :thickness="4" class="border-opacity-100" color="white" dark>
    </v-divider>
    <v-row id="v-step-metadata-1">
      <v-col cols="4" class="mt-15 ml-8 text-container">
        <span>Logo Picture</span>
      </v-col>
      <v-col cols="1" class="mt-8">
        <div>
          <label for="input-file">
            <div class="circle">
              <img :src="metadata.logo" />
              <div class="placeholder">
                Choose an image
              </div>
            </div>
          </label>
          <v-file-input id="input-file" accept="image/*" prepend-icon="mdi-camera" class="camera-input"
            @change="getBase64()" />
        </div>
      </v-col>
    </v-row>
    <v-row id="v-step-metadata-2">
      <v-col cols="4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-8'">
        <span>Title</span>
      </v-col>

      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 7" class="mt-1">
        <v-text-field id="input-title" v-model="metadata.title" :rules="rules.title" dark outlined required solo-inverted>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row id="v-step-metadata-3">
      <v-col cols="4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-8'">
        <span>Github Link</span>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 7" class="mt-1">
        <v-text-field id="input-github-link" v-model="metadata.githubLink" :rules="rules.githubLink" dark outlined
          required solo-inverted>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row id="v-step-metadata-4">
      <v-col dark cols="4" class="mt-4 text-container" :class="$vuetify.breakpoint.mobile ? 'ml-0' : 'ml-8'">
        <span dark solo-inverted>
          Footer
        </span>
      </v-col>
      <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 7" class="mb-12" solo-inverted>
        <vue-editor id="input-footer" v-model="metadata.footer"></vue-editor>
      </v-col>
    </v-row>
    <v-divider :thickness="4" class="border-opacity-100 mt-8" color="white" dark></v-divider>
    <div class="d-flex justify-end">
      <div id="v-step-metadata-5">
        <v-btn id="form-submit" type="button" class="mt-3 mr-6 colorbtn" @click="updateMetadata">
          Save Changes
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import { VueEditor } from "vue2-editor";
import DocumentationService from "@/services/DocumentationService";

export default {
  components: {
    VueEditor
  },
  data() {
    return {
      metadata: {
        title: "",
        logo: null,
        footer: "",
        githubLink: "",
      },
      rules: {
        title: [
          v => !!v || "Title is required",
          v => (v && v.length >= 4) || "Title must be 4 characters at least"
        ],
        logo: [
          v => !!v || "Logo is required"
        ],
        githubLink: [
          v => !!v || "Github link is required"
        ],
        username: [
          v => !!v || "Username is required",
          v => (v && v.length >= 4) || "Username must be 4 characters at least"
        ]
      },
      steps: [
        {
          target: '#v-step-metadata-0',
          content: `<strong>Manage Metadata</strong><br>If you want to change your documentation setting, this is the place`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-metadata-1',
          content: `<strong>Logo</strong><br>Change your logo in your navbar here`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-metadata-2',
          content: `<strong>Title</strong><br>Change your website title here`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-metadata-3',
          content: `<strong>Github Link</strong><br>If you want to add additional link to your github, place here`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-metadata-4',
          content: `<strong>Footer</strong><br>Customize your website footer here`,
          params: {
            placement: 'bottom'
          }
        },
        {
          target: '#v-step-metadata-5',
          content: `<strong>Save Changes</strong><br>Don't forget to save your change by click this button`,
        },
      ]
    }
  },
  methods: {
    getBase64() {
      const base64 = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(this.metadata.logo);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      })
      base64
        .then(res => {
          this.metadata.logo = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    async updateMetadata() {
      const metadata = this.metadata;
      try {
        const response = await DocumentationService.updateMetadata(metadata);
        this.$root.SnackBar.show({ message: response.data.message, color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: error.message, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async getMetadata() {
      try {
        const response = await DocumentationService.getMetadata()
        this.metadata = response.data
        this.startTour()
      } catch (error) {
        this.$root.SnackBar.show({ message: "Failed to fetch metadata", color: 'error', icon: 'mdi-close-circle' })
      }
    },
    startTour(){
      if(!this.$vuetify.breakpoint.mobile){
        const tour = JSON.parse(localStorage.getItem('tour'));
        const isCmsTourHaveBeenDone = tour?.cms;
        const isTourHaveBeenDone = tour?.metadata;
        if(isCmsTourHaveBeenDone && !isTourHaveBeenDone) {
          this.$tours['metadataTour'].start()
        }
      }
    },
    handleTourEnd(){
      let tour = JSON.parse(localStorage.getItem('tour'))
      tour.metadata = true;
      tour = JSON.stringify(tour);
      localStorage.setItem('tour', tour)
    }
  },
  created() {
    this.getMetadata()
  }
}
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
  color: #8B949E !important;
  background-color: #8B949E dark !important;
}

.colorbtn {
  background-color: #939AFF !important;
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
  background-color: #FF00D6;
  border-radius: 50px;
  padding: 8px;
}

.vue-editor--wrapper {
  background-color: white !important;
}

.vue-editor--wrapper:focus {
  background-color: white;
}

.v-tour__target--highlighted {
  box-shadow: 0 0 0 99999px rgba(0,0,0,.4) !important;
}
</style>
