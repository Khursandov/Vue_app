<template>
    <v-container>
        <v-layout row>
            <v-flex xs12>
                <form @submit.prevent="onCreateMeetup">
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="title"
                            label="Title"
                            id="title"
                            v-model="title"
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="location"
                            label="Location"
                            id="location"
                            v-model="location"
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn raised class="primary" @click="onPickFile">Upload img</v-btn>
                            <input type="file"
                             style="display:none"
                              ref="fileInput"
                               accept="image/*"
                               @change="onFilePicked">
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <img :src="imageUrl" height="150">
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs12 sm6 offset-sm3>
                            <v-text-field
                            name="descriptioin"
                            label="Desvription"
                            id="description"
                            v-model="description"
                            multi-line
                            required>
                            </v-text-field>
                        </v-flex>
                    </v-layout>

                    <v-layout row >
                        <v-flex xs12 sm6 offset-sm3>
                            <v-btn 
                            class="primary" 
                            :disabled="!formIsValid"
                            type="submit">Create Meet up</v-btn>
                        </v-flex>
                    </v-layout>

                </form>
            </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
export default {
        data() {
            return {
                title: '',
                location: '',
                imageUrl: '',
                description: '',
                date: new Date(),
                time: new Date(),
                image: null
            }
        },
        computed: {
            formIsValid() {
                return this.title !== '' && 
                this.location !== '' && 
                this.description !== '' 
                this.imageUrl !== ''
            },
        },
        methods: {
            onCreateMeetup() {
                if(!this.image){
                    return
                }
                const meetupData = {
                    title: this.title,
                    location: this.location,
                    image: this.image,
                    description: this.description,
                    date: new Date()
                }
                this.$store.dispatch('createMeetup', meetupData)
                return this.$router.push('/')
                console.log(meetupData)
            },
            onPickFile() {
                this.$refs.fileInput.click()
            },
            onFilePicked(event) {
                const files = event.target.files
                let filename = files[0].name
                if(filename.lastIndexOf('.') <= 0) {
                    return alert('please add valid file!!!')
                }
                const fileReader = new FileReader()
                fileReader.addEventListener('load', () => {
                    this.imageUrl = fileReader.result
                })
                fileReader.readAsDataURL(files[0])
                this.image = files[0]
            }
        }
}
</script>
