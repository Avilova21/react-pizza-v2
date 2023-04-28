import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/Skeleton/Skeleton";
import PizzaBlock from "../components/PizzaBlock";
import Pagination from "../components/Pagination/Pagination";
import { SearchContext } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setCategoryId, setCurrentPage } from "../redux/slices/filterSlice";

const Home = () => {
	const dispatch = useDispatch();
	const { categoryId, sort, currentPage } = useSelector(state => state.filterSlice);
	const sortType = sort.sortProperty;

	const { searchValue } = useContext(SearchContext);
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const onClickCategory = (id) => {
		dispatch(setCategoryId(id));
	}

	const onChangePage = (number) => {
		dispatch(setCurrentPage(number));
	}

	useEffect(() => {
		setIsLoading(true);

		const sortBy = sortType.replace("-", "");
		const order = sortType.includes("-") ? "asc" : "desc";
		const category = categoryId > 0 ? `category=${categoryId}` : "";
		const search = searchValue ? `&search=${searchValue}` : "";

		axios.get(`https://643f8896b9e6d064bef7b69c.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`)
			.then((res) => {
				setItems(res.data);
				setIsLoading(false);
			});

		window.scroll(0, 0)
	}, [categoryId, sortType, searchValue, currentPage]);

	const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj}/>);
	const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

	return (
		<div className="container">
			<div className="content__top">
				<Categories value={categoryId} onClickCategory={onClickCategory}/>
				<Sort/>
			</div>
			<h2 className="content__title">Все пиццы</h2>
			<div className="content__items">{isLoading ? skeletons : pizzas}</div>
			<Pagination currentPage={currentPage} onChangePage={onChangePage}/>
		</div>
	);
};

export default Home;