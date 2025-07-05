import bcrypt from 'bcryptjs';

// Hash the password
const  hashpassword = (password: string) => bcrypt.hash(password, 10)


// Compare entered password with stored password
 const  checkPassword = (enteredPassword: string, userPassword: string) => bcrypt.compare(enteredPassword, userPassword)

export { hashpassword, checkPassword};