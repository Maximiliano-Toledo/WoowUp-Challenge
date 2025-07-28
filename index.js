const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 3000;

// APIs propias que exponen los datos consumidos
app.get('/users', async (req, res) => {
    try {
        const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
        res.json(usersResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
        res.json(postsResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Endpoint principal
app.get('/users/posts-summary', async (req, res) => {
    try {
        const minPosts = parseInt(req.query.minPosts) || 0;

        const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
        const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');

        const usersData = usersResponse.data;
        const postsData = postsResponse.data;

        const result = usersData
            .filter(user => {
                return user && user.email && user.email.includes('@');
            })
            .map(user => {
                const usersPostsCount = postsData.filter(post => post.userId === user.id).length;

                return {
                    fullname: user.name,
                    email: user.email,
                    city: user.address.city,
                    usernameTagline: `@${user.username} from ${user.address.city}`,
                    postsCount: usersPostsCount
                }
            })
            .filter(user => user.postsCount >= minPosts); // Aplicar filtro de posts mínimos

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} : http://localhost:${PORT}`);
    console.log(`Users summary: http://localhost:${PORT}/users/posts-summary`);
    console.log(`Con filtro minPosts: http://localhost:${PORT}/users/posts-summary?minPosts=5`);
})