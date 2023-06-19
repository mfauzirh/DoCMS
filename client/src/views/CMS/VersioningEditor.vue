<template>
  <v-container>
    <v-tour 
      name="manageTour" 
      :steps="steps" 
      :options="{ highlight: true, enableScrolling: false }"
      :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd, onNextStep: handleNextStep }"
    ></v-tour>
    <v-card dark color="#2D3748">
      <v-tabs v-model="tab" background-color="transparent" grow height="60">
        <v-tab id="v-step-manage-0">
          Manage Version
        </v-tab>
        <v-tab id="v-step-manage-3">
          Manage Structure
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab" dark>
        <v-tab-item>
          <v-card color="#3A4052" id="v-step-manage-1">
            <v-card-text style="overflow: auto;">
              <v-list color="#3A4052">
                <v-list-item>
                  <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div style="min-width: 200px; text-align: left;">
                      <strong>Version Name</strong>
                    </div>
                    <div style="min-width: 250px; display: flex; justify-content: start;">
                      <strong>Action</strong>
                    </div>
                  </div>
                </v-list-item>
                <v-list-item v-for="(ct, i) in content" :key="i" style="margin: 20px 0;">
                  <div style="display: flex; justify-content: space-between; width: 100%;">
                    <div style="min-width: 200px; text-align: left;">
                      {{ ct.version }}
                    </div>
                    <div style="min-width: 250px; display: flex; justify-content: start;">
                      <v-btn class="edit-btn tonal mr-2" color="warning"
                        @click="() => { editedVersion = ct.version; newVersionName = ct.version; editDialog = true }" rounded>
                        <v-icon class="mr-2">mdi-pencil</v-icon>
                        Edit
                      </v-btn>
                      <v-btn class="delete-btn tonal" color="error" @click="deleteVersion(ct)" rounded>
                        <v-icon class="mr-2">mdi-delete</v-icon>
                        Delete
                      </v-btn>
                    </div>
                  </div>
                </v-list-item>
              </v-list>
            </v-card-text>
            <v-card-actions style="background-color: #2D3748; padding: 16px 16px; ">
              <v-btn text @click="() => { createDialog = true }" style="text-transform:none;" id="v-step-manage-2">
                <v-icon style="color: var(--primary-purple); font-size: 20px;">mdi-plus</v-icon>
                <strong style="color: var(--primary-purple); letter-spacing: normal;">Create Version</strong>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card color="#3A4052" style="border-radius: 0;" dark>
            <v-card-text style="overflow: auto;">
              <!-- Reorder Content -->
            <v-row class="d-flex px-5 mt-5">
              <v-col cols="9">
                <v-select 
                  id="v-step-manage-4"
                  v-model="selectedVersion" 
                  :items="content" 
                  item-text="version" 
                  outlined 
                  return-object
                  @change="() => { updateSection(); updateChapter() }"></v-select
                >
              </v-col>
              <v-col cols="3" class="d-flex justify-start">
                <v-btn @click="reorder()" color="var(--primary-purple)" class="mt-1" block large id="v-step-manage-5">
                  Reorder Content
                </v-btn>
              </v-col>
            </v-row>

            <!-- List Chapter & Section -->
            <v-list color="#3A4052" id="v-step-manage-6">
              <!-- List Chapter -->
              <div v-for="(chapter, i) in selectedVersion.chapter" :key="i">
                <v-row>
                  <v-col cols="8">
                    <v-list-group :value="false">
                      <template v-slot:activator>
                        <v-list-item-title class="text-left" v-text="chapter.title"></v-list-item-title>
                      </template>

                      <!-- List Section -->
                      <v-list-item v-for="(section, j) in chapter.section" :key="j">
                        <v-list-item-title class="text-left"
                          v-text="`${section.title} ${section.alias ? '- ' + section.alias : ''}`"></v-list-item-title>
                        <!-- Remove Section -->
                        <v-tooltip top color="#2D3748">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn 
                              v-bind="attrs" 
                              v-on="on" 
                              class="mr-2" 
                              small 
                              outlined
                              fab 
                              @click="removeSection(section)"
                            >
                              <v-icon>mdi-close</v-icon>
                            </v-btn>
                          </template>
                          <span>Remove Section</span>
                        </v-tooltip>
                        <!-- Move Up Section -->
                        <v-tooltip top color="#2D3748">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn 
                              v-bind="attrs" 
                              v-on="on" 
                              class="mr-2" 
                              small 
                              outlined 
                              fab 
                              :disabled="j == 0" 
                              @click="moveUpSection(i, j)"
                            >
                              <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                          </template>
                          <span>Move Up Section</span>
                        </v-tooltip>
                        <!-- Move Down Section -->
                        <v-tooltip top color="#2D3748">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn 
                              v-bind="attrs" 
                              v-on="on" 
                              small 
                              outlined 
                              fab 
                              :disabled="j == chapter.section.length - 1"
                              @click="moveDownSection(i, j)"
                            >
                              <v-icon>mdi-arrow-down</v-icon>
                            </v-btn>
                          </template>
                          <span>Move Down Section</span>
                        </v-tooltip>
                      </v-list-item>
                    </v-list-group>
                  </v-col>

                  <!-- Add/Remove Button -->
                  <v-col cols="2" class="my-auto">
                    <!-- Add Section -->
                    <v-tooltip top color="#2D3748">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                          v-bind="attrs" 
                          v-on="on" 
                          class="mr-2" 
                          small 
                          outlined 
                          fab 
                          @click="() => { dialog = true; sectionChapter = chapter }"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Add section</span>
                    </v-tooltip>
                    
                    <!-- Remove Chapter -->
                    <v-tooltip top color="#2D3748">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                          v-bind="attrs" 
                          v-on="on" 
                          small 
                          outlined 
                          fab 
                          @click="removeChapter(chapter)"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <span>Remove Chapter</span>
                    </v-tooltip>
                  </v-col>

                  <!-- Move Up/Down Chapter -->
                  <v-col cols="2" class="my-auto">
                    <!-- Move Up Chapter -->
                    <v-tooltip top color="#2D3748">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                          v-bind="attrs" 
                          v-on="on" 
                          class="mr-2" 
                          small 
                          outlined 
                          fab 
                          :disabled="i == 0" 
                          @click="moveUpChapter(i)">
                          <v-icon>mdi-arrow-up</v-icon>
                        </v-btn>
                      </template>
                      <span>Move Up Chapter</span>
                    </v-tooltip>
                    
                    <!-- Move Down Chapter -->
                    <v-tooltip top color="#2D3748">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn 
                          v-bind="attrs" 
                          v-on="on" 
                          small 
                          outlined 
                          fab 
                          :disabled="i == selectedVersion.chapter.length - 1"
                          @click="moveDownChapter(i)"
                        >
                          <v-icon>mdi-arrow-down</v-icon>
                        </v-btn>
                      </template>
                      <span>Move Down Chapter</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>
            </v-list>
            </v-card-text>
            <v-card-actions style="background-color: #2D3748; padding: 16px 16px; ">
              <v-btn text @click="() => { chapterDialog = true }" style="text-transform:none;" id="v-step-manage-7">
                <v-icon style="color: var(--primary-purple); font-size: 20px;">mdi-plus</v-icon>
                <strong style="color: var(--primary-purple);">Add Chapter</strong>
              </v-btn>
            </v-card-actions>
            <!-- Add Chapter -->
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <!-- Add Section Dialog -->
    <v-dialog v-model="dialog" width="800" transition="dialog-bottom-transition" scrollable persistent>
      <v-card dark color="var(--primary-dark)">
        <v-toolbar class="font-weight-bold" dark color="var(--primary-blue-lighter)">
          Add Section Into Chapter
        </v-toolbar>

        <v-card-text style="max-height: 500px; padding:0;">
          <!-- List of section in checkboxes -->
          <v-list color="var(--primary-dark)" dark>
            <v-list-item v-for="(section, index) in sections" :key="index">
              <v-checkbox v-model="selectedSections" :value="section" multiple />
              {{ `${section.title} ${section.alias ? '- ' + section.alias : ''}` }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--primary-dark)" @click="() => { dialog = false }">
            Cancel
          </v-btn>

          <v-btn color="var(--primary-blue-lighter)" @click="addSection()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Chapter Dialog -->
    <v-dialog v-model="chapterDialog" width="800" transition="dialog-bottom-transition" scrollable persistent>
      <v-card color="var(--primary-dark)">
        <v-toolbar class="font-weight-bold" dark color="var(--primary-blue-lighter)">
          Add Chapter into Version
        </v-toolbar>

        <v-card-text style="max-height: 500px; padding:0;">
          <v-list color="var(--primary-dark)" dark>
            <v-list-item v-for="(chapter, index) in chapters" :key="index">
              <v-checkbox v-model="selectedChapters" :value="chapter" multiple />
              {{ chapter.title }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--primary-dark)" @click="() => { chapterDialog = false }" dark>
            Cancel
          </v-btn>

          <v-btn color="var(--primary-blue-lighter)" @click="addChapter" dark>
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Version Dialog -->
    <v-dialog v-model="createDialog" width="600" transition="dialog-bottom-transition" persistent>
      <v-form v-model="createFormValid">
        <v-card dark color="var(--primary-dark)">
          <v-toolbar color="var(--primary-blue-lighter)" class="text-h5 font-weight-medium d-flex justify-center">
            Create New Version
          </v-toolbar>

          <v-card-text style="max-height: 500px; padding:0;" class="mt-7 tb-2">
            <v-text-field v-model="versionName" label="Version Name" :rules="[rules.required]" class="pl-5 pr-5"
              outlined></v-text-field>
          </v-card-text>
          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="var(--primary-dark)" @click="() => { createDialog = false; versionName = '' }">
              Cancel
            </v-btn>

            <v-btn color="var(--primary-blue-lighter)" :disabled="!createFormValid" @click="createVersion">
              Create
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Edit Version Dialog -->
    <v-dialog v-model="editDialog" width="600" transition="dialog-bottom-transition" persistent>
      <v-form v-model="editFormValid">
        <v-card dark color="var(--primary-dark)">
          <v-toolbar color="var(--primary-blue-lighter)">
            Edit Version
          </v-toolbar>

          <v-card-text class="mt-5">
            <!-- <v-select v-model="editedVersion" :items="content" :rules="[rules.required]" label="Choose Version"
              item-text="version" outlined return-object></v-select> -->
            <v-text-field v-model="newVersionName" label="New Version Name" :rules="[rules.required]"
              outlined></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="var(--primary-dark)"
              @click="() => { editDialog = false; editedVersion = ''; newVersionName = '' }">
              Cancel
            </v-btn>

            <v-btn color="var(--primary-blue-lighter)" @click="editVersion()" :disabled="!editFormValid">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import ChapterService from '@/services/ChapterService';
