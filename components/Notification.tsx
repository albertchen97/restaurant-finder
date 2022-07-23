import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
// Toast notification to recommened restaurants near the user
const CustomToast = ({ closeToast }: { closeToast: any }) => {
  return (
    <div>
      🦄 Check these restaurants around you!
      <li> McDonald's </li>
      <li> Burger King </li>
      <br />
      <button onClick={closeToast}>Check</button>
    </div>
  );
};

export default function Notification() {
  useEffect(() => {
    toast.success(CustomToast, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  },[])

  return <ToastContainer />;
}

