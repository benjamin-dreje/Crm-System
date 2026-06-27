import Image from "next/image";
import Link from "next/link";
import "./page.css";

export default function Home() {
  return (
    <div className="homepage-container">
      {/* מיכל התמונה */}
      <div className="hero-container">
        <Image
          src="/heroimage.jpg"
          alt="Hero banner"
          fill
          className="hero-img"
          priority
        />
      </div>
      <div className="hero-text">
        <h1>Welcome to Our client relation management platform</h1>
        <p>Discover our amazing products and services</p>

        <Link href="/login">
          <button className="cta-button">Get Started</button>
        </Link>
      </div>
    </div>
  );
}
