import LoginForm from "@/components/auth/LoginForm.tsx";

function LoginPage(): JSX.Element {
  return (
    <div className=" w-full ">
      <div className="flex justify-center items-center w-fit min-h-screen mx-auto">
        <LoginForm></LoginForm>
      </div>
    </div>
  );
}


export default LoginPage
