const emailExpression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export class Validators {
    static isValidEmail(email: string) {
        return emailExpression.test(email);
    }

    static isValidDescription(description: string) {
        return description.length <= 100
    }
} 