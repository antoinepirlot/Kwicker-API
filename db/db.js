const {Pool} = require("pg");

const dbUser = undefined;
const dbPassword = undefined; //For the heroku's mdp we'll do it later. So, change to use your dbPassword
// and please, don't push your dbPassword :p

const dbCreditentials = {
    host: "localhost",
    port: 5432,
    user: dbUser,
    password: dbPassword
}
const pool = new Pool(dbCreditentials);

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

//module.exports = pool;