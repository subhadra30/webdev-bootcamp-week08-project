import Link from "next/link";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import styles from "./page.module.css";

export default async function PostPage({ searchParams }) {
  console.log("searchParams", searchParams);

  //For retrieving and displaying list of blogs from database on the Blogs page

  const result = await db.query(`SELECT * FROM blog_posts`);
  console.log(result);
  const blogposts = result.rows;
  console.log(blogposts);

  // For sorting the blog posts in ascending/descending order

  if (searchParams.sort === "desc") {
    blogposts.reverse();
  }

  return (
    <div>
      <div className={styles.blogheading}>
        <h2>Blogs</h2>
        <Link href="/posts?sort=asc">Sort ascending</Link>
        <Link href="/posts?sort=desc">Sort descending</Link>
      </div>
      <h4>(Click each blog link to post comment)</h4>
      {blogposts.map(function (blogpost) {
        return (
          <div className={styles.blogpost} key={blogpost.id}>
            <Link href={`posts/${blogpost.id}`} key={blogpost.id}>
              Blog#
              {blogpost.id}
            </Link>
            <p>{blogpost.content}</p>
            <h4>Blog created by:{blogpost.username}</h4>

            {/* For deleting the blogpost */}

            <form action={deletePost}>
              <input type="hidden" name="postid" value={blogpost.id} />
              <button className={styles.button}>Delete</button>
            </form>
          </div>
        );
      })}
    </div>
  );
}

//Function for deleting blog and corresponding comments from database based on user clicking Delete button

async function deletePost(formData) {
  "use server";
  console.log("Delete post from the db");

  const postid = formData.get("postid");

  await db.query(`DELETE FROM comments where post_id = ${postid} `);
  console.log("Comments deleted");

  await db.query(`DELETE FROM blog_posts where id = ${postid} `);
  console.log("Post deleted");
  revalidatePath("/posts");
  redirect("/posts");
}
