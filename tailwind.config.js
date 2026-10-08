/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{vue,js,ts}",
    "!./app/crypto/**/*.js",
    "!./app/store/messenger.module.js",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontSize: {
        'xxs': '0.625rem', // 10px
        'tiny': '0.5rem',  // 8px
      },
      fontFamily: {
        'YekanBakh': ['YekanBakh', 'sans-serif'],
        'anjoman': ['Anjoman', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 4s infinite linear',
      },
    },
  },

  daisyui: {
    themes: false,
    logs: false,
    darkTheme: "dark",
  },

  plugins: [
    require("daisyui"),
    // require('@tailwindcss/forms'), 
    // require('@tailwindcss/typography'),
    // require('flowbite/plugin')
    function ({ addComponents, theme }) {
      const colors = theme('colors');
      const shimmerUtilities = Object.entries(colors).reduce((acc, [colorName, colorValues]) => {
        if (typeof colorValues === 'object') {
          Object.entries(colorValues).forEach(([shade, value]) => {
            acc[`.shimmer-${colorName}-${shade}`] = {
              backgroundImage: `linear-gradient(-90deg, rgba(255,255,255,0) 25%, ${value} 50%, rgba(255,255,255,0) 75%)`,
              backgroundSize: '200% 100%',
            };
          });
        }
        return acc;
      }, {});

      addComponents(shimmerUtilities);
    },
  ],

  // daisyUI config (optional - here are the default values)
  // daisyui: {
  //   themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
  //   darkTheme: "dark", // name of one of the included themes for dark mode
  //   base: true, // applies background color and foreground color for root element by default
  //   styled: true, // include daisyUI colors and design decisions for all components
  //   utils: true, // adds responsive and modifier utility classes
  //   prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
  //   logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  //   themeRoot: ":root", // The element that receives theme color CSS variables
  // },
}