import DocumentationService from '@/services/DocumentationService';
import SectionService from '@/services/SectionService';
import VersioningService from '@/services/VersioningService';

export default {
  data() {
    return {
      tab: null,
      items: ['Manage Version', "Manage Structure"],

      dialog: false,
      chapterDialog: false,
      createDialog: false,
      editDialog: false,

      createFormValid: false,
      editFormValid: false,

      editedVersion: '',
      newVersionName: '',

      deletedVersion: '',

      versionName: '',

      content: [],

      sections: [],
      selectedSections: [],
      sectionChapter: '',

      chapters: [],
      selectedChapters: [],

      selectedVersion: {},

      rules: {
        required: value => !!value || 'Required.',
      },
      
      steps: [
        {
          target: '#v-step-manage-0',
          content: `<strong>Manage Version</strong><br>Manage versions serves to create, modify, and delete versions of documentation`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-1',
          content: `<strong>Version List</strong><br>Here where your version listed<br>Delete or edit your version here`,
          params: {
            placement: 'left',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-2',
          content: `<strong>Create Version</strong><br>If you want to create new version, click this button`,
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-3',
          content: `<strong>Manage Structure</strong><br>Manage Structure serves to create, modify, and delete structures on the created documentation version`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-4',
          content: `<strong>Select Version</strong><br>First select version you want to see the structure, by default it's your first version`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-5',
          content: `<strong>Reorder Content</strong><br>If you finished restructuring your content, press this button to save it`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-6',
          content: `<strong>Content Structure</strong><br>You can see the structure of your content in selected version, you can change the content or the order of the content`,
          params: {
            placement: 'left',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-manage-7',
          content: `<strong>Add Chapter</strong><br>If you want to add new chapter into your selected version, click this buttons`,
          params: {
            placement: 'top',
            enableScrolling: false
          }
        },
      ]
    }
  },
  methods: {
    startTour(){
      if(!this.$vuetify.breakpoint.mobile){
        const tour = JSON.parse(localStorage.getItem('tour'));
        const isTourHaveBeenDone = tour?.manage;
        if(!isTourHaveBeenDone) {
          this.$tours['manageTour'].start()
        }
      }
    },
    handleTourEnd(){
      let tour = JSON.parse(localStorage.getItem('tour'))
      tour.manage = true;
      tour = JSON.stringify(tour);
      localStorage.setItem('tour', tour)
    },
    handleNextStep(currentStep){
      if(currentStep === 2) {
        this.tab = 1;
      }
    },
    async createVersion() {
      // Validate forms
      if (!this.createFormValid) {
        this.$root.SnackBar.show({ message: 'Failed to create a version, please fill in the version name first', color: 'error', icon: 'mdi-close-circle' })
        return
      }

      const versionName = this.versionName;

      try {
        await VersioningService.createVersion({ versionName })
        this.$root.SnackBar.show({ message: "Section successfully created", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to create a version, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.versionName = ''
      this.createDialog = false
      this.updateDocumentationContent()
    },
    async editVersion() {
      // Validate Forms
      if (!this.editFormValid) {
        this.$root.SnackBar.show({ message: 'Failed to edit version, please fill all available form input', color: 'error', icon: 'mdi-close-circle' })
        return
      }

      const editedVersion = this.editedVersion;
      const newVersionName = this.newVersionName;

      try {
        await VersioningService.editVersion({ editedVersion, newVersionName })
        this.$root.SnackBar.show({ message: "Version successfully edited", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to edit a version, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.editedVersion = ''
      this.newVersionName = ''
      this.editDialog = false
      this.updateDocumentationContent()
    },
    async deleteVersion(version) {
      const content = [version]

      try {
        await VersioningService.deleteVersion({ content })
        this.$root.SnackBar.show({ message: "Version successfully deleted", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to delete version, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.updateDocumentationContent()
    },
    findVersionIndex() {
      // Get index of version from current selected version
      const versionIdx = this.content.findIndex(object => {
        return object.version === this.selectedVersion.version;
      })

      return versionIdx
    },
    async addSection() {
      const version = this.selectedVersion.version;
      const chapter = this.sectionChapter._id
      const sections = this.selectedSections
        .map(section => (!section?.alias) ?
          ({ _id: section._id, title: section.title }) :
          ({ _id: section._id, title: section.title, alias: section.alias })
        )

      try {
        await VersioningService.addSection({ sections, chapter, version })
        this.$root.SnackBar.show({ message: "Section successfully added", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to add section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.dialog = false;
      this.selectedSections = []
      this.updateDocumentationContent()
    },
    async removeSection(section) {
      const version = this.selectedVersion.version;
      const sectionId = section._id;

      try {
        await VersioningService.removeSection({ sectionId, version })
        this.$root.SnackBar.show({ message: "Section successfully removed", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to remove section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.updateDocumentationContent();
    },
    async addChapter() {
      const version = this.selectedVersion.version;
      const chapters = this.selectedChapters
        .map(ch => ({ _id: ch._id, title: ch.title }))

      try {
        await VersioningService.addChapter({ chapters, version })
        this.$root.SnackBar.show({ message: "Chapter successfully added", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to add chapter, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.chapterDialog = false;
      this.selectedChapters = []
      this.updateDocumentationContent()
    },
    async removeChapter(chapter) {
      const version = this.selectedVersion.version;
      const chapterId = chapter._id
      const sectionsId = (chapter?.section) ? chapter?.section.map(sc => sc._id) : []

      try {
        await VersioningService.removeChapter({ chapterId, sectionsId, version })
        this.$root.SnackBar.show({ message: "Chapter successfully removed", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to remove chapter, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.updateDocumentationContent()
    },
    async reorder() {
      const content = this.content

      try {
        await VersioningService.reorderContent({ content });
        this.$root.SnackBar.show({ message: "Content successfully reordered", color: 'success', icon: 'mdi-check-circle' })
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to reorder content structure, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    moveUpChapter(index) {
      let versionIdx = this.findVersionIndex()
      let prevChapter = this.content[versionIdx].chapter[index - 1]
      let crntChapter = this.content[versionIdx].chapter[index]

      this.content[versionIdx].chapter.splice(index - 1, 2, crntChapter, prevChapter)
    },
    moveDownChapter(index) {
      let versionIdx = this.findVersionIndex()
      let crntChapter = this.content[versionIdx].chapter[index]
      let nextChapter = this.content[versionIdx].chapter[index + 1]

      this.content[versionIdx].chapter.splice(index, 2, nextChapter, crntChapter)
    },
    moveUpSection(chapterIdx, sectionIdx) {
      let versionIdx = this.findVersionIndex()
      let prevSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx - 1]
      let crntSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx]

      this.content[versionIdx].chapter[chapterIdx].section.splice(sectionIdx - 1, 2, crntSection, prevSection)
    },
    moveDownSection(chapterIdx, sectionIdx) {
      let versionIdx = this.findVersionIndex()
      let crntSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx]
      let nextSection = this.content[versionIdx].chapter[chapterIdx].section[sectionIdx + 1]

      this.content[versionIdx].chapter[chapterIdx].section.splice(sectionIdx, 2, nextSection, crntSection)
    },
    async updateSection() {
      try {
        const response = await SectionService.getAllSections()
        this.sections = (!response) ? response : response.data.filter(section => !section?.version?.includes(this.selectedVersion.version))
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to fetch section, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async updateChapter() {
      try {
        const response = await ChapterService.getAllChapters()
        this.chapters = response.data.filter(chapter => !chapter.version.includes(this.selectedVersion.version))
      } catch (error) {
        console.log(error.message)
        this.$root.SnackBar.show({ message: `Failed to fetch chapter, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async updateDocumentationContent() {
      try {
        const response = await DocumentationService.getDocumentations()
        this.content = response.data[0].content
        const versionIdx = this.findVersionIndex()
        this.selectedVersion = response.data[0].content[versionIdx] ?? response.data[0].content[0]
        this.updateSection()
        this.updateChapter()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to fetch documentation, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    }
  },
  created() {
    (async () => {
      try {
        const response = await DocumentationService.getDocumentations()
        this.content = response.data[0].content
        this.selectedVersion = response.data[0].content[0]
        this.updateSection()
        this.updateChapter()
        this.startTour()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to fetch documentation content, an error occurred`, color: 'error', icon: 'mdi-close-circle' })
      }
    })()
  }
}
</script>

<style>
.v-tab {
  text-transform: none !important;
  letter-spacing: normal;
  font-weight: bold;
  font-size: 18px;
}

.v-tab.v-tab--active {
  color: var(--primary-purple) !important;
}

.v-tabs-slider {
  color: var(--primary-purple) !important;
}

.v-window-item {
  background-color: #3A4052;
}

.v-list-item--active .v-list-item__title {
  color: var(--primary-purple) !important;
  font-weight: bold;
}

.v-list-item--active .v-list-item__icon {
  color: var(--primary-purple) !important;
}
</style>