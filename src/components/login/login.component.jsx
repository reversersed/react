import { React, useState } from "react";
import { Button, Checkbox, Input, Form } from "antd";

export default function Login(args) {
	const [error, setError] = useState();
	const setUser = args.setUser;

	const attempLogin = async (e) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username: e.username,
				password: e.password,
				rememberme: e.remember,
			}),
		};
		return await fetch("api/user/login", requestOptions)
			.then((response) => {
				return response.json();
			})
			.then(
				(data) => {
					if (
						typeof data !== "undefined" &&
						typeof data.username !== "undefined"
					) {
						setUser({
							isAuthenticated: true,
							userName: data.username,
							userRole: data.userRole,
						});
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
	const renderError = () => <div key="1">{error}</div>;
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
			<h3>Авторизация</h3>
			<Form
				onFinish={attempLogin}
				name="basic"
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				style={{ maxWidth: 800 }}
				initialValues={{ remember: true }}
				onFinishFailed={renderError}
				autoComplete="off"
			>
				<Form.Item
					label="Логин"
					name="username"
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
					name="remember"
					valuePropName="checked"
					wrapperCol={{ offset: 8, span: 16 }}
				>
					<Checkbox>Запомнить меня</Checkbox>
					{renderError()}
				</Form.Item>
				<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
					<Button type="primary" htmlType="submit">
						Войти
					</Button>
					<br />
				</Form.Item>
				<span>
					Еще нет аккаунта? <a href="/signup">Зарегистрироваться</a>
				</span>
			</Form>
		</div>
	);
}
