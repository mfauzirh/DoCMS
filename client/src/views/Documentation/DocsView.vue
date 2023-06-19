<template>
    <v-app>
        <div v-if="documentation && isContentExist && !error" class="mt-16">
            <!-- Header Starts Here -->
            <v-app-bar 
                class="portal-navbar"
                app 
                dark 
            >
                <v-app-bar-nav-icon 
                    id="toggle-sidebar"
                    @click.stop="drawer = !drawer"
                    v-show="this.$vuetify.breakpoint.mobile"
                ></v-app-bar-nav-icon>

                <v-toolbar-title class="d-flex justify-center align-center px-0">
                    <img 
                        class="logo mr-2"
                        v-if="!this.$vuetify.breakpoint.mobile" 
                        :src="documentation.logo" 
                    >
                    <v-select 
                        id="version-dropdown"
                        class="version-dropdown ml-auto"
                        v-model="selectedVersion" 
                        v-if="!this.$vuetify.breakpoint.mobile" 
                        :items="getVersions"
                        @change="changeVersion(getContentInVersion(selectedVersion))" 
                        outlined 
                        dense 
                        rounded
                    ></v-select>
                </v-toolbar-title>


                <div class="ml-auto mr-2 d-flex justify-center align-center">
                    <v-text-field 
                        id="search-bar"
                        @click="dialog = true"
                        v-if="!this.$vuetify.breakpoint.mobile" 
                        placeholder="Search section..."
                        append-icon="mdi-magnify" 
                        class="mr-4 pt-6" 
                        outlined 
                        dense 
                        readonly
                    ></v-text-field>
                    <v-btn 
                        id="search-bar"
                        @click="dialog = true"
                        v-else 
                        icon
                    >
                        <v-icon>mdi-magnify</v-icon>
                    </v-btn>
                    <v-btn 
                        id="github-link-button"
                        v-if="documentation.githubLink"
                        :href="documentation.githubLink" 
                        target="_blank" 
                        icon
                    >
                        <v-icon>mdi-github</v-icon>
                    </v-btn>
                </div>
            </v-app-bar>
            <!-- Header Stop Here -->

            <!-- Sidebar Starts Here -->
            <v-navigation-drawer 
                class="side-bar fontstyle px-0 py-0" 
                style="margin-top: 55px;"
                v-model="drawer" 
                :permanent="$vuetify.breakpoint.lgAndUp"
                fixed 
                dark 
            >
                <div 
                    v-if="this.$vuetify.breakpoint.mobile"
                    class="d-flex justify-center align-center flex-column"
                >
                    <img 
                        v-if="this.$vuetify.breakpoint.mobile" 
                        class="mr-2" 
                        :src="documentation.logo" 
                        style="height: 100px;"
                    >
                    <v-select 
                        v-if="this.$vuetify.breakpoint.mobile"
                        v-model="selectedVersion" 
                        :items="getVersions"
                        @change="changeVersion(getContentInVersion(selectedVersion))" 
                        class="version-dropdown-mobile"
                        outlined 
                        dense 
                        rounded
                        >
                    </v-select>
                </div>
                <v-container v-for="(chapter, i) in getContentInVersion(selectedVersion)" :key="i" class="chapter-container">
                    <v-card-title class="chapter-title font-weight-bold" v-text="chapter.title"></v-card-title>
                    <v-list flat>
                        <v-list-item-group class="text-left ml-5">
                            <v-list-item dense class="section" v-for="(section, j) in chapter?.section" :key="j"
                                :to="{ name: 'portal.section', params: { id: section._id } }">
                                <v-list-item-content>
                                    <v-list-item-title class="section-title" v-text="section.title"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-container>
            </v-navigation-drawer>
            <!-- Sidebar Stop Here -->

            <v-main class="portal-main" :class="{ 'portal-main-mobile': this.$vuetify.breakpoint.mobile }" style="margin-top: -10px;">
                <v-container v-if="documentation" class="mt-6">
                    <router-view :key="$route.path" :title="documentation.title" @error="handleError"></router-view>
                </v-container>
            </v-main>

            <!-- Footer Starts Here -->
            <v-footer v-html="documentation.footer" class="portal-footer text-center d-flex justify-center align-center "
                :class="{ 'portal-footer-mobile': this.$vuetify.breakpoint.mobile }" dark>
            </v-footer>
            <!-- Footer Stops Here -->
        </div>

        <!-- Search Bar Modal -->
        <v-dialog
            v-if="documentation"
            v-model="dialog"
            width="1000px"
        >
            <div>
                <div class="search-container-portal">
                    <v-icon color="#8B949E" class="mr-3">mdi-magnify</v-icon>
                    <input 
                        v-model="searchKeyword" 
                        class="search-portal-dialog"
                        placeholder="Search section..." type="text" 
                        style="color: white;"
                    >
                </div>
                <div class="search-content-container pa-3 mt-2 d-flex justify-center align-center">
                    <div class="search-result-found mt-2" v-if="filteredSection.length > 0">
                        <div 
                            class="search-result-list mb-2 pa-5" 
                            v-for="section in filteredSection" :key="section._id"
                            @click="redirect(section._id)"
                        >
                            <p class="text-left ma-0">{{ section.title }}</p>
                        </div>
                    </div>
                    <div v-else>No results found "{{ searchKeyword }}"</div>
                </div>
            </div>
        </v-dialog>

        <!-- Display Loader if documentation is not ready -->
        <PortalLoader v-if="!documentation && !error" />
        <!-- Display No Content View if in documentation there is no content exist -->
        <NoContentView v-if="documentation && !isContentExist && !error" />
        <!-- Display Error View when error exist -->
        <ErrorView v-if="error" />
    </v-app>
