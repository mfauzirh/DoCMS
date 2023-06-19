<template>
  <v-container>
    <v-tour 
      name="sectionTour" 
      :steps="steps" 
      :options="{ highlight: true, enableScrolling: false }"
      :callbacks="{ onFinish: handleTourEnd, onSkip: handleTourEnd }"
    ></v-tour>
    <v-card class="section-header elevation-0" dark>
      <v-card-title class="d-flex justify-space-between pa-0">
        <v-text-field 
          id="v-step-chapter-1"
          dense 
          outlined 
          placeholder="Search..." 
          class="search-input"  
          v-model="searchKeyword">
        </v-text-field>
        <v-btn 
          id="v-step-chapter-0"
          to="/cms/section/create"
          color="#939AFF"
          class="black--text d-flex align-start flex-column mb-4"
        >
          <v-icon class="mr-2">mdi-plus</v-icon>
          Add New
        </v-btn>
      </v-card-title>
    </v-card>

    <div class="section-list" id="v-step-chapter-2">
      <div v-if="filteredSection.length === 0">
        <v-card variant="tonal" class="section-card table-responsive mb-3" dark>
          <span>No result found</span>
        </v-card>
      </div>
      <v-card variant="tonal" class="section-card table-responsive mb-3" dark v-for="(section, index) in (searchKeyword) ? filteredSection: cloneItems" v-bind:key="index">
        <table style="width: 100%;">
          <tr>
            <td>
              <span>Section Title:</span>
              <p>{{ section.title }} {{ section.alias ? '- ' + section.alias : '' }}</p>
            </td>
            <td>
              <span>Last Updated:</span>
              <p><span>{{ new Date(section.updatedAt) | moment("from", "now") }}</span></p>
            </td>
            <td>
              <span>Author:</span>
              <p>{{ section.createdBy }}</p>
            </td>
            <td>
              <span>Actions:</span>
              <div>
                <v-btn class="edit-btn tonal mr-2" rounded color="warning" :to="`/cms/section/${section._id}`"><v-icon class="mr-2">mdi-pencil</v-icon>Edit</v-btn>
                <v-btn class="delete-btn tonal" rounded color="error" @click="deleteSection(section._id)"><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-btn>
              </div>
            </td>
          </tr>
        </table>
      </v-card>
    </div>

    <v-pagination
      id="v-step-chapter-3"
      v-if="pagination.total >= pagination.rowsPerPage"
      v-model="pagination.page"
      :length="pages"
      :total-visible="5"
      color="var(--secondary-purple-darker)"
      prev-icon="mdi-menu-left"
      next-icon="mdi-menu-right"
      dark
      class="section-pagination"
    ></v-pagination>
  </v-container>
</template>

<script>
import SectionService from '@/services/SectionService'

export default {
  props : ['message', 'status'],
  data(){
    return {
      sections: [],
      pagination: {
        page: 1,
        total: 0,
        rowsPerPage: 5
      },
      searchKeyword: '',
      steps: [
        {
          target: '#v-step-chapter-0',
          content: `<strong>Add New Section</strong><br>You can add new section into your documentation by clicking this button`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-chapter-1',
          content: `<strong>Search Section</strong><br>Is it hard to find your spesific section? search it here by it's name`,
          params: {
            placement: 'bottom',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-chapter-2',
          content: `<strong>Section List</strong><br>Here your section listed, you can do action such as edit it or deleted it`,
          params: {
            placement: 'left',
            enableScrolling: false
          }
        },
        {
          target: '#v-step-chapter-3',
          content: `<strong>Navigation</strong><br>Switch between pages if you want to see other side of you section`,
          params: {
            placement: 'top',
          }
        },
      ]
    }
  },
  methods :{
    async deleteSection(id){
      try {
        await SectionService.deleteSection(id);
        this.$root.SnackBar.show({ message: "Section successfully deleted", color: 'success', icon: 'mdi-check-circle' })
        this.fetchSections()
      } catch (error) {
        this.$root.SnackBar.show({ message: "Failed to delete section, an error occurred", color: 'error', icon: 'mdi-close-circle' })
      }
    },
    async fetchSections(){
      try {
        const response = await SectionService.getAllSections();
        this.sections = response.data
        this.pagination.total = this.sections.length
        this.startTour()
      } catch (error) {
        this.$root.SnackBar.show({ message: 'Failed to get chapters', color: 'error', icon: 'mdi-close-circle' })
      }
    },
    startTour(){
      if(!this.$vuetify.breakpoint.mobile){
        const tour = JSON.parse(localStorage.getItem('tour'));
        const isTourHaveBeenDone = tour?.section;
        if(!isTourHaveBeenDone) {
          this.$tours['sectionTour'].start()
        }
      }
    },
    handleTourEnd(){
      let tour = JSON.parse(localStorage.getItem('tour'))
      tour.section = true;
      tour = JSON.stringify(tour);
      localStorage.setItem('tour', tour)
    }
  },
  computed: {
    pages () {
      return Math.ceil(this.pagination.total / this.pagination.rowsPerPage)
    },
    cloneItems() {
        var clone = JSON.parse(JSON.stringify(this.sections));
        var startFrom = (this.pagination.page*this.pagination.rowsPerPage)-this.pagination.rowsPerPage;
        return clone.splice(startFrom, this.pagination.rowsPerPage);
    },
    filteredSection() {
      return this.sections.filter((section) =>
        section.title.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }
  },
  created(){
    if(this.status){
      this.$root.SnackBar.show({ message: this.message, color: 'success', icon: 'mdi-check-circle' })
    }
    this.fetchSections()
  }
}
</script>

<style scoped>
button {
  text-transform: none;
  font-weight: bold;
}

.section-header {
  margin: 0 50px;
  background-color: var(--primary-dark);
}
.section-header button {
  margin-bottom: 14px;
}
.section-header .search-input {
  max-width: 300px;
  min-width: 100px;
  margin-top: 12px;
}

.section-list {
    overflow-x: auto;
    margin: 0 50px;
  }
  .section-card {
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
</style>