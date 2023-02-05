const basicInforUser = (user) => ({
    id: user.id,
    name: user.name,
    avatar_image: user.avatar_image,
});

const filterInforUsers = (userData) => userData?.map((user) => basicInforUser(user));

const postDataFilter = (post) => ({
    id: post.id,
    text: post.text,
    images: post.images,
    privacy: post.privacy,
    createdAt: post.createdAt,
    user: basicInforUser(post.user),
    react: {
        wow: filterInforUsers(post.react.wow),
        sad: filterInforUsers(post.react.sad),
        like: filterInforUsers(post.react.like),
        love: filterInforUsers(post.react.love),
        haha: filterInforUsers(post.react.haha),
        angry: filterInforUsers(post.react.angry),
    },
    body: {
        feelings: post.body.feelings,
        location: post.body.location,
        tag_friends: filterInforUsers(post.body.tag_friends),
    },
});

const userDataFilter = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    hometown: user.hometown,
    createdAt: user.createdAt,
    education: user.education,
    cover_image: user.cover_image,
    avatar_image: user.avatar_image,
    friends: filterInforUsers(user.friends),
});

const commentDataFilter = (comment) => ({
    id: comment.id,
    post: comment.post,
    content: comment.content,
    createdAt: comment.createdAt,
    user: basicInforUser(comment.user),
    react: {
        wow: filterInforUsers(comment.react.wow),
        sad: filterInforUsers(comment.react.sad),
        like: filterInforUsers(comment.react.like),
        love: filterInforUsers(comment.react.love),
        haha: filterInforUsers(comment.react.haha),
        angry: filterInforUsers(comment.react.angry),
    },
});

const messageDataFilter = (message) => ({
    id: message.id,
    room: message.room,
    content: message.content,
    createdAt: message.createdAt,
    sender: basicInforUser(message.sender),
    react: {
        wow: filterInforUsers(message.react.wow),
        sad: filterInforUsers(message.react.sad),
        like: filterInforUsers(message.react.like),
        love: filterInforUsers(message.react.love),
        haha: filterInforUsers(message.react.haha),
        angry: filterInforUsers(message.react.angry),
    },
});

const chatRoomDataFilter = (chatRoom) => ({
    id: chatRoom.id,
    name: chatRoom.name,
    avatar_image: chatRoom.avatar_image,
});

const notificationDataFilter = (notification) => ({
    id: notification.id,
    key: notification.key,
    user: notification.user,
    content: notification.content,
    is_read: notification.is_read,
    createdAt: notification.createdAt,
});

const friendRequestDataFilter = (friendRequest) => ({
    id: friendRequest.id,
    createdAt: friendRequest.createdAt,
    is_accepted: friendRequest.is_accepted,
    sender: basicInforUser(friendRequest.sender),
    receiver: basicInforUser(friendRequest.receiver),
});

export {
    postDataFilter,
    userDataFilter,
    commentDataFilter,
    messageDataFilter,
    chatRoomDataFilter,
    notificationDataFilter,
    friendRequestDataFilter,
};
