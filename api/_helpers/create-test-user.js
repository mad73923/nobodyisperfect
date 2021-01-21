const bcrypt = require('bcryptjs');
const db = require('./db');
const Role = require('./role');

module.exports = createTestUser;

async function createTestUser() {
    // create test user if the db is empty
    if ((await db.User.countDocuments({})) === 0) {
        if("ADMIN_PASSWORD" in process.env){
            var newUser = {
                firstName: 'Test',
                lastName: 'User',
                username: 'nobodyisadmin',
                passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
                role: [Role.Admin]
            }
            await db.User(newUser).save();
        }else{
            // test environment
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
            newUser.username = 'testgame';
            newUser.role = [Role.GameMaster];
            await db.User(newUser).save();
        }
    }
}
