<template>
  <v-container>
    <v-tour 
      name="chapterTour" 
      :steps="steps" 
      :options="{ highlight: true, enableScrolling: false }"
      :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd }"
    ></v-tour>
    <v-card class="chapter-header elevation-0" dark>
      <v-card-title class="d-flex justify-space-between pa-0">
        <v-text-field 
          id="v-step-chapter-1"
          dense 
          outlined 
          placeholder="Search..." 
          class="search-input" 
          v-model="searchKeyword"
          >
        </v-text-field>
        <v-btn 
          id="v-step-chapter-0"
          @click="dialog = true"
          color="#939AFF"
          class="black--text d-flex align-start flex-column"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Add New
        </v-btn>
      </v-card-title>
    </v-card>

    <div class="chapter-list" id="v-step-chapter-2">
      <div v-if="filteredChapter.length === 0">
        <v-card variant="tonal" class="chapter-card table-responsive mb-3" dark>
          <span>No result found</span>
        </v-card>
      </div>
      <v-card variant="tonal" class="chapter-card table-responsive mb-3" dark v-for="(chapter, index) in (searchKeyword) ? filteredChapter: cloneItems" v-bind:key="index">
        <table style="width: 100%;">
          <tr>
            <td>
              <span>Chapter Title:</span>
              <p>{{ chapter.title }}</p>
            </td>
            <td>
              <span>Last Updated:</span>
              <p><span>{{ new Date(chapter.updatedAt) | moment("from", "now") }}</span></p>
            </td>
            <td>
              <span>Author:</span>
              <p>{{ chapter.createdBy }}</p>
            </td>
            <td>
              <span>Actions:</span>
              <div>
                <v-btn class="edit-btn tonal mr-2" rounded color="warning" @click="() => { updateDialog = true; choosenChapter = chapter; title = chapter.title }"><v-icon class="mr-2">mdi-pencil</v-icon>Edit</v-btn>
                <v-btn class="delete-btn tonal" rounded color="error" @click="deleteChapter(chapter._id, chapter.version)"><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-btn>
              </div>
            </td>
          </tr>
        </table>
      </v-card>
    </div>

    <v-pagination
      id="v-step-chapter-3"
      v-if="(pagination.total >= pagination.rowsPerPage) && (!searchKeyword)"
      v-model="pagination.page"
      :length="pages"
      :total-visible="5"
      color="var(--secondary-purple-darker)"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      dark
      class="chapter-pagination"
    ></v-pagination>

    <!-- insert dialog -->
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-form>
        <v-card class="card-dialog" dark>
          <v-card-title class="text-h5 font-weight-medium justify-center">
            <span>Create New Chapter</span>
          </v-card-title>
          <br>
          <v-card-text>
            <v-text-field
            v-model="title"
            label="Input Title"
            class="pl-5 pr-5"
            :rules="[v => !!v || 'Chapter title is required']"
            filled
            required
          ></v-text-field>

          <v-select
              v-model="choosenVersion"
              :items="versions"
              filled
              label="Choose Version"
              class="pl-5 pr-5"
              :rules="[v => !!v || 'Please choose version']"
              required
          ></v-select>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="title.length == 0 || choosenVersion.length == 0"
              color="primary"
              text
              @click="save"
              dark
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      
    </v-dialog>

    <!-- Update dialog -->
    <v-dialog
      v-model="updateDialog"
      width="500"
    >
      <v-card class="card-dialog" dark>
        <v-card-title class="text-h5 font-weight-medium justify-center">
          <span>Update Chapter</span>
        </v-card-title>
        <br>

        <v-text-field
          v-model="title"
          label="Input Title"
          class="pl-5 pr-5"
          :rules="[v => !!v || 'Chapter title is required']"
          outlined
          required
        ></v-text-field>
        
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="title.length == 0"
            color="primary"
            text
            @click="update"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </v-container>
</template>

<script>
import ChapterService from '@/services/ChapterService'
import DocumentationService from '@/services/DocumentationService'

