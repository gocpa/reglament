import {themes as prismThemes} from 'prism-react-renderer';


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GoCPA.Reglament',
  tagline: 'Сборник регламентов и новостей отдела заказной разработки GoCPA',

  url: 'https://reglament.gocpa.space/',
 
  baseUrl: '/',

  organizationName: 'GoCPA',
  projectName: 'custom-dev-reglaments',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ru',
    locales: ['ru'],
  },

  presets: [
    [
      'classic',
      {
        docs: false, // Отключаем стандартный docs
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'regulations',
        path: 'docs/regulations',
        routeBasePath: 'regulations',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'instructions',
        path: 'docs/instructions',
        routeBasePath: 'instructions',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'documentation',
        path: 'docs/documentation',
        routeBasePath: 'documentation',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'GoCPA.Reglament',
        items: [
          { to: '/regulations', label: 'Регламенты', position: 'left' },
          { to: '/instructions', label: 'Инструкции', position: 'left' },
          { to: '/documentation', label: 'Документация', position: 'left' },
          {to: '/blog', label: 'Новости', position: 'left'},
        ],
      },
    }),
};

export default config;
