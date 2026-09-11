/* =========================================================================
   MIZTWEAKZ. Site data
   -------------------------------------------------------------------------
   Every piece of store content lives here so the modals and renderers in
   site.js can render from one source of truth. Navigation now comes from
   Shopify linklists and the free-download URL is a theme setting.
   Load this BEFORE site.js (layout/theme.liquid does).

   Shape:
     MZ.brand      . Names, tagline, announcement, socials, emails, URLs
     MZ.categories . The four /packs/ sections (drive the Packs dropdown)
     MZ.packs      . Every product (price, compare-at, features, reviews…);
                      image/imageLg/imageFallback = real box art (webp 512/768 + png)
     MZ.delivery   , "Delivery" / "What You'll Receive" accordion copy
     MZ.reviews    . Real Judge.me reviews (verbatim), keyed to packs
     MZ.homeReviews. Ids used by the home testimonial marquee, in order
     MZ.faqs       , home FAQ; MZ.affiliateFaqs, /affiliates/ FAQ
     MZ.stats      . Hero stat pills
     MZ.features   , "why MIZTWEAKZ" feature grid
     MZ.games      . Marquee badges
     MZ.creators   , "Trusted by the best" creators (About page)
     MZ.helpers    . Tiny formatters shared by pages (money, stars)
   Copy is verbatim from miztweakz.com unless a field is marked `(new)`.
   ========================================================================= */
