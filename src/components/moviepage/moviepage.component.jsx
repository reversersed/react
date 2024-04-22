import React, { useEffect, useState } from 'react'
import './moviepage.style.css'
import { Link, Navigate } from 'react-router-dom';

export default function MoviePage() {
    const [movies, setMovies] = useState([]);

    const movieItem = (props) => {
        return (
            <>
                <Link to={"/" + props.id} className='movie-item-wrapper' >
                    <div className='movie-item'>
                        <div className='image'>
                            <img src={props.cover ? props.cover : "https://i.imgur.com/es3dNrt.jpg"}></img>
                        </div>
                        <div className='movie-title'>{props.name}</div>
                    </div>
                </Link>
            </>);
    }

    useEffect(() => {
        const getData = async (e) => {
            const requestOptions = {
                method: "GET",
            };

            return await fetch("api/Movies")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setMovies(data);
                });
        }
        getData();
    }, [setMovies]);

    return (
        <div className="moviepage">
            <div className='movies-list'>
                {movies.map((item) => movieItem(item))}
            </div>
        </div>
    );
}


