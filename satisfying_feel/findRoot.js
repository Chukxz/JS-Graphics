const path = require('path');

function findRootDirectory(currentDir) {
    const isRoot = (dir) => dir === path.parse(dir).root;
    let currentPath = path.resolve(currentDir);

    while (!isRoot(currentPath)) {
        const packageJsonPath = path.join(currentPath, 'package.json');

        // Check if package.json exists in the current directory
        if (require('fs').existsSync(packageJsonPath)) {
            return currentPath;
        }

        // Move one directory up
        currentPath = path.dirname(currentPath);
    }

    // If we reach the root and haven't found a package.json, return null or handle accordingly
    return null;
}

// Call the function with the current directory of your script
const rootDirectory = findRootDirectory(__dirname);

if (rootDirectory) {
    console.log('Root directory:', rootDirectory);
} else {
    console.log('No root directory found.');
}