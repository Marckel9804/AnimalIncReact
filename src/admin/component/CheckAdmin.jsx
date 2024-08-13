import { useNavigate } from "react-router-dom";

const useCheckAdmin = (role) => {
  const navigate = useNavigate();

  if(role && role.includes('ADMIN')) {
    return true
  }
  return false;
};

export default useCheckAdmin;
