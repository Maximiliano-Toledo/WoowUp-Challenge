
const express = require('express')
const axios = require('axios')

const app = express()
const PORT = 3000;

// Función para hacer request con retry
const fetchWithRetry = async (url, retries = 1) => {
    try {
        return await axios.get(url);
    } catch (error) {
        if (retries > 0) {
            console.log(`Retry attempt for ${url}`);
            return await fetchWithRetry(url, retries - 1);
        }
        throw error;
    }
};

// APIs propias que exponen los datos consumidos
app.get('/users', async (req, res) => {
    try {
        const usersResponse = await fetchWithRetry('https://jsonplaceholder.typicode.com/users');
        res.json(usersResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
});

app.get('/posts', async (req, res) => {
    try {
        const postsResponse = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts');
        res.json(postsResponse.data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Endpoint principal
app.get('/users/posts-summary', async (req, res) => {
    try {
        const minPosts = parseInt(req.query.minPosts) || 0;

        const usersResponse = await fetchWithRetry('https://jsonplaceholder.typicode.com/users');
        const postsResponse = await fetchWithRetry('https://jsonplaceholder.typicode.com/posts');

        const usersData = usersResponse.data;
        const postsData = postsResponse.data;

        const result = usersData
            .filter(user => {
                // Excluir usuarios nulos/undefined o con emails inválidos
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

// Endpoint adicional para obtener estadísticas de validación
app.get('/users/validation-stats', async (req, res) => {
    try {
        const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
        const usersData = usersResponse.data;

        const totalUsers = usersData.length;
        const validUsers = usersData.filter(user => user && user.email && user.email.includes('@')).length;
        const invalidUsers = totalUsers - validUsers;

        res.json({
            totalUsers,
            validUsers,
            invalidUsers,
            validationRate: ((validUsers / totalUsers) * 100).toFixed(2) + '%'
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching validation stats' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT} : http://localhost:${PORT}`);
    console.log(`Users summary: http://localhost:${PORT}/users/posts-summary`);
    console.log(`Con filtro minPosts: http://localhost:${PORT}/users/posts-summary?minPosts=5`);
})