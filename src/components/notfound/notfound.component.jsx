import React from 'react'

import './notfound.style.css'

export default function NotFound(){
    return (<>
        <div className="notfound">
            <h1>I want to break free...</h1>
            <span>Кажется, такой страницы не существует</span>
            <a href="/">Вернуться на главную</a>
        </div>
    </>);
}
