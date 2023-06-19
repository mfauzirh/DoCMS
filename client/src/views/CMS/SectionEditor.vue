<template>
  <v-form @submit.prevent="saveData()">
    <v-container>
      <v-tour 
        name="editorTour" 
        :steps="steps" 
        :options="{ highlight: true, enableScrolling: false }"
        :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd }"
      ></v-tour>
      <h1 id="v-step-editor-0" style="color: var(--primary-purple); text-align: left; margin-bottom: 10px;">Section Editor</h1>
      <hr style="margin-bottom: 40px;">
      <div id="v-step-editor-1" style="color: white; width: 300px;" v-if="create">
        <label for="select-section" style="text-align: left; display: block;">Load Section</label>
        <v-select
          id="select-section"
          class="section-editor-input"
          v-model="selectedSection"
          :items="sections"
          :item-text="section => `${section.title} ${section.alias ? '- ' + section.alias : ''}`"
          :item-value="section => section._id"
          placeholder="Select Section"
          @change="loadSection()"
          dark
          >
        </v-select>
      </div>
      <div id="v-step-editor-2" style="color: white; width: 300px;">
        <label for="input-title" style="text-align: left; display: block;">Input Section Title <span style="color:red">*</span></label>
        <v-text-field
          id="input-title"
          class="section-editor-input"
          v-model="title"
          placeholder="Input Title"
          required
          dark
        ></v-text-field>
      </div>
      <div id="v-step-editor-3" style="color: white; width: 300px;">
        <label for="input-alias" style="text-align: left; display: block;">Input Section Alias (Opsional)</label>
        <v-text-field
          id="input-alias"
          class="section-editor-input"
          v-model="alias"
          placeholder="Input Alias"
          dark
        ></v-text-field>
      </div>
    
      <div id="v-step-editor-4">
        <div class="" style="background-color: white; padding: 10px;">
          <p style="margin-bottom: 0; text-align: left; font-weight: bold;"><v-icon class="mr-2">mdi-eye</v-icon>Section Preview</p>
        </div>
        <div class="mb-8 ql-editor" style="background-color: #37404D; color: white; border: 1px solid white;" v-html="content"></div>
      </div>
      <vue-editor id="v-step-editor-5" v-model="content"></vue-editor>
      <div class="d-flex justify-end mt-4">
        <v-btn id="v-step-editor-6" class="mt-1 blue darken-4 white--text" type="submit" v-text="this.create ? 'Create' : 'Save' "></v-btn>
      </div>
    </v-container>
  </v-form>
</template>

<script>
import SectionService from "@/services/SectionService";
import { VueEditor } from "vue2-editor";
export default {
  components: {
    VueEditor
  },
  data(){
    return {
      snackbar: { 
        isShow: false, 
        text: '', 
        type: '', 
        timeout: 2000 
      },
      content : "",
      alias : "",
      title : "",
      create: true,
      sections : [],
      selectedSection : "",
      steps: [
        {
          target: '#v-step-editor-0',
          content: `<strong>Section Editor</strong><br>Here where you can create content for your section`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-editor-1',
          content: `<strong>Load Section</strong><br>If you want to copy content from previous section, you can select it from here`,
          params: {
            placement: 'right',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-editor-2',
          content: `<strong>Section Title</strong><br>Input the title of your section here`,
          params: {
            placement: 'right',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-editor-3',
          content: `<strong>Section Alias</strong><br>If you want your section have an alias, you can input it in this form`,
          params: {
            placement: 'right',
          }
        },
        {
          target: '#v-step-editor-4',
          content: `<strong>Section Preview</strong><br>You can preview how your content look in the portal in here`,
          params: {
            placement: 'top',
          }
        },
        {
          target: '#v-step-editor-5',
          content: `<strong>Editor</strong><br>Here where you want to type any content you will have in the section`,
          params: {
            placement: 'top',
          }
        },
        {
          target: '#v-step-editor-6',
          content: `<strong>Submit</strong><br>After you done change, don't forget to click this button to save it`,
          params: {
            placement: 'top',
          }
        },
      ]
    }
  },
  methods: {
    async createSection(section){
      try {
        await SectionService.createSection(section)
        this.$router.push({name: "cms.section", params: {message: "Section created!", status: true}})
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to create section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async updateSection(section) {
      section.id = this.$route.params.id
      try {
        await SectionService.updateSection(section);
        this.$router.push({name: "cms.section", params: {message: "Section updated!", status: true}})
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to update section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    saveData(){
      let section = {
        title: this.title,
        content: this.content
      }

      if(this.alias.length != 0) {
        section.alias = this.alias;
      }

      // Check if submission valid
      if(this.title == "" || this.content == ""){
        this.$root.SnackBar.show({ message: "Error : Please Input Title and Content", color: 'error', icon: 'mdi-close-circle' })
        return;
      }
      
      if(this.$route.params.id == "create"){
        this.createSection(section)
      }
      else{
        this.updateSection(section)
      }
    },
    async fetchSections() {
      try {
        const response = await SectionService.getAllSections();
        this.sections = response.data
        this.startTour()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to fetch section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async loadEditedSection() {
      try {
        const response = await SectionService.getSectionById(this.$route.params.id)
        this.content = response.data[0].content
        this.title = response.data[0].title
        this.alias = response.data[0]?.alias ? response.data[0].alias : ''
        this.create = false
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to load edited section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    }, 
    async loadSection(){
      try {
        const response = await SectionService.getSectionById(this.selectedSection);
        this.title = response.data[0].title
        this.content = response.data[0].content
        this.alias = response.data[0]?.alias ? response.data[0].alias : ''
      } catch (error) {
        this.selectedSection = ""
        this.title = ""
        this.alias = ""
        this.content = ""
        this.$root.SnackBar.show({ message: `Failed to load section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    startTour(){
      if(!this.$vuetify.breakpoint.mobile){
        const tour = JSON.parse(localStorage.getItem('tour'));
        const isTourHaveBeenDone = tour?.editor;
        if(!isTourHaveBeenDone) {
          this.$tours['editorTour'].start()
        }
      }
    },
    handleTourEnd(){
      let tour = JSON.parse(localStorage.getItem('tour'))
      tour.editor = true;
      tour = JSON.stringify(tour);
      localStorage.setItem('tour', tour)
    }
  },
  created(){
    // Check if action is edit or not (if not then create)
    if(this.$route.params.id != "create"){
      this.loadEditedSection();
    }
    else{
      this.fetchSections();
    }
  }
}
</script>

<style>
.section-editor-input .v-select__slot {
  background-color: #37404D !important;
  padding: 5px 10px;
}
.section-editor-input .v-text-field__slot {
  background-color: #37404D !important;
  padding: 5px 10px;
}
</style>