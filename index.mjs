import express from 'express';
const planets = (await import('npm-solarsystem')).default;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
//root route
app.get('/', async (req, res) => {
   let randomImageResponse = await fetch('https://pixabay.com/api/?key=20426927-497d14db9c234faf7d0df8317&per_page=50&orientation=horizontal&q=solar%20system');
   let randomImageData = await randomImageResponse.json();

   let index = Math.floor(Math.random() * randomImageData.hits.length);
   let randomImageUrl = randomImageData.hits[index].largeImageURL;

   res.render('home.ejs', {image: randomImageUrl});
});

app.get('/planetInfo', (req, res) => {
   let planet = req.query.planet;
   let planetInfo = planets[`get${planet}`]();
   res.render('planet.ejs', {planetInfo, planet})
});

app.get('/comets', (req, res) => {
   let comets = planets.getComets();
   res.render('comets.ejs', {comets})
});

app.get('/asteroids', (req, res) => {
   let asteroids = planets.getAsteroids();
   res.render('asteroids.ejs', {asteroids})
});

app.get('/nasaPod', async(req, res) => {
   let today = new Date();
   let date = today.toISOString().split('T')[0];
   let nasa = await fetch(`https://api.nasa.gov/planetary/apod?api_key=9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD&date=${date}`)
   let nasaImageData = await nasa.json()
   let nasaImageUrl = nasaImageData.url;
   res.render('nasa.ejs', {nasaImageUrl});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('server started');
});