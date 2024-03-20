import { React, useState } from 'react'
import './login.style.css'

export default function Login(args){
    const setToken = args.setToken
    const [login, setLogin] = useState()
    const [password, setPassword] = useState()
    const [remember, setRemember] = useState(false)

    const attempLogin = e => {
        e.preventDefault()
        //get token from api
        setToken("123", remember);
    }

    return (<>
        <div className="login">
            <form onSubmit={attempLogin}>
                <div className="inputBx">
                    <input type="text" autoComplete="new-login" required="required" onChange={e => setLogin(e.target.value)}/>
                    <span>Логин</span>
                </div>
                <div className="inputBx">
                    <input type="password" autoComplete="new-password" required="required" onChange={e => setPassword(e.target.value)}/>
                    <span>Пароль</span>
                </div>
                <div className="inputCheckBx">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}/>
                    <span>Запомнить меня</span>
                </div>
                <input className="submitButton" type="submit" value="Войти"/>
                <div className="signup">
                    <span>Нет аккаунта? <a href="/signup">Зарегистрироваться</a></span>
                </div>
            </form>
		</div>
        </>);
}