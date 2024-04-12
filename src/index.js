import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/layout.component";
import MoviePage from "./components/moviepage/moviepage.component";
import Login from "./components/login/login.component";
import Registration from "./components/registration/registration.component";
import NotFound from "./components/notfound/notfound.component";
import Lab from "./components/lab/lab.component";

function App() {
	const [user, setUser] = useState({ isAuthenticated: false, username: "" });

	useEffect(() => {
		const getUser = async () => {
			const requestOptions = {
				method: "POST",
			};
			return await fetch(`/api/user/isauth`, requestOptions)
				.then((response) => {
					response.status === 401 &&
						setUser({ isAuthenticated: false, userName: "" });
					return response.json();
				})
				.then((data) => {
					if (
						typeof data !== "undefined" &&
						typeof data.username !== "undefined"
					) {
						setUser({ isAuthenticated: true, username: data.username });
					}
				});
		};
		getUser();
	}, [setUser]);

	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout user={user} setUser={setUser} />}>
						<Route index element={<MoviePage />} />
						<Route path="/lab" element={<Lab user={user} />} />
						<Route path="/lab/:id" element={<Lab user={user} />} />
						<Route path="/login" element={<Login setUser={setUser} />} />
						<Route
							path="/signup"
							element={<Registration setUser={setUser} />}
						/>
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
