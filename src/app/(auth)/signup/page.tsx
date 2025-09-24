import { checkAuthProvider } from "@/modules/auth/checkAuthProvider";
import { SignUpForm } from "@/modules/auth/components/auth/signup-form";

const SignUpPage = async () => {
  await checkAuthProvider();

  return (
    <>
      <SignUpForm />
    </>
  );
};

export default SignUpPage;
