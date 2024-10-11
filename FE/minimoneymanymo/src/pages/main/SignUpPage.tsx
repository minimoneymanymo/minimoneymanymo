import SimpleRegistrationForm from "@/components/auth/SimpleRegistrationForm"

function SignUpPage(): JSX.Element {
  return (
    <div className="w-full">
      <div className="mx-auto flex min-h-screen w-fit items-center justify-center">
        <SimpleRegistrationForm />
      </div>
    </div>
  )
}

export default SignUpPage
