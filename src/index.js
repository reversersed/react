import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import FilmLayout from "./components/layout/layout.component";
import MoviePage from "./components/moviepage/moviepage.component";
import Login from "./components/login/login.component";
import Registration from "./components/registration/registration.component";
import NotFound from "./components/notfound/notfound.component";
import Lab from "./components/lab/lab.component";
import Logout from "./components/logout/logout.component";
import MovieComponent from "./components/movie/movie.component";

function App() {
	const [user, setUser] = useState({
		isAuthenticated: false,
		username: "",
		userRole: "guest",
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

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={<FilmLayout user={user} setUser={setUser} />}
					>
						<Route index element={<MoviePage />} />
						<Route path="/:movieId" element={<MovieComponent/>}/>
						<Route path="/lab" element={<Lab user={user} />} />
						<Route path="/lab/:id" element={<Lab user={user} />} />
						{!user.isAuthenticated && (
							<>
								<Route path="/login" element={<Login setUser={setUser} />} />
								<Route
									path="/signup"
									element={<Registration setUser={setUser} />}
								/>
							</>
						)}
						{user.isAuthenticated && (
							<Route path="/logout" element={<Logout setUser={setUser} />} />
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
