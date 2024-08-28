import Link from "next/link";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function PostPage({ searchParams }) {
  console.log("searchParams", searchParams);

  const result = await db.query(`SELECT * FROM blog_posts`);
  console.log(result);
  const blogposts = result.rows;
  console.log(blogposts);

  if (searchParams.sort === "desc") {
    blogposts.reverse();
  }
  let i = 0;
  return (
    <div>
      <div className={styles.blogheading}>
        <h2>Blogs</h2>
        <Link href="/posts?sort=asc">Sort ascending</Link>
        <Link href="/posts?sort=desc">Sort descending</Link>
      </div>
      {blogposts.map(function (blogpost) {
        return (
          <div className="blog-post" key={blogpost.id}>
            <Link href={`posts/${blogpost.id}`} key={blogpost.id}>
              Blog#
              {++i}
            </Link>
            <p>{blogpost.content}</p>
            <h4>Blog created by:{blogpost.username}</h4>
            <form action={deletePost}>
              <input
                type="hidden"
                name="postid"
                placeholder="postid"
                value={blogpost.id}
              />
              <button className={styles.button}>Delete</button>
            </form>
          </div>
        );
      })}
    </div>
  );
}
async function deletePost(formData) {
  "use server";
  console.log("Delete post from the db");

  const postid = formData.get("postid");

  await db.query(`DELETE FROM comments where post_id = ${postid} `);
  console.log("Comments deleted");
  await db.query(`DELETE FROM blog_posts where id = ${postid} `);
  console.log("Post deleted");
  revalidatePath("/posts"); // revalidate the posts page to ensure all the new posts are shown

  redirect("/posts"); //redirect to the page that show the list of posts
}
async function addBlogPost(formData) {
  "use server";
  console.log("Saving post to the db");

  const username = formData.get("username");
  const content = formData.get("content");

  await db.query(
    `INSERT INTO blog_posts(username, content, created_date) values($1, $2,$3)`,
    [username, content, new Date()]
  );
  console.log("Post saved");
  revalidatePath("/posts"); // revalidate the posts page to ensure all the new posts are shown

  redirect("/posts"); //redirect to the page that show the list of posts
}
