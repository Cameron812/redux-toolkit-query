import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useGetPostsQuery, useEditPostMutation } from "../api/apiSlice";
import { Spinner } from "../../components/Spinner";

export const EditPostForm = ({ match }) => {
  const { postId } = match.params;

  // const { data: post } = useGetPostQuery(postId);
  const { data: posts = [] } = useGetPostsQuery();
  const post = posts.find((p) => p.id === postId);
  const [updatePost, { isLoading }] = useEditPostMutation();

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const history = useHistory();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onContentChanged = (e) => setContent(e.target.value);

  const onSavePostClicked = async () => {
    if (title && content) {
      await updatePost({ id: postId, title, content });
      history.push(`/posts/${postId}`);
    }
  };
  const spinner = isLoading ? <Spinner size="30px" /> : null;
  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <button type="button" onClick={onSavePostClicked}>
          Save Post
        </button>
        {spinner}
      </div>
    </section>
  );
};
