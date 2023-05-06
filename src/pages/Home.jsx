import React, { useEffect, useRef } from "react";
import qs from "qs";

import { useNavigate } from "react-router-dom";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import Skeleton from "../components/Skeleton/Skeleton";
import PizzaBlock from "../components/PizzaBlock";
import Pagination from "../components/Pagination/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { selectFilter, setCategoryId, setCurrentPage, setFilters } from "../redux/slices/filterSlice";
import { sortList } from "../components/Sort";
import { fetchPizzas, selectPizzaData } from "../redux/slices/pizzaSlice";

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isSearch = useRef(false);
	const isMounted = useRef(false);

	const { items, status } = useSelector(selectPizzaData)
	const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);

	const onChangeCategory = (id) => {
		dispatch(setCategoryId(id));
	};

	const onChangePage = (number) => {
		dispatch(setCurrentPage(number));
	}

	const getPizzas = () => {
		const sortBy = sort.sortProperty.replace("-", "");
		const order = sort.sortProperty.includes("-") ? "asc" : "desc";
		const category = categoryId > 0 ? `category=${categoryId}` : "";
		const search = searchValue ? `search=${searchValue}` : "";

		dispatch(
			fetchPizzas({
				sortBy,
				order,
				category,
				search,
				currentPage
			}),
		);

		window.scrollTo(0, 0)
	};

	useEffect(() => {
		if (isMounted.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sortProperty,
				categoryId,
				currentPage,
			});
			navigate(`/?${queryString}`);
		}

		isMounted.current = true;
	}, [categoryId, sort.sortProperty, currentPage]);


	useEffect(() => {
		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1));

			const sort = sortList.find((obj) => obj.sortProperty === params.sortProperty);

			dispatch(
				setFilters({
					...params,
					sort,
				}),
			);
			isSearch.current = true;
		}
	}, [])

	useEffect(() => {

		if (!isSearch.current) {
			getPizzas();
		}

		isSearch.current = false;
	}, [categoryId, sort.sortProperty, searchValue, currentPage]);


	const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj}/>);
	const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>);

	return (
		<div className="container">
			<div className="content__top">
				<Categories value={categoryId} onClickCategory={onChangeCategory}/>
				<Sort value={sort}/>
			</div>
			<h2 className="content__title">Все пиццы</h2>
			{status === "error" ? (
				<div className="content__error-info">
					<h2>Произошла ошибка 😕</h2>
					<p>
						Неудалось получит пиццы
					</p>
				</div>
			) : (
				<div className="content__items">{status === "loading" ? skeletons : pizzas}</div>
			)}
			<Pagination currentPage={currentPage} onChangePage={onChangePage}/>
		</div>
	);
};

export default Home;