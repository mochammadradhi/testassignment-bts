import { useDispatch } from "react-redux";
import { logout } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast("You’ve been logged out");
    navigate("/login");
  };

  return (
    <Button
      variant="outline"
      className="absolute top-4 right-4"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
