import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';
import Form from './components/Form';
import CatItem from './components/CatItem';
import Favorites from './components/Favorites';
import MainCard from './components/MainCard';

const jsonLocalStorage = {
	setItem: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	getItem: (key) => {
		return JSON.parse(localStorage.getItem(key));
	},
};

const fetchCat = async (text) => {
	const OPEN_API_DOMAIN = 'https://cataas.com';
	const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
	const responseJson = await response.json();
	const responseUrl = response.url
		.slice(0, response.url.indexOf('?'))
		.replace('cat/', `cat/${responseJson._id}/`);
	return `${responseUrl}`;
};

function App() {
	const [counter, setCounter] = React.useState(() => {
		return jsonLocalStorage.getItem('counter');
	});
	// 위의 줄과 같음
	// const counterState = React.useState(1);
	// const counter = counterState[0];
	// const setCounter = counterState[1];

	const [mainCat, setMainCat] = React.useState('');

	console.log(mainCat);

	const [favorites, setFavorites] = React.useState(() => {
		return jsonLocalStorage.getItem('favorites') || [];
	});

	const alreadyFavorites = favorites.includes(mainCat);

	async function setInitialCat() {
		const newCat = await fetchCat('First Cat');

		setMainCat(newCat);
	}

	React.useEffect(() => {
		setInitialCat();
	}, []);

	async function updateMainCat(value) {
		const newCat = await fetchCat(value);

		setMainCat(newCat);

		setCounter((prev) => {
			console.log('prev', prev);
			const nextCounter = prev + 1;
			jsonLocalStorage.setItem('counter', nextCounter);
			return nextCounter;
		});
	}

	function handleHeartClick() {
		const nextFavorites = [...favorites, mainCat];
		setFavorites(nextFavorites);
		jsonLocalStorage.setItem('favorites', nextFavorites);
	}

	const counterTitle = counter == null ? '' : counter + '번째 ';

	return (
		<div>
			<Title>{counterTitle}고양이 가라사대</Title>
			<Form updateMainCat={updateMainCat} />
			<MainCard
				img={mainCat}
				onHeartClick={handleHeartClick}
				alreadyFavorites={alreadyFavorites}
			/>
			<Favorites favorites={favorites} />
		</div>
	);
}

export default App;
