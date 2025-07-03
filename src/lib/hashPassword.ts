import bcrypt from 'bcryptjs';

// Hash the password
const  hashedPassword = (password: string) => bcrypt.hash(password, 10)


// Compare entered password with stored password
 const  checkPassword = (enteredPassword: string, user: string) => bcrypt.compare(enteredPassword, user)

export { hashedPassword, checkPassword};