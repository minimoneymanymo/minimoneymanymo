import { useState } from "react"
import {
  Card,
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { userLogin } from "@/api/user-api"
import { useNavigate } from "react-router-dom"
import { setMemberInfo } from "@/utils/user-utils"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"
import { selectParent } from "@/store/slice/parent"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [hoverPassword, setHoverPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [id, setId] = useState("") // 상태 추가
  const [role, setRole] = useState<number>(0) // Initialize with null or default value
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const parent = useAppSelector(selectParent) // 부모 상태 선택
  const child = useAppSelector(selectChild) // 자식 상태 선택

  const goLogin = async (): Promise<void> => {
    console.log("로그인 버튼 클릭")
    const formData = new FormData()
    formData.append("userid", id)
    formData.append("password", password)
    formData.append("role", role.toString()) // `role`을 문자열로 변환

    try {
      const response = await userLogin(formData)
      console.log(response)
      if (response.stateCode == 200) {
        alert("로그인 성공")
        await setMemberInfo(dispatch, role)
        // 선택한 상태 확인
        console.log("Parent state: ", parent)
        console.log("Child state: ", child)
        // navigate("/")
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value)
  }

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(Number(event.target.value)) // Update role based on selected radio button
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)

  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()
  }

  return (
    <Card
      color="transparent"
      shadow={false}
      className="rounded-lg border border-gray-300 p-6"
    >
      <Card color="transparent" shadow={false}>
        <Typography variant="h5" color="blue-gray">
          환영해요 !
        </Typography>
        <Typography className="mt-1 text-3xl font-bold text-tertiary-600-m4">
          minimoneymanymo
        </Typography>

        <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              아이디
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={id}
              onChange={handleIdChange}
            />

            <Typography variant="h6" color="blue-gray" className="-mb-3">
              비밀번호
            </Typography>
            <TextField
              type={hoverPassword ? "text" : showPassword ? "text" : "password"}
              fullWidth
              variant="outlined"
              size="small"
              value={password}
              onChange={handlePasswordChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseEnter={() => setHoverPassword(true)}
                      onMouseLeave={() => setHoverPassword(false)}
                      onMouseDown={handleMouseDownPassword}
                      sx={{ padding: 0 }} // Remove extra padding
                    >
                      {showPassword || hoverPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <Card className="w-full max-w-[24rem] shadow-none">
            <List className="flex-row">
              <ListItem className="p-0">
                <label
                  htmlFor="horizontal-list-react"
                  className="flex w-full cursor-pointer items-center px-3 py-2"
                >
                  <ListItemPrefix className="mr-3">
                    <Radio
                      name="horizontal-list"
                      id="horizontal-list-react"
                      value="0" // Set value for role 0
                      checked={role === 0}
                      onChange={handleRoleChange}
                      ripple={false}
                      className="hover:before:opacity-0"
                      containerProps={{ className: "p-0" }}
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="text-blue-gray-400 font-medium"
                  >
                    부모
                  </Typography>
                </label>
              </ListItem>
              <ListItem className="p-0">
                <label
                  htmlFor="horizontal-list-vue"
                  className="flex w-full cursor-pointer items-center px-3 py-2"
                >
                  <ListItemPrefix className="mr-3">
                    <Radio
                      name="horizontal-list"
                      id="horizontal-list-vue"
                      value="1" // Set value for role 1
                      checked={role === 1}
                      onChange={handleRoleChange}
                      ripple={false}
                      className="hover:before:opacity-0"
                      containerProps={{ className: "p-0" }}
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="text-blue-gray-400 font-medium"
                  >
                    자녀
                  </Typography>
                </label>
              </ListItem>
            </List>
          </Card>
          <Button
            className="mt-6 bg-tertiary-600-m4"
            fullWidth
            onClick={goLogin}
          >
            로그인
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            계정이 없으신가요?{" "}
            <a href="#" className="font-medium text-gray-900">
              회원가입
            </a>
          </Typography>
        </form>
      </Card>
    </Card>
  )
}

export default LoginForm
