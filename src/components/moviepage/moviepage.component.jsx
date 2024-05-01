import React, { Children, useEffect, useState } from "react";
import "./moviepage.style.css";
import { Link, useParams } from "react-router-dom";
import { Button, Collapse, Form, Input, Select } from "antd";

export default function MoviePage() {
	const [genres, setGenres] = useState([]);
	const [movies, setMovies] = useState([]);
	const [filters, setFilters] = useState(null);
	const [currentGenre, setCurrentGenre] = useState("");
	const { genreId } = useParams();
	const [form] = Form.useForm();

	useEffect(() => {
		const getGenres = async () => {
			const requestOptions = {
				method: "GET",
			};
			await fetch("/api/movies/genre", requestOptions)
				.then((response) => {
					return response.json();
				})
				.then((data) => setGenres(data));
		};
		getGenres();
	}, [setGenres]);

	const options = [];
	genres.forEach((element) => {
		options.push({
			label: element.name,
			value: element.id,
		});
	});
	const getFilters = (e) => {
		const filterGenres = [];
		if (e.genres)
			e.genres.map((v) => {
				filterGenres.push(v);
			});
		const name = e.name;

		if (name == undefined && filterGenres.length < 1) setFilters(null);
		else setFilters({ name: name ? name : "", genres: filterGenres });
	};
	const item = [
		{
			key: "1",
			label: "Фильтры",
			children: (
				<>
					<Form onFinish={getFilters} form={form}>
						<Form.Item name="name">
							<Input placeholder="Название" />
						</Form.Item>
						<Form.Item name="genres">
							<Select
								style={{ width: "265px", margin: "0 10px 0 0" }}
								mode="multiple"
								allowClear
								showSearch={false}
								placeholder="Выберите жанры"
								options={options}
							/>
						</Form.Item>
						<div
							style={{
								display: "flex",
								gap: "15px",
								width: "100%",
								justifyContent: "center",
							}}
						>
							<Button
								onClick={() => {
									setFilters(null);
									form.resetFields();
								}}
							>
								Сбросить
							</Button>
							<Button type="primary" htmlType="submit">
								Применить
							</Button>
						</div>
					</Form>
				</>
			),
		},
	];

	const movieItem = (props) => {
		return (
			<Link
				to={"/movie/" + props.id}
				className="movie-item-wrapper"
				key={props.id + "4"}
			>
				<div className="movie-item" key={props.id}>
					<div className="image" key={props.id + "1"}>
						<img
							key={props.id + "3"}
							src={props.cover ? props.cover : ""}
						></img>
					</div>
					<div className="movie-title" key={props.id + "2"}>
						{props.name}
					</div>
				</div>
			</Link>
		);
	};

	useEffect(() => {
		const getData = async (e) => {
			return await fetch(
				genreId != undefined ? "/api/Movies/bygenre/" + genreId : "/api/Movies"
			)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					data[0].genres.map((i) => {
						if (i.id == genreId) setCurrentGenre(i.name);
					});
					setMovies(data);
				});
		};
		const getFilter = async () => {
			return await fetch(
				"/api/Movies/filtered?" +
					(filters.name.length > 0 ? "name=" + filters.name + "&" : "") +
					"genres=" +
					filters.genres
			)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					setMovies(data);
				});
		};
		if (filters) getFilter();
		else getData();
	}, [filters]);

	return (
		<div className="moviepage">
			{genreId && <h2>Фильмы с жанром {currentGenre.toLowerCase()}</h2>}
			<div className="movies-list">{movies.map((item) => movieItem(item))}</div>
			{genreId == undefined && (
				<div className="filter-list">
					<Collapse accordion items={item} />
				</div>
			)}
		</div>
	);
}
