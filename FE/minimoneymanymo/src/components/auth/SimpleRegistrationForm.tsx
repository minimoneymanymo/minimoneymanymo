import {useEffect, useState} from "react"
import {
  Card,
  Button,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Radio,
} from "@material-tailwind/react"
import {Visibility, VisibilityOff} from "@mui/icons-material"
import {IconButton, InputAdornment, TextField} from "@mui/material"
import passLogo from "../../assets/signin/image.png"
import {getIsDuplicatedId, userLogin} from "@/api/user-api"

export function SimpleRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hoverPassword, setHoverPassword] = useState(false)
  const [hoverConfirmPassword, setHoverConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [id, setId] = useState("") // 상태 추가
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null) // null means no validation yet
  const [role, setRole] = useState<string>("") // Initialize with null or default value

  useEffect(() => {
    setIsIdValid(false)
    checkId()
  }, [role])
  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value)
  }

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value) // Update role based on selected radio button
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
    validatePassword(event.target.value, confirmPassword)
  }

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value)
    validatePassword(password, event.target.value)
  }

  const validatePassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.")
    } else {
      setPasswordError("")
    }
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword)
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault()
  }
  const checkId = async () => {
    console.log(id + " " + role)
    try {
      const response = await getIsDuplicatedId(id, role)
      if (response) {
        const data = await response
        if (data.stateCode === 200) {
          setIsIdValid(true) // ID is available
        } else if (data.stateCode === 409) {
          setIsIdValid(false) // ID is not available
        }
      } else {
        setIsIdValid(null) // Error in response
        alert("서버 응답 오류")
      }
    } catch (error) {
      setIsIdValid(null) // Error in request
      console.error("아이디 확인 중 오류 발생:", error)
    }
  }

  return (
    <Card
      color="transparent"
      shadow={false}
      className="rounded-lg border border-gray-300 p-6"
    >
      <Typography variant="h5" color="blue-gray">
        환영해요 !
      </Typography>
      <Typography className="mt-1 text-3xl font-bold text-primary-m1">
        minimoneymanymo
      </Typography>
      <Typography variant="h6" color="blue-gray">
        에 회원가입을 해보아요
      </Typography>
      <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <Typography variant="h6" color="blue-gray" className="-mb-3">
            아이디
          </Typography>
          <div style={{display: "flex", flexDirection: "column"}}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              value={id}
              onChange={handleIdChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" style={{marginRight: "-8px"}}>
                    <Button
                      onClick={checkId}
                      className="rounded-lg bg-primary-m1 text-white"
                      style={{
                        minWidth: "auto",
                        padding: "0 8px",
                        height: "32px",
                      }}
                    >
                      중복확인
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "4px",
              }}
            >
              {isIdValid === true && (
                <Typography style={{color: "green"}}>
                  사용 가능한 아이디입니다.
                </Typography>
              )}
              {isIdValid === false && (
                <Typography style={{color: "red"}}>
                  사용 불가능한 아이디입니다.
                </Typography>
              )}
            </div>
          </div>

          <Typography variant="h6" color="blue-gray" className="-mb-3">
            비밀번호
          </Typography>
          <TextField
            type={hoverPassword ? "text" : showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            size="small"
            placeholder="********"
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

          <Typography variant="h6" color="blue-gray" className="-mb-3">
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
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
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
          {passwordError && (
            <Typography color="red" className="mt-1">
              {passwordError}
            </Typography>
          )}
          <>
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              전화번호(PASS인증)
              <Button
                className="ml-2 p-0" // 이미지와 버튼 간의 간격 조절
                style={{minWidth: "auto", padding: 0}} // 버튼의 최소 너비와 패딩 설정
              >
                <img src={passLogo} alt="Logo" className="h-9 w-9" />{" "}
                {/* 버튼 안에 이미지 추가 및 크기 설정 */}
              </Button>
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="pass인증을 진행해 주세요!"
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              InputProps={{readOnly: true}} // 사용자 입력을 방지
            />
          </>

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
                      checked={role === "0"}
                      onChange={handleRoleChange}
                      ripple={false}
                      className="hover:before:opacity-0"
                      containerProps={{className: "p-0"}}
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
                      checked={role === "1"}
                      onChange={handleRoleChange}
                      ripple={false}
                      className="hover:before:opacity-0"
                      containerProps={{className: "p-0"}}
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

          {role === "1" && (
            <>
              <Typography variant="h6" color="blue-gray" className="-mb-3">
                부모님 번호를 입력해 주세요
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="010-0000-0000"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              />
              <Typography variant="h6" color="blue-gray" className="-mb-3">
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
        </Typography>
      </form>
    </Card>
  )
}

export default SimpleRegistrationForm
