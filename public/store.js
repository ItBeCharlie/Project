import { ListItem } from './components/ListItem.js';

for (let i = 1000; i < 1010; i++) document.getElementById('items').appendChild(ListItem('Test', '$40', `https://picsum.photos/id/${i}/200/200`));
