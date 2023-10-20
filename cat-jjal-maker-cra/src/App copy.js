import logo from './logo.svg';
import React from 'react';
import './App.css';
import Title from './components/Title';
//import Form from './components/Form';
//import CatItem from './components/CatItem';
//import MainCard from './components/MainCard';
//import Favorites from './components/Favorites';

const jsonLocalStorage = {
	setItem: (key, value) => {
		localStorage.setItem(key, JSON.stringify(value));
	},
	getItem: (key) => {
		return JSON.parse(localStorage.getItem(key));
	},
};

function MainCard({ img, onHeartClick, alreadyFavorites }) {
	const heartIcon = alreadyFavorites ? '💖' : '🤍';
	return (
		<div className='main-card'>
			<img src={img} alt='고양이' width='400' />
			<button onClick={onHeartClick}>{heartIcon}</button>
		</div>
	);
}

const Form = ({ updateMainCat }) => {
	const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

	const [value, setValue] = React.useState('');
	const [errorMesseage, setErrorMessage] = React.useState('');

	function handleInputChange(e) {
		const userValue = e.target.value;
		setErrorMessage('');
		if (includesHangul(userValue) == true) {
			setErrorMessage('한글은 입력할 수 없습니다.');
			// setValue('');
		}
		setValue(userValue.toUpperCase());
	}

	function handleFormSubmit(e) {
		e.preventDefault();
		setErrorMessage('');
		if (value === '') {
			setErrorMessage('빈 값으로 만들 수 없습니다.');
			return;
		}
		updateMainCat(value);
	}

	return (
		<form onSubmit={handleFormSubmit}>
			<input
				type='text'
				name='name'
				placeholder='영어 대사를 입력해주세요'
				value={value}
				onChange={handleInputChange}
			/>
			<button type='submit'>생성</button>
			<p style={{ color: 'red' }}>{errorMesseage}</p>
		</form>
	);
};

function CatItem(props) {
	return (
		<li>
			{props.title}
			<img src={props.img} style={{ width: '150px' }} />
		</li>
	);
}

function Favorites({ favorites }) {
	if (favorites.length === 0) {
		return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요! </div>;
	}
	return (
		<ul className='favorites'>
			{favorites.map((cat) => (
				<CatItem img={cat} key={cat} />
			))}
		</ul>
	);
}

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
