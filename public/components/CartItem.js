export const CartItem = (name, price, imageUrl = '', id) => {
	const el = document.createDocumentFragment();

	const container = document.createElement('div');
	container.className = 'list-item';
	container.id = id;
	container.onclick = () => {
		container.remove();
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
