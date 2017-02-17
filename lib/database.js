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

export const posts = Nano(dbUrl).db.use('posts');
export const users = Nano(dbUrl).db.use('users');
export const viewPostsUrl = '_view/all';
