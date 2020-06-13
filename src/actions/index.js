import _ from 'lodash';
import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
    await dispatch(fetchPosts());

    _.chain(getState().posts)
        .map('userId')
        .uniq()
        .forEach(id => dispatch(fetchUser(id)))
        .value()

    // replaced by chain notation above
    // const userIds = _.uniq(_.map(getState().posts, 'userId'));
    // userIds.forEach(id => dispatch(fetchUser(id)));
};

export const fetchPosts = () => async dispatch => {
    const response = await jsonPlaceholder.get('/posts');

    dispatch({type: 'FETCH_POSTS', payload: response.data});
};

export const fetchUser = id => async dispatch => {
    const response = await jsonPlaceholder.get(`/users/${id}`);

    dispatch({type: 'FETCH_USER', payload: response.data});
};

// lodash memoization automatically caches response to prevent
//  unnecessary API calls
// note: this will only allow you to retrieve the user only once
// export const fetchUser = id => dispatch => _fetchUser(id, dispatch);
// const _fetchUser = _.memoize(async (id, dispatch) => {
//     const response = await jsonPlaceholder.get(`/users/${id}`);
//
//     dispatch({type: 'FETCH_USER', payload: response.data});
// });

// syntax cleaned up above
// export const fetchUser = id => dispatch => {
//    _fetchUser(id, dispatch);
// };

// refactored to thunk style arrow syntax simplified
// export const fetchPosts =  () => {
//     return async function(dispatch, getState) {
//         const response = await jsonPlaceholder.get('/posts');
//
//         dispatch({ type: 'FETCH_POSTS', payload: response});
//     };
// };