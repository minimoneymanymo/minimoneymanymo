import LoginForm from "@/components/auth/LoginForm.tsx"

function LoginPage(): JSX.Element {
  return (
    <div className="h-[calc(100vh-110px)] w-full">
      <div className="mx-auto flex h-full w-fit items-center justify-center">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
