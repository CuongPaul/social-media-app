import moment from "moment";
import React, { useState, Fragment, useContext } from "react";
import {
  Card,
  Button,
  Divider,
  CardHeader,
  Typography,
  CardContent,
} from "@material-ui/core";

import PostAction from "./PostAction";
import PostFooter from "./PostFooter";
import SlideImage from "./SlideImage";
import usePost from "../../hooks/usePost";
import PostSubContent from "./PostSubContent";
import { UIContext, PostContext } from "../../App";
import { AvatarIcon, LoadingIcon } from "../common";

const Posts = ({ userId }) => {
  const {
    uiState: { darkMode },
  } = useContext(UIContext);
  const {
    postState: { posts, postsTotal },
  } = useContext(PostContext);

  const [postsPage, postPage] = useState(1);

  const { isLoading, handleGetPosts, handleGetPostsByUser } = usePost();

  return (
    <Fragment>
      {posts.map((post) => (
        <Card
          key={post._id}
          style={{
            marginTop: "20px",
            borderRadius: "15px",
            backgroundColor: darkMode && "rgb(36,37,38)",
          }}
        >
          <CardHeader
            action={<PostAction post={post} />}
            subheader={moment(post.createdAt).fromNow()}
            title={<PostSubContent user={post.user} postBody={post.body} />}
            avatar={
              <AvatarIcon
                text={post.user.name}
                imageUrl={post.user.avatar_image}
              />
            }
          />
          <CardContent>
            <Typography
              style={{
                fontWeight: "400",
                fontSize: "16px",
                fontFamily: "fantasy",
              }}
            >
              {post.text}
            </Typography>
          </CardContent>
          {post?.images && <SlideImage images={post.images} />}
          <Divider />
          <PostFooter post={post} />
        </Card>
      ))}
      {Boolean(postsTotal > posts.length) && (
        <div
          style={{
            display: "flex",
            marginTop: "20px",
            justifyContent: "center",
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              const nextpage = postsPage + 1;

              postPage(nextpage);

              if (!userId) {
                handleGetPosts(nextpage);
              } else {
                handleGetPostsByUser(nextpage, userId);
              }
            }}
          >
            <LoadingIcon text={"More posts"} isLoading={isLoading} />
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default Posts;
