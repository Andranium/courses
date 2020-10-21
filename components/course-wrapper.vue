<template>
  <div class="[ courses-table-wrapper mt-8 ]">
    <table class="courses-table [ table-auto ]">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th class="got-icon" @click="sort"><div>Price <svg class="sort-icon"><use xlink:href="@/assets/images/sprite.svg#icon-sort-amount-asc"></use></svg></div></th>
          <th class="got-icon">Date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(course, index) in slicedData" :key="index" @click="$router.push(`/courses/course/${course.id}`)">
            <td>{{course.id}}</td>
            <td>{{course.name}}</td>
            <td>{{course.description}}</td>
            <td>{{course.price}}</td>
            <td>{{course.date}}</td>
        </tr>
      </tbody>
    </table>

    <div class="bottom-panel [ mt-5 ]">
      <div @click="modalHidden = false" class="show-modal [ bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ]">Add course</div>

      <div class="pagination" @click="pagination">
        <div class="pagination__pointer" data-action="prev" v-if="page !== 1"> <svg><use xlink:href="@/assets/images/sprite.svg#icon-chevron-left"></use></svg> </div>

        <div v-for="(number, index) in pageNumbers" data-action="page" :key="index" :class="{'pagination__dots': number === '...', 'active': number == page}">{{number}}</div>

        <template v-if="getCourses">
          <div class="pagination__pointer" data-action="next" v-if="page < Math.ceil(getCourses.length / 2)"> <svg><use xlink:href="@/assets/images/sprite.svg#icon-chevron-right"></use></svg> </div>
        </template>
      </div>
    </div>

    <div class="modal" :class="{'modal--hidden': modalHidden}">
      <div class="modal__form">
        <h2 class="[ text-3xl ]">Add new course</h2>
        <div class="input-wrapper [ mt-5 ]">
          <input v-model="newCourse.name" placeholder="Name">
          <input v-model="newCourse.description" placeholder="Description">
          <input v-model="newCourse.price" placeholder="Price">
          <input v-model="newCourse.date" placeholder="Date" type="date">
        </div>
        <div class="modal__controls [ mt-5 ]">
          <div @click="addNewCourse" class="[ bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ]">Add</div>
          <div @click="cancelAddition" class="[ bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded ]">Cancel</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

export default {
  data() {
    return {
      page: 1,
      rows: 2,
      slicedData: '',
      firstLoad: true,
      pageNumbers: [],
      modalHidden: true,
      newCourse: {
        name: '',
        description: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
      }
    }
  },
  computed: {
    ...mapGetters(['getCourses']),
  },
  methods: {
    ...mapActions(['fetchData']),
    ...mapMutations(['addCourse', 'sortCourses']),

    sort() {
      this.sortCourses();
      this.pagination()
    },

    pagination(e) {
      this.controls(e);

      const val = this.page * this.rows;
      this.slicedData = this.getCourses.slice(val - this.rows, this.page * this.rows);

      this.generateNumbers()
    },

    generateNumbers() {
      const count = this.getCourses.length;
      const pages = Math.ceil(count / this.rows);
      const numbersToShow = 3;

      if(this.page + numbersToShow <= pages || pages <= numbersToShow) {
        this.pageNumbers.length = 0;
      } else {
        return;
      }

      for(let i = this.page; i <= pages; i++) {
        if(i >= this.page + numbersToShow && i < pages) {
          if(!this.pageNumbers.includes('...') && pages > numbersToShow) this.pageNumbers.push('...');
          continue;
        };

        this.pageNumbers.push(i);
      }
    },

    controls(e) {
      if(!e) return;

      const {target} = e;
      const {action} = target.dataset;

      if(action === 'prev') this.page--;
      if(action === 'next') this.page++;
      if(action === 'page') {
        this.page = +target.innerText;
      }
    },

    cancelAddition() {
      const keys = Object.keys(this.newCourse);

      keys.forEach(key => {
        this.newCourse[key] = '';
      })

      this.modalHidden = true;
    },

    addNewCourse() {
      this.addCourse(this.newCourse);
      this.pagination()
      this.modalHidden = true;
    }
  },
  async mounted() {
    if(!this.getCourses) await this.fetchData()

    this.pagination();
  }
}
</script>

<style lang="scss" scoped>
  .got-icon div {
    display: flex;
    align-items: center;
    fill: #989eb7;

    svg {
      margin-left: 1.6rem;
    }
  }

  .sort-icon {
    height: 1.6rem;
    width: 1.6rem;

  }

  .bottom-panel {
    display: flex;
    justify-content: space-between;
  }

  .add-btn {
    cursor: pointer;
  }

  .courses-table {
    width: 100%;
    min-height: 16.6rem;

    thead {
      border-bottom: 1px solid #f7f7f7;

      th {
        font-size: 1.4rem;
        font-weight: normal;
        color: #989eb7;
        text-align: left;
        padding: 1.6rem;
      }
    }

    tbody td {
      padding: 1.6rem;
      vertical-align: baseline;
    }

    tbody tr:not(:nth-child(odd)) {
      background-color: #f7f7f7;
    }
  }

  .pagination {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > div {
      height: 3.2rem;
      width: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid #eaeaea;
      border-radius: 4px;
      color: #072caf;

      &.active {
        color: #ffffff;
        background-color: #072caf;
      }

      &:not(:last-child) {
        margin-right: 1rem;
      }
    }

    &__dots {
      transition: opacity .2s ease, visibility .2s ease;
      pointer-events: none;

      &.hidden {
        opacity: 0;
        visibility: hidden;
        display: none;
      }
    }

    &__pointer {
      user-select: none;

      svg {
        height: 1.6rem;
        width: 1.6rem;
        pointer-events: none;
        fill: #072caf;
      }
    }
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
