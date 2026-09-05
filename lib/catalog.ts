export type WatchPlatform = {
  name: string;
  type: "Stream" | "Subscription" | "Rent / Buy" | "Trailer / 4K" | "Watch 4K";
  url: string;
  badge?: string;
  bg?: string;
};

export type Film = {
  id: string;
  title: string;
  year: number;
  duration: number;
  rating: string;
  certificate: string;
  genres: string[];
  description: string;
  tagline: string;
  image: string;
  backdrop: string;
  color: string;
  cast: { name: string; role: string }[];
  studio: string;
  director?: string;
  youtubeId?: string;
  trailerUrl?: string;
  platforms?: WatchPlatform[];
};

export const films: Film[] = [
  {
    "id": "arrival",
    "title": "Arrival",
    "year": 2016,
    "duration": 116,
    "rating": "7.9",
    "certificate": "PG-13",
    "genres": [
      "Sci-fi",
      "Drama"
    ],
    "image": "/images/arrival-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/arrival-wide.jpg?v=1788626277513346000",
    "color": "#526568",
    "tagline": "Why are they here?",
    "studio": "Paramount Pictures",
    "director": "Denis Villeneuve",
    "description": "When mysterious spacecraft arrive on Earth, a linguist is recruited to find a way to communicate with their passengers. What she discovers will change the way she understands time, memory, and love.",
    "cast": [
      {
        "name": "Amy Adams",
        "role": "Louise Banks"
      },
      {
        "name": "Jeremy Renner",
        "role": "Ian Donnelly"
      },
      {
        "name": "Forest Whitaker",
        "role": "Colonel Weber"
      }
    ],
    "youtubeId": "tFMo3UJ4B4g",
    "trailerUrl": "https://www.youtube.com/watch?v=tFMo3UJ4B4g"
  },
  {
    "id": "dune-part-two",
    "title": "Dune: Part Two",
    "year": 2024,
    "duration": 166,
    "rating": "8.6",
    "certificate": "PG-13",
    "genres": [
      "Sci-fi",
      "Adventure"
    ],
    "image": "/images/dune-two-poster.jpg?v=1788626277513346000",
    "backdrop": "/images/dune-two-hero-4k.jpg?v=1788626277513346000",
    "color": "#9d6537",
    "tagline": "Long live the fighters.",
    "studio": "Warner Bros. Pictures",
    "director": "Denis Villeneuve",
    "description": "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
    "cast": [
      {
        "name": "Timoth\u00e9e Chalamet",
        "role": "Paul Atreides"
      },
      {
        "name": "Zendaya",
        "role": "Chani"
      },
      {
        "name": "Rebecca Ferguson",
        "role": "Lady Jessica"
      }
    ],
    "youtubeId": "Way9Dexny3w",
    "trailerUrl": "https://www.youtube.com/watch?v=Way9Dexny3w"
  },
  {
    "id": "blade-runner-2049",
    "title": "Blade Runner 2049",
    "year": 2017,
    "duration": 164,
    "rating": "8.0",
    "certificate": "R",
    "genres": [
      "Sci-fi",
      "Thriller"
    ],
    "image": "/images/blade-runner-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/blade-runner-wide.jpg?v=1788626277513346000",
    "color": "#c47b38",
    "tagline": "The key to the future is finally unearthed.",
    "studio": "Warner Bros. Pictures",
    "director": "Denis Villeneuve",
    "description": "Thirty years after the events of the original film, LAPD blade runner Officer K unearths a long-buried secret that leads him on a quest to find Rick Deckard, missing for three decades.",
    "cast": [
      {
        "name": "Ryan Gosling",
        "role": "K"
      },
      {
        "name": "Harrison Ford",
        "role": "Rick Deckard"
      },
      {
        "name": "Ana de Armas",
        "role": "Joi"
      }
    ],
    "youtubeId": "gCcx85zbxz4",
    "trailerUrl": "https://www.youtube.com/watch?v=gCcx85zbxz4"
  },
  {
    "id": "dune",
    "title": "Dune",
    "year": 2021,
    "duration": 155,
    "rating": "8.0",
    "certificate": "PG-13",
    "genres": [
      "Sci-fi",
      "Adventure"
    ],
    "image": "/images/dune-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/dune-wide.jpg?v=1788626277513346000",
    "color": "#94764d",
    "tagline": "Beyond fear, destiny awaits.",
    "studio": "Warner Bros. Pictures",
    "director": "Denis Villeneuve",
    "description": "Paul Atreides, a brilliant young nobleman, must travel to Arrakis \u2014 the most dangerous planet in the cosmos \u2014 to secure the future of his family and his people as malevolent forces erupt into conflict.",
    "cast": [
      {
        "name": "Timoth\u00e9e Chalamet",
        "role": "Paul Atreides"
      },
      {
        "name": "Rebecca Ferguson",
        "role": "Lady Jessica"
      },
      {
        "name": "Oscar Isaac",
        "role": "Duke Leto Atreides"
      },
      {
        "name": "Zendaya",
        "role": "Chani"
      }
    ],
    "youtubeId": "n9xhJrPXop4",
    "trailerUrl": "https://www.youtube.com/watch?v=n9xhJrPXop4"
  },
  {
    "id": "prisoners",
    "title": "Prisoners",
    "year": 2013,
    "duration": 153,
    "rating": "8.1",
    "certificate": "R",
    "genres": [
      "Thriller",
      "Drama"
    ],
    "image": "/images/prisoners-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/prisoners-wide.jpg?v=1788626277513346000",
    "color": "#5b665c",
    "tagline": "Every moment matters.",
    "studio": "Warner Bros. Pictures",
    "director": "Denis Villeneuve",
    "description": "When two young girls vanish in suburban Pennsylvania, a desperate father clashes with the detective heading the investigation and takes matters into his own hands.",
    "cast": [
      {
        "name": "Hugh Jackman",
        "role": "Keller Dover"
      },
      {
        "name": "Jake Gyllenhaal",
        "role": "Detective Loki"
      },
      {
        "name": "Viola Davis",
        "role": "Nancy Birch"
      }
    ],
    "youtubeId": "bpXfcTdl55E",
    "trailerUrl": "https://www.youtube.com/watch?v=bpXfcTdl55E"
  },
  {
    "id": "enemy",
    "title": "Enemy",
    "year": 2013,
    "duration": 90,
    "rating": "6.9",
    "certificate": "R",
    "genres": [
      "Thriller",
      "Mystery"
    ],
    "image": "/images/enemy-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/enemy-wide.jpg?v=1788626277513346000",
    "color": "#8c7e43",
    "tagline": "Chaos is order yet undeciphered.",
    "studio": "A24",
    "director": "Denis Villeneuve",
    "description": "A college history professor rents a movie and spots an actor who looks identical to him. Driven by obsession, he tracks down his double, unraveling the fabric of his reality.",
    "cast": [
      {
        "name": "Jake Gyllenhaal",
        "role": "Adam Bell / Anthony Claire"
      },
      {
        "name": "M\u00e9lanie Laurent",
        "role": "Mary"
      },
      {
        "name": "Sarah Gadon",
        "role": "Helen Claire"
      }
    ],
    "youtubeId": "FJuaAWrgoUY",
    "trailerUrl": "https://www.youtube.com/watch?v=FJuaAWrgoUY"
  },
  {
    "id": "sicario",
    "title": "Sicario",
    "year": 2015,
    "duration": 121,
    "rating": "7.7",
    "certificate": "R",
    "genres": [
      "Thriller",
      "Action"
    ],
    "image": "/images/sicario-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/sicario-wide.jpg?v=1788626277513346000",
    "color": "#726752",
    "tagline": "The border is just another line to cross.",
    "studio": "Lionsgate",
    "director": "Denis Villeneuve",
    "description": "An idealistic FBI agent joins a government task force working along the U.S.\u2013Mexico border. Led into an increasingly uncertain operation, she finds the line between justice and revenge disappearing.",
    "cast": [
      {
        "name": "Emily Blunt",
        "role": "Kate Macer"
      },
      {
        "name": "Benicio del Toro",
        "role": "Alejandro"
      },
      {
        "name": "Josh Brolin",
        "role": "Matt Graver"
      }
    ],
    "youtubeId": "sR0SDT2GeFg",
    "trailerUrl": "https://www.youtube.com/watch?v=sR0SDT2GeFg"
  },
  {
    "id": "lion-king",
    "title": "The Lion King",
    "year": 1994,
    "duration": 89,
    "rating": "8.5",
    "certificate": "G",
    "genres": [
      "Animation",
      "Drama",
      "Adventure"
    ],
    "image": "/images/lion-king.jpg?v=1788626277513346000",
    "backdrop": "/images/lion-king-wide.jpg?v=1788626277513346000",
    "color": "#e87b28",
    "tagline": "The Circle of Life.",
    "studio": "Walt Disney Animation Studios",
    "director": "Roger Allers & Rob Minkoff",
    "description": "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself. Simba flees into exile only to return and reclaim his rightful place as king.",
    "cast": [
      {
        "name": "Matthew Broderick",
        "role": "Simba (voice)"
      },
      {
        "name": "James Earl Jones",
        "role": "Mufasa (voice)"
      },
      {
        "name": "Jeremy Irons",
        "role": "Scar (voice)"
      }
    ],
    "youtubeId": "lFzVJEksoDY",
    "trailerUrl": "https://www.youtube.com/watch?v=lFzVJEksoDY"
  },
  {
    "id": "aladdin",
    "title": "Aladdin",
    "year": 1992,
    "duration": 90,
    "rating": "8.0",
    "certificate": "G",
    "genres": [
      "Animation",
      "Adventure",
      "Fantasy"
    ],
    "image": "/images/aladdin.jpg?v=1788626277513346000",
    "backdrop": "/images/aladdin.jpg?v=1788626277513346000",
    "color": "#4478c9",
    "tagline": "Wish granted.",
    "studio": "Walt Disney Pictures",
    "director": "John Musker & Ron Clements",
    "description": "A kindhearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.",
    "cast": [
      {
        "name": "Scott Weinger",
        "role": "Aladdin (voice)"
      },
      {
        "name": "Robin Williams",
        "role": "Genie (voice)"
      },
      {
        "name": "Linda Larkin",
        "role": "Jasmine (voice)"
      }
    ],
    "youtubeId": "eTjHiQKJZTU",
    "trailerUrl": "https://www.youtube.com/watch?v=eTjHiQKJZTU"
  },
  {
    "id": "moana",
    "title": "Moana",
    "year": 2016,
    "duration": 107,
    "rating": "7.6",
    "certificate": "PG",
    "genres": [
      "Animation",
      "Adventure",
      "Family"
    ],
    "image": "/images/moana.jpg?v=1788626277513346000",
    "backdrop": "/images/moana.jpg?v=1788626277513346000",
    "color": "#29a3a8",
    "tagline": "The ocean calls.",
    "studio": "Walt Disney Animation Studios",
    "director": "Ron Clements & John Musker",
    "description": "In Ancient Polynesia, when a terrible curse incurred by the Demigod Maui reaches Moana's island, she answers the Ocean's call to seek out the Demigod to set things right.",
    "cast": [
      {
        "name": "Auli'i Cravalho",
        "role": "Moana (voice)"
      },
      {
        "name": "Dwayne Johnson",
        "role": "Maui (voice)"
      },
      {
        "name": "Rachel House",
        "role": "Gramma Tala (voice)"
      }
    ],
    "youtubeId": "LKFuXETZUsI",
    "trailerUrl": "https://www.youtube.com/watch?v=LKFuXETZUsI"
  },
  {
    "id": "frozen",
    "title": "Frozen",
    "year": 2013,
    "duration": 102,
    "rating": "7.4",
    "certificate": "PG",
    "genres": [
      "Animation",
      "Adventure",
      "Fantasy"
    ],
    "image": "/images/frozen.jpg?v=1788626277513346000",
    "backdrop": "/images/frozen.jpg?v=1788626277513346000",
    "color": "#69b7eb",
    "tagline": "Fearless and frozen.",
    "studio": "Walt Disney Animation Studios",
    "director": "Chris Buck & Jennifer Lee",
    "description": "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman.",
    "cast": [
      {
        "name": "Kristen Bell",
        "role": "Anna (voice)"
      },
      {
        "name": "Idina Menzel",
        "role": "Elsa (voice)"
      },
      {
        "name": "Josh Gad",
        "role": "Olaf (voice)"
      }
    ],
    "youtubeId": "TbQm5doF_Uc",
    "trailerUrl": "https://www.youtube.com/watch?v=TbQm5doF_Uc"
  },
  {
    "id": "coco",
    "title": "Coco",
    "year": 2017,
    "duration": 105,
    "rating": "8.4",
    "certificate": "PG",
    "genres": [
      "Animation",
      "Family",
      "Fantasy"
    ],
    "image": "/images/coco.jpg?v=1788626277513346000",
    "backdrop": "/images/coco.jpg?v=1788626277513346000",
    "color": "#e88024",
    "tagline": "Celebrate life.",
    "studio": "Pixar / Walt Disney Pictures",
    "director": "Lee Unkrich",
    "description": "Aspiring musician Miguel, confronted with his family's ancestral ban on music, enters the Land of the Dead to find his great-great-grandfather, a legendary singer.",
    "cast": [
      {
        "name": "Anthony Gonzalez",
        "role": "Miguel (voice)"
      },
      {
        "name": "Gael Garc\u00eda Bernal",
        "role": "H\u00e9ctor (voice)"
      },
      {
        "name": "Benjamin Bratt",
        "role": "Ernesto de la Cruz (voice)"
      }
    ],
    "youtubeId": "Rvr68u6SV5I",
    "trailerUrl": "https://www.youtube.com/watch?v=Rvr68u6SV5I"
  },
  {
    "id": "zootopia",
    "title": "Zootopia",
    "year": 2016,
    "duration": 108,
    "rating": "8.0",
    "certificate": "PG",
    "genres": [
      "Animation",
      "Comedy",
      "Mystery"
    ],
    "image": "/images/zootopia.jpg?v=1788626277513346000",
    "backdrop": "/images/zootopia.jpg?v=1788626277513346000",
    "color": "#e59f20",
    "tagline": "Where anyone can be anything.",
    "studio": "Walt Disney Animation Studios",
    "director": "Byron Howard & Rich Moore",
    "description": "In a city of anthropomorphic animals, a rookie bunny cop and a cynical con artist fox must work together to uncover a conspiracy.",
    "cast": [
      {
        "name": "Ginnifer Goodwin",
        "role": "Judy Hopps (voice)"
      },
      {
        "name": "Jason Bateman",
        "role": "Nick Wilde (voice)"
      },
      {
        "name": "Idris Elba",
        "role": "Chief Bogo (voice)"
      }
    ],
    "youtubeId": "jWM0ct-OLsM",
    "trailerUrl": "https://www.youtube.com/watch?v=jWM0ct-OLsM"
  },
  {
    "id": "beauty-and-the-beast",
    "title": "Beauty and the Beast",
    "year": 1991,
    "duration": 84,
    "rating": "8.0",
    "certificate": "G",
    "genres": [
      "Animation",
      "Family",
      "Fantasy"
    ],
    "image": "/images/beauty-and-the-beast.jpg?v=1788626277513346000",
    "backdrop": "/images/beauty-and-the-beast.jpg?v=1788626277513346000",
    "color": "#b89437",
    "tagline": "Tale as old as time.",
    "studio": "Walt Disney Pictures",
    "director": "Gary Trousdale & Kirk Wise",
    "description": "A prince cursed to spend his days as a hideous monster sets out to regain his humanity by earning the love of a young woman whom he imprisons in his castle.",
    "cast": [
      {
        "name": "Paige O'Hara",
        "role": "Belle (voice)"
      },
      {
        "name": "Robby Benson",
        "role": "Beast (voice)"
      },
      {
        "name": "Richard White",
        "role": "Gaston (voice)"
      }
    ],
    "youtubeId": "iKGb4yF-Fw8",
    "trailerUrl": "https://www.youtube.com/watch?v=iKGb4yF-Fw8"
  },
  {
    "id": "tangled",
    "title": "Tangled",
    "year": 2010,
    "duration": 100,
    "rating": "7.7",
    "certificate": "PG",
    "genres": [
      "Animation",
      "Adventure",
      "Comedy"
    ],
    "image": "/images/tangled.jpg?v=1788626277513346000",
    "backdrop": "/images/tangled.jpg?v=1788626277513346000",
    "color": "#a85cc5",
    "tagline": "Let your power shine.",
    "studio": "Walt Disney Animation Studios",
    "director": "Nathan Greno & Byron Howard",
    "description": "The magically long-haired Rapunzel has spent her entire life in a tower, but now that a runaway thief has stumbled upon her, she is about to discover the world for the first time.",
    "cast": [
      {
        "name": "Mandy Moore",
        "role": "Rapunzel (voice)"
      },
      {
        "name": "Zachary Levi",
        "role": "Flynn Rider (voice)"
      },
      {
        "name": "Donna Murphy",
        "role": "Mother Gothel (voice)"
      }
    ],
    "youtubeId": "2f516ZLyC6U",
    "trailerUrl": "https://www.youtube.com/watch?v=2f516ZLyC6U"
  },
  {
    "id": "finding-nemo",
    "title": "Finding Nemo",
    "year": 2003,
    "duration": 100,
    "rating": "8.2",
    "certificate": "G",
    "genres": [
      "Animation",
      "Adventure",
      "Family"
    ],
    "image": "/images/finding-nemo.jpg?v=1788626277513346000",
    "backdrop": "/images/finding-nemo.jpg?v=1788626277513346000",
    "color": "#ff6b35",
    "tagline": "There are 3.7 trillion fish in the ocean.",
    "studio": "Pixar / Walt Disney Pictures",
    "director": "Andrew Stanton",
    "description": "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home alongside a forgetful companion.",
    "cast": [
      {
        "name": "Albert Brooks",
        "role": "Marlin (voice)"
      },
      {
        "name": "Ellen DeGeneres",
        "role": "Dory (voice)"
      },
      {
        "name": "Alexander Gould",
        "role": "Nemo (voice)"
      }
    ],
    "youtubeId": "2zLkasScy7A",
    "trailerUrl": "https://www.youtube.com/watch?v=2zLkasScy7A"
  },
  {
    "id": "toy-story",
    "title": "Toy Story",
    "year": 1995,
    "duration": 81,
    "rating": "8.3",
    "certificate": "G",
    "genres": [
      "Animation",
      "Adventure",
      "Comedy"
    ],
    "image": "/images/toy-story.jpg?v=1788626277513346000",
    "backdrop": "/images/toy-story.jpg?v=1788626277513346000",
    "color": "#2f80ed",
    "tagline": "To infinity and beyond.",
    "studio": "Pixar / Walt Disney Pictures",
    "director": "John Lasseter",
    "description": "A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boy's bedroom.",
    "cast": [
      {
        "name": "Tom Hanks",
        "role": "Woody (voice)"
      },
      {
        "name": "Tim Allen",
        "role": "Buzz Lightyear (voice)"
      },
      {
        "name": "Don Rickles",
        "role": "Mr. Potato Head (voice)"
      }
    ],
    "youtubeId": "v-PjgYDrg70",
    "trailerUrl": "https://www.youtube.com/watch?v=v-PjgYDrg70"
  },
  {
    "id": "up",
    "title": "Up",
    "year": 2009,
    "duration": 96,
    "rating": "8.3",
    "certificate": "PG",
    "genres": [
      "Animation",
      "Adventure",
      "Comedy"
    ],
    "image": "/images/up.jpg?v=1788626277513346000",
    "backdrop": "/images/up.jpg?v=1788626277513346000",
    "color": "#4da6ff",
    "tagline": "Adventure is out there.",
    "studio": "Pixar / Walt Disney Pictures",
    "director": "Pete Docter",
    "description": "78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with thousands of balloons, inadvertently taking a young stowaway.",
    "cast": [
      {
        "name": "Edward Asner",
        "role": "Carl Fredricksen (voice)"
      },
      {
        "name": "Christopher Plummer",
        "role": "Charles Muntz (voice)"
      },
      {
        "name": "Jordan Nagai",
        "role": "Russell (voice)"
      }
    ],
    "youtubeId": "ORFWdXl_zJ4",
    "trailerUrl": "https://www.youtube.com/watch?v=ORFWdXl_zJ4"
  },
  {
    "id": "ratatouille",
    "title": "Ratatouille",
    "year": 2007,
    "duration": 111,
    "rating": "8.1",
    "certificate": "G",
    "genres": [
      "Animation",
      "Comedy",
      "Family"
    ],
    "image": "/images/ratatouille.jpg?v=1788626277513346000",
    "backdrop": "/images/ratatouille.jpg?v=1788626277513346000",
    "color": "#c44536",
    "tagline": "Anyone can cook.",
    "studio": "Pixar / Walt Disney Pictures",
    "director": "Brad Bird",
    "description": "A rat who can cook makes an unusual alliance with a young kitchen worker at a famous Paris restaurant.",
    "cast": [
      {
        "name": "Patton Oswalt",
        "role": "Remy (voice)"
      },
      {
        "name": "Ian Holm",
        "role": "Skinner (voice)"
      },
      {
        "name": "Lou Romano",
        "role": "Linguini (voice)"
      }
    ],
    "youtubeId": "NgsQ8mVkN8w",
    "trailerUrl": "https://www.youtube.com/watch?v=NgsQ8mVkN8w"
  },
  {
    "id": "iron-man",
    "title": "Iron Man",
    "year": 2008,
    "duration": 126,
    "rating": "7.9",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/iron-man.jpg?v=1788626277513346000",
    "backdrop": "/images/iron-man.jpg?v=1788626277513346000",
    "color": "#c5221f",
    "tagline": "Heroes aren't born. They're built.",
    "studio": "Marvel Studios",
    "director": "Jon Favreau",
    "description": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "role": "Tony Stark / Iron Man"
      },
      {
        "name": "Gwyneth Paltrow",
        "role": "Pepper Potts"
      },
      {
        "name": "Jeff Bridges",
        "role": "Obadiah Stane"
      }
    ],
    "youtubeId": "8ugaeA-nMTc",
    "trailerUrl": "https://www.youtube.com/watch?v=8ugaeA-nMTc"
  },
  {
    "id": "the-avengers",
    "title": "The Avengers",
    "year": 2012,
    "duration": 143,
    "rating": "8.0",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/the-avengers.jpg?v=1788626277513346000",
    "backdrop": "/images/the-avengers.jpg?v=1788626277513346000",
    "color": "#2b7de9",
    "tagline": "Some assembly required.",
    "studio": "Marvel Studios",
    "director": "Joss Whedon",
    "description": "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "role": "Tony Stark / Iron Man"
      },
      {
        "name": "Chris Evans",
        "role": "Steve Rogers / Captain America"
      },
      {
        "name": "Scarlett Johansson",
        "role": "Natasha Romanoff"
      }
    ],
    "youtubeId": "eOrNdBpGMv8",
    "trailerUrl": "https://www.youtube.com/watch?v=eOrNdBpGMv8"
  },
  {
    "id": "avengers-infinity-war",
    "title": "Avengers: Infinity War",
    "year": 2018,
    "duration": 149,
    "rating": "8.4",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/avengers-infinity-war.jpg?v=1788626277513346000",
    "backdrop": "/images/avengers-infinity-war.jpg?v=1788626277513346000",
    "color": "#9343bc",
    "tagline": "Destiny arrives.",
    "studio": "Marvel Studios",
    "director": "Anthony & Joe Russo",
    "description": "The Avengers and their allies must be willing to sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation puts an end to the universe.",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "role": "Tony Stark / Iron Man"
      },
      {
        "name": "Chris Hemsworth",
        "role": "Thor"
      },
      {
        "name": "Josh Brolin",
        "role": "Thanos"
      },
      {
        "name": "Scarlett Johansson",
        "role": "Natasha Romanoff / Black Widow"
      }
    ],
    "youtubeId": "6ZfuNTqbHE8",
    "trailerUrl": "https://www.youtube.com/watch?v=6ZfuNTqbHE8"
  },
  {
    "id": "avengers-endgame",
    "title": "Avengers: Endgame",
    "year": 2019,
    "duration": 181,
    "rating": "8.4",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/avengers-endgame.jpg?v=1788626277513346000",
    "backdrop": "/images/avengers-endgame-wide.jpg?v=1788626277513346000",
    "color": "#455fe5",
    "tagline": "Part of the journey is the end.",
    "studio": "Marvel Studios",
    "director": "Anthony & Joe Russo",
    "description": "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
    "cast": [
      {
        "name": "Robert Downey Jr.",
        "role": "Tony Stark / Iron Man"
      },
      {
        "name": "Chris Evans",
        "role": "Steve Rogers / Captain America"
      },
      {
        "name": "Mark Ruffalo",
        "role": "Bruce Banner / Hulk"
      },
      {
        "name": "Scarlett Johansson",
        "role": "Natasha Romanoff / Black Widow"
      }
    ],
    "youtubeId": "TcMBFSGVi1c",
    "trailerUrl": "https://www.youtube.com/watch?v=TcMBFSGVi1c"
  },
  {
    "id": "black-panther",
    "title": "Black Panther",
    "year": 2018,
    "duration": 134,
    "rating": "7.3",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/black-panther.jpg?v=1788626277513346000",
    "backdrop": "/images/black-panther.jpg?v=1788626277513346000",
    "color": "#8d4cd8",
    "tagline": "Long live the king.",
    "studio": "Marvel Studios",
    "director": "Ryan Coogler",
    "description": "T'Challa, heir to the hidden kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    "cast": [
      {
        "name": "Chadwick Boseman",
        "role": "T'Challa / Black Panther"
      },
      {
        "name": "Michael B. Jordan",
        "role": "Erik Killmonger"
      },
      {
        "name": "Lupita Nyong'o",
        "role": "Nakia"
      }
    ],
    "youtubeId": "xjDjIWPwcPU",
    "trailerUrl": "https://www.youtube.com/watch?v=xjDjIWPwcPU"
  },
  {
    "id": "thor-ragnarok",
    "title": "Thor: Ragnarok",
    "year": 2017,
    "duration": 130,
    "rating": "7.9",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Comedy"
    ],
    "image": "/images/thor-ragnarok.jpg?v=1788626277513346000",
    "backdrop": "/images/thor-ragnarok.jpg?v=1788626277513346000",
    "color": "#e056fd",
    "tagline": "No hammer. No problem.",
    "studio": "Marvel Studios",
    "director": "Taika Waititi",
    "description": "Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnar\u00f6k, the destruction of his world, at the hands of the ruthless Hela.",
    "cast": [
      {
        "name": "Chris Hemsworth",
        "role": "Thor"
      },
      {
        "name": "Tom Hiddleston",
        "role": "Loki"
      },
      {
        "name": "Cate Blanchett",
        "role": "Hela"
      }
    ],
    "youtubeId": "ue80QwXMRHg",
    "trailerUrl": "https://www.youtube.com/watch?v=ue80QwXMRHg"
  },
  {
    "id": "captain-america-civil-war",
    "title": "Captain America: Civil War",
    "year": 2016,
    "duration": 147,
    "rating": "7.8",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/captain-america-civil-war.jpg?v=1788626277513346000",
    "backdrop": "/images/captain-america-civil-war.jpg?v=1788626277513346000",
    "color": "#c0392b",
    "tagline": "Divided we fall.",
    "studio": "Marvel Studios",
    "director": "Anthony & Joe Russo",
    "description": "Political involvement in the Avengers' affairs causes a rift between former allies Captain America and Iron Man.",
    "cast": [
      {
        "name": "Chris Evans",
        "role": "Steve Rogers / Captain America"
      },
      {
        "name": "Robert Downey Jr.",
        "role": "Tony Stark / Iron Man"
      },
      {
        "name": "Sebastian Stan",
        "role": "Bucky Barnes"
      }
    ],
    "youtubeId": "dKrVegVI0Us",
    "trailerUrl": "https://www.youtube.com/watch?v=dKrVegVI0Us"
  },
  {
    "id": "guardians-of-the-galaxy",
    "title": "Guardians of the Galaxy",
    "year": 2014,
    "duration": 121,
    "rating": "8.0",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Comedy"
    ],
    "image": "/images/guardians-of-the-galaxy.jpg?v=1788626277513346000",
    "backdrop": "/images/guardians-of-the-galaxy.jpg?v=1788626277513346000",
    "color": "#f39c12",
    "tagline": "You're welcome.",
    "studio": "Marvel Studios",
    "director": "James Gunn",
    "description": "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    "cast": [
      {
        "name": "Chris Pratt",
        "role": "Peter Quill / Star-Lord"
      },
      {
        "name": "Zoe Saldana",
        "role": "Gamora"
      },
      {
        "name": "Dave Bautista",
        "role": "Drax"
      }
    ],
    "youtubeId": "d96cjJhvlMA",
    "trailerUrl": "https://www.youtube.com/watch?v=d96cjJhvlMA"
  },
  {
    "id": "doctor-strange",
    "title": "Doctor Strange",
    "year": 2016,
    "duration": 115,
    "rating": "7.5",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy"
    ],
    "image": "/images/doctor-strange.jpg?v=1788626277513346000",
    "backdrop": "/images/doctor-strange.jpg?v=1788626277513346000",
    "color": "#e67e22",
    "tagline": "Open your mind. Change your reality.",
    "studio": "Marvel Studios",
    "director": "Scott Derrickson",
    "description": "While on a journey of physical and spiritual healing, a brilliant neurosurgeon is drawn into the world of the mystic arts.",
    "cast": [
      {
        "name": "Benedict Cumberbatch",
        "role": "Stephen Strange"
      },
      {
        "name": "Chiwetel Ejiofor",
        "role": "Mordo"
      },
      {
        "name": "Rachel McAdams",
        "role": "Christine Palmer"
      }
    ],
    "youtubeId": "HSzx-zryEgM",
    "trailerUrl": "https://www.youtube.com/watch?v=HSzx-zryEgM"
  },
  {
    "id": "spider-man-no-way-home",
    "title": "Spider-Man: No Way Home",
    "year": 2021,
    "duration": 148,
    "rating": "8.2",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy"
    ],
    "image": "/images/spider-man-no-way-home.jpg?v=1788626277513346000",
    "backdrop": "/images/spider-man-no-way-home.jpg?v=1788626277513346000",
    "color": "#e74c3c",
    "tagline": "The multiverse unleashed.",
    "studio": "Marvel Studios / Columbia Pictures",
    "director": "Jon Watts",
    "description": "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds appear.",
    "cast": [
      {
        "name": "Tom Holland",
        "role": "Peter Parker / Spider-Man"
      },
      {
        "name": "Benedict Cumberbatch",
        "role": "Doctor Strange"
      },
      {
        "name": "Willem Dafoe",
        "role": "Norman Osborn / Green Goblin"
      }
    ],
    "youtubeId": "JfVOs4VSpmA",
    "trailerUrl": "https://www.youtube.com/watch?v=JfVOs4VSpmA"
  },
  {
    "id": "captain-america-winter-soldier",
    "title": "Captain America: The Winter Soldier",
    "year": 2014,
    "duration": 136,
    "rating": "7.8",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/captain-america-winter-soldier.jpg?v=1788626277513346000",
    "backdrop": "/images/captain-america-winter-soldier.jpg?v=1788626277513346000",
    "color": "#2980b9",
    "tagline": "In heroes we trust.",
    "studio": "Marvel Studios",
    "director": "Anthony & Joe Russo",
    "description": "As Steve Rogers struggles to embrace his role in the modern world, he teams up with a fellow Avenger and S.H.I.E.L.D agent, Black Widow, to battle a new threat from history.",
    "cast": [
      {
        "name": "Chris Evans",
        "role": "Steve Rogers / Captain America"
      },
      {
        "name": "Scarlett Johansson",
        "role": "Natasha Romanoff / Black Widow"
      },
      {
        "name": "Sebastian Stan",
        "role": "The Winter Soldier"
      }
    ],
    "youtubeId": "7SlILk2WMTI",
    "trailerUrl": "https://www.youtube.com/watch?v=7SlILk2WMTI"
  },
  {
    "id": "shang-chi",
    "title": "Shang-Chi and the Legend of the Ten Rings",
    "year": 2021,
    "duration": 132,
    "rating": "7.4",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Fantasy"
    ],
    "image": "/images/shang-chi.jpg?v=1788626277513346000",
    "backdrop": "/images/shang-chi.jpg?v=1788626277513346000",
    "color": "#c0392b",
    "tagline": "A hero will rise.",
    "studio": "Marvel Studios",
    "director": "Destin Daniel Cretton",
    "description": "Shang-Chi, the master of weaponry-based Kung Fu, is forced to confront his past after being drawn into the Ten Rings organization.",
    "cast": [
      {
        "name": "Simu Liu",
        "role": "Shang-Chi"
      },
      {
        "name": "Awkwafina",
        "role": "Katy"
      },
      {
        "name": "Tony Leung",
        "role": "Wenwu"
      }
    ],
    "youtubeId": "8YjFbMbfXaQ",
    "trailerUrl": "https://www.youtube.com/watch?v=8YjFbMbfXaQ"
  },
  {
    "id": "the-marvels",
    "title": "The Marvels",
    "year": 2023,
    "duration": 105,
    "rating": "6.1",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/the-marvels.jpg?v=1788626277513346000",
    "backdrop": "/images/the-marvels.jpg?v=1788626277513346000",
    "color": "#f1c40f",
    "tagline": "Higher. Further. Faster. Together.",
    "studio": "Marvel Studios",
    "director": "Nia DaCosta",
    "description": "Carol Danvers gets her powers entangled with those of Kamala Khan and Monica Rambeau, forcing them to work together to save the universe.",
    "cast": [
      {
        "name": "Brie Larson",
        "role": "Carol Danvers / Captain Marvel"
      },
      {
        "name": "Teyonah Parris",
        "role": "Monica Rambeau"
      },
      {
        "name": "Iman Vellani",
        "role": "Kamala Khan / Ms. Marvel"
      }
    ],
    "youtubeId": "wS_qbD028EI",
    "trailerUrl": "https://www.youtube.com/watch?v=wS_qbD028EI"
  },
  {
    "id": "deadpool-and-wolverine",
    "title": "Deadpool & Wolverine",
    "year": 2024,
    "duration": 127,
    "rating": "7.8",
    "certificate": "R",
    "genres": [
      "Action",
      "Comedy",
      "Superhero"
    ],
    "image": "/images/deadpool-and-wolverine.jpg?v=1788626277513346000",
    "backdrop": "/images/deadpool-and-wolverine.jpg?v=1788626277513346000",
    "color": "#e74c3c",
    "tagline": "Come together.",
    "studio": "Marvel Studios",
    "director": "Shawn Levy",
    "description": "Deadpool's peaceful existence comes crashing down when the Time Variance Authority recruits him to help safeguard the multiverse alongside a reluctant Wolverine.",
    "cast": [
      {
        "name": "Ryan Reynolds",
        "role": "Wade Wilson / Deadpool"
      },
      {
        "name": "Hugh Jackman",
        "role": "Logan / Wolverine"
      },
      {
        "name": "Emma Corrin",
        "role": "Cassandra Nova"
      }
    ],
    "youtubeId": "73_1biulkYk",
    "trailerUrl": "https://www.youtube.com/watch?v=73_1biulkYk"
  },
  {
    "id": "black-widow",
    "title": "Black Widow",
    "year": 2021,
    "duration": 134,
    "rating": "6.7",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Superhero"
    ],
    "image": "/images/black-widow.jpg?v=1788626277513346000",
    "backdrop": "/images/black-widow.jpg?v=1788626277513346000",
    "color": "#c0392b",
    "tagline": "She's done running from her past.",
    "studio": "Marvel Studios",
    "director": "Cate Shortland",
    "description": "Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises.",
    "cast": [
      {
        "name": "Scarlett Johansson",
        "role": "Natasha Romanoff"
      },
      {
        "name": "Florence Pugh",
        "role": "Yelena Belova"
      },
      {
        "name": "David Harbour",
        "role": "Alexei Shostakov"
      }
    ],
    "youtubeId": "ybji16u608U",
    "trailerUrl": "https://www.youtube.com/watch?v=ybji16u608U"
  },
  {
    "id": "star-wars-a-new-hope",
    "title": "Star Wars: Episode IV - A New Hope",
    "year": 1977,
    "duration": 121,
    "rating": "8.6",
    "certificate": "PG",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-a-new-hope.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-a-new-hope-wide.jpg?v=1788626277513346000",
    "color": "#27ae60",
    "tagline": "A long time ago in a galaxy far, far away...",
    "studio": "Lucasfilm",
    "director": "George Lucas",
    "description": "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.",
    "cast": [
      {
        "name": "Mark Hamill",
        "role": "Luke Skywalker"
      },
      {
        "name": "Harrison Ford",
        "role": "Han Solo"
      },
      {
        "name": "Carrie Fisher",
        "role": "Princess Leia Organa"
      }
    ],
    "youtubeId": "vZ734NWnAHA",
    "trailerUrl": "https://www.youtube.com/watch?v=vZ734NWnAHA"
  },
  {
    "id": "star-wars-the-empire-strikes-back",
    "title": "Star Wars: Episode V - The Empire Strikes Back",
    "year": 1980,
    "duration": 124,
    "rating": "8.7",
    "certificate": "PG",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-the-empire-strikes-back.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-the-empire-strikes-back.jpg?v=1788626277513346000",
    "color": "#2980b9",
    "tagline": "The adventure continues...",
    "studio": "Lucasfilm",
    "director": "Irvin Kershner",
    "description": "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader.",
    "cast": [
      {
        "name": "Mark Hamill",
        "role": "Luke Skywalker"
      },
      {
        "name": "Harrison Ford",
        "role": "Han Solo"
      },
      {
        "name": "Carrie Fisher",
        "role": "Princess Leia Organa"
      }
    ],
    "youtubeId": "JNwNXF9Y6kY",
    "trailerUrl": "https://www.youtube.com/watch?v=JNwNXF9Y6kY"
  },
  {
    "id": "star-wars-return-of-the-jedi",
    "title": "Star Wars: Episode VI - Return of the Jedi",
    "year": 1983,
    "duration": 131,
    "rating": "8.3",
    "certificate": "PG",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-return-of-the-jedi.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-return-of-the-jedi.jpg?v=1788626277513346000",
    "color": "#27ae60",
    "tagline": "The Empire falls.",
    "studio": "Lucasfilm",
    "director": "Richard Marquand",
    "description": "After a daring mission to rescue Han Solo from Jabba the Hutt, the Rebels dispatch to Endor to destroy the second Death Star. Meanwhile, Luke struggles to help Darth Vader back from the dark side without falling into the Emperor's trap.",
    "cast": [
      {
        "name": "Mark Hamill",
        "role": "Luke Skywalker"
      },
      {
        "name": "Harrison Ford",
        "role": "Han Solo"
      },
      {
        "name": "Carrie Fisher",
        "role": "Princess Leia Organa"
      }
    ],
    "youtubeId": "7L8p7_SLzvU",
    "trailerUrl": "https://www.youtube.com/watch?v=7L8p7_SLzvU"
  },
  {
    "id": "star-wars-the-force-awakens",
    "title": "Star Wars: Episode VII - The Force Awakens",
    "year": 2015,
    "duration": 135,
    "rating": "7.8",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-the-force-awakens.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-the-force-awakens.jpg?v=1788626277513346000",
    "color": "#e67e22",
    "tagline": "Every generation has a story.",
    "studio": "Lucasfilm",
    "director": "J.J. Abrams",
    "description": "As a new threat to the galaxy rises, Rey, a desert scavenger, and Finn, an ex-stormtrooper, must join Han Solo and Chewbacca to search for the one hope of restoring peace.",
    "cast": [
      {
        "name": "Daisy Ridley",
        "role": "Rey"
      },
      {
        "name": "John Boyega",
        "role": "Finn"
      },
      {
        "name": "Adam Driver",
        "role": "Kylo Ren"
      }
    ],
    "youtubeId": "sGbxmsDFVnE",
    "trailerUrl": "https://www.youtube.com/watch?v=sGbxmsDFVnE"
  },
  {
    "id": "star-wars-the-last-jedi",
    "title": "Star Wars: Episode VIII - The Last Jedi",
    "year": 2017,
    "duration": 152,
    "rating": "6.9",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-the-last-jedi-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-the-last-jedi-wide.jpg?v=1788626277513346000",
    "color": "#c0392b",
    "tagline": "Darkness rises... and light to meet it.",
    "studio": "Lucasfilm",
    "director": "Rian Johnson",
    "description": "The Resistance prepares for battle with the First Order as Rey develops her newfound abilities with the guidance of Luke Skywalker.",
    "cast": [
      {
        "name": "Mark Hamill",
        "role": "Luke Skywalker"
      },
      {
        "name": "Daisy Ridley",
        "role": "Rey"
      },
      {
        "name": "Adam Driver",
        "role": "Kylo Ren"
      }
    ],
    "youtubeId": "Q0CbN8sfihY",
    "trailerUrl": "https://www.youtube.com/watch?v=Q0CbN8sfihY"
  },
  {
    "id": "star-wars-the-rise-of-skywalker",
    "title": "Star Wars: Episode IX - The Rise of Skywalker",
    "year": 2019,
    "duration": 142,
    "rating": "6.4",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-the-rise-of-skywalker.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-the-rise-of-skywalker.jpg?v=1788626277513346000",
    "color": "#3498db",
    "tagline": "The saga concludes.",
    "studio": "Lucasfilm",
    "director": "J.J. Abrams",
    "description": "In the riveting conclusion of the landmark Skywalker saga, new legends will be born and the final battle for freedom is yet to come.",
    "cast": [
      {
        "name": "Daisy Ridley",
        "role": "Rey"
      },
      {
        "name": "Adam Driver",
        "role": "Kylo Ren"
      },
      {
        "name": "John Boyega",
        "role": "Finn"
      }
    ],
    "youtubeId": "8Qn_spdM5Zg",
    "trailerUrl": "https://www.youtube.com/watch?v=8Qn_spdM5Zg"
  },
  {
    "id": "star-wars-revenge-of-the-sith",
    "title": "Star Wars: Episode III - Revenge of the Sith",
    "year": 2005,
    "duration": 140,
    "rating": "7.6",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-revenge-of-the-sith.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-revenge-of-the-sith.jpg?v=1788626277513346000",
    "color": "#c0392b",
    "tagline": "The saga is complete.",
    "studio": "Lucasfilm",
    "director": "George Lucas",
    "description": "Three years into the Clone Wars, the Jedi rescue Palpatine from Count Dooku. As Obi-Wan pursues a new threat, Anakin acts as a double agent between the Jedi Council and Palpatine and is lured into a sinister plan.",
    "cast": [
      {
        "name": "Hayden Christensen",
        "role": "Anakin Skywalker / Darth Vader"
      },
      {
        "name": "Ewan McGregor",
        "role": "Obi-Wan Kenobi"
      },
      {
        "name": "Natalie Portman",
        "role": "Padm\u00e9 Amidala"
      }
    ],
    "youtubeId": "5UnjrG_fsGw",
    "trailerUrl": "https://www.youtube.com/watch?v=5UnjrG_fsGw"
  },
  {
    "id": "rogue-one-a-star-wars-story",
    "title": "Rogue One: A Star Wars Story",
    "year": 2016,
    "duration": 134,
    "rating": "7.8",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/rogue-one-a-star-wars-story.jpg?v=1788626277513346000",
    "backdrop": "/images/rogue-one-a-star-wars-story.jpg?v=1788626277513346000",
    "color": "#16a085",
    "tagline": "A rebellion built on hope.",
    "studio": "Lucasfilm",
    "director": "Gareth Edwards",
    "description": "In a time of conflict, a group of unlikely heroes band together on a mission to steal the plans to the Death Star, the Empire's ultimate weapon of destruction.",
    "cast": [
      {
        "name": "Felicity Jones",
        "role": "Jyn Erso"
      },
      {
        "name": "Diego Luna",
        "role": "Cassian Andor"
      },
      {
        "name": "Ben Mendelsohn",
        "role": "Director Orson Krennic"
      }
    ],
    "youtubeId": "frdj1890Z74",
    "trailerUrl": "https://www.youtube.com/watch?v=frdj1890Z74"
  },
  {
    "id": "star-wars-phantom-menace",
    "title": "Star Wars: Episode I - The Phantom Menace",
    "year": 1999,
    "duration": 136,
    "rating": "6.5",
    "certificate": "PG",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-phantom-menace-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-phantom-menace-wide.jpg?v=1788626277513346000",
    "color": "#f39c12",
    "tagline": "Every saga has a beginning.",
    "studio": "Lucasfilm",
    "director": "George Lucas",
    "description": "Two Jedi escape a hostile blockade to find allies and come across a young boy who may bring balance to the Force.",
    "cast": [
      {
        "name": "Liam Neeson",
        "role": "Qui-Gon Jinn"
      },
      {
        "name": "Ewan McGregor",
        "role": "Obi-Wan Kenobi"
      },
      {
        "name": "Natalie Portman",
        "role": "Queen Amidala"
      }
    ],
    "youtubeId": "bD7bpG-zDJQ",
    "trailerUrl": "https://www.youtube.com/watch?v=bD7bpG-zDJQ"
  },
  {
    "id": "star-wars-attack-of-clones",
    "title": "Star Wars: Episode II - Attack of the Clones",
    "year": 2002,
    "duration": 142,
    "rating": "6.6",
    "certificate": "PG",
    "genres": [
      "Action",
      "Adventure",
      "Space Opera"
    ],
    "image": "/images/star-wars-attack-of-clones-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/star-wars-attack-of-clones-wide.jpg?v=1788626277513346000",
    "color": "#2980b9",
    "tagline": "A galaxy divided.",
    "studio": "Lucasfilm",
    "director": "George Lucas",
    "description": "Ten years after initially meeting, Anakin Skywalker shares a forbidden romance with Padm\u00e9 Amidala, while Obi-Wan Kenobi investigates an assassination attempt on the senator.",
    "cast": [
      {
        "name": "Hayden Christensen",
        "role": "Anakin Skywalker"
      },
      {
        "name": "Ewan McGregor",
        "role": "Obi-Wan Kenobi"
      },
      {
        "name": "Natalie Portman",
        "role": "Padm\u00e9 Amidala"
      }
    ],
    "youtubeId": "gYbW1F_c9eM",
    "trailerUrl": "https://www.youtube.com/watch?v=gYbW1F_c9eM"
  },
  {
    "id": "oppenheimer",
    "title": "Oppenheimer",
    "year": 2023,
    "duration": 180,
    "rating": "8.9",
    "certificate": "R",
    "genres": [
      "Biography",
      "Drama",
      "History"
    ],
    "image": "/images/oppenheimer-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/oppenheimer-wide.jpg?v=1788626277513346000",
    "color": "#e67e22",
    "tagline": "The world forever changes.",
    "studio": "Universal Pictures / Syncopy",
    "director": "Christopher Nolan",
    "description": "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    "cast": [
      {
        "name": "Cillian Murphy",
        "role": "J. Robert Oppenheimer"
      },
      {
        "name": "Emily Blunt",
        "role": "Katherine 'Kitty' Oppenheimer"
      },
      {
        "name": "Matt Damon",
        "role": "Leslie Groves"
      },
      {
        "name": "Robert Downey Jr.",
        "role": "Lewis Strauss"
      }
    ],
    "youtubeId": "uYPbbksJxIg",
    "trailerUrl": "https://www.youtube.com/watch?v=uYPbbksJxIg"
  },
  {
    "id": "interstellar",
    "title": "Interstellar",
    "year": 2014,
    "duration": 169,
    "rating": "8.7",
    "certificate": "PG-13",
    "genres": [
      "Adventure",
      "Drama",
      "Science Fiction"
    ],
    "image": "/images/interstellar-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/interstellar-wide.jpg?v=1788626277513346000",
    "color": "#3498db",
    "tagline": "Mankind was born on Earth. It was never meant to die here.",
    "studio": "Paramount / Warner Bros. / Syncopy",
    "director": "Christopher Nolan",
    "description": "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
    "cast": [
      {
        "name": "Matthew McConaughey",
        "role": "Joseph Cooper"
      },
      {
        "name": "Anne Hathaway",
        "role": "Dr. Amelia Brand"
      },
      {
        "name": "Jessica Chastain",
        "role": "Murphy Cooper"
      },
      {
        "name": "Timothée Chalamet",
        "role": "Tom Cooper (Young)"
      }
    ],
    "youtubeId": "zSWdZVtXT7E",
    "trailerUrl": "https://www.youtube.com/watch?v=zSWdZVtXT7E"
  },
  {
    "id": "inception",
    "title": "Inception",
    "year": 2010,
    "duration": 148,
    "rating": "8.8",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Adventure",
      "Mystery"
    ],
    "image": "/images/inception-hq.jpg?v=1788626277513346000",
    "backdrop": "/images/inception-wide.jpg?v=1788626277513346000",
    "color": "#34495e",
    "tagline": "Your mind is the scene of the crime.",
    "studio": "Warner Bros. / Syncopy",
    "director": "Christopher Nolan",
    "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    "cast": [
      {
        "name": "Leonardo DiCaprio",
        "role": "Dom Cobb"
      },
      {
        "name": "Joseph Gordon-Levitt",
        "role": "Arthur"
      },
      {
        "name": "Elliot Page",
        "role": "Ariadne"
      },
      {
        "name": "Cillian Murphy",
        "role": "Robert Fischer"
      }
    ],
    "youtubeId": "YoHD9XEInc0",
    "trailerUrl": "https://www.youtube.com/watch?v=YoHD9XEInc0"
  },
  {
    "id": "the-dark-knight",
    "title": "The Dark Knight",
    "year": 2008,
    "duration": 152,
    "rating": "9.0",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "image": "/images/dark-knight-4k.jpg?v=1788626277513346000",
    "backdrop": "/images/the-dark-knight-hero-4k.jpg?v=1788626277513346000",
    "color": "#2c3e50",
    "tagline": "Why so serious?",
    "studio": "Warner Bros. / DC / Syncopy",
    "director": "Christopher Nolan",
    "description": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    "cast": [
      {
        "name": "Christian Bale",
        "role": "Bruce Wayne / Batman"
      },
      {
        "name": "Heath Ledger",
        "role": "Joker"
      },
      {
        "name": "Aaron Eckhart",
        "role": "Harvey Dent"
      },
      {
        "name": "Cillian Murphy",
        "role": "Dr. Jonathan Crane / Scarecrow"
      }
    ],
    "youtubeId": "EXeTwQWrcwY",
    "trailerUrl": "https://www.youtube.com/watch?v=EXeTwQWrcwY"
  },
  {
    "id": "the-dark-knight-rises",
    "title": "The Dark Knight Rises",
    "year": 2012,
    "duration": 164,
    "rating": "8.4",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Drama",
      "Crime"
    ],
    "image": "/images/the-dark-knight-rises.jpg?v=1788626277513346000",
    "backdrop": "/images/the-dark-knight-rises.jpg?v=1788626277513346000",
    "color": "#7f8c8d",
    "tagline": "A fire will rise.",
    "studio": "Warner Bros. / DC / Syncopy",
    "director": "Christopher Nolan",
    "description": "Eight years after the Joker's reign of anarchy, Batman, with the help of the enigmatic Selina Kyle, is forced from his exile to save Gotham City from the brutal guerrilla terrorist Bane.",
    "cast": [
      {
        "name": "Christian Bale",
        "role": "Bruce Wayne / Batman"
      },
      {
        "name": "Tom Hardy",
        "role": "Bane"
      },
      {
        "name": "Anne Hathaway",
        "role": "Selina Kyle / Catwoman"
      }
    ],
    "youtubeId": "g8evyE9TuYg",
    "trailerUrl": "https://www.youtube.com/watch?v=g8evyE9TuYg"
  },
  {
    "id": "batman-begins",
    "title": "Batman Begins",
    "year": 2005,
    "duration": 140,
    "rating": "8.2",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Crime",
      "Drama"
    ],
    "image": "/images/batman-begins.jpg?v=1788626277513346000",
    "backdrop": "/images/batman-begins.jpg?v=1788626277513346000",
    "color": "#d35400",
    "tagline": "It's not who I am underneath, but what I do that defines me.",
    "studio": "Warner Bros. / DC / Syncopy",
    "director": "Christopher Nolan",
    "description": "After witnessing his parents' death, Bruce Wayne trains with the League of Shadows to fight injustice, returning to Gotham to wage war on corruption as Batman.",
    "cast": [
      {
        "name": "Christian Bale",
        "role": "Bruce Wayne / Batman"
      },
      {
        "name": "Michael Caine",
        "role": "Alfred Pennyworth"
      },
      {
        "name": "Liam Neeson",
        "role": "Henri Ducard / Ra's al Ghul"
      }
    ],
    "youtubeId": "neY2xCQGPUM",
    "trailerUrl": "https://www.youtube.com/watch?v=neY2xCQGPUM"
  },
  {
    "id": "dunkirk",
    "title": "Dunkirk",
    "year": 2017,
    "duration": 106,
    "rating": "7.8",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Drama",
      "History"
    ],
    "image": "/images/dunkirk.jpg?v=1788626277513346000",
    "backdrop": "/images/dunkirk.jpg?v=1788626277513346000",
    "color": "#34495e",
    "tagline": "When 400,000 men couldn't get home, home came for them.",
    "studio": "Warner Bros. / Syncopy",
    "director": "Christopher Nolan",
    "description": "Allied soldiers from Belgium, the British Commonwealth and Empire, and France are surrounded by the German Army and evacuated during a fierce battle in World War II.",
    "cast": [
      {
        "name": "Fionn Whitehead",
        "role": "Tommy"
      },
      {
        "name": "Tom Glynn-Carney",
        "role": "Peter"
      },
      {
        "name": "Mark Rylance",
        "role": "Mr. Dawson"
      }
    ],
    "youtubeId": "F-eMt3SrfFU",
    "trailerUrl": "https://www.youtube.com/watch?v=F-eMt3SrfFU"
  },
  {
    "id": "tenet",
    "title": "Tenet",
    "year": 2020,
    "duration": 150,
    "rating": "7.3",
    "certificate": "PG-13",
    "genres": [
      "Action",
      "Mystery",
      "Science Fiction"
    ],
    "image": "/images/tenet.jpg?v=1788626277513346000",
    "backdrop": "/images/tenet.jpg?v=1788626277513346000",
    "color": "#16a085",
    "tagline": "Time runs out.",
    "studio": "Warner Bros. / Syncopy",
    "director": "Christopher Nolan",
    "description": "Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that unfolds in something beyond real time.",
    "cast": [
      {
        "name": "John David Washington",
        "role": "Protagonist"
      },
      {
        "name": "Robert Pattinson",
        "role": "Neil"
      },
      {
        "name": "Elizabeth Debicki",
        "role": "Kat"
      }
    ],
    "youtubeId": "LdOM0x0WVFE",
    "trailerUrl": "https://www.youtube.com/watch?v=LdOM0x0WVFE"
  },
  {
    "id": "the-prestige",
    "title": "The Prestige",
    "year": 2006,
    "duration": 130,
    "rating": "8.5",
    "certificate": "PG-13",
    "genres": [
      "Drama",
      "Mystery",
      "Fantasy"
    ],
    "image": "/images/the-prestige.jpg?v=1788626277513346000",
    "backdrop": "/images/the-prestige.jpg?v=1788626277513346000",
    "color": "#8e44ad",
    "tagline": "Are you watching closely?",
    "studio": "Touchstone / Warner Bros. / Syncopy",
    "director": "Christopher Nolan",
    "description": "After a tragic accident, two stage magicians in 1890s London engage in a battle to create the ultimate illusion while sacrificing everything they have to outwit each other.",
    "cast": [
      {
        "name": "Christian Bale",
        "role": "Alfred Borden"
      },
      {
        "name": "Hugh Jackman",
        "role": "Robert Angier"
      },
      {
        "name": "Michael Caine",
        "role": "Cutter"
      }
    ],
    "youtubeId": "o4gHCmTQDVI",
    "trailerUrl": "https://www.youtube.com/watch?v=o4gHCmTQDVI"
  },
  {
    "id": "memento",
    "title": "Memento",
    "year": 2000,
    "duration": 113,
    "rating": "8.4",
    "certificate": "R",
    "genres": [
      "Mystery",
      "Crime",
      "Drama"
    ],
    "image": "/images/memento.jpg?v=1788626277513346000",
    "backdrop": "/images/memento.jpg?v=1788626277513346000",
    "color": "#7f8c8d",
    "tagline": "Some memories are best forgotten.",
    "studio": "Newmarket Films / Summit",
    "director": "Christopher Nolan",
    "description": "A man with short-term memory loss attempts to track down his wife's murderer using an intricate system of polaroids and tattoos.",
    "cast": [
      {
        "name": "Guy Pearce",
        "role": "Leonard Shelby"
      },
      {
        "name": "Carrie-Anne Moss",
        "role": "Natalie"
      },
      {
        "name": "Joe Pantoliano",
        "role": "Teddy"
      }
    ],
    "youtubeId": "4CV41hoyS8A",
    "trailerUrl": "https://www.youtube.com/watch?v=4CV41hoyS8A"
  }
];

