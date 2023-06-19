<template>
    <div class="d-flex justify-center align-center" style="width: 100%; height: 100%;">
        <LineDrop />
        <div style="width: 100%; height: 100%; position: absolute; overflow: hidden;">
            <div class="line" style="left: 20%; --duration: 2s; --delay: .5s;"></div>
            <div class="line" style="left: 40%; --duration: 3s; --delay: .3s;"></div>
            <div class="line" style="left: 60%; --duration: 2.5s; --delay: .8s;"></div>
            <div class="line" style="left: 80%; --duration: 3.5s; --delay: .2s;"></div>
        </div>
        <v-container class="not-found-container">
            <img 
                src="@/assets/images/404.png" 
                alt="Not Found" 
                :class="{ 'not-found-mobile': this.$vuetify.breakpoint.mobile }"
            >
            <h1 
                class="white--text" 
                :class="{ 'not-found-h1': this.$vuetify.breakpoint.mobile }"
            >
                Oops! This Page is Not Found
            </h1>
            <h2
                :class="{ 'not-found-h2': this.$vuetify.breakpoint.mobile }"
            >
                We can’t find the page that you’re looking for
            </h2>
            <v-btn 
                class="animated-gradient white--text mt-7"
                @click="backToHomePage"
            >
                Back To Home
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
        backToHomePage(){
            this.$router.push({ name: 'docs' });
        }
    }
}
</script>

<style scoped>
.not-found-container {
    position: relative; 
    z-index: 99;
}

img {
    width: 50%;
}

h2 {
    color: #AEAEAE;
    font-weight: normal;
}

button {
    width: fit-content;
}

.not-found-mobile {
    width: 80%;
}

.not-found-h1 {
    font-size: 1.5rem;
}
.not-found-h2 {
    font-size: 1rem;
}
</style>