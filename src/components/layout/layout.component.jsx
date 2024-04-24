import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
	LogoutOutlined,
	LoginOutlined,
	HomeOutlined,
	EditOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Modal } from "antd";
const { Header, Content, Footer, Sider } = Layout;
const confirm = Modal.confirm;

import "./layout.style.css";

export default function FilmLayout(args) {
	const user = args.user;
	const setUser = args.setUser;
	const userAgent = navigator.userAgent;
	const [currentKey, setCurrentKey] = useState("/");
	const [collapsed, setCollapsed] = useState(true);

	let path = window.location.href.split("/")[3];
	useEffect(() => {
		setCurrentKey("/" + path);
	}, [setCurrentKey]);
	const handleClick = (e) =>
		setCurrentKey(e.key == "disabled" ? "/" + path : e.key);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	const confirmLogout = () => {
		confirm({
			title: "Выход из аккаунта",
			content: "Вы точно хотите выйти из аккаунта?",
			okText: "Да",
			cancelText: "Нет",
			async onOk() {
				const requestOptions = {
					method: "POST",
				};
				await fetch("/api/user/logout", requestOptions).then((response) => {
					response.status === 200 &&
						setUser({
							isAuthenticated: false,
							userName: "",
							userRole: "guest",
						});
					window.location.reload();
					return response.json();
				});
			},
		});
	};
	let items = [
		{
			label: <Link to="/">Главная</Link>,
			icon: <HomeOutlined />,
			key: "/",
		},
	];
	if (user.userRole == "admin")
		items = [
			...items,
			{
				label: <Link to="/admin">Админ-панель</Link>,
				icon: <EditOutlined />,
				key: "/admin",
			},
		];

	if (!user.isAuthenticated)
		items = [
			...items,
			{
				label: <Link to="/login">Войти</Link>,
				icon: <LoginOutlined />,
				key: "/login",
			},
		];
	else
		items = [
			...items,
			{
				label: <a onClick={confirmLogout}>Выход</a>,
				icon: <LogoutOutlined />,
				key: "disabled",
			},
		];
	return (
		<Layout
			style={{
				minHeight: "100vh",
			}}
		>
			<Sider
				collapsible={userAgent.includes("Mobile") ? false : true}
				collapsed={collapsed}
				onCollapse={(value) => setCollapsed(value)}
			>
				<div className="demo-logo-vertical" />
				<Menu
					onClick={handleClick}
					theme="dark"
					selectedKeys={[currentKey]}
					items={items}
					mode="inline"
				/>
			</Sider>
			<Layout>
				<Content
					style={{
						margin: "16px 16px",
					}}
				>
					<Outlet />
				</Content>
				<Footer
					style={{
						textAlign: "center",
					}}
				>
					FilmFlow ©{new Date().getFullYear()}
				</Footer>
			</Layout>
		</Layout>
	);
}
