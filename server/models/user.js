const users = [
	{
		userId: 12345,
		userName: "cathy123",
	},
	{
		userId: 55555,
		userName: "fredburger54",
	},
];

let getUsers = () => users;

const login = (username, password) => {
	const user = users.filter((u) => u.userName === username);
	if (!user[0]) throw Error("User not found");
	if (user[0].password !== password) throw Error("Incorrect Password");

	return user[0];
};

module.exports = { getUsers, login };
