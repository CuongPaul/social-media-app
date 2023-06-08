export const initialPostState = {
    posts: [],
    postComments: [],
    postSelected: null,
};

export const PostReducer = (state, action) => {
    switch (action.type) {
        case "ADD_POSTS":
            return { ...state, posts: [...state.posts, ...action.payload] };

        case "SET_POSTS":
            return { ...state, posts: action.payload };

        case "UPDATE_POST":
            const postsAfterUpdate = [...state.posts];

            const postUpdatedIndex = postsAfterUpdate.findIndex(
                (post) => post._id === action.payload._id
            );
            postsAfterUpdate[postUpdatedIndex] = action.payload;

            return { ...state, posts: postsAfterUpdate };

        case "CREATE_POST":
            const postsAfterCreate = [...state.posts];
            postsAfterCreate.unshift(action.payload);

            return { ...state, posts: postsAfterCreate };

        case "DELETE_POST":
            const postsAfterDelete = state.posts.filter((post) => post._id !== action.payload);

            return { ...state, posts: postsAfterDelete };

        case "SET_CURRENT_POST":
            return { ...state, postSelected: action.payload };

        case "REMOVE_CURRENT_POST":
            return {
                ...state,
                postComments: [],
            };

        case "COMMENT_PAGINATION":
            return {
                ...state,
                postComments: action.payload,
            };

        case "REACT_POST":
            return { ...state, posts: action.payload };

        case "ADD_POST_COMMENT":
            return {
                ...state,
                postSelected: {
                    ...state.postSelected,
                    comments: [action.payload, ...state.comments],
                },
            };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
