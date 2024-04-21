import { Modal } from "antd";
import { useEffect, useState } from "react";

export default function Logout(args) {
	const setUser = args.setUser;

	const [open, setOpen] = useState(false);
	const showModal = () => {
		setOpen(true);
	};
	useEffect(() => showModal(), []);

	const closeModal = () => {
		setOpen(false);
		window.location.replace("/");
	};
	const logout = async (e) => {
		e.preventDefault();

		const requestOptions = {
			method: "POST",
		};
		await fetch("api/user/logout", requestOptions).then((response) => {
			response.status === 200 &&
				setUser({ isAuthenticated: false, userName: "", userRole: "guest" });
			window.location.replace("/");
			return response.json();
		});
	};
	return (
		<Modal Title="Выход" open={open} onOk={logout} onCancel={closeModal}>
			<p>Вы уверены, что хотите выйти из аккаунта?</p>
		</Modal>
	);
}
