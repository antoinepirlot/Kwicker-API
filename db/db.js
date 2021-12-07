const {Pool} = require("pg");

const pool = new Pool();

//pool.on from pg documentation
pool.on('error', (err, client) => {
    console.log('Unexpected error on idle client', err)
    process.exit(1)
});

async function getUser(email) {
    const query = `
        SELECT *
        FROM kwicker.get_all_users
        WHERE "email" = $1::VARCHAR(100)
    `;
    try {
        const client = await pool.connect();
        try {
            const client = await pool.connect();
            const res = await client.query(query, [email]);
            return res.rows;
        } finally {
            client.release();
        }
    } catch (e) {
        console.log(e.stack);
    }
}

async function getAllPosts() {

    try {
        const client = await pool.connect();
        try {
            const res = await client.query("SELECT * FROM kwicker.get_all_posts");
            return res.rows;
        } finally {
            client.release();
        }
    } catch (e) {
        console.log(e.stack);
    }
}

module.exports = {
    getUser,
    getAllPosts
}