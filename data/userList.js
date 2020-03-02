const fetch = require('node-fetch')

let url = 'https://randomuser.me/api/?results=20'

const peopleList = [];

const people = () => {
    return fetch (url)
    .then(res => res.json())
    .then(({results})=>{ return results.forEach((obj)=> {
        peopleList.push([obj.picture.large, obj.name.first, obj.name.last]);
    })})
    .catch(err => console.log('The user is not found', err))
};
people();

module.exports = peopleList