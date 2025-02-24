export default function Footer({ style }) {
  return (
    <footer className="footer" style={style}>
      <div className="footer-content">
      <img src="holy-grail.png" alt="banner" width="30" height="30" />
        <a href="https://github.com/Raumus204" target="_blank">
          Cory
          <img src="/mark-white.png" alt="GitHub Logo" width="30" height="30"></img>
        </a>
        <img src="holy-grail.png" alt="banner" width="30" height="30"/>
      </div>
    </footer>
  );
}