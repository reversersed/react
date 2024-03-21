import React from 'react'

import './navbar.style.css'

export default function Navbar(args){
    return (
		    <div className="navigation">
				<ul>
					<li><a href="/"><span className="icon"><i className="fa-solid fa-house"></i></span><span className="text">Главная</span></a></li>
					<li><a href="/lab"><span className="icon"><i className="fa-solid fa-question"></i></span><span className="text">Лабораторная</span></a></li>
					<li><a href="/" onClick={() => args.removeSession()}><span className="icon"><i className="fa-solid fa-right-from-bracket"></i></span><span className="text">Выйти</span></a></li>
				</ul>
				<div className="indicator"></div>
			</div>
    );
}