export const state = () => ({
  courses: null
});

export const getters = {
  getCourses(state) {
    return state.courses;
  },

  getCourse(state) {
    return id => state.courses.find(course => course.id === id);
  }
};

export const mutations = {
  setCourses(state, data) {
    state.courses = data;
  },

  deleteCourse(state, id) {
    const target = state.courses.find(course => course.id === id);
    const index = state.courses.indexOf(target);

    state.courses.splice(index, 1);
  },

  addCourse(state, course) {
    course.id = state.courses.length + 1;
    state.courses.push(course);
  },

  editCourse(state, data) {
    const target = state.courses.find(course => course.id === data.id);

    for(const key in target) {
      if(key === 'id') continue;

      target[key] = data[key];
    }
  },

  sortCourses(state) {
    state.courses = state.courses.sort((a,b) => {
      if(+a.price > +b.price) return 1;
      if(+a.price < +b.price) return -1;
    });

    console.log(state.courses);
  }
};

export const actions = {
  async fetchData({commit}) {
      console.log('req');
      const response = await this.$axios.get('https://run.mocky.io/v3/81f81645-f38d-4374-a731-361b37640bab');
      const {courses} = response.data;

      commit('setCourses', courses);
  }
};
