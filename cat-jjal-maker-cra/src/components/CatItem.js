function CatItem(props) {
	return (
		<li>
			{props.title}
			<img src={props.img} style={{ width: '150px' }} />
		</li>
	);
}

export default CatItem;
