import Link from "next/link";

export default function Header() {
  return (
    <header className="header-display">
      <h2>Scribble Board</h2>
      <nav className="nav-bar">
        <Link href="/">Home</Link>
        <Link href="/posts">Blogs</Link>
        <Link href="/posts/new">New Blog</Link>
      </nav>
    </header>
  );
}
