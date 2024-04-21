import { React, useState, useEffect } from "react";

import "./lab.style.css";
import { useParams } from "react-router-dom";

const MovieList = ({ movie, setMovie, removeMovie, user }) => {
	useEffect(() => {
		const getMovie = async () => {
			const requestOptions = {
				method: "GET",
			};
			return await fetch(`/api/Movies`, requestOptions)
				.then((r) => r.json())
				.then((data) => setMovie(data));
		};
		getMovie();
	}, [setMovie]);

	const remove = async (id) => {
		const requestOptions = {
			method: "DELETE",
		};
		return await fetch(`/api/Movies/${id}`, requestOptions).then((response) => {
			if (response.ok) removeMovie(id);
		});
	};
	return (
		<>
			<h2 className="movieList">Список фильмов</h2>
			<ol className="Movie">
				{movie.map(({ id, name, description, genres }) => {
					let genreline = "";
					genres.map(({ id, name }) => (genreline = genreline + name + ", "));
					genreline = genreline.slice(0, -2);
					return (
						<li key={id} id={id}>
							<h3>{name}</h3>
							{genreline && (
								<>
									<span>Жанры: {genreline}</span>
									<br />
								</>
							)}
							{description && (
								<>
									<span>{description}</span>
									<br />
								</>
							)}
							{user.userRole === "admin" && (
								<button
									onClick={(e) => {
										e.preventDefault();
										remove(id);
									}}
								>
									Удалить
								</button>
							)}
							{user.userRole === "admin" && (
								<a href={"/lab/" + id}>Редактировать</a>
							)}
						</li>
					);
				})}
			</ol>
		</>
	);
};
const MovieInsert = ({ addMovie }) => {
	const createMovie = (e) => {
		e.preventDefault();
		const [name, description] = [
			e.target.elements.name.value,
			e.target.elements.description.value,
		];

		const create = async () => {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, description }),
			};
			return await fetch("/api/Movies", requestOptions)
				.then((response) => response.json())
				.then((data) => addMovie(data));
		};
		create();
	};
	return (
		<>
			<h2>Создание фильма</h2>
			<form className="Insertion" onSubmit={createMovie}>
				<input
					type="text"
					autoComplete="movieName"
					name="name"
					placeholder="Название"
					required
					className="TextInput"
				/>
				<input
					type="text"
					autoComplete="movieDescription"
					name="description"
					placeholder="Описание"
					required
					className="TextInput"
				/>
				<input type="submit" value="Создать" className="sendButton" />
			</form>
		</>
	);
};
const MovieEdit = (props) => {
	const [movie, setMovie] = useState(null);

	useEffect(() => {
		const getMovie = async () => {
			const requestOptions = {
				method: "GET",
			};
			return await fetch(`/api/Movies/${props.id}`, requestOptions)
				.then((r) => r.json())
				.then((data) => setMovie(data));
		};
		getMovie();
	}, [setMovie]);
	const editMovie = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(movie),
		};
		return await fetch(`/api/Movies/${movie.id}`, requestOptions).then((r) => {
			if (r.status == 200) window.location.replace("/lab/");
		});
	};
	if (movie == null) return <></>;
	return (
		<>
			<h2>Редактирование фильма</h2>
			<form className="Insertion" onSubmit={editMovie}>
				<input
					type="text"
					autoComplete="movieName"
					name="name"
					placeholder="Название"
					value={movie.name}
					onChange={(e) => {
						e.preventDefault();
						if (e.target.value == null) return;
						let object = Object.assign({}, movie);
						object.name = e.target.value;
						setMovie(object);
					}}
					required
					className="TextInput"
				/>
				<input
					type="text"
					autoComplete="movieDescription"
					name="description"
					placeholder="Описание"
					value={movie.description ? movie.description : ""}
					onChange={(e) => {
						e.preventDefault();
						if (e.target.value == null) return;
						let object = Object.assign({}, movie);
						object.description = e.target.value;
						setMovie(object);
					}}
					required
					className="TextInput"
				/>
				<input type="submit" value="Изменить" className="sendButton" />
			</form>
			<a href="/lab/" className="backButton">
				Назад
			</a>
		</>
	);
};
export default function Lab(props) {
	const [movies, setMovies] = useState([]);
	const removeMovies = (movieid) =>
		setMovies(movies.filter(({ id }) => id !== movieid));
	const addMovie = (movie) => setMovies([...movies, movie]);
	const user = props.user;

	const params = useParams();
	const id = params.id;

	return (
		<>
			<div className="MainLab">
				{id && user.isAuthenticated && <MovieEdit id={id} />}
				{!id && (
					<>
						{user.userRole === "admin" && <MovieInsert addMovie={addMovie} />}
						<MovieList
							movie={movies}
							setMovie={setMovies}
							user={user}
							removeMovie={removeMovies}
						/>
					</>
				)}
			</div>
		</>
	);
}
