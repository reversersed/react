import { React, useEffect, useState } from "react";
import {
	Form,
	Button,
	Input,
	Space,
	Select,
	Modal,
	DatePicker,
	Collapse,
	InputNumber,
} from "antd";
import { PlusCircleOutlined, DollarOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

export default function AdminSection(props) {
	const [genres, setGenres] = useState([]);
	const [modalGenre, setModalGenre] = useState(false);
	const [newGenreName, setNewGenreName] = useState("");
	const [success, setSuccess] = useState(false);
	const [form] = Form.useForm();

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
	}, [setGenres]);
	const options = [];
	genres.forEach((element) => {
		options.push({
			label: element.name,
			value: element.id,
		});
	});
	const newGenre = () => {
		setNewGenreName("");
		setModalGenre(true);
	};
	const addGenre = async () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(newGenreName),
		};
		if (newGenreName.length < 5) return;
		await fetch("/api/movies/genre", requestOptions)
			.then((response) => {
				if (response.status != 200) return null;
				return response.json();
			})
			.then((data) => {
				if (data != null) setGenres([...genres, data]);
				setModalGenre(false);
			});
	};
	const addMovie = (e) => {
		let movie = {
			name: e.name,
			description: e.description,
			rating: 0.0,
			year: e.year && e.year.year(),
			cover: e.cover,
			url: e.url,
			tagline: e.tagline,
			director: e.director,
			screenwriter: e.screenwriter,
			producer: e.producer,
			videographer: e.videographer,
			composer: e.composer,
			drawer: e.drawer,
			montage: e.montage,
			budget: e.budget,
			collected: e.collected,
			premier: e.premier && e.premier.format("YYYY-MM-DD"),
			age: e.age,
			genres: [],
		};
		e.genres.map((item) => {
			movie.genres.push({ id: item, name: "" });
		});
		const add = async (item) => {
			const requestOptions = {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(item),
			};
			await fetch("/api/movies", requestOptions).then((response) => {
				if (response.status == 201) {
					setSuccess(true);
					form.resetFields();
				}
			});
		};
		add(movie);
	};

	const item = [
		{
			key: "1",
			label: "Необязательные параметры",
			children: (
				<>
					{" "}
					<Form.Item name="year">
						<DatePicker
							style={{ width: "100%" }}
							picker="year"
							placeholder="Год производства"
						/>
					</Form.Item>
					<Form.Item name="premier">
						<DatePicker
							style={{ width: "100%" }}
							picker="date"
							placeholder="Дата премьеры"
						/>
					</Form.Item>
					<Form.Item name="tagline">
						<Input placeholder="Слоган" />
					</Form.Item>
					<Form.Item name="director">
						<Input placeholder="Режиссер" />
					</Form.Item>
					<Form.Item name="screenwriter">
						<Input placeholder="Сценаристы" />
					</Form.Item>
					<Form.Item name="producer">
						<Input placeholder="Продюсеры" />
					</Form.Item>
					<Form.Item name="videographer">
						<Input placeholder="Операторы" />
					</Form.Item>
					<Form.Item name="composer">
						<Input placeholder="Композиторы" />
					</Form.Item>
					<Form.Item name="drawer">
						<Input placeholder="Художники" />
					</Form.Item>
					<Form.Item name="montage">
						<Input placeholder="Ответственные за монтаж" />
					</Form.Item>
					<Form.Item name="budget" label="Бюджет">
						<InputNumber
							min={1}
							style={{ width: "100%" }}
							formatter={(value) =>
								`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							}
							parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
						/>
					</Form.Item>
					<Form.Item name="collected" label="Сборы">
						<InputNumber
							formatter={(value) =>
								`$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
							}
							parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
							style={{ width: "100%" }}
							min={1}
						/>
					</Form.Item>
					<Form.Item name="age" label="Возрастной рейтинг">
						<InputNumber
							min={0}
							max={21}
							style={{ width: "100%" }}
							formatter={(value) => `${value}+`}
							parser={(value) => value?.replace("+", "")}
						/>
					</Form.Item>
				</>
			),
		},
	];
	return (
		<>
			<div className="main-admin-block">
				<h1>Панель администратора</h1>
				<Form onFinish={addMovie} style={{ width: "350px" }} form={form}>
					<h3>Обязательные параметры</h3>
					<Form.Item
						name="name"
						rules={[{ required: true, message: "Введите название фильма" }]}
					>
						<Input placeholder="Название" autoComplete="false" />
					</Form.Item>
					<Form.Item
						name="description"
						rules={[{ required: true, message: "Укажите описание к фильму" }]}
					>
						<TextArea placeholder="Описание фильма" />
					</Form.Item>
					<Form.Item>
						<Form.Item
							noStyle
							name="genres"
							rules={[{ required: true, message: "Выберите хотя бы 1 жанр" }]}
							style={{ width: "318px" }}
						>
							<Select
								style={{ width: "318px" }}
								mode="multiple"
								allowClear
								showSearch={false}
								placeholder="Выберите жанры"
								options={options}
							/>
						</Form.Item>
						<Button onClick={newGenre} icon={<PlusCircleOutlined />} />
					</Form.Item>
					<Form.Item
						name="cover"
						rules={[
							{ required: true, message: "Укажите ссылку на обложку" },
							{ type: "url", message: "Ссылка должна быть валидной" },
						]}
					>
						<Input placeholder="Ссылка на обложку" />
					</Form.Item>
					<Form.Item
						name="url"
						rules={[
							{ required: true, message: "Укажите ссылку на видеофайл" },
							{ type: "url", message: "Ссылка должна быть валидной" },
						]}
					>
						<Input placeholder="Ссылка на видеофайл/плеер" />
					</Form.Item>
					<Collapse accordion style={{ margin: "0 0 20px 0" }} items={item} />
					<Button type="primary" htmlType="submit">
						Добавить
					</Button>
					{success && <h4>Фильм успешно добавлен</h4>}
				</Form>
			</div>
			<Modal
				title="Добавление жанра"
				open={modalGenre}
				onCancel={() => setModalGenre(false)}
				cancelText="Отмена"
				okText="Добавить"
				onOk={addGenre}
			>
				<Input
					required
					placeholder="Название жанра"
					value={newGenreName}
					onChange={(e) => {
						e.preventDefault();
						setNewGenreName(e.target.value);
					}}
				/>
			</Modal>
		</>
	);
}
