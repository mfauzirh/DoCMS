<template>
    <v-row>
        <v-col>
            <v-skeleton-loader
                class="skeleton-loader-portal"
                type="heading, sentences, image, chip, paragraph, sentences, paragraph" 
                dark
            ></v-skeleton-loader>
        </v-col>
        <v-col class="col-3">
            <v-skeleton-loader 
                class="skeleton-loader-portal"
                type="heading, sentences, paragraph" 
                dark 
            ></v-skeleton-loader>
        </v-col>
    </v-row>
</template>

<style lang="scss">
.skeleton-loader-portal>div {
    margin-bottom: 20px;
}
.v-skeleton-loader__image {
    height: 300px;
}
</style>