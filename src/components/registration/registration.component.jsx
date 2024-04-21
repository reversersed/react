import { React, useState } from "react";
import "./registration.style.css";

export default function Registration(args) {
	const [login, setLogin] = useState();
	const [password, setPassword] = useState();
	const [repeat_pass, setRepeatPassword] = useState();
	const [error, setError] = useState();
	const setUser = args.setUser;

	const attempregistration = async (e) => {
		e.preventDefault();
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: login,
				password: password,
				repeatpassword: repeat_pass,
			}),
		};
		return await fetch("api/user/register", requestOptions)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				if (
					typeof data !== "undefined" &&
					typeof data.userName !== "undefined"
				) {
					setUser({
						isAuthenticated: true,
						userName: data.userName,
						userRole: data.userRole,
					});
					window.location.replace("/");
				}
				typeof data !== "undefined" &&
					typeof data.error !== "undefined" &&
					setError(data.error);
				typeof data !== "undefined" &&
					typeof data.errors !== "undefined" &&
					setError(data.errors.RepeatPassword);
			});
	};
	const renderErrors = () => {
		if (typeof error === "undefined") return;
		return error.map((error, idx) => (
			<div key={idx} className="errorMessage">
				<span className="message">{error}</span>
			</div>
		));
	};
	return (
		<>
			<div className="registration">
				<form onSubmit={attempregistration}>
					<div className="inputBx">
						<input
							type="text"
							autoComplete="new-registration"
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
					<div className="inputBx">
						<input
							type="password"
							autoComplete="new-repeat-password"
							required="required"
							onChange={(e) => setRepeatPassword(e.target.value)}
						/>
						<span>Повторите пароль</span>
					</div>
					{renderErrors()}
					<div className="submitButton">
						<input type="submit" value="Зарегистрироваться" />
					</div>
				</form>
			</div>
		</>
	);
}
