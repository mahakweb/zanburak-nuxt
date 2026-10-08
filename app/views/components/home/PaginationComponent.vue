<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps(["pagination"]);
const emit = defineEmits(["updatePage"]);

const containerWidth = ref(0);
const maxVisiblePages = ref(5); // Default value for visible pages
const containerRef = ref(null); // Reference to parent container

// Function to calculate container width and adjust number of visible pages
function updateContainerWidth() {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth;

    // Adjust number of visible pages based on container width
    if (containerWidth.value > 1024) {
      maxVisiblePages.value = 7; // Show more pages for larger containers
    } else if (containerWidth.value > 640) {
      maxVisiblePages.value = 5;
    } else {
      maxVisiblePages.value = 3; // For smaller containers
    }
  }
}

onMounted(() => {
  // Update container width when resizing
  window.addEventListener("resize", updateContainerWidth);
  updateContainerWidth(); // Initial update
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateContainerWidth);
});

function getVisiblePages(current, total) {
  let range = [];
  const delta = Math.floor(maxVisiblePages.value / 2); // Pages around the current page

  let start = Math.max(2, current - delta); // Start showing from page 2 onwards
  let end = Math.min(total - 1, current + delta); // Show up to the page before the last one

  // Ensure the correct number of pages are shown
  if (current - delta <= 1) {
    end = Math.min(total - 1, end + (delta - current + 1));
  }
  if (total - current <= delta) {
    start = Math.max(2, start - (delta - (total - current)));
  }

  // Add the first page
  range.push(1);

  // Add middle pages with "..."
  if (start > 2) {
    range.push("...");
  }

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  if (end < total - 1) {
    range.push("...");
  }

  // Add the last page
  if (total > 1) {
    range.push(total);
  }

  return range;
}

function onPageUpdate(page) {
  if (page !== "...") {
    emit("updatePage", page);
  }
}
</script>

