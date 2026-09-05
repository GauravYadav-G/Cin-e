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
};
export const films: Film[] = [
  {
    id: "arrival",
    title: "Arrival",
    year: 2016,
    duration: 116,
    rating: "7.9",
    certificate: "PG-13",
    genres: ["Sci-fi", "Drama"],
    image: "/images/arrival.jpg",
    backdrop: "/images/arrival.jpg",
    color: "#526568",
    tagline: "Why are they here?",
    studio: "Paramount Pictures",
    description:
      "When mysterious spacecraft arrive on Earth, a linguist is recruited to find a way to communicate with their passengers. What she discovers will change the way she understands time, memory, and love.",
    cast: [
      { name: "Amy Adams", role: "Louise Banks" },
      { name: "Jeremy Renner", role: "Ian Donnelly" },
      { name: "Forest Whitaker", role: "Colonel Weber" },
    ],
  },
  {
    id: "dune-part-two",
    title: "Dune: Part Two",
    year: 2024,
    duration: 166,
    rating: "8.5",
    certificate: "PG-13",
    genres: ["Sci-fi", "Adventure"],
    image: "/images/dune-two.jpg",
    backdrop: "/images/dune-two-hero.jpg",
    color: "#b84b16",
    tagline: "Long live the fighters.",
    studio: "Warner Bros. Pictures",
    description:
      "Paul Atreides unites with Chani and the Fremen on a path of revenge against those who destroyed his family. Facing a choice between love and the fate of the universe, he must prevent a future only he can foresee.",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides" },
      { name: "Zendaya", role: "Chani" },
      { name: "Rebecca Ferguson", role: "Lady Jessica" },
      { name: "Javier Bardem", role: "Stilgar" },
      { name: "Austin Butler", role: "Feyd-Rautha" },
      { name: "Florence Pugh", role: "Princess Irulan" },
    ],
  },
  {
    id: "dune",
    title: "Dune",
    year: 2021,
    duration: 155,
    rating: "8.0",
    certificate: "PG-13",
    genres: ["Sci-fi", "Adventure"],
    image: "/images/dune.jpg",
    backdrop: "/images/dune.jpg",
    color: "#ad9977",
    tagline: "It begins.",
    studio: "Warner Bros. Pictures",
    description:
      "Paul Atreides journeys to the most dangerous planet in the universe to protect his family and his people. On the desert world of Arrakis, a struggle for a precious resource awakens a destiny beyond his imagination.",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides" },
      { name: "Rebecca Ferguson", role: "Lady Jessica" },
      { name: "Oscar Isaac", role: "Duke Leto" },
      { name: "Zendaya", role: "Chani" },
    ],
  },
  {
    id: "prisoners",
    title: "Prisoners",
    year: 2013,
    duration: 153,
    rating: "8.2",
    certificate: "R",
    genres: ["Thriller", "Drama"],
    image: "/images/prisoners.jpg",
    backdrop: "/images/prisoners.jpg",
    color: "#646357",
    tagline: "Every moment matters.",
    studio: "Warner Bros. Pictures",
    description:
      "When his daughter and her friend disappear, a desperate father takes matters into his own hands. As a detective follows the evidence, the search pushes everyone involved toward the edge of what they believe is right.",
    cast: [
      { name: "Hugh Jackman", role: "Keller Dover" },
      { name: "Jake Gyllenhaal", role: "Detective Loki" },
      { name: "Viola Davis", role: "Nancy Birch" },
      { name: "Paul Dano", role: "Alex Jones" },
    ],
  },
  {
    id: "enemy",
    title: "Enemy",
    year: 2013,
    duration: 91,
    rating: "6.9",
    certificate: "R",
    genres: ["Thriller", "Mystery"],
    image: "/images/enemy.jpg",
    backdrop: "/images/enemy.jpg",
    color: "#a79252",
    tagline: "You can’t escape yourself.",
    studio: "A24",
    description:
      "A quiet history professor spots his exact double in a film. His decision to seek out the actor pulls both men into an unsettling labyrinth of identity, obsession, and hidden desires.",
    cast: [
      { name: "Jake Gyllenhaal", role: "Adam / Anthony" },
      { name: "Mélanie Laurent", role: "Mary" },
      { name: "Sarah Gadon", role: "Helen" },
    ],
  },
  {
    id: "blade-runner-2049",
    title: "Blade Runner 2049",
    year: 2017,
    duration: 164,
    rating: "8.0",
    certificate: "R",
    genres: ["Sci-fi", "Thriller"],
    image: "/images/blade-runner.jpg",
    backdrop: "/images/blade-runner.jpg",
    color: "#b65729",
    tagline: "The future is still human.",
    studio: "Warner Bros. Pictures",
    description:
      "A young blade runner uncovers a secret that could unravel what remains of society. His search for answers leads him to Rick Deckard, a former blade runner who has been missing for thirty years.",
    cast: [
      { name: "Ryan Gosling", role: "Officer K" },
      { name: "Harrison Ford", role: "Rick Deckard" },
      { name: "Ana de Armas", role: "Joi" },
      { name: "Sylvia Hoeks", role: "Luv" },
    ],
  },
  {
    id: "sicario",
    title: "Sicario",
    year: 2015,
    duration: 121,
    rating: "7.7",
    certificate: "R",
    genres: ["Thriller", "Action"],
    image: "/images/sicario.jpg",
    backdrop: "/images/sicario.jpg",
    color: "#726752",
    tagline: "The border is just another line to cross.",
    studio: "Lionsgate",
    description:
      "An idealistic FBI agent joins a government task force working along the U.S.–Mexico border. Led into an increasingly uncertain operation, she finds the line between justice and revenge disappearing.",
    cast: [
      { name: "Emily Blunt", role: "Kate Macer" },
      { name: "Benicio del Toro", role: "Alejandro" },
      { name: "Josh Brolin", role: "Matt Graver" },
    ],
  },
];
export const getFilm = (id: string) => films.find((film) => film.id === id);
export const runtime = (minutes: number) =>
  `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
