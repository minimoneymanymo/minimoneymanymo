import { useState } from "react"
import { Card, Button, Typography } from "@material-tailwind/react"
import { Visibility, VisibilityOff, Check } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"
import { getIsDuplicatedId, signUp, checkAuthCode } from "@/api/user-api"
import { useNavigate } from "react-router-dom"
import { registerMemberApi, searchMemberApi } from "@/api/account-api"
import { useAppDispatch } from "@/store/hooks"
import { parentActions } from "@/store/slice/parent"
import Swal from "sweetalert2"

export function SimpleRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hoverPassword, setHoverPassword] = useState(false)
  const [hoverConfirmPassword, setHoverConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [id, setId] = useState("") // 상태 추가
  const [authNum, setAuthNum] = useState("") // 상태 추가
  const [isIdValid, setIsIdValid] = useState<boolean | null>(null) // null means no validation yet
  const [isAuthValid, setIsAuthValid] = useState<boolean | null>(null) // null means no validation yet
  const [role, setRole] = useState(0) // Initialize with null or default value
  const [isDuple, setIsDuple] = useState<boolean | null>(null) // null means no validation yet
  const [userName, setUserName] = useState("") // userName 상태 변수 선언
  const [birthDay, setBirthDay] = useState("") // 생일 상태 변수
  const [parentsNumber, setParentsNumber] = useState("") // 부모 번호 상태 변수
  const [phoneNumber, setPhoneNumber] = useState("") // 전화번호 상태 변수
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setId(event.target.value)
    setIsAuthValid(false)
    setIsIdValid(false)
  }

  const handleRoleChange = (event: number) => {
    setRole(event) // Update role based on selected radio button
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
  const handleCheckId = async () => {
    const result = await getIsDuplicatedId(id) // API 호출

    // 상태 코드에 따라 처리
    if (result.stateCode === 200) {
      setIsIdValid(true) // ID is available
      setIsDuple(false)
    } else if (result.stateCode === 409) {
      setIsIdValid(false) // ID is not available
      setIsDuple(true)
      //alert(result.message) // 이미 사용 중인 이메일 메시지 표시
      Swal.fire({
        title: "사용중인 이메일입니다",
        text: "다른 이메일을 사용해 주세요",
        icon: "warning",
      })
    } else {
      //alert("서버 오류 발생: " + result.message) // 기타 오류 메시지 표시
      Swal.fire({
        icon: "error",
        title: `서버 오류 발생 : ${result.message}`,
        text: "Something went wrong!",
      })
    }
  }
  const handleCheckAuthCode = async () => {
    const result = await checkAuthCode(id, authNum) // 이메일과 인증 코드 전달
    if (result.stateCode === 200) {
      console.log("인증 코드가 확인되었습니다.") // 인증 성공 메시지
      setIsAuthValid(true)
    } else if (result.stateCode === 400) {
      console.log("인증 코드가 잘못되었습니다.") // 인증 실패 메시지
    } else {
      //alert("서버 오류 발생: " + result.message) // 오류 메시지 표시
      Swal.fire({
        icon: "error",
        title: `서버 오류 발생 : ${result.message}`,
        text: "Something went wrong!",
      })
    }
  }

  const handleAuthNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAuthNum(e.target.value)
  }
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^010-\d{4}-\d{4}$/ // 한국형 전화번호 형식 검사 (010-0000-0000)
    return phoneRegex.test(phone)
  }
  const handleSignUp = async () => {
    if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
      Swal.fire({
        title: "전화번호 형식이 맞지 않습니다.",
        icon: "warning",
      })
      return
    }
    if (role === 1 && birthDay.length != 6) {
      Swal.fire({
        title: "생일 형식이 맞지 않습니다.",
        icon: "warning",
      })
      return
    }
    if (role === 1 && parentsNumber && !validatePhoneNumber(parentsNumber)) {
      Swal.fire({
        title: "부모 전화번호 형식이 맞지 않습니다.",
        icon: "warning",
      })
      return
    }

    let userKey = await registerMemberApi(id) //금융 api
    if (userKey == null) {
      userKey = await searchMemberApi(id)
    }
    if (userKey != null) {
      try {
        const result = await signUp(
          id,
          password,
          userName,
          role.toString(),
          userKey,
          phoneNumber,
          birthDay,
          parentsNumber
        )
        console.log(result)
        if (result.stateCode === 201) {
          console.log("회원가입 성공")
          dispatch(parentActions.setUserKey(userKey))
          navigate("/main") // main으로 navigate
        } else if (result.stateCode === 400) {
          Swal.fire({
            title: `번호가 일치하는 부모가 없습니다`,
            icon: "warning",
          })
        }
      } catch (e: any) {
        Swal.fire({
          title: `${e.message}`,
          icon: "error",
        })
      }

      // userKey 제외한 회원가입 테스트 시 위 코드 주석처리하고 하단 코드 주석 풀어서 테스트하시면 돼요!
      // const result = await signUp(
      //   id,
      //   password,
      //   userName,
      //   role,
      //   "userKey",
      //   phoneNumber,
      //   birthDay,
      //   parentsNumber
      // ) // 이메일과 인증 코드 전달
      // console.log(result)
      // if (result.stateCode === 201) {
      //   console.log("회원가입 성공")
      //   navigate("/") // main으로 navigate
      // } else {
      //   console.log("회원가입 실패")
      // }
    }
  }

  return (
    <Card
      color="transparent"
      shadow={false}
      className="rounded-lg border border-gray-300 p-6"
    >
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
      <form className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96">
        <div className="mb-1 flex flex-col gap-6">
          <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
            아이디{" "}
            {isAuthValid && (
              <Check style={{ color: "green", marginLeft: "8px" }} />
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="example@example.com"
              size="small"
              value={id}
              onChange={handleIdChange}
              className="!border-t-blue-gray-200 focus:!border-t-gray-900"
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    style={{ marginRight: "-8px" }}
                  >
                    <Button
                      onClick={handleCheckId}
                      className="rounded-lg bg-secondary-m2 text-white"
                      style={{
                        minWidth: "auto",
                        padding: "0 8px",
                        height: "32px",
                      }}
                    >
                      메일 인증
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
              {isIdValid && (
                <>
                  <div
                    style={{
                      color: "green",
                      marginBottom: "5px",
                      width: "340px",
                      marginTop: "3px",
                    }}
                  >
                    메일이 발송되었습니다.
                    <br />
                    인증코드를 입력하세요.
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      size="small"
                      value={authNum} // authNum으로 변경
                      onChange={handleAuthNumChange}
                      className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            style={{ marginRight: "-8px" }}
                          >
                            <Button
                              onClick={handleCheckAuthCode}
                              className="rounded-lg bg-secondary-m2 text-white"
                              style={{
                                minWidth: "auto",
                                padding: "0 8px",
                                height: "32px",
                              }}
                            >
                              인증
                            </Button>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </>
              )}
              {isDuple === true && (
                <>
                  <Typography style={{ color: "red" }}>
                    사용 불가능한 아이디입니다.
                  </Typography>
                </>
              )}
            </div>
          </div>

          <div className="text-blue-gray-700 -mb-3 text-lg font-bold">이름</div>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="홍길동"
            size="small"
            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
            value={userName} // 상태 변수로 현재 값 설정
            onChange={(e) => setUserName(e.target.value)} // 입력값 변경 시 핸들러 호출
          />
          <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
            전화번호
          </div>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="010-0000-0000"
            size="small"
            className="!border-t-blue-gray-200 focus:!border-t-blue-gray-900"
            value={phoneNumber} // phoneNumber 상태 변수로 설정
            onChange={(e) => setPhoneNumber(e.target.value)} // 전화번호 입력 시 상태 업데이트
          />
          <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
            비밀번호
          </div>

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

          <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
            비밀번호 확인
          </div>
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
                    sx={{ padding: 0 }} // Remove extra padding
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

          {role === 1 && (
            <>
              <div className="text-blue-gray-700 -mb-7 text-lg font-bold">
                부모님 번호
              </div>
              <div className="-mb-3">
                부모 확인용으로 사용됩니다. 올바른 번호를 입력해주세요.
              </div>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="010-0000-0000"
                size="small"
                className="!border-t-blue-gray-200 focus:!border-t-blue-gray-900"
                value={parentsNumber} // parentsNumber 상태 변수로 설정
                onChange={(e) => setParentsNumber(e.target.value)} // 부모 번호 입력 시 상태 업데이트
              />
              <div className="text-blue-gray-700 -mb-3 text-lg font-bold">
                생일
              </div>

              <TextField
                fullWidth
                variant="outlined"
                placeholder="YYMMDD"
                size="small"
                className="!border-t-blue-gray-200 focus:!border-t-blue-gray-900"
                value={birthDay} // birthDay 상태 변수로 설정
                onChange={(e) => setBirthDay(e.target.value)} // 생일 입력 시 상태 업데이트
              />
            </>
          )}
        </div>
        <button
          className={`mt-6 flex w-full justify-center rounded-lg p-2 text-lg text-white ${
            !isAuthValid ||
            passwordError !== "" ||
            password.trim() === "" ||
            userName.length === 0
              ? "cursor-not-allowed bg-secondary-200" // 비활성화 시 스타일
              : "cursor-pointer bg-secondary-m2" // 활성화 시 스타일
          }`}
          onClick={handleSignUp}
          disabled={
            !isAuthValid ||
            passwordError !== "" ||
            password.trim() === "" ||
            userName.length === 0
          }
        >
          회원가입
        </button>
      </form>
    </Card>
  )
}

export default SimpleRegistrationForm