export default {
  data(){
    return {
      dialog: false,
      updateDialog: false,
      chapters : [],
      versions: [],
      title: '',
      choosenVersion: '',
      choosenChapter: '',
      pagination: {
        page: 1,
        total: 0,
        rowsPerPage: 5
      },
      searchKeyword: '',
      steps: [
        {
          target: '#v-step-chapter-0',
          content: `<strong>Add New Chapter</strong><br>You can add new chapter into your documentation by clicking this button`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-chapter-1',
          content: `<strong>Search Chapter</strong><br>Is it hard to find your spesific chapter? search it here by it's name`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-chapter-2',
          content: `<strong>Chapter List</strong><br>Here your chapter listed, you can do action such as edit it or deleted it`,
          params: {
            placement: 'left',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-chapter-3',
          content: `<strong>Navigation</strong><br>Switch between pages if you want to see other side of you chapter`,
          params: {
            placement: 'top',
          }
        },
      ]
    }
  },
  methods: {
    async deleteChapter(id, version){
      try {
        const response = await DocumentationService.getDocumentations()
        await ChapterService.deleteChapter({
          chapterId : id,
          version : version,
          content : response.data[0].content
        })
        console.log('success')
        this.$root.SnackBar.show({ message: 'Chapter deleted successfully', color: 'success', icon: 'mdi-check-circle' })
        this.fetchChapters()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to delete chapter, an error has occured`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async save(){
      const chapter = {
        title: this.title,
        version: [ this.choosenVersion ]
      }

      try {
        await ChapterService.createChapter(chapter);
        this.$root.SnackBar.show({ message: 'Chapter created successfully', color: 'success', icon: 'mdi-check-circle' })
        this.fetchChapters()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to create a chapter, an error has occured`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.dialog = false
      this.title = ''
      this.choosenVersion = ''
    },
    async update(){
      const chapter = {
        id: this.choosenChapter._id,
        title: this.title
      }
      
      try {
        await ChapterService.updateChapter(chapter);
        this.$root.SnackBar.show({ message: 'Chapter changed successfully', color: 'success', icon: 'mdi-check-circle' })
        this.fetchChapters()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to update a chapter, an error has occured`, color: 'error', icon: 'mdi-close-circle' })
      }

      this.updateDialog = false
      this.title = ''
      this.choosenChapter = ''
    },
    async fetchChapters() {
      try {
        const response = await ChapterService.getAllChapters()
        this.chapters = response.data
        this.pagination.total = this.chapters.length
        this.startTour()
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to get chapters data`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async getDocumentationVersions() {
      try {
        const response = await DocumentationService.getAllVersions();
        response.data[0].content.forEach(v => {
            this.versions.push(v.version)
        });
      } catch (error) {
        this.$root.SnackBar.show({ message: `Failed to get available documentation version`, color: 'error', icon: 'mdi-close-circle' })
      }
    },
    startTour(){
      if(!this.$vuetify.breakpoint.mobile){
        const tour = JSON.parse(localStorage.getItem('tour'));
        const isTourHaveBeenDone = tour?.chapter;
        if(!isTourHaveBeenDone) {
          this.$tours['chapterTour'].start()
        }
      }
    },
    handleTourEnd(){
      let tour = JSON.parse(localStorage.getItem('tour'))
      tour.chapter = true;
      tour = JSON.stringify(tour);
      localStorage.setItem('tour', tour)
    }
  },
  computed: {
    pages () {
      return Math.ceil(this.pagination.total / this.pagination.rowsPerPage)
    },
    cloneItems() {
        var clone = JSON.parse(JSON.stringify(this.chapters));
        var startFrom = (this.pagination.page*this.pagination.rowsPerPage)-this.pagination.rowsPerPage;
        return clone.splice(startFrom, this.pagination.rowsPerPage);
    },
    filteredChapter() {
      return this.chapters.filter((chapter) =>
        chapter.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  },
  created(){
    this.getDocumentationVersions();
    this.fetchChapters()
  }
}
</script>

<style scoped>
  button {
    text-transform: none;
    font-weight: bold;
  }

  .chapter-header {
    margin: 0 50px;
    background-color: var(--primary-dark);
  }
  .chapter-header button {
    margin-bottom: 14px;
  }
  .chapter-header .search-input {
    max-width: 300px;
    min-width: 100px;
    margin-top: 12px;
  }

  .chapter-list {
    overflow-x: auto;
    margin: 0 50px;
  }
  .chapter-card {
    padding: 40px 20px;
    background-color: var(--primary-dark-lighter);
    min-width: 1000px;
  }

  table tr td {
    text-align: left;
    min-width: 300px;
  }
  table tr td:nth-child(2),
  table tr td:nth-child(3) {
    min-width: 200px;
  }
  
  table tr td span {
    font-size: 0.8rem;
    font-weight: bold;
  }

  table tr td p,
  table tr td p span {
    font-size: 1.1rem;
    margin-bottom: 0;
    margin-top: 5px;
  }
  
  table tr td:first-child p {
    font-weight: bold;
  }

  table tr td div {
    margin-top: 5px;
  }

  table tr td button {
    height: 35px !important;
  }
  
  table tr td div .edit-btn {
    background-color: #2c5282 !important;
  }

  table tr td div .delete-btn {
    background-color: #a40d14 !important;
  }

  .card-dialog .v-card__title{
    background-color: var(--primary-blue-lighter);
  }
  .card-dialog {
    background-color: var(--primary-dark);
  }
  
</style>