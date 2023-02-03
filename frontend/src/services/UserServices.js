import axios from "axios";
const url = process.env.REACT_APP_BASE_API_URL;

export const fetchUserById = async (user_id) => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/${user_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const fetchRecommandedUsers = async () => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/recommanded_users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const sendFriendRequest = async (user_id) => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/friend_request/${user_id}/send`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const fetchIncommingFriendRequests = async () => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/friend_request/received`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const fetchSendedFriendRequests = async () => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/friend_request/sended`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const acceptFriendRequest = async (request_id) => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/friend_request/${request_id}/accept`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const unFriend = async ({ userRequest, friendRequest }) => {
    let token = JSON.parse(localStorage.token);

    try {
        const newListFriendUserRequest = userRequest.friends.filter(
            (item) => item !== friendRequest.id
        );
        const newListFriendFriendRequest = friendRequest.friends.filter(
            (item) => item !== userRequest.id
        );

        const { data } = await axios.patch(
            `${url}/api/user/unfriend_request`,
            {
                userRequest: { ...userRequest, friends: [...newListFriendUserRequest] },
                friendRequest: { ...friendRequest, friends: [...newListFriendFriendRequest] },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const declineFriendRequest = async (request_id) => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/friend_request/${request_id}/decline`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};

export const cancelFriendRequest = async (request_id) => {
    let token = JSON.parse(localStorage.token);
    try {
        const { data } = await axios.get(`${url}/api/user/friend_request/${request_id}/cancel`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (data) {
            return {
                data,
            };
        }
    } catch (err) {
        if (err && err.response) {
            return {
                error: err.response.data.error,
            };
        }
    }
};
