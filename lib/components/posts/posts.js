import { posts } from '../database';

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
