import { React } from "react";
import { Outlet } from "react-router-dom";

import "./layout.style.css";

export default function Layout(args) {
	const user = args.user;
	const setUser = args.setUser;

	const logout = async () => {
		const requestOptions = {
			method: "POST",
		};
		await fetch("api/user/logout", requestOptions).then((response) => {
			response.status === 200 &&
				setUser({ isAuthenticated: false, username: "" });
			return response.json();
		});
	};
	return (
		<>
			<div className="navigation">
				<ul>
					<li>
						<a href="/">
							<span className="icon">
								<i className="fa-solid fa-house"></i>
							</span>
							<span className="text">Главная</span>
						</a>
					</li>
					<li>
						<a href="/lab">
							<span className="icon">
								<i className="fa-solid fa-question"></i>
							</span>
							<span className="text">Лабораторная</span>
						</a>
					</li>
					<li>
						<a href={!user.isAuthenticated ? "/login" : "/"}>
							<span className="icon">
								<i className="fa-solid fa-user"></i>
							</span>
							<span className="text">
								{!user.isAuthenticated ? "Авторизоваться" : user.username}
							</span>
						</a>
					</li>
					<li>
						<a
							href="/"
							onClick={(e) => {
								e.preventDefault();
								logout();
							}}
						>
							<span className="icon">
								<i className="fa-solid fa-right-from-bracket"></i>
							</span>
							<span className="text">Выйти</span>
						</a>
					</li>
				</ul>
				<div className="indicator"></div>
			</div>
			<Outlet />
		</>
	);
}
