import React from "react";

const Register = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const usingFetch = useFetch();

  const { mutate, onSuccess } = useMutation({
    mutationFn: async () => {
      await usingFetch("/auth/register", "POST", { email, password });
    },
  });

  return <div></div>;
};

export default Register;
