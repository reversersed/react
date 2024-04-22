import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { LogoutOutlined, LoginOutlined, HomeOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

import "./layout.style.css";

export default function FilmLayout(args) {
	const user = args.user;
	const userAgent = navigator.userAgent;

	const [collapsed, setCollapsed] = useState(true);
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	let path = window.location.href.split("/")[3];

	let items = [
		{
			label: <Link to="/">Главная</Link>,
			icon: <HomeOutlined />,
			key: "/",
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
				label: <Link to="/logout">Выход</Link>,
				icon: <LogoutOutlined />,
				key: "/logout",
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
					theme="dark"
					defaultSelectedKeys={["/" + path]}
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
