import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const useGuestRoute = ({ delay = 0 }) => {
  const router = useRouter();
  const user = useSelector(({ user: { user } }) => user);
  if (user) {
    setTimeout(() => {
      router.replace(
        user.role === "user" ? "/user" : user.role === "admin" && "/admin"
      );
    }, delay);
  }
  return null;
};

export default useGuestRoute;
