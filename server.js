import Hapi from 'hapi';
import Hoek from 'hoek';
import Vision from 'vision';
import HapiReactViews from 'hapi-react-views';
import Nano from 'nano';

require('babel-core/register')({
    presets: ['react', 'es2015']
});

Nano('http://localhost:5984').auth('admin', 'admin', (err, body, headers) => {
  if (err) return console.log(err);
  if (headers && headers['set-cookie']) {
      let auth;
      auth = headers['set-cookie'];
  }
  console.log('Authenticated');
});

const db = Nano('http://localhost:5984').db.use('posts');
const viewPostsUrl = '_view/all';

const server = new Hapi.Server();

server.register(Vision, (err) => {
  Hoek.assert(!err, err);

  server.views({
    engines: {
      html: require('ejs'),
//      jsx: HapiReactViews
    },
    relativeTo: __dirname,
    path: 'templates'
  });
});

server.connection({
    host: 'localhost',
    port:3000
});

server.route({
    method: 'GET',
    path: '/',
    handler: getPosts
})

function getPosts(request, reply) {
    db.view('posts', 'all', (err, body) => {
        console.log('body')
        if (!err) reply.view('index', {posts:body.rows});
    })
}

server.start((err) => {
  if (err) console.log(err);
  console.log('Server running at:', server.info.uri)
})
