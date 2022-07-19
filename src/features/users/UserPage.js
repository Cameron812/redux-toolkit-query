import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectPostsByUser } from "../posts/postsSlice";
import { selectUserById } from "../users/usersSlice";
import { useGetPostsQuery } from "../api/apiSlice";
import { createSelector } from "@reduxjs/toolkit";

export const UserPage = ({ match }) => {
  const { userId } = match.params;

  const user = useSelector((state) => selectUserById(state, userId));

  const selectPostsByUser = React.useMemo(() => {
    const emptyArray = [];
    return createSelector(
      (res) => res.data,
      (_, userId) => userId,
      (data, userId) =>
        data?.filter((post) => post.user === userId) ?? emptyArray
    );
  }, []);

  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (result) => ({
      postsForUser: selectPostsByUser(result, userId)
    })
  });

  /*  Transformation approaches
      1.  Keep original response in cache, read full result in compoonent and derive values.
        eg. const { data: posts = [] } = useGetPostsQuery();
            const postsForUser = posts.filter((post) => post.user === userId);
      2. Keep original response in cache, read derived result with selectFromResult
        eg. const selectPostsByUser = React.useMemo(() => {
              const emptyArray = [];
              return createSelector(
                (res) => res.data,
                (_, userId) => userId,
                (data, userId) =>
                  data?.filter((post) => post.user === userId) ?? emptyArray
              );
            }, []);

            const { postsForUser } = useGetPostsQuery(undefined, {
              selectFromResult: (result) => ({
                postsForUser: selectPostsByUser(result, userId)
              })
            });
      3. Transform response before storing in cacheß
  */

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  );
};
