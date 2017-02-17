import Hapi from 'hapi';
import Hoek from 'hoek';
import Vision from 'vision';
import HapiAuthJWT from 'hapi-auth-jwt2';
import HapiReactViews from 'hapi-react-views';
import routes from './lib/routes';

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

server.register(Vision, err => {
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

server.route(routes)

server.start((err) => {
  if (err) console.log(err);
  console.log('Server running at:', server.info.uri)
})
