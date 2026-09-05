export const helpCategories = [
  "All topics",
  "Getting started",
  "Playback",
  "Your library",
  "Your profile",
];
export const helpArticles = [
  {
    slug: "getting-started",
    category: "Getting started",
    title: "Your first night with CINÉ",
    summary: "Find a film, explore its story, and start a preview.",
    time: "2 min read",
    steps: [
      {
        title: "Follow a film that catches your eye",
        text: "Start on Home for our featured film and curated picks. Open Films for the complete catalog, or In focus for the animated Denis Villeneuve collection.",
      },
      {
        title: "Make it your kind of cinema",
        text: "Use the film library’s search to find a title, cast member, or release year. Genre filters and sorting help narrow the selection. Tap a poster to open its film page.",
      },
      {
        title: "Enter the story",
        text: "On the film page, choose Watch preview or the circular play button. The current preview uses the Big Buck Bunny trailer to demonstrate playback. It is clearly labeled and is not the selected commercial film.",
      },
      {
        title: "Keep something for later",
        text: "Tap a bookmark or Add to my list to save a film. Open My list from the navigation whenever you’re ready for your next movie night.",
      },
    ],
  },
  {
    slug: "playback-help",
    category: "Playback",
    title: "When a preview won’t play",
    summary: "A few simple checks to get back to the story.",
    time: "3 min read",
    steps: [
      {
        title: "Try the play control",
        text: "Some browsers prevent automatic playback with sound. Press the video’s own play button after opening the player. Check that your device and the player are not muted.",
      },
      {
        title: "Retry the preview",
        text: "If the player shows an error, choose Try again. If it remains stuck, return to the film page, reload it, and open the preview again.",
      },
      {
        title: "Check your connection and browser",
        text: "Confirm that the site loads and try another film’s preview. Use a browser with HTML5 video support. Browser extensions that block media can interfere with playback; try a window without those extensions.",
      },
      {
        title: "Save the details if it keeps happening",
        text: "Use Save a support request and describe the film, device, browser, and error message. Requests are stored in this preview for your reference. No support team or email delivery is connected yet.",
      },
    ],
  },
  {
    slug: "player-controls",
    category: "Playback",
    title: "Make the player feel like home",
    summary: "Playback, sound, fullscreen, and optional descriptions.",
    time: "2 min read",
    steps: [
      {
        title: "Play, pause, and seek",
        text: "Use the native video controls to play or pause. Drag the timeline to jump to another moment. The demo trailer is approximately 33 seconds long; the runtime displayed on a film page describes the actual film.",
      },
      {
        title: "Adjust the experience",
        text: "Use the player’s volume and fullscreen buttons where your browser supports them. On mobile, tap the video to reveal its controls. The demo includes an optional English descriptions track, available from the captions control; it is not a complete transcript.",
      },
      {
        title: "Pick up where you left off",
        text: "Progress saves during playback and when you pause or leave the player. A partially watched preview appears in Continue watching on Home and in your library’s viewing history.",
      },
    ],
  },
  {
    slug: "your-watchlist",
    category: "Your library",
    title: "Build your next movie night",
    summary: "Save films, manage your list, and find viewing history.",
    time: "2 min read",
    steps: [
      {
        title: "Save a film",
        text: "Tap the bookmark on Home or in the film catalog, or choose Add to my list on a film page. A filled bookmark means the film is saved.",
      },
      {
        title: "Find your collection",
        text: "Open My list for the full library. The My list tab shows saved films; Viewing history shows previews you have explored. You can search and filter within either tab.",
      },
      {
        title: "Remove a film",
        text: "Tap a filled bookmark again to remove a film from your saved list. This does not remove its viewing progress. You can save the film again at any time.",
      },
      {
        title: "Keep the same browser profile",
        text: "Your list is associated with this browser’s guest cookie. It survives ordinary page reloads. A different browser or clearing cookies starts a new guest profile.",
      },
    ],
  },
  {
    slug: "your-profile",
    category: "Your profile",
    title: "A space that’s yours",
    summary: "Your display name, guest session, and saved data.",
    time: "2 min read",
    steps: [
      {
        title: "Set your name",
        text: "Open Your space and enter a display name of 1–40 characters. Choose Save changes. This updates your guest profile and the greeting shown in the collection’s profile panel.",
      },
      {
        title: "Understand guest profiles",
        text: "This version of CINÉ uses a browser-specific guest profile. There is no account password or email sign-in. Your profile, saved films, progress, and support requests are linked to a secure random session cookie.",
      },
      {
        title: "Know what stays with you",
        text: "Using the same browser profile keeps your data available. Clearing the session cookie or switching browsers creates a new profile. Cross-device synchronization and account recovery are not available in this preview.",
      },
    ],
  },
  {
    slug: "about-previews",
    category: "Getting started",
    title: "What can I watch here?",
    summary: "About the curated catalog and sample screenings.",
    time: "1 min read",
    steps: [
      {
        title: "Explore the film collection",
        text: "CINÉ currently features seven films by Denis Villeneuve, with artwork, cast, descriptions, and curated metadata. These pages demonstrate how a streaming catalog looks and works.",
      },
      {
        title: "Watch a sample screening",
        text: "By default, every film opens the same open-licensed Big Buck Bunny trailer by Blender Foundation. The player labels it as demo playback. No full commercial movies are included.",
      },
      {
        title: "No subscription required",
        text: "You do not need to enter payment details to explore this version. Subscriptions, billing, and paid access are not enabled.",
      },
    ],
  },
];
export const faqs = [
  {
    question: "Do I need an account to get started?",
    answer:
      "No. A guest profile is created for this browser. You can explore films, save a list, and watch sample previews without signing up.",
  },
  {
    question: "Why does every film play the same trailer?",
    answer:
      "This is a working platform preview. The Big Buck Bunny trailer demonstrates the player while the commercial titles demonstrate the film catalog. Full commercial films are not included.",
  },
  {
    question: "Will my list be here when I come back?",
    answer:
      "Yes, when you return using the same browser profile and retain its cookies. Lists are saved in the application database. Clearing cookies or using another browser creates a separate guest profile.",
  },
  {
    question: "Can I continue a preview from where I stopped?",
    answer:
      "Yes. A partially watched preview appears on Home under Continue watching and in your library’s viewing history. Completed previews start from the beginning when played again.",
  },
  {
    question: "What happens when I save a support request?",
    answer:
      "Your request is stored with your guest profile and appears in Your requests. You can review, close, and reopen it. This preview does not send emails or connect to a support team.",
  },
];
