import {useNavigate} from "react-router-dom";
function CreateGroupCard() {
  const navigate = useNavigate();
  function handleClick()
  {
    navigate("/creategroup");
  }

  
  return (
    <div className="create-group-card" onClick={handleClick}>
      
      <div className="icon">👥</div>
      
      <h2>Create new group!</h2>

    </div>
  );
}

export default CreateGroupCard;