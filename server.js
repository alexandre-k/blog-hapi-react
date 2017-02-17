import Hapi from 'hapi';
import Hoek from 'hoek';
import Vision from 'vision';
import HapiAuthJWT from 'hapi-auth-jwt2';
import HapiReactViews from 'hapi-react-views';
import Nano from 'nano';

const dbUrl = 'http://localhost:5984';

Nano(dbUrl).auth('admin', 'admin', (err, body, headers) => {
  if (err) return console.log(err);
  if (headers && headers['set-cookie']) {
      let auth;
      auth = headers['set-cookie'];
  }
  console.log('Authenticated');
});

const posts = Nano(dbUrl).db.use('posts');
const users = Nano(dbUrl).db.use('users');
const viewPostsUrl = '_view/all';

const server = new Hapi.Server({
    debug: {
        request: ['info']
    }
});

server.connection({
    host: 'localhost',
    port:3000
});

const people = {
    username: 'admin',
    password: 'admin'
}

function validate(decoded, request, callback) {
    console.log(decoded, request, callback);
    if (decoded.username === people.username) {
        return callback(null, false);
    } else {
        return callback(null, true);
    }
    return
}

server.register(HapiAuthJWT, err => {
    if (err) throw err;

    server.auth.strategy('jwt', 'jwt', {
        key: 'Iwe01mql43weqQW8',
        validateFunc: validate,
    });

    server.auth.default('jwt');
})

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

server.route([{
    method: 'GET',
    path: '/posts',
    config: { auth: false },
    handler: getPosts
},
{
    method: 'GET',
    path: '/posts/{id}',
    config: { auth: false },
    handler: getPost
},
{
    method: 'POST',
    path: '/auth',
    config: { auth: false },
    handler: verifyCredentials
}])

function getPosts(request, reply) {
    posts.view('posts', 'all', (err, body) => {
        if (err) throw err;
        reply({data: body.rows});
    });
}

function getPost(request, reply) {
    console.log(request.params.id);
    posts.get(request.params.id, (err, body) => {
        if (err) throw err;
        reply({data: body})
            .header('Authorization', request.headers.authorization);
    })
}

function verifyCredentials(request, reply) {
    const { username, password } = request.payload;
    /*users.get('admin', { revs_info: true }, function(err, body) {
        if (!err) console.log(body);
    });*/
}

server.start((err) => {
  if (err) console.log(err);
  console.log('Server running at:', server.info.uri)
})
