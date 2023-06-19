import { defineStore } from "pinia";
import axios from 'axios';
import router from '@/router';

export const useDocumentationStore = defineStore({
    id: "documentationStore",
    state: () => ({
        documentation: null,
        selectedVersion: null,
        loading: false,
        error: null
    }),
    getters: {
        getVersions: (state) => {
            return state?.documentation?.content.map(content => content.version);
        },
        getContentInVersion: (state) => {
            return (version) => state.documentation.content.filter((ct) => ct.version == version)[0].chapter
        }
    },
    actions: {
        async fetchData(redirect=false) {
            this.loading = true;

            try {
                const response = await axios.get(process.env.VUE_APP_API_URL + 'documentations');

                // set all documentations data
                this.documentation = response.data[0];

                // set first version of the documentaion as default
                this.selectedVersion = response.data[0]?.content[0]?.version

                // If in portal, then want to select default showing section
                if (redirect) {
                    let sectionId = this.documentation?.content[0]?.chapter[0]?.section[0]?._id;
                    if(sectionId) {
                        router.push(`/docs/${sectionId}`)
                    }
                }
            } catch (error) {
                this.error = error;     
            } finally {
                this.loading = false;
            }
        }
    }
})