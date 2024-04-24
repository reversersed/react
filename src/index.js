import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FilmLayout from "./components/layout/layout.component";
import MoviePage from "./components/moviepage/moviepage.component";
import Login from "./components/login/login.component";
import Registration from "./components/registration/registration.component";
import NotFound from "./components/notfound/notfound.component";
import MovieComponent from "./components/movie/movie.component";
import AdminSection from "./components/admin/admin.component";

function App() {
	const [user, setUser] = useState({
		isAuthenticated: false,
		username: "",
		userRole: "",
	});
	useEffect(() => {
		const getUser = async () => {
			const requestOptions = {
				method: "POST",
			};
			return await fetch(`/api/user/isauth`, requestOptions)
				.then((response) => {
					response.status === 401 &&
						setUser({
							isAuthenticated: false,
							userName: "",
							userRole: "guest",
						});
					return response.json();
				})
				.then((data) => {
					if (
						typeof data !== "undefined" &&
						typeof data.username !== "undefined"
					) {
						setUser({
							isAuthenticated: true,
							username: data.username,
							userRole: data.userRole,
						});
					}
				});
		};
		getUser();
	}, [setUser]);
	if (user.userRole === "") return;

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<FilmLayout user={user} setUser={setUser} />}
					>
						<Route index element={<MoviePage />} />
						<Route
							path="/movie/:movieId"
							element={<MovieComponent user={user} />}
						/>
						{user.userRole === "admin" && (
							<Route path="/admin" element={<AdminSection />} />
						)}
						{!user.isAuthenticated && (
							<>
								<Route path="/login" element={<Login setUser={setUser} />} />
								<Route
									path="/signup"
									element={<Registration setUser={setUser} />}
								/>
							</>
						)}
					</Route>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<App />
	// </React.StrictMode>
);
