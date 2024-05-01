const fs = require("fs").promises;
const path = require("path");

const fetchUsers = async () => {

    const usersFilePath = path.join(__dirname, "..", "data", "users.json");

    try {

        const data = await fs.readFile(usersFilePath);

        const users = JSON.parse(data);
        return users;
    } catch (error) {

        console.error("Error fetching users:", error);
        return []; 
    }
}

module.exports = fetchUsers;