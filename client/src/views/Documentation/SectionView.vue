<template>
  <div>
    <SectionLoader v-if="!content" />
    <SectionContent v-if="content" :content="content" />
  </div>
</template>

<script>
import SectionLoader from "@/components/portal/SectionLoader.vue";
import SectionContent from "@/components/portal/SectionContent.vue";
import SectionService from "@/services/SectionService";

export default {
    props: {
        title: String
    },
    components: {
        SectionLoader,
        SectionContent
    },
    data: () => ({
        content: ""
    }),
    methods: {
        async loadSection(){
            try {
                // Get section data
                const id = this.$route.params.id;
                const response = await SectionService.getSectionById(id);
                this.content = response.data[0].content
                // Set tab with format << section title - documentation title >>
                document.title = await response.data[0].title + " - " + this.title
            } catch (error) {
                this.$emit('error');
            }
        }
    },
    created(){
        this.loadSection()
    }
}
</script>

<style src="quill/dist/quill.snow.css"></style>

<style>
h1 {
    font-size: 2rem;
}
h2 {
    font-size: 1.7rem;
}
h3 {
    font-size: 1.5rem;
}
h4 {
    font-size: 1.3rem;
}
h5 {
    font-size: 1.2rem;
}
</style>