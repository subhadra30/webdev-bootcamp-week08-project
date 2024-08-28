import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function SinglePostPage({ params }) {
  console.log(params.id);
  const result = await db.query(
    `select * from blog_posts where id = ${params.id}`
  );
  console.log(result);
  const blog_post = result.rows[0];

  const comments = (
    await db.query(`select * from comments where post_id = ${params.id}`)
  ).rows;
  console.log(comments);
  return (
    <div className={styles.commentpage}>
      <h2>Blog# {params.id}</h2>
      <p>{blog_post.content}</p>
      <h3>Content Creator: {blog_post.username}</h3>
      <h2>Comments of Blog# {params.id}</h2>
      {comments.map(function (comment) {
        return (
          <div key={comment.id}>
            <p key={comment.id}>{comment.content}</p>
            <h3 key={comment.id}>Posted by: {comment.username}</h3>
          </div>
        );
      })}
      <div>
        <h2>Post comments below</h2>
        <form className={styles.newcommententry} action={addComment}>
          <label htmlFor="username">Username</label>
          <input name="username" placeholder="Username" required />
          <label htmlFor="comment">Comment</label>
          <textarea name="content" placeholder="Comment" required></textarea>
          <input
            type="hidden"
            name="postid"
            placeholder="postid"
            value={params.id}
          />
          <button className={styles.button}>Post</button>
        </form>
      </div>
    </div>
  );
}
async function addComment(formData) {
  "use server";
  console.log("Saving comment to the db");

  const username = formData.get("username");
  const content = formData.get("content");
  const postid = formData.get("postid");

  await db.query(
    `INSERT INTO comments(username, content, post_id) values($1, $2,$3)`,
    [username, content, postid]
  );
  console.log("Comment saved");
  revalidatePath(`/posts/${postid}`); // revalidate the posts page to ensure all the new posts are shown
  redirect(`/posts/${postid}`); //redirect to the page that show the list of comments
}
