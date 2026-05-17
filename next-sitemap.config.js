/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://winagro.bj',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/admin/*'],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/formation/'),
    await config.transform(config, '/produits/'),
    await config.transform(config, '/installation-ferme/'),
    await config.transform(config, '/consultation/'),
    await config.transform(config, '/blog/'),
    await config.transform(config, '/faq/'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      }
    ],
    additionalSitemaps: [
      'https://winagro.bj/sitemap-images.xml',
      'https://winagro.bj/sitemap-blog.xml',
    ],
  },
}
