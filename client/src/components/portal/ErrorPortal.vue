<template>
    <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
        <LineDrop />
        <v-container class="error-container">
            <img 
                src="@/assets/images/warning.png" 
                alt="Error" 
                :class="{ 'error-img': this.$vuetify.breakpoint.mobile }"
            >
            <h1 
                class="linear-wipe" 
                :class="{ 'error-h1': this.$vuetify.breakpoint.mobile }"
            >
                Sorry An Error Has Occurred
            </h1>
            <h2
                :class="{ 'error-h2': this.$vuetify.breakpoint.mobile }"
            >
                Unknown error occured while processing your request
            </h2>
            <v-btn 
                class="animated-gradient white--text mt-7"
                @click="reload"
            >
                Reload Page
            </v-btn>

        </v-container>
    </div>
</template>

<script>
import LineDrop from '@/components/portal/LineDrop.vue';

export default {
    components: {
        LineDrop
    },
    methods: {
        reload(){
            location.reload()
        }
    }
}
</script>

<style scoped>
.error-container {
    position: relative; 
    z-index: 99;
}

img {
    width: 300px;
}
h1 {
    font-size: 3rem;
}

h2 {
    color: #AEAEAE;
    font-weight: normal;
    font-size: 1.5rem;
}

button {
    width: fit-content;
}

.error-img {
    width: 200px;
}
.error-h1 {
    font-size: 1.5rem;
}
.error-h2 {
    font-size: 1rem;
}
</style>