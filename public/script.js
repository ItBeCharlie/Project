import { ListItem } from './components/ListItem.js';

class User {
	constructor(fname, lname, uname, psw, bdate) {
		this._fname = fname;
		this._lname = lname;
		this._uname = uname;
		this._psw = psw;
		this._bdate = bdate;
	}

	get fname() {
		return this._fname;
	}

	get lname() {
		return this._lname;
	}

	get uname() {
		return this._uname;
	}

	get psw() {
		return this._psw;
	}

	get bdate() {
		return this._bdate;
	}

	set fname(fname) {
		this._fname = fname;
	}

	set lname(lname) {
		this._lname = lname;
	}

	set uname(uname) {
		this._uname = uname;
	}

	set psw(psw) {
		this._psw = psw;
	}

	set bdate(bdate) {
		this._bdate = bdate;
	}
}

document.getElementById('register-form').onsubmit = (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const user = {
		fname: formData.get('fname'),
		lname: formData.get('lname'),
		uname: formData.get('uname'),
		psw: formData.get('psw'),
		bdate: formData.get('bdate'),
	};

	const u = new User(user.fname, user.lname, user.uname, user.psw, user.bdate);
	console.log('AAA', u);
};

document.getElementById('login-form').onsubmit = (e) => {
	e.preventDefault();
	const formData = new FormData(e.target);
	const user = {
		uname: formData.get('uname'),
		psw: formData.get('psw'),
	};

	console.log(user);
};
