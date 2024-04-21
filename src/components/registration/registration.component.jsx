import { React, useState } from "react";
import { Button, Input, Form } from "antd";
import "./registration.style.css";

export default function Registration(args) {
	const [error, setError] = useState();
	const setUser = args.setUser;

	const attempregistration = async (e) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: e.login,
				password: e.password,
				repeatpassword: e.repeat_pass,
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
				console.log(data.errors);
				console.log(data.error);
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
		<div
			style={{
				display: "block flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				height: "70vh",
			}}
		>
			<h3>Регистрация</h3>
			<Form
				onFinish={attempregistration}
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 800 }}
				initialValues={{ remember: true }}
				onFinishFailed={renderErrors}
				autoComplete="off"
			>
				<Form.Item
					label="Логин"
					name="login"
					rules={[{ required: true, message: "Пожалуйста, введите логин" }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					label="Пароль"
					name="password"
					rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
				>
					<Input.Password />
				</Form.Item>
				<Form.Item
					label="Повторите"
					name="repeat_pass"
					rules={[{ required: true, message: "Пожалуйста, введите пароль" }]}
				>
					<Input.Password />
				</Form.Item>

				{renderErrors()}
				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Войти
					</Button>
					<br />
				</Form.Item>
			</Form>
		</div>
	);
}