</template>

<script>
import router from '@/router';
import PortalLoader from '@/components/portal/PortalLoader.vue';
import ErrorView from '@/components/portal/ErrorPortal.vue';
import NoContentView from '@/components/portal/NoContent.vue';
import DocumentationService from '@/services/DocumentationService';

export default {
    components: {
        PortalLoader,
        ErrorView,
        NoContentView
    },
    data() {
        return {
            documentation: null,
            selectedVersion: null,
            isContentExist: true,
            drawer: true,
            dialog: false,
            searchKeyword: '',
            error: false
        }
    },
    methods: {
        async fetchData(){
            try {
                const response = await DocumentationService.getDocumentations();
                this.documentation = response.data[0];

                // Check if there is content exist in documentation
                if(this.documentation.content.length === 0) {
                    this.isContentExist = false;
                    return;
                }
                
                this.selectedVersion = response.data[0]?.content[0]?.version;

                if(router.currentRoute.name !== 'portal.section') {
                    let sectionId = this.documentation?.content[0]?.chapter[0]?.section[0]?._id;
                    router.push({ name: 'portal.section', params: { id: sectionId }})
                }
            } catch (error) {
                console.log(error)
                this.error = true
            }
        },
        changeVersion(content) {
            // Load first section in first chapter of the selected version
            if (content?.length > 0 && content[0]?.section.length > 0) {
                router.push(`/docs/${content[0].section[0]._id}`)
            }
        },
        getContentInVersion(version) {
            return this.documentation.content.filter((content) => content.version == version)[0]?.chapter
        },
        redirect(id){
            router.push(`/docs/${id}`)
            this.dialog = false
        },
        handleError() {
            this.error = true;
        }
    },
    computed: {
        getVersions(){
            if(!this.documentation?.content) {
                return []
            }
            
            return this.documentation.content
                .filter(content => content?.chapter?.length > 0)
                .map(content => content.version);
        },
        sections() {
            const content = this.getContentInVersion(this.selectedVersion)

            return content ? content.map(item => item?.section).flat() : []
        },
        filteredSection() {
            return this.sections.filter((item) => item?.title.toLowerCase().includes(this.searchKeyword.toLowerCase()))
        }
    },
    created(){
        this.fetchData()
    }
}
</script>

<style scoped>

.chapter-container:last-child {
    margin-bottom: 50px;
}

.search-container-portal {
    display: flex;
    background-color: #2D3748; 
    color: white; 
    padding: 20px; 
    border-radius: 5px;
}

.search-portal-dialog:focus{
    outline: none !important;
    width: 100%; 
    height: 100%; 
    color: white;
}

.search-content-container {
    background-color: #2D3748; 
    min-height: 200px; 
    color: #8B949E; 
    border-radius: 5px;
}

.search-result-found{
    width: 100%;
}

.search-result-list {
    background-color: #242C3A; 
    cursor: pointer; 
    border-radius: 5px;
}

.linear-wipe {
    --bg-size: 400%;
    font-weight: bold;
    background: linear-gradient(90deg,
            var(--secondary-purple),
            var(--secondary-blue),
            var(--secondary-purple)) 0 0 / var(--bg-size) 100%;
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
    background: repeating-linear-gradient(to right, var(--secondary-purple) 0%, var(--secondary-blue) 50%, var(--secondary-purple) 100%);
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

/* App bar styling */
.portal-navbar {
    z-index: 99 !important;
    box-shadow: none !important;
    background-color: var(--primary-dark) !important;
    background: var(--primary-dark-transparant) !important;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
    backdrop-filter: blur(10.5px) !important;
    -webkit-backdrop-filter: blur(10.5px) !important;
    border: 1px solid rgba(22, 25, 45, 0.3) !important;
    border-bottom: 1px solid #282d4b !important;
}

.logo {
    max-height: 60px;
}

.version-dropdown {
    /* width: 120px;  */
    max-height: 45px;
    font-size: 11px;
    background-color: none;
    line-height: 1 !important;
    width: 120px;
}

.version-dropdown-mobile {
    /* width: 120px;  */
    max-height: 45px;
    font-size: 11px;
    background-color: none;
    line-height: 1 !important;
    margin: 0 20px;
}

/* Side bar styling */
.side-bar {
    margin-top: 64px;
    background-color: var(--primary-dark);
}

.chapter-title {
    color: var(--secondary-purple-darker);
    font-size: 16px;
    padding: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.section {
    border-left: 2px solid rgb(43, 55, 70);
}

.section:not(.v-item--active):hover {
    border-left: 2px solid rgba(255, 255, 255, 0.521);
}

.v-item--active {
    border-left: 2px solid var(--secondary-purple-darker);
}

.v-item--active .section-title {
    color: var(--secondary-purple-darker);
}

.section-title {
    color: #727f90;
}

/* Main section styling */
.portal-main {
    margin-left: 270px;
    padding-top: 0 !important;
    background-image: url('@/assets/portalbg.png');
    background-size: 100% auto;
}

.portal-main-mobile {
    margin-left: 0;
    background-image: url('@/assets/portalbgmobile.png');
    background-size: 100% auto;
}

/* Footer Styling */
.portal-footer {
    background: #212542 !important;
    margin-left: 256px !important;
    padding-top: 16px !important;
    background-color: #16192d !important;
    border-top: 1px solid #282d4b !important;
    color: #94a3b8 !important;
}

.portal-footer-mobile {
    margin-left: 0 !important;
}
</style>