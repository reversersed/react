import { React, useEffect, useState } from "react";
import { Button, Form, Modal, InputNumber, Select } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

import "./personal.style.css";

export default function Personal() {
	const [user, setUser] = useState();
	const [payModal, setPayModal] = useState(false);
	const [payLoading, setPayLoading] = useState(false);
	const [genres, setGenres] = useState([]);
	const [subGenres, setSubGenres] = useState([]);
	const [currentCost, setCurrentCost] = useState(0);
	const [subscriptions, setSubscriptions] = useState([]);
	const options = [];

	useEffect(() => {
		const getGenres = async () => {
			const requestOptions = {
				method: "GET",
			};
			await fetch("/api/movies/genre", requestOptions)
				.then((response) => {
					return response.json();
				})
				.then((data) => setGenres(data));
		};
		getGenres();
	}, []);
	useEffect(() => {
		setCurrentCost(subGenres.length * 150);
	}, [subGenres]);
	genres.forEach((element) => {
		options.push({
			label: element.name,
			value: element.id,
		});
	});
	useEffect(() => {
		const getUser = async () => {
			return await fetch("/api/user")
				.then((response) => response.json())
				.then((data) => {
					setUser(data);
					setSubscriptions(data.subscriptions);
				});
		};
		getUser();
	}, [user]);
	const replenish = (e) => {
		setPayLoading(true);
		const pay = async () => {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(e.value),
			};
			return await fetch("/api/user/replenish", requestOptions).then(
				(response) => {
					setPayLoading(false);
					setPayModal(false);
				}
			);
		};
		setTimeout(pay, 2000);
	};
	const renderSubscriptions = () =>
		subscriptions
			.reverse()
			.map((item) => <div key={item.id} className="subscription-item"></div>);

	const createSub = async (e) => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(currentCost + "|" + subGenres),
		};
		return await fetch("/api/user/subscribe", requestOptions)
			.then((response) => response.json())
			.then((data) => {
				setSubscriptions([...subscriptions, data]);
				setSubGenres([]);
			});
	};
	if (user == null) return <></>;
	return (
		<>
			<div className="personal-block">
				<div className="personal-header">
					<span className="header">
						Личный кабинет {user.userName}. Текущий баланс: {user.balance} ₽
					</span>
					<Button
						type="default"
						icon={<PlusCircleOutlined />}
						onClick={() => setPayModal(true)}
					>
						Пополнить
					</Button>
				</div>
				<div className="personal-subscription-constructor">
					<h2>Конструктор подписок</h2>

					{subGenres.length > 0 && (
						<p>
							Текущая стоимость подписки: <b>{currentCost} ₽</b>
						</p>
					)}
					<Select
						style={{ width: "30%" }}
						mode="multiple"
						allowClear
						showSearch={false}
						onChange={(e) => setSubGenres(e)}
						value={subGenres}
						placeholder="Выберите жанры"
						options={options}
					/>
					<Button
						style={{ width: "30%", marginTop: "25px" }}
						type="primary"
						disabled={user.balance < currentCost || currentCost <= 0}
						onClick={createSub}
					>
						Оформить подписку
					</Button>
				</div>
				{subscriptions.length > 0 && (
					<div className="subscription-block">
						<h2>Ваши активные подписки</h2>
						<div className="subscription-list">{renderSubscriptions()}</div>
					</div>
				)}
			</div>
			<Modal
				open={payModal}
				title="Пополнение баланса"
				footer={
					<Form.Item>
						<Button
							form="replenish-form"
							htmlType="submit"
							type="primary"
							loading={payLoading}
						>
							Пополнить
						</Button>
					</Form.Item>
				}
				onCancel={() => setPayModal(false)}
			>
				<Form onFinish={replenish} id="replenish-form">
					<Form.Item
						name="value"
						label="Сумма пополнения"
						rules={[{ required: true, message: "Введите сумму" }]}
					>
						<InputNumber
							min={100}
							style={{ width: "100%" }}
							formatter={(value) =>
								`${value} ₽`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							}
							parser={(value) => value?.replace(/\₽\s?|(,*)/g, "")}
						/>
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
}
