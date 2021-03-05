import axios from 'axios';
import {setAlert} from './alert';
import {
    GET_POSTS,
    POST_ERROR,
    UPDATE_LIKES,
    DELETE_POST,
    ADD_POST,
    GET_POST
} from './types';

//get posts
export const getPosts = () => async dispatch => {
    try {
        const res = await axios.get('/api/posts');

        dispatch({
            type:GET_POSTS,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg:"post error", status:"error statis"},  
        })
    }
}

//add like
export const addLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/like/${postId}`);
        console.log(res.data)
        dispatch({
            type:UPDATE_LIKES,
            payload:{postId, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg:"post error", status:"error statis"},  
        })
    }
}

//remove like
export const removeLike = postId => async dispatch => {
    try {
        const res = await axios.put(`/api/posts/unlike/${postId}`);

        dispatch({
            type:UPDATE_LIKES,
            payload:{postId, likes:res.data}
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg:"post error", status:"error statis"},  
        })
    }
}

//delete post
export const deletePost = postId => async dispatch => {
    try {
        const res = await axios.delete(`/api/posts/${postId}`);

        dispatch({
            type:DELETE_POST,
            payload:postId
        });

        dispatch(setAlert('Post Remmoved', 'success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg:"post error", status:"error statis"},  
        })
    }
}

//add post
export const addPost = formData => async dispatch => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        const res = await axios.post('/api/posts', formData, config);

        dispatch({
            type:ADD_POST,
            payload:res.data
        });

        dispatch(setAlert('Post Created', 'success'));
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg:"post error", status:"error statis"},  
        })
    }
}

//Get post
//get posts
export const getPost = id => async dispatch => {
    try {
        const res = await axios.get(`/api/posts/${id}`);

        dispatch({
            type:GET_POST,
            payload:res.data
        })
    } catch (err) {
        dispatch({
            type:POST_ERROR,
            payload: {msg:"post error", status:"error statis"},  
        })
    }
}