export const initialPostState = {
    posts: [],
    comments: [],
    postSelected: null,
    commentSelected: null,
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

        case "ADD_COMMENT":
            return { ...state, comments: [action.payload, ...state.comments] };

        case "ADD_COMMENTS":
            return { ...state, comments: [...state.comments, ...action.payload] };

        case "SET_COMMENTS":
            return { ...state, comments: action.payload };

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
                comments: [],
            };

        case "COMMENT_PAGINATION":
            return {
                ...state,
                comments: action.payload,
            };

        case "REACT_POST":
            const postsAfterReact = [...state.posts];
            const postSelectedAfterReact = { ...state.postSelected };

            const indexOfPostSelected = postsAfterReact.findIndex(
                (item) => item._id === action.payload.post_id
            );

            if (indexOfPostSelected !== -1) {
                const indexOfReact = postsAfterReact[indexOfPostSelected].react[
                    action.payload.key
                ].findIndex((element) => element._id === action.payload.user._id);

                if (indexOfReact === -1) {
                    postsAfterReact[indexOfPostSelected].react[action.payload.key].push({
                        _id: action.payload.user._id,
                        name: action.payload.user.name,
                        avatar_image: action.payload.user.avatar_image,
                    });
                } else {
                    postsAfterReact[indexOfPostSelected].react[action.payload.key].splice(
                        indexOfReact,
                        1
                    );
                }
            } else {
                const indexOfReact = postSelectedAfterReact.react[action.payload.key].findIndex(
                    (element) => element._id === action.payload.user._id
                );

                if (indexOfReact === -1) {
                    postSelectedAfterReact.react[action.payload.key].push({
                        _id: action.payload.user._id,
                        name: action.payload.user.name,
                        avatar_image: action.payload.user.avatar_image,
                    });
                } else {
                    postSelectedAfterReact.react[action.payload.key].splice(indexOfReact, 1);
                }
            }

            return { ...state, posts: postsAfterReact, postSelected: postSelectedAfterReact };

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
