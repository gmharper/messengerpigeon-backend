// A file for making queries to test the database
import axios from "axios"

function axiosGet() {
    return axios
    .get('https://nc-news-seedingproject.onrender.com/api/users', { params: { sort: "name", order: "DESC" }})
    .then((response) => {
        console.log(response.data)
    })
}

axiosGet()



