import react, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./movie.style.css";

export default function MovieComponent(props) {
	const user = props.user;
	let { movieId } = useParams();
	const [movie, setMovie] = useState();
	const pageOffset = 15;
	const [page, setPage] = useState(1);

	useEffect(() => {
		const getData = async (e) => {
			const requestOptions = {
				method: "GET",
			};
			return await fetch("api/Movies/" + movieId)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					setMovie(data);
				});
		};
		getData();
	}, [setMovie]);

	const renderReviews = () => {
		return (
			movie &&
			movie.reviews &&
			movie.reviews
				.slice((page - 1) * pageOffset, page * pageOffset)
				.map((item) => (
					<div className="review" key={item.id}>
						<div className="review-header">
							<span className="user">{item.username}</span>
							<span className="rating">{item.rating}/5</span>
						</div>
						<span className="review-text">{item.text}</span>
					</div>
				))
		);
	};
	const renderPages = () => {
		return <></>;
	};
	return (
		<div className="movie-page">
			<div className="movie-page-wrapper">
				<div className="about-block">
					<div className="movie-cover">
						<img src={movie && movie.cover ? movie.cover : ""} />
					</div>
					<div className="movie-about-info">
						<h2 className="movie-title">{movie && movie.name}</h2>
						<div className="inform-fields">
							{movie && movie.rating != null && (
								<div>
									<span>Рейтинг</span> {movie && movie.rating}/5
								</div>
							)}
							{movie && movie.tagline && (
								<div>
									<span>Слоган</span> <i>{movie && movie.tagline}</i>
								</div>
							)}
							{movie && movie.director && (
								<div>
									<span>Режисер</span> {movie && movie.director}
								</div>
							)}
							{movie && movie.producer && (
								<div>
									<span>Продюссер</span> {movie && movie.producer}
								</div>
							)}
							{movie && movie.composer && (
								<div>
									<span>Композитор</span> {movie && movie.composer}
								</div>
							)}
							{movie && movie.screenwriter && (
								<div>
									<span>Сценарий</span> {movie && movie.screenwriter}
								</div>
							)}
							{movie && movie.montage && (
								<div>
									<span>Монтаж</span> {movie && movie.montage}
								</div>
							)}
							{movie && movie.videographer && (
								<div>
									<span>Оператор</span> {movie && movie.videographer}
								</div>
							)}

							{movie && movie.budget && (
								<div>
									<span>Бюджет:</span> {movie && movie.budget / 1000000}$ млн.
								</div>
							)}

							{movie && movie.collected && (
								<div>
									<span>Сборы:</span>{" "}
									{movie && Math.floor(movie.collected / 1000000)}$ млн.
								</div>
							)}
							{movie && movie.age && (
								<div>
									<span>Возврастной рейтниг:</span> {movie && movie.age}+
								</div>
							)}
							{movie && movie.premier && (
								<div>
									<span>Премьера:</span>{" "}
									{movie &&
										movie.premier &&
										movie.premier.split("-").reverse().join(".")}
								</div>
							)}
							{movie && movie.genres && (
								<div>
									<span>Жанры</span>{" "}
									{movie &&
										movie.genres.map((item) => {
											return item.name + " ";
										})}
								</div>
							)}
							{movie && movie.year && (
								<div>
									<span>Год</span> {movie && movie.year}
								</div>
							)}
						</div>
						<div className="movie-descriptions">
							{movie && movie.description}
						</div>
					</div>
				</div>
				{user.isAuthenticated && (
					<div className="player-block">
						<h1>Смотреть фильм онлайн</h1>
						{movie && movie.url && <iframe src={movie.url} />}
					</div>
				)}
				<div className="reviews-block">
					{user.isAuthenticated && <div className="review-writing"></div>}
					{renderReviews()}
					{renderPages()}
				</div>
			</div>
		</div>
	);
}
