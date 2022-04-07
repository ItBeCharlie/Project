const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/", (rec, res) => {
	try {
		const users = User.getUsers();
		res.send(users);
	} catch (err) {
		res.status(401).send({ message: err.message });
	}
});

router.post("/login", async (req, res) => {
	try {
		const user = await User.login(req.body.username, req.body.password);
		res.send({ ...user, password: undefined });
	} catch (error) {
		res.status(401).send({ message: error.message });
	}
});

module.exports = router;
