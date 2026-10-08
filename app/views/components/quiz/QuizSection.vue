<template>
    <div v-if="quizzes && quizzes.length" :id="sectionId" class="p-2 md:px-5 mb-8 bg-white dark:bg-gray-900 rounded-xl">
        <h4 class="text-gray-900 dark:text-yellow-400 text-lg font-bold sm:text-right text-center flex sm:justify-start justify-center items-center mb-4">
            <i class="bg-gray-900 dark:bg-yellow-400 rtl:ml-1 ltr:mr-1 w-2 h-2 rounded-full sm:flex hidden"></i>
            {{ title }}
        </h4>
        <div class="space-y-3">
            <QuizCard v-for="quiz in quizzes" :key="quiz.uuid" :quiz="quiz" :logged-in="loggedIn" :can-take-quiz="canTakeQuiz" />
        </div>
    </div>
</template>

<script>
import QuizCard from '@/views/components/quiz/QuizCard.vue';

export default {
    components: { QuizCard },
    props: {
        quizzes: { type: Array, default: () => [] },
        title: { type: String, required: true },
        sectionId: { type: String, default: 'quizzes' },
        loggedIn: { type: Boolean, default: false },
        canTakeQuiz: { type: Boolean, default: true },
    },
};
</script>
