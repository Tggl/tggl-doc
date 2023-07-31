// @ts-check
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Tggl Doc',
  tagline: 'Dinosaurs are cool',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.png',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),

        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Doc',
        logo: {
          alt: 'Tggl',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'doc/index',
            position: 'left',
            label: 'Documentation',
          },
          {
            type: 'doc',
            docId: 'help/index',
            position: 'left',
            label: 'Help Center',
          },
          {
            type: 'doc',
            docId: 'developers/index',
            position: 'left',
            label: 'Developers',
          },
          {
            href: 'https://app.tggl.io',
            label: 'App',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                to: '/docs/doc/use-cases/environments',
                label: 'Documentation',
              },
              // {
              //   to: '/docs/api',
              //   label: 'API',
              // },
              // {
              //   to: '/docs/developers/sdks',
              //   label: 'SDKs',
              // },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/TgglHQ',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Tggl',
              },
            ],
          },
        ],
        copyright: `Made with ♥ in Paris`,
      },
      prism: {
        theme: darkCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['php'],
      },
    }),
  plugins: [
    [
      '@docusaurus/plugin-ideal-image',
      {
        quality: 70,
        max: 1600,
        min: 400,
        steps: 6,
        disableInDev: false,
      },
    ],
  ],
};

module.exports = config;