(function () {
  'use strict';

  /* Shopify assets are flat. window.MZ.assetBase is set by layout/theme.liquid and ends in '/assets/'.
     Sub-folders of the static site became filename prefixes: brand/x -> brand-x, games/x -> games-x. */
  var IMG = (window.MZ && window.MZ.assetBase) || '/assets/';
  var BRAND = IMG + 'brand-'; // real storefront imagery, built by tools/img/build-assets.mjs

  var MZ = {
    brand: {
      name: 'MIZTWEAKZ',
      legalName: 'MIZTWEAKS',
      owner: 'Mizery',
      tagline: 'PC tweaks and Windows optimization for competitive gamers.', // (new)
      announcement: '',
      announcementHref: '/',
      description:
        'MizTweaks offers professional PC tweaks, Windows optimization, FPS optimization, input lag reduction, latency optimization, debloat tools, network tweaks, and gaming performance enhancements. Improve responsiveness, boost FPS, optimize your PC for gaming, and get the most out of your hardware.',
      socials: {
        discord: 'https://discord.gg/tT4HSfAWrt',
        discordContact: 'https://discord.gg/w9kZpXtkjR',
        youtube: 'https://www.youtube.com/@MIZTWEAKZ',
        tiktok: 'https://www.tiktok.com/@miz_tweakz',
        instagram: 'https://www.instagram.com/miz_tweakz',
        twitch: 'https://www.twitch.tv/miz_tweakz',   // (new) handle assumed to match TikTok/Instagram; confirm with owner
        kick: 'https://kick.com/miz_tweakz'           // (new) same assumption
      },
      email: 'miztweakzteam@gmail.com',
      businessEmail: 'rmizeryinc@gmail.com',
      shopUrl: 'https://www.miztweakz.com/collections/all',
      affiliateUrl: 'https://miztweakz.goaffpro.com/create-account',
      videos: [
        { id: '2qGGoF08cHA', title: 'i5-13420H, RTX 4050 to 16GB RAM' },
        { id: '8f5-mHrQJ08', title: 'Ultra 9 185H, RTX 4070 (Laptop), 16GB RAM' }
      ],
      reviewCount: 51,
      reviewAverage: 4.92,
      activeUsers: '4000+',
      year: 2026
    },

    /* The four sections of /packs/. `color` is used as --color on tags,
       buttons and card glows; `gradient` marks the featured "Apex-style" tier. */
    categories: [
      { id: 'fps', label: 'FPS', title: 'FPS Pack', href: '/', color: '#bc312a', pack: 'fps-pack' },
      { id: 'ping', label: 'Ping', title: 'Ping Pack', href: '/', color: '#e85a51', pack: 'pc-ping-package' },
      { id: 'delay', label: 'Delay', title: 'Delay Pack', href: '/', color: '#ffffff', pack: 'delay-pack' },
      { id: 'ultimate', label: 'Ultimate Bundle', title: 'Ultimate Bundle', href: '/', color: '#bc312a', color2: '#e85a51', gradient: true, pack: 'ultimate-bundle' }
    ],

    packs: [
      {
        handle: 'fps-pack',
        category: 'fps',
        name: 'PC FPS Pack',
        short: 'FPS Pack',
        price: 24.99,
        compareAt: 49.99,
        url: 'https://www.miztweakz.com/products/fps-pack',
        image: BRAND + 'pack-fps.webp',
        imageLg: BRAND + 'pack-fps-lg.webp',
        imageFallback: BRAND + 'pack-fps.png',
        icon: 'gauge',
        color: '#bc312a',
        tagline: 'Unlock every frame your hardware can give.', // (new)
        description: 'Registry, power and GPU tweaks that push your frame rate up and keep it there. No sketchy third-party tools, just the settings the pros run.', // (new)
        features: [
          'Registry Files to Boost Performance',
          'Power Settings for Maximum Performance',
          'Debloated Discord to Boost FPS',
          'Bonus NVIDIA Settings for FPS',
          'Advanced System Optimization for Maximum Performance'
        ],
        reviewCount: 4,
        rating: 5.0
      },
      {
        handle: 'pc-ping-package',
        category: 'ping',
        name: 'PC Ping Pack',
        short: 'Ping Pack',
        price: 24.99,
        compareAt: 49.99,
        url: 'https://www.miztweakz.com/products/pc-ping-package',
        image: BRAND + 'pack-ping.webp',
        imageLg: BRAND + 'pack-ping-lg.webp',
        imageFallback: BRAND + 'pack-ping.png',
        icon: 'signal',
        color: '#e85a51',
        tagline: 'Lower, more stable ping without touching your ISP.', // (new)
        description: 'Network registry files and telemetry cuts that give you a lower, steadier connection in every lobby.', // (new)
        features: [
          'Network Registry Files for Lower & Stable Ping',
          'Disabling Network Data Collection',
          'Reduction of Telemetry Settings',
          'Advanced System Optimization for Maximum Performance'
        ],
        reviewCount: 4,
        rating: 4.75
      },
      {
        handle: 'delay-pack',
        category: 'delay',
        name: 'PC Delay Pack',
        short: 'Delay Pack',
        price: 24.99,
        compareAt: 49.99,
        url: 'https://www.miztweakz.com/products/delay-pack',
        image: BRAND + 'pack-delay.webp',
        imageLg: BRAND + 'pack-delay-lg.webp',
        imageFallback: BRAND + 'pack-delay.png',
        icon: 'bolt',
        color: '#ffffff',
        tagline: 'Make every click and flick land instantly.', // (new)
        description: 'Service reduction plus custom keyboard, mouse and controller tweaks that shave input delay so your inputs register the moment you make them.', // (new)
        features: [
          'Lowers Delay for KBM & Controller',
          'PC Service Reduction to Reduce Input Delay',
          'Custom KBM Tweaks for Lower Delay',
          'Lower Process Count for Optimal Delay',
          'Advanced System Optimization for Maximum Performance'
        ],
        reviewCount: 2,
        rating: 5.0
      },
      {
        handle: 'debloat-tool',
        category: 'utilities',
        name: 'PC Debloat Tool',
        short: 'Debloat Tool',
        price: 14.99,
        compareAt: 29.99,
        url: 'https://www.miztweakz.com/products/debloat-tool',
        image: BRAND + 'pack-debloat.webp',
        imageLg: BRAND + 'pack-debloat-lg.webp',
        imageFallback: BRAND + 'pack-debloat.png',
        icon: 'broom',
        color: '#e85a51',
        tag: 'NEW',
        tagline: 'One click. A cleaner, faster Windows.', // (new)
        description: 'Strip Windows down to what your games actually need. Fewer background processes, faster boots and lower input delay in a single click.', // (new)
        features: [
          'One-Click Full System Debloat for Maximum Performance',
          'Disables Unnecessary Services to Reduce Input Delay',
          'Custom Privacy & Telemetry Tweaks for a Cleaner System',
          'Lowers Background Process Count for Optimal Responsiveness',
          'Advanced Registry Optimization for Faster Boot & Response Times'
        ],
        reviewCount: 0,
        rating: null
      },
      {
        handle: 'ultimate-bundle',
        category: 'ultimate',
        name: 'PC Ultimate Bundle',
        short: 'Ultimate Bundle',
        price: 39.99,
        compareAt: 89.99,
        url: 'https://www.miztweakz.com/products/ultimate-bundle',
        image: BRAND + 'pack-ultimate.webp',
        imageLg: BRAND + 'pack-ultimate-lg.webp',
        imageFallback: BRAND + 'pack-ultimate.png',
        icon: 'crown',
        color: '#bc312a',
        color2: '#e85a51',
        gradient: true,
        featured: true,
        tag: 'Most Value',
        tagline: 'Every pack. One download. Maximum performance.', // (new)
        description: 'Every MIZTWEAKZ pack in one download, FPS, Ping, Delay and Debloat, for less than the price of two.', // (new)
        features: [
          'Contains Everything from the PING, FPS, Debloat, and Delay Packages',
          'Lowers Delay for KBM & Controller',
          'Network Registry Files for Lower & Stable Ping',
          'GPU/CPU Settings for Increased Performance',
          'Custom KBM Tweaks for Lower Delay',
          'Advanced System Optimization for Maximum Performance'
        ],
        reviewCount: 27,
        rating: 4.89
      }
    ],

    /* Product-page accordions (identical on every product). */
    delivery: {
      title: 'Delivery',
      text: 'The app is ready to use right after install.',
      receiveTitle: "What You'll Receive",
      receive: [
        { icon: 'download', title: 'Instant Access', text: 'The MizTweakz app' },
        { icon: 'book', title: 'Easy Setup', text: 'Easy to follow guide' },
        { icon: 'infinity', title: 'Auto Updates', text: 'The app keeps itself up to date' }
      ],
      refund: 'Because the product is instantly delivered to your device, we offer no refunds.'
    },

    /* Verbatim Judge.me reviews (all Verified Buyer). `avatar` points at one
       of the five generated avatar SVGs; reviews without one render a CSS
       initials circle. `pack` is a pack handle ('xbox-pack' is unlisted). */
    reviews: [
      { id: 'r1', name: 'Anonymous', initials: 'A', rating: 5, date: '2026-07-28', title: '', body: 'Gave me 100 more fps and 10 less ping', pack: 'ultimate-bundle' },
      { id: 'r2', name: 'Chase Fiely', initials: 'CF', avatar: IMG + 'avatar-1.svg', rating: 5, date: '2026-04-05', title: 'Never expected it to be THIS GOOD', body: "It was great,I didn't think that it was worth the original cost but then it was 50% off soI bought it. Worth every pennie no longer lag even though there always like teoTVsand three phones on the wifi", pack: 'ultimate-bundle' },
      { id: 'r3', name: 'phozyfnr', initials: 'P', rating: 5, date: '2026-03-30', title: 'i got like zero delay and more stable fps W', body: 'i got like zero delay and more stable fps W tweaks!', pack: 'ultimate-bundle' },
      { id: 'r4', name: 'Murphy', initials: 'MU', avatar: IMG + 'avatar-2.svg', rating: 5, date: '2026-03-26', title: 'Boosted my fps', body: 'Boosted my fps by 90, so im very happy about that, and my system is somehow more stable', pack: 'fps-pack' },
      { id: 'r5', name: 'misha', initials: 'M', rating: 5, date: '2026-01-31', title: 'Misha', body: 'For 30 gbp such good value. The best tweaks on the market went down 30 ping and up 80 fps', pack: 'ultimate-bundle' },
      { id: 'r6', name: 'SickoFN', initials: 'S', rating: 5, date: '2026-01-31', title: 'PC FPS Pack', body: 'Got to over 200FPS helps a bunch for my clips W MIZ', pack: 'fps-pack' },
      { id: 'r7', name: 'Teagan Bailey', initials: 'TB', avatar: IMG + 'avatar-3.svg', rating: 5, date: '2025-11-27', title: 'Best purchase of all time', body: "Before I bought this pack, i was getting a constant 60-70 ping. Ever since I bought this pack I've been at around 30-25 ping. Which unbelievable, it has helped me a lot since I've gotten it at improving my gameplay, because of the lower ping. Hands down the best thing I've ever boughten!!!", pack: 'pc-ping-package' },
      { id: 'r8', name: 'Haiden', initials: 'HA', avatar: IMG + 'avatar-4.svg', rating: 5, date: '2025-12-11', title: 'These are goated my game is running smooth better than ever', body: 'These are goated my game is running smooth better than ever. Didnt even have to disable anything W MANS', pack: 'ultimate-bundle' },
      { id: 'r9', name: 'Harry', initials: 'H', rating: 5, date: '2025-12-09', title: '', body: 'Went from having stutters and being on 30ms of ping to zero stutters and 0-10ms of ping. Goated bundle', pack: 'ultimate-bundle' },
      { id: 'r10', name: 'Jasper', initials: 'J', rating: 5, date: '2026-07-13', title: 'Holy tweaks', body: 'Yea, i kinda thought there would be no difference and jst get placebo that its better but WOW. my delay has been so much better and my game runs smoother!', pack: 'delay-pack' },
      { id: 'r11', name: 'Jake Meyerholtz', initials: 'JM', avatar: IMG + 'avatar-5.svg', rating: 5, date: '2025-09-12', title: 'Best Investment Yet', body: 'Miz Tweaks was the the best investment for my PC yet. It boosted my fps and lowered my ping and delay. Will definitely recommend to everyone I know.', pack: 'ultimate-bundle' },
      { id: 'r12', name: 'taico12', initials: 'T', rating: 5, date: '2025-12-20', title: 'Realy good for fortnite', body: 'Realy good for fortnite i went from 50-60 ping to 30-45', pack: 'ultimate-bundle' },
      { id: 'r13', name: 'Dayne Edwards', initials: 'DE', rating: 4, date: '2025-12-25', title: 'Really good over all', body: 'Really good over all, jump from 200 to 300 fps but I wish the ping package was better.', pack: 'ultimate-bundle' },
      { id: 'r14', name: 'Anonymous', initials: 'A', rating: 5, date: '2026-07-25', title: '', body: 'Max fps was 220, now up to 360 max', pack: 'fps-pack' },
      { id: 'r15', name: 'SORIN ASH', initials: 'SA', rating: 5, date: '2026-05-31', title: 'Amazing tweaks shoutout to', body: 'Amazing tweaks shoutout to miz', pack: 'delay-pack' },
      { id: 'r16', name: 'Anonymous', initials: 'A', rating: 5, date: '2026-01-02', title: '', body: 'used to play on 60 ping now i play on 15 thx', pack: 'pc-ping-package' },
      { id: 'r17', name: 'Lawrence Walsh', initials: 'LW', rating: 4, date: '2026-01-18', title: '', body: "Could be better. Dropped about five ping and this is with many optimizations I've done. Overall much more stable and smooth gameplay. Totally not a scam.", pack: 'pc-ping-package' },
      { id: 'r18', name: 'Adrian Fernandez', initials: 'AF', rating: 5, date: '2026-05-12', title: 'Great tweaks', body: "I honestly didn't entrust at first but this is actually great I used u tun like 220-240 fps not to stable and very high ping and now i can get up 400 fps in creative and stable 240 fps no stutters and I run a stable ping of 20 without Ethernet thanks mizery", pack: 'ultimate-bundle' },
      { id: 'r19', name: 'Teegan Williams', initials: 'TW', rating: 5, date: '2026-05-22', title: 'I got a 100 fps', body: 'I got a 100 fps boost', pack: 'ultimate-bundle' },
      { id: 'r20', name: 'Tarquin Shipman', initials: 'TS', rating: 5, date: '2025-05-20', title: 'Results', body: 'This helped stabilize my FPS and made streaming games way smoother. Before, I would have some crazy dips in my FPS when streaming games like Fortnite.', pack: 'fps-pack' },
      { id: 'r21', name: 'Anonymous', initials: 'A', rating: 5, date: '2026-01-26', title: '', body: 'My kid said it helped reduce lag.', pack: 'xbox-pack' }
    ],

    /* Home testimonial marquee order (9 cards ≈ 51 s loop at Paragon's
       5.67 s-per-card pace). Mirrors the live miztweakz.com carousel order. */
    homeReviews: ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'],

    faqs: [
      { q: 'What are Gaming Tweaks?', a: 'Tweaks are custom built PC optimizations that help improve FPS, reduce input lag, enhance responsiveness, and optimize Windows for better gaming performance.' },
      { q: 'What kind of performance boost can I expect?', a: 'Expect lower input delay, lower ping, and a noticeable increase in system responsiveness. Real users have reported an increase of 50-100 FPS. No gimmicks, just raw performance.' },
      { q: 'Is this safe for my setup?', a: 'Yes, 100%. Everything is tested, non-intrusive, and fully reversible. No sketchy third-party tools. Just elite system tweaks used by Mizery himself, and some pros!' },
      { q: 'Do I need to be tech-savvy to use it?', a: 'Not at all. The instructions and process are both crystal clear. Each package has a step-by-step guide and pro support if you need help along the way.' },
      { q: 'Does it work on all systems?', a: "It's optimized for Windows 10 & 11, and works on laptops, desktops! However, depending on the level of your setup, results may vary." },
      { q: 'What is your refund policy?', a: 'Because the product is instantly delivered to your device, we offer no refunds.' }
    ],

    affiliateFaqs: [
      { q: 'Do I have to be a content creator to join?', a: "Anyone is welcome to join! You don't need to be a content creator, just refer new users to get started. You can even begin by sharing with friends!" },
      { q: 'Why should I join?', a: "By joining, you have the opportunity to earn money either by monetizing your channel or simply by referring friends. It's a free and easy way to start earning." },
      { q: 'How much do I earn?', a: 'Our compensation structure is tiered, meaning your commission will increase as you earn more with us. The starting commission rate is 20%.' },
      { q: "I don't see my question?", a: 'Join the Discord and make a support ticket. Feel free to ask anything!' }
    ],

    /* Hero stat pills: value (display font) | label (body font). */
    stats: [
      { value: '4.92★', label: 'Avg. rating' },
      { value: '4,000+', label: 'Active users' },
      { value: 'Win 10 & 11', label: 'Fully reversible' }
    ],

    /* "Why MIZTWEAKZ" grid. Bullets lifted from the FAQ + product pages. */
    features: [
      { icon: 'shield', title: 'Tested', text: 'Every tweak is tested on real hardware before being added to the app. No sketchy third-party tools. Just elite system tweaks used by Mizery himself, and some pros.' },
      { icon: 'lock', title: 'Non-Intrusive', text: 'Registry and settings changes only. Trusted by thousands of gamers.' },
      { icon: 'undo', title: 'Fully Reversible', text: 'Changed your mind? Every tweak includes a restore path so you can undo it in minutes.' },
      { icon: 'book', title: 'Step-by-Step Guide', text: 'Crystal-clear instructions with every tweak. No tech skills needed.' },
      { icon: 'headset', title: 'Pro Support', text: 'Stuck? Open a ticket in the Discord and get direct support from the team along the way.' },
      { icon: 'download', title: 'Instant Delivery', text: 'Download the app, sign in and your tweaks are ready to apply in minutes.' }
    ],

    /* Before/after metrics. The FPS range is the store's own FAQ claim; ping is kept non-numeric (one review cited −30 ms, which is not a typical figure). */
    metrics: [
      { value: 'More', label: 'FPS', desc: '' },
      { value: 'Lower', label: 'Ping', desc: '' },
      { value: '100%', label: 'Reversible', desc: '' }
    ],

    /* Brand/game marquee. Generic text badges only. */
    games: [
      /* Real game marks from Wikimedia Commons (see README "Third-party logos"); h = display height in px */
      { name: 'Fortnite', image: IMG + 'games-fortnite.svg', h: 44 },
      { name: 'Valorant', image: IMG + 'games-valorant.svg', h: 64 },
      { name: 'Apex Legends', image: IMG + 'games-apex.svg', h: 60 },
      { name: 'Counter-Strike 2', image: IMG + 'games-cs2.svg', h: 40 },
      { name: 'Call of Duty: Warzone', image: IMG + 'games-warzone.webp', h: 52 },
      { name: 'Rocket League', image: IMG + 'games-rocket-league.svg', h: 56 }
    ],

    /* Real creator avatars (public storefront images); `avatar2x` is the 320px cut for HiDPI. */
    creators: [
      { name: 'Premfn', initials: 'PR', avatar: BRAND + 'creator-premfn.webp', avatar2x: BRAND + 'creator-premfn-320.webp' },
      { name: 'Npen', initials: 'NP', avatar: BRAND + 'creator-npen.webp', avatar2x: BRAND + 'creator-npen-320.webp' },
      { name: 'aero1x', initials: 'AE', avatar: BRAND + 'creator-aero1x.webp', avatar2x: BRAND + 'creator-aero1x-320.webp' }
    ],

    helpers: {
      money: function (n) {
        return '$' + Number(n).toFixed(2);
      },
      savings: function (pack) {
        return Math.round((1 - pack.price / pack.compareAt) * 100);
      },
      pack: function (handle) {
        for (var i = 0; i < MZ.packs.length; i++) if (MZ.packs[i].handle === handle) return MZ.packs[i];
        return null;
      },
      category: function (id) {
        for (var i = 0; i < MZ.categories.length; i++) if (MZ.categories[i].id === id) return MZ.categories[i];
        return null;
      },
      reviewsFor: function (handle) {
        return MZ.reviews.filter(function (r) { return r.pack === handle; });
      },
      formatDate: function (iso) {
        var d = new Date(iso + 'T00:00:00');
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
  };

  MZ.assetBase = IMG;
  window.MZ = MZ;
})();
