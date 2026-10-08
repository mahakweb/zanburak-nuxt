<script>

/**
 * Emoji Picker
 * Load emojis and  categories from the json file 'emojis-data.json'
 * Events:
 *  - 'emoji_click' event is fires when the user clicks on an emoji. The emoji is sent as event payload.
 * Props:
 * 	- 'show_arrow' boolean to show or not the arrow at the bottom of the picker. True by default.
 */

import data from './emojis-data.json';

export default {
    props:
    {
        show_arrow:
        {
            type: Boolean,
            required: false,
            default: false
        }
    },
    computed:
    {
        categories() {
            return Object.keys(data);
        },

        category_emojis: () => (category) => {
            return Object.values(data[category]);
        }
    },
    methods:
    {
        handleEmojiClick(e, emoji) {
            e.preventDefault();
            this.$emit('emoji_click', emoji);
        }
    }
}
</script>

<template>
    <div dir="ltr" class="flex flex-col" v-for="category in categories" :key="`category_${category}`">
        <span class="my-1 text-xs font-semibold text-gray-400 dark:text-gray-500">{{ category }}</span>
        <div class="flex flex-wrap">
            <button class="text-lg" @click="handleEmojiClick($event, emoji)" v-for="(emoji, index) in category_emojis(category)"
                :key="`emoji_${index}`">
                {{ emoji }}
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>