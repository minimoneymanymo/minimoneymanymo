import { useState } from "react"
import {
  Card,
  Button,
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
import Swal from "sweetalert2"
import { ContourValueResolverDescription } from "igniteui-react-core"
import axios from "axios"
import { alertBasic } from "@/utils/alert-util"

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
        await setMemberInfo(dispatch, role)
        console.log("Parent state: ", parent)
        console.log("Child state: ", child)
        navigate("/main")
      } else if (response.stateCode == 401) {
        Swal.fire({
          icon: "warning",
          text: "아이디와 비밀번호를 확인해주세요",
        })
      }
    } catch (error: unknown) {
      // error가 AxiosError 타입인지 확인
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "아이디, 비밀번호가 일치하지 않습니다",
            showConfirmButton: false,
            timer: 1500,
            customClass: {
              title: "text-xl",
              popup: "pb-12",
            },
          })
        } else {
          // 기타 서버 오류 처리
          Swal.fire({
            position: "center",
            icon: "error",
            title: "로그인 중 오류가 발생했습니다",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      }
    }
  }

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value)
  }

  const handleRoleChange = (event: number) => {
    setRole(event) // Update role based on selected radio button
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
        <div className="text-blue-gray-700 -mb-1 text-xl font-semibold tracking-wider">
          환영해요!
        </div>
        <div className="mt-1 text-3xl font-bold tracking-wide text-secondary-m2">
          minimoneymanymo
        </div>
        <div className="mt-6 flex">
          <button
            className={`${role === 0 ? "border-secondary-m2 bg-secondary-m3" : ""} flex-1 border py-0.5`}
            onClick={() => {
              handleRoleChange(0)
            }}
          >
            부모
          </button>
          <button
            className={`${role === 1 ? "border-secondary-m2 bg-secondary-m3" : ""} flex-1 border py-0.5`}
            onClick={() => {
              handleRoleChange(1)
            }}
          >
            자녀
          </button>
        </div>

        <form className="mb-2 mt-4 w-80 max-w-screen-lg sm:w-96">
          <div className="mb-1 flex flex-col gap-6">
            <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
              아이디
            </div>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              value={id}
              onChange={handleIdChange}
            />

            <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
              비밀번호
            </div>
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

          <div
            className="mt-6 flex justify-center rounded-lg bg-secondary-m2 p-2 text-base text-lg text-white"
            onClick={goLogin}
          >
            로그인
          </div>
          <div className="mt-4 text-center text-gray-500">
            <a href="sign-up" className="font-medium text-gray-900">
              회원가입 하러가기
            </a>
          </div>
        </form>
      </Card>
    </Card>
  )
}

export default LoginForm
