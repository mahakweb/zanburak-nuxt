export const ADMIN_MENU_ITEMS = [
                {
                    key: "dashboard",
                    title: "داشبورد مدیریت",
                    icon: `<svg class="" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M2.8 1L2.74967 0.99997C2.52122 0.999752 2.32429 0.999564 2.14983 1.04145C1.60136 1.17312 1.17312 1.60136 1.04145 2.14983C0.999564 2.32429 0.999752 2.52122 0.99997 2.74967L1 2.8V5.2L0.99997 5.25033C0.999752 5.47878 0.999564 5.67572 1.04145 5.85017C1.17312 6.39864 1.60136 6.82688 2.14983 6.95856C2.32429 7.00044 2.52122 7.00025 2.74967 7.00003L2.8 7H5.2L5.25033 7.00003C5.47878 7.00025 5.67572 7.00044 5.85017 6.95856C6.39864 6.82688 6.82688 6.39864 6.95856 5.85017C7.00044 5.67572 7.00025 5.47878 7.00003 5.25033L7 5.2V2.8L7.00003 2.74967C7.00025 2.52122 7.00044 2.32429 6.95856 2.14983C6.82688 1.60136 6.39864 1.17312 5.85017 1.04145C5.67572 0.999564 5.47878 0.999752 5.25033 0.99997L5.2 1H2.8ZM2.38328 2.01382C2.42632 2.00348 2.49222 2 2.8 2H5.2C5.50779 2 5.57369 2.00348 5.61672 2.01382C5.79955 2.05771 5.94229 2.20045 5.98619 2.38328C5.99652 2.42632 6 2.49222 6 2.8V5.2C6 5.50779 5.99652 5.57369 5.98619 5.61672C5.94229 5.79955 5.79955 5.94229 5.61672 5.98619C5.57369 5.99652 5.50779 6 5.2 6H2.8C2.49222 6 2.42632 5.99652 2.38328 5.98619C2.20045 5.94229 2.05771 5.79955 2.01382 5.61672C2.00348 5.57369 2 5.50779 2 5.2V2.8C2 2.49222 2.00348 2.42632 2.01382 2.38328C2.05771 2.20045 2.20045 2.05771 2.38328 2.01382ZM9.8 1L9.74967 0.99997C9.52122 0.999752 9.32429 0.999564 9.14983 1.04145C8.60136 1.17312 8.17312 1.60136 8.04145 2.14983C7.99956 2.32429 7.99975 2.52122 7.99997 2.74967L8 2.8V5.2L7.99997 5.25033C7.99975 5.47878 7.99956 5.67572 8.04145 5.85017C8.17312 6.39864 8.60136 6.82688 9.14983 6.95856C9.32429 7.00044 9.52122 7.00025 9.74967 7.00003L9.8 7H12.2L12.2503 7.00003C12.4788 7.00025 12.6757 7.00044 12.8502 6.95856C13.3986 6.82688 13.8269 6.39864 13.9586 5.85017C14.0004 5.67572 14.0003 5.47878 14 5.25033L14 5.2V2.8L14 2.74967C14.0003 2.52122 14.0004 2.32429 13.9586 2.14983C13.8269 1.60136 13.3986 1.17312 12.8502 1.04145C12.6757 0.999564 12.4788 0.999752 12.2503 0.99997L12.2 1H9.8ZM9.38328 2.01382C9.42632 2.00348 9.49222 2 9.8 2H12.2C12.5078 2 12.5737 2.00348 12.6167 2.01382C12.7995 2.05771 12.9423 2.20045 12.9862 2.38328C12.9965 2.42632 13 2.49222 13 2.8V5.2C13 5.50779 12.9965 5.57369 12.9862 5.61672C12.9423 5.79955 12.7995 5.94229 12.6167 5.98619C12.5737 5.99652 12.5078 6 12.2 6H9.8C9.49222 6 9.42632 5.99652 9.38328 5.98619C9.20045 5.94229 9.05771 5.79955 9.01382 5.61672C9.00348 5.57369 9 5.50779 9 5.2V2.8C9 2.49222 9.00348 2.42632 9.01382 2.38328C9.05771 2.20045 9.20045 2.05771 9.38328 2.01382ZM2.74967 7.99997L2.8 8H5.2L5.25033 7.99997C5.47878 7.99975 5.67572 7.99956 5.85017 8.04145C6.39864 8.17312 6.82688 8.60136 6.95856 9.14983C7.00044 9.32429 7.00025 9.52122 7.00003 9.74967L7 9.8V12.2L7.00003 12.2503C7.00025 12.4788 7.00044 12.6757 6.95856 12.8502C6.82688 13.3986 6.39864 13.8269 5.85017 13.9586C5.67572 14.0004 5.47878 14.0003 5.25033 14L5.2 14H2.8L2.74967 14C2.52122 14.0003 2.32429 14.0004 2.14983 13.9586C1.60136 13.8269 1.17312 13.3986 1.04145 12.8502C0.999564 12.6757 0.999752 12.4788 0.99997 12.2503L1 12.2V9.8L0.99997 9.74967C0.999752 9.52122 0.999564 9.32429 1.04145 9.14983C1.17312 8.60136 1.60136 8.17312 2.14983 8.04145C2.32429 7.99956 2.52122 7.99975 2.74967 7.99997ZM2.8 9C2.49222 9 2.42632 9.00348 2.38328 9.01382C2.20045 9.05771 2.05771 9.20045 2.01382 9.38328C2.00348 9.42632 2 9.49222 2 9.8V12.2C2 12.5078 2.00348 12.5737 2.01382 12.6167C2.05771 12.7995 2.20045 12.9423 2.38328 12.9862C2.42632 12.9965 2.49222 13 2.8 13H5.2C5.50779 13 5.57369 12.9965 5.61672 12.9862C5.79955 12.9423 5.94229 12.7995 5.98619 12.6167C5.99652 12.5737 6 12.5078 6 12.2V9.8C6 9.49222 5.99652 9.42632 5.98619 9.38328C5.94229 9.20045 5.79955 9.05771 5.61672 9.01382C5.57369 9.00348 5.50779 9 5.2 9H2.8ZM9.8 8L9.74967 7.99997C9.52122 7.99975 9.32429 7.99956 9.14983 8.04145C8.60136 8.17312 8.17312 8.60136 8.04145 9.14983C7.99956 9.32429 7.99975 9.52122 7.99997 9.74967L8 9.8V12.2L7.99997 12.2503C7.99975 12.4788 7.99956 12.6757 8.04145 12.8502C8.17312 13.3986 8.60136 13.8269 9.14983 13.9586C9.32429 14.0004 9.52122 14.0003 9.74967 14L9.8 14H12.2L12.2503 14C12.4788 14.0003 12.6757 14.0004 12.8502 13.9586C13.3986 13.8269 13.8269 13.3986 13.9586 12.8502C14.0004 12.6757 14.0003 12.4788 14 12.2503L14 12.2V9.8L14 9.74967C14.0003 9.52122 14.0004 9.32429 13.9586 9.14983C13.8269 8.60136 13.3986 8.17312 12.8502 8.04145C12.6757 7.99956 12.4788 7.99975 12.2503 7.99997L12.2 8H9.8ZM9.38328 9.01382C9.42632 9.00348 9.49222 9 9.8 9H12.2C12.5078 9 12.5737 9.00348 12.6167 9.01382C12.7995 9.05771 12.9423 9.20045 12.9862 9.38328C12.9965 9.42632 13 9.49222 13 9.8V12.2C13 12.5078 12.9965 12.5737 12.9862 12.6167C12.9423 12.7995 12.7995 12.9423 12.6167 12.9862C12.5737 12.9965 12.5078 13 12.2 13H9.8C9.49222 13 9.42632 12.9965 9.38328 12.9862C9.20045 12.9423 9.05771 12.7995 9.01382 12.6167C9.00348 12.5737 9 12.5078 9 12.2V9.8C9 9.49222 9.00348 9.42632 9.01382 9.38328C9.05771 9.20045 9.20045 9.05771 9.38328 9.01382Z"
                        fill="currentColor"
                    ></path>
                </svg>`,
                    link: "admin-index",
                    submenu: [],
                },
                {
                    key: "users",
                    title: "مدیریت کاربران",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="6" r="4" stroke="currentColor" stroke-width="1.5"></circle>
                            <path d="M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3" stroke="currentColor"
                                stroke-width="1.5" stroke-linecap="round"></path>
                            <ellipse cx="9" cy="17" rx="7" ry="4" stroke="currentColor" stroke-width="1.5"></ellipse>
                            <path d="M18 14C19.7542 14.3847 21 15.3589 21 16.5C21 17.5293 19.9863 18.4229 18.5 18.8704"
                            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "all-users",
                            title: "فهرست کاربران",
                            link: "admin-users-list",
                            icon: ``,
                        },
                        {
                            key: "add-user",
                            title: "ثبت کاربر جدید",
                            link: "admin-create-user",
                            icon: ``,
                        },
                        {
                            key: "permissions",
                            title: "مدیریت دسترسی‌ها",
                            link: "admin-permissions-list",
                            icon: ``,
                        },
                        {
                            key: "roles",
                            title: "مدیریت نقش‌ها",
                            link: "admin-roles-list",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "courses",
                    title: "مدیریت دوره‌ها",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15Z" stroke="currentColor"
                                    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M2.52002 7.11011H21.48" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path d="M8.52002 2.11011V6.97011" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path d="M15.48 2.11011V6.52011" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                                <path
                                    d="M9.75 14.4501V13.2501C9.75 11.7101 10.84 11.0801 12.17 11.8501L13.21 12.4501L14.25 13.0501C15.58 13.8201 15.58 15.0801 14.25 15.8501L13.21 16.4501L12.17 17.0501C10.84 17.8201 9.75 17.1901 9.75 15.6501V14.4501V14.4501Z"
                                    stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "all-courses",
                            title: "فهرست دوره‌ها",
                            link: "admin-courses-list",
                            icon: ``,
                        },
                        {
                            key: "add-course",
                            title: "ایجاد دوره جدید",
                            link: "admin-course-create",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "paths",
                    title: "مدیریت مسیرهای یادگیری",
                    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H14C16.7614 6 19 8.23858 19 11C19 13.7614 16.7614 16 14 16H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <circle cx="4" cy="6" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="10" cy="16" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                            <circle cx="19" cy="11" r="1.5" stroke="currentColor" stroke-width="1.5"/>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "paths-list",
                            title: "فهرست مسیرها",
                            link: "admin-paths-list",
                            icon: ``,
                        },
                        {
                            key: "path-create",
                            title: "ایجاد مسیر یادگیری",
                            link: "admin-path-create",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "content-taxonomy",
                    title: "تنظیمات داده‌های پایه",
                    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M18 16L20 18L18 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "categories",
                            title: "دسته‌بندی دوره‌ها",
                            link: "admin-categories-list",
                            icon: ``,
                        },
                        {
                            key: "add-category",
                            title: "ایجاد دسته‌بندی دوره",
                            link: "admin-category-create",
                            icon: ``,
                        },
                        {
                            key: "levels",
                            title: "سطح‌های آموزشی",
                            link: "admin-levels-list",
                            icon: ``,
                        },
                        {
                            key: "missions",
                            title: "مدیریت ماموریت‌ها",
                            link: "admin-missions-list",
                            icon: ``,
                        },
                        {
                            key: "statuses",
                            title: "وضعیت‌های انتشار دوره",
                            link: "admin-statuses-list",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "certificates",
                    title: "مدیریت گواهینامه‌ها",
                    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 12L11 14L15 10M7 3H17C18.6569 3 20 4.34315 20 6V18C20 19.6569 18.6569 21 17 21H7C5.34315 21 4 19.6569 4 18V6C4 4.34315 5.34315 3 7 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>`,
                    link: "",
                    submenu: [
                        { key: "certificates-list", title: "فهرست گواهینامه‌ها", link: "admin-certificates", icon: `` },
                        { key: "certificate-templates", title: "قالب‌های گواهینامه", link: "admin-certificate-templates", icon: `` },
                    ],
                },
                {
                    key: "payments",
                    title: "مدیریت پرداخت‌ها",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 9V7C17 4.79086 15.2091 3 13 3H5C2.79086 3 1 4.79086 1 7V17C1 19.2091 2.79086 21 5 21H13C15.2091 21 17 19.2091 17 17V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M7 13L10 16L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M20 3L20 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M17 6L23 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "payments-list",
                            title: "فهرست تراکنش‌ها",
                            link: "admin-payments-list",
                            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>`,
                        },
                        {
                            key: "settlements",
                            title: "تسویه‌ها",
                            link: "admin-settlements",
                            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 7H20M4 12H20M4 17H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <path d="M17 15L19 17L23 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>`,
                        },
                        {
                            key: "settlement-settings",
                            title: "تنظیمات سهم تسویه",
                            link: "admin-settlement-settings",
                            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                                <circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.5"/>
                            </svg>`,
                        },
                        {
                            key: "bank-accounts",
                            title: "حساب‌های بانکی",
                            link: "admin-bank-accounts",
                            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M2 10H22" stroke="currentColor" stroke-width="1.5"/>
                            </svg>`,
                        },
                        {
                            key: "create-payment",
                            title: "ثبت پرداخت دستی",
                            link: "admin-payments-create",
                            icon: `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>`,
                        },
                    ],
                },
                {
                    key: "projects",
                    title: "درخواست‌های پروژه",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 7C4 5.34315 5.34315 4 7 4H13C14.6569 4 16 5.34315 16 7V17C16 18.6569 14.6569 20 13 20H7C5.34315 20 4 18.6569 4 17V7Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M16 8H17C18.6569 8 20 9.34315 20 11V15C20 16.6569 18.6569 18 17 18H13" stroke="currentColor" stroke-width="1.5"/>
                        </svg>`,
                    link: "admin-projects",
                    submenu: [],
                },
                {
                    key: "cooperations",
                    title: "درخواست‌های همکاری",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="6" r="4" stroke="currentColor" stroke-width="1.5"></circle>
                            <path d="M15 9C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            <ellipse cx="9" cy="17" rx="7" ry="4" stroke="currentColor" stroke-width="1.5"></ellipse>
                            </svg>`,
                    link: "admin-cooperations",
                    submenu: [],
                },
                {
                    key: "plans",
                    title: "مدیریت پلن‌ها",
                    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 6V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M6 9V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M18 3V18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "plans-list",
                            title: "فهرست پلن‌ها",
                            link: "admin-plans-list",
                            icon: ``,
                        },
                        {
                            key: "plan-create",
                            title: "ایجاد پلن جدید",
                            link: "admin-plan-create",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "quizzes",
                    title: "مدیریت آزمون‌ها",
                    icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="currentColor" stroke-width="1.5"/>
                            <path d="M9 12H15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            <path d="M9 16H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                        </svg>`,
                    link: "",
                    submenu: [
                        { key: "quizzes-list", title: "فهرست آزمون‌ها", link: "admin-quizzes-list", icon: `` },
                        { key: "quiz-create", title: "ایجاد آزمون", link: "admin-quiz-create", icon: `` },
                        { key: "quiz-questions", title: "بانک سوال", link: "admin-quiz-questions", icon: `` },
                    ],
                },
                {
                    key: "discounts",
                    title: "مدیریت کدهای تخفیف",
                    icon: `    <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M18 3.91992H6C3.79086 3.91992 2 5.71078 2 7.91992V17.9199C2 20.1291 3.79086 21.9199 6 21.9199H18C20.2091 21.9199 22 20.1291 22 17.9199V7.91992C22 5.71078 20.2091 3.91992 18 3.91992Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M7 17.9199L17 7.91992" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                                        stroke-linejoin="round"></path>
                                    <path
                                        d="M8 11.9199C9.10457 11.9199 10 11.0245 10 9.91992C10 8.81535 9.10457 7.91992 8 7.91992C6.89543 7.91992 6 8.81535 6 9.91992C6 11.0245 6.89543 11.9199 8 11.9199Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path
                                        d="M16 17.9199C17.1046 17.9199 18 17.0245 18 15.9199C18 14.8154 17.1046 13.9199 16 13.9199C14.8954 13.9199 14 14.8154 14 15.9199C14 17.0245 14.8954 17.9199 16 17.9199Z"
                                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "all-discounts",
                            title: "فهرست کدهای تخفیف",
                            link: "admin-discounts-list",
                            icon: ``,
                        },
                        {
                            key: "add-discount",
                            title: "ایجاد کد تخفیف",
                            link: "admin-discount-create",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "reports",
                    title: "گزارش‌ها و آمار",
                    icon: `<svg class="" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <path stroke="currentColor" stroke-width="1.5" d="M2,2V20a2,2,0,0,0,2,2H22"></path>
                                <path stroke="currentColor" stroke-width="1.5" d="M6,18V8.5A3.5,3.5,0,0,1,9.5,5h0A3.5,3.5,0,0,1,13,8.5v2.3A7.2,7.2,0,0,0,20.2,18H22">
                                </path>
                            </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "sales-report",
                            title: "گزارش فروش و درآمد",
                            link: "admin-sales-report",
                            icon: ``,
                        },
                        {
                            key: "user-activity",
                            title: "گزارش فعالیت کاربران",
                            link: "admin-user-activity-report",
                            icon: ``,
                        },
                        {
                            key: "content-views",
                            title: "آمار بازدید محتوا",
                            link: "admin-views",
                            icon: ``,
                        },
                        {
                            key: "engagement",
                            title: "آمار لایک و بوکمارک",
                            link: "admin-engagement",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "support",
                    title: "پشتیبانی و ارتباط با کاربران",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor" stroke-width="1.5"></path>
                            <path
                                d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                stroke="currentColor" stroke-width="1.5"></path>
                            <path d="M6 6L9.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            <path d="M18 6L14.5 9.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            <path d="M18 18L14.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                            <path d="M6 18L9.5 14.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "comments",
                            title: "مدیریت نظرات دوره‌ها",
                            link: "admin-comments",
                            icon: ``,
                        },
                        {
                            key: "tickets",
                            title: "صندوق ایمیل",
                            link: "admin-inbox",
                            icon: ``,
                        },
                        {
                            key: "user-reports",
                            title: "گزارش‌های ارسالی کاربران",
                            link: "admin-reports",
                            icon: ``,
                        },
                        {
                            key: "articles",
                            title: "مدیریت مقالات",
                            link: "admin-articles",
                            icon: ``,
                        },
                        {
                            key: "article-categories",
                            title: "دسته‌بندی مقالات",
                            link: "admin-article-categories",
                            icon: ``,
                        },
                        {
                            key: "faq",
                            title: "پرسش‌های متداول (FAQ)",
                            link: "admin-faqs",
                            icon: ``,
                        },
                        {
                            key: "questions",
                            title: "انجمن پرسش و پاسخ",
                            link: "admin-questions",
                            icon: ``,
                        },
                        {
                            key: "question-categories",
                            title: "دسته‌بندی‌های پرسش و پاسخ",
                            link: "admin-question-categories",
                            icon: ``,
                        },
                        {
                            key: "tags",
                            title: "مدیریت تگ‌ها",
                            link: "admin-tags",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "notifications",
                    title: "مدیریت اطلاع‌رسانی",
                    icon: `<svg class="" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "event-groups",
                            title: "گروه‌های رویداد اطلاع‌رسانی",
                            link: "admin-event-groups",
                            icon: ``,
                        },
                        {
                            key: "events",
                            title: "رویدادهای اطلاع‌رسانی",
                            link: "admin-events",
                            icon: ``,
                        },
                    ],
                },
                {
                    key: "settings",
                    title: "تنظیمات سامانه",
                    icon: `<svg class="animate-spin group-hover:animate-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                                stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                            <path
                                d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
                                stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
                                stroke-linejoin="round"></path>
                        </svg>`,
                    link: "",
                    submenu: [
                        {
                            key: "general-settings",
                            title: "تنظیمات عمومی",
                            link: "",
                            icon: ``,
                        },
                        {
                            key: "messenger-settings",
                            title: "تنظیمات پیام‌رسان",
                            link: "admin-messenger-settings",
                            icon: ``,
                        },
                        {
                            key: "payment-settings",
                            title: "تنظیمات درگاه پرداخت",
                            link: "",
                            icon: ``,
                        },
                        {
                            key: "settlement-share-settings",
                            title: "تنظیمات سهم تسویه",
                            link: "admin-settlement-settings",
                            icon: ``,
                        },
                        {
                            key: "seo-settings",
                            title: "تنظیمات SEO",
                            link: "",
                            icon: ``,
                        },
                        {
                            key: "api-routes-access",
                            title: "کنترل دسترسی API",
                            link: "admin-api-routes",
                            icon: ``,
                        },
                        {
                            key: "system-resources",
                            title: "منابع سیستم",
                            link: "admin-system-resources",
                            icon: ``,
                        },
                        {
                            key: "laravel-logs",
                            title: "لاگ Laravel",
                            link: "admin-laravel-logs",
                            icon: ``,
                        },
                    ],
                },
            ];
