const fs = require("fs").promises
const bcrypt = require("bcrypt")
const fetchUsers = require("../utils/fetchUsers")
const path = require("path");


const DatabaseConnection = require('../DatabaseConnection');  

const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await DatabaseConnection.getInstance().findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await DatabaseConnection.getInstance().createUser({
            email,
            password: hashedPassword  
        });

        const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
        const users = JSON.parse(await fs.readFile(usersFilePath));
        users.push({ email, password: hashedPassword, _id: userId });
        await fs.writeFile(usersFilePath, JSON.stringify(users, null, 4));

        res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        console.error("Failed to register user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body

    const users = await fetchUsers()
    const userExists = users.find(u => u.email === email)

    if (!userExists || !await bcrypt.compare(password, userExists.password)) {
        return res.status(400).json("WRONG PASSWORD")
    }

    req.session.user = userExists
    res.status(200).json(userExists.email)
}

const logout = (req, res) => {
    req.session = null
    res.status(200).json("LOGGED OUT")
}
const authorize = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json("NOT LOGGED IN")
    }
    res.status(200).json(req.session.user.email)
}

module.exports = { register, login, logout, authorize }