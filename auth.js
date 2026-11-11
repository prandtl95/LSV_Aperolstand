import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCF8rg7QuK6oNBwDgqgxWEes8A_4WvllVU",
  authDomain: "lsv-aperolstand.firebaseapp.com",
  projectId: "lsv-aperolstand",
  storageBucket: "lsv-aperolstand.firebasestorage.app",
  messagingSenderId: "62289008940",
  appId: "1:62289008940:web:db4822f38b0b6fcfe7f489",
  measurementId: "G-N4L6V2XGF0"
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const style = document.createElement("style");
style.textContent = `
  #login-overlay { position: fixed; inset: 0; background: #f4f4f4; display: flex; align-items: center; justify-content: center; z-index: 1000; font-family: sans-serif; }
  #login-overlay form { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; gap: 0.8rem; width: min(320px, 90vw); }
  #login-overlay input { padding: 0.6rem; font-size: 1rem; border: 1px solid #ccc; border-radius: 4px; }
  #login-overlay button { padding: 0.7rem; font-size: 1rem; background: #007acc; color: white; border: none; border-radius: 4px; cursor: pointer; }
  #login-error { color: #c62828; font-size: 0.9rem; min-height: 1.2rem; }
  #logout-btn { position: fixed; top: 0.8rem; right: 0.8rem; padding: 0.4rem 0.8rem; font-size: 0.9rem; background: #666; color: white; border: none; border-radius: 4px; cursor: pointer; z-index: 999; }
`;
document.head.appendChild(style);

function showLogin() {
  const overlay = document.createElement("div");
  overlay.id = "login-overlay";
  overlay.innerHTML = `
    <form>
      <h2 style="margin:0">Login</h2>
      <input type="email" id="login-email" placeholder="Email" autocomplete="username" required>
      <input type="password" id="login-password" placeholder="Password" autocomplete="current-password" required>
      <button type="submit">Log in</button>
      <div id="login-error"></div>
    </form>`;
  document.body.appendChild(overlay);

  overlay.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const errorDiv = overlay.querySelector("#login-error");
    errorDiv.textContent = "";
    try {
      await signInWithEmailAndPassword(
        auth,
        overlay.querySelector("#login-email").value,
        overlay.querySelector("#login-password").value
      );
    } catch {
      errorDiv.textContent = "Login failed. Check email and password.";
    }
  });
}

function showLogoutButton() {
  const btn = document.createElement("button");
  btn.id = "logout-btn";
  btn.textContent = "Logout";
  btn.addEventListener("click", async () => {
    await signOut(auth);
    location.reload();
  });
  document.body.appendChild(btn);
}

// Resolves once a user is signed in; shows the login overlay until then.
export function requireAuth() {
  return new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        unsubscribe();
        document.getElementById("login-overlay")?.remove();
        showLogoutButton();
        resolve(user);
      } else if (!document.getElementById("login-overlay")) {
        showLogin();
      }
    });
  });
}
