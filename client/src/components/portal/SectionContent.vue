<template>
    <v-row class="content-container">
        <v-col 
            v-html="content" 
            class="content ql-editor" 
        ></v-col>
        <v-col 
            v-show="!this.$vuetify.breakpoint.mobile"
            class="col-3" 
        >
            <div class="toc text-left">
                <h3 class="white--text mb-5">On This Section</h3>
                <ul class="pa-0">
                    <li v-for="section in innerSection" :key="section.id">
                        <a v-if="section.tag === 'h1'" :href="'#' + section.id">
                            <strong>{{ section.title }}</strong>
                        </a>
                        <a v-else class="pl-5" :href="'#' + section.id">
                            {{ section.title }}
                        </a>
                    </li>
                </ul>
            </div>
        </v-col>
    </v-row>
</template>

<script>
    import $ from "jquery";

    export default {
        props: {
            content: String
        },
        data(){
            return {
                innerSection: []
            }
        },
        methods: {
            wrapContentInDiv() {
                const IDs = [];
                $("h1, h2").each(function() {
                    const id = "section-" + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
                    IDs.push({id: id, tag: this.localName, title: this.textContent})
                    $(this).nextUntil( "h1, h2" ).wrapAll( `<section id=${id}></section>` );
                    const el = $(this).next();
                    $(this).prependTo(el);
                });
                this.innerSection = IDs;
            }
        },
        mounted(){
            this.wrapContentInDiv();
        }
    }
</script>

<style lang="scss">
.content-container{
    color: #94a3b8;
}

.content{
    text-align: left;
}

pre {
  background-color: #94a3b825;
  border-radius: 4px;
  font-size: 14px;  
  line-height: 1.4;
  overflow: auto;
  padding: 16px !important;
}

.content h1,
.content h2,
.content h3,
.content h4,
.content h5,
.content h6
{
    color: var(--secondary-purple-darker);
}

p strong {
    color: white;
}

.toc {
    position: sticky; 
    top: 76px;
}

.toc ul li {
    list-style: none;
}

.toc ul li a{
    text-decoration: none;
    color: #94a3b8;
}
</style>