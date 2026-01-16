const fs = require('fs');
const content = `DATABASE_URL="mysql://root:@127.0.0.1:3306/chipset_computer"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="f3a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z"
`;
fs.writeFileSync('.env', content);
console.log('.env updated');
