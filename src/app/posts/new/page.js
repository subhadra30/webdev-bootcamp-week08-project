import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import styles from "./blogpage.module.css";

export default function AddBlogPostPage() {
  async function addBlogPost(formData) {
    "use server";
    console.log("Saving post to the db");

    const username = formData.get("username");
    const content = formData.get("content");

    await db.query(
      `INSERT INTO blog_posts(username, content, created_date) values($1, $2, $3)`,
      [username, content, new Date()]
    );
    console.log("Post saved");
    revalidatePath("/posts"); // revalidate the posts page to ensure all the new posts are shown

    redirect("/posts"); //redirect to the page that show the list of posts
  }
  return (
    <div>
      <h2 className={styles.heading}>Add your blog here</h2>
      <form className={styles.newblogentry} action={addBlogPost}>
        <label htmlFor="username">Username</label>
        <input
          name="username"
          placeholder="username"
          className={styles.username}
          required
        />
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          placeholder="content"
          rows="8"
          cols="50"
          required
        ></textarea>
        <button className={styles.button}>Submit</button>
      </form>
    </div>
  );
}
