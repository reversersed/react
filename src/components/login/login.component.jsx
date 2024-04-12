import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.style.css";

export default function Login(args) {
	const [login, setLogin] = useState();
	const [password, setPassword] = useState();
	const [remember, setRemember] = useState(false);
	const [error, setError] = useState();
	const setUser = args.setUser;

	const attempLogin = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: login,
				password: password,
				rememberme: remember,
			}),
		};
		return await fetch("api/user/login", requestOptions)
			.then((response) => {
				response.status === 200 &&
					setUser({ isAuthenticated: true, username: "" });
				return response.json();
			})
			.then(
				(data) => {
					if (
						typeof data !== "undefined" &&
						typeof data.username !== "undefined"
					) {
						setUser({ isAuthenticated: true, userName: data.username });
						window.location.replace("/");
					}
					typeof data !== "undefined" &&
						typeof data.error !== "undefined" &&
						setError(data.message);
				},
				(error) => {
					console.log(error);
				}
			);
	};

	return (
		<>
			<div className="login">
				<form onSubmit={attempLogin}>
					<div className="inputBx">
						<input
							type="text"
							autoComplete="new-login"
							required="required"
							onChange={(e) => setLogin(e.target.value)}
						/>
						<span>Логин</span>
					</div>
					<div className="inputBx">
						<input
							type="password"
							autoComplete="new-password"
							required="required"
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span>Пароль</span>
					</div>
					{error && (
						<div className="errorMessage">
							<span className="message">{error}</span>
						</div>
					)}
					<div className="inputCheckBx">
						<input
							type="checkbox"
							checked={remember}
							onChange={(e) => setRemember(e.target.checked)}
						/>
						<span>Запомнить меня</span>
					</div>
					<input className="submitButton" type="submit" value="Войти" />
					<div className="signup">
						<span>
							Нет аккаунта? <a href="/signup">Зарегистрироваться</a>
						</span>
					</div>
				</form>
			</div>
		</>
	);
}
