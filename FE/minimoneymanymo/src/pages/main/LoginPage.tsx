import LoginForm from "@/components/auth/LoginForm.tsx"

function LoginPage(): JSX.Element {
  return (
    <div className="w-full">
      <div className="mx-auto flex min-h-screen w-fit items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
