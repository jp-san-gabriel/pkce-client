import Axios from "axios";
import axios from 'axios';

const get_users = () => async dispatch => {
    try {
        const res = await axios.get('http://localhost:3000/api/users', {withCredentials: true});
        // console.log(res.data);
        const {results} = res.data;
        dispatch({
            type: 'GET_USERS',
            payload: results
        });
    } catch(error) {
        dispatch({type: 'GET_USERS'});
    }
}

export default get_users;