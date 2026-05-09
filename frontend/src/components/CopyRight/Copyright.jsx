import "./Copyright.css";

function Copyright() {
  return (
    <footer className="copyright">
      <p>© {new Date().getFullYear()} Komineni Rakesh. All rights reserved.</p>
    </footer>
  );
}

export default Copyright;