<template>
  <div v-if="props.pagination.last_page > 1" ref="containerRef" class="w-full">
    <div class="items-center justify-center flex">
      <!-- Previous page button -->
      <div class="flex items-center justify-center me-3 ltr:rotate-180 hover:opacity-80 my-auto">
        <button v-if="props.pagination.current_page > 1" @click="onPageUpdate(props.pagination.current_page - 1)"
          rel="prev">
          <!-- SVG arrow left -->
          <svg class="w-4 h-4 -mt-1 text-gray-700 dark:text-white" viewBox="0 0 23 9" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4"
              d="M6.64577 6.43275L2.05275 6.02655C1.02199 6.02655 0.186279 6.8704 0.186279 7.9112C0.186279 8.952 1.02199 9.79585 2.05275 9.79585L6.64577 9.38965C7.45439 9.38965 8.10996 8.7277 8.10996 7.9112C8.10996 7.09333 7.45439 6.43275 6.64577 6.43275"
              fill="currentColor"></path>
            <path
              d="M22.0696 6.50741C21.9978 6.43492 21.7296 6.12856 21.4777 5.87418C20.0081 4.28084 16.1709 1.67543 14.1635 0.878077C13.8588 0.750884 13.0881 0.480085 12.675 0.460937C12.2808 0.460937 11.9043 0.552571 11.5453 0.733104C11.097 0.986123 10.7394 1.38548 10.5417 1.85596C10.4157 2.18147 10.218 3.15935 10.218 3.17713C10.0216 4.24528 9.91455 5.98222 9.91455 7.90243C9.91455 9.72964 10.0216 11.3955 10.1827 12.4814C10.2003 12.5005 10.3981 13.7137 10.6135 14.1294C11.0076 14.8899 11.7783 15.3603 12.6032 15.3603H12.675C13.2127 15.3426 14.3423 14.8707 14.3423 14.8543C16.2427 14.057 19.9891 11.5774 21.4953 9.92932C21.4953 9.92932 21.9206 9.50534 22.1048 9.24138C22.392 8.86117 22.5355 8.39069 22.5355 7.92021C22.5355 7.39503 22.3744 6.90677 22.0696 6.50741"
              fill="currentColor"></path>
          </svg>
        </button>
        <svg v-else class="w-4 h-4 -mt-1 text-gray-700 dark:text-white opacity-50" viewBox="0 0 23 9" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4"
            d="M6.64577 6.43275L2.05275 6.02655C1.02199 6.02655 0.186279 6.8704 0.186279 7.9112C0.186279 8.952 1.02199 9.79585 2.05275 9.79585L6.64577 9.38965C7.45439 9.38965 8.10996 8.7277 8.10996 7.9112C8.10996 7.09333 7.45439 6.43275 6.64577 6.43275"
            fill="currentColor"></path>
          <path
            d="M22.0696 6.50741C21.9978 6.43492 21.7296 6.12856 21.4777 5.87418C20.0081 4.28084 16.1709 1.67543 14.1635 0.878077C13.8588 0.750884 13.0881 0.480085 12.675 0.460937C12.2808 0.460937 11.9043 0.552571 11.5453 0.733104C11.097 0.986123 10.7394 1.38548 10.5417 1.85596C10.4157 2.18147 10.218 3.15935 10.218 3.17713C10.0216 4.24528 9.91455 5.98222 9.91455 7.90243C9.91455 9.72964 10.0216 11.3955 10.1827 12.4814C10.2003 12.5005 10.3981 13.7137 10.6135 14.1294C11.0076 14.8899 11.7783 15.3603 12.6032 15.3603H12.675C13.2127 15.3426 14.3423 14.8707 14.3423 14.8543C16.2427 14.057 19.9891 11.5774 21.4953 9.92932C21.4953 9.92932 21.9206 9.50534 22.1048 9.24138C22.392 8.86117 22.5355 8.39069 22.5355 7.92021C22.5355 7.39503 22.3744 6.90677 22.0696 6.50741"
            fill="currentColor"></path>
        </svg>
      </div>

      <ul class="flex items-center flex-row text-sm font-semibold">
        <!-- Display pages with "..." -->
        <li v-for="page in getVisiblePages(props.pagination.current_page, props.pagination.last_page)" :key="page"
          class="mx-1">
          <span v-if="props.pagination.current_page === page"
            class="min-w-[32px] h-8 flex items-center justify-center border-gray-300 dark:border-opacity-0 border border-opacity-30 text-gray-700 bg-yellow-400 rounded-lg">
            {{ page }}
          </span>
          <button v-else-if="page !== '...'" @click="onPageUpdate(page)"
            class="min-w-[30px] h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700 border border-gray-300 border-opacity-30 dark:border-opacity-5 text-slate-700 rounded-lg transition duration-200 hover:bg-gray-600 hover:text-white">
            {{ page }}
          </button>
          <span v-else class="min-w-[30px] h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white border border-gray-300 border-opacity-30 dark:border-opacity-5 text-slate-700 rounded-lg">...</span>
        </li>
      </ul>

      <!-- Next page button -->
      <div class="flex items-center justify-center ms-3 ltr:rotate-180 hover:opacity-80 my-auto">
        <button v-if="props.pagination.current_page < props.pagination.last_page"
          @click="onPageUpdate(props.pagination.current_page + 1)" rel="next">
          <!-- SVG arrow right -->
          <svg class="w-4 h-4 -mt-1 text-gray-700 dark:text-white" viewBox="0 0 23 9" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.4"
              d="M16.6145 6.43275L21.2075 6.02655C22.2383 6.02655 23.074 6.8704 23.074 7.9112C23.074 8.952 22.2383 9.79585 21.2075 9.79585L16.6145 9.38965C15.8059 9.38965 15.1503 8.7277 15.1503 7.9112C15.1503 7.09333 15.8059 6.43275 16.6145 6.43275"
              fill="currentColor"></path>
            <path
              d="M1.19065 6.50741C1.26243 6.43492 1.53062 6.12856 1.78255 5.87418C3.25216 4.28084 7.08938 1.67543 9.09672 0.878077C9.40147 0.750884 10.1722 0.480085 10.5853 0.460937C10.9794 0.460937 11.356 0.552571 11.7149 0.733104C12.1632 0.986123 12.5208 1.38548 12.7186 1.85596C12.8445 2.18147 13.0423 3.15935 13.0423 3.17713C13.2387 4.24528 13.3457 5.98222 13.3457 7.90243C13.3457 9.72964 13.2387 11.3955 13.0775 12.4814C13.0599 12.5005 12.8622 13.7137 12.6468 14.1294C12.2526 14.8899 11.4819 15.3603 10.6571 15.3603H10.5853C10.0476 15.3426 8.91793 14.8707 8.91793 14.8543C7.0176 14.057 3.27112 11.5774 1.76494 9.92932C1.76494 9.92932 1.33964 9.50534 1.15543 9.24138C0.868281 8.86117 0.724707 8.39069 0.724707 7.92021C0.724707 7.39503 0.885889 6.90677 1.19065 6.50741"
              fill="currentColor"></path>
          </svg>
        </button>
        <svg v-else class="w-4 h-4 -mt-1 text-gray-700 dark:text-white opacity-50" viewBox="0 0 23 9" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.4"
            d="M16.6145 6.43275L21.2075 6.02655C22.2383 6.02655 23.074 6.8704 23.074 7.9112C23.074 8.952 22.2383 9.79585 21.2075 9.79585L16.6145 9.38965C15.8059 9.38965 15.1503 8.7277 15.1503 7.9112C15.1503 7.09333 15.8059 6.43275 16.6145 6.43275"
            fill="currentColor"></path>
          <path
            d="M1.19065 6.50741C1.26243 6.43492 1.53062 6.12856 1.78255 5.87418C3.25216 4.28084 7.08938 1.67543 9.09672 0.878077C9.40147 0.750884 10.1722 0.480085 10.5853 0.460937C10.9794 0.460937 11.356 0.552571 11.7149 0.733104C12.1632 0.986123 12.5208 1.38548 12.7186 1.85596C12.8445 2.18147 13.0423 3.15935 13.0423 3.17713C13.2387 4.24528 13.3457 5.98222 13.3457 7.90243C13.3457 9.72964 13.2387 11.3955 13.0775 12.4814C13.0599 12.5005 12.8622 13.7137 12.6468 14.1294C12.2526 14.8899 11.4819 15.3603 10.6571 15.3603H10.5853C10.0476 15.3426 8.91793 14.8707 8.91793 14.8543C7.0176 14.057 3.27112 11.5774 1.76494 9.92932C1.76494 9.92932 1.33964 9.50534 1.15543 9.24138C0.868281 8.86117 0.724707 8.39069 0.724707 7.92021C0.724707 7.39503 0.885889 6.90677 1.19065 6.50741"
            fill="currentColor"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* You can add your custom styles here */
</style>
