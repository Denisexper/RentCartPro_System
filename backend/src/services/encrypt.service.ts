import bcrypt from "bcrypt"

export class EncryptService {

    //hashear password
    static async hashPassword (password: string): Promise<string>{
        
        const salt = await bcrypt.genSalt(10);
        const haspassword = await bcrypt.hash(password, salt);
        return haspassword;
    }

    static async comparePassword(password: string, hash: string): Promise<boolean>{

        const comparePassword = await bcrypt.compare(password, hash);
        return comparePassword;
    }
}