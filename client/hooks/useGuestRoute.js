import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const useGuestRoute = () => {
  const router = useRouter();
  const user = useSelector(({ user: { user } }) => user);
  if (user) {
    router.replace("/");
  }
  return null;
};

export default useGuestRoute;
