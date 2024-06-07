import React, { SVGProps } from "react";

// prettier-ignore
const icons = {
    questionCircle: ["M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM10 6.25C8.96447 6.25 8.125 7.08947 8.125 8.125V8.75H5.625V8.125C5.625 5.70875 7.58375 3.75 10 3.75C12.4162 3.75 14.375 5.70875 14.375 8.125C14.375 10.5412 12.4162 12.5 10 12.5H8.75V10H10C11.0355 10 11.875 9.16053 11.875 8.125C11.875 7.08947 11.0355 6.25 10 6.25ZM11.25 13.75V16.25H8.75V13.75H11.25Z"],
    alertCircle: ["M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM8.75 11.25V3.75H11.25V11.25H8.75ZM8.75 16.25V13.75H11.25V16.25H8.75Z"],
    checkCircle: ["M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM15.8839 7.13388L14.1161 5.36612L8.125 11.3572L5.88388 9.11612L4.11612 10.8839L8.125 14.8928L15.8839 7.13388Z"],
    plusCircle: ["M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM8.75 8.75V5H11.25V8.75H15V11.25H11.25V15H8.75V11.25H5V8.75H8.75Z"],
    xCircle: ["M10 20C15.5228 20 20 15.5228 20 10C20 4.47715 15.5228 0 10 0C4.47715 0 0 4.47715 0 10C0 15.5228 4.47715 20 10 20ZM5.36612 7.13388L8.23223 10L5.36612 12.8661L7.13388 14.6339L10 11.7678L12.8661 14.6339L14.6339 12.8661L11.7678 10L14.6339 7.13388L12.8661 5.36612L10 8.23223L7.13388 5.36612L5.36612 7.13388Z"],
    infoCircle: ["M 20 10 C 20 15.523438 15.523438 20 10 20 C 4.476562 20 0 15.523438 0 10 C 0 4.476562 4.476562 0 10 0 C 15.523438 0 20 4.476562 20 10 Z M 8.75 10 L 7.5 10 L 7.5 7.5 L 11.25 7.5 L 11.25 13.75 L 12.5 13.75 L 12.5 16.25 L 8.75 16.25 Z M 11.25 6.25 L 11.25 3.75 L 8.75 3.75 L 8.75 6.25 Z M 11.25 6.25"],
    x: ["M6.46466 10.0001L0.732422 4.26783L4.26796 0.7323L10.0002 6.46453L15.7324 0.7323L19.268 4.26783L13.5357 10.0001L19.268 15.7323L15.7324 19.2678L10.0002 13.5356L4.26796 19.2678L0.732422 15.7323L6.46466 10.0001Z"],
    repeat: ["M12.5 10H11.25V6.02476L6.4466 5.06407C6.23354 5.02146 6.01679 5 5.79951 5C3.97724 5 2.5 6.47724 2.5 8.29951V11.25H0V8.29951C0 5.09653 2.59653 2.5 5.79951 2.5C6.18142 2.5 6.56239 2.53772 6.93689 2.61262L11.25 3.47525V0H12.5L17.5 5L12.5 10Z", "M20 8.75V11.7005C20 14.9035 17.4035 17.5 14.2005 17.5C13.8186 17.5 13.4376 17.4623 13.0631 17.3874L8.75 16.5248V20H7.5L2.5 15L7.5 10H8.75V13.9752L13.5534 14.9359C13.7665 14.9785 13.9832 15 14.2005 15C16.0228 15 17.5 13.5228 17.5 11.7005V8.75H20Z"],
    more: ["M12.5 10C12.5 11.3807 11.3807 12.5 10 12.5C8.61929 12.5 7.5 11.3807 7.5 10C7.5 8.61929 8.61929 7.5 10 7.5C11.3807 7.5 12.5 8.61929 12.5 10Z", "M5 10C5 11.3807 3.88071 12.5 2.5 12.5C1.11929 12.5 0 11.3807 0 10C0 8.61929 1.11929 7.5 2.5 7.5C3.88071 7.5 5 8.61929 5 10Z", "M20 10C20 11.3807 18.8807 12.5 17.5 12.5C16.1193 12.5 15 11.3807 15 10C15 8.61929 16.1193 7.5 17.5 7.5C18.8807 7.5 20 8.61929 20 10Z"],
    chevronDown: ["M 12.105469 8.957031 C 12.757812 8.332031 13.355469 7.6875 13.894531 7.019531 L 14.105469 7.25 L 14.4375 7.582031 C 14.464844 7.609375 14.5 7.644531 14.542969 7.6875 C 14.582031 7.730469 14.640625 7.785156 14.707031 7.855469 C 14.777344 7.921875 14.875 8.019531 15 8.144531 C 15.109375 8.269531 15.257812 8.4375 15.4375 8.644531 L 15.417969 8.667969 C 14.984375 9.082031 14.578125 9.519531 14.1875 9.980469 C 13.785156 10.421875 13.375 10.867188 12.957031 11.3125 C 12.542969 11.757812 12.109375 12.203125 11.667969 12.644531 C 11.222656 13.089844 10.734375 13.507812 10.207031 13.894531 C 9.875 13.632812 9.542969 13.339844 9.207031 13.019531 C 8.859375 12.703125 8.515625 12.367188 8.167969 12.019531 C 7.804688 11.671875 7.453125 11.328125 7.105469 10.980469 C 6.742188 10.632812 6.394531 10.296875 6.0625 9.980469 C 5.839844 9.769531 5.632812 9.570312 5.4375 9.375 C 5.230469 9.179688 5.027344 8.984375 4.832031 8.792969 C 4.902344 8.667969 5.007812 8.542969 5.144531 8.417969 C 5.269531 8.292969 5.402344 8.160156 5.542969 8.019531 C 5.679688 7.882812 5.820312 7.742188 5.957031 7.605469 C 6.082031 7.464844 6.1875 7.332031 6.269531 7.207031 C 6.535156 7.417969 6.828125 7.671875 7.144531 7.980469 C 7.464844 8.285156 7.804688 8.609375 8.167969 8.957031 C 8.515625 9.292969 8.867188 9.632812 9.230469 9.980469 C 9.589844 10.3125 9.9375 10.609375 10.269531 10.875 C 10.839844 10.222656 11.453125 9.582031 12.105469 8.957031 Z M 12.105469 8.957031"],
    pending: ["M 10 1.875 C 5.511719 1.875 1.875 5.511719 1.875 10 C 1.875 14.488281 5.511719 18.125 10 18.125 L 10 16.09375 C 8.792969 16.09375 7.617188 15.734375 6.613281 15.066406 C 5.613281 14.394531 4.832031 13.445312 4.371094 12.332031 C 3.910156 11.21875 3.789062 9.992188 4.023438 8.8125 C 4.261719 7.628906 4.839844 6.542969 5.691406 5.691406 C 6.542969 4.839844 7.628906 4.257812 8.8125 4.023438 C 9.996094 3.789062 11.21875 3.910156 12.332031 4.371094 C 13.445312 4.832031 14.398438 5.613281 15.066406 6.613281 C 15.738281 7.617188 16.09375 8.792969 16.09375 10 L 18.125 10 C 18.125 5.511719 14.488281 1.875 10 1.875 Z M 10 1.875"],
    plus: ["M12.5 1.25H7.5V7.5L1.25 7.5V12.5H7.5V18.75H12.5V12.5H18.75V7.5L12.5 7.5V1.25Z"],
    lightning: ["M10.0417 7.95768L11.0833 0.666016H9L2.75 7.95768V10.041H7.95833L6.91667 17.3327H9L15.25 10.041L15.25 7.95768H10.0417Z"]
};

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: keyof typeof icons;
  size: number;
}

export default function Icon({ icon, size, ...props }: IconProps) {
  return (
    <svg height={size} width={size} viewBox={`0 0 20 20`} {...props} xmlns="http://www.w3.org/2000/svg">
      {icons[icon].map((d, i) => (
        <path d={d} height={size} width={size} key={i} fillRule="evenodd" clipRule="evenodd" />
      ))}
    </svg>
  );
}
