import Swal from "sweetalert2"

export const alertBasic = (icon: string, content: string) => {
  const html = `<div class="flex flex-col justify-center items-center my-8 space-y-5">
        <img class="size-32" src="/images/${icon}" alt="error"/>
        <span class="text-xl font-bold">${content} </span>
      </div>`
  // AlertProps 타입을 사용
  Swal.fire({
    position: "center",
    html: `${html}`, // content 사용
    // title: "아이디, 비밀번호가 일치하지 않습니다",
    showConfirmButton: false,
    timer: 1500,
    // icon: "error",
    customClass: {
      title: "text-xl", // Tailwind로 title에 작은 글씨 크기 적용
      popup: "p-4", // 전체 팝업에 패딩 추가 (선택 사항)
    },
  })
}
export const alertWarning = (content: string) => {
  // AlertProps 타입을 사용
  Swal.fire({
    position: "center",
    text: content,
    // title: "아이디, 비밀번호가 일치하지 않습니다",
    showConfirmButton: false,
    timer: 1500,
    icon: "error",
    customClass: {
      title: "text-xl", // Tailwind로 title에 작은 글씨 크기 적용
      popup: "p-4", // 전체 팝업에 패딩 추가 (선택 사항)
    },
  })
}
