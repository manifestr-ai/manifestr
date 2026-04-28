import { useState } from "react";
import { Key } from "lucide-react";
import Button from "../ui/Button";
import Input from "../forms/Input";

export default function Step1({ onNext }) {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email is required";
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    // Move to step 2
    setErrors({});
    onNext(email);
  };

  return (
    <>
      {/* Key Icon */}
      <div className="w-10 h-10 border border-[#e4e4e7] rounded-md flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
        >
          <g clip-path="url(#clip0_9212_412292)">
            <path
              d="M12.4826 5.66461C12.7051 5.66461 12.8853 5.48435 12.8853 5.262C12.8853 5.03964 12.7051 4.85938 12.4826 4.85938C12.2603 4.85938 12.0801 5.03964 12.0801 5.262C12.0801 5.48435 12.2603 5.66461 12.4826 5.66461Z"
              fill="#18181B"
            />
            <path
              d="M0.806641 13.7193V16.135C0.806641 16.6181 1.12873 16.9402 1.61187 16.9402H4.83283V14.5245H7.24854V12.1088H8.85901L9.98634 10.9815C11.1055 11.3713 12.3238 11.3698 13.442 10.9772C14.5601 10.5846 15.512 9.82418 16.1419 8.82031C16.7717 7.81642 17.0421 6.6285 16.9091 5.45089C16.7759 4.27329 16.2472 3.17571 15.4091 2.33771C14.5712 1.49972 13.4736 0.970916 12.296 0.837812C11.1183 0.70471 9.93049 0.975187 8.92655 1.605C7.92265 2.23482 7.16221 3.18667 6.76962 4.30487C6.37703 5.42305 6.37554 6.64137 6.7654 7.76052L0.806641 13.7193Z"
              stroke="#52525B"
              stroke-width="1.61369"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12.4826 5.66461C12.7051 5.66461 12.8853 5.48435 12.8853 5.262C12.8853 5.03964 12.7051 4.85938 12.4826 4.85938C12.2603 4.85938 12.0801 5.03964 12.0801 5.262C12.0801 5.48435 12.2603 5.66461 12.4826 5.66461Z"
              stroke="#52525B"
              stroke-width="1.61369"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>
          <defs>
            <clipPath id="clip0_9212_412292">
              <rect width="18.3594" height="18.3594" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Title and Subtitle */}
      <div className="flex flex-col gap-3 items-center text-center w-full">
        <h1 className="text-[24px] leading-[32px] font-semibold text-[#09090b] font-hero">
          Forgot Password?
        </h1>
        <p className="text-[#71717B] text-center font-inter text-base font-normal leading-6">
          Enter your email address to receive a password reset code
        </p>
   
      </div>

      {/* Email Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
        <Input
          label="Email address"
          type="email"
          placeholder="your@email.com"
          helperText={
            !touched || !errors.email
              ? "We'll send a reset code to this email"
              : undefined
          }
          error={touched && errors.email ? errors.email : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched && errors.email) {
              const newErrors = { ...errors };
              delete newErrors.email;
              setErrors(newErrors);
            }
          }}
          required
        />

        {/* Next Button */}
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          disabled={!email}
        >
          Next
        </Button>
      </form>
    </>
  );
}
