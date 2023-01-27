const postFilter = (post) => {
    const filterIdAndName = (data) => {
        return data.map((user) => ({ id: user._id, name: user.name }));
    };

    return {
        id: post._id,
        images: post.images,
        content: post.content,
        privacy: post.privacy,
        createdAt: post.createdAt,
        user: {
            id: post.user._id,
            name: post.user.name,
            active: post.user.active,
            avatar_image: post.user.avatar_image,
        },
        body: {
            date: post.body.date,
            feelings: post.body.feelings,
            location: post.body.location,
            withs: filterIdAndName(post.body.with),
        },
        reacts: {
            wow: filterIdAndName(post.reacts.wow),
            sad: filterIdAndName(post.reacts.sad),
            like: filterIdAndName(post.reacts.like),
            love: filterIdAndName(post.reacts.love),
            haha: filterIdAndName(post.reacts.haha),
            angry: filterIdAndName(post.reacts.angry),
        },
    };
};

const userFilter = (user) => {
    const friends = user.friends.map((friend) => ({ id: friend._id, name: friend.name }));

    return {
        friends,
        id: user._id,
        bio: user.bio,
        name: user.name,
        email: user.email,
        location: user.location,
        createdAt: user.createdAt,
        education: user.education,
        is_active: user.is_active,
        cover_image: user.cover_image,
        avatar_image: user.avatar_image,
    };
};

const commentFilter = (comment) => ({
    id: comment._id,
    body: comment.body,
    post: comment.post,
    likes: comment.likes,
    user: {
        id: comment.user._id,
        name: comment.user.name,
        email: comment.user.email,
        avatar_image: comment.user.avatar_image,
    },
});

export { postFilter, userFilter, commentFilter };
