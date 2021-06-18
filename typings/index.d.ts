type SiteMap = {
  urlset: {
    $: { xmlns: string };
    url: Array<{ loc: string[]; changefreq: string[]; priority: string[] }>;
  };
};
