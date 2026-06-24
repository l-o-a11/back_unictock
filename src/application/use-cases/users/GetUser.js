// application/use-cases/users/GetUser.js
class GetUser {
    constructor(userRepository) { this.repo = userRepository; }

    async execute(filters = {}) {
        const users = await this.repo.findAll(filters);
        return users.map((u) => u.toPublic());
    }
}

module.exports = GetUser;