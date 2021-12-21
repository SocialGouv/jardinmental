const semver = require('semver');
const fs = require('fs');

let release = process.argv[2] || 'bump';
const validRelease = ['minor', 'major', 'patch', 'bump'];
if (!validRelease.includes(release)) {
  console.error('😢 invalid release, must be ' + validRelease.join(', '));
  process.exit(1);
}

// android and ios have different versions because
// we fucked up with ios at the beginning of the project
// and there is no way to fix a fuck up with app versions in apple environment
const currentBuildNumber = require('./app.json').version.buildNumber; // ex: 2.1.1
const currentBuildName = require('./app.json').version.buildName; // ex: 127

const newBuildNumber = currentBuildNumber + 1;
const newBuildName =
  release !== 'bump' ? semver.inc(currentBuildName, release) : currentBuildName;

// Replace the version in the android/app/build.graddle file via regex and save it
const buildGradle = fs.readFileSync('android/app/build.gradle', 'utf8');
let newBuildGradle = buildGradle
  .replace(/versionName "[^"]+"/, `versionName "${newBuildName}"`)
  .replace(/versionCode [^"]+[\n]/, `versionCode ${newBuildNumber}\n`);
fs.writeFileSync('android/app/build.gradle', newBuildGradle);

// Replace the version in the ios/app/build.graddle file via regex and save it
const projectPbxproj = fs.readFileSync(
  'ios/monsuivipsy.xcodeproj/project.pbxproj',
  'utf8',
);
const newProjectPbxproj = projectPbxproj
  .replaceAll(
    /CURRENT_PROJECT_VERSION = [^;]+;/gi,
    `CURRENT_PROJECT_VERSION = ${newBuildNumber};`,
  )
  .replaceAll(
    /MARKETING_VERSION = [^;]+;/gi,
    `MARKETING_VERSION = ${newBuildName};`,
  );
fs.writeFileSync(
  'ios/monsuivipsy.xcodeproj/project.pbxproj',
  newProjectPbxproj,
);

// Replace the version in the package.json file via regex and save it
const packageJson = fs.readFileSync('package.json', 'utf8');
const newPackageJson = packageJson.replace(
  /"version": "[^"]+"/,
  `"version": "${newBuildName}"`,
);
fs.writeFileSync('package.json', newPackageJson);

// Replace the versions in the app.json file via regex and save it
const appJson = fs.readFileSync('app.json', 'utf8');
const newAppJson = appJson
  .replace(/"buildName": "[^"]+"/, `"buildName": "${newBuildName}"`)
  .replace(/"buildNumber": [^"]+,/, `"buildNumber": ${newBuildNumber},`);
fs.writeFileSync('app.json', newAppJson);

// Replace the version in the badge in ../README.md via regex and save it
const readme = fs.readFileSync('./README.md', 'utf8');
const newReadme = readme.replace(
  /version-(\d+\.\d+\.\d+)-blue/,
  `version-${newBuildName}-blue`,
);
fs.writeFileSync('./README.md', newReadme);

console.log('🥳 Bumped version number to ' + newBuildNumber);
if (release !== 'bump') {
  console.log('🥳 Updated version name to ' + newBuildName);
  console.log(
    `chore(version): ${release} - ${currentBuildName} 👉 ${newBuildName}`,
  );
}
