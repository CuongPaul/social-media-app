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

        case "REACT_POST":
            const postsAfterReact = [...state.posts];
            const postSelectedAfterReact = state.postSelected ? { ...state.postSelected } : null;

            if (postSelectedAfterReact) {
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
            } else {
                const indexOfPostSelected = postsAfterReact.findIndex(
                    (element) => element._id === action.payload.post_id
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
                }
            }

            return { ...state, posts: postsAfterReact, postSelected: postSelectedAfterReact };

        case "UPDATE_POST":
            const postsAfterUpdate = [...state.posts];

            const postUpdatedIndex = postsAfterUpdate.findIndex(
                (post) => post._id === action.payload._id
            );
            postsAfterUpdate[postUpdatedIndex] = action.payload;

            return { ...state, posts: postsAfterUpdate };

        case "ADD_COMMENT":
            return { ...state, comments: [action.payload, ...state.comments] };

        case "CREATE_POST":
            const postsAfterCreate = [...state.posts];
            postsAfterCreate.unshift(action.payload);

            return { ...state, posts: postsAfterCreate };

        case "DELETE_POST":
            const postsAfterDelete = state.posts.filter((post) => post._id !== action.payload);

            return { ...state, posts: postsAfterDelete };

        case "ADD_COMMENTS":
            return { ...state, comments: [...state.comments, ...action.payload] };

        case "SET_COMMENTS":
            return { ...state, comments: action.payload };

        case "REACT_COMMENT":
            const commentsAfterReact = [...state.comments];
            const indexOfCommentReacted = commentsAfterReact.findIndex(
                (item) => item._id === action.payload.comment_id
            );

            const indexOfUserReact = commentsAfterReact[indexOfCommentReacted].react[
                action.payload.key
            ].findIndex((item) => item._id === action.payload.user._id);

            if (indexOfUserReact === -1) {
                commentsAfterReact[indexOfCommentReacted].react[action.payload.key].push({
                    _id: action.payload.user._id,
                    name: action.payload.user.name,
                    avatar_image: action.payload.user.avatar_image,
                });
            } else {
                commentsAfterReact[indexOfCommentReacted].react[action.payload.key].splice(
                    indexOfUserReact,
                    1
                );
            }

            return { ...state, comments: commentsAfterReact };

        case "DELETE_COMMENT":
            const commentsAfterDelete = [...state.comments].filter(
                (item) => item._id !== action.payload
            );

            return { ...state, comments: commentsAfterDelete };

        case "SET_CURRENT_POST":
            return { ...state, postSelected: action.payload };

        case "SET_COMMENT_SELECTED":
            return { ...state, commentSelected: action.payload };

        case "UPDATE_COMMENT_SELECTED":
            const commentsAfterUpdate = [...state.comments];
            const indexOfCommentUpdated = commentsAfterUpdate.findIndex(
                (item) => item._id === action.payload._id
            );

            commentsAfterUpdate[indexOfCommentUpdated] = action.payload;

            return { ...state, comments: commentsAfterUpdate };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
