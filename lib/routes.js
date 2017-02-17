import { getPosts, getPost } from './components/posts/posts';
import { verifyCredentials } from './components/authentication/credentials';

const routes = [{
    method: 'GET',
    path: '/posts',
    //config: { auth: false },
    handler: getPosts
},
{
    method: 'GET',
    path: '/posts/{id}',
//    config: { auth: false },
    handler: getPost
},
{
    method: 'POST',
    path: '/auth',
//    config: { auth: false },
    handler: verifyCredentials
}]

export default routes;
