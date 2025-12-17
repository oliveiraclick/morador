
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const constantsPath = path.join(__dirname, '../lib/constants.ts');

try {
    // 1. Read the constants file
    let content = fs.readFileSync(constantsPath, 'utf8');

    // 2. Extract current version
    const versionMatch = content.match(/APP_VERSION = '(\d+\.\d+)'/);

    if (!versionMatch) {
        console.error('❌ Could not find APP_VERSION in lib/constants.ts');
        process.exit(1);
    }

    const currentVersion = parseFloat(versionMatch[1]);
    const newVersion = (currentVersion + 0.01).toFixed(2);

    console.log(`Resource: Upgrading from v${currentVersion} to v${newVersion}...`);

    // 3. Update the file
    const newContent = content.replace(
        `APP_VERSION = '${versionMatch[1]}'`,
        `APP_VERSION = '${newVersion}'`
    );

    fs.writeFileSync(constantsPath, newContent);

    // 4. Git commands
    console.log('📦 Committing and Pushing...');

    try {
        execSync(`git add lib/constants.ts`);
        execSync(`git commit -m "chore: bump version to ${newVersion}"`);
        execSync(`git push origin master`);
        console.log(`✅ Success! Version v${newVersion} is live.`);
    } catch (gitError) {
        console.error('❌ Git automations failed. Please push manually.', gitError.message);
    }

} catch (err) {
    console.error('❌ Script failed:', err);
    process.exit(1);
}
