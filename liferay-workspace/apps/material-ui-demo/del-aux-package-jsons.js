const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PACKAGES_TO_DECIMATE = [
    '@material-ui/core',
    '@material-ui/styles',
];

const packageDirs = PACKAGES_TO_DECIMATE.map(package => path.dirname(require.resolve(`${package}/package.json`)));
packageDirs.forEach(packageDir => {
    const packageJsons = glob.sync(`${packageDir}/*/**/package.json`);
    packageJsons.forEach(packageJson => {
        fs.unlinkSync(packageJson);
    });
});
