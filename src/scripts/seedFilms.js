const db = require('../config/sqlite');

const films = [
  {
    title: "Avatar",
    genre: "Action, Adventure, Fantasy, Sci-Fi",
    annee_sortie: 2009,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Sam Worthington, Zoe Saldana, Sigourney Weaver, Stephen Lang, Michelle Rodriguez, Giovanni Ribisi",
    realisateurs: "James Cameron",
    available_copies: 5,
    imgPath: "https://m.media-amazon.com/images/I/41kTVLeW1CL._AC_SY780_.jpg",
    trailer: "https://www.youtube.com/embed/5PSNL1qE6VY"
  },
  {
    title: "Teenage Mutant Ninja Turtles",
    genre: "Action, Adventure, Comedy, Crime, Drama, Family, Sci-Fi",
    annee_sortie: 1990,
    langue_originale: "English",
    pays_productions: "Hong Kong, USA",
    acteurs: "Brian Tochi, Leonardo, Corey Feldman, Donatello, David Forman, Leonardo, David McCharen, The Shredder, Elias Koteas, Casey Jones, James Saito, The Shredder, Josh Pais, Raphael, Judith Hoag, April O'Neil, Kevin Clash, Splinter, Leif Tilden, Donatello, Michael McConnohie, Tatsu, Michael Turney, Danny Pennington, Michelan Sisti, Michaelangelo, Robbie Rist, Michaelangelo, Toshirô Obata, Tatsu",
    realisateurs: "Steve Barron",
    available_copies: 5,
    imgPath: "https://collider.com/wp-content/uploads/2023/07/teenage-mutant-ninja-turtles-mutant-mayhem-cast-characters.jpg",
    trailer: "https://www.youtube.com/embed/zxkqixUKZt8?si=rzuudzSmM9n9AZm9"
  },
  {
    title: "Fast & Furious",
    genre: "Action, Crime, Drama, Thriller",
    annee_sortie: 2009,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Gal Gadot, Gisele Harabo, Greg Cipes, Dwight, Jack Conley, Penning, John Ortiz, Campos, Jordana Brewster, Mia Toretto, Laz Alonso, Fenix Rise, Liza Lapira, Agent Sophie Trinh, Michelle Rodriguez, Letty, Mirtha Michelle, Cara, Paul Walker, Brian O'Conner, Shea Whigham, Agent Ben Stasiak, Sung Kang, Han Lue, Vin Diesel, Dominic Toretto",
    realisateurs: "Justin Lin",
    available_copies: 5,
    imgPath: "https://www.justwatch.com/images/backdrop/244707882/s640/fast-and-furious-1.jpg",
    trailer: "https://www.youtube.com/embed/k98tBkRsGl4?si=JR7psyc-ZOoD4Ldo"
  },
  {
    title: "Sister Act",
    genre: "Comedy, Crime, Music",
    annee_sortie: 1992,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Bill Nunn, Lt. Eddie Souther, Carmen Zapata, Choir Nun, Ellen Albertini Dow, Choir Nun, Georgia Creighton, Choir Nun, Harvey Keitel, Vince LaRocca, Kathy Najimy, Sister Mary Patrick, Maggie Smith, Mother Superior, Mary Wickes, Sister Mary Lazarus, Pat Crawford Brown, Choir Nun, Prudence Wright Holmes, Choir Nun, Susan Johnson-Kehn, Choir Nun, Wendy Makkena, Sister Mary Robert, Whoopi Goldberg, Deloris Van Cartier",
    realisateurs: "Emile Ardolino",
    available_copies: 5,
    imgPath: "https://www.rottentomatoes.com/img/movie/thumbnail/full/sister_act.jpg",
    trailer: "https://www.youtube.com/embed/lCBjHkCK1Vw?si=ZAAVGVW1VAs6U9Rg"
  },
  {
    title: "Hook",
    genre: "Adventure, Family, Fantasy",
    annee_sortie: 1991,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Amber Scott, Maggie Banning, Arthur Malet, Tootles, Bob Hoskins, Smee, Caroline Goodall, Moira Banning, Charlie Korsmo, Jack 'Jackie' Banning, Dante Basco, Rufio, Dustin Hoffman, Capt. Hook, Isaiah Robinson, Pockets, Jasen Fisher, Ace, Julia Roberts, Tinkerbell, Maggie Smith, Granny Wendy, Phil Collins, Inspector Good, Raushan Hammond, Thud Butt, Robin Williams, Peter Banning",
    realisateurs: "Steven Spielberg",
    available_copies: 5,
    imgPath: "https://www.comingsoon.net/wp-content/uploads/sites/3/2021/12/Hook-1.jpg",
    trailer: "https://www.youtube.com/embed/c-vwgt8cwEM?si=KQ8X6bNXGZVgK9AO"
  },
  {
    title: "Schindler's List",
    genre: "Biography, Drama, History, War",
    annee_sortie: 1993,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Andrzej Seweryn, Julian Scherner, Ben Kingsley, Itzhak Stern, Caroline Goodall, Emilie Schindler, Embeth Davidtz, Helen Hirsch, Liam Neeson, Oskar Schindler, Norbert Weisser, Albert Hujar, Ralph Fiennes, Amon Goeth",
    realisateurs: "Steven Spielberg",
    available_copies: 5,
    imgPath: "https://m.media-amazon.com/images/I/51Z0WWuLk0L._AC_.jpg",
    trailer: "https://www.youtube.com/embed/gG22XNhtnoY?si=aAS5RRz0fZv--5s3"
  },
  {
    title: "Twilight",
    genre: "Drama, Fantasy, Romance",
    annee_sortie: 2008,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Anna Kendrick, Jessica, Ashley Greene, Alice Cullen, Billy Burke, Charlie Swan, Christian Serratos, Angela, Gil Birmingham, Billy Black, Justin Chon, Eric Yorkie, Kellan Lutz, Emmet Cullen, Kristen Stewart, Bella Swan, Michael Welch, Mike Newton, Nikki Reed, Rosalie, Robert Pattinson, Edward Cullen, Sarah Clarke, Renée, Taylor Lautner, Jacob Black",
    realisateurs: "Catherine Hardwicke",
    available_copies: 5,
    imgPath: "https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/12/Twilight-Breaking-Dawn-Promo.jpg",
    trailer: "https://www.youtube.com/embed/uxjNDE2fMjI?si=9bYvNwKcaxUhcuIp"
  },
  {
    title: "Léon",
    genre: "Crime, Thriller",
    annee_sortie: 1994,
    langue_originale: "English",
    pays_productions: "France",
    acteurs: "Danny Aiello, Tony, Gary Oldman, Stansfield, Jean Reno, Léon, Natalie Portman, Mathilda, Peter Appel, Malky",
    realisateurs: "Luc Besson",
    available_copies: 5,
    imgPath: "https://a.ltrbxd.com/resized/sm/upload/ps/gc/mx/3y/leon-the-professional-160-1200-1200-675-675-crop-000000.jpg?v=a67910cd08",
    trailer: "https://www.youtube.com/embed/rNw0D7Hh0DY?si=NVeg7NrABBhRNK5u"
  },
  {
    title: "Pulp Fiction",
    genre: "Crime, Thriller",
    annee_sortie: 1994,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Amanda Plummer, Honey Bunny - Yolanda, Bruce Willis, Butch Coolidge, Duane Whitaker, Maynard, Eric Stoltz, Lance, Frank Whaley, Brett, John Travolta, Vincent Vega, Maria de Medeiros, Fabienne, Paul Calderon, Paul, Peter Greene, Zed, Phil LaMarr, Marvin, Rosanna Arquette, Jody, Samuel L. Jackson, Jules Winnfield, Tim Roth, Pumpkin - Ringo, Uma Thurman, Mia Wallace, Ving Rhames, Marsellus Wallace",
    realisateurs: "Quentin Tarantino",
    available_copies: 5,
    imgPath: "https://www.imdb.com/title/tt0110912/mediaviewer/rm1959546112/?ref_=tt_ov_i",
    trailer: "https://www.youtube.com/embed/s7EdQ4FqbhY?si=ycR7ZFTr0pMRI4ie"
  },
  {
    title: "True Lies",
    genre: "Action, Comedy, Romance, Thriller",
    annee_sortie: 1994,
    langue_originale: "English",
    pays_productions: "USA",
    acteurs: "Arnold Schwarzenegger, Harry Tasker, Art Malik, Salim Abu Aziz, Bill Paxton, ...",
    realisateurs: "James Cameron",
    available_copies: 5,
    imgPath: "https://m.media-amazon.com/images/S/pv-target-images/6b13200062db69df3d036877989c18cd462fe0bb9282f8a963933471adac5cf9.jpg",
    trailer: "https://www.youtube.com/embed/3B7HG8_xbDw?si=QWU3QXWfIJ_2y9fm"
  }
];

films.forEach(film => {
  db.run(
    `INSERT INTO films (title, genre, annee_sortie, langue_originale, pays_productions, acteurs, realisateurs, available_copies, imgPath, trailer)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [film.title, film.genre, film.annee_sortie, film.langue_originale, film.pays_productions, film.acteurs, film.realisateurs, film.available_copies, film.imgPath, film.trailer],
    function(err) {
      if (err) {
        console.error('Erreur insertion film:', film.title, err.message);
      } else {
        console.log('Film inséré:', film.title);
      }
    }
  );
}); 