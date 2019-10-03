const fs = require('fs');

const SOURCE_MAP_TAG_PATTERN = /^(\/\/|\/*)# sourceMappingURL=/mg;

// const fsPromises = fs.promises;
// async function eliminateAsync() {
//     await Promise.all(glob.sync(path.join(__dirname, 'node_modules') + '/**/*.js').map(filePath => new Promise(async (res, rej) => {
//         try {
//             let content = await fsPromises.readFile(filePath, 'utf8');
//             if (!SOURCE_MAP_TAG_PATTERN.test(content)) {
//                 res();
//                 return;
//             }
//             content = content.replace(SOURCE_MAP_TAG_PATTERN, '$1---');
//             console.log(`Source map eliminated in '${filePath}'`);
//             await fsPromises.writeFile(filePath, content);
//             res();
//         } catch (e) {
//             if (e.code === 'EISDIR') {
//                 console.log(`А вот это папка: ${filePath}`);
//                 res();
//             } else {
//                 rej(e);
//             }
//         }
//     })));
// }

// console.time('async');
// eliminateAsync().then(() => console.timeEnd('async'), err => console.error(err));

console.time('sync');
glob.sync(path.join(__dirname, 'node_modules') + '/**/*.js').forEach(filePath => {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (!SOURCE_MAP_TAG_PATTERN.test(content)) return;
        content = content.replace(SOURCE_MAP_TAG_PATTERN, '$1---');
        console.log(`Source map eliminated in '${filePath}'`);
        fs.writeFileSync(filePath, content);
    } catch (e) {
        if (e.code === 'EISDIR') {
            console.log(`А вот это папка: ${filePath}`);
        } else {
            throw e;
        }
    }
});
console.timeEnd('sync');
