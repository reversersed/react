import { React, useState, useEffect } from "react";

import './lab.style.css'

const MovieList = ({movie, setMovie, removeMovie}) => {

    useEffect(() => {
        const getMovie = async () =>{
            const requestOptions = {
                method: 'GET'
            }
            return await fetch("api/Movies",requestOptions)
                .then(r => r.json())
                .then((data) => setMovie(data))
        }
        getMovie()
    }, [setMovie])

    const remove = async (id) =>{
        const requestOptions = {
            method: 'DELETE'
        }
        return await fetch(`api/Movies/${id}`,requestOptions)
            .then(response => {
                if(response.ok)
                    removeMovie(id)
            })
    }
    return (<>
        <h2 className="movieList">Список фильмов</h2>
        <ol className="Movie">
        {movie.map(({id, name, description, genres}) =>{
            let genreline = ""
            genres.map(({id, name}) => genreline = genreline+name+", ")
            genreline = genreline.slice(0,-2)
            return (<li key={id} id={id}>
                <h3>{name}</h3>
                {genreline && (<><span>Жанры: {genreline}</span><br/></>)}
                {description && (<><span>{description}</span><br/></>)}
                <button onClick={(e) => {
                    e.preventDefault()
                    remove(id)
                }}>Удалить</button>
            </li>)
        })}
        </ol>
    </>)
}
const MovieInsert = ({addMovie}) => {
    const createMovie = (e) => {
        e.preventDefault()
        const [name, description] = [e.target.elements.name.value, e.target.elements.description.value]
        
        const create = async () => {
            const movie = [name, description]
            const requestOptions = {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name, description})
            }
            return await fetch("api/Movies", requestOptions)
                .then(response => response.json())
                .then(data => addMovie(data))
        }
        create()
    }
    return (<>
        <h2>Создание фильма</h2>
        <form className="Insertion" onSubmit={createMovie}>
            <input type="text" 
                    autoComplete="movieName" 
                    name="name" 
                    placeholder="Название" 
                    required 
                    className="TextInput"/>
            <input type="text" 
                    autoComplete="movieDescription" 
                    name="description" 
                    placeholder="Описание" 
                    required 
                    className="TextInput"/>
            <input type="submit" 
                    value="Создать" 
                    className="sendButton"/>
        </form>
    </>)
}
export default function Lab(){
    const [movies, setMovies] = useState([])
    const removeMovies = (movieid) => setMovies(movies.filter(({id}) => id !== movieid))
    const addMovie = (movie) => setMovies([...movies, movie])

    return (<>
        <div className="MainLab">
            <MovieInsert addMovie={addMovie}/>
            <MovieList movie={movies} setMovie={setMovies} removeMovie={removeMovies}/>
        </div>
    </>)
}
