export type ContentItem = { _key: string; title: string; description: string };

// Approved website copy. Sanity can override each section without changing the layout.
export const contentDefaults = {
  hero: {
    title: "Reliable Power.",
    accent: "Made Affordable.",
    description:
      "Power your home or business with quality solar solutions designed around your energy needs and your budget.",
    detail:
      "From solar panels and lithium batteries to inverters, solar generators, streetlights and professional installation, we help you make the switch to dependable power—with expert guidance every step of the way.",
  },
  problem: {
    title: "Tired of paying more for power you can’t depend on?",
    description:
      "Rising fuel costs. Constant power outages. Generator noise. Business downtime.",
    concern: "What if I buy the wrong system?",
    reassurance:
      "At Ohreassa Technology, we understand that reliable power isn’t a luxury. It’s something your home and business depend on.",
  },
  solution: {
    title: "Power your life without the power worries.",
    description:
      "Ohreassa Technology provides quality, affordable solar solutions designed around how you actually use electricity.",
    detail:
      "Whether you need backup power for your home, reliable energy for your business, or a complete solar system, we’ll help you find the right solution for your needs and budget.",
  },
  approach: {
    title: "Your power needs are different. Your solution should be too.",
    description:
      "Not every home needs the same solar system. Not every business uses power the same way. That’s why we don’t believe in one-size-fits-all solutions.",
    detail:
      "Tell us what you need to power, and we’ll help you choose the right combination of products for your energy needs.",
    reassurance: "You don’t need to be a solar expert. That’s our job.",
  },
  products: {
    title: "Shop quality solar products",
    description:
      "Everything you need to build a reliable power system, all in one place.",
    items: [
      {
        _key: "batteries",
        title: "Lithium batteries",
        description: "Reliable energy storage for your home or business.",
      },
      {
        _key: "panels",
        title: "Solar panels",
        description:
          "Quality panels designed to turn sunlight into usable power.",
      },
      {
        _key: "inverters",
        title: "Inverters",
        description:
          "Efficient power conversion and management for your solar system.",
      },
      {
        _key: "generators",
        title: "Solar generators",
        description:
          "Convenient backup power for homes, businesses and everyday use.",
      },
      {
        _key: "streetlights",
        title: "Solar streetlights",
        description:
          "Reliable lighting for streets, estates, compounds and outdoor spaces.",
      },
      {
        _key: "accessories",
        title: "Solar accessories",
        description:
          "Essential components and accessories for your solar setup.",
      },
    ] as ContentItem[],
  },
  solutions: {
    title: "Solutions built around what you need to power",
    description:
      "Whether you’re powering a home, running a business or lighting an outdoor space, we have a solution for you.",
    items: [
      {
        _key: "homes",
        title: "For homes",
        description:
          "Keep your essential appliances running and enjoy more reliable power at home.",
      },
      {
        _key: "businesses",
        title: "For businesses",
        description:
          "Keep your business operating, even when the grid goes down.",
      },
      {
        _key: "outdoors",
        title: "For outdoor spaces",
        description:
          "Light up streets, compounds, estates and other spaces with dependable solar lighting.",
      },
    ] as ContentItem[],
  },
  benefits: {
    title: "More than solar products. A power solution you can trust.",
    description:
      "Buying solar is a big investment. You deserve more than a product delivered to your doorstep. With Ohreassa, you get the products, expertise and support to make your investment count.",
    items: [
      {
        _key: "quality",
        title: "Quality you can trust",
        description:
          "We provide quality solar products built for dependable performance.",
      },
      {
        _key: "prices",
        title: "Affordable prices",
        description:
          "Reliable power shouldn’t be out of reach. We offer competitive prices without compromising on quality.",
      },
      {
        _key: "advice",
        title: "Expert advice",
        description:
          "We help you understand your options and choose what fits your needs.",
      },
      {
        _key: "installation",
        title: "Professional installation",
        description:
          "Our team helps ensure your solar system is properly installed and ready to perform.",
      },
      {
        _key: "support",
        title: "Warranty & after-sales support",
        description:
          "We’re here beyond the sale, with warranty and support when you need us.",
      },
      {
        _key: "service",
        title: "Customer-first service",
        description:
          "We listen, understand your needs and focus on finding the right solution for you.",
      },
    ] as ContentItem[],
  },
  experience: {
    title: "7+ years of helping Nigerians power what matters",
    description:
      "For over 7 years, Ohreassa Technology has helped homes and businesses across Nigeria move toward more reliable power.",
    detail:
      "Our commitment doesn’t stop at the sale. From choosing the right product to installation and after-sales support, we’re with you throughout the journey.",
    items: [
      { _key: "years", title: "7+", description: "Years in business" },
      { _key: "customers", title: "1,000+", description: "Customers served" },
      {
        _key: "reach",
        title: "Across Nigeria",
        description: "Homes & businesses",
      },
    ] as ContentItem[],
  },
  services: {
    title: "Your power needs. Our expertise.",
    description:
      "From choosing the right products to professional installation and after-sales support, we help you build a solar solution around your needs and your budget.",
    items: [
      {
        _key: "advice",
        title: "Solar advice & product selection",
        description:
          "Tell us what you want to power, how long you need it to run and your budget. We’ll help you choose a suitable combination of panels, batteries, inverters and accessories.",
      },
      {
        _key: "installation",
        title: "Professional solar installation",
        description:
          "Our team helps ensure your solar system is properly installed and ready to perform. Talk to us about your home or business, and we’ll confirm the scope, cost and timing for your project.",
      },
      {
        _key: "support",
        title: "Warranty & after-sales support",
        description:
          "Our support continues beyond the sale. Contact our team for product guidance and warranty assistance. Coverage varies by product and is stated on each applicable product page.",
      },
    ] as ContentItem[],
  },
  faq: {
    title: "Frequently asked questions",
    description: "Straight answers. A clearer path to solar.",
    items: [
      {
        _key: "sizing",
        title: "What solar system do I need for my home?",
        description:
          "It depends on the appliances you want to power, how long you want to run them and your typical energy usage. We’ll help you determine the right system for your needs.",
      },
      {
        _key: "ac",
        title: "Can your solar systems power an AC?",
        description:
          "Yes. The right system can power an AC, but the required capacity depends on your AC and other appliances you want to run.",
      },
      {
        _key: "cost",
        title: "How much does it cost to power a 3-bedroom house?",
        description:
          "The cost depends on your appliances, energy consumption and how much backup power you need. We’ll recommend a suitable solution based on your requirements.",
      },
      {
        _key: "installation",
        title: "Do you offer installation?",
        description:
          "Yes. We provide professional solar installation services.",
      },
      {
        _key: "warranty",
        title: "Do your products come with a warranty?",
        description:
          "Yes. Warranty coverage varies by product and is clearly stated with each applicable product.",
      },
      {
        _key: "delivery",
        title: "Do you deliver across Nigeria?",
        description:
          "Yes. We serve customers across Nigeria. Our team confirms the delivery fee and timing for your location before payment.",
      },
      {
        _key: "individual",
        title: "Can I buy individual solar products?",
        description:
          "Yes. You can purchase individual products including panels, batteries, inverters, solar generators, streetlights and accessories.",
      },
      {
        _key: "help",
        title: "I don’t know what products I need. Can you help?",
        description:
          "Absolutely. Tell us what you want to power, and we’ll recommend a suitable solution for your needs and budget.",
      },
    ] as ContentItem[],
  },
  finalCta: {
    title: "Ready to take control of your power?",
    description:
      "You don’t have to keep depending on expensive fuel or struggling with power outages. Whether you need a single solar product or a complete system for your home or business, we’re ready to help.",
    reassurance: "Reliable power starts here.",
  },
};

export type WebsiteContent = typeof contentDefaults;
export type WebsiteContentInput = {
  [K in keyof WebsiteContent]?: Partial<WebsiteContent[K]> | null;
};

export function resolveWebsiteContent(
  input?: WebsiteContentInput | null,
): WebsiteContent {
  return Object.fromEntries(
    Object.entries(contentDefaults).map(([key, defaults]) => {
      const custom = input?.[key as keyof WebsiteContent];
      return [
        key,
        {
          ...defaults,
          ...Object.fromEntries(
            Object.entries(custom || {}).filter(([, value]) => value != null),
          ),
        },
      ];
    }),
  ) as WebsiteContent;
}
