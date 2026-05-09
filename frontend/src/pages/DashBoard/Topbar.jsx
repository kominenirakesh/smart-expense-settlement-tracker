function Topbar() {
  return (
    <div className="topbar">
      
      <input 
        type="text" 
        placeholder="Search..." 
        className="search"
      />

      <div className="user">
        <div className="avatar-small"></div>
      </div>

    </div>
  );
}

export default Topbar;