export const getFilm = (id: string) => films.find((film) => film.id === id);

export const runtime = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

export function getFilmPlatforms(film: Film): WatchPlatform[] {
  if (film.platforms && film.platforms.length > 0) {
    return film.platforms;
  }
  const query = encodeURIComponent(film.title);
  const platforms: WatchPlatform[] = [];

  const studioLower = (film.studio || "").toLowerCase();
  const directorLower = (film.director || "").toLowerCase();
  const titleLower = film.title.toLowerCase();

  const isDisney =
    studioLower.includes("disney") ||
    studioLower.includes("marvel") ||
    studioLower.includes("lucasfilm") ||
    studioLower.includes("pixar") ||
    studioLower.includes("20th century") ||
    titleLower.includes("star wars") ||
    titleLower.includes("avengers") ||
    titleLower.includes("iron man") ||
    titleLower.includes("deadpool") ||
    titleLower.includes("guardians") ||
    titleLower.includes("captain america") ||
    titleLower.includes("thor") ||
    titleLower.includes("black panther") ||
    titleLower.includes("black widow") ||
    titleLower.includes("doctor strange") ||
    titleLower.includes("shang-chi");

  const isWarner =
    studioLower.includes("warner") ||
    studioLower.includes("syncopy") ||
    studioLower.includes("legendary") ||
    studioLower.includes("dc") ||
    directorLower.includes("nolan") ||
    titleLower.includes("dune") ||
    titleLower.includes("dark knight") ||
    titleLower.includes("batman") ||
    titleLower.includes("prestige") ||
    titleLower.includes("inception") ||
    titleLower.includes("tenet") ||
    titleLower.includes("dunkirk");

  const isParamount =
    studioLower.includes("paramount") ||
    titleLower.includes("arrival") ||
    titleLower.includes("interstellar");

  if (isDisney) {
    platforms.push({
      name: "Disney+",
      type: "Stream",
      url: `https://www.disneyplus.com/search?q=${query}`,
      badge: "4K Dolby Vision",
      bg: "#0c1938",
    });
  } else if (isWarner) {
    platforms.push({
      name: "Max",
      type: "Stream",
      url: `https://play.max.com/search?q=${query}`,
      badge: "4K Dolby Vision",
      bg: "#001a66",
    });
  } else if (isParamount) {
    platforms.push({
      name: "Paramount+",
      type: "Stream",
      url: `https://www.paramountplus.com/search/?q=${query}`,
      badge: "4K HDR",
      bg: "#003366",
    });
  }

  // Apple TV
  platforms.push({
    name: "Apple TV",
    type: "Rent / Buy",
    url: `https://tv.apple.com/search?term=${query}`,
    badge: "4K HDR",
    bg: "#151515",
  });

  // Prime Video
  platforms.push({
    name: "Prime Video",
    type: "Rent / Buy",
    url: `https://www.amazon.com/s?k=${query}+4K&i=instant-video`,
    badge: "4K UHD",
    bg: "#002b49",
  });

  // YouTube Movies / Trailer
  platforms.push({
    name: "YouTube",
    type: "Trailer / 4K",
    url: film.trailerUrl || `https://www.youtube.com/results?search_query=${query}+official+trailer`,
    badge: "Official 4K",
    bg: "#2b0a0a",
  });

  return platforms;
}

