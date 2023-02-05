export const initialPostState = {
    posts: [],
    postPagination: {
        totalPage: 0,
        currentPage: 0,
    },
    post: {
        comments: [],
        commentPagination: {
            totalPage: 0,
            currentPage: 0,
        },
    },
};

export const PostReducer = (state, action) => {
    switch (action.type) {
        case "SET_POSTS":
            return { ...state, posts: action.payload };

        case "SET_CURRENT_POST":
            return { ...state, post: action.payload };

        case "REMOVE_CURRENT_POST":
            return {
                ...state,
                post: {
                    comments: [],
                    commentPagination: {
                        totalPage: 0,
                        currentPage: 0,
                    },
                },
            };

        case "ADD_POST":
            return { ...state, posts: [action.payload, ...state.posts] };

        case "DELETE_COMMENT":
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: [...action.payload],
                },
            };

        case "DELETE_POST":
            return { ...state, posts: [...action.payload] };

        case "EDIT_POST":
            const { posts } = state;

            posts.forEach((post) => {
                if (post.id === action.payload.id) {
                    post.privacy = action.payload.privacy;
                    post.content = action.payload.content;

                    return;
                }
            });

            return { ...state, posts: [...posts] };

        case "POST_PAGINATION":
            return {
                ...state,
                postPagination: {
                    ...state.postPagination,
                    totalPage: action.payload.totalPage,
                    currentPage: action.payload.currentPage,
                },
                posts: [...state.posts, ...action.payload.posts],
            };

        case "COMMENT_PAGINATION":
            return {
                ...state,
                post: {
                    ...state.post,
                    commentPagination: {
                        ...state.post.commentPagination,
                        totalPage: action.payload.totalPage,
                        currentPage: action.payload.currentPage,
                    },
                    comments:
                        state.post.comments && state.post.comments.length
                            ? [...state.post.comments, ...action.payload.comments]
                            : [...action.payload.comments],
                },
            };

        case "LIKE_UNLIKE_POST":
            let l_postIndex = state.posts.findIndex((post) => post.id === action.payload.id);
            state.posts[l_postIndex] = action.payload;
            if (state.post.id === action.payload.id) {
                state.post = action.payload;
            }

            return { ...state };

        case "SET_POST_COMMENTS":
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: action.payload,
                },
            };

        case "ADD_POST_COMMENT":
            return {
                ...state,
                post: {
                    ...state.post,
                    comments: [action.payload, ...state.post.comments],
                },
            };

        case "LIKE_UNLIKE_COMMENT":
            let index1 = state.post.comments.findIndex(
                (comment) => comment.id === action.payload.id
            );
            state.post.comments[index1] = action.payload;

            return { ...state };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
