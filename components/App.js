Vue.component('App', {
    data() {
        return{
            questions: null,
            index: 0,
            selectedIndex: null,
            randInt: null,
            numCorrect: 0,
            numTotal: 0,
            answered: false,
            finished: false
        }
    },
    methods: {
        next() {
            if(this.numTotal === 10){
                this.finished = true
                this.answered = false
            }else{
                this.index++
                this.selectedIndex = null
                this.answered = false
                this.shuffle()
            }
        },
        restart(){
            location.reload();
            return false;
        },
        selectAnswer(index){
            this.selectedIndex = index
        },
        shuffle() {
            this.randInt = Math.floor( Math.round(Math.random() * 3) )
            // console.log(this.randInt)
            this.questions[this.index].incorrect_answers.splice(this.randInt, 0, this.questions[this.index].correct_answer)
            // console.log(this.questions[this.index])
        },
        submitAnswer() {
            let isCorrect = this.selectedIndex === this.randInt ? true : false

            this.increment(isCorrect)
            this.answered = true
        },
        increment(isCorrect) {
            if(isCorrect){
                this.numCorrect++
            }
            this.numTotal++
        },
        answerClass(index) {
            let answerClass = ''
            if(this.answered){
                if(index === this.randInt){
                    answerClass = 'btn-correct'
                }else if(this.selectedIndex !== this.randInt && this.selectedIndex === index){
                    answerClass = 'btn-danger'
                }else{
                    answerClass = 'btn-secondary' 
                }
            }else{
                if(index === this.selectedIndex){
                    answerClass = 'btn-success'
                }else{
                    answerClass = 'btn-secondary' 
                }
            }
            return answerClass
        },
        decode(encodedString) {
            const translate_re = /&(nbsp|amp|quot|lt|gt|ldquo|rdquo);/g;
            const translate = {
                "ldquo" : "\"",
                "rdquo" : "\"",
                "nbsp":" ",
                "amp" : "&",
                "quot": "\"",
                "lt"  : "<",
                "gt"  : ">"
            };
            return encodedString.replace(translate_re, function(match, entity) {
                return translate[entity];
            }).replace(/&#(\d+);/gi, function(match, numStr) {
                const num = parseInt(numStr, 10);
                return String.fromCharCode(num);
            });
        }
    },
    mounted: function() {
        fetch('https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple', {
            method: 'get'
        })
        .then((res) => {
            return res.json()
        })
        .then((jsonData) => {
            this.questions = jsonData.results
        })
        .then(() => {
            this.shuffle()
        })
    },
    template: 
    `
        <div>
            <nav class="navbar navbar-light bg-light">
                <span class="navbar-brand mb-0 h1">Fancy Quiz</span>
                <span class="navbar-brand">Counter: {{numCorrect}}/{{numTotal}}</span>
            </nav>

            <div class="jumbotron bg-secondary text-white">
                <p class="lead text-center pt-4">
                    <span class="h3" v-if="questions">{{ decode(questions[index].question) }}</span>
                </p>
                <hr class="my-4">
                    <div v-if="questions">
                        <p v-for="(answer, index) in questions[index].incorrect_answers">
                            <button 
                                class="btn mx-auto w-100 btn-lg" 
                                :class="answerClass(index)"
                                @click="selectAnswer(index)">
                                {{ decode(answer) }}
                            </button>
                        </p>
                    </div>
                    <p class="lead text-center">
                        <button 
                            class="btn btn-primary mx-auto w-100 btn-lg" 
                            :disabled="selectedIndex === null || answered"
                            @click="submitAnswer">
                            Submit
                        </button>
                        <button 
                            class="btn btn-success mx-auto w-100 btn-lg"
                            :disabled="!answered"
                            @click="next">
                            Next
                        </button>
                    </p>
                </hr>
            </div>
            <diV :class="[finished ? 'display-results-renew' : 'hide-results-renew']">
                <h2 class="text-success">
                    Your score: {{numCorrect}}/{{numTotal}}
                </h2>
                <button 
                class="btn btn-success" 
                @click="restart">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                </button>
            </diV>
        </div>
    `
})

new Vue({
    el: '#root',
    component: [
        'App'
    ]
})
