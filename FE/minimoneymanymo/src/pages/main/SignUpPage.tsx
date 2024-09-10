import SimpleRegistrationForm from "@/components/signuppage/SimpleRegistrationForm";



function SignUpPage(): JSX.Element {
  return (
    <div className=" w-full ">
      <div className="flex justify-center items-center w-fit min-h-screen mx-auto">
        <SimpleRegistrationForm />
      </div>
    </div>
  );
}

export default SignUpPage;