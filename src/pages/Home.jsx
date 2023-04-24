import React, { useContext, useEffect, useState } from "react";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/Skeleton/Skeleton";
import PizzaBlock from "../components/PizzaBlock";
import Pagination from "../components/Pagination/Pagination";
import { SearchContext } from "../App";

const Home = () => {
	const {searchValue} = useContext(SearchContext);
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1)
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
		const search = searchValue ? `&search=${searchValue}` : "";

		fetch(`https://643f8896b9e6d064bef7b69c.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
		)
			.then((res) => res.json())
			.then((arr) => {
				setItems(arr);
				setIsLoading(false);
			});
		window.scroll(0, 0)
	}, [categoryId, sortType, searchValue, currentPage]);

	const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj}/>);
	const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

	return (
		<div className="container">
			<div className="content__top">
				<Categories value={categoryId} onClickCategory={(i) => setCategoryId(i)}/>
				<Sort value={sortType} onClickSort={(i) => setSortType(i)}/>
			</div>
			<h2 className="content__title">Все пиццы</h2>
			<div className="content__items">{isLoading ? skeletons : pizzas}</div>
			<Pagination onChangePage={(number) => setCurrentPage(number)}/>
		</div>
	);
};

export default Home;