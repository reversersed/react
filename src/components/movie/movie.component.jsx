import react, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Input, Modal, Rate } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import "./movie.style.css";

export default function MovieComponent(props) {
	const user = props.user;
	let { movieId } = useParams();
	const [movie, setMovie] = useState();
	const pageOffset = 15;
	const [page, setPage] = useState(1);
	const [reviewWriteOpen, setReviewWriteOpen] = useState(false);
	const [rating, setRating] = useState(3);
	const [subscribed, setSubscribed] = useState(false);
	const [reviewText, setReviewText] = useState("");
	const [userReview, setUserReview] = useState(undefined);

	useEffect(() => {
		const getData = async (e) => {
			const requestOptions = {
				method: "GET",
			};
			return await fetch("/api/Movies/" + movieId)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					setSubscribed(data.subscribed);
					const review = data.movie.reviews.find(
						(i) => i.username === user.username
					);
					let movie = data.movie;
					if (review)
						movie.reviews = movie.reviews.filter((i) => i.id != review.id);
					setUserReview(review);
					setMovie(movie);
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
							<span className="rating">
								<Rate value={item.rating} disabled allowHalf />
							</span>
						</div>
						<span className="review-text">{item.text}</span>
					</div>
				))
		);
	};
	const renderPages = () => {
		if (movie.reviews.length <= pageOffset) return <></>;
		let pagecount = Math.ceil(movie.reviews.length / pageOffset);
		return (
			<div className="review-page-block">
				<div
					className="prev-page"
					style={{ visibility: page > 1 ? "visible" : "hidden" }}
				>
					<Button
						shape="circle"
						icon={<DoubleLeftOutlined />}
						onClick={() => {
							if (page > 1) setPage(page - 1);
						}}
					/>
				</div>
				<div className="current-page">
					{page}/{pagecount}
				</div>
				<div
					className="next-page"
					style={{ visibility: page < pagecount ? "visible" : "hidden" }}
				>
					<Button
						shape="circle"
						icon={<DoubleRightOutlined />}
						onClick={() => {
							if (page < pagecount) setPage(page + 1);
						}}
					/>
				</div>
			</div>
		);
	};
	const handleDeleteClick = () => {
		const { confirm } = Modal;
		confirm({
			title: "Подтвердите удаление",
			content: "Вы точно хотите удалить данный фильм?",
			okText: "Да",
			okType: "danger",
			cancelText: "Нет",
			onOk: deleteMovie,
		});
	};
	const deleteMovie = () => {
		const del = async () => {
			const requestOptions = {
				method: "DELETE",
			};
			await fetch("/api/movies/" + movieId, requestOptions).then((response) => {
				response.status === 200 && window.location.replace("/");
			});
		};
		del();
	};
	const sendReview = async (e) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				Text: reviewText,
				Rating: rating,
			}),
		};
		return fetch(`/api/Movies/${movie.id}/review`, requestOptions).then(
			(response) => {
				response.status === 200 && window.location.reload();
			}
		);
	};
	const renderGenres = () => {
		let capitalized = false;
		let genreRendered = 0;
		return movie.genres.map((item) => {
			const this_capitalized = !capitalized;
			if (!capitalized) capitalized = true;
			genreRendered++;
			return (
				<>
					<a href={"/genre/" + item.id} key={"genre" + item.id}>
						{!this_capitalized
							? item.name.toLowerCase()
							: item.name.slice(0, 1).toUpperCase() +
							  item.name.slice(1, item.name.length)}
					</a>
					{genreRendered < movie.genres.length ? ", " : ""}
				</>
			);
		});
	};
	const removeUserReview = async () => {
		Modal.confirm({
			title: "Подвердите удаление",
			content:
				"Вы уверены, что хотите удалить отзыв к фильму? Отменить данное действие будет нельзя",
			okText: "Да",
			okType: "danger",
			cancelText: "Нет",
			onOk: async () => {
				const requestOptions = {
					method: "DELETE",
				};
				await fetch(`/api/movies/review/${userReview.id}`, requestOptions)
					.then((response) => response.json())
					.then((data) => {
						let updatedMovie = movie;
						updatedMovie.rating = data;
						setMovie(updatedMovie);
						setUserReview(undefined);
					});
			},
		});
	};
	if (!movie) return <></>;
	return (
		<div className="movie-page">
			<div className="movie-page-wrapper">
				<div className="about-block">
					<div className="movie-cover">
						<img src={movie && movie.cover ? movie.cover : ""} />
					</div>
					<div className="movie-about-info">
						<div className="movie-title-wrapper">
							<h2 className="movie-title">{movie && movie.name}</h2>
							{user.userRole === "admin" && (
								<Button
									onClick={handleDeleteClick}
									style={{ margin: "0 0 0 15px" }}
									danger
								>
									Удалить
								</Button>
							)}
						</div>
						<div className="inform-fields">
							{movie && movie.rating != null && (
								<div>
									<span>Рейтинг</span> {movie && movie.rating}/5
								</div>
							)}
							{movie && movie.tagline && (
								<div>
									<span>Слоган</span>{" "}
									<i color="gray">«{movie && movie.tagline}»</i>
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
									<span>Бюджет:</span>{" "}
									{movie.budget
										.toFixed(0)
										.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "$"}
								</div>
							)}

							{movie && movie.collected && (
								<div>
									<span>Сборы:</span>{" "}
									{movie.collected
										.toFixed(0)
										.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + "$"}
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
								<div className="genre-block">
									<span>Жанры</span> {movie && renderGenres()}
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
				{user.isAuthenticated && movie && movie.url && subscribed && (
					<div className="player-block">
						<h1>Смотреть фильм онлайн</h1>
						{movie && movie.url && (
							<iframe src={movie.url} allowFullScreen="1" />
						)}
					</div>
				)}
				{user.isAuthenticated && !subscribed && (
					<div className="warning">
						<span>
							У Вас нет подписки, которая позволяля бы просматривать данный
							фильм. Для оформления подписки перейдите в{" "}
							<a href="/lk">личный кабинет</a>
						</span>
					</div>
				)}
				{!user.isAuthenticated && (
					<div className="warning">
						<span>
							Для просмотра фильмов и написания отзывов к ним, пожалуйста,{" "}
							<a href="/login">авторизуйтесь</a>
						</span>
					</div>
				)}
				<div className="reviews-block">
					<div className="review-writing">
						<h1>Отзывы</h1>
						{user.isAuthenticated && subscribed && userReview == undefined && (
							<Button onClick={() => setReviewWriteOpen(true)}>Написать</Button>
						)}
					</div>
					{userReview != undefined && page == 1 && (
						<div className="user-review-block">
							<div className="user-review-header">
								<h2>Ваш отзыв</h2>
								<Button danger onClick={removeUserReview}>
									Удалить
								</Button>
							</div>
							<div className="review" key={userReview.id}>
								<div className="review-header">
									<span className="user">{userReview.username}</span>
									<span className="rating">
										<Rate value={userReview.rating} disabled allowHalf />
									</span>
								</div>
								<span className="review-text">{userReview.text}</span>
							</div>
						</div>
					)}
					{(!movie || !movie.reviews || movie.reviews.length <= 0) &&
						userReview == undefined && (
							<h4 style={{ margin: 20 }}>Отзывов пока нет...</h4>
						)}
					{movie && movie.reviews && renderReviews()}
					{movie && movie.reviews && renderPages()}
				</div>
			</div>
			<Modal
				open={reviewWriteOpen}
				onCancel={() => setReviewWriteOpen(false)}
				cancelText="Отменить"
				okText="Отправить"
				title="Написать отзыв"
				onOk={sendReview}
				okButtonProps={{ disabled: reviewText.length < 6 }}
			>
				<Input.TextArea
					required
					allowClear
					placeholder="Напишите Ваши мысли о фильме"
					text={reviewText}
					onChange={(e) => setReviewText(e.target.value)}
				/>
				<div className="rate-wrapper">
					<span className="desc">Поставьте оценку:</span>
					<Rate
						allowHalf
						value={rating}
						onChange={setRating}
						tooltips={["Ужасно", "Плохо", "Нормально", "Хорошо", "Великолепно"]}
					/>
				</div>
			</Modal>
		</div>
	);
}