export type ActorSpotlight = {
  id: string;
  name: string;
  slug: string;
  image: string;
  roles: string;
  signatureFilms: string[];
  description: string;
  platforms: string[];
};

export function getFilmsForActor(actorName: string): Film[] {
  const norm = actorName.toLowerCase().trim();
  return films.filter((f) =>
    f.cast.some((c) => c.name.toLowerCase().includes(norm)),
  );
}

export const actorSpotlights: ActorSpotlight[] = [
  {
    id: "robert-downey-jr",
    name: "Robert Downey Jr.",
    slug: "robert-downey-jr",
    image: "/images/actors/robert-downey-jr.jpg?v=1788626277513346000",
    roles: "Tony Stark / Iron Man, Lewis Strauss",
    signatureFilms: ["Iron Man", "Avengers: Endgame", "Oppenheimer"],
    description: "Academy Award winner and iconic titan who revolutionized modern cinema with unmatched charisma and dramatic precision.",
    platforms: ["Disney+", "Apple TV", "Prime Video", "YouTube"],
  },
  {
    id: "christian-bale",
    name: "Christian Bale",
    slug: "christian-bale",
    image: "/images/actors/christian-bale.jpg?v=1788626277513346000",
    roles: "Bruce Wayne / Batman, Alfred Borden",
    signatureFilms: ["The Dark Knight", "The Prestige", "Batman Begins"],
    description: "Chameleonic powerhouse celebrated for staggering physical transformations and intense psychological depth.",
    platforms: ["Max", "Apple TV", "Prime Video", "YouTube"],
  },
  {
    id: "leonardo-dicaprio",
    name: "Leonardo DiCaprio",
    slug: "leonardo-dicaprio",
    image: "/images/actors/leonardo-dicaprio.jpg?v=1788626277513346000",
    roles: "Dom Cobb",
    signatureFilms: ["Inception"],
    description: "Commanding leading presence who guides audiences through architectural dreamscapes and existential journeys.",
    platforms: ["Max", "Apple TV", "Prime Video", "YouTube"],
  },
  {
    id: "cillian-murphy",
    name: "Cillian Murphy",
    slug: "cillian-murphy",
    image: "/images/actors/cillian-murphy.jpg?v=1788626277513346000",
    roles: "J. Robert Oppenheimer, Robert Fischer, Scarecrow",
    signatureFilms: ["Oppenheimer", "Inception", "The Dark Knight"],
    description: "Oscar-winning cinematic force whose haunting gaze and gravitas anchor Christopher Nolan’s greatest masterworks.",
    platforms: ["Apple TV", "Prime Video", "Max", "YouTube"],
  },
  {
    id: "scarlett-johansson",
    name: "Scarlett Johansson",
    slug: "scarlett-johansson",
    image: "/images/actors/scarlett-johansson.jpg?v=1788626277513346000",
    roles: "Natasha Romanoff / Black Widow",
    signatureFilms: ["The Avengers", "Captain America: The Winter Soldier", "Black Widow"],
    description: "Acclaimed luminary balancing raw emotional vulnerability with breathtaking cinematic action and presence.",
    platforms: ["Disney+", "Apple TV", "Prime Video", "YouTube"],
  },
  {
    id: "harrison-ford",
    name: "Harrison Ford",
    slug: "harrison-ford",
    image: "/images/actors/harrison-ford.jpg?v=1788626277513346000",
    roles: "Rick Deckard, Han Solo",
    signatureFilms: ["Blade Runner 2049", "The Empire Strikes Back", "A New Hope"],
    description: "Legendary icon whose grizzled charisma defined the gold standard of space opera and dystopian science fiction.",
    platforms: ["Disney+", "Max", "Apple TV", "Prime Video"],
  },
  {
    id: "hugh-jackman",
    name: "Hugh Jackman",
    slug: "hugh-jackman",
    image: "/images/actors/hugh-jackman.jpg?v=1788626277513346000",
    roles: "Wolverine / Logan, Robert Angier, Keller Dover",
    signatureFilms: ["Deadpool & Wolverine", "Prisoners", "The Prestige"],
    description: "Versatile powerhouse spanning ferocious superhero immortality to Denis Villeneuve's raw emotional thrillers.",
    platforms: ["Disney+", "Max", "Apple TV", "Prime Video"],
  },
  {
    id: "timothee-chalamet",
    name: "Timothée Chalamet",
    slug: "timothee-chalamet",
    image: "/images/actors/timothee-chalamet.jpg?v=1788626277513346000",
    roles: "Paul Atreides, Tom Cooper",
    signatureFilms: ["Dune: Part Two", "Dune", "Interstellar"],
    description: "Defining voice of a new cinematic era, commanding Denis Villeneuve's grand Arrakis odyssey with magnetic intensity.",
    platforms: ["Max", "Apple TV", "Paramount+", "Prime Video"],
  },
];
