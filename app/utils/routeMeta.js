/** Auto-generated from zanburak-frontend/src/routes/router.js */
export const ROUTE_META = {
  "panel-messenger": {
    "requiresAuth": true
  },
  "panel-messenger-join": {
    "requiresAuth": true
  },
  "panel-messenger-community": {
    "requiresAuth": true
  },
  "panel-messenger-chat": {
    "requiresAuth": true
  },
  "discuss-index": {
    "requiresAuth": false
  },
  "articles-index": {
    "requiresAuth": false
  },
  "what-is-vip": {
    "requiresAuth": false
  },
  "payment-receipt": {
    "requiresAuth": true
  },
  "NotFound": {
    "requiresAuth": false
  },
  "panel-courses": {
    "requiresAuth": true
  },
  "panel-questions": {
    "requiresAuth": true
  },
  "panel-financial": {
    "requiresAuth": true
  },
  "panel-vip": {
    "requiresAuth": true
  },
  "panel-followed": {
    "requiresAuth": true
  },
  "panel-comments": {
    "requiresAuth": true
  },
  "panel-messages": {
    "requiresAuth": true
  },
  "panel-notifications": {
    "requiresAuth": true
  },
  "panel-missions": {
    "requiresAuth": true
  },
  "panel-certifications": {
    "requiresAuth": true
  },
  "panel-profile": {
    "requiresAuth": true
  },
  "panel-profile-manage-phone": {
    "requiresAuth": true
  },
  "panel-profile-change-password": {
    "requiresAuth": true
  },
  "panel-profile-login-statistics": {
    "requiresAuth": true
  },
  "panel-profile-information-management": {
    "requiresAuth": true
  },
  "panel-profile-invite": {
    "requiresAuth": true
  },
  "admin-index": {
    "requiresAuth": true,
    "can": [
      "dashboard.view",
      "dashboard.view.own",
      "dashboard.view.any"
    ]
  },
  "admin-projects": {
    "requiresAuth": true,
    "can": [
      "users.view",
      "marketing.view"
    ]
  },
  "admin-cooperations": {
    "requiresAuth": true,
    "can": [
      "users.view",
      "marketing.view"
    ]
  },
  "admin-inbox": {
    "requiresAuth": true,
    "can": [
      "support.inbox.view"
    ]
  },
  "admin-course-create": {
    "requiresAuth": true,
    "can": [
      "courses.create"
    ]
  },
  "admin-course-edit": {
    "requiresAuth": true,
    "can": [
      "courses.update",
      "courses.update.own",
      "courses.update.any"
    ]
  },
  "admin-course-details": {
    "requiresAuth": true,
    "can": [
      "courses.view",
      "courses.overview.view",
      "courses.view.own",
      "courses.view.any"
    ]
  },
  "admin-courses-list": {
    "requiresAuth": true,
    "can": [
      "courses.view",
      "courses.list",
      "courses.view.own",
      "courses.view.any",
      "courses.list.any"
    ]
  },
  "admin-episode-create": {
    "requiresAuth": true,
    "can": [
      "episodes.create",
      "episodes.create.own",
      "episodes.create.any"
    ]
  },
  "admin-episode-edit": {
    "requiresAuth": true,
    "can": [
      "episodes.edit",
      "episodes.edit.own",
      "episodes.edit.any",
      "episodes.get_for_edit"
    ]
  },
  "admin-episode-details": {
    "requiresAuth": true,
    "can": [
      "episodes.get_for_edit",
      "episodes.edit",
      "episodes.edit.own",
      "episodes.edit.any",
      "courses.overview.view",
      "courses.view.own",
      "courses.view.any"
    ]
  },
  "admin-statuses-list": {
    "requiresAuth": true,
    "can": [
      "statuses.view"
    ]
  },
  "admin-levels-list": {
    "requiresAuth": true,
    "can": [
      "levels.view"
    ]
  },
  "admin-missions-list": {
    "requiresAuth": true,
    "can": [
      "missions.view"
    ]
  },
  "admin-permissions-list": {
    "requiresAuth": true,
    "can": [
      "security.access.view"
    ]
  },
  "admin-roles-list": {
    "requiresAuth": true,
    "can": [
      "security.access.view"
    ]
  },
  "admin-categories-list": {
    "requiresAuth": true,
    "can": [
      "categories.view"
    ]
  },
  "admin-category-create": {
    "requiresAuth": true,
    "can": [
      "categories.create"
    ]
  },
  "admin-category-edit": {
    "requiresAuth": true,
    "can": [
      "categories.edit"
    ]
  },
  "admin-users-list": {
    "requiresAuth": true,
    "can": [
      "users.view"
    ]
  },
  "admin-create-user": {
    "requiresAuth": true,
    "can": [
      "users.create"
    ]
  },
  "admin-user-details": {
    "requiresAuth": true,
    "can": [
      "users.view"
    ]
  },
  "admin-discounts-list": {
    "requiresAuth": true,
    "can": [
      "discounts.view"
    ]
  },
  "admin-discount-create": {
    "requiresAuth": true,
    "can": [
      "discounts.create"
    ]
  },
  "admin-discount-edit": {
    "requiresAuth": true,
    "can": [
      "discounts.update"
    ]
  },
  "admin-payments-list": {
    "requiresAuth": true,
    "can": [
      "payments.view",
      "payments.view.own",
      "payments.view.any"
    ]
  },
  "admin-settlements": {
    "requiresAuth": true,
    "can": [
      "settlements.view",
      "settlements.view.own",
      "settlements.view.any"
    ]
  },
  "admin-settlement-settings": {
    "requiresAuth": true,
    "superuserOnly": true
  },
  "admin-bank-accounts": {
    "requiresAuth": true,
    "can": [
      "bank_accounts.manage"
    ]
  },
  "admin-payments-create": {
    "requiresAuth": true,
    "can": [
      "payments.create"
    ]
  },
  "admin-payments-edit": {
    "requiresAuth": true,
    "can": [
      "payments.create"
    ]
  },
  "admin-plans-list": {
    "requiresAuth": true,
    "can": [
      "plans.view"
    ]
  },
  "admin-plan-create": {
    "requiresAuth": true,
    "can": [
      "plans.create"
    ]
  },
  "admin-plan-edit": {
    "requiresAuth": true,
    "can": [
      "plans.update"
    ]
  },
  "admin-paths-list": {
    "requiresAuth": true,
    "can": [
      "paths.view"
    ]
  },
  "admin-path-create": {
    "requiresAuth": true,
    "can": [
      "paths.create"
    ]
  },
  "admin-path-edit": {
    "requiresAuth": true,
    "can": [
      "paths.edit",
      "paths.update"
    ]
  },
  "admin-api-routes": {
    "requiresAuth": true,
    "can": [
      "security.routes.view",
      "security.routes.manage"
    ]
  },
  "admin-system-resources": {
    "requiresAuth": true,
    "can": [
      "system.resources.view"
    ]
  },
  "admin-laravel-logs": {
    "requiresAuth": true,
    "can": [
      "system.logs.view"
    ]
  },
  "admin-messenger-settings": {
    "requiresAuth": true,
    "can": [
      "messenger.settings.view",
      "messenger.settings.update"
    ]
  },
  "admin-forbidden": {
    "requiresAuth": true
  },
  "admin-faqs": {
    "requiresAuth": true,
    "can": [
      "articles.view",
      "articles.list",
      "articles.view.own",
      "articles.view.any",
      "articles.list.any"
    ]
  },
  "admin-questions": {
    "requiresAuth": true,
    "can": [
      "discuss.list"
    ]
  },
  "admin-articles": {
    "requiresAuth": true,
    "can": [
      "articles.view",
      "articles.list",
      "articles.view.own",
      "articles.view.any",
      "articles.list.any"
    ]
  },
  "admin-articles-stats": {
    "requiresAuth": true,
    "can": [
      "articles.stats.view",
      "articles.list.any",
      "articles.view.any"
    ]
  },
  "admin-article-edit": {
    "requiresAuth": true,
    "can": [
      "articles.update",
      "articles.update.own",
      "articles.update.any"
    ]
  },
  "admin-article-categories": {
    "requiresAuth": true,
    "can": [
      "articles.categories.manage",
      "articles.update.any"
    ]
  },
  "admin-article-details": {
    "requiresAuth": true,
    "can": [
      "articles.view",
      "articles.view.any",
      "articles.view.own",
      "articles.overview.view"
    ]
  },
  "admin-question-details": {
    "requiresAuth": true,
    "can": [
      "discuss.show"
    ]
  },
  "admin-question-categories": {
    "requiresAuth": true,
    "can": [
      "discuss.list"
    ]
  },
  "admin-tags": {
    "requiresAuth": true,
    "can": [
      "tags.view"
    ]
  },
  "admin-tag-details": {
    "requiresAuth": true,
    "can": [
      "tags.view"
    ]
  },
  "admin-reports": {
    "requiresAuth": true,
    "can": [
      "analytics.view",
      "analytics.view.own",
      "analytics.view.any"
    ]
  },
  "admin-sales-report": {
    "requiresAuth": true,
    "can": [
      "payments.view",
      "payments.stats",
      "payments.stats.own",
      "payments.stats.any",
      "payments.view.own",
      "payments.view.any",
      "analytics.view",
      "analytics.view.own",
      "analytics.view.any"
    ]
  },
  "admin-user-activity-report": {
    "requiresAuth": true,
    "can": [
      "users.view",
      "analytics.view",
      "analytics.view.any"
    ]
  },
  "admin-views": {
    "requiresAuth": true,
    "can": [
      "analytics.view",
      "analytics.view.own",
      "analytics.view.any",
      "courses.view.own",
      "courses.view.any"
    ]
  },
  "admin-engagement": {
    "requiresAuth": true,
    "can": [
      "analytics.view",
      "analytics.view.own",
      "analytics.view.any",
      "courses.view.own",
      "courses.view.any"
    ]
  },
  "admin-comments": {
    "requiresAuth": true,
    "can": [
      "comments.view",
      "comments.view.own",
      "comments.view.any",
      "comments.course.view.own",
      "comments.course.view.any"
    ]
  },
  "admin-certificates": {
    "requiresAuth": true,
    "can": [
      "certificates.view",
      "certificates.view.own",
      "certificates.view.any"
    ]
  },
  "admin-certificate-templates": {
    "requiresAuth": true,
    "can": [
      "certificates.templates.view"
    ]
  },
  "admin-certificate-template-create": {
    "requiresAuth": true,
    "can": [
      "certificates.templates.create"
    ]
  },
  "admin-certificate-template-edit": {
    "requiresAuth": true,
    "can": [
      "certificates.templates.update"
    ]
  },
  "admin-event-groups": {
    "requiresAuth": true,
    "can": [
      "notifications.view"
    ]
  },
  "admin-events": {
    "requiresAuth": true,
    "can": [
      "notifications.view"
    ]
  },
  "admin-quiz-create": {
    "requiresAuth": true,
    "can": [
      "quizzes.create",
      "quizzes.create.own",
      "quizzes.create.any"
    ]
  },
  "admin-quiz-edit": {
    "requiresAuth": true,
    "can": [
      "quizzes.update",
      "quizzes.update.own",
      "quizzes.update.any"
    ]
  },
  "admin-quiz-reports": {
    "requiresAuth": true,
    "can": [
      "quizzes.reports",
      "quizzes.reports.own",
      "quizzes.reports.any"
    ]
  },
  "admin-quiz-questions": {
    "requiresAuth": true,
    "can": [
      "quiz_questions.view",
      "quiz_questions.view.own",
      "quiz_questions.view.any"
    ]
  },
  "admin-quiz-question-create": {
    "requiresAuth": true,
    "can": [
      "quiz_questions.create"
    ]
  },
  "admin-quiz-question-edit": {
    "requiresAuth": true,
    "can": [
      "quiz_questions.update"
    ]
  },
  "quiz-intro": {
    "requiresAuth": true
  },
  "quiz-start": {
    "requiresAuth": true
  },
  "quiz-resume": {
    "requiresAuth": true
  },
  "quiz-result": {
    "requiresAuth": true
  },
  "quiz-history": {
    "requiresAuth": true
  },
  "admin-article-create": {
    "requiresAuth": true,
    "can": [
      "articles.create"
    ]
  },
  "admin-quizzes-list": {
    "requiresAuth": true,
    "can": [
      "quizzes.view",
      "quizzes.view.own",
      "quizzes.view.any"
    ]
  }
};
