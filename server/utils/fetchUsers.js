const fs = require("fs").promises;
const path = require("path");

const fetchUsers = async () => {
    // Konstruera den fullständiga sökvägen till users.json
    const usersFilePath = path.join(__dirname, "..", "data", "users.json");

    try {
        // Läs innehållet från users.json
        const data = await fs.readFile(usersFilePath);
        // Omvandla datan till JSON-objekt och returnera det
        const users = JSON.parse(data);
        return users;
    } catch (error) {
        // Hantera eventuella fel, till exempel om filen inte kan läsas
        console.error("Error fetching users:", error);
        return []; // Returnera en tom array om det uppstår ett fel
    }
}

module.exports = fetchUsers;