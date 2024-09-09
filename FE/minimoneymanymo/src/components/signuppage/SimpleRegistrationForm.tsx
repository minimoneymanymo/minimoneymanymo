import { useState } from 'react';
import { Card, Checkbox, Button, Typography } from "@material-tailwind/react";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import passLogo from '../../assets/signin/image.png';

export function SimpleRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPhonePassword, setShowPhonePassword] = useState(false);
  const [hoverPassword, setHoverPassword] = useState(false);
  const [hoverConfirmPassword, setHoverConfirmPassword] = useState(false);
  const [hoverPhonePassword, setHoverPhonePassword] = useState(false);

  const [placeholderText, setPlaceholderText] = useState('pass인증을 진행해 주세요!'); // 상태로 placeholder 관리

  // 조건에 따라 placeholder를 변경하는 함수 (예시)
  const updatePlaceholder = (newPlaceholder: string) => {
    setPlaceholderText(newPlaceholder);
  };



  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleClickShowPhonePassword = () => setShowPhonePassword(!showPhonePassword);
  const handleMouseDownPassword = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <Card color="transparent" shadow={false} className="p-6 rounded-lg border border-gray-300">
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
            type={hoverPassword ? 'text' : (showPassword ? 'text' : 'password')}
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
                    sx={{ padding: 0 }} // Remove extra padding
                  >
                    {showPassword || hoverPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="h7" color="blue-gray" className="-mb-3">
            비밀번호 확인
          </Typography>
          <TextField
            type={hoverConfirmPassword ? 'text' : (showConfirmPassword ? 'text' : 'password')}
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
                    sx={{ padding: 0 }} // Remove extra padding
                  >
                    {showConfirmPassword || hoverConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="h7" color="blue-gray" className="-mb-3">
            전화번호(PASS인증)           
                <Button
                className="ml-2 p-0" // 이미지와 버튼 간의 간격 조절
                style={{ minWidth: 'auto', padding: 0 }} // 버튼의 최소 너비와 패딩 설정
              >
                <img src={passLogo} alt="Logo" className="w-9 h-9 " /> {/* 버튼 안에 이미지 추가 및 크기 설정 */}
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

        </div>
        <Checkbox
          label={
            <Typography
              variant="small"
              color="gray"
              className="flex items-center font-normal"
            >
              I agree the
              <a
                href="#"
                className="font-medium transition-colors hover:text-gray-900"
              >
                &nbsp;Terms and Conditions
              </a>
            </Typography>
          }
          containerProps={{ className: "-ml-2.5" }}
        />
        <Button className="mt-6" fullWidth>
          Sign Up
        </Button>
        <Typography color="gray" className="mt-4 text-center font-normal">
          Already have an account?{" "}
          <a href="#" className="font-medium text-gray-900">
            Sign In
          </a>
        </Typography>
      </form>
    </Card>
  );
}

export default SimpleRegistrationForm;
