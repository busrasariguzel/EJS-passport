const fetch = require('node-fetch')
const url = 'https://api.themoviedb.org/3/movie/now_playing?api_key=8ddbe6143af6afcff9351038999b3629&language=en-US&page=1'

const displayMovie = [];
const movies = ()=>{
    return fetch(url)
    .then(res=>res.json())
    
    .then(({results})=>{ return results.forEach((obj)=> {
        displayMovie.push([obj.overview, obj.poster_path]);
    }
    
    )}
    )
    
    .catch(err=>console.log('error occurred', err))
}
movies();
console.log(displayMovie)
module.exports = displayMovie;