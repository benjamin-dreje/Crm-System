import Link from "next/link";
import "./page.css";
export default function Login() {
  return (
    <div className="login-container">
      <h1>Login</h1>

      <div className="login-demo">
        <div className="login-demo-text">
          <h4>Demo Credentials</h4>
        </div>
        <p>email: user@example.com</p>
        <p>password: password</p>
      </div>
      <form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <p></p>
    </div>
  );
}
