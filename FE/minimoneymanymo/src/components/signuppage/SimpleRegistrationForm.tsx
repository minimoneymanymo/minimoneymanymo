import {useState} from "react"
import {
  Card,
  Checkbox,
  Button,
  Typography,
  Radio,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react"
import {Visibility, VisibilityOff} from "@mui/icons-material"
import {
  IconButton,
  InputAdornment,
  TextField,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material"

import passLogo from "../../assets/signin/image.png"

export function SimpleRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPhonePassword, setShowPhonePassword] = useState(false)
  const [hoverPassword, setHoverPassword] = useState(false)
  const [hoverConfirmPassword, setHoverConfirmPassword] = useState(false)
  const [hoverPhonePassword, setHoverPhonePassword] = useState(false)

  const [role, setRole] = useState<number | null>(null) // Initialize with null or default value

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(Number(event.target.value)) // Update role based on selected radio button
  }

  const [placeholderText, setPlaceholderText] =
    useState("pass인증을 진행해 주세요!") // 상태로 placeholder 관리

  // 조건에 따라 placeholder를 변경하는 함수 (예시)
  const updatePlaceholder = (newPlaceholder: string) => {
    setPlaceholderText(newPlaceholder)
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)
  const handleClickShowPhonePassword = () =>
    setShowPhonePassword(!showPhonePassword)
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()
  }

  return (
    <Card
      color="transparent"
      shadow={false}
      className="p-6 rounded-lg border border-gray-300"
    >
      <Typography variant="h5" color="blue-gray">
        환영해요 !
      </Typography>
      <Typography className="mt-1 font-bold text-3xl text-primary-m1">
        minimoneymanymo
      </Typography>
      <Typography variant="h6" color="blue-gray">
        에 회원가입을 해보아요
      </Typography>
      <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h7" color="blue-gray" className="-mb-3">
            아이디
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          <Typography variant="h7" color="blue-gray" className="-mb-3">
            이메일
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="name@mail.com"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
          />
          <Typography variant="h7" color="blue-gray" className="-mb-3">
            비밀번호
          </Typography>
          <TextField
            type={hoverPassword ? "text" : showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="********"
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
                    sx={{padding: 0}} // Remove extra padding
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
          <Typography variant="h7" color="blue-gray" className="-mb-3">
            비밀번호 확인
          </Typography>
          <TextField
            type={
              hoverConfirmPassword
                ? "text"
                : showConfirmPassword
                  ? "text"
                  : "password"
            }
            fullWidth
            variant="outlined"
            size="small"
            placeholder="********"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseEnter={() => setHoverConfirmPassword(true)}
                    onMouseLeave={() => setHoverConfirmPassword(false)}
                    onMouseDown={handleMouseDownPassword}
                    sx={{padding: 0}} // Remove extra padding
                  >
                    {showConfirmPassword || hoverConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
                      containerProps={{
                        className: "p-0",
                      }}
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="font-medium text-blue-gray-400"
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
                      containerProps={{
                        className: "p-0",
                      }}
                    />
                  </ListItemPrefix>
                  <Typography
                    color="blue-gray"
                    className="font-medium text-blue-gray-400"
                  >
                    자녀
                  </Typography>
                </label>
              </ListItem>
            </List>
          </Card>

          {role === 0 && ( //부모부분은 여기에 입력
            <>
              <Typography variant="h7" color="blue-gray" className="-mb-3">
                전화번호(PASS인증 부모부분)
                <Button
                  className="ml-2 p-0" // 이미지와 버튼 간의 간격 조절
                  style={{minWidth: "auto", padding: 0}} // 버튼의 최소 너비와 패딩 설정
                >
                  <img src={passLogo} alt="Logo" className="w-9 h-9 " />{" "}
                  {/* 버튼 안에 이미지 추가 및 크기 설정 */}
                </Button>
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder={placeholderText} // 동적으로 placeholder 설정
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                InputProps={{
                  readOnly: true, // 사용자 입력을 방지
                }}
              />
            </>
          )}

          {role === 1 && ( // 자녀부분은 여기에 입력
            <>
              <Typography variant="h7" color="blue-gray" className="-mb-3">
                부모님 번호를 입력해 주세요
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="010-0000-0000"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <Typography variant="h7" color="blue-gray" className="-mb-3">
                생일을 입력해 주세요
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="YYYYMMDD"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
            </>
          )}
        </div>

        <Button className="mt-6 bg-primary-m1" fullWidth>
          미니마니모를 향한 여정을 시작해보아요!
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="#" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
      </form>
    </Card>
  )
}

export default SimpleRegistrationForm
