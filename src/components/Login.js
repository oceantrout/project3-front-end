import { useRef, useState, useEffect, useContext } from "react";
import { useLocalStorage } from "@har4s/use-local-storage";
//import AuthContext from "./context/AuthProvider";
import "./Login.css";
const Login = () => {
  // const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [uid, setUid] = useLocalStorage("UID");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        email: user,
        password: pwd,
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "https://graceful-hoodie-deer.cyclic.app/auth/signin",
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result?.user?.email ? result.user.email : null);
          //setAuth({ uid: result?.user?.uid ? result.user.uid : null });
          setUid(result?.user?.email ? result.user.email : null);
          setSuccess(true);
        })
        .catch((error) => console.log("error", error));
      setUser("");
      setPwd("");
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <main className="App-login">
      {success ? (
        <section>
          <h1>You are logged in!</h1>
          <br />
          <p>
            <a href="/Display">Click here to proceed</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              value={user}
              required
            />

            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button>Log me in</button>
          </form>
          <p>
            <a>First time user?</a>
            <br />
            <span className="line">
              {/*put router link here*/}
              <a href="/Register">Create an account</a>
            </span>
          </p>
        </section>
      )}
    </main>
  );
};

export default Login;
