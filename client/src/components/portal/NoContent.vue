<template>
    <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
        <LineDrop />
        <v-container class="no-content-container">
            <img 
                src="@/assets/images/nocontent.png" 
                alt="No content" 
                :class="{ 'no-content-img': this.$vuetify.breakpoint.mobile }"
            >
            <h1 
                class="linear-wipe" 
                :class="{ 'no-content-h1': this.$vuetify.breakpoint.mobile }"
            >
                No Content Available  at This Time!
            </h1>
            <h2
                :class="{ 'no-content-h2': this.$vuetify.breakpoint.mobile }"
            >
                We couldn’t provide any content yet for you
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
            location.reload();
        }
    }
}
</script>

<style scoped>
.no-content-container {
    position: relative; 
    z-index: 99;
}
img {
    width: 500px;
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

.no-content-img {
    width: 300px;
}
.no-content-h1 {
    font-size: 1.5rem;
}
.no-content-h2 {
    font-size: 1rem;
}
</style>