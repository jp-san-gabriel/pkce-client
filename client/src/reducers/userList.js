const userListReducer = (state=[], action) => {
    switch(action.type) {
        case 'GET_USERS':
            return action.payload;
    }
    return state;
}

export default userListReducer;