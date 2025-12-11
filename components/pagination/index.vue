<template>
  <div class="pagination">
    <ul>
      <li v-if="currentPage > 1">
        <a href="#" aria-label="Previous" @click.prevent="pageChanged(1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="(page, i) in paginationRange" :key="i">
        <a :class="activePage(page)" href="#" @click.prevent="pageChanged(page)">{{ page }}</a>
      </li>
      <li v-if="currentPage != totalPages">
        <a href="#" aria-label="Next" @click.prevent="pageChanged(lastPage)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import Util from "@/plugins/util-pagination.js";

export default {
  props: {
    currentPage: {type: Number, required: true},
    totalPages: {type: Number, required: true},
    // Items per page
    itemsPerPage: {type: Number, default: 10},
    // Total items
    totalItems: {type: Number, default: 0},
    // Visible Pages
    visiblePages: {type: Number, default: 10}
  },
  data() {
    return {};
  },
  computed: {
    lastPage() {
      if (this.totalPages) {
        return this.totalPages;
      } else {
        return this.totalItems % this.itemsPerPage === 0
          ? this.totalItems / this.itemsPerPage
          : Math.floor(this.totalItems / this.itemsPerPage) + 1;
      }
    },

    paginationRange() {
      let start =
        this.currentPage - this.visiblePages / 2 <= 0
          ? 1
          : this.currentPage + this.visiblePages / 2 > this.lastPage
          ? Util.lowerBound(this.lastPage - this.visiblePages + 1, 1)
          : Math.ceil(this.currentPage - this.visiblePages / 2);

      let range = [];

      for (let i = 0; i < this.visiblePages && i < this.lastPage; i++) {
        range.push(start + i);
      }

      return range;
    }
  },

  methods: {
    pageChanged(pageNum) {
      this.$emit("page-changed", pageNum);
    },

    activePage(pageNum) {
      return this.currentPage === pageNum ? "pagination-current" : "";
    }
  }
};
</script>
