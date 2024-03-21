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
        <h2>Список фильмов:</h2>
        <ol className="Movie">
        {movie.map(({id, name, description, genres}) =>{
            let genreline = "Жанры: "
            genres.map(({id, name}) => genreline = genreline+name+", ")
            genreline = genreline.slice(0,-2)
            return (<li key={id} id={id}>
                <h3>{name}</h3>
                <span>{genreline}</span><br/>
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

    return (<>
        <div className="Insertion">

        </div>
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
