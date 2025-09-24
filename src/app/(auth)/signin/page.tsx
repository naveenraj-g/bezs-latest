import { checkAuthProvider } from "@/modules/auth/checkAuthProvider";
import { SignInForm } from "@/modules/auth/components/auth/signin-form";

const SignInPage = async () => {
  await checkAuthProvider();

  return (
    <>
      <SignInForm />
    </>
  );
};

export default SignInPage;
