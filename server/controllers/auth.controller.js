const fs = require("fs").promises
// const bcrypt = require("bcrypt")
const fetchUsers = require("../utils/fetchUsers")
const path = require("path");



const register = async (req, res) => {

    const { email, password } = req.body

    const users = await fetchUsers()
    const userAlreadyExists = users.find(u => u.email === email)

    if (userAlreadyExists) {
        return res.status(400).json("EXISTING USER, TRY AGAIN")
    }

    // const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
        email,
        password: password
// hashedPassword

    }



    const usersFilePath = path.join(__dirname, "..", "data", "users.json");
    users.push(newUser)

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).json(newUser.email)
}

const login = async (req, res) => {
    const { email, password } = req.body

    const users = await fetchUsers()
    const userExists = users.find(u => u.email === email)

    if (!userExists || !await /* bcrypt. */compare(password, userExists.password)) {
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