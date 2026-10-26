module.exports = {
  async redirects() {
    return [
      {
        source: "/live",
        destination: "https://www.twitch.tv/eohillinois",
        permanent: true,
      },
      {
        source: '/guide',
        destination: '/visit/guide',
        permanent: true,
      },
      // Pages folded into /visit and /faq (2026-10-25)
      {
        source: '/visit/getting-here',
        destination: '/visit#getting-here',
        permanent: true,
      },
      {
        source: '/visit/food',
        destination: '/faq#food-faqs',
        permanent: true,
      },
      // Pages merged to cut the menu down (2026-10-25)
      { source: '/msdc', destination: '/schools/design-competitions#msdc', permanent: true },
      { source: '/hsdc', destination: '/schools/design-competitions#hsdc', permanent: true },
      { source: '/explore/initiatives', destination: '/explore/awards#world-quantum-day', permanent: true },
      { source: '/future-dates', destination: '/about#future-dates', permanent: true },
      // Old pages with 2023 or 2025 content, sent to their current equivalents
      { source: '/events-list', destination: '/explore/special-events', permanent: true },
      { source: '/exhibitors', destination: '/get-involved#exhibit', permanent: true },
      { source: '/independent-attend', destination: '/visit', permanent: true },
      { source: '/showcase.pdf', destination: '/startup-showcase', permanent: true },
    ]
  },
}
