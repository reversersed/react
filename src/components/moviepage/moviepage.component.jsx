import React, { useEffect, useState } from "react";
import "./moviepage.style.css";
import { Link, useParams } from "react-router-dom";

export default function MoviePage() {
	const [movies, setMovies] = useState([]);
	const [currentGenre, setCurrentGenre] = useState("");
	const { genreId } = useParams();

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
		getData();
	}, [movies]);

	return (
		<div className="moviepage">
			{currentGenre.length > 0 && (
				<h2>Фильмы с жанром {currentGenre.toLowerCase()}</h2>
			)}
			<div className="movies-list">{movies.map((item) => movieItem(item))}</div>
		</div>
	);
}
