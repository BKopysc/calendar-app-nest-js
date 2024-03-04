export class CreateUserHashedDto {
    constructor(
        public username: string,
        public password: string,
    ) {
    }
}