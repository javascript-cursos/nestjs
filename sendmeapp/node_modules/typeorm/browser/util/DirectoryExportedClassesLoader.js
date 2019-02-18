import { PlatformTools } from "../platform/PlatformTools";
import { EntitySchema } from "../index";
/**
 * Loads all exported classes from the given directory.
 */
export function importClassesFromDirectories(directories, formats) {
    if (formats === void 0) { formats = [".js", ".ts"]; }
    function loadFileClasses(exported, allLoaded) {
        if (typeof exported === "function" || exported instanceof EntitySchema) {
            allLoaded.push(exported);
        }
        else if (Array.isArray(exported)) {
            exported.forEach(function (i) { return loadFileClasses(i, allLoaded); });
        }
        else if (typeof exported === "object" && exported !== null) {
            Object.keys(exported).forEach(function (key) { return loadFileClasses(exported[key], allLoaded); });
        }
        return allLoaded;
    }
    var allFiles = directories.reduce(function (allDirs, dir) {
        return allDirs.concat(PlatformTools.load("glob").sync(PlatformTools.pathNormalize(dir)));
    }, []);
    var dirs = allFiles
        .filter(function (file) {
        var dtsExtension = file.substring(file.length - 5, file.length);
        return formats.indexOf(PlatformTools.pathExtname(file)) !== -1 && dtsExtension !== ".d.ts";
    })
        .map(function (file) { return PlatformTools.load(PlatformTools.pathResolve(file)); });
    return loadFileClasses(dirs, []);
}
/**
 * Loads all json files from the given directory.
 */
export function importJsonsFromDirectories(directories, format) {
    if (format === void 0) { format = ".json"; }
    var allFiles = directories.reduce(function (allDirs, dir) {
        return allDirs.concat(PlatformTools.load("glob").sync(PlatformTools.pathNormalize(dir)));
    }, []);
    return allFiles
        .filter(function (file) { return PlatformTools.pathExtname(file) === format; })
        .map(function (file) { return PlatformTools.load(PlatformTools.pathResolve(file)); });
}

//# sourceMappingURL=DirectoryExportedClassesLoader.js.map
