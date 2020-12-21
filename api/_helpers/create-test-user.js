const bcrypt = require('bcryptjs');
const db = require('./db');
const Role = require('./role');

module.exports = createTestUser;

async function createTestUser() {
    // create test user if the db is empty
    if ((await db.User.countDocuments({})) === 0) {
        var newUser = {
            firstName: 'Test',
            lastName: 'User',
            username: 'testadmin',
            passwordHash: bcrypt.hashSync('test', 10),
            role: [Role.Admin]
        }
        await db.User(newUser).save();
        newUser.username = 'testuser';
        newUser.role = [Role.User];
        await db.User(newUser).save();
    }
}
