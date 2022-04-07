import { CartItem } from './CartItem.js';

let cartId = 0;

export const ListItem = (name, price, imageUrl = '') => {
	const el = document.createDocumentFragment();

	const container = document.createElement('div');
	container.className = 'list-item';

	container.onclick = () => {
		const cart = document.querySelector('#cart-item-list');
		cart.appendChild(CartItem(name, price, imageUrl, cartId++));
	};

	container.innerHTML = `
    <img src="${imageUrl}" alt="Pic" width="100" height="auto" />
    <strong>
    ${name}
    </strong> - ${price}
    `;
	el.appendChild(container);
	return el;
};
