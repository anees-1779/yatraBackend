import otpGeneator from "otp-generator"

export const generateOtp = () =>{
    const opt = otpGeneator.generate(6, {
                            upperCaseAlphabets: true,
                            specialChars:true})
    return opt;
}