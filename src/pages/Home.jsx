import React, { useEffect, useState } from "react";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/Skeleton/Skeleton";
import PizzaBlock from "../components/PizzaBlock";

const Home = () => {
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [categoryId, setCategoryId] = useState(0);
	const [sortType, setSortType] = useState({
		name: "популярности",
		sortProperty: "rating",
	});

	useEffect(() => {
		setIsLoading(true);

		const sortBy = sortType.sortProperty.replace("-", "");
		const order = sortType.sortProperty.includes("-") ? "asc" : "desc";
		const category = categoryId > 0 ? `category=${categoryId}` : "";

		fetch(`https://643f8896b9e6d064bef7b69c.mockapi.io/items?${category}&sortBy=${sortBy}&order=${order}`,
		)
			.then((res) => res.json())
			.then((arr) => {
				setItems(arr);
				setIsLoading(false);
			});
		window.scroll(0, 0)
	}, [categoryId, sortType]);

	return (
		<div className="container">
			<div className="content__top">
				<Categories value={categoryId} onClickCategory={(i) => setCategoryId(i)}/>
				<Sort value={sortType} onClickSort={(i) => setSortType(i)}/>
			</div>
			<h2 className="content__title">Все пиццы</h2>
			<div className="content__items">
				{isLoading
					? [...new Array(6)].map((_, index) => <Skeleton key={index}/>)
					: items.map((obj) => <PizzaBlock key={obj.id} {...obj}/>)
				}
			</div>
		</div>
	);
};

export default Home;