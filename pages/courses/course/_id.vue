<template>
  <main class="main [ container mx-auto px-6 pt-4 ]">
    <nuxt-link to="/" class="[ inline-block bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded my-5 ]">
      Return
    </nuxt-link>

    <h1 class="[ text-5xl ]">Course ID - {{$route.params.id}}</h1>

    <transition name="fade">
      <div v-if="notification" class="notification [ mt-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative ]" role="alert">
        <strong class="[ font-bold ]">Warning !</strong>
        <span class="[ block sm:inline ]">Current course ({{$route.params.id}}) has been deleted</span>
        <span class="[ absolute top-0 bottom-0 right-0 px-4 py-3 ]">
        <svg class="[ fill-current h-6 w-6 text-red-500" role="button ]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
      </div>
    </transition>

    <ul class="course-data [ mt-5 ]">
      <li class="course-data__item" v-for="(data, key) in course" :key="key"><b>{{key}}:</b> {{data}}</li>
    </ul>

    <div class="controls">
      <button @click="modalHidden = false" class="edit [ bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 border-b-4 border-yellow-700 hover:border-yellow-500 rounded mt-5 ]">Edit Course</button>
      <button @click="deleteCourse(+$route.params.id)" class="[ bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded mt-5 ]">Delete Course</button>
    </div>

    <div class="modal" :class="{'modal--hidden': modalHidden}">
      <div class="modal__form">
        <h2 class="[ text-3xl ]">Edit current course</h2>
        <div class="input-wrapper [ mt-5 ]">
          <input v-model="courseData.name" placeholder="Name">
          <input v-model="courseData.description" placeholder="Description">
          <input v-model="courseData.price" placeholder="Price">
          <input v-model="courseData.date" placeholder="Date" type="date">
        </div>
        <div class="modal__controls [ mt-5 ]">
          <div @click="editCurrentCourse" class="[ bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ]">Edit</div>
          <div @click="cancelEditing" class="[ bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded ]">Cancel</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

  export default {
    data() {
      return {
        course: null,
        notification: false,
        modalHidden: true,
        courseData: {}
      }
    },

    computed: {
      ...mapGetters(['getCourse', 'getCourses']),
    },

    methods: {
      ...mapActions(['fetchData']),
      ...mapMutations(['deleteCourse', 'editCourse']),

      cancelEditing() {
        this.modalHidden = true;
      },

      editCurrentCourse() {
        this.editCourse(this.courseData);
        this.modalHidden = true;
      }
    },

    async created() {
      if(!this.getCourses) await this.fetchData()
      const course = this.getCourse(+this.$route.params.id);

      this.course = course;

      for(const key in course) {
        this.courseData[key] = course[key];
      }
    },

    watch: {
      'getCourses': function (value) {
        const target = value.find(course => course.id === +this.$route.params.id);

        if(!target) {
          this.notification = true;

          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .course-data {
    &__item {
      padding: 1.6rem;

      &:not(:nth-child(odd)) {
        background-color: #f7f7f7;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(black, .3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity .2s ease, visibility .2s ease;

    &--hidden {
      opacity: 0;
      visibility: hidden;
    }

    &__form {
      background-color: #ffffff;
      padding: 1.6rem;
      border-radius: .3rem;
      min-width: 32rem;
    }

    &__controls {
      display: flex;
      justify-content: space-between;
    }
  }

  .input-wrapper {
    display: flex;
    flex-direction: column;

    input {
      border: 1px solid #eaeaea;
      padding: .8rem;
      border-radius: .3rem;

      &:not(:last-child) {
        margin-bottom: 1.6rem;
      }
    }
  }
</style>
