module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInPath = exports.which = exports.mkdirP = exports.rmRF = exports.mv = exports.cp = void 0;
const assert_1 = __webpack_require__(357);
const childProcess = __importStar(__webpack_require__(129));
const path = __importStar(__webpack_require__(622));
const util_1 = __webpack_require__(669);
const ioUtil = __importStar(__webpack_require__(672));
const exec = util_1.promisify(childProcess.exec);
const execFile = util_1.promisify(childProcess.execFile);
/**
 * Copies a file or folder.
 * Based off of shelljs - https://github.com/shelljs/shelljs/blob/9237f66c52e5daa40458f94f9565e18e8132f5a6/src/cp.js
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See CopyOptions.
 */
function cp(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const { force, recursive, copySourceDirectory } = readCopyOptions(options);
        const destStat = (yield ioUtil.exists(dest)) ? yield ioUtil.stat(dest) : null;
        // Dest is an existing file, but not forcing
        if (destStat && destStat.isFile() && !force) {
            return;
        }
        // If dest is an existing directory, should copy inside.
        const newDest = destStat && destStat.isDirectory() && copySourceDirectory
            ? path.join(dest, path.basename(source))
            : dest;
        if (!(yield ioUtil.exists(source))) {
            throw new Error(`no such file or directory: ${source}`);
        }
        const sourceStat = yield ioUtil.stat(source);
        if (sourceStat.isDirectory()) {
            if (!recursive) {
                throw new Error(`Failed to copy. ${source} is a directory, but tried to copy without recursive flag.`);
            }
            else {
                yield cpDirRecursive(source, newDest, 0, force);
            }
        }
        else {
            if (path.relative(source, newDest) === '') {
                // a file cannot be copied to itself
                throw new Error(`'${newDest}' and '${source}' are the same file`);
            }
            yield copyFile(source, newDest, force);
        }
    });
}
exports.cp = cp;
/**
 * Moves a path.
 *
 * @param     source    source path
 * @param     dest      destination path
 * @param     options   optional. See MoveOptions.
 */
function mv(source, dest, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        if (yield ioUtil.exists(dest)) {
            let destExists = true;
            if (yield ioUtil.isDirectory(dest)) {
                // If dest is directory copy src into dest
                dest = path.join(dest, path.basename(source));
                destExists = yield ioUtil.exists(dest);
            }
            if (destExists) {
                if (options.force == null || options.force) {
                    yield rmRF(dest);
                }
                else {
                    throw new Error('Destination already exists');
                }
            }
        }
        yield mkdirP(path.dirname(dest));
        yield ioUtil.rename(source, dest);
    });
}
exports.mv = mv;
/**
 * Remove a path recursively with force
 *
 * @param inputPath path to remove
 */
function rmRF(inputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ioUtil.IS_WINDOWS) {
            // Node doesn't provide a delete operation, only an unlink function. This means that if the file is being used by another
            // program (e.g. antivirus), it won't be deleted. To address this, we shell out the work to rd/del.
            // Check for invalid characters
            // https://docs.microsoft.com/en-us/windows/win32/fileio/naming-a-file
            if (/[*"<>|]/.test(inputPath)) {
                throw new Error('File path must not contain `*`, `"`, `<`, `>` or `|` on Windows');
            }
            try {
                const cmdPath = ioUtil.getCmdPath();
                if (yield ioUtil.isDirectory(inputPath, true)) {
                    yield exec(`${cmdPath} /s /c "rd /s /q "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
                else {
                    yield exec(`${cmdPath} /s /c "del /f /a "%inputPath%""`, {
                        env: { inputPath }
                    });
                }
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
            // Shelling out fails to remove a symlink folder with missing source, this unlink catches that
            try {
                yield ioUtil.unlink(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
            }
        }
        else {
            let isDir = false;
            try {
                isDir = yield ioUtil.isDirectory(inputPath);
            }
            catch (err) {
                // if you try to delete a file that doesn't exist, desired result is achieved
                // other errors are valid
                if (err.code !== 'ENOENT')
                    throw err;
                return;
            }
            if (isDir) {
                yield execFile(`rm`, [`-rf`, `${inputPath}`]);
            }
            else {
                yield ioUtil.unlink(inputPath);
            }
        }
    });
}
exports.rmRF = rmRF;
/**
 * Make a directory.  Creates the full path with folders in between
 * Will throw if it fails
 *
 * @param   fsPath        path to create
 * @returns Promise<void>
 */
function mkdirP(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        assert_1.ok(fsPath, 'a path argument must be provided');
        yield ioUtil.mkdir(fsPath, { recursive: true });
    });
}
exports.mkdirP = mkdirP;
/**
 * Returns path of a tool had the tool actually been invoked.  Resolves via paths.
 * If you check and the tool does not exist, it will throw.
 *
 * @param     tool              name of the tool
 * @param     check             whether to check if tool exists
 * @returns   Promise<string>   path to tool
 */
function which(tool, check) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // recursive when check=true
        if (check) {
            const result = yield which(tool, false);
            if (!result) {
                if (ioUtil.IS_WINDOWS) {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`);
                }
                else {
                    throw new Error(`Unable to locate executable file: ${tool}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`);
                }
            }
            return result;
        }
        const matches = yield findInPath(tool);
        if (matches && matches.length > 0) {
            return matches[0];
        }
        return '';
    });
}
exports.which = which;
/**
 * Returns a list of all occurrences of the given tool on the system path.
 *
 * @returns   Promise<string[]>  the paths of the tool
 */
function findInPath(tool) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!tool) {
            throw new Error("parameter 'tool' is required");
        }
        // build the list of extensions to try
        const extensions = [];
        if (ioUtil.IS_WINDOWS && process.env['PATHEXT']) {
            for (const extension of process.env['PATHEXT'].split(path.delimiter)) {
                if (extension) {
                    extensions.push(extension);
                }
            }
        }
        // if it's rooted, return it if exists. otherwise return empty.
        if (ioUtil.isRooted(tool)) {
            const filePath = yield ioUtil.tryGetExecutablePath(tool, extensions);
            if (filePath) {
                return [filePath];
            }
            return [];
        }
        // if any path separators, return empty
        if (tool.includes(path.sep)) {
            return [];
        }
        // build the list of directories
        //
        // Note, technically "where" checks the current directory on Windows. From a toolkit perspective,
        // it feels like we should not do this. Checking the current directory seems like more of a use
        // case of a shell, and the which() function exposed by the toolkit should strive for consistency
        // across platforms.
        const directories = [];
        if (process.env.PATH) {
            for (const p of process.env.PATH.split(path.delimiter)) {
                if (p) {
                    directories.push(p);
                }
            }
        }
        // find all matches
        const matches = [];
        for (const directory of directories) {
            const filePath = yield ioUtil.tryGetExecutablePath(path.join(directory, tool), extensions);
            if (filePath) {
                matches.push(filePath);
            }
        }
        return matches;
    });
}
exports.findInPath = findInPath;
function readCopyOptions(options) {
    const force = options.force == null ? true : options.force;
    const recursive = Boolean(options.recursive);
    const copySourceDirectory = options.copySourceDirectory == null
        ? true
        : Boolean(options.copySourceDirectory);
    return { force, recursive, copySourceDirectory };
}
function cpDirRecursive(sourceDir, destDir, currentDepth, force) {
    return __awaiter(this, void 0, void 0, function* () {
        // Ensure there is not a run away recursive copy
        if (currentDepth >= 255)
            return;
        currentDepth++;
        yield mkdirP(destDir);
        const files = yield ioUtil.readdir(sourceDir);
        for (const fileName of files) {
            const srcFile = `${sourceDir}/${fileName}`;
            const destFile = `${destDir}/${fileName}`;
            const srcFileStat = yield ioUtil.lstat(srcFile);
            if (srcFileStat.isDirectory()) {
                // Recurse
                yield cpDirRecursive(srcFile, destFile, currentDepth, force);
            }
            else {
                yield copyFile(srcFile, destFile, force);
            }
        }
        // Change the mode for the newly created directory
        yield ioUtil.chmod(destDir, (yield ioUtil.stat(sourceDir)).mode);
    });
}
// Buffered file copy
function copyFile(srcFile, destFile, force) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield ioUtil.lstat(srcFile)).isSymbolicLink()) {
            // unlink/re-link it
            try {
                yield ioUtil.lstat(destFile);
                yield ioUtil.unlink(destFile);
            }
            catch (e) {
                // Try to override file permission
                if (e.code === 'EPERM') {
                    yield ioUtil.chmod(destFile, '0666');
                    yield ioUtil.unlink(destFile);
                }
                // other errors = it doesn't exist, no work to do
            }
            // Copy over symlink
            const symlinkFull = yield ioUtil.readlink(srcFile);
            yield ioUtil.symlink(symlinkFull, destFile, ioUtil.IS_WINDOWS ? 'junction' : null);
        }
        else if (!(yield ioUtil.exists(destFile)) || force) {
            yield ioUtil.copyFile(srcFile, destFile);
        }
    });
}
//# sourceMappingURL=io.js.map

/***/ }),
/* 2 */,
/* 3 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeConfig = void 0;
const tslib_1 = __webpack_require__(422);
const package_json_1 = tslib_1.__importDefault(__webpack_require__(81));
const config_resolver_1 = __webpack_require__(529);
const hash_node_1 = __webpack_require__(145);
const middleware_retry_1 = __webpack_require__(286);
const node_config_provider_1 = __webpack_require__(519);
const node_http_handler_1 = __webpack_require__(953);
const util_base64_node_1 = __webpack_require__(203);
const util_body_length_node_1 = __webpack_require__(555);
const util_user_agent_node_1 = __webpack_require__(96);
const util_utf8_node_1 = __webpack_require__(841);
const runtimeConfig_shared_1 = __webpack_require__(892);
const smithy_client_1 = __webpack_require__(973);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    smithy_client_1.emitWarningIfUnsupportedVersion(process.version);
    const clientSharedValues = runtimeConfig_shared_1.getRuntimeConfig(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : util_base64_node_1.fromBase64,
        base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : util_base64_node_1.toBase64,
        bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : util_body_length_node_1.calculateBodyLength,
        defaultUserAgentProvider: (_d = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _d !== void 0 ? _d : util_user_agent_node_1.defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: (_e = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _e !== void 0 ? _e : node_config_provider_1.loadConfig(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: (_f = config === null || config === void 0 ? void 0 : config.region) !== null && _f !== void 0 ? _f : node_config_provider_1.loadConfig(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: (_g = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _g !== void 0 ? _g : new node_http_handler_1.NodeHttpHandler(),
        retryMode: (_h = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _h !== void 0 ? _h : node_config_provider_1.loadConfig(middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS),
        sha256: (_j = config === null || config === void 0 ? void 0 : config.sha256) !== null && _j !== void 0 ? _j : hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: (_k = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _k !== void 0 ? _k : node_http_handler_1.streamCollector,
        useDualstackEndpoint: (_l = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _l !== void 0 ? _l : node_config_provider_1.loadConfig(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _m !== void 0 ? _m : node_config_provider_1.loadConfig(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        utf8Decoder: (_o = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _o !== void 0 ? _o : util_utf8_node_1.fromUtf8,
        utf8Encoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _p !== void 0 ? _p : util_utf8_node_1.toUtf8,
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.argStringToArray = exports.ToolRunner = void 0;
const os = __importStar(__webpack_require__(87));
const events = __importStar(__webpack_require__(614));
const child = __importStar(__webpack_require__(129));
const path = __importStar(__webpack_require__(622));
const io = __importStar(__webpack_require__(1));
const ioUtil = __importStar(__webpack_require__(672));
const timers_1 = __webpack_require__(213);
/* eslint-disable @typescript-eslint/unbound-method */
const IS_WINDOWS = process.platform === 'win32';
/*
 * Class for running command line tools. Handles quoting and arg parsing in a platform agnostic way.
 */
class ToolRunner extends events.EventEmitter {
    constructor(toolPath, args, options) {
        super();
        if (!toolPath) {
            throw new Error("Parameter 'toolPath' cannot be null or empty.");
        }
        this.toolPath = toolPath;
        this.args = args || [];
        this.options = options || {};
    }
    _debug(message) {
        if (this.options.listeners && this.options.listeners.debug) {
            this.options.listeners.debug(message);
        }
    }
    _getCommandString(options, noPrefix) {
        const toolPath = this._getSpawnFileName();
        const args = this._getSpawnArgs(options);
        let cmd = noPrefix ? '' : '[command]'; // omit prefix when piped to a second tool
        if (IS_WINDOWS) {
            // Windows + cmd file
            if (this._isCmdFile()) {
                cmd += toolPath;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows + verbatim
            else if (options.windowsVerbatimArguments) {
                cmd += `"${toolPath}"`;
                for (const a of args) {
                    cmd += ` ${a}`;
                }
            }
            // Windows (regular)
            else {
                cmd += this._windowsQuoteCmdArg(toolPath);
                for (const a of args) {
                    cmd += ` ${this._windowsQuoteCmdArg(a)}`;
                }
            }
        }
        else {
            // OSX/Linux - this can likely be improved with some form of quoting.
            // creating processes on Unix is fundamentally different than Windows.
            // on Unix, execvp() takes an arg array.
            cmd += toolPath;
            for (const a of args) {
                cmd += ` ${a}`;
            }
        }
        return cmd;
    }
    _processLineBuffer(data, strBuffer, onLine) {
        try {
            let s = strBuffer + data.toString();
            let n = s.indexOf(os.EOL);
            while (n > -1) {
                const line = s.substring(0, n);
                onLine(line);
                // the rest of the string ...
                s = s.substring(n + os.EOL.length);
                n = s.indexOf(os.EOL);
            }
            return s;
        }
        catch (err) {
            // streaming lines to console is best effort.  Don't fail a build.
            this._debug(`error processing line. Failed with error ${err}`);
            return '';
        }
    }
    _getSpawnFileName() {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                return process.env['COMSPEC'] || 'cmd.exe';
            }
        }
        return this.toolPath;
    }
    _getSpawnArgs(options) {
        if (IS_WINDOWS) {
            if (this._isCmdFile()) {
                let argline = `/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;
                for (const a of this.args) {
                    argline += ' ';
                    argline += options.windowsVerbatimArguments
                        ? a
                        : this._windowsQuoteCmdArg(a);
                }
                argline += '"';
                return [argline];
            }
        }
        return this.args;
    }
    _endsWith(str, end) {
        return str.endsWith(end);
    }
    _isCmdFile() {
        const upperToolPath = this.toolPath.toUpperCase();
        return (this._endsWith(upperToolPath, '.CMD') ||
            this._endsWith(upperToolPath, '.BAT'));
    }
    _windowsQuoteCmdArg(arg) {
        // for .exe, apply the normal quoting rules that libuv applies
        if (!this._isCmdFile()) {
            return this._uvQuoteCmdArg(arg);
        }
        // otherwise apply quoting rules specific to the cmd.exe command line parser.
        // the libuv rules are generic and are not designed specifically for cmd.exe
        // command line parser.
        //
        // for a detailed description of the cmd.exe command line parser, refer to
        // http://stackoverflow.com/questions/4094699/how-does-the-windows-command-interpreter-cmd-exe-parse-scripts/7970912#7970912
        // need quotes for empty arg
        if (!arg) {
            return '""';
        }
        // determine whether the arg needs to be quoted
        const cmdSpecialChars = [
            ' ',
            '\t',
            '&',
            '(',
            ')',
            '[',
            ']',
            '{',
            '}',
            '^',
            '=',
            ';',
            '!',
            "'",
            '+',
            ',',
            '`',
            '~',
            '|',
            '<',
            '>',
            '"'
        ];
        let needsQuotes = false;
        for (const char of arg) {
            if (cmdSpecialChars.some(x => x === char)) {
                needsQuotes = true;
                break;
            }
        }
        // short-circuit if quotes not needed
        if (!needsQuotes) {
            return arg;
        }
        // the following quoting rules are very similar to the rules that by libuv applies.
        //
        // 1) wrap the string in quotes
        //
        // 2) double-up quotes - i.e. " => ""
        //
        //    this is different from the libuv quoting rules. libuv replaces " with \", which unfortunately
        //    doesn't work well with a cmd.exe command line.
        //
        //    note, replacing " with "" also works well if the arg is passed to a downstream .NET console app.
        //    for example, the command line:
        //          foo.exe "myarg:""my val"""
        //    is parsed by a .NET console app into an arg array:
        //          [ "myarg:\"my val\"" ]
        //    which is the same end result when applying libuv quoting rules. although the actual
        //    command line from libuv quoting rules would look like:
        //          foo.exe "myarg:\"my val\""
        //
        // 3) double-up slashes that precede a quote,
        //    e.g.  hello \world    => "hello \world"
        //          hello\"world    => "hello\\""world"
        //          hello\\"world   => "hello\\\\""world"
        //          hello world\    => "hello world\\"
        //
        //    technically this is not required for a cmd.exe command line, or the batch argument parser.
        //    the reasons for including this as a .cmd quoting rule are:
        //
        //    a) this is optimized for the scenario where the argument is passed from the .cmd file to an
        //       external program. many programs (e.g. .NET console apps) rely on the slash-doubling rule.
        //
        //    b) it's what we've been doing previously (by deferring to node default behavior) and we
        //       haven't heard any complaints about that aspect.
        //
        // note, a weakness of the quoting rules chosen here, is that % is not escaped. in fact, % cannot be
        // escaped when used on the command line directly - even though within a .cmd file % can be escaped
        // by using %%.
        //
        // the saving grace is, on the command line, %var% is left as-is if var is not defined. this contrasts
        // the line parsing rules within a .cmd file, where if var is not defined it is replaced with nothing.
        //
        // one option that was explored was replacing % with ^% - i.e. %var% => ^%var^%. this hack would
        // often work, since it is unlikely that var^ would exist, and the ^ character is removed when the
        // variable is used. the problem, however, is that ^ is not removed when %* is used to pass the args
        // to an external program.
        //
        // an unexplored potential solution for the % escaping problem, is to create a wrapper .cmd file.
        // % can be escaped within a .cmd file.
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\'; // double the slash
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '"'; // double the quote
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _uvQuoteCmdArg(arg) {
        // Tool runner wraps child_process.spawn() and needs to apply the same quoting as
        // Node in certain cases where the undocumented spawn option windowsVerbatimArguments
        // is used.
        //
        // Since this function is a port of quote_cmd_arg from Node 4.x (technically, lib UV,
        // see https://github.com/nodejs/node/blob/v4.x/deps/uv/src/win/process.c for details),
        // pasting copyright notice from Node within this function:
        //
        //      Copyright Joyent, Inc. and other Node contributors. All rights reserved.
        //
        //      Permission is hereby granted, free of charge, to any person obtaining a copy
        //      of this software and associated documentation files (the "Software"), to
        //      deal in the Software without restriction, including without limitation the
        //      rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
        //      sell copies of the Software, and to permit persons to whom the Software is
        //      furnished to do so, subject to the following conditions:
        //
        //      The above copyright notice and this permission notice shall be included in
        //      all copies or substantial portions of the Software.
        //
        //      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        //      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        //      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        //      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        //      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
        //      FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
        //      IN THE SOFTWARE.
        if (!arg) {
            // Need double quotation for empty argument
            return '""';
        }
        if (!arg.includes(' ') && !arg.includes('\t') && !arg.includes('"')) {
            // No quotation needed
            return arg;
        }
        if (!arg.includes('"') && !arg.includes('\\')) {
            // No embedded double quotes or backslashes, so I can just wrap
            // quote marks around the whole thing.
            return `"${arg}"`;
        }
        // Expected input/output:
        //   input : hello"world
        //   output: "hello\"world"
        //   input : hello""world
        //   output: "hello\"\"world"
        //   input : hello\world
        //   output: hello\world
        //   input : hello\\world
        //   output: hello\\world
        //   input : hello\"world
        //   output: "hello\\\"world"
        //   input : hello\\"world
        //   output: "hello\\\\\"world"
        //   input : hello world\
        //   output: "hello world\\" - note the comment in libuv actually reads "hello world\"
        //                             but it appears the comment is wrong, it should be "hello world\\"
        let reverse = '"';
        let quoteHit = true;
        for (let i = arg.length; i > 0; i--) {
            // walk the string in reverse
            reverse += arg[i - 1];
            if (quoteHit && arg[i - 1] === '\\') {
                reverse += '\\';
            }
            else if (arg[i - 1] === '"') {
                quoteHit = true;
                reverse += '\\';
            }
            else {
                quoteHit = false;
            }
        }
        reverse += '"';
        return reverse
            .split('')
            .reverse()
            .join('');
    }
    _cloneExecOptions(options) {
        options = options || {};
        const result = {
            cwd: options.cwd || process.cwd(),
            env: options.env || process.env,
            silent: options.silent || false,
            windowsVerbatimArguments: options.windowsVerbatimArguments || false,
            failOnStdErr: options.failOnStdErr || false,
            ignoreReturnCode: options.ignoreReturnCode || false,
            delay: options.delay || 10000
        };
        result.outStream = options.outStream || process.stdout;
        result.errStream = options.errStream || process.stderr;
        return result;
    }
    _getSpawnOptions(options, toolPath) {
        options = options || {};
        const result = {};
        result.cwd = options.cwd;
        result.env = options.env;
        result['windowsVerbatimArguments'] =
            options.windowsVerbatimArguments || this._isCmdFile();
        if (options.windowsVerbatimArguments) {
            result.argv0 = `"${toolPath}"`;
        }
        return result;
    }
    /**
     * Exec a tool.
     * Output will be streamed to the live console.
     * Returns promise with return code
     *
     * @param     tool     path to tool to exec
     * @param     options  optional exec options.  See ExecOptions
     * @returns   number
     */
    exec() {
        return __awaiter(this, void 0, void 0, function* () {
            // root the tool path if it is unrooted and contains relative pathing
            if (!ioUtil.isRooted(this.toolPath) &&
                (this.toolPath.includes('/') ||
                    (IS_WINDOWS && this.toolPath.includes('\\')))) {
                // prefer options.cwd if it is specified, however options.cwd may also need to be rooted
                this.toolPath = path.resolve(process.cwd(), this.options.cwd || process.cwd(), this.toolPath);
            }
            // if the tool is only a file name, then resolve it from the PATH
            // otherwise verify it exists (add extension on Windows if necessary)
            this.toolPath = yield io.which(this.toolPath, true);
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._debug(`exec tool: ${this.toolPath}`);
                this._debug('arguments:');
                for (const arg of this.args) {
                    this._debug(`   ${arg}`);
                }
                const optionsNonNull = this._cloneExecOptions(this.options);
                if (!optionsNonNull.silent && optionsNonNull.outStream) {
                    optionsNonNull.outStream.write(this._getCommandString(optionsNonNull) + os.EOL);
                }
                const state = new ExecState(optionsNonNull, this.toolPath);
                state.on('debug', (message) => {
                    this._debug(message);
                });
                if (this.options.cwd && !(yield ioUtil.exists(this.options.cwd))) {
                    return reject(new Error(`The cwd: ${this.options.cwd} does not exist!`));
                }
                const fileName = this._getSpawnFileName();
                const cp = child.spawn(fileName, this._getSpawnArgs(optionsNonNull), this._getSpawnOptions(this.options, fileName));
                let stdbuffer = '';
                if (cp.stdout) {
                    cp.stdout.on('data', (data) => {
                        if (this.options.listeners && this.options.listeners.stdout) {
                            this.options.listeners.stdout(data);
                        }
                        if (!optionsNonNull.silent && optionsNonNull.outStream) {
                            optionsNonNull.outStream.write(data);
                        }
                        stdbuffer = this._processLineBuffer(data, stdbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.stdline) {
                                this.options.listeners.stdline(line);
                            }
                        });
                    });
                }
                let errbuffer = '';
                if (cp.stderr) {
                    cp.stderr.on('data', (data) => {
                        state.processStderr = true;
                        if (this.options.listeners && this.options.listeners.stderr) {
                            this.options.listeners.stderr(data);
                        }
                        if (!optionsNonNull.silent &&
                            optionsNonNull.errStream &&
                            optionsNonNull.outStream) {
                            const s = optionsNonNull.failOnStdErr
                                ? optionsNonNull.errStream
                                : optionsNonNull.outStream;
                            s.write(data);
                        }
                        errbuffer = this._processLineBuffer(data, errbuffer, (line) => {
                            if (this.options.listeners && this.options.listeners.errline) {
                                this.options.listeners.errline(line);
                            }
                        });
                    });
                }
                cp.on('error', (err) => {
                    state.processError = err.message;
                    state.processExited = true;
                    state.processClosed = true;
                    state.CheckComplete();
                });
                cp.on('exit', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    this._debug(`Exit code ${code} received from tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                cp.on('close', (code) => {
                    state.processExitCode = code;
                    state.processExited = true;
                    state.processClosed = true;
                    this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);
                    state.CheckComplete();
                });
                state.on('done', (error, exitCode) => {
                    if (stdbuffer.length > 0) {
                        this.emit('stdline', stdbuffer);
                    }
                    if (errbuffer.length > 0) {
                        this.emit('errline', errbuffer);
                    }
                    cp.removeAllListeners();
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(exitCode);
                    }
                });
                if (this.options.input) {
                    if (!cp.stdin) {
                        throw new Error('child process missing stdin');
                    }
                    cp.stdin.end(this.options.input);
                }
            }));
        });
    }
}
exports.ToolRunner = ToolRunner;
/**
 * Convert an arg string to an array of args. Handles escaping
 *
 * @param    argString   string of arguments
 * @returns  string[]    array of arguments
 */
function argStringToArray(argString) {
    const args = [];
    let inQuotes = false;
    let escaped = false;
    let arg = '';
    function append(c) {
        // we only escape double quotes.
        if (escaped && c !== '"') {
            arg += '\\';
        }
        arg += c;
        escaped = false;
    }
    for (let i = 0; i < argString.length; i++) {
        const c = argString.charAt(i);
        if (c === '"') {
            if (!escaped) {
                inQuotes = !inQuotes;
            }
            else {
                append(c);
            }
            continue;
        }
        if (c === '\\' && escaped) {
            append(c);
            continue;
        }
        if (c === '\\' && inQuotes) {
            escaped = true;
            continue;
        }
        if (c === ' ' && !inQuotes) {
            if (arg.length > 0) {
                args.push(arg);
                arg = '';
            }
            continue;
        }
        append(c);
    }
    if (arg.length > 0) {
        args.push(arg.trim());
    }
    return args;
}
exports.argStringToArray = argStringToArray;
class ExecState extends events.EventEmitter {
    constructor(options, toolPath) {
        super();
        this.processClosed = false; // tracks whether the process has exited and stdio is closed
        this.processError = '';
        this.processExitCode = 0;
        this.processExited = false; // tracks whether the process has exited
        this.processStderr = false; // tracks whether stderr was written to
        this.delay = 10000; // 10 seconds
        this.done = false;
        this.timeout = null;
        if (!toolPath) {
            throw new Error('toolPath must not be empty');
        }
        this.options = options;
        this.toolPath = toolPath;
        if (options.delay) {
            this.delay = options.delay;
        }
    }
    CheckComplete() {
        if (this.done) {
            return;
        }
        if (this.processClosed) {
            this._setResult();
        }
        else if (this.processExited) {
            this.timeout = timers_1.setTimeout(ExecState.HandleTimeout, this.delay, this);
        }
    }
    _debug(message) {
        this.emit('debug', message);
    }
    _setResult() {
        // determine whether there is an error
        let error;
        if (this.processExited) {
            if (this.processError) {
                error = new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`);
            }
            else if (this.processExitCode !== 0 && !this.options.ignoreReturnCode) {
                error = new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`);
            }
            else if (this.processStderr && this.options.failOnStdErr) {
                error = new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`);
            }
        }
        // clear the timeout
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        this.done = true;
        this.emit('done', error, this.processExitCode);
    }
    static HandleTimeout(state) {
        if (state.done) {
            return;
        }
        if (!state.processClosed && state.processExited) {
            const message = `The STDIO streams did not close within ${state.delay /
                1000} seconds of the exit event from process '${state.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;
            state._debug(message);
        }
        state._setResult();
    }
}
//# sourceMappingURL=toolrunner.js.map

/***/ }),
/* 10 */,
/* 11 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHttp2Handler = void 0;
const protocol_http_1 = __webpack_require__(504);
const querystring_builder_1 = __webpack_require__(979);
const http2_1 = __webpack_require__(565);
const get_transformed_headers_1 = __webpack_require__(458);
const write_request_body_1 = __webpack_require__(426);
class NodeHttp2Handler {
    constructor({ requestTimeout, sessionTimeout, disableConcurrentStreams } = {}) {
        this.metadata = { handlerProtocol: "h2" };
        this.requestTimeout = requestTimeout;
        this.sessionTimeout = sessionTimeout;
        this.disableConcurrentStreams = disableConcurrentStreams;
        this.sessionCache = new Map();
    }
    destroy() {
        for (const sessions of this.sessionCache.values()) {
            sessions.forEach((session) => this.destroySession(session));
        }
        this.sessionCache.clear();
    }
    handle(request, { abortSignal } = {}) {
        return new Promise((resolve, rejectOriginal) => {
            let fulfilled = false;
            if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                fulfilled = true;
                const abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                rejectOriginal(abortError);
                return;
            }
            const { hostname, method, port, protocol, path, query } = request;
            const authority = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
            const session = this.getSession(authority, this.disableConcurrentStreams || false);
            const reject = (err) => {
                if (this.disableConcurrentStreams) {
                    this.destroySession(session);
                }
                fulfilled = true;
                rejectOriginal(err);
            };
            const queryString = querystring_builder_1.buildQueryString(query || {});
            const req = session.request({
                ...request.headers,
                [http2_1.constants.HTTP2_HEADER_PATH]: queryString ? `${path}?${queryString}` : path,
                [http2_1.constants.HTTP2_HEADER_METHOD]: method,
            });
            req.on("response", (headers) => {
                const httpResponse = new protocol_http_1.HttpResponse({
                    statusCode: headers[":status"] || -1,
                    headers: get_transformed_headers_1.getTransformedHeaders(headers),
                    body: req,
                });
                fulfilled = true;
                resolve({ response: httpResponse });
                if (this.disableConcurrentStreams) {
                    session.close();
                    this.deleteSessionFromCache(authority, session);
                }
            });
            const requestTimeout = this.requestTimeout;
            if (requestTimeout) {
                req.setTimeout(requestTimeout, () => {
                    req.close();
                    const timeoutError = new Error(`Stream timed out because of no activity for ${requestTimeout} ms`);
                    timeoutError.name = "TimeoutError";
                    reject(timeoutError);
                });
            }
            if (abortSignal) {
                abortSignal.onabort = () => {
                    req.close();
                    const abortError = new Error("Request aborted");
                    abortError.name = "AbortError";
                    reject(abortError);
                };
            }
            req.on("frameError", (type, code, id) => {
                reject(new Error(`Frame type id ${type} in stream id ${id} has failed with code ${code}.`));
            });
            req.on("error", reject);
            req.on("aborted", () => {
                reject(new Error(`HTTP/2 stream is abnormally aborted in mid-communication with result code ${req.rstCode}.`));
            });
            req.on("close", () => {
                if (this.disableConcurrentStreams) {
                    session.destroy();
                }
                if (!fulfilled) {
                    reject(new Error("Unexpected error: http2 request did not get a response"));
                }
            });
            write_request_body_1.writeRequestBody(req, request);
        });
    }
    getSession(authority, disableConcurrentStreams) {
        const sessionCache = this.sessionCache;
        const existingSessions = sessionCache.get(authority) || [];
        if (existingSessions.length > 0 && !disableConcurrentStreams)
            return existingSessions[0];
        const newSession = http2_1.connect(authority);
        const destroySessionCb = () => {
            this.destroySession(newSession);
            this.deleteSessionFromCache(authority, newSession);
        };
        newSession.on("goaway", destroySessionCb);
        newSession.on("error", destroySessionCb);
        newSession.on("frameError", destroySessionCb);
        const sessionTimeout = this.sessionTimeout;
        if (sessionTimeout) {
            newSession.setTimeout(sessionTimeout, destroySessionCb);
        }
        existingSessions.push(newSession);
        sessionCache.set(authority, existingSessions);
        return newSession;
    }
    destroySession(session) {
        if (!session.destroyed) {
            session.destroy();
        }
    }
    deleteSessionFromCache(authority, session) {
        const existingSessions = this.sessionCache.get(authority) || [];
        if (!existingSessions.includes(session)) {
            return;
        }
        this.sessionCache.set(authority, existingSessions.filter((s) => s !== session));
    }
}
exports.NodeHttp2Handler = NodeHttp2Handler;


/***/ }),
/* 12 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getSerdePlugin = exports.serializerMiddlewareOption = exports.deserializerMiddlewareOption = void 0;
const deserializerMiddleware_1 = __webpack_require__(407);
const serializerMiddleware_1 = __webpack_require__(705);
exports.deserializerMiddlewareOption = {
    name: "deserializerMiddleware",
    step: "deserialize",
    tags: ["DESERIALIZER"],
    override: true,
};
exports.serializerMiddlewareOption = {
    name: "serializerMiddleware",
    step: "serialize",
    tags: ["SERIALIZER"],
    override: true,
};
function getSerdePlugin(config, serializer, deserializer) {
    return {
        applyToStack: (commandStack) => {
            commandStack.add(deserializerMiddleware_1.deserializerMiddleware(config, deserializer), exports.deserializerMiddlewareOption);
            commandStack.add(serializerMiddleware_1.serializerMiddleware(config, serializer), exports.serializerMiddlewareOption);
        },
    };
}
exports.getSerdePlugin = getSerdePlugin;


/***/ }),
/* 13 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeConfig = void 0;
const url_parser_1 = __webpack_require__(187);
const endpoints_1 = __webpack_require__(525);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d, _e;
    return ({
        apiVersion: "2015-09-21",
        disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
        logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
        regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : endpoints_1.defaultRegionInfoProvider,
        serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "ECR",
        urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : url_parser_1.parseUrl,
    });
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),
/* 14 */,
/* 15 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDelayDecider = void 0;
const constants_1 = __webpack_require__(373);
const defaultDelayDecider = (delayBase, attempts) => Math.floor(Math.min(constants_1.MAXIMUM_RETRY_DELAY, Math.random() * 2 ** attempts * delayBase));
exports.defaultDelayDecider = defaultDelayDecider;


/***/ }),
/* 16 */
/***/ (function(module) {

module.exports = require("tls");

/***/ }),
/* 17 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SSOClient = void 0;
const config_resolver_1 = __webpack_require__(529);
const middleware_content_length_1 = __webpack_require__(988);
const middleware_host_header_1 = __webpack_require__(795);
const middleware_logger_1 = __webpack_require__(263);
const middleware_retry_1 = __webpack_require__(286);
const middleware_user_agent_1 = __webpack_require__(105);
const smithy_client_1 = __webpack_require__(973);
const runtimeConfig_1 = __webpack_require__(3);
class SSOClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = runtimeConfig_1.getRuntimeConfig(configuration);
        const _config_1 = config_resolver_1.resolveRegionConfig(_config_0);
        const _config_2 = config_resolver_1.resolveEndpointsConfig(_config_1);
        const _config_3 = middleware_retry_1.resolveRetryConfig(_config_2);
        const _config_4 = middleware_host_header_1.resolveHostHeaderConfig(_config_3);
        const _config_5 = middleware_user_agent_1.resolveUserAgentConfig(_config_4);
        super(_config_5);
        this.config = _config_5;
        this.middlewareStack.use(middleware_retry_1.getRetryPlugin(this.config));
        this.middlewareStack.use(middleware_content_length_1.getContentLengthPlugin(this.config));
        this.middlewareStack.use(middleware_host_header_1.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(middleware_logger_1.getLoggerPlugin(this.config));
        this.middlewareStack.use(middleware_user_agent_1.getUserAgentPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.SSOClient = SSOClient;


/***/ }),
/* 18 */,
/* 19 */,
/* 20 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromContainerMetadata = exports.ENV_CMDS_AUTH_TOKEN = exports.ENV_CMDS_RELATIVE_URI = exports.ENV_CMDS_FULL_URI = void 0;
const property_provider_1 = __webpack_require__(948);
const url_1 = __webpack_require__(835);
const httpRequest_1 = __webpack_require__(175);
const ImdsCredentials_1 = __webpack_require__(560);
const RemoteProviderInit_1 = __webpack_require__(846);
const retry_1 = __webpack_require__(588);
exports.ENV_CMDS_FULL_URI = "AWS_CONTAINER_CREDENTIALS_FULL_URI";
exports.ENV_CMDS_RELATIVE_URI = "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI";
exports.ENV_CMDS_AUTH_TOKEN = "AWS_CONTAINER_AUTHORIZATION_TOKEN";
const fromContainerMetadata = (init = {}) => {
    const { timeout, maxRetries } = RemoteProviderInit_1.providerConfigFromInit(init);
    return () => retry_1.retry(async () => {
        const requestOptions = await getCmdsUri();
        const credsResponse = JSON.parse(await requestFromEcsImds(timeout, requestOptions));
        if (!ImdsCredentials_1.isImdsCredentials(credsResponse)) {
            throw new property_provider_1.CredentialsProviderError("Invalid response received from instance metadata service.");
        }
        return ImdsCredentials_1.fromImdsCredentials(credsResponse);
    }, maxRetries);
};
exports.fromContainerMetadata = fromContainerMetadata;
const requestFromEcsImds = async (timeout, options) => {
    if (process.env[exports.ENV_CMDS_AUTH_TOKEN]) {
        options.headers = {
            ...options.headers,
            Authorization: process.env[exports.ENV_CMDS_AUTH_TOKEN],
        };
    }
    const buffer = await httpRequest_1.httpRequest({
        ...options,
        timeout,
    });
    return buffer.toString();
};
const CMDS_IP = "169.254.170.2";
const GREENGRASS_HOSTS = {
    localhost: true,
    "127.0.0.1": true,
};
const GREENGRASS_PROTOCOLS = {
    "http:": true,
    "https:": true,
};
const getCmdsUri = async () => {
    if (process.env[exports.ENV_CMDS_RELATIVE_URI]) {
        return {
            hostname: CMDS_IP,
            path: process.env[exports.ENV_CMDS_RELATIVE_URI],
        };
    }
    if (process.env[exports.ENV_CMDS_FULL_URI]) {
        const parsed = url_1.parse(process.env[exports.ENV_CMDS_FULL_URI]);
        if (!parsed.hostname || !(parsed.hostname in GREENGRASS_HOSTS)) {
            throw new property_provider_1.CredentialsProviderError(`${parsed.hostname} is not a valid container metadata service hostname`, false);
        }
        if (!parsed.protocol || !(parsed.protocol in GREENGRASS_PROTOCOLS)) {
            throw new property_provider_1.CredentialsProviderError(`${parsed.protocol} is not a valid container metadata service protocol`, false);
        }
        return {
            ...parsed,
            port: parsed.port ? parseInt(parsed.port, 10) : undefined,
        };
    }
    throw new property_provider_1.CredentialsProviderError("The container metadata credential provider cannot be used unless" +
        ` the ${exports.ENV_CMDS_RELATIVE_URI} or ${exports.ENV_CMDS_FULL_URI} environment` +
        " variable is set", false);
};


/***/ }),
/* 21 */,
/* 22 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(__webpack_require__(78));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports.default = _default;

/***/ }),
/* 23 */,
/* 24 */,
/* 25 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLifecyclePolicyPreviewCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class GetLifecyclePolicyPreviewCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "GetLifecyclePolicyPreviewCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetLifecyclePolicyPreviewRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetLifecyclePolicyPreviewResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1GetLifecyclePolicyPreviewCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1GetLifecyclePolicyPreviewCommand(output, context);
    }
}
exports.GetLifecyclePolicyPreviewCommand = GetLifecyclePolicyPreviewCommand;


/***/ }),
/* 26 */,
/* 27 */,
/* 28 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AssumeRoleWithSAMLCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class AssumeRoleWithSAMLCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleWithSAMLCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.AssumeRoleWithSAMLRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.AssumeRoleWithSAMLResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryAssumeRoleWithSAMLCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryAssumeRoleWithSAMLCommand(output, context);
    }
}
exports.AssumeRoleWithSAMLCommand = AssumeRoleWithSAMLCommand;


/***/ }),
/* 29 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.extendedEncodeURIComponent = void 0;
function extendedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16).toUpperCase();
    });
}
exports.extendedEncodeURIComponent = extendedEncodeURIComponent;


/***/ }),
/* 30 */,
/* 31 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegionInfo = void 0;
const getHostnameFromVariants_1 = __webpack_require__(254);
const getResolvedHostname_1 = __webpack_require__(584);
const getResolvedPartition_1 = __webpack_require__(192);
const getResolvedSigningRegion_1 = __webpack_require__(219);
const getRegionInfo = (region, { useFipsEndpoint = false, useDualstackEndpoint = false, signingService, regionHash, partitionHash, }) => {
    var _a, _b, _c, _d, _e, _f;
    const partition = getResolvedPartition_1.getResolvedPartition(region, { partitionHash });
    const resolvedRegion = region in regionHash ? region : (_b = (_a = partitionHash[partition]) === null || _a === void 0 ? void 0 : _a.endpoint) !== null && _b !== void 0 ? _b : region;
    const hostnameOptions = { useFipsEndpoint, useDualstackEndpoint };
    const regionHostname = getHostnameFromVariants_1.getHostnameFromVariants((_c = regionHash[resolvedRegion]) === null || _c === void 0 ? void 0 : _c.variants, hostnameOptions);
    const partitionHostname = getHostnameFromVariants_1.getHostnameFromVariants((_d = partitionHash[partition]) === null || _d === void 0 ? void 0 : _d.variants, hostnameOptions);
    const hostname = getResolvedHostname_1.getResolvedHostname(resolvedRegion, { regionHostname, partitionHostname });
    if (hostname === undefined) {
        throw new Error(`Endpoint resolution failed for: ${{ resolvedRegion, useFipsEndpoint, useDualstackEndpoint }}`);
    }
    const signingRegion = getResolvedSigningRegion_1.getResolvedSigningRegion(hostname, {
        signingRegion: (_e = regionHash[resolvedRegion]) === null || _e === void 0 ? void 0 : _e.signingRegion,
        regionRegex: partitionHash[partition].regionRegex,
        useFipsEndpoint,
    });
    return {
        partition,
        signingService,
        hostname,
        ...(signingRegion && { signingRegion }),
        ...(((_f = regionHash[resolvedRegion]) === null || _f === void 0 ? void 0 : _f.signingService) && {
            signingService: regionHash[resolvedRegion].signingService,
        }),
    };
};
exports.getRegionInfo = getRegionInfo;


/***/ }),
/* 32 */,
/* 33 */,
/* 34 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeConfig = void 0;
const url_parser_1 = __webpack_require__(187);
const endpoints_1 = __webpack_require__(567);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d, _e;
    return ({
        apiVersion: "2011-06-15",
        disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
        logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
        regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : endpoints_1.defaultRegionInfoProvider,
        serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "STS",
        urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : url_parser_1.parseUrl,
    });
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),
/* 35 */,
/* 36 */,
/* 37 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSessionTokenResponse = exports.GetSessionTokenRequest = exports.GetFederationTokenResponse = exports.FederatedUser = exports.GetFederationTokenRequest = exports.GetCallerIdentityResponse = exports.GetCallerIdentityRequest = exports.GetAccessKeyInfoResponse = exports.GetAccessKeyInfoRequest = exports.InvalidAuthorizationMessageException = exports.DecodeAuthorizationMessageResponse = exports.DecodeAuthorizationMessageRequest = exports.IDPCommunicationErrorException = exports.AssumeRoleWithWebIdentityResponse = exports.AssumeRoleWithWebIdentityRequest = exports.InvalidIdentityTokenException = exports.IDPRejectedClaimException = exports.AssumeRoleWithSAMLResponse = exports.AssumeRoleWithSAMLRequest = exports.RegionDisabledException = exports.PackedPolicyTooLargeException = exports.MalformedPolicyDocumentException = exports.ExpiredTokenException = exports.AssumeRoleResponse = exports.Credentials = exports.AssumeRoleRequest = exports.Tag = exports.PolicyDescriptorType = exports.AssumedRoleUser = void 0;
var AssumedRoleUser;
(function (AssumedRoleUser) {
    AssumedRoleUser.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumedRoleUser = exports.AssumedRoleUser || (exports.AssumedRoleUser = {}));
var PolicyDescriptorType;
(function (PolicyDescriptorType) {
    PolicyDescriptorType.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PolicyDescriptorType = exports.PolicyDescriptorType || (exports.PolicyDescriptorType = {}));
var Tag;
(function (Tag) {
    Tag.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Tag = exports.Tag || (exports.Tag = {}));
var AssumeRoleRequest;
(function (AssumeRoleRequest) {
    AssumeRoleRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumeRoleRequest = exports.AssumeRoleRequest || (exports.AssumeRoleRequest = {}));
var Credentials;
(function (Credentials) {
    Credentials.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Credentials = exports.Credentials || (exports.Credentials = {}));
var AssumeRoleResponse;
(function (AssumeRoleResponse) {
    AssumeRoleResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumeRoleResponse = exports.AssumeRoleResponse || (exports.AssumeRoleResponse = {}));
var ExpiredTokenException;
(function (ExpiredTokenException) {
    ExpiredTokenException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ExpiredTokenException = exports.ExpiredTokenException || (exports.ExpiredTokenException = {}));
var MalformedPolicyDocumentException;
(function (MalformedPolicyDocumentException) {
    MalformedPolicyDocumentException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(MalformedPolicyDocumentException = exports.MalformedPolicyDocumentException || (exports.MalformedPolicyDocumentException = {}));
var PackedPolicyTooLargeException;
(function (PackedPolicyTooLargeException) {
    PackedPolicyTooLargeException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PackedPolicyTooLargeException = exports.PackedPolicyTooLargeException || (exports.PackedPolicyTooLargeException = {}));
var RegionDisabledException;
(function (RegionDisabledException) {
    RegionDisabledException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RegionDisabledException = exports.RegionDisabledException || (exports.RegionDisabledException = {}));
var AssumeRoleWithSAMLRequest;
(function (AssumeRoleWithSAMLRequest) {
    AssumeRoleWithSAMLRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumeRoleWithSAMLRequest = exports.AssumeRoleWithSAMLRequest || (exports.AssumeRoleWithSAMLRequest = {}));
var AssumeRoleWithSAMLResponse;
(function (AssumeRoleWithSAMLResponse) {
    AssumeRoleWithSAMLResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumeRoleWithSAMLResponse = exports.AssumeRoleWithSAMLResponse || (exports.AssumeRoleWithSAMLResponse = {}));
var IDPRejectedClaimException;
(function (IDPRejectedClaimException) {
    IDPRejectedClaimException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(IDPRejectedClaimException = exports.IDPRejectedClaimException || (exports.IDPRejectedClaimException = {}));
var InvalidIdentityTokenException;
(function (InvalidIdentityTokenException) {
    InvalidIdentityTokenException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidIdentityTokenException = exports.InvalidIdentityTokenException || (exports.InvalidIdentityTokenException = {}));
var AssumeRoleWithWebIdentityRequest;
(function (AssumeRoleWithWebIdentityRequest) {
    AssumeRoleWithWebIdentityRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumeRoleWithWebIdentityRequest = exports.AssumeRoleWithWebIdentityRequest || (exports.AssumeRoleWithWebIdentityRequest = {}));
var AssumeRoleWithWebIdentityResponse;
(function (AssumeRoleWithWebIdentityResponse) {
    AssumeRoleWithWebIdentityResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AssumeRoleWithWebIdentityResponse = exports.AssumeRoleWithWebIdentityResponse || (exports.AssumeRoleWithWebIdentityResponse = {}));
var IDPCommunicationErrorException;
(function (IDPCommunicationErrorException) {
    IDPCommunicationErrorException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(IDPCommunicationErrorException = exports.IDPCommunicationErrorException || (exports.IDPCommunicationErrorException = {}));
var DecodeAuthorizationMessageRequest;
(function (DecodeAuthorizationMessageRequest) {
    DecodeAuthorizationMessageRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DecodeAuthorizationMessageRequest = exports.DecodeAuthorizationMessageRequest || (exports.DecodeAuthorizationMessageRequest = {}));
var DecodeAuthorizationMessageResponse;
(function (DecodeAuthorizationMessageResponse) {
    DecodeAuthorizationMessageResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DecodeAuthorizationMessageResponse = exports.DecodeAuthorizationMessageResponse || (exports.DecodeAuthorizationMessageResponse = {}));
var InvalidAuthorizationMessageException;
(function (InvalidAuthorizationMessageException) {
    InvalidAuthorizationMessageException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidAuthorizationMessageException = exports.InvalidAuthorizationMessageException || (exports.InvalidAuthorizationMessageException = {}));
var GetAccessKeyInfoRequest;
(function (GetAccessKeyInfoRequest) {
    GetAccessKeyInfoRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetAccessKeyInfoRequest = exports.GetAccessKeyInfoRequest || (exports.GetAccessKeyInfoRequest = {}));
var GetAccessKeyInfoResponse;
(function (GetAccessKeyInfoResponse) {
    GetAccessKeyInfoResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetAccessKeyInfoResponse = exports.GetAccessKeyInfoResponse || (exports.GetAccessKeyInfoResponse = {}));
var GetCallerIdentityRequest;
(function (GetCallerIdentityRequest) {
    GetCallerIdentityRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetCallerIdentityRequest = exports.GetCallerIdentityRequest || (exports.GetCallerIdentityRequest = {}));
var GetCallerIdentityResponse;
(function (GetCallerIdentityResponse) {
    GetCallerIdentityResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetCallerIdentityResponse = exports.GetCallerIdentityResponse || (exports.GetCallerIdentityResponse = {}));
var GetFederationTokenRequest;
(function (GetFederationTokenRequest) {
    GetFederationTokenRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetFederationTokenRequest = exports.GetFederationTokenRequest || (exports.GetFederationTokenRequest = {}));
var FederatedUser;
(function (FederatedUser) {
    FederatedUser.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(FederatedUser = exports.FederatedUser || (exports.FederatedUser = {}));
var GetFederationTokenResponse;
(function (GetFederationTokenResponse) {
    GetFederationTokenResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetFederationTokenResponse = exports.GetFederationTokenResponse || (exports.GetFederationTokenResponse = {}));
var GetSessionTokenRequest;
(function (GetSessionTokenRequest) {
    GetSessionTokenRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetSessionTokenRequest = exports.GetSessionTokenRequest || (exports.GetSessionTokenRequest = {}));
var GetSessionTokenResponse;
(function (GetSessionTokenResponse) {
    GetSessionTokenResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetSessionTokenResponse = exports.GetSessionTokenResponse || (exports.GetSessionTokenResponse = {}));


/***/ }),
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRepositoryCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class CreateRepositoryCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "CreateRepositoryCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.CreateRepositoryRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.CreateRepositoryResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1CreateRepositoryCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1CreateRepositoryCommand(output, context);
    }
}
exports.CreateRepositoryCommand = CreateRepositoryCommand;


/***/ }),
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SetRepositoryPolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class SetRepositoryPolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "SetRepositoryPolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.SetRepositoryPolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.SetRepositoryPolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1SetRepositoryPolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1SetRepositoryPolicyCommand(output, context);
    }
}
exports.SetRepositoryPolicyCommand = SetRepositoryPolicyCommand;


/***/ }),
/* 51 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardRetryStrategy = void 0;
const protocol_http_1 = __webpack_require__(504);
const service_error_classification_1 = __webpack_require__(223);
const uuid_1 = __webpack_require__(281);
const config_1 = __webpack_require__(701);
const constants_1 = __webpack_require__(373);
const defaultRetryQuota_1 = __webpack_require__(814);
const delayDecider_1 = __webpack_require__(15);
const retryDecider_1 = __webpack_require__(932);
class StandardRetryStrategy {
    constructor(maxAttemptsProvider, options) {
        var _a, _b, _c;
        this.maxAttemptsProvider = maxAttemptsProvider;
        this.mode = config_1.RETRY_MODES.STANDARD;
        this.retryDecider = (_a = options === null || options === void 0 ? void 0 : options.retryDecider) !== null && _a !== void 0 ? _a : retryDecider_1.defaultRetryDecider;
        this.delayDecider = (_b = options === null || options === void 0 ? void 0 : options.delayDecider) !== null && _b !== void 0 ? _b : delayDecider_1.defaultDelayDecider;
        this.retryQuota = (_c = options === null || options === void 0 ? void 0 : options.retryQuota) !== null && _c !== void 0 ? _c : defaultRetryQuota_1.getDefaultRetryQuota(constants_1.INITIAL_RETRY_TOKENS);
    }
    shouldRetry(error, attempts, maxAttempts) {
        return attempts < maxAttempts && this.retryDecider(error) && this.retryQuota.hasRetryTokens(error);
    }
    async getMaxAttempts() {
        let maxAttempts;
        try {
            maxAttempts = await this.maxAttemptsProvider();
        }
        catch (error) {
            maxAttempts = config_1.DEFAULT_MAX_ATTEMPTS;
        }
        return maxAttempts;
    }
    async retry(next, args, options) {
        let retryTokenAmount;
        let attempts = 0;
        let totalDelay = 0;
        const maxAttempts = await this.getMaxAttempts();
        const { request } = args;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
            request.headers[constants_1.INVOCATION_ID_HEADER] = uuid_1.v4();
        }
        while (true) {
            try {
                if (protocol_http_1.HttpRequest.isInstance(request)) {
                    request.headers[constants_1.REQUEST_HEADER] = `attempt=${attempts + 1}; max=${maxAttempts}`;
                }
                if (options === null || options === void 0 ? void 0 : options.beforeRequest) {
                    await options.beforeRequest();
                }
                const { response, output } = await next(args);
                if (options === null || options === void 0 ? void 0 : options.afterRequest) {
                    options.afterRequest(response);
                }
                this.retryQuota.releaseRetryTokens(retryTokenAmount);
                output.$metadata.attempts = attempts + 1;
                output.$metadata.totalRetryDelay = totalDelay;
                return { response, output };
            }
            catch (e) {
                const err = asSdkError(e);
                attempts++;
                if (this.shouldRetry(err, attempts, maxAttempts)) {
                    retryTokenAmount = this.retryQuota.retrieveRetryTokens(err);
                    const delay = this.delayDecider(service_error_classification_1.isThrottlingError(err) ? constants_1.THROTTLING_RETRY_DELAY_BASE : constants_1.DEFAULT_RETRY_DELAY_BASE, attempts);
                    totalDelay += delay;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                if (!err.$metadata) {
                    err.$metadata = {};
                }
                err.$metadata.attempts = attempts;
                err.$metadata.totalRetryDelay = totalDelay;
                throw err;
            }
        }
    }
}
exports.StandardRetryStrategy = StandardRetryStrategy;
const asSdkError = (error) => {
    if (error instanceof Error)
        return error;
    if (error instanceof Object)
        return Object.assign(new Error(), error);
    if (typeof error === "string")
        return new Error(error);
    return new Error(`AWS SDK error wrapper for ${error}`);
};


/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneQuery = exports.cloneRequest = void 0;
const cloneRequest = ({ headers, query, ...rest }) => ({
    ...rest,
    headers: { ...headers },
    query: query ? exports.cloneQuery(query) : undefined,
});
exports.cloneRequest = cloneRequest;
const cloneQuery = (query) => Object.keys(query).reduce((carry, paramName) => {
    const param = query[paramName];
    return {
        ...carry,
        [paramName]: Array.isArray(param) ? [...param] : param,
    };
}, {});
exports.cloneQuery = cloneQuery;


/***/ }),
/* 58 */,
/* 59 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromString = exports.fromArrayBuffer = void 0;
const is_array_buffer_1 = __webpack_require__(910);
const buffer_1 = __webpack_require__(293);
const fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
    if (!is_array_buffer_1.isArrayBuffer(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
    }
    return buffer_1.Buffer.from(input, offset, length);
};
exports.fromArrayBuffer = fromArrayBuffer;
const fromString = (input, encoding) => {
    if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
    }
    return encoding ? buffer_1.Buffer.from(input, encoding) : buffer_1.Buffer.from(input);
};
exports.fromString = fromString;


/***/ }),
/* 60 */,
/* 61 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchDeleteImageCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class BatchDeleteImageCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "BatchDeleteImageCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.BatchDeleteImageRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.BatchDeleteImageResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1BatchDeleteImageCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1BatchDeleteImageCommand(output, context);
    }
}
exports.BatchDeleteImageCommand = BatchDeleteImageCommand;


/***/ }),
/* 62 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEpochTimestamp = exports.parseRfc7231DateTime = exports.parseRfc3339DateTime = exports.dateToUtcString = void 0;
const parse_utils_1 = __webpack_require__(816);
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function dateToUtcString(date) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const dayOfWeek = date.getUTCDay();
    const dayOfMonthInt = date.getUTCDate();
    const hoursInt = date.getUTCHours();
    const minutesInt = date.getUTCMinutes();
    const secondsInt = date.getUTCSeconds();
    const dayOfMonthString = dayOfMonthInt < 10 ? `0${dayOfMonthInt}` : `${dayOfMonthInt}`;
    const hoursString = hoursInt < 10 ? `0${hoursInt}` : `${hoursInt}`;
    const minutesString = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
    const secondsString = secondsInt < 10 ? `0${secondsInt}` : `${secondsInt}`;
    return `${DAYS[dayOfWeek]}, ${dayOfMonthString} ${MONTHS[month]} ${year} ${hoursString}:${minutesString}:${secondsString} GMT`;
}
exports.dateToUtcString = dateToUtcString;
const RFC3339 = new RegExp(/^(?<Y>\d{4})-(?<M>\d{2})-(?<D>\d{2})[tT](?<H>\d{2}):(?<m>\d{2}):(?<s>\d{2})(?:\.(?<frac>\d+))?[zZ]$/);
const parseRfc3339DateTime = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new TypeError("RFC-3339 date-times must be expressed as strings");
    }
    const match = RFC3339.exec(value);
    if (!match || !match.groups) {
        throw new TypeError("Invalid RFC-3339 date-time value");
    }
    const year = parse_utils_1.strictParseShort(stripLeadingZeroes(match.groups["Y"]));
    const month = parseDateValue(match.groups["M"], "month", 1, 12);
    const day = parseDateValue(match.groups["D"], "day", 1, 31);
    return buildDate(year, month, day, match);
};
exports.parseRfc3339DateTime = parseRfc3339DateTime;
const IMF_FIXDATE = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun), (?<D>\d{2}) (?<M>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<Y>\d{4}) (?<H>\d{2}):(?<m>\d{2}):(?<s>\d{2})(?:\.(?<frac>\d+))? GMT$/);
const RFC_850_DATE = new RegExp(/^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (?<D>\d{2})-(?<M>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(?<Y>\d{2}) (?<H>\d{2}):(?<m>\d{2}):(?<s>\d{2})(?:\.(?<frac>\d+))? GMT$/);
const ASC_TIME = new RegExp(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?<M>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (?<D> [1-9]|\d{2}) (?<H>\d{2}):(?<m>\d{2}):(?<s>\d{2})(?:\.(?<frac>\d+))? (?<Y>\d{4})$/);
const parseRfc7231DateTime = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value !== "string") {
        throw new TypeError("RFC-7231 date-times must be expressed as strings");
    }
    let dayFn = (value) => parseDateValue(value, "day", 1, 31);
    let yearFn = (value) => parse_utils_1.strictParseShort(stripLeadingZeroes(value));
    let dateAdjustmentFn = (value) => value;
    let match = IMF_FIXDATE.exec(value);
    if (!match || !match.groups) {
        match = RFC_850_DATE.exec(value);
        if (match && match.groups) {
            yearFn = parseTwoDigitYear;
            dateAdjustmentFn = adjustRfc850Year;
        }
        else {
            match = ASC_TIME.exec(value);
            if (match && match.groups) {
                dayFn = (value) => parseDateValue(value.trimLeft(), "day", 1, 31);
            }
            else {
                throw new TypeError("Invalid RFC-7231 date-time value");
            }
        }
    }
    const year = yearFn(match.groups["Y"]);
    const month = parseMonthByShortName(match.groups["M"]);
    const day = dayFn(match.groups["D"]);
    return dateAdjustmentFn(buildDate(year, month, day, match));
};
exports.parseRfc7231DateTime = parseRfc7231DateTime;
const parseEpochTimestamp = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    let valueAsDouble;
    if (typeof value === "number") {
        valueAsDouble = value;
    }
    else if (typeof value === "string") {
        valueAsDouble = parse_utils_1.strictParseDouble(value);
    }
    else {
        throw new TypeError("Epoch timestamps must be expressed as floating point numbers or their string representation");
    }
    if (Number.isNaN(valueAsDouble) || valueAsDouble === Infinity || valueAsDouble === -Infinity) {
        throw new TypeError("Epoch timestamps must be valid, non-Infinite, non-NaN numerics");
    }
    return new Date(Math.round(valueAsDouble * 1000));
};
exports.parseEpochTimestamp = parseEpochTimestamp;
const buildDate = (year, month, day, match) => {
    const adjustedMonth = month - 1;
    validateDayOfMonth(year, adjustedMonth, day);
    return new Date(Date.UTC(year, adjustedMonth, day, parseDateValue(match.groups["H"], "hour", 0, 23), parseDateValue(match.groups["m"], "minute", 0, 59), parseDateValue(match.groups["s"], "seconds", 0, 60), parseMilliseconds(match.groups["frac"])));
};
const parseTwoDigitYear = (value) => {
    const thisYear = new Date().getUTCFullYear();
    const valueInThisCentury = Math.floor(thisYear / 100) * 100 + parse_utils_1.strictParseShort(stripLeadingZeroes(value));
    if (valueInThisCentury < thisYear) {
        return valueInThisCentury + 100;
    }
    return valueInThisCentury;
};
const FIFTY_YEARS_IN_MILLIS = 50 * 365 * 24 * 60 * 60 * 1000;
const adjustRfc850Year = (input) => {
    if (input.getTime() - new Date().getTime() > FIFTY_YEARS_IN_MILLIS) {
        return new Date(Date.UTC(input.getUTCFullYear() - 100, input.getUTCMonth(), input.getUTCDate(), input.getUTCHours(), input.getUTCMinutes(), input.getUTCSeconds(), input.getUTCMilliseconds()));
    }
    return input;
};
const parseMonthByShortName = (value) => {
    const monthIdx = MONTHS.indexOf(value);
    if (monthIdx < 0) {
        throw new TypeError(`Invalid month: ${value}`);
    }
    return monthIdx + 1;
};
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const validateDayOfMonth = (year, month, day) => {
    let maxDays = DAYS_IN_MONTH[month];
    if (month === 1 && isLeapYear(year)) {
        maxDays = 29;
    }
    if (day > maxDays) {
        throw new TypeError(`Invalid day for ${MONTHS[month]} in ${year}: ${day}`);
    }
};
const isLeapYear = (year) => {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
};
const parseDateValue = (value, type, lower, upper) => {
    const dateVal = parse_utils_1.strictParseByte(stripLeadingZeroes(value));
    if (dateVal < lower || dateVal > upper) {
        throw new TypeError(`${type} must be between ${lower} and ${upper}, inclusive`);
    }
    return dateVal;
};
const parseMilliseconds = (value) => {
    if (value === null || value === undefined) {
        return 0;
    }
    return parse_utils_1.strictParseFloat32("0." + value) * 1000;
};
const stripLeadingZeroes = (value) => {
    let idx = 0;
    while (idx < value.length - 1 && value.charAt(idx) === "0") {
        idx++;
    }
    if (idx === 0) {
        return value;
    }
    return value.slice(idx);
};


/***/ }),
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */
/***/ (function(module) {

"use strict";


module.exports = function(tagname, parent, val) {
  this.tagname = tagname;
  this.parent = parent;
  this.child = {}; //child tags
  this.attrsMap = {}; //attributes map
  this.val = val; //text only
  this.addChild = function(child) {
    if (Array.isArray(this.child[child.tagname])) {
      //already presents
      this.child[child.tagname].push(child);
    } else {
      this.child[child.tagname] = [child];
    }
  };
};


/***/ }),
/* 67 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toDate = exports.iso8601 = void 0;
const iso8601 = (time) => exports.toDate(time)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");
exports.iso8601 = iso8601;
const toDate = (time) => {
    if (typeof time === "number") {
        return new Date(time * 1000);
    }
    if (typeof time === "string") {
        if (Number(time)) {
            return new Date(Number(time) * 1000);
        }
        return new Date(time);
    }
    return time;
};
exports.toDate = toDate;


/***/ }),
/* 68 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(280), exports);
tslib_1.__exportStar(__webpack_require__(498), exports);
tslib_1.__exportStar(__webpack_require__(91), exports);
tslib_1.__exportStar(__webpack_require__(473), exports);


/***/ }),
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = void 0;
const sleep = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
exports.sleep = sleep;


/***/ }),
/* 77 */,
/* 78 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regex = _interopRequireDefault(__webpack_require__(456));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports.default = _default;

/***/ }),
/* 79 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.InitiateLayerUploadCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class InitiateLayerUploadCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "InitiateLayerUploadCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.InitiateLayerUploadRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.InitiateLayerUploadResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1InitiateLayerUploadCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1InitiateLayerUploadCommand(output, context);
    }
}
exports.InitiateLayerUploadCommand = InitiateLayerUploadCommand;


/***/ }),
/* 80 */,
/* 81 */
/***/ (function(module) {

module.exports = {"_from":"@aws-sdk/client-sso@3.40.0","_id":"@aws-sdk/client-sso@3.40.0","_inBundle":false,"_integrity":"sha512-eFQ4yFg8RlPaldv/ja2K3pUUyXauGbo4GJPlbPKYoquwW785au8qECKSl3iqBmUklj6WmdW1rmtlQk2OUcyYSw==","_location":"/@aws-sdk/client-sso","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"@aws-sdk/client-sso@3.40.0","name":"@aws-sdk/client-sso","escapedName":"@aws-sdk%2fclient-sso","scope":"@aws-sdk","rawSpec":"3.40.0","saveSpec":null,"fetchSpec":"3.40.0"},"_requiredBy":["/@aws-sdk/credential-provider-sso"],"_resolved":"https://registry.npmjs.org/@aws-sdk/client-sso/-/client-sso-3.40.0.tgz","_shasum":"aaa68fc6b0c509ced0c4291d3b85c075f0b16222","_spec":"@aws-sdk/client-sso@3.40.0","_where":"/Users/lior.kuperiu/lemonade/amazon-ecr-login/node_modules/@aws-sdk/credential-provider-sso","author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"bugs":{"url":"https://github.com/aws/aws-sdk-js-v3/issues"},"bundleDependencies":false,"dependencies":{"@aws-crypto/sha256-browser":"2.0.0","@aws-crypto/sha256-js":"2.0.0","@aws-sdk/config-resolver":"3.40.0","@aws-sdk/fetch-http-handler":"3.40.0","@aws-sdk/hash-node":"3.40.0","@aws-sdk/invalid-dependency":"3.40.0","@aws-sdk/middleware-content-length":"3.40.0","@aws-sdk/middleware-host-header":"3.40.0","@aws-sdk/middleware-logger":"3.40.0","@aws-sdk/middleware-retry":"3.40.0","@aws-sdk/middleware-serde":"3.40.0","@aws-sdk/middleware-stack":"3.40.0","@aws-sdk/middleware-user-agent":"3.40.0","@aws-sdk/node-config-provider":"3.40.0","@aws-sdk/node-http-handler":"3.40.0","@aws-sdk/protocol-http":"3.40.0","@aws-sdk/smithy-client":"3.40.0","@aws-sdk/types":"3.40.0","@aws-sdk/url-parser":"3.40.0","@aws-sdk/util-base64-browser":"3.37.0","@aws-sdk/util-base64-node":"3.37.0","@aws-sdk/util-body-length-browser":"3.37.0","@aws-sdk/util-body-length-node":"3.37.0","@aws-sdk/util-user-agent-browser":"3.40.0","@aws-sdk/util-user-agent-node":"3.40.0","@aws-sdk/util-utf8-browser":"3.37.0","@aws-sdk/util-utf8-node":"3.37.0","tslib":"^2.3.0"},"deprecated":false,"description":"AWS SDK for JavaScript Sso Client for Node.js, Browser and React Native","devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.38.0","@types/node":"^12.7.5","downlevel-dts":"0.7.0","jest":"^26.1.0","rimraf":"^3.0.0","ts-jest":"^26.4.1","typedoc":"^0.19.2","typescript":"~4.3.5"},"engines":{"node":">=10.0.0"},"files":["dist-*"],"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sso","license":"Apache-2.0","main":"./dist-cjs/index.js","module":"./dist-es/index.js","name":"@aws-sdk/client-sso","react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"repository":{"type":"git","url":"git+https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-sso"},"scripts":{"build":"yarn build:cjs && yarn build:es && yarn build:types","build:cjs":"tsc -p tsconfig.json","build:docs":"yarn clean:docs && typedoc ./","build:es":"tsc -p tsconfig.es.json","build:types":"tsc -p tsconfig.types.json","clean":"yarn clean:dist && yarn clean:docs","clean:dist":"rimraf ./dist","clean:docs":"rimraf ./docs","downlevel-dts":"downlevel-dts dist-types dist-types/ts3.4","test":"exit 0"},"sideEffects":false,"types":"./dist-types/index.d.ts","typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"version":"3.40.0"};

/***/ }),
/* 82 */
/***/ (function(__unusedmodule, exports) {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),
/* 83 */,
/* 84 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_PRESIGNED_TTL = exports.KEY_TYPE_IDENTIFIER = exports.MAX_CACHE_SIZE = exports.UNSIGNED_PAYLOAD = exports.EVENT_ALGORITHM_IDENTIFIER = exports.ALGORITHM_IDENTIFIER_V4A = exports.ALGORITHM_IDENTIFIER = exports.UNSIGNABLE_PATTERNS = exports.SEC_HEADER_PATTERN = exports.PROXY_HEADER_PATTERN = exports.ALWAYS_UNSIGNABLE_HEADERS = exports.HOST_HEADER = exports.TOKEN_HEADER = exports.SHA256_HEADER = exports.SIGNATURE_HEADER = exports.GENERATED_HEADERS = exports.DATE_HEADER = exports.AMZ_DATE_HEADER = exports.AUTH_HEADER = exports.REGION_SET_PARAM = exports.TOKEN_QUERY_PARAM = exports.SIGNATURE_QUERY_PARAM = exports.EXPIRES_QUERY_PARAM = exports.SIGNED_HEADERS_QUERY_PARAM = exports.AMZ_DATE_QUERY_PARAM = exports.CREDENTIAL_QUERY_PARAM = exports.ALGORITHM_QUERY_PARAM = void 0;
exports.ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
exports.CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
exports.AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
exports.SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
exports.EXPIRES_QUERY_PARAM = "X-Amz-Expires";
exports.SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
exports.TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
exports.REGION_SET_PARAM = "X-Amz-Region-Set";
exports.AUTH_HEADER = "authorization";
exports.AMZ_DATE_HEADER = exports.AMZ_DATE_QUERY_PARAM.toLowerCase();
exports.DATE_HEADER = "date";
exports.GENERATED_HEADERS = [exports.AUTH_HEADER, exports.AMZ_DATE_HEADER, exports.DATE_HEADER];
exports.SIGNATURE_HEADER = exports.SIGNATURE_QUERY_PARAM.toLowerCase();
exports.SHA256_HEADER = "x-amz-content-sha256";
exports.TOKEN_HEADER = exports.TOKEN_QUERY_PARAM.toLowerCase();
exports.HOST_HEADER = "host";
exports.ALWAYS_UNSIGNABLE_HEADERS = {
    authorization: true,
    "cache-control": true,
    connection: true,
    expect: true,
    from: true,
    "keep-alive": true,
    "max-forwards": true,
    pragma: true,
    referer: true,
    te: true,
    trailer: true,
    "transfer-encoding": true,
    upgrade: true,
    "user-agent": true,
    "x-amzn-trace-id": true,
};
exports.PROXY_HEADER_PATTERN = /^proxy-/;
exports.SEC_HEADER_PATTERN = /^sec-/;
exports.UNSIGNABLE_PATTERNS = [/^proxy-/i, /^sec-/i];
exports.ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
exports.ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256";
exports.EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
exports.UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
exports.MAX_CACHE_SIZE = 50;
exports.KEY_TYPE_IDENTIFIER = "aws4_request";
exports.MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;


/***/ }),
/* 85 */,
/* 86 */,
/* 87 */
/***/ (function(module) {

module.exports = require("os");

/***/ }),
/* 88 */,
/* 89 */,
/* 90 */,
/* 91 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCustomEndpointsConfig = void 0;
const normalizeBoolean_1 = __webpack_require__(927);
const normalizeEndpoint_1 = __webpack_require__(541);
const resolveCustomEndpointsConfig = (input) => {
    var _a;
    return ({
        ...input,
        tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true,
        endpoint: normalizeEndpoint_1.normalizeEndpoint(input),
        isCustomEndpoint: true,
        useDualstackEndpoint: normalizeBoolean_1.normalizeBoolean(input.useDualstackEndpoint),
    });
};
exports.resolveCustomEndpointsConfig = resolveCustomEndpointsConfig;


/***/ }),
/* 92 */,
/* 93 */,
/* 94 */,
/* 95 */,
/* 96 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultUserAgent = exports.UA_APP_ID_INI_NAME = exports.UA_APP_ID_ENV_NAME = void 0;
const node_config_provider_1 = __webpack_require__(519);
const os_1 = __webpack_require__(87);
const process_1 = __webpack_require__(316);
const is_crt_available_1 = __webpack_require__(454);
exports.UA_APP_ID_ENV_NAME = "AWS_SDK_UA_APP_ID";
exports.UA_APP_ID_INI_NAME = "sdk-ua-app-id";
const defaultUserAgent = ({ serviceId, clientVersion }) => {
    const sections = [
        ["aws-sdk-js", clientVersion],
        [`os/${os_1.platform()}`, os_1.release()],
        ["lang/js"],
        ["md/nodejs", `${process_1.versions.node}`],
    ];
    const crtAvailable = is_crt_available_1.isCrtAvailable();
    if (crtAvailable) {
        sections.push(crtAvailable);
    }
    if (serviceId) {
        sections.push([`api/${serviceId}`, clientVersion]);
    }
    if (process_1.env.AWS_EXECUTION_ENV) {
        sections.push([`exec-env/${process_1.env.AWS_EXECUTION_ENV}`]);
    }
    const appIdPromise = node_config_provider_1.loadConfig({
        environmentVariableSelector: (env) => env[exports.UA_APP_ID_ENV_NAME],
        configFileSelector: (profile) => profile[exports.UA_APP_ID_INI_NAME],
        default: undefined,
    })();
    let resolvedUserAgent = undefined;
    return async () => {
        if (!resolvedUserAgent) {
            const appId = await appIdPromise;
            resolvedUserAgent = appId ? [...sections, [`app/${appId}`]] : [...sections];
        }
        return resolvedUserAgent;
    };
};
exports.defaultUserAgent = defaultUserAgent;


/***/ }),
/* 97 */,
/* 98 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PutRegistryPolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class PutRegistryPolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "PutRegistryPolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.PutRegistryPolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.PutRegistryPolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1PutRegistryPolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1PutRegistryPolicyCommand(output, context);
    }
}
exports.PutRegistryPolicyCommand = PutRegistryPolicyCommand;


/***/ }),
/* 99 */,
/* 100 */,
/* 101 */,
/* 102 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issueCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),
/* 103 */,
/* 104 */
/***/ (function(module, __unusedexports, __webpack_require__) {

const core = __webpack_require__(470);
const exec = __webpack_require__(986);
const { ECRClient, GetAuthorizationTokenCommand } = __webpack_require__(283);

function replaceSpecialCharacters(registryUri) {
  return registryUri.replace(/[^a-zA-Z0-9_]+/g, '_')
}

async function run() {
  const registryUriState = [];
  const skipLogout = core.getInput('skip-logout', { required: false });

  try {
    const registries = core.getInput('registries', { required: false });

    // Get the ECR authorization token
    const client = new ECRClient({ region: "us-east-1" });
    const command = new GetAuthorizationTokenCommand({});
    const results = await client.send(command);

    const authTokenRequest = {};
    if (registries) {
      const registryIds = registries.split(',');
      core.debug(`Requesting auth token for ${registryIds.length} registries:`);
      for (const id of registryIds) {
        core.debug(`  '${id}'`);
      }
      authTokenRequest.registryIds = registryIds;
    }
    // const authTokenResponse = results;
    // if (!Array.isArray(authTokenResponse.authorizationData) || !authTokenResponse.authorizationData.length) {
    //   throw new Error('Could not retrieve an authorization token from Amazon ECR');
    // }

    for (const authData of results.authorizationData) {
      const authToken = Buffer.from(authData.authorizationToken, 'base64').toString('utf-8');
      const creds = authToken.split(':', 2);
      const proxyEndpoint = authData.proxyEndpoint;
      const registryUri = proxyEndpoint.replace(/^https?:\/\//,'');

      if (results.authorizationData.length == 1) {
        // output the registry URI if this action is doing a single registry login
        core.setOutput('registry', registryUri);
      }

      // Execute the docker login command
      let doLoginStdout = '';
      let doLoginStderr = '';
      const exitCode = await exec.exec('docker login', ['-u', creds[0], '-p', creds[1], proxyEndpoint], {
        silent: true,
        ignoreReturnCode: true,
        listeners: {
          stdout: (data) => {
            doLoginStdout += data.toString();
          },
          stderr: (data) => {
            doLoginStderr += data.toString();
          }
        }
      });

      if (exitCode != 0) {
        core.debug(doLoginStdout);
        throw new Error('Could not login: ' + doLoginStderr);
      }

      const secretSuffix = replaceSpecialCharacters(registryUri)
      core.setOutput(`docker_username_${secretSuffix}`, creds[0]);
      core.setOutput(`docker_password_${secretSuffix}`, creds[1]);

      registryUriState.push(registryUri);
    }
  }
  catch (error) {
    core.setFailed(error.message);
  }

  // Pass the logged-in registry URIs to the post action for logout
  if (registryUriState.length) {
    if (!skipLogout) {
        core.saveState('registries', registryUriState.join());
    }
    core.debug(`'skip-logout' is ${skipLogout} for ${registryUriState.length} registries.`);
  }
}

module.exports = {
  run,
  replaceSpecialCharacters
};

/* istanbul ignore next */
if (require.main === require.cache[eval('__filename')]) {
    run();
}

/***/ }),
/* 105 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(993), exports);
tslib_1.__exportStar(__webpack_require__(706), exports);


/***/ }),
/* 106 */,
/* 107 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 108 */,
/* 109 */,
/* 110 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromTokenFile = void 0;
const property_provider_1 = __webpack_require__(948);
const fs_1 = __webpack_require__(747);
const fromWebToken_1 = __webpack_require__(408);
const ENV_TOKEN_FILE = "AWS_WEB_IDENTITY_TOKEN_FILE";
const ENV_ROLE_ARN = "AWS_ROLE_ARN";
const ENV_ROLE_SESSION_NAME = "AWS_ROLE_SESSION_NAME";
const fromTokenFile = (init = {}) => async () => {
    return resolveTokenFile(init);
};
exports.fromTokenFile = fromTokenFile;
const resolveTokenFile = (init) => {
    var _a, _b, _c;
    const webIdentityTokenFile = (_a = init === null || init === void 0 ? void 0 : init.webIdentityTokenFile) !== null && _a !== void 0 ? _a : process.env[ENV_TOKEN_FILE];
    const roleArn = (_b = init === null || init === void 0 ? void 0 : init.roleArn) !== null && _b !== void 0 ? _b : process.env[ENV_ROLE_ARN];
    const roleSessionName = (_c = init === null || init === void 0 ? void 0 : init.roleSessionName) !== null && _c !== void 0 ? _c : process.env[ENV_ROLE_SESSION_NAME];
    if (!webIdentityTokenFile || !roleArn) {
        throw new property_provider_1.CredentialsProviderError("Web identity configuration not specified");
    }
    return fromWebToken_1.fromWebToken({
        ...init,
        webIdentityToken: fs_1.readFileSync(webIdentityTokenFile, { encoding: "ascii" }),
        roleArn,
        roleSessionName,
    })();
};


/***/ }),
/* 111 */,
/* 112 */,
/* 113 */,
/* 114 */,
/* 115 */,
/* 116 */,
/* 117 */,
/* 118 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
const middleware_stack_1 = __webpack_require__(349);
class Command {
    constructor() {
        this.middlewareStack = middleware_stack_1.constructStack();
    }
}
exports.Command = Command;


/***/ }),
/* 119 */,
/* 120 */,
/* 121 */,
/* 122 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveStsAuthConfig = void 0;
const middleware_signing_1 = __webpack_require__(307);
const resolveStsAuthConfig = (input, { stsClientCtor }) => middleware_signing_1.resolveAwsAuthConfig({
    ...input,
    stsClientCtor,
});
exports.resolveStsAuthConfig = resolveStsAuthConfig;


/***/ }),
/* 123 */,
/* 124 */,
/* 125 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultProvider = exports.ENV_IMDS_DISABLED = void 0;
const credential_provider_env_1 = __webpack_require__(554);
const credential_provider_imds_1 = __webpack_require__(146);
const credential_provider_ini_1 = __webpack_require__(850);
const credential_provider_process_1 = __webpack_require__(964);
const credential_provider_sso_1 = __webpack_require__(168);
const credential_provider_web_identity_1 = __webpack_require__(590);
const property_provider_1 = __webpack_require__(948);
const shared_ini_file_loader_1 = __webpack_require__(360);
const util_credentials_1 = __webpack_require__(339);
exports.ENV_IMDS_DISABLED = "AWS_EC2_METADATA_DISABLED";
const defaultProvider = (init = {}) => {
    const options = { profile: process.env[util_credentials_1.ENV_PROFILE], ...init };
    if (!options.loadedConfig)
        options.loadedConfig = shared_ini_file_loader_1.loadSharedConfigFiles(init);
    const providers = [
        credential_provider_sso_1.fromSSO(options),
        credential_provider_ini_1.fromIni(options),
        credential_provider_process_1.fromProcess(options),
        credential_provider_web_identity_1.fromTokenFile(options),
        remoteProvider(options),
        async () => {
            throw new property_provider_1.CredentialsProviderError("Could not load credentials from any providers", false);
        },
    ];
    if (!options.profile)
        providers.unshift(credential_provider_env_1.fromEnv());
    const providerChain = property_provider_1.chain(...providers);
    return property_provider_1.memoize(providerChain, (credentials) => credentials.expiration !== undefined && credentials.expiration.getTime() - Date.now() < 300000, (credentials) => credentials.expiration !== undefined);
};
exports.defaultProvider = defaultProvider;
const remoteProvider = (init) => {
    if (process.env[credential_provider_imds_1.ENV_CMDS_RELATIVE_URI] || process.env[credential_provider_imds_1.ENV_CMDS_FULL_URI]) {
        return credential_provider_imds_1.fromContainerMetadata(init);
    }
    if (process.env[exports.ENV_IMDS_DISABLED]) {
        return () => Promise.reject(new property_provider_1.CredentialsProviderError("EC2 Instance Metadata Service access disabled"));
    }
    return credential_provider_imds_1.fromInstanceMetadata(init);
};


/***/ }),
/* 126 */,
/* 127 */,
/* 128 */,
/* 129 */
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),
/* 130 */,
/* 131 */,
/* 132 */,
/* 133 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCallerIdentityCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const middleware_signing_1 = __webpack_require__(307);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class GetCallerIdentityCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetCallerIdentityCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetCallerIdentityRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetCallerIdentityResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryGetCallerIdentityCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryGetCallerIdentityCommand(output, context);
    }
}
exports.GetCallerIdentityCommand = GetCallerIdentityCommand;


/***/ }),
/* 134 */,
/* 135 */,
/* 136 */,
/* 137 */,
/* 138 */,
/* 139 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(711), exports);
tslib_1.__exportStar(__webpack_require__(982), exports);
tslib_1.__exportStar(__webpack_require__(767), exports);
tslib_1.__exportStar(__webpack_require__(947), exports);
tslib_1.__exportStar(__webpack_require__(107), exports);
tslib_1.__exportStar(__webpack_require__(149), exports);


/***/ }),
/* 140 */,
/* 141 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var net = __webpack_require__(631);
var tls = __webpack_require__(16);
var http = __webpack_require__(605);
var https = __webpack_require__(211);
var events = __webpack_require__(614);
var assert = __webpack_require__(357);
var util = __webpack_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),
/* 142 */,
/* 143 */,
/* 144 */
/***/ (function(module) {

module.exports = {"_from":"@aws-sdk/client-ecr","_id":"@aws-sdk/client-ecr@3.40.0","_inBundle":false,"_integrity":"sha512-werISZ7ZZiRxf1StyXVQfUAk2sHj/TnNRqkuqCwCDVDUZ5RVM1OedaWa+DrUVgHwb7X0jAzxWkF3B3tlPYAuOg==","_location":"/@aws-sdk/client-ecr","_phantomChildren":{},"_requested":{"type":"tag","registry":true,"raw":"@aws-sdk/client-ecr","name":"@aws-sdk/client-ecr","escapedName":"@aws-sdk%2fclient-ecr","scope":"@aws-sdk","rawSpec":"","saveSpec":null,"fetchSpec":"latest"},"_requiredBy":["#USER","/"],"_resolved":"https://registry.npmjs.org/@aws-sdk/client-ecr/-/client-ecr-3.40.0.tgz","_shasum":"721b57db044d3ae2c188786d19fcb5759ef59664","_spec":"@aws-sdk/client-ecr","_where":"/Users/lior.kuperiu/lemonade/amazon-ecr-login","author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"bugs":{"url":"https://github.com/aws/aws-sdk-js-v3/issues"},"bundleDependencies":false,"dependencies":{"@aws-crypto/sha256-browser":"2.0.0","@aws-crypto/sha256-js":"2.0.0","@aws-sdk/client-sts":"3.40.0","@aws-sdk/config-resolver":"3.40.0","@aws-sdk/credential-provider-node":"3.40.0","@aws-sdk/fetch-http-handler":"3.40.0","@aws-sdk/hash-node":"3.40.0","@aws-sdk/invalid-dependency":"3.40.0","@aws-sdk/middleware-content-length":"3.40.0","@aws-sdk/middleware-host-header":"3.40.0","@aws-sdk/middleware-logger":"3.40.0","@aws-sdk/middleware-retry":"3.40.0","@aws-sdk/middleware-serde":"3.40.0","@aws-sdk/middleware-signing":"3.40.0","@aws-sdk/middleware-stack":"3.40.0","@aws-sdk/middleware-user-agent":"3.40.0","@aws-sdk/node-config-provider":"3.40.0","@aws-sdk/node-http-handler":"3.40.0","@aws-sdk/protocol-http":"3.40.0","@aws-sdk/smithy-client":"3.40.0","@aws-sdk/types":"3.40.0","@aws-sdk/url-parser":"3.40.0","@aws-sdk/util-base64-browser":"3.37.0","@aws-sdk/util-base64-node":"3.37.0","@aws-sdk/util-body-length-browser":"3.37.0","@aws-sdk/util-body-length-node":"3.37.0","@aws-sdk/util-user-agent-browser":"3.40.0","@aws-sdk/util-user-agent-node":"3.40.0","@aws-sdk/util-utf8-browser":"3.37.0","@aws-sdk/util-utf8-node":"3.37.0","@aws-sdk/util-waiter":"3.40.0","tslib":"^2.3.0"},"deprecated":false,"description":"AWS SDK for JavaScript Ecr Client for Node.js, Browser and React Native","devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.38.0","@types/node":"^12.7.5","downlevel-dts":"0.7.0","jest":"^26.1.0","rimraf":"^3.0.0","ts-jest":"^26.4.1","typedoc":"^0.19.2","typescript":"~4.3.5"},"engines":{"node":">=10.0.0"},"files":["dist-*"],"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-ecr","license":"Apache-2.0","main":"./dist-cjs/index.js","module":"./dist-es/index.js","name":"@aws-sdk/client-ecr","react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"repository":{"type":"git","url":"git+https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-ecr"},"scripts":{"build":"yarn build:cjs && yarn build:es && yarn build:types","build:cjs":"tsc -p tsconfig.json","build:docs":"yarn clean:docs && typedoc ./","build:es":"tsc -p tsconfig.es.json","build:types":"tsc -p tsconfig.types.json","clean":"yarn clean:dist && yarn clean:docs","clean:dist":"rimraf ./dist","clean:docs":"rimraf ./docs","downlevel-dts":"downlevel-dts dist-types dist-types/ts3.4","test":"exit 0"},"sideEffects":false,"types":"./dist-types/index.d.ts","typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"version":"3.40.0"};

/***/ }),
/* 145 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash = void 0;
const util_buffer_from_1 = __webpack_require__(59);
const buffer_1 = __webpack_require__(293);
const crypto_1 = __webpack_require__(417);
class Hash {
    constructor(algorithmIdentifier, secret) {
        this.hash = secret ? crypto_1.createHmac(algorithmIdentifier, castSourceData(secret)) : crypto_1.createHash(algorithmIdentifier);
    }
    update(toHash, encoding) {
        this.hash.update(castSourceData(toHash, encoding));
    }
    digest() {
        return Promise.resolve(this.hash.digest());
    }
}
exports.Hash = Hash;
function castSourceData(toCast, encoding) {
    if (buffer_1.Buffer.isBuffer(toCast)) {
        return toCast;
    }
    if (typeof toCast === "string") {
        return util_buffer_from_1.fromString(toCast, encoding);
    }
    if (ArrayBuffer.isView(toCast)) {
        return util_buffer_from_1.fromArrayBuffer(toCast.buffer, toCast.byteOffset, toCast.byteLength);
    }
    return util_buffer_from_1.fromArrayBuffer(toCast);
}


/***/ }),
/* 146 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(230), exports);
tslib_1.__exportStar(__webpack_require__(846), exports);


/***/ }),
/* 147 */,
/* 148 */,
/* 149 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateListImages = void 0;
const ListImagesCommand_1 = __webpack_require__(652);
const ECR_1 = __webpack_require__(410);
const ECRClient_1 = __webpack_require__(429);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListImagesCommand_1.ListImagesCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.listImages(input, ...args);
};
async function* paginateListImages(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof ECR_1.ECR) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof ECRClient_1.ECRClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected ECR | ECRClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateListImages = paginateListImages;


/***/ }),
/* 150 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadHash = void 0;
const is_array_buffer_1 = __webpack_require__(910);
const util_hex_encoding_1 = __webpack_require__(754);
const constants_1 = __webpack_require__(84);
const getPayloadHash = async ({ headers, body }, hashConstructor) => {
    for (const headerName of Object.keys(headers)) {
        if (headerName.toLowerCase() === constants_1.SHA256_HEADER) {
            return headers[headerName];
        }
    }
    if (body == undefined) {
        return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    }
    else if (typeof body === "string" || ArrayBuffer.isView(body) || is_array_buffer_1.isArrayBuffer(body)) {
        const hashCtor = new hashConstructor();
        hashCtor.update(body);
        return util_hex_encoding_1.toHex(await hashCtor.digest());
    }
    return constants_1.UNSIGNED_PAYLOAD;
};
exports.getPayloadHash = getPayloadHash;


/***/ }),
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoryPolicyNotFoundException = exports.DeleteRepositoryPolicyResponse = exports.DeleteRepositoryPolicyRequest = exports.RepositoryNotEmptyException = exports.DeleteRepositoryResponse = exports.DeleteRepositoryRequest = exports.ValidationException = exports.RegistryPolicyNotFoundException = exports.DeleteRegistryPolicyResponse = exports.DeleteRegistryPolicyRequest = exports.LifecyclePolicyNotFoundException = exports.DeleteLifecyclePolicyResponse = exports.DeleteLifecyclePolicyRequest = exports.TooManyTagsException = exports.RepositoryAlreadyExistsException = exports.LimitExceededException = exports.InvalidTagParameterException = exports.CreateRepositoryResponse = exports.Repository = exports.CreateRepositoryRequest = exports.Tag = exports.ImageTagMutability = exports.ImageScanningConfiguration = exports.EncryptionConfiguration = exports.EncryptionType = exports.UploadNotFoundException = exports.LayerPartTooSmallException = exports.LayerAlreadyExistsException = exports.KmsException = exports.InvalidLayerException = exports.EmptyUploadException = exports.CompleteLayerUploadResponse = exports.CompleteLayerUploadRequest = exports.BatchGetImageResponse = exports.Image = exports.BatchGetImageRequest = exports.BatchDeleteImageResponse = exports.ImageFailure = exports.ImageFailureCode = exports.BatchDeleteImageRequest = exports.ImageIdentifier = exports.ServerException = exports.RepositoryNotFoundException = exports.InvalidParameterException = exports.BatchCheckLayerAvailabilityResponse = exports.Layer = exports.LayerAvailability = exports.LayerFailure = exports.LayerFailureCode = exports.BatchCheckLayerAvailabilityRequest = void 0;
exports.GetRepositoryPolicyRequest = exports.GetRegistryPolicyResponse = exports.GetRegistryPolicyRequest = exports.LifecyclePolicyPreviewNotFoundException = exports.GetLifecyclePolicyPreviewResponse = exports.LifecyclePolicyPreviewSummary = exports.LifecyclePolicyPreviewStatus = exports.LifecyclePolicyPreviewResult = exports.LifecyclePolicyRuleAction = exports.ImageActionType = exports.GetLifecyclePolicyPreviewRequest = exports.LifecyclePolicyPreviewFilter = exports.GetLifecyclePolicyResponse = exports.GetLifecyclePolicyRequest = exports.LayersNotFoundException = exports.LayerInaccessibleException = exports.GetDownloadUrlForLayerResponse = exports.GetDownloadUrlForLayerRequest = exports.GetAuthorizationTokenResponse = exports.AuthorizationData = exports.GetAuthorizationTokenRequest = exports.DescribeRepositoriesResponse = exports.DescribeRepositoriesRequest = exports.DescribeRegistryResponse = exports.ReplicationConfiguration = exports.ReplicationRule = exports.RepositoryFilter = exports.RepositoryFilterType = exports.ReplicationDestination = exports.DescribeRegistryRequest = exports.ScanNotFoundException = exports.DescribeImageScanFindingsResponse = exports.ImageScanFindings = exports.ImageScanFinding = exports.Attribute = exports.DescribeImageScanFindingsRequest = exports.DescribeImagesResponse = exports.ImageDetail = exports.ImageScanStatus = exports.ScanStatus = exports.ImageScanFindingsSummary = exports.FindingSeverity = exports.DescribeImagesRequest = exports.DescribeImagesFilter = exports.TagStatus = exports.ImageNotFoundException = exports.DescribeImageReplicationStatusResponse = exports.ImageReplicationStatus = exports.ReplicationStatus = exports.DescribeImageReplicationStatusRequest = void 0;
exports.UploadLayerPartResponse = exports.UploadLayerPartRequest = exports.InvalidLayerPartException = exports.UntagResourceResponse = exports.UntagResourceRequest = exports.TagResourceResponse = exports.TagResourceRequest = exports.StartLifecyclePolicyPreviewResponse = exports.StartLifecyclePolicyPreviewRequest = exports.LifecyclePolicyPreviewInProgressException = exports.UnsupportedImageTypeException = exports.StartImageScanResponse = exports.StartImageScanRequest = exports.SetRepositoryPolicyResponse = exports.SetRepositoryPolicyRequest = exports.PutReplicationConfigurationResponse = exports.PutReplicationConfigurationRequest = exports.PutRegistryPolicyResponse = exports.PutRegistryPolicyRequest = exports.PutLifecyclePolicyResponse = exports.PutLifecyclePolicyRequest = exports.PutImageTagMutabilityResponse = exports.PutImageTagMutabilityRequest = exports.PutImageScanningConfigurationResponse = exports.PutImageScanningConfigurationRequest = exports.ReferencedImagesNotFoundException = exports.PutImageResponse = exports.PutImageRequest = exports.ImageTagAlreadyExistsException = exports.ImageDigestDoesNotMatchException = exports.ImageAlreadyExistsException = exports.ListTagsForResourceResponse = exports.ListTagsForResourceRequest = exports.ListImagesResponse = exports.ListImagesRequest = exports.ListImagesFilter = exports.InitiateLayerUploadResponse = exports.InitiateLayerUploadRequest = exports.GetRepositoryPolicyResponse = void 0;
var BatchCheckLayerAvailabilityRequest;
(function (BatchCheckLayerAvailabilityRequest) {
    BatchCheckLayerAvailabilityRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BatchCheckLayerAvailabilityRequest = exports.BatchCheckLayerAvailabilityRequest || (exports.BatchCheckLayerAvailabilityRequest = {}));
var LayerFailureCode;
(function (LayerFailureCode) {
    LayerFailureCode["InvalidLayerDigest"] = "InvalidLayerDigest";
    LayerFailureCode["MissingLayerDigest"] = "MissingLayerDigest";
})(LayerFailureCode = exports.LayerFailureCode || (exports.LayerFailureCode = {}));
var LayerFailure;
(function (LayerFailure) {
    LayerFailure.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LayerFailure = exports.LayerFailure || (exports.LayerFailure = {}));
var LayerAvailability;
(function (LayerAvailability) {
    LayerAvailability["AVAILABLE"] = "AVAILABLE";
    LayerAvailability["UNAVAILABLE"] = "UNAVAILABLE";
})(LayerAvailability = exports.LayerAvailability || (exports.LayerAvailability = {}));
var Layer;
(function (Layer) {
    Layer.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Layer = exports.Layer || (exports.Layer = {}));
var BatchCheckLayerAvailabilityResponse;
(function (BatchCheckLayerAvailabilityResponse) {
    BatchCheckLayerAvailabilityResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BatchCheckLayerAvailabilityResponse = exports.BatchCheckLayerAvailabilityResponse || (exports.BatchCheckLayerAvailabilityResponse = {}));
var InvalidParameterException;
(function (InvalidParameterException) {
    InvalidParameterException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidParameterException = exports.InvalidParameterException || (exports.InvalidParameterException = {}));
var RepositoryNotFoundException;
(function (RepositoryNotFoundException) {
    RepositoryNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RepositoryNotFoundException = exports.RepositoryNotFoundException || (exports.RepositoryNotFoundException = {}));
var ServerException;
(function (ServerException) {
    ServerException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ServerException = exports.ServerException || (exports.ServerException = {}));
var ImageIdentifier;
(function (ImageIdentifier) {
    ImageIdentifier.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageIdentifier = exports.ImageIdentifier || (exports.ImageIdentifier = {}));
var BatchDeleteImageRequest;
(function (BatchDeleteImageRequest) {
    BatchDeleteImageRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BatchDeleteImageRequest = exports.BatchDeleteImageRequest || (exports.BatchDeleteImageRequest = {}));
var ImageFailureCode;
(function (ImageFailureCode) {
    ImageFailureCode["ImageNotFound"] = "ImageNotFound";
    ImageFailureCode["ImageReferencedByManifestList"] = "ImageReferencedByManifestList";
    ImageFailureCode["ImageTagDoesNotMatchDigest"] = "ImageTagDoesNotMatchDigest";
    ImageFailureCode["InvalidImageDigest"] = "InvalidImageDigest";
    ImageFailureCode["InvalidImageTag"] = "InvalidImageTag";
    ImageFailureCode["KmsError"] = "KmsError";
    ImageFailureCode["MissingDigestAndTag"] = "MissingDigestAndTag";
})(ImageFailureCode = exports.ImageFailureCode || (exports.ImageFailureCode = {}));
var ImageFailure;
(function (ImageFailure) {
    ImageFailure.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageFailure = exports.ImageFailure || (exports.ImageFailure = {}));
var BatchDeleteImageResponse;
(function (BatchDeleteImageResponse) {
    BatchDeleteImageResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BatchDeleteImageResponse = exports.BatchDeleteImageResponse || (exports.BatchDeleteImageResponse = {}));
var BatchGetImageRequest;
(function (BatchGetImageRequest) {
    BatchGetImageRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BatchGetImageRequest = exports.BatchGetImageRequest || (exports.BatchGetImageRequest = {}));
var Image;
(function (Image) {
    Image.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Image = exports.Image || (exports.Image = {}));
var BatchGetImageResponse;
(function (BatchGetImageResponse) {
    BatchGetImageResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(BatchGetImageResponse = exports.BatchGetImageResponse || (exports.BatchGetImageResponse = {}));
var CompleteLayerUploadRequest;
(function (CompleteLayerUploadRequest) {
    CompleteLayerUploadRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CompleteLayerUploadRequest = exports.CompleteLayerUploadRequest || (exports.CompleteLayerUploadRequest = {}));
var CompleteLayerUploadResponse;
(function (CompleteLayerUploadResponse) {
    CompleteLayerUploadResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CompleteLayerUploadResponse = exports.CompleteLayerUploadResponse || (exports.CompleteLayerUploadResponse = {}));
var EmptyUploadException;
(function (EmptyUploadException) {
    EmptyUploadException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(EmptyUploadException = exports.EmptyUploadException || (exports.EmptyUploadException = {}));
var InvalidLayerException;
(function (InvalidLayerException) {
    InvalidLayerException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidLayerException = exports.InvalidLayerException || (exports.InvalidLayerException = {}));
var KmsException;
(function (KmsException) {
    KmsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(KmsException = exports.KmsException || (exports.KmsException = {}));
var LayerAlreadyExistsException;
(function (LayerAlreadyExistsException) {
    LayerAlreadyExistsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LayerAlreadyExistsException = exports.LayerAlreadyExistsException || (exports.LayerAlreadyExistsException = {}));
var LayerPartTooSmallException;
(function (LayerPartTooSmallException) {
    LayerPartTooSmallException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LayerPartTooSmallException = exports.LayerPartTooSmallException || (exports.LayerPartTooSmallException = {}));
var UploadNotFoundException;
(function (UploadNotFoundException) {
    UploadNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UploadNotFoundException = exports.UploadNotFoundException || (exports.UploadNotFoundException = {}));
var EncryptionType;
(function (EncryptionType) {
    EncryptionType["AES256"] = "AES256";
    EncryptionType["KMS"] = "KMS";
})(EncryptionType = exports.EncryptionType || (exports.EncryptionType = {}));
var EncryptionConfiguration;
(function (EncryptionConfiguration) {
    EncryptionConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(EncryptionConfiguration = exports.EncryptionConfiguration || (exports.EncryptionConfiguration = {}));
var ImageScanningConfiguration;
(function (ImageScanningConfiguration) {
    ImageScanningConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageScanningConfiguration = exports.ImageScanningConfiguration || (exports.ImageScanningConfiguration = {}));
var ImageTagMutability;
(function (ImageTagMutability) {
    ImageTagMutability["IMMUTABLE"] = "IMMUTABLE";
    ImageTagMutability["MUTABLE"] = "MUTABLE";
})(ImageTagMutability = exports.ImageTagMutability || (exports.ImageTagMutability = {}));
var Tag;
(function (Tag) {
    Tag.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Tag = exports.Tag || (exports.Tag = {}));
var CreateRepositoryRequest;
(function (CreateRepositoryRequest) {
    CreateRepositoryRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CreateRepositoryRequest = exports.CreateRepositoryRequest || (exports.CreateRepositoryRequest = {}));
var Repository;
(function (Repository) {
    Repository.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Repository = exports.Repository || (exports.Repository = {}));
var CreateRepositoryResponse;
(function (CreateRepositoryResponse) {
    CreateRepositoryResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(CreateRepositoryResponse = exports.CreateRepositoryResponse || (exports.CreateRepositoryResponse = {}));
var InvalidTagParameterException;
(function (InvalidTagParameterException) {
    InvalidTagParameterException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidTagParameterException = exports.InvalidTagParameterException || (exports.InvalidTagParameterException = {}));
var LimitExceededException;
(function (LimitExceededException) {
    LimitExceededException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LimitExceededException = exports.LimitExceededException || (exports.LimitExceededException = {}));
var RepositoryAlreadyExistsException;
(function (RepositoryAlreadyExistsException) {
    RepositoryAlreadyExistsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RepositoryAlreadyExistsException = exports.RepositoryAlreadyExistsException || (exports.RepositoryAlreadyExistsException = {}));
var TooManyTagsException;
(function (TooManyTagsException) {
    TooManyTagsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(TooManyTagsException = exports.TooManyTagsException || (exports.TooManyTagsException = {}));
var DeleteLifecyclePolicyRequest;
(function (DeleteLifecyclePolicyRequest) {
    DeleteLifecyclePolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteLifecyclePolicyRequest = exports.DeleteLifecyclePolicyRequest || (exports.DeleteLifecyclePolicyRequest = {}));
var DeleteLifecyclePolicyResponse;
(function (DeleteLifecyclePolicyResponse) {
    DeleteLifecyclePolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteLifecyclePolicyResponse = exports.DeleteLifecyclePolicyResponse || (exports.DeleteLifecyclePolicyResponse = {}));
var LifecyclePolicyNotFoundException;
(function (LifecyclePolicyNotFoundException) {
    LifecyclePolicyNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyNotFoundException = exports.LifecyclePolicyNotFoundException || (exports.LifecyclePolicyNotFoundException = {}));
var DeleteRegistryPolicyRequest;
(function (DeleteRegistryPolicyRequest) {
    DeleteRegistryPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteRegistryPolicyRequest = exports.DeleteRegistryPolicyRequest || (exports.DeleteRegistryPolicyRequest = {}));
var DeleteRegistryPolicyResponse;
(function (DeleteRegistryPolicyResponse) {
    DeleteRegistryPolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteRegistryPolicyResponse = exports.DeleteRegistryPolicyResponse || (exports.DeleteRegistryPolicyResponse = {}));
var RegistryPolicyNotFoundException;
(function (RegistryPolicyNotFoundException) {
    RegistryPolicyNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RegistryPolicyNotFoundException = exports.RegistryPolicyNotFoundException || (exports.RegistryPolicyNotFoundException = {}));
var ValidationException;
(function (ValidationException) {
    ValidationException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ValidationException = exports.ValidationException || (exports.ValidationException = {}));
var DeleteRepositoryRequest;
(function (DeleteRepositoryRequest) {
    DeleteRepositoryRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteRepositoryRequest = exports.DeleteRepositoryRequest || (exports.DeleteRepositoryRequest = {}));
var DeleteRepositoryResponse;
(function (DeleteRepositoryResponse) {
    DeleteRepositoryResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteRepositoryResponse = exports.DeleteRepositoryResponse || (exports.DeleteRepositoryResponse = {}));
var RepositoryNotEmptyException;
(function (RepositoryNotEmptyException) {
    RepositoryNotEmptyException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RepositoryNotEmptyException = exports.RepositoryNotEmptyException || (exports.RepositoryNotEmptyException = {}));
var DeleteRepositoryPolicyRequest;
(function (DeleteRepositoryPolicyRequest) {
    DeleteRepositoryPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteRepositoryPolicyRequest = exports.DeleteRepositoryPolicyRequest || (exports.DeleteRepositoryPolicyRequest = {}));
var DeleteRepositoryPolicyResponse;
(function (DeleteRepositoryPolicyResponse) {
    DeleteRepositoryPolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DeleteRepositoryPolicyResponse = exports.DeleteRepositoryPolicyResponse || (exports.DeleteRepositoryPolicyResponse = {}));
var RepositoryPolicyNotFoundException;
(function (RepositoryPolicyNotFoundException) {
    RepositoryPolicyNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RepositoryPolicyNotFoundException = exports.RepositoryPolicyNotFoundException || (exports.RepositoryPolicyNotFoundException = {}));
var DescribeImageReplicationStatusRequest;
(function (DescribeImageReplicationStatusRequest) {
    DescribeImageReplicationStatusRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImageReplicationStatusRequest = exports.DescribeImageReplicationStatusRequest || (exports.DescribeImageReplicationStatusRequest = {}));
var ReplicationStatus;
(function (ReplicationStatus) {
    ReplicationStatus["COMPLETE"] = "COMPLETE";
    ReplicationStatus["FAILED"] = "FAILED";
    ReplicationStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(ReplicationStatus = exports.ReplicationStatus || (exports.ReplicationStatus = {}));
var ImageReplicationStatus;
(function (ImageReplicationStatus) {
    ImageReplicationStatus.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageReplicationStatus = exports.ImageReplicationStatus || (exports.ImageReplicationStatus = {}));
var DescribeImageReplicationStatusResponse;
(function (DescribeImageReplicationStatusResponse) {
    DescribeImageReplicationStatusResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImageReplicationStatusResponse = exports.DescribeImageReplicationStatusResponse || (exports.DescribeImageReplicationStatusResponse = {}));
var ImageNotFoundException;
(function (ImageNotFoundException) {
    ImageNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageNotFoundException = exports.ImageNotFoundException || (exports.ImageNotFoundException = {}));
var TagStatus;
(function (TagStatus) {
    TagStatus["ANY"] = "ANY";
    TagStatus["TAGGED"] = "TAGGED";
    TagStatus["UNTAGGED"] = "UNTAGGED";
})(TagStatus = exports.TagStatus || (exports.TagStatus = {}));
var DescribeImagesFilter;
(function (DescribeImagesFilter) {
    DescribeImagesFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImagesFilter = exports.DescribeImagesFilter || (exports.DescribeImagesFilter = {}));
var DescribeImagesRequest;
(function (DescribeImagesRequest) {
    DescribeImagesRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImagesRequest = exports.DescribeImagesRequest || (exports.DescribeImagesRequest = {}));
var FindingSeverity;
(function (FindingSeverity) {
    FindingSeverity["CRITICAL"] = "CRITICAL";
    FindingSeverity["HIGH"] = "HIGH";
    FindingSeverity["INFORMATIONAL"] = "INFORMATIONAL";
    FindingSeverity["LOW"] = "LOW";
    FindingSeverity["MEDIUM"] = "MEDIUM";
    FindingSeverity["UNDEFINED"] = "UNDEFINED";
})(FindingSeverity = exports.FindingSeverity || (exports.FindingSeverity = {}));
var ImageScanFindingsSummary;
(function (ImageScanFindingsSummary) {
    ImageScanFindingsSummary.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageScanFindingsSummary = exports.ImageScanFindingsSummary || (exports.ImageScanFindingsSummary = {}));
var ScanStatus;
(function (ScanStatus) {
    ScanStatus["COMPLETE"] = "COMPLETE";
    ScanStatus["FAILED"] = "FAILED";
    ScanStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(ScanStatus = exports.ScanStatus || (exports.ScanStatus = {}));
var ImageScanStatus;
(function (ImageScanStatus) {
    ImageScanStatus.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageScanStatus = exports.ImageScanStatus || (exports.ImageScanStatus = {}));
var ImageDetail;
(function (ImageDetail) {
    ImageDetail.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageDetail = exports.ImageDetail || (exports.ImageDetail = {}));
var DescribeImagesResponse;
(function (DescribeImagesResponse) {
    DescribeImagesResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImagesResponse = exports.DescribeImagesResponse || (exports.DescribeImagesResponse = {}));
var DescribeImageScanFindingsRequest;
(function (DescribeImageScanFindingsRequest) {
    DescribeImageScanFindingsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImageScanFindingsRequest = exports.DescribeImageScanFindingsRequest || (exports.DescribeImageScanFindingsRequest = {}));
var Attribute;
(function (Attribute) {
    Attribute.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(Attribute = exports.Attribute || (exports.Attribute = {}));
var ImageScanFinding;
(function (ImageScanFinding) {
    ImageScanFinding.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageScanFinding = exports.ImageScanFinding || (exports.ImageScanFinding = {}));
var ImageScanFindings;
(function (ImageScanFindings) {
    ImageScanFindings.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageScanFindings = exports.ImageScanFindings || (exports.ImageScanFindings = {}));
var DescribeImageScanFindingsResponse;
(function (DescribeImageScanFindingsResponse) {
    DescribeImageScanFindingsResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeImageScanFindingsResponse = exports.DescribeImageScanFindingsResponse || (exports.DescribeImageScanFindingsResponse = {}));
var ScanNotFoundException;
(function (ScanNotFoundException) {
    ScanNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ScanNotFoundException = exports.ScanNotFoundException || (exports.ScanNotFoundException = {}));
var DescribeRegistryRequest;
(function (DescribeRegistryRequest) {
    DescribeRegistryRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeRegistryRequest = exports.DescribeRegistryRequest || (exports.DescribeRegistryRequest = {}));
var ReplicationDestination;
(function (ReplicationDestination) {
    ReplicationDestination.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationDestination = exports.ReplicationDestination || (exports.ReplicationDestination = {}));
var RepositoryFilterType;
(function (RepositoryFilterType) {
    RepositoryFilterType["PREFIX_MATCH"] = "PREFIX_MATCH";
})(RepositoryFilterType = exports.RepositoryFilterType || (exports.RepositoryFilterType = {}));
var RepositoryFilter;
(function (RepositoryFilter) {
    RepositoryFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RepositoryFilter = exports.RepositoryFilter || (exports.RepositoryFilter = {}));
var ReplicationRule;
(function (ReplicationRule) {
    ReplicationRule.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationRule = exports.ReplicationRule || (exports.ReplicationRule = {}));
var ReplicationConfiguration;
(function (ReplicationConfiguration) {
    ReplicationConfiguration.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReplicationConfiguration = exports.ReplicationConfiguration || (exports.ReplicationConfiguration = {}));
var DescribeRegistryResponse;
(function (DescribeRegistryResponse) {
    DescribeRegistryResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeRegistryResponse = exports.DescribeRegistryResponse || (exports.DescribeRegistryResponse = {}));
var DescribeRepositoriesRequest;
(function (DescribeRepositoriesRequest) {
    DescribeRepositoriesRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeRepositoriesRequest = exports.DescribeRepositoriesRequest || (exports.DescribeRepositoriesRequest = {}));
var DescribeRepositoriesResponse;
(function (DescribeRepositoriesResponse) {
    DescribeRepositoriesResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(DescribeRepositoriesResponse = exports.DescribeRepositoriesResponse || (exports.DescribeRepositoriesResponse = {}));
var GetAuthorizationTokenRequest;
(function (GetAuthorizationTokenRequest) {
    GetAuthorizationTokenRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetAuthorizationTokenRequest = exports.GetAuthorizationTokenRequest || (exports.GetAuthorizationTokenRequest = {}));
var AuthorizationData;
(function (AuthorizationData) {
    AuthorizationData.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AuthorizationData = exports.AuthorizationData || (exports.AuthorizationData = {}));
var GetAuthorizationTokenResponse;
(function (GetAuthorizationTokenResponse) {
    GetAuthorizationTokenResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetAuthorizationTokenResponse = exports.GetAuthorizationTokenResponse || (exports.GetAuthorizationTokenResponse = {}));
var GetDownloadUrlForLayerRequest;
(function (GetDownloadUrlForLayerRequest) {
    GetDownloadUrlForLayerRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetDownloadUrlForLayerRequest = exports.GetDownloadUrlForLayerRequest || (exports.GetDownloadUrlForLayerRequest = {}));
var GetDownloadUrlForLayerResponse;
(function (GetDownloadUrlForLayerResponse) {
    GetDownloadUrlForLayerResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetDownloadUrlForLayerResponse = exports.GetDownloadUrlForLayerResponse || (exports.GetDownloadUrlForLayerResponse = {}));
var LayerInaccessibleException;
(function (LayerInaccessibleException) {
    LayerInaccessibleException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LayerInaccessibleException = exports.LayerInaccessibleException || (exports.LayerInaccessibleException = {}));
var LayersNotFoundException;
(function (LayersNotFoundException) {
    LayersNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LayersNotFoundException = exports.LayersNotFoundException || (exports.LayersNotFoundException = {}));
var GetLifecyclePolicyRequest;
(function (GetLifecyclePolicyRequest) {
    GetLifecyclePolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetLifecyclePolicyRequest = exports.GetLifecyclePolicyRequest || (exports.GetLifecyclePolicyRequest = {}));
var GetLifecyclePolicyResponse;
(function (GetLifecyclePolicyResponse) {
    GetLifecyclePolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetLifecyclePolicyResponse = exports.GetLifecyclePolicyResponse || (exports.GetLifecyclePolicyResponse = {}));
var LifecyclePolicyPreviewFilter;
(function (LifecyclePolicyPreviewFilter) {
    LifecyclePolicyPreviewFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyPreviewFilter = exports.LifecyclePolicyPreviewFilter || (exports.LifecyclePolicyPreviewFilter = {}));
var GetLifecyclePolicyPreviewRequest;
(function (GetLifecyclePolicyPreviewRequest) {
    GetLifecyclePolicyPreviewRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetLifecyclePolicyPreviewRequest = exports.GetLifecyclePolicyPreviewRequest || (exports.GetLifecyclePolicyPreviewRequest = {}));
var ImageActionType;
(function (ImageActionType) {
    ImageActionType["EXPIRE"] = "EXPIRE";
})(ImageActionType = exports.ImageActionType || (exports.ImageActionType = {}));
var LifecyclePolicyRuleAction;
(function (LifecyclePolicyRuleAction) {
    LifecyclePolicyRuleAction.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyRuleAction = exports.LifecyclePolicyRuleAction || (exports.LifecyclePolicyRuleAction = {}));
var LifecyclePolicyPreviewResult;
(function (LifecyclePolicyPreviewResult) {
    LifecyclePolicyPreviewResult.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyPreviewResult = exports.LifecyclePolicyPreviewResult || (exports.LifecyclePolicyPreviewResult = {}));
var LifecyclePolicyPreviewStatus;
(function (LifecyclePolicyPreviewStatus) {
    LifecyclePolicyPreviewStatus["COMPLETE"] = "COMPLETE";
    LifecyclePolicyPreviewStatus["EXPIRED"] = "EXPIRED";
    LifecyclePolicyPreviewStatus["FAILED"] = "FAILED";
    LifecyclePolicyPreviewStatus["IN_PROGRESS"] = "IN_PROGRESS";
})(LifecyclePolicyPreviewStatus = exports.LifecyclePolicyPreviewStatus || (exports.LifecyclePolicyPreviewStatus = {}));
var LifecyclePolicyPreviewSummary;
(function (LifecyclePolicyPreviewSummary) {
    LifecyclePolicyPreviewSummary.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyPreviewSummary = exports.LifecyclePolicyPreviewSummary || (exports.LifecyclePolicyPreviewSummary = {}));
var GetLifecyclePolicyPreviewResponse;
(function (GetLifecyclePolicyPreviewResponse) {
    GetLifecyclePolicyPreviewResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetLifecyclePolicyPreviewResponse = exports.GetLifecyclePolicyPreviewResponse || (exports.GetLifecyclePolicyPreviewResponse = {}));
var LifecyclePolicyPreviewNotFoundException;
(function (LifecyclePolicyPreviewNotFoundException) {
    LifecyclePolicyPreviewNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyPreviewNotFoundException = exports.LifecyclePolicyPreviewNotFoundException || (exports.LifecyclePolicyPreviewNotFoundException = {}));
var GetRegistryPolicyRequest;
(function (GetRegistryPolicyRequest) {
    GetRegistryPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetRegistryPolicyRequest = exports.GetRegistryPolicyRequest || (exports.GetRegistryPolicyRequest = {}));
var GetRegistryPolicyResponse;
(function (GetRegistryPolicyResponse) {
    GetRegistryPolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetRegistryPolicyResponse = exports.GetRegistryPolicyResponse || (exports.GetRegistryPolicyResponse = {}));
var GetRepositoryPolicyRequest;
(function (GetRepositoryPolicyRequest) {
    GetRepositoryPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetRepositoryPolicyRequest = exports.GetRepositoryPolicyRequest || (exports.GetRepositoryPolicyRequest = {}));
var GetRepositoryPolicyResponse;
(function (GetRepositoryPolicyResponse) {
    GetRepositoryPolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(GetRepositoryPolicyResponse = exports.GetRepositoryPolicyResponse || (exports.GetRepositoryPolicyResponse = {}));
var InitiateLayerUploadRequest;
(function (InitiateLayerUploadRequest) {
    InitiateLayerUploadRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InitiateLayerUploadRequest = exports.InitiateLayerUploadRequest || (exports.InitiateLayerUploadRequest = {}));
var InitiateLayerUploadResponse;
(function (InitiateLayerUploadResponse) {
    InitiateLayerUploadResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InitiateLayerUploadResponse = exports.InitiateLayerUploadResponse || (exports.InitiateLayerUploadResponse = {}));
var ListImagesFilter;
(function (ListImagesFilter) {
    ListImagesFilter.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListImagesFilter = exports.ListImagesFilter || (exports.ListImagesFilter = {}));
var ListImagesRequest;
(function (ListImagesRequest) {
    ListImagesRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListImagesRequest = exports.ListImagesRequest || (exports.ListImagesRequest = {}));
var ListImagesResponse;
(function (ListImagesResponse) {
    ListImagesResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListImagesResponse = exports.ListImagesResponse || (exports.ListImagesResponse = {}));
var ListTagsForResourceRequest;
(function (ListTagsForResourceRequest) {
    ListTagsForResourceRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListTagsForResourceRequest = exports.ListTagsForResourceRequest || (exports.ListTagsForResourceRequest = {}));
var ListTagsForResourceResponse;
(function (ListTagsForResourceResponse) {
    ListTagsForResourceResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListTagsForResourceResponse = exports.ListTagsForResourceResponse || (exports.ListTagsForResourceResponse = {}));
var ImageAlreadyExistsException;
(function (ImageAlreadyExistsException) {
    ImageAlreadyExistsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageAlreadyExistsException = exports.ImageAlreadyExistsException || (exports.ImageAlreadyExistsException = {}));
var ImageDigestDoesNotMatchException;
(function (ImageDigestDoesNotMatchException) {
    ImageDigestDoesNotMatchException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageDigestDoesNotMatchException = exports.ImageDigestDoesNotMatchException || (exports.ImageDigestDoesNotMatchException = {}));
var ImageTagAlreadyExistsException;
(function (ImageTagAlreadyExistsException) {
    ImageTagAlreadyExistsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ImageTagAlreadyExistsException = exports.ImageTagAlreadyExistsException || (exports.ImageTagAlreadyExistsException = {}));
var PutImageRequest;
(function (PutImageRequest) {
    PutImageRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutImageRequest = exports.PutImageRequest || (exports.PutImageRequest = {}));
var PutImageResponse;
(function (PutImageResponse) {
    PutImageResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutImageResponse = exports.PutImageResponse || (exports.PutImageResponse = {}));
var ReferencedImagesNotFoundException;
(function (ReferencedImagesNotFoundException) {
    ReferencedImagesNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ReferencedImagesNotFoundException = exports.ReferencedImagesNotFoundException || (exports.ReferencedImagesNotFoundException = {}));
var PutImageScanningConfigurationRequest;
(function (PutImageScanningConfigurationRequest) {
    PutImageScanningConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutImageScanningConfigurationRequest = exports.PutImageScanningConfigurationRequest || (exports.PutImageScanningConfigurationRequest = {}));
var PutImageScanningConfigurationResponse;
(function (PutImageScanningConfigurationResponse) {
    PutImageScanningConfigurationResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutImageScanningConfigurationResponse = exports.PutImageScanningConfigurationResponse || (exports.PutImageScanningConfigurationResponse = {}));
var PutImageTagMutabilityRequest;
(function (PutImageTagMutabilityRequest) {
    PutImageTagMutabilityRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutImageTagMutabilityRequest = exports.PutImageTagMutabilityRequest || (exports.PutImageTagMutabilityRequest = {}));
var PutImageTagMutabilityResponse;
(function (PutImageTagMutabilityResponse) {
    PutImageTagMutabilityResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutImageTagMutabilityResponse = exports.PutImageTagMutabilityResponse || (exports.PutImageTagMutabilityResponse = {}));
var PutLifecyclePolicyRequest;
(function (PutLifecyclePolicyRequest) {
    PutLifecyclePolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutLifecyclePolicyRequest = exports.PutLifecyclePolicyRequest || (exports.PutLifecyclePolicyRequest = {}));
var PutLifecyclePolicyResponse;
(function (PutLifecyclePolicyResponse) {
    PutLifecyclePolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutLifecyclePolicyResponse = exports.PutLifecyclePolicyResponse || (exports.PutLifecyclePolicyResponse = {}));
var PutRegistryPolicyRequest;
(function (PutRegistryPolicyRequest) {
    PutRegistryPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutRegistryPolicyRequest = exports.PutRegistryPolicyRequest || (exports.PutRegistryPolicyRequest = {}));
var PutRegistryPolicyResponse;
(function (PutRegistryPolicyResponse) {
    PutRegistryPolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutRegistryPolicyResponse = exports.PutRegistryPolicyResponse || (exports.PutRegistryPolicyResponse = {}));
var PutReplicationConfigurationRequest;
(function (PutReplicationConfigurationRequest) {
    PutReplicationConfigurationRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutReplicationConfigurationRequest = exports.PutReplicationConfigurationRequest || (exports.PutReplicationConfigurationRequest = {}));
var PutReplicationConfigurationResponse;
(function (PutReplicationConfigurationResponse) {
    PutReplicationConfigurationResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(PutReplicationConfigurationResponse = exports.PutReplicationConfigurationResponse || (exports.PutReplicationConfigurationResponse = {}));
var SetRepositoryPolicyRequest;
(function (SetRepositoryPolicyRequest) {
    SetRepositoryPolicyRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(SetRepositoryPolicyRequest = exports.SetRepositoryPolicyRequest || (exports.SetRepositoryPolicyRequest = {}));
var SetRepositoryPolicyResponse;
(function (SetRepositoryPolicyResponse) {
    SetRepositoryPolicyResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(SetRepositoryPolicyResponse = exports.SetRepositoryPolicyResponse || (exports.SetRepositoryPolicyResponse = {}));
var StartImageScanRequest;
(function (StartImageScanRequest) {
    StartImageScanRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(StartImageScanRequest = exports.StartImageScanRequest || (exports.StartImageScanRequest = {}));
var StartImageScanResponse;
(function (StartImageScanResponse) {
    StartImageScanResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(StartImageScanResponse = exports.StartImageScanResponse || (exports.StartImageScanResponse = {}));
var UnsupportedImageTypeException;
(function (UnsupportedImageTypeException) {
    UnsupportedImageTypeException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UnsupportedImageTypeException = exports.UnsupportedImageTypeException || (exports.UnsupportedImageTypeException = {}));
var LifecyclePolicyPreviewInProgressException;
(function (LifecyclePolicyPreviewInProgressException) {
    LifecyclePolicyPreviewInProgressException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(LifecyclePolicyPreviewInProgressException = exports.LifecyclePolicyPreviewInProgressException || (exports.LifecyclePolicyPreviewInProgressException = {}));
var StartLifecyclePolicyPreviewRequest;
(function (StartLifecyclePolicyPreviewRequest) {
    StartLifecyclePolicyPreviewRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(StartLifecyclePolicyPreviewRequest = exports.StartLifecyclePolicyPreviewRequest || (exports.StartLifecyclePolicyPreviewRequest = {}));
var StartLifecyclePolicyPreviewResponse;
(function (StartLifecyclePolicyPreviewResponse) {
    StartLifecyclePolicyPreviewResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(StartLifecyclePolicyPreviewResponse = exports.StartLifecyclePolicyPreviewResponse || (exports.StartLifecyclePolicyPreviewResponse = {}));
var TagResourceRequest;
(function (TagResourceRequest) {
    TagResourceRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(TagResourceRequest = exports.TagResourceRequest || (exports.TagResourceRequest = {}));
var TagResourceResponse;
(function (TagResourceResponse) {
    TagResourceResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(TagResourceResponse = exports.TagResourceResponse || (exports.TagResourceResponse = {}));
var UntagResourceRequest;
(function (UntagResourceRequest) {
    UntagResourceRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UntagResourceRequest = exports.UntagResourceRequest || (exports.UntagResourceRequest = {}));
var UntagResourceResponse;
(function (UntagResourceResponse) {
    UntagResourceResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UntagResourceResponse = exports.UntagResourceResponse || (exports.UntagResourceResponse = {}));
var InvalidLayerPartException;
(function (InvalidLayerPartException) {
    InvalidLayerPartException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidLayerPartException = exports.InvalidLayerPartException || (exports.InvalidLayerPartException = {}));
var UploadLayerPartRequest;
(function (UploadLayerPartRequest) {
    UploadLayerPartRequest.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UploadLayerPartRequest = exports.UploadLayerPartRequest || (exports.UploadLayerPartRequest = {}));
var UploadLayerPartResponse;
(function (UploadLayerPartResponse) {
    UploadLayerPartResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UploadLayerPartResponse = exports.UploadLayerPartResponse || (exports.UploadLayerPartResponse = {}));


/***/ }),
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */
/***/ (function(module) {

module.exports = {"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\"","QUOT":"\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"};

/***/ }),
/* 168 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isSsoProfile = exports.validateSsoProfile = exports.fromSSO = exports.EXPIRE_WINDOW_MS = void 0;
const client_sso_1 = __webpack_require__(788);
const property_provider_1 = __webpack_require__(948);
const shared_ini_file_loader_1 = __webpack_require__(360);
const util_credentials_1 = __webpack_require__(339);
const crypto_1 = __webpack_require__(417);
const fs_1 = __webpack_require__(747);
const path_1 = __webpack_require__(622);
exports.EXPIRE_WINDOW_MS = 15 * 60 * 1000;
const SHOULD_FAIL_CREDENTIAL_CHAIN = false;
const fromSSO = (init = {}) => async () => {
    const { ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient } = init;
    if (!ssoStartUrl && !ssoAccountId && !ssoRegion && !ssoRoleName) {
        const profiles = await util_credentials_1.parseKnownFiles(init);
        const profileName = util_credentials_1.getMasterProfileName(init);
        const profile = profiles[profileName];
        if (!exports.isSsoProfile(profile)) {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} is not configured with SSO credentials.`);
        }
        const { sso_start_url, sso_account_id, sso_region, sso_role_name } = exports.validateSsoProfile(profile);
        return resolveSSOCredentials({
            ssoStartUrl: sso_start_url,
            ssoAccountId: sso_account_id,
            ssoRegion: sso_region,
            ssoRoleName: sso_role_name,
            ssoClient: ssoClient,
        });
    }
    else if (!ssoStartUrl || !ssoAccountId || !ssoRegion || !ssoRoleName) {
        throw new property_provider_1.CredentialsProviderError('Incomplete configuration. The fromSSO() argument hash must include "ssoStartUrl",' +
            ' "ssoAccountId", "ssoRegion", "ssoRoleName"');
    }
    else {
        return resolveSSOCredentials({ ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient });
    }
};
exports.fromSSO = fromSSO;
const resolveSSOCredentials = async ({ ssoStartUrl, ssoAccountId, ssoRegion, ssoRoleName, ssoClient, }) => {
    const hasher = crypto_1.createHash("sha1");
    const cacheName = hasher.update(ssoStartUrl).digest("hex");
    const tokenFile = path_1.join(shared_ini_file_loader_1.getHomeDir(), ".aws", "sso", "cache", `${cacheName}.json`);
    let token;
    try {
        token = JSON.parse(fs_1.readFileSync(tokenFile, { encoding: "utf-8" }));
        if (new Date(token.expiresAt).getTime() - Date.now() <= exports.EXPIRE_WINDOW_MS) {
            throw new Error("SSO token is expired.");
        }
    }
    catch (e) {
        throw new property_provider_1.CredentialsProviderError(`The SSO session associated with this profile has expired or is otherwise invalid. To refresh this SSO session ` +
            `run aws sso login with the corresponding profile.`, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    const { accessToken } = token;
    const sso = ssoClient || new client_sso_1.SSOClient({ region: ssoRegion });
    let ssoResp;
    try {
        ssoResp = await sso.send(new client_sso_1.GetRoleCredentialsCommand({
            accountId: ssoAccountId,
            roleName: ssoRoleName,
            accessToken,
        }));
    }
    catch (e) {
        throw property_provider_1.CredentialsProviderError.from(e, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    const { roleCredentials: { accessKeyId, secretAccessKey, sessionToken, expiration } = {} } = ssoResp;
    if (!accessKeyId || !secretAccessKey || !sessionToken || !expiration) {
        throw new property_provider_1.CredentialsProviderError("SSO returns an invalid temporary credential.", SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    return { accessKeyId, secretAccessKey, sessionToken, expiration: new Date(expiration) };
};
const validateSsoProfile = (profile) => {
    const { sso_start_url, sso_account_id, sso_region, sso_role_name } = profile;
    if (!sso_start_url || !sso_account_id || !sso_region || !sso_role_name) {
        throw new property_provider_1.CredentialsProviderError(`Profile is configured with invalid SSO credentials. Required parameters "sso_account_id", "sso_region", ` +
            `"sso_role_name", "sso_start_url". Got ${Object.keys(profile).join(", ")}\nReference: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html`, SHOULD_FAIL_CREDENTIAL_CHAIN);
    }
    return profile;
};
exports.validateSsoProfile = validateSsoProfile;
const isSsoProfile = (arg) => arg &&
    (typeof arg.sso_start_url === "string" ||
        typeof arg.sso_account_id === "string" ||
        typeof arg.sso_region === "string" ||
        typeof arg.sso_role_name === "string");
exports.isSsoProfile = isSsoProfile;


/***/ }),
/* 169 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var decode_json_1 = __importDefault(__webpack_require__(728));
// Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
var fromCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.fromCodePoint ||
    function (codePoint) {
        var output = "";
        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }
        output += String.fromCharCode(codePoint);
        return output;
    };
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
    }
    return fromCodePoint(codePoint);
}
exports.default = decodeCodePoint;


/***/ }),
/* 170 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(839);
const buildOptions = __webpack_require__(839).buildOptions;
const xmlNode = __webpack_require__(66);
const regx =
  '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)'
  .replace(/NAME/g, util.nameRegexp);

//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

//polyfill
if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}

const defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false, //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true, //Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: '\\c',
  tagValueProcessor: function(a, tagName) {
    return a;
  },
  attrValueProcessor: function(a, attrName) {
    return a;
  },
  stopNodes: []
  //decodeStrict: false,
};

exports.defaultOptions = defaultOptions;

const props = [
  'attributeNamePrefix',
  'attrNodeName',
  'textNodeName',
  'ignoreAttributes',
  'ignoreNameSpace',
  'allowBooleanAttributes',
  'parseNodeValue',
  'parseAttributeValue',
  'arrayMode',
  'trimValues',
  'cdataTagName',
  'cdataPositionChar',
  'tagValueProcessor',
  'attrValueProcessor',
  'parseTrueNumberOnly',
  'stopNodes'
];
exports.props = props;

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} val
 * @param {object} options
 */
function processTagValue(tagName, val, options) {
  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }
    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    const tags = tagname.split(':');
    const prefix = tagname.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}

function parseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'string') {
    let parsed;
    if (val.trim() === '' || isNaN(val)) {
      parsed = val === 'true' ? true : val === 'false' ? false : val;
    } else {
      if (val.indexOf('0x') !== -1) {
        //support hexa decimal
        parsed = Number.parseInt(val, 16);
      } else if (val.indexOf('.') !== -1) {
        parsed = Number.parseFloat(val);
        val = val.replace(/\.?0+$/, "");
      } else {
        parsed = Number.parseInt(val, 10);
      }
      if (parseTrueNumberOnly) {
        parsed = String(parsed) === val ? parsed : val;
      }
    }
    return parsed;
  } else {
    if (util.isExist(val)) {
      return val;
    } else {
      return '';
    }
  }
}

//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g');

function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === 'string') {
    attrStr = attrStr.replace(/\r?\n/g, ' ');
    //attrStr = attrStr || attrStr.trim();

    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length; //don't make it inline
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const attrName = resolveNameSpace(matches[i][1], options);
      if (attrName.length) {
        if (matches[i][4] !== undefined) {
          if (options.trimValues) {
            matches[i][4] = matches[i][4].trim();
          }
          matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
          attrs[options.attributeNamePrefix + attrName] = parseValue(
            matches[i][4],
            options.parseAttributeValue,
            options.parseTrueNumberOnly
          );
        } else if (options.allowBooleanAttributes) {
          attrs[options.attributeNamePrefix + attrName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (options.attrNodeName) {
      const attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}

const getTraversalObj = function(xmlData, options) {
  xmlData = xmlData.replace(/\r\n?/g, "\n");
  options = buildOptions(options, defaultOptions, props);
  const xmlObj = new xmlNode('!xml');
  let currentNode = xmlObj;
  let textData = "";

//function match(xmlData){
  for(let i=0; i< xmlData.length; i++){
    const ch = xmlData[i];
    if(ch === '<'){
      if( xmlData[i+1] === '/') {//Closing Tag
        const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.")
        let tagName = xmlData.substring(i+2,closeIndex).trim();

        if(options.ignoreNameSpace){
          const colonIndex = tagName.indexOf(":");
          if(colonIndex !== -1){
            tagName = tagName.substr(colonIndex+1);
          }
        }

        /* if (currentNode.parent) {
          currentNode.parent.val = util.getValue(currentNode.parent.val) + '' + processTagValue2(tagName, textData , options);
        } */
        if(currentNode){
          if(currentNode.val){
            currentNode.val = util.getValue(currentNode.val) + '' + processTagValue(tagName, textData , options);
          }else{
            currentNode.val = processTagValue(tagName, textData , options);
          }
        }

        if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
          currentNode.child = []
          if (currentNode.attrsMap == undefined) { currentNode.attrsMap = {}}
          currentNode.val = xmlData.substr(currentNode.startIndex + 1, i - currentNode.startIndex - 1)
        }
        currentNode = currentNode.parent;
        textData = "";
        i = closeIndex;
      } else if( xmlData[i+1] === '?') {
        i = findClosingIndex(xmlData, "?>", i, "Pi Tag is not closed.")
      } else if(xmlData.substr(i + 1, 3) === '!--') {
        i = findClosingIndex(xmlData, "-->", i, "Comment is not closed.")
      } else if( xmlData.substr(i + 1, 2) === '!D') {
        const closeIndex = findClosingIndex(xmlData, ">", i, "DOCTYPE is not closed.")
        const tagExp = xmlData.substring(i, closeIndex);
        if(tagExp.indexOf("[") >= 0){
          i = xmlData.indexOf("]>", i) + 1;
        }else{
          i = closeIndex;
        }
      }else if(xmlData.substr(i + 1, 2) === '![') {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2
        const tagExp = xmlData.substring(i + 9,closeIndex);

        //considerations
        //1. CDATA will always have parent node
        //2. A tag with CDATA is not a leaf node so it's value would be string type.
        if(textData){
          currentNode.val = util.getValue(currentNode.val) + '' + processTagValue(currentNode.tagname, textData , options);
          textData = "";
        }

        if (options.cdataTagName) {
          //add cdata node
          const childNode = new xmlNode(options.cdataTagName, currentNode, tagExp);
          currentNode.addChild(childNode);
          //for backtracking
          currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar;
          //add rest value to parent node
          if (tagExp) {
            childNode.val = tagExp;
          }
        } else {
          currentNode.val = (currentNode.val || '') + (tagExp || '');
        }

        i = closeIndex + 2;
      }else {//Opening tag
        const result = closingIndexForOpeningTag(xmlData, i+1)
        let tagExp = result.data;
        const closeIndex = result.index;
        const separatorIndex = tagExp.indexOf(" ");
        let tagName = tagExp;
        let shouldBuildAttributesMap = true;
        if(separatorIndex !== -1){
          tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, '');
          tagExp = tagExp.substr(separatorIndex + 1);
        }

        if(options.ignoreNameSpace){
          const colonIndex = tagName.indexOf(":");
          if(colonIndex !== -1){
            tagName = tagName.substr(colonIndex+1);
            shouldBuildAttributesMap = tagName !== result.data.substr(colonIndex + 1);
          }
        }

        //save text to parent node
        if (currentNode && textData) {
          if(currentNode.tagname !== '!xml'){
            currentNode.val = util.getValue(currentNode.val) + '' + processTagValue( currentNode.tagname, textData, options);
          }
        }

        if(tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1){//selfClosing tag

          if(tagName[tagName.length - 1] === "/"){ //remove trailing '/'
            tagName = tagName.substr(0, tagName.length - 1);
            tagExp = tagName;
          }else{
            tagExp = tagExp.substr(0, tagExp.length - 1);
          }

          const childNode = new xmlNode(tagName, currentNode, '');
          if(tagName !== tagExp){
            childNode.attrsMap = buildAttributesMap(tagExp, options);
          }
          currentNode.addChild(childNode);
        }else{//opening tag

          const childNode = new xmlNode( tagName, currentNode );
          if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
            childNode.startIndex=closeIndex;
          }
          if(tagName !== tagExp && shouldBuildAttributesMap){
            childNode.attrsMap = buildAttributesMap(tagExp, options);
          }
          currentNode.addChild(childNode);
          currentNode = childNode;
        }
        textData = "";
        i = closeIndex;
      }
    }else{
      textData += xmlData[i];
    }
  }
  return xmlObj;
}

function closingIndexForOpeningTag(data, i){
  let attrBoundary;
  let tagExp = "";
  for (let index = i; index < data.length; index++) {
    let ch = data[index];
    if (attrBoundary) {
        if (ch === attrBoundary) attrBoundary = "";//reset
    } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
    } else if (ch === '>') {
        return {
          data: tagExp,
          index: index
        }
    } else if (ch === '\t') {
      ch = " "
    }
    tagExp += ch;
  }
}

function findClosingIndex(xmlData, str, i, errMsg){
  const closingIndex = xmlData.indexOf(str, i);
  if(closingIndex === -1){
    throw new Error(errMsg)
  }else{
    return closingIndex + str.length - 1;
  }
}

exports.getTraversalObj = getTraversalObj;


/***/ }),
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DescribeImagesCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DescribeImagesCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DescribeImagesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DescribeImagesRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DescribeImagesResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DescribeImagesCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DescribeImagesCommand(output, context);
    }
}
exports.DescribeImagesCommand = DescribeImagesCommand;


/***/ }),
/* 175 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.httpRequest = void 0;
const property_provider_1 = __webpack_require__(948);
const buffer_1 = __webpack_require__(293);
const http_1 = __webpack_require__(605);
function httpRequest(options) {
    return new Promise((resolve, reject) => {
        var _a;
        const req = http_1.request({
            method: "GET",
            ...options,
            hostname: (_a = options.hostname) === null || _a === void 0 ? void 0 : _a.replace(/^\[(.+)\]$/, "$1"),
        });
        req.on("error", (err) => {
            reject(Object.assign(new property_provider_1.ProviderError("Unable to connect to instance metadata service"), err));
            req.destroy();
        });
        req.on("timeout", () => {
            reject(new property_provider_1.ProviderError("TimeoutError from instance metadata service"));
            req.destroy();
        });
        req.on("response", (res) => {
            const { statusCode = 400 } = res;
            if (statusCode < 200 || 300 <= statusCode) {
                reject(Object.assign(new property_provider_1.ProviderError("Error response received from instance metadata service"), { statusCode }));
                req.destroy();
            }
            const chunks = [];
            res.on("data", (chunk) => {
                chunks.push(chunk);
            });
            res.on("end", () => {
                resolve(buffer_1.Buffer.concat(chunks));
                req.destroy();
            });
        });
        req.end();
    });
}
exports.httpRequest = httpRequest;


/***/ }),
/* 176 */,
/* 177 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getSigV4AuthPlugin = exports.getAwsAuthPlugin = exports.awsAuthMiddlewareOptions = exports.awsAuthMiddleware = void 0;
const protocol_http_1 = __webpack_require__(504);
const getSkewCorrectedDate_1 = __webpack_require__(564);
const getUpdatedSystemClockOffset_1 = __webpack_require__(231);
const awsAuthMiddleware = (options) => (next, context) => async function (args) {
    if (!protocol_http_1.HttpRequest.isInstance(args.request))
        return next(args);
    const signer = await options.signer();
    const output = await next({
        ...args,
        request: await signer.sign(args.request, {
            signingDate: getSkewCorrectedDate_1.getSkewCorrectedDate(options.systemClockOffset),
            signingRegion: context["signing_region"],
            signingService: context["signing_service"],
        }),
    }).catch((error) => {
        if (error.ServerTime) {
            options.systemClockOffset = getUpdatedSystemClockOffset_1.getUpdatedSystemClockOffset(error.ServerTime, options.systemClockOffset);
        }
        throw error;
    });
    const { headers } = output.response;
    const dateHeader = headers && (headers.date || headers.Date);
    if (dateHeader) {
        options.systemClockOffset = getUpdatedSystemClockOffset_1.getUpdatedSystemClockOffset(dateHeader, options.systemClockOffset);
    }
    return output;
};
exports.awsAuthMiddleware = awsAuthMiddleware;
exports.awsAuthMiddlewareOptions = {
    name: "awsAuthMiddleware",
    tags: ["SIGNATURE", "AWSAUTH"],
    relation: "after",
    toMiddleware: "retryMiddleware",
    override: true,
};
const getAwsAuthPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo(exports.awsAuthMiddleware(options), exports.awsAuthMiddlewareOptions);
    },
});
exports.getAwsAuthPlugin = getAwsAuthPlugin;
exports.getSigV4AuthPlugin = exports.getAwsAuthPlugin;


/***/ }),
/* 178 */,
/* 179 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PutLifecyclePolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class PutLifecyclePolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "PutLifecyclePolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.PutLifecyclePolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.PutLifecyclePolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1PutLifecyclePolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1PutLifecyclePolicyCommand(output, context);
    }
}
exports.PutLifecyclePolicyCommand = PutLifecyclePolicyCommand;


/***/ }),
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrl = void 0;
const querystring_parser_1 = __webpack_require__(391);
const parseUrl = (url) => {
    const { hostname, pathname, port, protocol, search } = new URL(url);
    let query;
    if (search) {
        query = querystring_parser_1.parseQueryString(search);
    }
    return {
        hostname,
        port: port ? parseInt(port) : undefined,
        protocol,
        path: pathname,
        query,
    };
};
exports.parseUrl = parseUrl;


/***/ }),
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolvedPartition = void 0;
const getResolvedPartition = (region, { partitionHash }) => { var _a; return (_a = Object.keys(partitionHash || {}).find((key) => partitionHash[key].regions.includes(region))) !== null && _a !== void 0 ? _a : "aws"; };
exports.getResolvedPartition = getResolvedPartition;


/***/ }),
/* 193 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareRequest = void 0;
const cloneRequest_1 = __webpack_require__(57);
const constants_1 = __webpack_require__(84);
const prepareRequest = (request) => {
    request = typeof request.clone === "function" ? request.clone() : cloneRequest_1.cloneRequest(request);
    for (const headerName of Object.keys(request.headers)) {
        if (constants_1.GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
            delete request.headers[headerName];
        }
    }
    return request;
};
exports.prepareRequest = prepareRequest;


/***/ }),
/* 194 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_RETRY_MODE_CONFIG_OPTIONS = exports.CONFIG_RETRY_MODE = exports.ENV_RETRY_MODE = exports.resolveRetryConfig = exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = exports.CONFIG_MAX_ATTEMPTS = exports.ENV_MAX_ATTEMPTS = void 0;
const AdaptiveRetryStrategy_1 = __webpack_require__(358);
const config_1 = __webpack_require__(701);
const StandardRetryStrategy_1 = __webpack_require__(51);
exports.ENV_MAX_ATTEMPTS = "AWS_MAX_ATTEMPTS";
exports.CONFIG_MAX_ATTEMPTS = "max_attempts";
exports.NODE_MAX_ATTEMPT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => {
        const value = env[exports.ENV_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error(`Environment variable ${exports.ENV_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
    },
    configFileSelector: (profile) => {
        const value = profile[exports.CONFIG_MAX_ATTEMPTS];
        if (!value)
            return undefined;
        const maxAttempt = parseInt(value);
        if (Number.isNaN(maxAttempt)) {
            throw new Error(`Shared config file entry ${exports.CONFIG_MAX_ATTEMPTS} mast be a number, got "${value}"`);
        }
        return maxAttempt;
    },
    default: config_1.DEFAULT_MAX_ATTEMPTS,
};
const resolveRetryConfig = (input) => {
    const maxAttempts = normalizeMaxAttempts(input.maxAttempts);
    return {
        ...input,
        maxAttempts,
        retryStrategy: async () => {
            if (input.retryStrategy) {
                return input.retryStrategy;
            }
            const retryMode = await getRetryMode(input.retryMode);
            if (retryMode === config_1.RETRY_MODES.ADAPTIVE) {
                return new AdaptiveRetryStrategy_1.AdaptiveRetryStrategy(maxAttempts);
            }
            return new StandardRetryStrategy_1.StandardRetryStrategy(maxAttempts);
        },
    };
};
exports.resolveRetryConfig = resolveRetryConfig;
const getRetryMode = async (retryMode) => {
    if (typeof retryMode === "string") {
        return retryMode;
    }
    return await retryMode();
};
const normalizeMaxAttempts = (maxAttempts = config_1.DEFAULT_MAX_ATTEMPTS) => {
    if (typeof maxAttempts === "number") {
        const promisified = Promise.resolve(maxAttempts);
        return () => promisified;
    }
    return maxAttempts;
};
exports.ENV_RETRY_MODE = "AWS_RETRY_MODE";
exports.CONFIG_RETRY_MODE = "retry_mode";
exports.NODE_RETRY_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.ENV_RETRY_MODE],
    configFileSelector: (profile) => profile[exports.CONFIG_RETRY_MODE],
    default: config_1.DEFAULT_RETRY_MODE,
};


/***/ }),
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

//parse Empty Node as self closing node
const buildOptions = __webpack_require__(839).buildOptions;

const defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  cdataTagName: false,
  cdataPositionChar: '\\c',
  format: false,
  indentBy: '  ',
  supressEmptyNode: false,
  tagValueProcessor: function(a) {
    return a;
  },
  attrValueProcessor: function(a) {
    return a;
  },
};

const props = [
  'attributeNamePrefix',
  'attrNodeName',
  'textNodeName',
  'ignoreAttributes',
  'cdataTagName',
  'cdataPositionChar',
  'format',
  'indentBy',
  'supressEmptyNode',
  'tagValueProcessor',
  'attrValueProcessor',
];

function Parser(options) {
  this.options = buildOptions(options, defaultOptions, props);
  if (this.options.ignoreAttributes || this.options.attrNodeName) {
    this.isAttribute = function(/*a*/) {
      return false;
    };
  } else {
    this.attrPrefixLen = this.options.attributeNamePrefix.length;
    this.isAttribute = isAttribute;
  }
  if (this.options.cdataTagName) {
    this.isCDATA = isCDATA;
  } else {
    this.isCDATA = function(/*a*/) {
      return false;
    };
  }
  this.replaceCDATAstr = replaceCDATAstr;
  this.replaceCDATAarr = replaceCDATAarr;

  if (this.options.format) {
    this.indentate = indentate;
    this.tagEndChar = '>\n';
    this.newLine = '\n';
  } else {
    this.indentate = function() {
      return '';
    };
    this.tagEndChar = '>';
    this.newLine = '';
  }

  if (this.options.supressEmptyNode) {
    this.buildTextNode = buildEmptyTextNode;
    this.buildObjNode = buildEmptyObjNode;
  } else {
    this.buildTextNode = buildTextValNode;
    this.buildObjNode = buildObjectNode;
  }

  this.buildTextValNode = buildTextValNode;
  this.buildObjectNode = buildObjectNode;
}

Parser.prototype.parse = function(jObj) {
  return this.j2x(jObj, 0).val;
};

Parser.prototype.j2x = function(jObj, level) {
  let attrStr = '';
  let val = '';
  const keys = Object.keys(jObj);
  const len = keys.length;
  for (let i = 0; i < len; i++) {
    const key = keys[i];
    if (typeof jObj[key] === 'undefined') {
      // supress undefined node
    } else if (jObj[key] === null) {
      val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
    } else if (jObj[key] instanceof Date) {
      val += this.buildTextNode(jObj[key], key, '', level);
    } else if (typeof jObj[key] !== 'object') {
      //premitive type
      const attr = this.isAttribute(key);
      if (attr) {
        attrStr += ' ' + attr + '="' + this.options.attrValueProcessor('' + jObj[key]) + '"';
      } else if (this.isCDATA(key)) {
        if (jObj[this.options.textNodeName]) {
          val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
        } else {
          val += this.replaceCDATAstr('', jObj[key]);
        }
      } else {
        //tag value
        if (key === this.options.textNodeName) {
          if (jObj[this.options.cdataTagName]) {
            //value will added while processing cdata
          } else {
            val += this.options.tagValueProcessor('' + jObj[key]);
          }
        } else {
          val += this.buildTextNode(jObj[key], key, '', level);
        }
      }
    } else if (Array.isArray(jObj[key])) {
      //repeated nodes
      if (this.isCDATA(key)) {
        val += this.indentate(level);
        if (jObj[this.options.textNodeName]) {
          val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
        } else {
          val += this.replaceCDATAarr('', jObj[key]);
        }
      } else {
        //nested nodes
        const arrLen = jObj[key].length;
        for (let j = 0; j < arrLen; j++) {
          const item = jObj[key][j];
          if (typeof item === 'undefined') {
            // supress undefined node
          } else if (item === null) {
            val += this.indentate(level) + '<' + key + '/' + this.tagEndChar;
          } else if (typeof item === 'object') {
            const result = this.j2x(item, level + 1);
            val += this.buildObjNode(result.val, key, result.attrStr, level);
          } else {
            val += this.buildTextNode(item, key, '', level);
          }
        }
      }
    } else {
      //nested node
      if (this.options.attrNodeName && key === this.options.attrNodeName) {
        const Ks = Object.keys(jObj[key]);
        const L = Ks.length;
        for (let j = 0; j < L; j++) {
          attrStr += ' ' + Ks[j] + '="' + this.options.attrValueProcessor('' + jObj[key][Ks[j]]) + '"';
        }
      } else {
        const result = this.j2x(jObj[key], level + 1);
        val += this.buildObjNode(result.val, key, result.attrStr, level);
      }
    }
  }
  return {attrStr: attrStr, val: val};
};

function replaceCDATAstr(str, cdata) {
  str = this.options.tagValueProcessor('' + str);
  if (this.options.cdataPositionChar === '' || str === '') {
    return str + '<![CDATA[' + cdata + ']]' + this.tagEndChar;
  } else {
    return str.replace(this.options.cdataPositionChar, '<![CDATA[' + cdata + ']]' + this.tagEndChar);
  }
}

function replaceCDATAarr(str, cdata) {
  str = this.options.tagValueProcessor('' + str);
  if (this.options.cdataPositionChar === '' || str === '') {
    return str + '<![CDATA[' + cdata.join(']]><![CDATA[') + ']]' + this.tagEndChar;
  } else {
    for (let v in cdata) {
      str = str.replace(this.options.cdataPositionChar, '<![CDATA[' + cdata[v] + ']]>');
    }
    return str + this.newLine;
  }
}

function buildObjectNode(val, key, attrStr, level) {
  if (attrStr && !val.includes('<')) {
    return (
      this.indentate(level) +
      '<' +
      key +
      attrStr +
      '>' +
      val +
      //+ this.newLine
      // + this.indentate(level)
      '</' +
      key +
      this.tagEndChar
    );
  } else {
    return (
      this.indentate(level) +
      '<' +
      key +
      attrStr +
      this.tagEndChar +
      val +
      //+ this.newLine
      this.indentate(level) +
      '</' +
      key +
      this.tagEndChar
    );
  }
}

function buildEmptyObjNode(val, key, attrStr, level) {
  if (val !== '') {
    return this.buildObjectNode(val, key, attrStr, level);
  } else {
    return this.indentate(level) + '<' + key + attrStr + '/' + this.tagEndChar;
    //+ this.newLine
  }
}

function buildTextValNode(val, key, attrStr, level) {
  return (
    this.indentate(level) +
    '<' +
    key +
    attrStr +
    '>' +
    this.options.tagValueProcessor(val) +
    '</' +
    key +
    this.tagEndChar
  );
}

function buildEmptyTextNode(val, key, attrStr, level) {
  if (val !== '') {
    return this.buildTextValNode(val, key, attrStr, level);
  } else {
    return this.indentate(level) + '<' + key + attrStr + '/' + this.tagEndChar;
  }
}

function indentate(level) {
  return this.options.indentBy.repeat(level);
}

function isAttribute(name /*, options*/) {
  if (name.startsWith(this.options.attributeNamePrefix)) {
    return name.substr(this.attrPrefixLen);
  } else {
    return false;
  }
}

function isCDATA(name) {
  return name === this.options.cdataTagName;
}

//formatting
//indentation
//\n after each closing or self closing tag

module.exports = Parser;


/***/ }),
/* 201 */,
/* 202 */,
/* 203 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase64 = exports.fromBase64 = void 0;
const util_buffer_from_1 = __webpack_require__(59);
const BASE64_REGEX = /^[A-Za-z0-9+/]*={0,2}$/;
function fromBase64(input) {
    if ((input.length * 3) % 4 !== 0) {
        throw new TypeError(`Incorrect padding on base64 string.`);
    }
    if (!BASE64_REGEX.exec(input)) {
        throw new TypeError(`Invalid base64 string.`);
    }
    const buffer = util_buffer_from_1.fromString(input, "base64");
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
exports.fromBase64 = fromBase64;
function toBase64(input) {
    return util_buffer_from_1.fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("base64");
}
exports.toBase64 = toBase64;


/***/ }),
/* 204 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.setConnectionTimeout = void 0;
const setConnectionTimeout = (request, reject, timeoutInMs = 0) => {
    if (!timeoutInMs) {
        return;
    }
    request.on("socket", (socket) => {
        if (socket.connecting) {
            const timeoutId = setTimeout(() => {
                request.destroy();
                reject(Object.assign(new Error(`Socket timed out without establishing a connection within ${timeoutInMs} ms`), {
                    name: "TimeoutError",
                }));
            }, timeoutInMs);
            socket.on("connect", () => {
                clearTimeout(timeoutId);
            });
        }
    });
};
exports.setConnectionTimeout = setConnectionTimeout;


/***/ }),
/* 205 */,
/* 206 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSIENT_ERROR_STATUS_CODES = exports.TRANSIENT_ERROR_CODES = exports.THROTTLING_ERROR_CODES = exports.CLOCK_SKEW_ERROR_CODES = void 0;
exports.CLOCK_SKEW_ERROR_CODES = [
    "AuthFailure",
    "InvalidSignatureException",
    "RequestExpired",
    "RequestInTheFuture",
    "RequestTimeTooSkewed",
    "SignatureDoesNotMatch",
];
exports.THROTTLING_ERROR_CODES = [
    "BandwidthLimitExceeded",
    "EC2ThrottledException",
    "LimitExceededException",
    "PriorRequestNotComplete",
    "ProvisionedThroughputExceededException",
    "RequestLimitExceeded",
    "RequestThrottled",
    "RequestThrottledException",
    "SlowDown",
    "ThrottledException",
    "Throttling",
    "ThrottlingException",
    "TooManyRequestsException",
    "TransactionInProgressException",
];
exports.TRANSIENT_ERROR_CODES = ["AbortError", "TimeoutError", "RequestTimeout", "RequestTimeoutException"];
exports.TRANSIENT_ERROR_STATUS_CODES = [500, 502, 503, 504];


/***/ }),
/* 207 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(839);
const buildOptions = __webpack_require__(839).buildOptions;
const x2j = __webpack_require__(170);

//TODO: do it later
const convertToJsonString = function(node, options) {
  options = buildOptions(options, x2j.defaultOptions, x2j.props);

  options.indentBy = options.indentBy || '';
  return _cToJsonStr(node, options, 0);
};

const _cToJsonStr = function(node, options, level) {
  let jObj = '{';

  //traver through all the children
  const keys = Object.keys(node.child);

  for (let index = 0; index < keys.length; index++) {
    var tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj += '"' + tagname + '" : [ ';
      for (var tag in node.child[tagname]) {
        jObj += _cToJsonStr(node.child[tagname][tag], options) + ' , ';
      }
      jObj = jObj.substr(0, jObj.length - 1) + ' ] '; //remove extra comma in last
    } else {
      jObj += '"' + tagname + '" : ' + _cToJsonStr(node.child[tagname][0], options) + ' ,';
    }
  }
  util.merge(jObj, node.attrsMap);
  //add attrsMap as new children
  if (util.isEmptyObject(jObj)) {
    return util.isExist(node.val) ? node.val : '';
  } else {
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        jObj += '"' + options.textNodeName + '" : ' + stringval(node.val);
      }
    }
  }
  //add value
  if (jObj[jObj.length - 1] === ',') {
    jObj = jObj.substr(0, jObj.length - 2);
  }
  return jObj + '}';
};

function stringval(v) {
  if (v === true || v === false || !isNaN(v)) {
    return v;
  } else {
    return '"' + v + '"';
  }
}

function indentate(options, level) {
  return options.indentBy.repeat(level);
}

exports.convertToJsonString = convertToJsonString;


/***/ }),
/* 208 */,
/* 209 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(__webpack_require__(212));

var _md = _interopRequireDefault(__webpack_require__(803));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports.default = _default;

/***/ }),
/* 210 */,
/* 211 */
/***/ (function(module) {

module.exports = require("https");

/***/ }),
/* 212 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__webpack_require__(411));

var _parse = _interopRequireDefault(__webpack_require__(22));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),
/* 213 */
/***/ (function(module) {

module.exports = require("timers");

/***/ }),
/* 214 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpResponse = void 0;
class HttpResponse {
    constructor(options) {
        this.statusCode = options.statusCode;
        this.headers = options.headers || {};
        this.body = options.body;
    }
    static isInstance(response) {
        if (!response)
            return false;
        const resp = response;
        return typeof resp.statusCode === "number" && typeof resp.headers === "object";
    }
}
exports.HttpResponse = HttpResponse;


/***/ }),
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolvedSigningRegion = void 0;
const getResolvedSigningRegion = (hostname, { signingRegion, regionRegex, useFipsEndpoint }) => {
    if (signingRegion) {
        return signingRegion;
    }
    else if (useFipsEndpoint) {
        const regionRegexJs = regionRegex.replace("\\\\", "\\").replace(/^\^/g, "\\.").replace(/\$$/g, "\\.");
        const regionRegexmatchArray = hostname.match(regionRegexJs);
        if (regionRegexmatchArray) {
            return regionRegexmatchArray[0].slice(1, -1);
        }
    }
};
exports.getResolvedSigningRegion = getResolvedSigningRegion;


/***/ }),
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isTransientError = exports.isThrottlingError = exports.isClockSkewError = exports.isRetryableByTrait = void 0;
const constants_1 = __webpack_require__(206);
const isRetryableByTrait = (error) => error.$retryable !== undefined;
exports.isRetryableByTrait = isRetryableByTrait;
const isClockSkewError = (error) => constants_1.CLOCK_SKEW_ERROR_CODES.includes(error.name);
exports.isClockSkewError = isClockSkewError;
const isThrottlingError = (error) => {
    var _a, _b;
    return ((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) === 429 ||
        constants_1.THROTTLING_ERROR_CODES.includes(error.name) ||
        ((_b = error.$retryable) === null || _b === void 0 ? void 0 : _b.throttling) == true;
};
exports.isThrottlingError = isThrottlingError;
const isTransientError = (error) => {
    var _a;
    return constants_1.TRANSIENT_ERROR_CODES.includes(error.name) ||
        constants_1.TRANSIENT_ERROR_STATUS_CODES.includes(((_a = error.$metadata) === null || _a === void 0 ? void 0 : _a.httpStatusCode) || 0);
};
exports.isTransientError = isTransientError;


/***/ }),
/* 224 */,
/* 225 */,
/* 226 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' +
                Buffer.from(this.username + ':' + this.password).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] = 'Bearer ' + this.token;
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        options.headers['Authorization'] =
            'Basic ' + Buffer.from('PAT:' + this.token).toString('base64');
    }
    // This handler cannot handle 401
    canHandleAuthentication(response) {
        return false;
    }
    handleAuthentication(httpClient, requestInfo, objs) {
        return null;
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;


/***/ }),
/* 227 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(378), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(650), exports);
tslib_1.__exportStar(__webpack_require__(491), exports);
tslib_1.__exportStar(__webpack_require__(439), exports);
tslib_1.__exportStar(__webpack_require__(133), exports);
tslib_1.__exportStar(__webpack_require__(629), exports);
tslib_1.__exportStar(__webpack_require__(573), exports);


/***/ }),
/* 228 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeConfig = void 0;
const tslib_1 = __webpack_require__(422);
const package_json_1 = tslib_1.__importDefault(__webpack_require__(824));
const defaultStsRoleAssumers_1 = __webpack_require__(551);
const config_resolver_1 = __webpack_require__(529);
const credential_provider_node_1 = __webpack_require__(125);
const hash_node_1 = __webpack_require__(145);
const middleware_retry_1 = __webpack_require__(286);
const node_config_provider_1 = __webpack_require__(519);
const node_http_handler_1 = __webpack_require__(953);
const util_base64_node_1 = __webpack_require__(203);
const util_body_length_node_1 = __webpack_require__(555);
const util_user_agent_node_1 = __webpack_require__(96);
const util_utf8_node_1 = __webpack_require__(841);
const runtimeConfig_shared_1 = __webpack_require__(34);
const smithy_client_1 = __webpack_require__(973);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    smithy_client_1.emitWarningIfUnsupportedVersion(process.version);
    const clientSharedValues = runtimeConfig_shared_1.getRuntimeConfig(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : util_base64_node_1.fromBase64,
        base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : util_base64_node_1.toBase64,
        bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : util_body_length_node_1.calculateBodyLength,
        credentialDefaultProvider: (_d = config === null || config === void 0 ? void 0 : config.credentialDefaultProvider) !== null && _d !== void 0 ? _d : defaultStsRoleAssumers_1.decorateDefaultCredentialProvider(credential_provider_node_1.defaultProvider),
        defaultUserAgentProvider: (_e = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _e !== void 0 ? _e : util_user_agent_node_1.defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: (_f = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _f !== void 0 ? _f : node_config_provider_1.loadConfig(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: (_g = config === null || config === void 0 ? void 0 : config.region) !== null && _g !== void 0 ? _g : node_config_provider_1.loadConfig(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: (_h = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _h !== void 0 ? _h : new node_http_handler_1.NodeHttpHandler(),
        retryMode: (_j = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _j !== void 0 ? _j : node_config_provider_1.loadConfig(middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS),
        sha256: (_k = config === null || config === void 0 ? void 0 : config.sha256) !== null && _k !== void 0 ? _k : hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: (_l = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _l !== void 0 ? _l : node_http_handler_1.streamCollector,
        useDualstackEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _m !== void 0 ? _m : node_config_provider_1.loadConfig(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: (_o = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _o !== void 0 ? _o : node_config_provider_1.loadConfig(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        utf8Decoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _p !== void 0 ? _p : util_utf8_node_1.fromUtf8,
        utf8Encoder: (_q = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _q !== void 0 ? _q : util_utf8_node_1.toUtf8,
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),
/* 229 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRepositoryPolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DeleteRepositoryPolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DeleteRepositoryPolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DeleteRepositoryPolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DeleteRepositoryPolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DeleteRepositoryPolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DeleteRepositoryPolicyCommand(output, context);
    }
}
exports.DeleteRepositoryPolicyCommand = DeleteRepositoryPolicyCommand;


/***/ }),
/* 230 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromInstanceMetadata = void 0;
const property_provider_1 = __webpack_require__(948);
const httpRequest_1 = __webpack_require__(175);
const ImdsCredentials_1 = __webpack_require__(560);
const RemoteProviderInit_1 = __webpack_require__(846);
const retry_1 = __webpack_require__(588);
const getInstanceMetadataEndpoint_1 = __webpack_require__(745);
const IMDS_PATH = "/latest/meta-data/iam/security-credentials/";
const IMDS_TOKEN_PATH = "/latest/api/token";
const fromInstanceMetadata = (init = {}) => {
    let disableFetchToken = false;
    const { timeout, maxRetries } = RemoteProviderInit_1.providerConfigFromInit(init);
    const getCredentials = async (maxRetries, options) => {
        const profile = (await retry_1.retry(async () => {
            let profile;
            try {
                profile = await getProfile(options);
            }
            catch (err) {
                if (err.statusCode === 401) {
                    disableFetchToken = false;
                }
                throw err;
            }
            return profile;
        }, maxRetries)).trim();
        return retry_1.retry(async () => {
            let creds;
            try {
                creds = await getCredentialsFromProfile(profile, options);
            }
            catch (err) {
                if (err.statusCode === 401) {
                    disableFetchToken = false;
                }
                throw err;
            }
            return creds;
        }, maxRetries);
    };
    return async () => {
        const endpoint = await getInstanceMetadataEndpoint_1.getInstanceMetadataEndpoint();
        if (disableFetchToken) {
            return getCredentials(maxRetries, { ...endpoint, timeout });
        }
        else {
            let token;
            try {
                token = (await getMetadataToken({ ...endpoint, timeout })).toString();
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.statusCode) === 400) {
                    throw Object.assign(error, {
                        message: "EC2 Metadata token request returned error",
                    });
                }
                else if (error.message === "TimeoutError" || [403, 404, 405].includes(error.statusCode)) {
                    disableFetchToken = true;
                }
                return getCredentials(maxRetries, { ...endpoint, timeout });
            }
            return getCredentials(maxRetries, {
                ...endpoint,
                headers: {
                    "x-aws-ec2-metadata-token": token,
                },
                timeout,
            });
        }
    };
};
exports.fromInstanceMetadata = fromInstanceMetadata;
const getMetadataToken = async (options) => httpRequest_1.httpRequest({
    ...options,
    path: IMDS_TOKEN_PATH,
    method: "PUT",
    headers: {
        "x-aws-ec2-metadata-token-ttl-seconds": "21600",
    },
});
const getProfile = async (options) => (await httpRequest_1.httpRequest({ ...options, path: IMDS_PATH })).toString();
const getCredentialsFromProfile = async (profile, options) => {
    const credsResponse = JSON.parse((await httpRequest_1.httpRequest({
        ...options,
        path: IMDS_PATH + profile,
    })).toString());
    if (!ImdsCredentials_1.isImdsCredentials(credsResponse)) {
        throw new property_provider_1.CredentialsProviderError("Invalid response received from instance metadata service.");
    }
    return ImdsCredentials_1.fromImdsCredentials(credsResponse);
};


/***/ }),
/* 231 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getUpdatedSystemClockOffset = void 0;
const isClockSkewed_1 = __webpack_require__(881);
const getUpdatedSystemClockOffset = (clockTime, currentSystemClockOffset) => {
    const clockTimeInMs = Date.parse(clockTime);
    if (isClockSkewed_1.isClockSkewed(clockTimeInMs, currentSystemClockOffset)) {
        return clockTimeInMs - Date.now();
    }
    return currentSystemClockOffset;
};
exports.getUpdatedSystemClockOffset = getUpdatedSystemClockOffset;


/***/ }),
/* 232 */,
/* 233 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.setSocketTimeout = void 0;
const setSocketTimeout = (request, reject, timeoutInMs = 0) => {
    request.setTimeout(timeoutInMs, () => {
        request.destroy();
        reject(Object.assign(new Error(`Connection timed out after ${timeoutInMs} ms`), { name: "TimeoutError" }));
    });
};
exports.setSocketTimeout = setSocketTimeout;


/***/ }),
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(76), exports);
tslib_1.__exportStar(__webpack_require__(667), exports);


/***/ }),
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAccountsCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(743);
const Aws_restJson1_1 = __webpack_require__(340);
class ListAccountsCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.ListAccountsRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.ListAccountsResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_restJson1_1.serializeAws_restJson1ListAccountsCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_restJson1_1.deserializeAws_restJson1ListAccountsCommand(output, context);
    }
}
exports.ListAccountsCommand = ListAccountsCommand;


/***/ }),
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 252 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromEnv = void 0;
const property_provider_1 = __webpack_require__(948);
const fromEnv = (envVarSelector) => async () => {
    try {
        const config = envVarSelector(process.env);
        if (config === undefined) {
            throw new Error();
        }
        return config;
    }
    catch (e) {
        throw new property_provider_1.CredentialsProviderError(e.message || `Cannot load config from environment variables with getter: ${envVarSelector}`);
    }
};
exports.fromEnv = fromEnv;


/***/ }),
/* 253 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
var entities_json_1 = __importDefault(__webpack_require__(353));
var legacy_json_1 = __importDefault(__webpack_require__(167));
var xml_json_1 = __importDefault(__webpack_require__(370));
var decode_codepoint_1 = __importDefault(__webpack_require__(169));
var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
exports.decodeXML = getStrictDecoder(xml_json_1.default);
exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
function getStrictDecoder(map) {
    var replace = getReplacer(map);
    return function (str) { return String(str).replace(strictEntityRe, replace); };
}
var sorter = function (a, b) { return (a < b ? 1 : -1); };
exports.decodeHTML = (function () {
    var legacy = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1.default).sort(sorter);
    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        }
        else {
            keys[i] += ";";
        }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1.default);
    function replacer(str) {
        if (str.substr(-1) !== ";")
            str += ";";
        return replace(str);
    }
    // TODO consider creating a merged map
    return function (str) { return String(str).replace(re, replacer); };
})();
function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            var secondChar = str.charAt(2);
            if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
            }
            return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return map[str.slice(1, -1)] || str;
    };
}


/***/ }),
/* 254 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostnameFromVariants = void 0;
const getHostnameFromVariants = (variants = [], { useFipsEndpoint, useDualstackEndpoint }) => {
    var _a;
    return (_a = variants.find(({ tags }) => useFipsEndpoint === tags.includes("fips") && useDualstackEndpoint === tags.includes("dualstack"))) === null || _a === void 0 ? void 0 : _a.hostname;
};
exports.getHostnameFromVariants = getHostnameFromVariants;


/***/ }),
/* 255 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeUri = void 0;
const escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
exports.escapeUri = escapeUri;
const hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;


/***/ }),
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(886), exports);


/***/ }),
/* 264 */,
/* 265 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanonicalHeaders = void 0;
const constants_1 = __webpack_require__(84);
const getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
    const canonical = {};
    for (const headerName of Object.keys(headers).sort()) {
        const canonicalHeaderName = headerName.toLowerCase();
        if (canonicalHeaderName in constants_1.ALWAYS_UNSIGNABLE_HEADERS ||
            (unsignableHeaders === null || unsignableHeaders === void 0 ? void 0 : unsignableHeaders.has(canonicalHeaderName)) ||
            constants_1.PROXY_HEADER_PATTERN.test(canonicalHeaderName) ||
            constants_1.SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
            if (!signableHeaders || (signableHeaders && !signableHeaders.has(canonicalHeaderName))) {
                continue;
            }
        }
        canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
    }
    return canonical;
};
exports.getCanonicalHeaders = getCanonicalHeaders;


/***/ }),
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.runPolling = void 0;
const sleep_1 = __webpack_require__(76);
const waiter_1 = __webpack_require__(916);
const exponentialBackoffWithJitter = (minDelay, maxDelay, attemptCeiling, attempt) => {
    if (attempt > attemptCeiling)
        return maxDelay;
    const delay = minDelay * 2 ** (attempt - 1);
    return randomInRange(minDelay, delay);
};
const randomInRange = (min, max) => min + Math.random() * (max - min);
const runPolling = async ({ minDelay, maxDelay, maxWaitTime, abortController, client, abortSignal }, input, acceptorChecks) => {
    var _a;
    const { state } = await acceptorChecks(client, input);
    if (state !== waiter_1.WaiterState.RETRY) {
        return { state };
    }
    let currentAttempt = 1;
    const waitUntil = Date.now() + maxWaitTime * 1000;
    const attemptCeiling = Math.log(maxDelay / minDelay) / Math.log(2) + 1;
    while (true) {
        if (((_a = abortController === null || abortController === void 0 ? void 0 : abortController.signal) === null || _a === void 0 ? void 0 : _a.aborted) || (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted)) {
            return { state: waiter_1.WaiterState.ABORTED };
        }
        const delay = exponentialBackoffWithJitter(minDelay, maxDelay, attemptCeiling, currentAttempt);
        if (Date.now() + delay * 1000 > waitUntil) {
            return { state: waiter_1.WaiterState.TIMEOUT };
        }
        await sleep_1.sleep(delay);
        const { state } = await acceptorChecks(client, input);
        if (state !== waiter_1.WaiterState.RETRY) {
            return { state };
        }
        currentAttempt += 1;
    }
};
exports.runPolling = runPolling;


/***/ }),
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = exports.DEFAULT_USE_DUALSTACK_ENDPOINT = exports.CONFIG_USE_DUALSTACK_ENDPOINT = exports.ENV_USE_DUALSTACK_ENDPOINT = void 0;
const util_config_provider_1 = __webpack_require__(515);
exports.ENV_USE_DUALSTACK_ENDPOINT = "AWS_USE_DUALSTACK_ENDPOINT";
exports.CONFIG_USE_DUALSTACK_ENDPOINT = "use_dualstack_endpoint";
exports.DEFAULT_USE_DUALSTACK_ENDPOINT = false;
exports.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => util_config_provider_1.booleanSelector(env, exports.ENV_USE_DUALSTACK_ENDPOINT, util_config_provider_1.SelectorType.ENV),
    configFileSelector: (profile) => util_config_provider_1.booleanSelector(profile, exports.CONFIG_USE_DUALSTACK_ENDPOINT, util_config_provider_1.SelectorType.CONFIG),
    default: false,
};


/***/ }),
/* 281 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "v1", {
  enumerable: true,
  get: function () {
    return _v.default;
  }
});
Object.defineProperty(exports, "v3", {
  enumerable: true,
  get: function () {
    return _v2.default;
  }
});
Object.defineProperty(exports, "v4", {
  enumerable: true,
  get: function () {
    return _v3.default;
  }
});
Object.defineProperty(exports, "v5", {
  enumerable: true,
  get: function () {
    return _v4.default;
  }
});
Object.defineProperty(exports, "NIL", {
  enumerable: true,
  get: function () {
    return _nil.default;
  }
});
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function () {
    return _version.default;
  }
});
Object.defineProperty(exports, "validate", {
  enumerable: true,
  get: function () {
    return _validate.default;
  }
});
Object.defineProperty(exports, "stringify", {
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});

var _v = _interopRequireDefault(__webpack_require__(893));

var _v2 = _interopRequireDefault(__webpack_require__(209));

var _v3 = _interopRequireDefault(__webpack_require__(733));

var _v4 = _interopRequireDefault(__webpack_require__(384));

var _nil = _interopRequireDefault(__webpack_require__(327));

var _version = _interopRequireDefault(__webpack_require__(695));

var _validate = _interopRequireDefault(__webpack_require__(78));

var _stringify = _interopRequireDefault(__webpack_require__(411));

var _parse = _interopRequireDefault(__webpack_require__(22));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 282 */,
/* 283 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(410), exports);
tslib_1.__exportStar(__webpack_require__(429), exports);
tslib_1.__exportStar(__webpack_require__(977), exports);
tslib_1.__exportStar(__webpack_require__(966), exports);
tslib_1.__exportStar(__webpack_require__(139), exports);
tslib_1.__exportStar(__webpack_require__(432), exports);


/***/ }),
/* 284 */,
/* 285 */,
/* 286 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(358), exports);
tslib_1.__exportStar(__webpack_require__(883), exports);
tslib_1.__exportStar(__webpack_require__(51), exports);
tslib_1.__exportStar(__webpack_require__(701), exports);
tslib_1.__exportStar(__webpack_require__(194), exports);
tslib_1.__exportStar(__webpack_require__(15), exports);
tslib_1.__exportStar(__webpack_require__(691), exports);
tslib_1.__exportStar(__webpack_require__(932), exports);
tslib_1.__exportStar(__webpack_require__(894), exports);
tslib_1.__exportStar(__webpack_require__(251), exports);


/***/ }),
/* 287 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DescribeRepositoriesCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DescribeRepositoriesCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DescribeRepositoriesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DescribeRepositoriesRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DescribeRepositoriesResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DescribeRepositoriesCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DescribeRepositoriesCommand(output, context);
    }
}
exports.DescribeRepositoriesCommand = DescribeRepositoriesCommand;


/***/ }),
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */
/***/ (function(module) {

module.exports = require("buffer");

/***/ }),
/* 294 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndpointFromRegion = void 0;
const getEndpointFromRegion = async (input) => {
    var _a;
    const { tls = true } = input;
    const region = await input.region();
    const dnsHostRegex = new RegExp(/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])$/);
    if (!dnsHostRegex.test(region)) {
        throw new Error("Invalid region in client config");
    }
    const useDualstackEndpoint = await input.useDualstackEndpoint();
    const useFipsEndpoint = await input.useFipsEndpoint();
    const { hostname } = (_a = (await input.regionInfoProvider(region, { useDualstackEndpoint, useFipsEndpoint }))) !== null && _a !== void 0 ? _a : {};
    if (!hostname) {
        throw new Error("Cannot resolve hostname from client config");
    }
    return input.urlParser(`${tls ? "https:" : "http:"}//${hostname}`);
};
exports.getEndpointFromRegion = getEndpointFromRegion;


/***/ }),
/* 295 */,
/* 296 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DescribeImageReplicationStatusCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DescribeImageReplicationStatusCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DescribeImageReplicationStatusCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DescribeImageReplicationStatusRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DescribeImageReplicationStatusResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DescribeImageReplicationStatusCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DescribeImageReplicationStatusCommand(output, context);
    }
}
exports.DescribeImageReplicationStatusCommand = DescribeImageReplicationStatusCommand;


/***/ }),
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */
/***/ (function(module) {

module.exports = require("string_decoder");

/***/ }),
/* 305 */,
/* 306 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
var xml_json_1 = __importDefault(__webpack_require__(370));
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeXML = getASCIIEncoder(inverseXML);
var entities_json_1 = __importDefault(__webpack_require__(353));
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
/**
 * Encodes all entities and non-ASCII characters in the input.
 *
 * This includes characters that are valid ASCII characters in HTML documents.
 * For example `#` will be encoded as `&num;`. To get a more compact output,
 * consider using the `encodeNonAsciiHTML` function.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
    }, {});
}
function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
            // Add value to single array
            single.push("\\" + k);
        }
        else {
            // Add value to multiple array
            multiple.push(k);
        }
    }
    // Add ranges to single characters.
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
        // Find the end of a run of characters
        var end = start;
        while (end < single.length - 1 &&
            single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
            end += 1;
        }
        var count = 1 + end - start;
        // We want to replace at least three characters
        if (count < 3)
            continue;
        single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
}
// /[^\0-\x7F]/gu
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
var getCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function (str) { return str.codePointAt(0); }
    : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function (c) {
            return (c.charCodeAt(0) - 0xd800) * 0x400 +
                c.charCodeAt(1) -
                0xdc00 +
                0x10000;
        };
function singleCharReplacer(c) {
    return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
        .toString(16)
        .toUpperCase() + ";";
}
function getInverse(inverse, re) {
    return function (data) {
        return data
            .replace(re, function (name) { return inverse[name]; })
            .replace(reNonASCII, singleCharReplacer);
    };
}
var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */
function escape(data) {
    return data.replace(reEscapeChars, singleCharReplacer);
}
exports.escape = escape;
/**
 * Encodes all characters not valid in XML documents using numeric hexadecimal
 * reference (eg. `&#xfc;`).
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */
function escapeUTF8(data) {
    return data.replace(xmlReplacer, singleCharReplacer);
}
exports.escapeUTF8 = escapeUTF8;
function getASCIIEncoder(obj) {
    return function (data) {
        return data.replace(reEscapeChars, function (c) { return obj[c] || singleCharReplacer(c); });
    };
}


/***/ }),
/* 307 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(332), exports);
tslib_1.__exportStar(__webpack_require__(177), exports);


/***/ }),
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */,
/* 312 */,
/* 313 */,
/* 314 */,
/* 315 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCredentialsProvider = exports.normalizeRegionProvider = void 0;
const normalizeRegionProvider = (region) => {
    if (typeof region === "string") {
        const promisified = Promise.resolve(region);
        return () => promisified;
    }
    else {
        return region;
    }
};
exports.normalizeRegionProvider = normalizeRegionProvider;
const normalizeCredentialsProvider = (credentials) => {
    if (typeof credentials === "object") {
        const promisified = Promise.resolve(credentials);
        return () => promisified;
    }
    else {
        return credentials;
    }
};
exports.normalizeCredentialsProvider = normalizeCredentialsProvider;


/***/ }),
/* 316 */
/***/ (function(module) {

module.exports = require("process");

/***/ }),
/* 317 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRegistryPolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DeleteRegistryPolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DeleteRegistryPolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DeleteRegistryPolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DeleteRegistryPolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DeleteRegistryPolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DeleteRegistryPolicyCommand(output, context);
    }
}
exports.DeleteRegistryPolicyCommand = DeleteRegistryPolicyCommand;


/***/ }),
/* 318 */,
/* 319 */,
/* 320 */,
/* 321 */,
/* 322 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ENDPOINT_CONFIG_OPTIONS = exports.CONFIG_ENDPOINT_NAME = exports.ENV_ENDPOINT_NAME = void 0;
exports.ENV_ENDPOINT_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT";
exports.CONFIG_ENDPOINT_NAME = "ec2_metadata_service_endpoint";
exports.ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.ENV_ENDPOINT_NAME],
    configFileSelector: (profile) => profile[exports.CONFIG_ENDPOINT_NAME],
    default: undefined,
};


/***/ }),
/* 323 */,
/* 324 */,
/* 325 */,
/* 326 */,
/* 327 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports.default = _default;

/***/ }),
/* 328 */,
/* 329 */,
/* 330 */,
/* 331 */,
/* 332 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSigV4AuthConfig = exports.resolveAwsAuthConfig = void 0;
const property_provider_1 = __webpack_require__(948);
const signature_v4_1 = __webpack_require__(414);
const CREDENTIAL_EXPIRE_WINDOW = 300000;
const resolveAwsAuthConfig = (input) => {
    const normalizedCreds = input.credentials
        ? normalizeCredentialProvider(input.credentials)
        : input.credentialDefaultProvider(input);
    const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
    let signer;
    if (input.signer) {
        signer = normalizeProvider(input.signer);
    }
    else {
        signer = () => normalizeProvider(input.region)()
            .then(async (region) => [
            (await input.regionInfoProvider(region, {
                useFipsEndpoint: await input.useFipsEndpoint(),
                useDualstackEndpoint: await input.useDualstackEndpoint(),
            })) || {},
            region,
        ])
            .then(([regionInfo, region]) => {
            const { signingRegion, signingService } = regionInfo;
            input.signingRegion = input.signingRegion || signingRegion || region;
            input.signingName = input.signingName || signingService || input.serviceId;
            const params = {
                ...input,
                credentials: normalizedCreds,
                region: input.signingRegion,
                service: input.signingName,
                sha256,
                uriEscapePath: signingEscapePath,
            };
            const signerConstructor = input.signerConstructor || signature_v4_1.SignatureV4;
            return new signerConstructor(params);
        });
    }
    return {
        ...input,
        systemClockOffset,
        signingEscapePath,
        credentials: normalizedCreds,
        signer,
    };
};
exports.resolveAwsAuthConfig = resolveAwsAuthConfig;
const resolveSigV4AuthConfig = (input) => {
    const normalizedCreds = input.credentials
        ? normalizeCredentialProvider(input.credentials)
        : input.credentialDefaultProvider(input);
    const { signingEscapePath = true, systemClockOffset = input.systemClockOffset || 0, sha256 } = input;
    let signer;
    if (input.signer) {
        signer = normalizeProvider(input.signer);
    }
    else {
        signer = normalizeProvider(new signature_v4_1.SignatureV4({
            credentials: normalizedCreds,
            region: input.region,
            service: input.signingName,
            sha256,
            uriEscapePath: signingEscapePath,
        }));
    }
    return {
        ...input,
        systemClockOffset,
        signingEscapePath,
        credentials: normalizedCreds,
        signer,
    };
};
exports.resolveSigV4AuthConfig = resolveSigV4AuthConfig;
const normalizeProvider = (input) => {
    if (typeof input === "object") {
        const promisified = Promise.resolve(input);
        return () => promisified;
    }
    return input;
};
const normalizeCredentialProvider = (credentials) => {
    if (typeof credentials === "function") {
        return property_provider_1.memoize(credentials, (credentials) => credentials.expiration !== undefined &&
            credentials.expiration.getTime() - Date.now() < CREDENTIAL_EXPIRE_WINDOW, (credentials) => credentials.expiration !== undefined);
    }
    return normalizeProvider(credentials);
};


/***/ }),
/* 333 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueFromTextNode = void 0;
const getValueFromTextNode = (obj) => {
    const textNodeName = "#text";
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key][textNodeName] !== undefined) {
            obj[key] = obj[key][textNodeName];
        }
        else if (typeof obj[key] === "object" && obj[key] !== null) {
            obj[key] = exports.getValueFromTextNode(obj[key]);
        }
    }
    return obj;
};
exports.getValueFromTextNode = getValueFromTextNode;


/***/ }),
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateDefaultCredentialProvider = exports.getDefaultRoleAssumerWithWebIdentity = exports.getDefaultRoleAssumer = void 0;
const defaultStsRoleAssumers_1 = __webpack_require__(551);
const STSClient_1 = __webpack_require__(570);
const getDefaultRoleAssumer = (stsOptions = {}) => defaultStsRoleAssumers_1.getDefaultRoleAssumer(stsOptions, STSClient_1.STSClient);
exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
const getDefaultRoleAssumerWithWebIdentity = (stsOptions = {}) => defaultStsRoleAssumers_1.getDefaultRoleAssumerWithWebIdentity(stsOptions, STSClient_1.STSClient);
exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
const decorateDefaultCredentialProvider = (provider) => (input) => provider({
    roleAssumer: exports.getDefaultRoleAssumer(input),
    roleAssumerWithWebIdentity: exports.getDefaultRoleAssumerWithWebIdentity(input),
    ...input,
});
exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;


/***/ }),
/* 338 */,
/* 339 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getMasterProfileName = exports.parseKnownFiles = exports.DEFAULT_PROFILE = exports.ENV_PROFILE = void 0;
const shared_ini_file_loader_1 = __webpack_require__(360);
exports.ENV_PROFILE = "AWS_PROFILE";
exports.DEFAULT_PROFILE = "default";
const parseKnownFiles = async (init) => {
    const { loadedConfig = shared_ini_file_loader_1.loadSharedConfigFiles(init) } = init;
    const parsedFiles = await loadedConfig;
    return {
        ...parsedFiles.configFile,
        ...parsedFiles.credentialsFile,
    };
};
exports.parseKnownFiles = parseKnownFiles;
const getMasterProfileName = (init) => init.profile || process.env[exports.ENV_PROFILE] || exports.DEFAULT_PROFILE;
exports.getMasterProfileName = getMasterProfileName;


/***/ }),
/* 340 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeAws_restJson1LogoutCommand = exports.deserializeAws_restJson1ListAccountsCommand = exports.deserializeAws_restJson1ListAccountRolesCommand = exports.deserializeAws_restJson1GetRoleCredentialsCommand = exports.serializeAws_restJson1LogoutCommand = exports.serializeAws_restJson1ListAccountsCommand = exports.serializeAws_restJson1ListAccountRolesCommand = exports.serializeAws_restJson1GetRoleCredentialsCommand = void 0;
const protocol_http_1 = __webpack_require__(504);
const smithy_client_1 = __webpack_require__(973);
const serializeAws_restJson1GetRoleCredentialsCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        ...(isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }),
    };
    const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}` + "/federation/credentials";
    const query = {
        ...(input.roleName !== undefined && { role_name: input.roleName }),
        ...(input.accountId !== undefined && { account_id: input.accountId }),
    };
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
exports.serializeAws_restJson1GetRoleCredentialsCommand = serializeAws_restJson1GetRoleCredentialsCommand;
const serializeAws_restJson1ListAccountRolesCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        ...(isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }),
    };
    const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}` + "/assignment/roles";
    const query = {
        ...(input.nextToken !== undefined && { next_token: input.nextToken }),
        ...(input.maxResults !== undefined && { max_result: input.maxResults.toString() }),
        ...(input.accountId !== undefined && { account_id: input.accountId }),
    };
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
exports.serializeAws_restJson1ListAccountRolesCommand = serializeAws_restJson1ListAccountRolesCommand;
const serializeAws_restJson1ListAccountsCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        ...(isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }),
    };
    const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}` + "/assignment/accounts";
    const query = {
        ...(input.nextToken !== undefined && { next_token: input.nextToken }),
        ...(input.maxResults !== undefined && { max_result: input.maxResults.toString() }),
    };
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "GET",
        headers,
        path: resolvedPath,
        query,
        body,
    });
};
exports.serializeAws_restJson1ListAccountsCommand = serializeAws_restJson1ListAccountsCommand;
const serializeAws_restJson1LogoutCommand = async (input, context) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const headers = {
        ...(isSerializableHeaderValue(input.accessToken) && { "x-amz-sso_bearer_token": input.accessToken }),
    };
    const resolvedPath = `${(basePath === null || basePath === void 0 ? void 0 : basePath.endsWith("/")) ? basePath.slice(0, -1) : basePath || ""}` + "/logout";
    let body;
    return new protocol_http_1.HttpRequest({
        protocol,
        hostname,
        port,
        method: "POST",
        headers,
        path: resolvedPath,
        body,
    });
};
exports.serializeAws_restJson1LogoutCommand = serializeAws_restJson1LogoutCommand;
const deserializeAws_restJson1GetRoleCredentialsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1GetRoleCredentialsCommandError(output, context);
    }
    const contents = {
        $metadata: deserializeMetadata(output),
        roleCredentials: undefined,
    };
    const data = smithy_client_1.expectNonNull(smithy_client_1.expectObject(await parseBody(output.body, context)), "body");
    if (data.roleCredentials !== undefined && data.roleCredentials !== null) {
        contents.roleCredentials = deserializeAws_restJson1RoleCredentials(data.roleCredentials, context);
    }
    return Promise.resolve(contents);
};
exports.deserializeAws_restJson1GetRoleCredentialsCommand = deserializeAws_restJson1GetRoleCredentialsCommand;
const deserializeAws_restJson1GetRoleCredentialsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            response = {
                ...(await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            response = {
                ...(await deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            response = {
                ...(await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            response = {
                ...(await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_restJson1ListAccountRolesCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1ListAccountRolesCommandError(output, context);
    }
    const contents = {
        $metadata: deserializeMetadata(output),
        nextToken: undefined,
        roleList: undefined,
    };
    const data = smithy_client_1.expectNonNull(smithy_client_1.expectObject(await parseBody(output.body, context)), "body");
    if (data.nextToken !== undefined && data.nextToken !== null) {
        contents.nextToken = smithy_client_1.expectString(data.nextToken);
    }
    if (data.roleList !== undefined && data.roleList !== null) {
        contents.roleList = deserializeAws_restJson1RoleListType(data.roleList, context);
    }
    return Promise.resolve(contents);
};
exports.deserializeAws_restJson1ListAccountRolesCommand = deserializeAws_restJson1ListAccountRolesCommand;
const deserializeAws_restJson1ListAccountRolesCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            response = {
                ...(await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            response = {
                ...(await deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            response = {
                ...(await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            response = {
                ...(await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_restJson1ListAccountsCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1ListAccountsCommandError(output, context);
    }
    const contents = {
        $metadata: deserializeMetadata(output),
        accountList: undefined,
        nextToken: undefined,
    };
    const data = smithy_client_1.expectNonNull(smithy_client_1.expectObject(await parseBody(output.body, context)), "body");
    if (data.accountList !== undefined && data.accountList !== null) {
        contents.accountList = deserializeAws_restJson1AccountListType(data.accountList, context);
    }
    if (data.nextToken !== undefined && data.nextToken !== null) {
        contents.nextToken = smithy_client_1.expectString(data.nextToken);
    }
    return Promise.resolve(contents);
};
exports.deserializeAws_restJson1ListAccountsCommand = deserializeAws_restJson1ListAccountsCommand;
const deserializeAws_restJson1ListAccountsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            response = {
                ...(await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ResourceNotFoundException":
        case "com.amazonaws.sso#ResourceNotFoundException":
            response = {
                ...(await deserializeAws_restJson1ResourceNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            response = {
                ...(await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            response = {
                ...(await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_restJson1LogoutCommand = async (output, context) => {
    if (output.statusCode !== 200 && output.statusCode >= 300) {
        return deserializeAws_restJson1LogoutCommandError(output, context);
    }
    const contents = {
        $metadata: deserializeMetadata(output),
    };
    await collectBody(output.body, context);
    return Promise.resolve(contents);
};
exports.deserializeAws_restJson1LogoutCommand = deserializeAws_restJson1LogoutCommand;
const deserializeAws_restJson1LogoutCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidRequestException":
        case "com.amazonaws.sso#InvalidRequestException":
            response = {
                ...(await deserializeAws_restJson1InvalidRequestExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyRequestsException":
        case "com.amazonaws.sso#TooManyRequestsException":
            response = {
                ...(await deserializeAws_restJson1TooManyRequestsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UnauthorizedException":
        case "com.amazonaws.sso#UnauthorizedException":
            response = {
                ...(await deserializeAws_restJson1UnauthorizedExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_restJson1InvalidRequestExceptionResponse = async (parsedOutput, context) => {
    const contents = {
        name: "InvalidRequestException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        message: undefined,
    };
    const data = parsedOutput.body;
    if (data.message !== undefined && data.message !== null) {
        contents.message = smithy_client_1.expectString(data.message);
    }
    return contents;
};
const deserializeAws_restJson1ResourceNotFoundExceptionResponse = async (parsedOutput, context) => {
    const contents = {
        name: "ResourceNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        message: undefined,
    };
    const data = parsedOutput.body;
    if (data.message !== undefined && data.message !== null) {
        contents.message = smithy_client_1.expectString(data.message);
    }
    return contents;
};
const deserializeAws_restJson1TooManyRequestsExceptionResponse = async (parsedOutput, context) => {
    const contents = {
        name: "TooManyRequestsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        message: undefined,
    };
    const data = parsedOutput.body;
    if (data.message !== undefined && data.message !== null) {
        contents.message = smithy_client_1.expectString(data.message);
    }
    return contents;
};
const deserializeAws_restJson1UnauthorizedExceptionResponse = async (parsedOutput, context) => {
    const contents = {
        name: "UnauthorizedException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        message: undefined,
    };
    const data = parsedOutput.body;
    if (data.message !== undefined && data.message !== null) {
        contents.message = smithy_client_1.expectString(data.message);
    }
    return contents;
};
const deserializeAws_restJson1AccountInfo = (output, context) => {
    return {
        accountId: smithy_client_1.expectString(output.accountId),
        accountName: smithy_client_1.expectString(output.accountName),
        emailAddress: smithy_client_1.expectString(output.emailAddress),
    };
};
const deserializeAws_restJson1AccountListType = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_restJson1AccountInfo(entry, context);
    });
};
const deserializeAws_restJson1RoleCredentials = (output, context) => {
    return {
        accessKeyId: smithy_client_1.expectString(output.accessKeyId),
        expiration: smithy_client_1.expectLong(output.expiration),
        secretAccessKey: smithy_client_1.expectString(output.secretAccessKey),
        sessionToken: smithy_client_1.expectString(output.sessionToken),
    };
};
const deserializeAws_restJson1RoleInfo = (output, context) => {
    return {
        accountId: smithy_client_1.expectString(output.accountId),
        roleName: smithy_client_1.expectString(output.roleName),
    };
};
const deserializeAws_restJson1RoleListType = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_restJson1RoleInfo(entry, context);
    });
};
const deserializeMetadata = (output) => {
    var _a;
    return ({
        httpStatusCode: output.statusCode,
        requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"],
    });
};
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const isSerializableHeaderValue = (value) => value !== undefined &&
    value !== null &&
    value !== "" &&
    (!Object.getOwnPropertyNames(value).includes("length") || value.length != 0) &&
    (!Object.getOwnPropertyNames(value).includes("size") || value.size != 0);
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        return JSON.parse(encoded);
    }
    return {};
});
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data.code !== undefined) {
        return sanitizeErrorCode(data.code);
    }
    if (data["__type"] !== undefined) {
        return sanitizeErrorCode(data["__type"]);
    }
    return "";
};


/***/ }),
/* 341 */,
/* 342 */,
/* 343 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequest = void 0;
class HttpRequest {
    constructor(options) {
        this.method = options.method || "GET";
        this.hostname = options.hostname || "localhost";
        this.port = options.port;
        this.query = options.query || {};
        this.headers = options.headers || {};
        this.body = options.body;
        this.protocol = options.protocol
            ? options.protocol.substr(-1) !== ":"
                ? `${options.protocol}:`
                : options.protocol
            : "https:";
        this.path = options.path ? (options.path.charAt(0) !== "/" ? `/${options.path}` : options.path) : "/";
    }
    static isInstance(request) {
        if (!request)
            return false;
        const req = request;
        return ("method" in req &&
            "protocol" in req &&
            "hostname" in req &&
            "path" in req &&
            typeof req["query"] === "object" &&
            typeof req["headers"] === "object");
    }
    clone() {
        const cloned = new HttpRequest({
            ...this,
            headers: { ...this.headers },
        });
        if (cloned.query)
            cloned.query = cloneQuery(cloned.query);
        return cloned;
    }
}
exports.HttpRequest = HttpRequest;
function cloneQuery(query) {
    return Object.keys(query).reduce((carry, paramName) => {
        const param = query[paramName];
        return {
            ...carry,
            [paramName]: Array.isArray(param) ? [...param] : param,
        };
    }, {});
}


/***/ }),
/* 344 */,
/* 345 */,
/* 346 */,
/* 347 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(407), exports);
tslib_1.__exportStar(__webpack_require__(12), exports);
tslib_1.__exportStar(__webpack_require__(705), exports);


/***/ }),
/* 348 */,
/* 349 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(354), exports);


/***/ }),
/* 350 */,
/* 351 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = void 0;
const memoize = (provider, isExpired, requiresRefresh) => {
    let resolved;
    let pending;
    let hasResult;
    const coalesceProvider = async () => {
        if (!pending) {
            pending = provider();
        }
        try {
            resolved = await pending;
            hasResult = true;
        }
        finally {
            pending = undefined;
        }
        return resolved;
    };
    if (isExpired === undefined) {
        return async () => {
            if (!hasResult) {
                resolved = await coalesceProvider();
            }
            return resolved;
        };
    }
    let isConstant = false;
    return async () => {
        if (!hasResult) {
            resolved = await coalesceProvider();
        }
        if (isConstant) {
            return resolved;
        }
        if (requiresRefresh && !requiresRefresh(resolved)) {
            isConstant = true;
            return resolved;
        }
        if (isExpired(resolved)) {
            await coalesceProvider();
            return resolved;
        }
        return resolved;
    };
};
exports.memoize = memoize;


/***/ }),
/* 352 */,
/* 353 */
/***/ (function(module) {

module.exports = {"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\"","QUOT":"\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"};

/***/ }),
/* 354 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.constructStack = void 0;
const constructStack = () => {
    let absoluteEntries = [];
    let relativeEntries = [];
    const entriesNameSet = new Set();
    const sort = (entries) => entries.sort((a, b) => stepWeights[b.step] - stepWeights[a.step] ||
        priorityWeights[b.priority || "normal"] - priorityWeights[a.priority || "normal"]);
    const removeByName = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
            if (entry.name && entry.name === toRemove) {
                isRemoved = true;
                entriesNameSet.delete(toRemove);
                return false;
            }
            return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
    };
    const removeByReference = (toRemove) => {
        let isRemoved = false;
        const filterCb = (entry) => {
            if (entry.middleware === toRemove) {
                isRemoved = true;
                if (entry.name)
                    entriesNameSet.delete(entry.name);
                return false;
            }
            return true;
        };
        absoluteEntries = absoluteEntries.filter(filterCb);
        relativeEntries = relativeEntries.filter(filterCb);
        return isRemoved;
    };
    const cloneTo = (toStack) => {
        absoluteEntries.forEach((entry) => {
            toStack.add(entry.middleware, { ...entry });
        });
        relativeEntries.forEach((entry) => {
            toStack.addRelativeTo(entry.middleware, { ...entry });
        });
        return toStack;
    };
    const expandRelativeMiddlewareList = (from) => {
        const expandedMiddlewareList = [];
        from.before.forEach((entry) => {
            if (entry.before.length === 0 && entry.after.length === 0) {
                expandedMiddlewareList.push(entry);
            }
            else {
                expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
            }
        });
        expandedMiddlewareList.push(from);
        from.after.reverse().forEach((entry) => {
            if (entry.before.length === 0 && entry.after.length === 0) {
                expandedMiddlewareList.push(entry);
            }
            else {
                expandedMiddlewareList.push(...expandRelativeMiddlewareList(entry));
            }
        });
        return expandedMiddlewareList;
    };
    const getMiddlewareList = () => {
        const normalizedAbsoluteEntries = [];
        const normalizedRelativeEntries = [];
        const normalizedEntriesNameMap = {};
        absoluteEntries.forEach((entry) => {
            const normalizedEntry = {
                ...entry,
                before: [],
                after: [],
            };
            if (normalizedEntry.name)
                normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
            normalizedAbsoluteEntries.push(normalizedEntry);
        });
        relativeEntries.forEach((entry) => {
            const normalizedEntry = {
                ...entry,
                before: [],
                after: [],
            };
            if (normalizedEntry.name)
                normalizedEntriesNameMap[normalizedEntry.name] = normalizedEntry;
            normalizedRelativeEntries.push(normalizedEntry);
        });
        normalizedRelativeEntries.forEach((entry) => {
            if (entry.toMiddleware) {
                const toMiddleware = normalizedEntriesNameMap[entry.toMiddleware];
                if (toMiddleware === undefined) {
                    throw new Error(`${entry.toMiddleware} is not found when adding ${entry.name || "anonymous"} middleware ${entry.relation} ${entry.toMiddleware}`);
                }
                if (entry.relation === "after") {
                    toMiddleware.after.push(entry);
                }
                if (entry.relation === "before") {
                    toMiddleware.before.push(entry);
                }
            }
        });
        const mainChain = sort(normalizedAbsoluteEntries)
            .map(expandRelativeMiddlewareList)
            .reduce((wholeList, expendedMiddlewareList) => {
            wholeList.push(...expendedMiddlewareList);
            return wholeList;
        }, []);
        return mainChain.map((entry) => entry.middleware);
    };
    const stack = {
        add: (middleware, options = {}) => {
            const { name, override } = options;
            const entry = {
                step: "initialize",
                priority: "normal",
                middleware,
                ...options,
            };
            if (name) {
                if (entriesNameSet.has(name)) {
                    if (!override)
                        throw new Error(`Duplicate middleware name '${name}'`);
                    const toOverrideIndex = absoluteEntries.findIndex((entry) => entry.name === name);
                    const toOverride = absoluteEntries[toOverrideIndex];
                    if (toOverride.step !== entry.step || toOverride.priority !== entry.priority) {
                        throw new Error(`"${name}" middleware with ${toOverride.priority} priority in ${toOverride.step} step cannot be ` +
                            `overridden by same-name middleware with ${entry.priority} priority in ${entry.step} step.`);
                    }
                    absoluteEntries.splice(toOverrideIndex, 1);
                }
                entriesNameSet.add(name);
            }
            absoluteEntries.push(entry);
        },
        addRelativeTo: (middleware, options) => {
            const { name, override } = options;
            const entry = {
                middleware,
                ...options,
            };
            if (name) {
                if (entriesNameSet.has(name)) {
                    if (!override)
                        throw new Error(`Duplicate middleware name '${name}'`);
                    const toOverrideIndex = relativeEntries.findIndex((entry) => entry.name === name);
                    const toOverride = relativeEntries[toOverrideIndex];
                    if (toOverride.toMiddleware !== entry.toMiddleware || toOverride.relation !== entry.relation) {
                        throw new Error(`"${name}" middleware ${toOverride.relation} "${toOverride.toMiddleware}" middleware cannot be overridden ` +
                            `by same-name middleware ${entry.relation} "${entry.toMiddleware}" middleware.`);
                    }
                    relativeEntries.splice(toOverrideIndex, 1);
                }
                entriesNameSet.add(name);
            }
            relativeEntries.push(entry);
        },
        clone: () => cloneTo(exports.constructStack()),
        use: (plugin) => {
            plugin.applyToStack(stack);
        },
        remove: (toRemove) => {
            if (typeof toRemove === "string")
                return removeByName(toRemove);
            else
                return removeByReference(toRemove);
        },
        removeByTag: (toRemove) => {
            let isRemoved = false;
            const filterCb = (entry) => {
                const { tags, name } = entry;
                if (tags && tags.includes(toRemove)) {
                    if (name)
                        entriesNameSet.delete(name);
                    isRemoved = true;
                    return false;
                }
                return true;
            };
            absoluteEntries = absoluteEntries.filter(filterCb);
            relativeEntries = relativeEntries.filter(filterCb);
            return isRemoved;
        },
        concat: (from) => {
            const cloned = cloneTo(exports.constructStack());
            cloned.use(from);
            return cloned;
        },
        applyToStack: cloneTo,
        resolve: (handler, context) => {
            for (const middleware of getMiddlewareList().reverse()) {
                handler = middleware(handler, context);
            }
            return handler;
        },
    };
    return stack;
};
exports.constructStack = constructStack;
const stepWeights = {
    initialize: 5,
    serialize: 4,
    build: 3,
    finalizeRequest: 2,
    deserialize: 1,
};
const priorityWeights = {
    high: 3,
    normal: 2,
    low: 1,
};


/***/ }),
/* 355 */,
/* 356 */,
/* 357 */
/***/ (function(module) {

module.exports = require("assert");

/***/ }),
/* 358 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveRetryStrategy = void 0;
const config_1 = __webpack_require__(701);
const DefaultRateLimiter_1 = __webpack_require__(883);
const StandardRetryStrategy_1 = __webpack_require__(51);
class AdaptiveRetryStrategy extends StandardRetryStrategy_1.StandardRetryStrategy {
    constructor(maxAttemptsProvider, options) {
        const { rateLimiter, ...superOptions } = options !== null && options !== void 0 ? options : {};
        super(maxAttemptsProvider, superOptions);
        this.rateLimiter = rateLimiter !== null && rateLimiter !== void 0 ? rateLimiter : new DefaultRateLimiter_1.DefaultRateLimiter();
        this.mode = config_1.RETRY_MODES.ADAPTIVE;
    }
    async retry(next, args) {
        return super.retry(next, args, {
            beforeRequest: async () => {
                return this.rateLimiter.getSendToken();
            },
            afterRequest: (response) => {
                this.rateLimiter.updateClientSendingRate(response);
            },
        });
    }
}
exports.AdaptiveRetryStrategy = AdaptiveRetryStrategy;


/***/ }),
/* 359 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.chain = void 0;
const ProviderError_1 = __webpack_require__(396);
function chain(...providers) {
    return () => {
        let promise = Promise.reject(new ProviderError_1.ProviderError("No providers in chain"));
        for (const provider of providers) {
            promise = promise.catch((err) => {
                if (err === null || err === void 0 ? void 0 : err.tryNextLink) {
                    return provider();
                }
                throw err;
            });
        }
        return promise;
    };
}
exports.chain = chain;


/***/ }),
/* 360 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHomeDir = exports.loadSharedConfigFiles = exports.ENV_CONFIG_PATH = exports.ENV_CREDENTIALS_PATH = void 0;
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
const path_1 = __webpack_require__(622);
exports.ENV_CREDENTIALS_PATH = "AWS_SHARED_CREDENTIALS_FILE";
exports.ENV_CONFIG_PATH = "AWS_CONFIG_FILE";
const swallowError = () => ({});
const loadSharedConfigFiles = (init = {}) => {
    const { filepath = process.env[exports.ENV_CREDENTIALS_PATH] || path_1.join(exports.getHomeDir(), ".aws", "credentials"), configFilepath = process.env[exports.ENV_CONFIG_PATH] || path_1.join(exports.getHomeDir(), ".aws", "config"), } = init;
    return Promise.all([
        slurpFile(configFilepath).then(parseIni).then(normalizeConfigFile).catch(swallowError),
        slurpFile(filepath).then(parseIni).catch(swallowError),
    ]).then((parsedFiles) => {
        const [configFile, credentialsFile] = parsedFiles;
        return {
            configFile,
            credentialsFile,
        };
    });
};
exports.loadSharedConfigFiles = loadSharedConfigFiles;
const profileKeyRegex = /^profile\s(["'])?([^\1]+)\1$/;
const normalizeConfigFile = (data) => {
    const map = {};
    for (const key of Object.keys(data)) {
        let matches;
        if (key === "default") {
            map.default = data.default;
        }
        else if ((matches = profileKeyRegex.exec(key))) {
            const [_1, _2, normalizedKey] = matches;
            if (normalizedKey) {
                map[normalizedKey] = data[key];
            }
        }
    }
    return map;
};
const profileNameBlockList = ["__proto__", "profile __proto__"];
const parseIni = (iniData) => {
    const map = {};
    let currentSection;
    for (let line of iniData.split(/\r?\n/)) {
        line = line.split(/(^|\s)[;#]/)[0];
        const section = line.match(/^\s*\[([^\[\]]+)]\s*$/);
        if (section) {
            currentSection = section[1];
            if (profileNameBlockList.includes(currentSection)) {
                throw new Error(`Found invalid profile name "${currentSection}"`);
            }
        }
        else if (currentSection) {
            const item = line.match(/^\s*(.+?)\s*=\s*(.+?)\s*$/);
            if (item) {
                map[currentSection] = map[currentSection] || {};
                map[currentSection][item[1]] = item[2];
            }
        }
    }
    return map;
};
const slurpFile = (path) => new Promise((resolve, reject) => {
    fs_1.readFile(path, "utf8", (err, data) => {
        if (err) {
            reject(err);
        }
        else {
            resolve(data);
        }
    });
});
const getHomeDir = () => {
    const { HOME, USERPROFILE, HOMEPATH, HOMEDRIVE = `C:${path_1.sep}` } = process.env;
    if (HOME)
        return HOME;
    if (USERPROFILE)
        return USERPROFILE;
    if (HOMEPATH)
        return `${HOMEDRIVE}${HOMEPATH}`;
    return os_1.homedir();
};
exports.getHomeDir = getHomeDir;


/***/ }),
/* 361 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ENDPOINT_MODE_CONFIG_OPTIONS = exports.CONFIG_ENDPOINT_MODE_NAME = exports.ENV_ENDPOINT_MODE_NAME = void 0;
const EndpointMode_1 = __webpack_require__(750);
exports.ENV_ENDPOINT_MODE_NAME = "AWS_EC2_METADATA_SERVICE_ENDPOINT_MODE";
exports.CONFIG_ENDPOINT_MODE_NAME = "ec2_metadata_service_endpoint_mode";
exports.ENDPOINT_MODE_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.ENV_ENDPOINT_MODE_NAME],
    configFileSelector: (profile) => profile[exports.CONFIG_ENDPOINT_MODE_NAME],
    default: EndpointMode_1.EndpointMode.IPv4,
};


/***/ }),
/* 362 */,
/* 363 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(879), exports);
tslib_1.__exportStar(__webpack_require__(790), exports);
tslib_1.__exportStar(__webpack_require__(245), exports);
tslib_1.__exportStar(__webpack_require__(556), exports);


/***/ }),
/* 364 */,
/* 365 */,
/* 366 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRealRegion = void 0;
const isFipsRegion_1 = __webpack_require__(960);
const getRealRegion = (region) => isFipsRegion_1.isFipsRegion(region)
    ? ["fips-aws-global", "aws-fips"].includes(region)
        ? "us-east-1"
        : region.replace(/fips-(dkr-|prod-)?|-fips/, "")
    : region;
exports.getRealRegion = getRealRegion;


/***/ }),
/* 367 */,
/* 368 */,
/* 369 */,
/* 370 */
/***/ (function(module) {

module.exports = {"amp":"&","apos":"'","gt":">","lt":"<","quot":"\""};

/***/ }),
/* 371 */,
/* 372 */,
/* 373 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUEST_HEADER = exports.INVOCATION_ID_HEADER = exports.NO_RETRY_INCREMENT = exports.TIMEOUT_RETRY_COST = exports.RETRY_COST = exports.INITIAL_RETRY_TOKENS = exports.THROTTLING_RETRY_DELAY_BASE = exports.MAXIMUM_RETRY_DELAY = exports.DEFAULT_RETRY_DELAY_BASE = void 0;
exports.DEFAULT_RETRY_DELAY_BASE = 100;
exports.MAXIMUM_RETRY_DELAY = 20 * 1000;
exports.THROTTLING_RETRY_DELAY_BASE = 500;
exports.INITIAL_RETRY_TOKENS = 500;
exports.RETRY_COST = 5;
exports.TIMEOUT_RETRY_COST = 10;
exports.NO_RETRY_INCREMENT = 1;
exports.INVOCATION_ID_HEADER = "amz-sdk-invocation-id";
exports.REQUEST_HEADER = "amz-sdk-request";


/***/ }),
/* 374 */,
/* 375 */,
/* 376 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRegionConfig = void 0;
const getRealRegion_1 = __webpack_require__(366);
const isFipsRegion_1 = __webpack_require__(960);
const resolveRegionConfig = (input) => {
    const { region, useFipsEndpoint } = input;
    if (!region) {
        throw new Error("Region is missing");
    }
    return {
        ...input,
        region: async () => {
            if (typeof region === "string") {
                return getRealRegion_1.getRealRegion(region);
            }
            const providedRegion = await region();
            return getRealRegion_1.getRealRegion(providedRegion);
        },
        useFipsEndpoint: async () => {
            const providedRegion = typeof region === "string" ? region : await region();
            if (isFipsRegion_1.isFipsRegion(providedRegion)) {
                return true;
            }
            return typeof useFipsEndpoint === "boolean" ? Promise.resolve(useFipsEndpoint) : useFipsEndpoint();
        },
    };
};
exports.resolveRegionConfig = resolveRegionConfig;


/***/ }),
/* 377 */,
/* 378 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AssumeRoleCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const middleware_signing_1 = __webpack_require__(307);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class AssumeRoleCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.AssumeRoleRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.AssumeRoleResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryAssumeRoleCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryAssumeRoleCommand(output, context);
    }
}
exports.AssumeRoleCommand = AssumeRoleCommand;


/***/ }),
/* 379 */,
/* 380 */,
/* 381 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getCanonicalQuery = void 0;
const util_uri_escape_1 = __webpack_require__(392);
const constants_1 = __webpack_require__(84);
const getCanonicalQuery = ({ query = {} }) => {
    const keys = [];
    const serialized = {};
    for (const key of Object.keys(query).sort()) {
        if (key.toLowerCase() === constants_1.SIGNATURE_HEADER) {
            continue;
        }
        keys.push(key);
        const value = query[key];
        if (typeof value === "string") {
            serialized[key] = `${util_uri_escape_1.escapeUri(key)}=${util_uri_escape_1.escapeUri(value)}`;
        }
        else if (Array.isArray(value)) {
            serialized[key] = value
                .slice(0)
                .sort()
                .reduce((encoded, value) => encoded.concat([`${util_uri_escape_1.escapeUri(key)}=${util_uri_escape_1.escapeUri(value)}`]), [])
                .join("&");
        }
    }
    return keys
        .map((key) => serialized[key])
        .filter((serialized) => serialized)
        .join("&");
};
exports.getCanonicalQuery = getCanonicalQuery;


/***/ }),
/* 382 */,
/* 383 */,
/* 384 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _v = _interopRequireDefault(__webpack_require__(212));

var _sha = _interopRequireDefault(__webpack_require__(737));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports.default = _default;

/***/ }),
/* 385 */,
/* 386 */,
/* 387 */,
/* 388 */,
/* 389 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromSharedConfigFiles = exports.ENV_PROFILE = void 0;
const property_provider_1 = __webpack_require__(948);
const shared_ini_file_loader_1 = __webpack_require__(360);
const DEFAULT_PROFILE = "default";
exports.ENV_PROFILE = "AWS_PROFILE";
const fromSharedConfigFiles = (configSelector, { preferredFile = "config", ...init } = {}) => async () => {
    const { loadedConfig = shared_ini_file_loader_1.loadSharedConfigFiles(init), profile = process.env[exports.ENV_PROFILE] || DEFAULT_PROFILE } = init;
    const { configFile, credentialsFile } = await loadedConfig;
    const profileFromCredentials = credentialsFile[profile] || {};
    const profileFromConfig = configFile[profile] || {};
    const mergedProfile = preferredFile === "config"
        ? { ...profileFromCredentials, ...profileFromConfig }
        : { ...profileFromConfig, ...profileFromCredentials };
    try {
        const configValue = configSelector(mergedProfile);
        if (configValue === undefined) {
            throw new Error();
        }
        return configValue;
    }
    catch (e) {
        throw new property_provider_1.CredentialsProviderError(e.message ||
            `Cannot load config for profile ${profile} in SDK configuration files with getter: ${configSelector}`);
    }
};
exports.fromSharedConfigFiles = fromSharedConfigFiles;


/***/ }),
/* 390 */,
/* 391 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.parseQueryString = void 0;
function parseQueryString(querystring) {
    const query = {};
    querystring = querystring.replace(/^\?/, "");
    if (querystring) {
        for (const pair of querystring.split("&")) {
            let [key, value = null] = pair.split("=");
            key = decodeURIComponent(key);
            if (value) {
                value = decodeURIComponent(value);
            }
            if (!(key in query)) {
                query[key] = value;
            }
            else if (Array.isArray(query[key])) {
                query[key].push(value);
            }
            else {
                query[key] = [query[key], value];
            }
        }
    }
    return query;
}
exports.parseQueryString = parseQueryString;


/***/ }),
/* 392 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(255), exports);
tslib_1.__exportStar(__webpack_require__(506), exports);


/***/ }),
/* 393 */,
/* 394 */,
/* 395 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLifecyclePolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DeleteLifecyclePolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DeleteLifecyclePolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DeleteLifecyclePolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DeleteLifecyclePolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DeleteLifecyclePolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DeleteLifecyclePolicyCommand(output, context);
    }
}
exports.DeleteLifecyclePolicyCommand = DeleteLifecyclePolicyCommand;


/***/ }),
/* 396 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsProviderError = exports.ProviderError = void 0;
class ProviderError extends Error {
    constructor(message, tryNextLink = true) {
        super(message);
        this.tryNextLink = tryNextLink;
    }
    static from(error, tryNextLink = true) {
        Object.defineProperty(error, "tryNextLink", {
            value: tryNextLink,
            configurable: false,
            enumerable: false,
            writable: false,
        });
        return error;
    }
}
exports.ProviderError = ProviderError;
class CredentialsProviderError extends Error {
    constructor(message, tryNextLink = true) {
        super(message);
        this.tryNextLink = tryNextLink;
        this.name = "CredentialsProviderError";
    }
    static from(error, tryNextLink = true) {
        Object.defineProperty(error, "tryNextLink", {
            value: tryNextLink,
            configurable: false,
            enumerable: false,
            writable: false,
        });
        return error;
    }
}
exports.CredentialsProviderError = CredentialsProviderError;


/***/ }),
/* 397 */,
/* 398 */,
/* 399 */,
/* 400 */,
/* 401 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.StartImageScanCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class StartImageScanCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "StartImageScanCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.StartImageScanRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.StartImageScanResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1StartImageScanCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1StartImageScanCommand(output, context);
    }
}
exports.StartImageScanCommand = StartImageScanCommand;


/***/ }),
/* 402 */,
/* 403 */,
/* 404 */,
/* 405 */,
/* 406 */,
/* 407 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializerMiddleware = void 0;
const deserializerMiddleware = (options, deserializer) => (next, context) => async (args) => {
    const { response } = await next(args);
    const parsed = await deserializer(response, options);
    return {
        response,
        output: parsed,
    };
};
exports.deserializerMiddleware = deserializerMiddleware;


/***/ }),
/* 408 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromWebToken = void 0;
const property_provider_1 = __webpack_require__(948);
const fromWebToken = (init) => () => {
    const { roleArn, roleSessionName, webIdentityToken, providerId, policyArns, policy, durationSeconds, roleAssumerWithWebIdentity, } = init;
    if (!roleAssumerWithWebIdentity) {
        throw new property_provider_1.CredentialsProviderError(`Role Arn '${roleArn}' needs to be assumed with web identity,` +
            ` but no role assumption callback was provided.`, false);
    }
    return roleAssumerWithWebIdentity({
        RoleArn: roleArn,
        RoleSessionName: roleSessionName !== null && roleSessionName !== void 0 ? roleSessionName : `aws-sdk-js-session-${Date.now()}`,
        WebIdentityToken: webIdentityToken,
        ProviderId: providerId,
        PolicyArns: policyArns,
        Policy: policy,
        DurationSeconds: durationSeconds,
    });
};
exports.fromWebToken = fromWebToken;


/***/ }),
/* 409 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStatic = void 0;
const fromStatic = (staticValue) => () => Promise.resolve(staticValue);
exports.fromStatic = fromStatic;


/***/ }),
/* 410 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ECR = void 0;
const BatchCheckLayerAvailabilityCommand_1 = __webpack_require__(896);
const BatchDeleteImageCommand_1 = __webpack_require__(61);
const BatchGetImageCommand_1 = __webpack_require__(563);
const CompleteLayerUploadCommand_1 = __webpack_require__(914);
const CreateRepositoryCommand_1 = __webpack_require__(44);
const DeleteLifecyclePolicyCommand_1 = __webpack_require__(395);
const DeleteRegistryPolicyCommand_1 = __webpack_require__(317);
const DeleteRepositoryCommand_1 = __webpack_require__(778);
const DeleteRepositoryPolicyCommand_1 = __webpack_require__(229);
const DescribeImageReplicationStatusCommand_1 = __webpack_require__(296);
const DescribeImageScanFindingsCommand_1 = __webpack_require__(981);
const DescribeImagesCommand_1 = __webpack_require__(174);
const DescribeRegistryCommand_1 = __webpack_require__(446);
const DescribeRepositoriesCommand_1 = __webpack_require__(287);
const GetAuthorizationTokenCommand_1 = __webpack_require__(712);
const GetDownloadUrlForLayerCommand_1 = __webpack_require__(658);
const GetLifecyclePolicyCommand_1 = __webpack_require__(962);
const GetLifecyclePolicyPreviewCommand_1 = __webpack_require__(25);
const GetRegistryPolicyCommand_1 = __webpack_require__(864);
const GetRepositoryPolicyCommand_1 = __webpack_require__(774);
const InitiateLayerUploadCommand_1 = __webpack_require__(79);
const ListImagesCommand_1 = __webpack_require__(652);
const ListTagsForResourceCommand_1 = __webpack_require__(674);
const PutImageCommand_1 = __webpack_require__(434);
const PutImageScanningConfigurationCommand_1 = __webpack_require__(825);
const PutImageTagMutabilityCommand_1 = __webpack_require__(511);
const PutLifecyclePolicyCommand_1 = __webpack_require__(179);
const PutRegistryPolicyCommand_1 = __webpack_require__(98);
const PutReplicationConfigurationCommand_1 = __webpack_require__(802);
const SetRepositoryPolicyCommand_1 = __webpack_require__(50);
const StartImageScanCommand_1 = __webpack_require__(401);
const StartLifecyclePolicyPreviewCommand_1 = __webpack_require__(991);
const TagResourceCommand_1 = __webpack_require__(561);
const UntagResourceCommand_1 = __webpack_require__(639);
const UploadLayerPartCommand_1 = __webpack_require__(654);
const ECRClient_1 = __webpack_require__(429);
class ECR extends ECRClient_1.ECRClient {
    batchCheckLayerAvailability(args, optionsOrCb, cb) {
        const command = new BatchCheckLayerAvailabilityCommand_1.BatchCheckLayerAvailabilityCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    batchDeleteImage(args, optionsOrCb, cb) {
        const command = new BatchDeleteImageCommand_1.BatchDeleteImageCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    batchGetImage(args, optionsOrCb, cb) {
        const command = new BatchGetImageCommand_1.BatchGetImageCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    completeLayerUpload(args, optionsOrCb, cb) {
        const command = new CompleteLayerUploadCommand_1.CompleteLayerUploadCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    createRepository(args, optionsOrCb, cb) {
        const command = new CreateRepositoryCommand_1.CreateRepositoryCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteLifecyclePolicy(args, optionsOrCb, cb) {
        const command = new DeleteLifecyclePolicyCommand_1.DeleteLifecyclePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteRegistryPolicy(args, optionsOrCb, cb) {
        const command = new DeleteRegistryPolicyCommand_1.DeleteRegistryPolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteRepository(args, optionsOrCb, cb) {
        const command = new DeleteRepositoryCommand_1.DeleteRepositoryCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    deleteRepositoryPolicy(args, optionsOrCb, cb) {
        const command = new DeleteRepositoryPolicyCommand_1.DeleteRepositoryPolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeImageReplicationStatus(args, optionsOrCb, cb) {
        const command = new DescribeImageReplicationStatusCommand_1.DescribeImageReplicationStatusCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeImages(args, optionsOrCb, cb) {
        const command = new DescribeImagesCommand_1.DescribeImagesCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeImageScanFindings(args, optionsOrCb, cb) {
        const command = new DescribeImageScanFindingsCommand_1.DescribeImageScanFindingsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeRegistry(args, optionsOrCb, cb) {
        const command = new DescribeRegistryCommand_1.DescribeRegistryCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    describeRepositories(args, optionsOrCb, cb) {
        const command = new DescribeRepositoriesCommand_1.DescribeRepositoriesCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getAuthorizationToken(args, optionsOrCb, cb) {
        const command = new GetAuthorizationTokenCommand_1.GetAuthorizationTokenCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getDownloadUrlForLayer(args, optionsOrCb, cb) {
        const command = new GetDownloadUrlForLayerCommand_1.GetDownloadUrlForLayerCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getLifecyclePolicy(args, optionsOrCb, cb) {
        const command = new GetLifecyclePolicyCommand_1.GetLifecyclePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getLifecyclePolicyPreview(args, optionsOrCb, cb) {
        const command = new GetLifecyclePolicyPreviewCommand_1.GetLifecyclePolicyPreviewCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getRegistryPolicy(args, optionsOrCb, cb) {
        const command = new GetRegistryPolicyCommand_1.GetRegistryPolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getRepositoryPolicy(args, optionsOrCb, cb) {
        const command = new GetRepositoryPolicyCommand_1.GetRepositoryPolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    initiateLayerUpload(args, optionsOrCb, cb) {
        const command = new InitiateLayerUploadCommand_1.InitiateLayerUploadCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listImages(args, optionsOrCb, cb) {
        const command = new ListImagesCommand_1.ListImagesCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listTagsForResource(args, optionsOrCb, cb) {
        const command = new ListTagsForResourceCommand_1.ListTagsForResourceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    putImage(args, optionsOrCb, cb) {
        const command = new PutImageCommand_1.PutImageCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    putImageScanningConfiguration(args, optionsOrCb, cb) {
        const command = new PutImageScanningConfigurationCommand_1.PutImageScanningConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    putImageTagMutability(args, optionsOrCb, cb) {
        const command = new PutImageTagMutabilityCommand_1.PutImageTagMutabilityCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    putLifecyclePolicy(args, optionsOrCb, cb) {
        const command = new PutLifecyclePolicyCommand_1.PutLifecyclePolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    putRegistryPolicy(args, optionsOrCb, cb) {
        const command = new PutRegistryPolicyCommand_1.PutRegistryPolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    putReplicationConfiguration(args, optionsOrCb, cb) {
        const command = new PutReplicationConfigurationCommand_1.PutReplicationConfigurationCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    setRepositoryPolicy(args, optionsOrCb, cb) {
        const command = new SetRepositoryPolicyCommand_1.SetRepositoryPolicyCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    startImageScan(args, optionsOrCb, cb) {
        const command = new StartImageScanCommand_1.StartImageScanCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    startLifecyclePolicyPreview(args, optionsOrCb, cb) {
        const command = new StartLifecyclePolicyPreviewCommand_1.StartLifecyclePolicyPreviewCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    tagResource(args, optionsOrCb, cb) {
        const command = new TagResourceCommand_1.TagResourceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    untagResource(args, optionsOrCb, cb) {
        const command = new UntagResourceCommand_1.UntagResourceCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    uploadLayerPart(args, optionsOrCb, cb) {
        const command = new UploadLayerPartCommand_1.UploadLayerPartCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.ECR = ECR;


/***/ }),
/* 411 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(__webpack_require__(78));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports.default = _default;

/***/ }),
/* 412 */,
/* 413 */
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(141);


/***/ }),
/* 414 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRegionProvider = exports.normalizeCredentialsProvider = exports.prepareRequest = exports.moveHeadersToQuery = exports.getPayloadHash = exports.getCanonicalQuery = exports.getCanonicalHeaders = void 0;
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(464), exports);
var getCanonicalHeaders_1 = __webpack_require__(265);
Object.defineProperty(exports, "getCanonicalHeaders", { enumerable: true, get: function () { return getCanonicalHeaders_1.getCanonicalHeaders; } });
var getCanonicalQuery_1 = __webpack_require__(381);
Object.defineProperty(exports, "getCanonicalQuery", { enumerable: true, get: function () { return getCanonicalQuery_1.getCanonicalQuery; } });
var getPayloadHash_1 = __webpack_require__(150);
Object.defineProperty(exports, "getPayloadHash", { enumerable: true, get: function () { return getPayloadHash_1.getPayloadHash; } });
var moveHeadersToQuery_1 = __webpack_require__(624);
Object.defineProperty(exports, "moveHeadersToQuery", { enumerable: true, get: function () { return moveHeadersToQuery_1.moveHeadersToQuery; } });
var prepareRequest_1 = __webpack_require__(193);
Object.defineProperty(exports, "prepareRequest", { enumerable: true, get: function () { return prepareRequest_1.prepareRequest; } });
var normalizeProvider_1 = __webpack_require__(315);
Object.defineProperty(exports, "normalizeCredentialsProvider", { enumerable: true, get: function () { return normalizeProvider_1.normalizeCredentialsProvider; } });
Object.defineProperty(exports, "normalizeRegionProvider", { enumerable: true, get: function () { return normalizeProvider_1.normalizeRegionProvider; } });
tslib_1.__exportStar(__webpack_require__(698), exports);


/***/ }),
/* 415 */,
/* 416 */,
/* 417 */
/***/ (function(module) {

module.exports = require("crypto");

/***/ }),
/* 418 */,
/* 419 */,
/* 420 */,
/* 421 */,
/* 422 */
/***/ (function(module) {

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, System, Reflect, Promise */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
});


/***/ }),
/* 423 */,
/* 424 */,
/* 425 */,
/* 426 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.writeRequestBody = void 0;
const stream_1 = __webpack_require__(794);
function writeRequestBody(httpRequest, request) {
    const expect = request.headers["Expect"] || request.headers["expect"];
    if (expect === "100-continue") {
        httpRequest.on("continue", () => {
            writeBody(httpRequest, request.body);
        });
    }
    else {
        writeBody(httpRequest, request.body);
    }
}
exports.writeRequestBody = writeRequestBody;
function writeBody(httpRequest, body) {
    if (body instanceof stream_1.Readable) {
        body.pipe(httpRequest);
    }
    else if (body) {
        httpRequest.end(Buffer.from(body));
    }
    else {
        httpRequest.end();
    }
}


/***/ }),
/* 427 */,
/* 428 */,
/* 429 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ECRClient = void 0;
const config_resolver_1 = __webpack_require__(529);
const middleware_content_length_1 = __webpack_require__(988);
const middleware_host_header_1 = __webpack_require__(795);
const middleware_logger_1 = __webpack_require__(263);
const middleware_retry_1 = __webpack_require__(286);
const middleware_signing_1 = __webpack_require__(307);
const middleware_user_agent_1 = __webpack_require__(105);
const smithy_client_1 = __webpack_require__(973);
const runtimeConfig_1 = __webpack_require__(677);
class ECRClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = runtimeConfig_1.getRuntimeConfig(configuration);
        const _config_1 = config_resolver_1.resolveRegionConfig(_config_0);
        const _config_2 = config_resolver_1.resolveEndpointsConfig(_config_1);
        const _config_3 = middleware_retry_1.resolveRetryConfig(_config_2);
        const _config_4 = middleware_host_header_1.resolveHostHeaderConfig(_config_3);
        const _config_5 = middleware_signing_1.resolveAwsAuthConfig(_config_4);
        const _config_6 = middleware_user_agent_1.resolveUserAgentConfig(_config_5);
        super(_config_6);
        this.config = _config_6;
        this.middlewareStack.use(middleware_retry_1.getRetryPlugin(this.config));
        this.middlewareStack.use(middleware_content_length_1.getContentLengthPlugin(this.config));
        this.middlewareStack.use(middleware_host_header_1.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(middleware_logger_1.getLoggerPlugin(this.config));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(this.config));
        this.middlewareStack.use(middleware_user_agent_1.getUserAgentPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.ECRClient = ECRClient;


/***/ }),
/* 430 */,
/* 431 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),
/* 432 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(920), exports);
tslib_1.__exportStar(__webpack_require__(466), exports);


/***/ }),
/* 433 */,
/* 434 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PutImageCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class PutImageCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "PutImageCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.PutImageRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.PutImageResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1PutImageCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1PutImageCommand(output, context);
    }
}
exports.PutImageCommand = PutImageCommand;


/***/ }),
/* 435 */,
/* 436 */,
/* 437 */,
/* 438 */,
/* 439 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAccessKeyInfoCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const middleware_signing_1 = __webpack_require__(307);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class GetAccessKeyInfoCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetAccessKeyInfoCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetAccessKeyInfoRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetAccessKeyInfoResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryGetAccessKeyInfoCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryGetAccessKeyInfoCommand(output, context);
    }
}
exports.GetAccessKeyInfoCommand = GetAccessKeyInfoCommand;


/***/ }),
/* 440 */,
/* 441 */,
/* 442 */,
/* 443 */,
/* 444 */,
/* 445 */,
/* 446 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DescribeRegistryCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DescribeRegistryCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DescribeRegistryCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DescribeRegistryRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DescribeRegistryResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DescribeRegistryCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DescribeRegistryCommand(output, context);
    }
}
exports.DescribeRegistryCommand = DescribeRegistryCommand;


/***/ }),
/* 447 */,
/* 448 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromStatic = void 0;
const property_provider_1 = __webpack_require__(948);
const isFunction = (func) => typeof func === "function";
const fromStatic = (defaultValue) => isFunction(defaultValue) ? async () => defaultValue() : property_provider_1.fromStatic(defaultValue);
exports.fromStatic = fromStatic;


/***/ }),
/* 449 */,
/* 450 */,
/* 451 */,
/* 452 */,
/* 453 */,
/* 454 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isCrtAvailable = void 0;
const isCrtAvailable = () => {
    try {
        if ( true && __webpack_require__(757)) {
            return ["md/crt-avail"];
        }
        return null;
    }
    catch (e) {
        return null;
    }
};
exports.isCrtAvailable = isCrtAvailable;


/***/ }),
/* 455 */,
/* 456 */
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports.default = _default;

/***/ }),
/* 457 */,
/* 458 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransformedHeaders = void 0;
const getTransformedHeaders = (headers) => {
    const transformedHeaders = {};
    for (const name of Object.keys(headers)) {
        const headerValues = headers[name];
        transformedHeaders[name] = Array.isArray(headerValues) ? headerValues.join(",") : headerValues;
    }
    return transformedHeaders;
};
exports.getTransformedHeaders = getTransformedHeaders;


/***/ }),
/* 459 */,
/* 460 */,
/* 461 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.splitEvery = void 0;
function splitEvery(value, delimiter, numDelimiters) {
    if (numDelimiters <= 0 || !Number.isInteger(numDelimiters)) {
        throw new Error("Invalid number of delimiters (" + numDelimiters + ") for splitEvery.");
    }
    const segments = value.split(delimiter);
    if (numDelimiters === 1) {
        return segments;
    }
    const compoundSegments = [];
    let currentSegment = "";
    for (let i = 0; i < segments.length; i++) {
        if (currentSegment === "") {
            currentSegment = segments[i];
        }
        else {
            currentSegment += delimiter + segments[i];
        }
        if ((i + 1) % numDelimiters === 0) {
            compoundSegments.push(currentSegment);
            currentSegment = "";
        }
    }
    if (currentSegment !== "") {
        compoundSegments.push(currentSegment);
    }
    return compoundSegments;
}
exports.splitEvery = splitEvery;


/***/ }),
/* 462 */,
/* 463 */,
/* 464 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureV4 = void 0;
const util_hex_encoding_1 = __webpack_require__(754);
const constants_1 = __webpack_require__(84);
const credentialDerivation_1 = __webpack_require__(698);
const getCanonicalHeaders_1 = __webpack_require__(265);
const getCanonicalQuery_1 = __webpack_require__(381);
const getPayloadHash_1 = __webpack_require__(150);
const headerUtil_1 = __webpack_require__(987);
const moveHeadersToQuery_1 = __webpack_require__(624);
const normalizeProvider_1 = __webpack_require__(315);
const prepareRequest_1 = __webpack_require__(193);
const utilDate_1 = __webpack_require__(67);
class SignatureV4 {
    constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true, }) {
        this.service = service;
        this.sha256 = sha256;
        this.uriEscapePath = uriEscapePath;
        this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
        this.regionProvider = normalizeProvider_1.normalizeRegionProvider(region);
        this.credentialProvider = normalizeProvider_1.normalizeCredentialsProvider(credentials);
    }
    async presign(originalRequest, options = {}) {
        const { signingDate = new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService, } = options;
        const credentials = await this.credentialProvider();
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const { longDate, shortDate } = formatDate(signingDate);
        if (expiresIn > constants_1.MAX_PRESIGNED_TTL) {
            return Promise.reject("Signature version 4 presigned URLs" + " must have an expiration date less than one week in" + " the future");
        }
        const scope = credentialDerivation_1.createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const request = moveHeadersToQuery_1.moveHeadersToQuery(prepareRequest_1.prepareRequest(originalRequest), { unhoistableHeaders });
        if (credentials.sessionToken) {
            request.query[constants_1.TOKEN_QUERY_PARAM] = credentials.sessionToken;
        }
        request.query[constants_1.ALGORITHM_QUERY_PARAM] = constants_1.ALGORITHM_IDENTIFIER;
        request.query[constants_1.CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
        request.query[constants_1.AMZ_DATE_QUERY_PARAM] = longDate;
        request.query[constants_1.EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
        const canonicalHeaders = getCanonicalHeaders_1.getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
        request.query[constants_1.SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
        request.query[constants_1.SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await getPayloadHash_1.getPayloadHash(originalRequest, this.sha256)));
        return request;
    }
    async sign(toSign, options) {
        if (typeof toSign === "string") {
            return this.signString(toSign, options);
        }
        else if (toSign.headers && toSign.payload) {
            return this.signEvent(toSign, options);
        }
        else {
            return this.signRequest(toSign, options);
        }
    }
    async signEvent({ headers, payload }, { signingDate = new Date(), priorSignature, signingRegion, signingService }) {
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const { shortDate, longDate } = formatDate(signingDate);
        const scope = credentialDerivation_1.createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const hashedPayload = await getPayloadHash_1.getPayloadHash({ headers: {}, body: payload }, this.sha256);
        const hash = new this.sha256();
        hash.update(headers);
        const hashedHeaders = util_hex_encoding_1.toHex(await hash.digest());
        const stringToSign = [
            constants_1.EVENT_ALGORITHM_IDENTIFIER,
            longDate,
            scope,
            priorSignature,
            hashedHeaders,
            hashedPayload,
        ].join("\n");
        return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
    }
    async signString(stringToSign, { signingDate = new Date(), signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const { shortDate } = formatDate(signingDate);
        const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
        hash.update(stringToSign);
        return util_hex_encoding_1.toHex(await hash.digest());
    }
    async signRequest(requestToSign, { signingDate = new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService, } = {}) {
        const credentials = await this.credentialProvider();
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : (await this.regionProvider());
        const request = prepareRequest_1.prepareRequest(requestToSign);
        const { longDate, shortDate } = formatDate(signingDate);
        const scope = credentialDerivation_1.createScope(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        request.headers[constants_1.AMZ_DATE_HEADER] = longDate;
        if (credentials.sessionToken) {
            request.headers[constants_1.TOKEN_HEADER] = credentials.sessionToken;
        }
        const payloadHash = await getPayloadHash_1.getPayloadHash(request, this.sha256);
        if (!headerUtil_1.hasHeader(constants_1.SHA256_HEADER, request.headers) && this.applyChecksum) {
            request.headers[constants_1.SHA256_HEADER] = payloadHash;
        }
        const canonicalHeaders = getCanonicalHeaders_1.getCanonicalHeaders(request, unsignableHeaders, signableHeaders);
        const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
        request.headers[constants_1.AUTH_HEADER] =
            `${constants_1.ALGORITHM_IDENTIFIER} ` +
                `Credential=${credentials.accessKeyId}/${scope}, ` +
                `SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, ` +
                `Signature=${signature}`;
        return request;
    }
    createCanonicalRequest(request, canonicalHeaders, payloadHash) {
        const sortedHeaders = Object.keys(canonicalHeaders).sort();
        return `${request.method}
${this.getCanonicalPath(request)}
${getCanonicalQuery_1.getCanonicalQuery(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
    }
    async createStringToSign(longDate, credentialScope, canonicalRequest) {
        const hash = new this.sha256();
        hash.update(canonicalRequest);
        const hashedRequest = await hash.digest();
        return `${constants_1.ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${util_hex_encoding_1.toHex(hashedRequest)}`;
    }
    getCanonicalPath({ path }) {
        if (this.uriEscapePath) {
            const doubleEncoded = encodeURIComponent(path.replace(/^\//, ""));
            return `/${doubleEncoded.replace(/%2F/g, "/")}`;
        }
        return path;
    }
    async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
        const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
        const hash = new this.sha256(await keyPromise);
        hash.update(stringToSign);
        return util_hex_encoding_1.toHex(await hash.digest());
    }
    getSigningKey(credentials, region, shortDate, service) {
        return credentialDerivation_1.getSigningKey(this.sha256, credentials, shortDate, region, service || this.service);
    }
}
exports.SignatureV4 = SignatureV4;
const formatDate = (now) => {
    const longDate = utilDate_1.iso8601(now).replace(/[\-:]/g, "");
    return {
        longDate,
        shortDate: longDate.substr(0, 8),
    };
};
const getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");


/***/ }),
/* 465 */,
/* 466 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntilLifecyclePolicyPreviewComplete = exports.waitForLifecyclePolicyPreviewComplete = void 0;
const util_waiter_1 = __webpack_require__(513);
const GetLifecyclePolicyPreviewCommand_1 = __webpack_require__(25);
const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new GetLifecyclePolicyPreviewCommand_1.GetLifecyclePolicyPreviewCommand(input));
        reason = result;
        try {
            const returnComparator = () => {
                return result.status;
            };
            if (returnComparator() === "COMPLETE") {
                return { state: util_waiter_1.WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                return result.status;
            };
            if (returnComparator() === "FAILED") {
                return { state: util_waiter_1.WaiterState.FAILURE, reason };
            }
        }
        catch (e) { }
    }
    catch (exception) {
        reason = exception;
    }
    return { state: util_waiter_1.WaiterState.RETRY, reason };
};
const waitForLifecyclePolicyPreviewComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 5, maxDelay: 120 };
    return util_waiter_1.createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
exports.waitForLifecyclePolicyPreviewComplete = waitForLifecyclePolicyPreviewComplete;
const waitUntilLifecyclePolicyPreviewComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 5, maxDelay: 120 };
    const result = await util_waiter_1.createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return util_waiter_1.checkExceptions(result);
};
exports.waitUntilLifecyclePolicyPreviewComplete = waitUntilLifecyclePolicyPreviewComplete;


/***/ }),
/* 467 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Endpoint = void 0;
var Endpoint;
(function (Endpoint) {
    Endpoint["IPv4"] = "http://169.254.169.254";
    Endpoint["IPv6"] = "http://[fd00:ec2::254]";
})(Endpoint = exports.Endpoint || (exports.Endpoint = {}));


/***/ }),
/* 468 */,
/* 469 */,
/* 470 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __webpack_require__(431);
const file_command_1 = __webpack_require__(102);
const utils_1 = __webpack_require__(82);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
const oidc_utils_1 = __webpack_require__(742);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    return inputs;
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
//# sourceMappingURL=core.js.map

/***/ }),
/* 471 */,
/* 472 */,
/* 473 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEndpointsConfig = void 0;
const getEndpointFromRegion_1 = __webpack_require__(294);
const normalizeBoolean_1 = __webpack_require__(927);
const normalizeEndpoint_1 = __webpack_require__(541);
const resolveEndpointsConfig = (input) => {
    var _a;
    const useDualstackEndpoint = normalizeBoolean_1.normalizeBoolean(input.useDualstackEndpoint);
    const { endpoint, useFipsEndpoint } = input;
    return {
        ...input,
        tls: (_a = input.tls) !== null && _a !== void 0 ? _a : true,
        endpoint: endpoint
            ? normalizeEndpoint_1.normalizeEndpoint({ ...input, endpoint })
            : () => getEndpointFromRegion_1.getEndpointFromRegion({ ...input, useDualstackEndpoint, useFipsEndpoint }),
        isCustomEndpoint: endpoint ? true : false,
        useDualstackEndpoint,
    };
};
exports.resolveEndpointsConfig = resolveEndpointsConfig;


/***/ }),
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */,
/* 480 */,
/* 481 */,
/* 482 */,
/* 483 */,
/* 484 */,
/* 485 */,
/* 486 */,
/* 487 */,
/* 488 */,
/* 489 */,
/* 490 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeHttpHandler = void 0;
const protocol_http_1 = __webpack_require__(504);
const querystring_builder_1 = __webpack_require__(979);
const http_1 = __webpack_require__(605);
const https_1 = __webpack_require__(211);
const constants_1 = __webpack_require__(702);
const get_transformed_headers_1 = __webpack_require__(458);
const set_connection_timeout_1 = __webpack_require__(204);
const set_socket_timeout_1 = __webpack_require__(233);
const write_request_body_1 = __webpack_require__(426);
class NodeHttpHandler {
    constructor({ connectionTimeout, socketTimeout, httpAgent, httpsAgent } = {}) {
        this.metadata = { handlerProtocol: "http/1.1" };
        this.connectionTimeout = connectionTimeout;
        this.socketTimeout = socketTimeout;
        const keepAlive = true;
        const maxSockets = 50;
        this.httpAgent = httpAgent || new http_1.Agent({ keepAlive, maxSockets });
        this.httpsAgent = httpsAgent || new https_1.Agent({ keepAlive, maxSockets });
    }
    destroy() {
        this.httpAgent.destroy();
        this.httpsAgent.destroy();
    }
    handle(request, { abortSignal } = {}) {
        return new Promise((resolve, reject) => {
            if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
                const abortError = new Error("Request aborted");
                abortError.name = "AbortError";
                reject(abortError);
                return;
            }
            const isSSL = request.protocol === "https:";
            const queryString = querystring_builder_1.buildQueryString(request.query || {});
            const nodeHttpsOptions = {
                headers: request.headers,
                host: request.hostname,
                method: request.method,
                path: queryString ? `${request.path}?${queryString}` : request.path,
                port: request.port,
                agent: isSSL ? this.httpsAgent : this.httpAgent,
            };
            const requestFunc = isSSL ? https_1.request : http_1.request;
            const req = requestFunc(nodeHttpsOptions, (res) => {
                const httpResponse = new protocol_http_1.HttpResponse({
                    statusCode: res.statusCode || -1,
                    headers: get_transformed_headers_1.getTransformedHeaders(res.headers),
                    body: res,
                });
                resolve({ response: httpResponse });
            });
            req.on("error", (err) => {
                if (constants_1.NODEJS_TIMEOUT_ERROR_CODES.includes(err.code)) {
                    reject(Object.assign(err, { name: "TimeoutError" }));
                }
                else {
                    reject(err);
                }
            });
            set_connection_timeout_1.setConnectionTimeout(req, reject, this.connectionTimeout);
            set_socket_timeout_1.setSocketTimeout(req, reject, this.socketTimeout);
            if (abortSignal) {
                abortSignal.onabort = () => {
                    req.abort();
                    const abortError = new Error("Request aborted");
                    abortError.name = "AbortError";
                    reject(abortError);
                };
            }
            write_request_body_1.writeRequestBody(req, request);
        });
    }
}
exports.NodeHttpHandler = NodeHttpHandler;


/***/ }),
/* 491 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DecodeAuthorizationMessageCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const middleware_signing_1 = __webpack_require__(307);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class DecodeAuthorizationMessageCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "DecodeAuthorizationMessageCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DecodeAuthorizationMessageRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DecodeAuthorizationMessageResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryDecodeAuthorizationMessageCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryDecodeAuthorizationMessageCommand(output, context);
    }
}
exports.DecodeAuthorizationMessageCommand = DecodeAuthorizationMessageCommand;


/***/ }),
/* 492 */,
/* 493 */,
/* 494 */,
/* 495 */,
/* 496 */,
/* 497 */,
/* 498 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = exports.DEFAULT_USE_FIPS_ENDPOINT = exports.CONFIG_USE_FIPS_ENDPOINT = exports.ENV_USE_FIPS_ENDPOINT = void 0;
const util_config_provider_1 = __webpack_require__(515);
exports.ENV_USE_FIPS_ENDPOINT = "AWS_USE_FIPS_ENDPOINT";
exports.CONFIG_USE_FIPS_ENDPOINT = "use_fips_endpoint";
exports.DEFAULT_USE_FIPS_ENDPOINT = false;
exports.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => util_config_provider_1.booleanSelector(env, exports.ENV_USE_FIPS_ENDPOINT, util_config_provider_1.SelectorType.ENV),
    configFileSelector: (profile) => util_config_provider_1.booleanSelector(profile, exports.CONFIG_USE_FIPS_ENDPOINT, util_config_provider_1.SelectorType.CONFIG),
    default: false,
};


/***/ }),
/* 499 */,
/* 500 */,
/* 501 */,
/* 502 */,
/* 503 */,
/* 504 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(544), exports);
tslib_1.__exportStar(__webpack_require__(343), exports);
tslib_1.__exportStar(__webpack_require__(214), exports);
tslib_1.__exportStar(__webpack_require__(663), exports);


/***/ }),
/* 505 */,
/* 506 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeUriPath = void 0;
const escape_uri_1 = __webpack_require__(255);
const escapeUriPath = (uri) => uri.split("/").map(escape_uri_1.escapeUri).join("/");
exports.escapeUriPath = escapeUriPath;


/***/ }),
/* 507 */,
/* 508 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(37), exports);


/***/ }),
/* 509 */,
/* 510 */,
/* 511 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PutImageTagMutabilityCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class PutImageTagMutabilityCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "PutImageTagMutabilityCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.PutImageTagMutabilityRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.PutImageTagMutabilityResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1PutImageTagMutabilityCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1PutImageTagMutabilityCommand(output, context);
    }
}
exports.PutImageTagMutabilityCommand = PutImageTagMutabilityCommand;


/***/ }),
/* 512 */,
/* 513 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(799), exports);
tslib_1.__exportStar(__webpack_require__(916), exports);


/***/ }),
/* 514 */,
/* 515 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(589), exports);


/***/ }),
/* 516 */,
/* 517 */,
/* 518 */,
/* 519 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(899), exports);


/***/ }),
/* 520 */,
/* 521 */,
/* 522 */,
/* 523 */,
/* 524 */,
/* 525 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRegionInfoProvider = void 0;
const config_resolver_1 = __webpack_require__(529);
const regionHash = {
    "af-south-1": {
        variants: [
            {
                hostname: "api.ecr.af-south-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "af-south-1",
    },
    "ap-east-1": {
        variants: [
            {
                hostname: "api.ecr.ap-east-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-east-1",
    },
    "ap-northeast-1": {
        variants: [
            {
                hostname: "api.ecr.ap-northeast-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-northeast-1",
    },
    "ap-northeast-2": {
        variants: [
            {
                hostname: "api.ecr.ap-northeast-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-northeast-2",
    },
    "ap-northeast-3": {
        variants: [
            {
                hostname: "api.ecr.ap-northeast-3.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-northeast-3",
    },
    "ap-south-1": {
        variants: [
            {
                hostname: "api.ecr.ap-south-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-south-1",
    },
    "ap-southeast-1": {
        variants: [
            {
                hostname: "api.ecr.ap-southeast-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-southeast-1",
    },
    "ap-southeast-2": {
        variants: [
            {
                hostname: "api.ecr.ap-southeast-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-southeast-2",
    },
    "ca-central-1": {
        variants: [
            {
                hostname: "api.ecr.ca-central-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ca-central-1",
    },
    "cn-north-1": {
        variants: [
            {
                hostname: "api.ecr.cn-north-1.amazonaws.com.cn",
                tags: [],
            },
        ],
        signingRegion: "cn-north-1",
    },
    "cn-northwest-1": {
        variants: [
            {
                hostname: "api.ecr.cn-northwest-1.amazonaws.com.cn",
                tags: [],
            },
        ],
        signingRegion: "cn-northwest-1",
    },
    "eu-central-1": {
        variants: [
            {
                hostname: "api.ecr.eu-central-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-central-1",
    },
    "eu-north-1": {
        variants: [
            {
                hostname: "api.ecr.eu-north-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-north-1",
    },
    "eu-south-1": {
        variants: [
            {
                hostname: "api.ecr.eu-south-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-south-1",
    },
    "eu-west-1": {
        variants: [
            {
                hostname: "api.ecr.eu-west-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-west-1",
    },
    "eu-west-2": {
        variants: [
            {
                hostname: "api.ecr.eu-west-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-west-2",
    },
    "eu-west-3": {
        variants: [
            {
                hostname: "api.ecr.eu-west-3.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-west-3",
    },
    "me-south-1": {
        variants: [
            {
                hostname: "api.ecr.me-south-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "me-south-1",
    },
    "sa-east-1": {
        variants: [
            {
                hostname: "api.ecr.sa-east-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "sa-east-1",
    },
    "us-east-1": {
        variants: [
            {
                hostname: "api.ecr.us-east-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.us-east-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
        signingRegion: "us-east-1",
    },
    "us-east-2": {
        variants: [
            {
                hostname: "api.ecr.us-east-2.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.us-east-2.amazonaws.com",
                tags: ["fips"],
            },
        ],
        signingRegion: "us-east-2",
    },
    "us-gov-east-1": {
        variants: [
            {
                hostname: "api.ecr.us-gov-east-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.us-gov-east-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
        signingRegion: "us-gov-east-1",
    },
    "us-gov-west-1": {
        variants: [
            {
                hostname: "api.ecr.us-gov-west-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.us-gov-west-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
        signingRegion: "us-gov-west-1",
    },
    "us-iso-east-1": {
        variants: [
            {
                hostname: "api.ecr.us-iso-east-1.c2s.ic.gov",
                tags: [],
            },
        ],
        signingRegion: "us-iso-east-1",
    },
    "us-iso-west-1": {
        variants: [
            {
                hostname: "api.ecr.us-iso-west-1.c2s.ic.gov",
                tags: [],
            },
        ],
        signingRegion: "us-iso-west-1",
    },
    "us-isob-east-1": {
        variants: [
            {
                hostname: "api.ecr.us-isob-east-1.sc2s.sgov.gov",
                tags: [],
            },
        ],
        signingRegion: "us-isob-east-1",
    },
    "us-west-1": {
        variants: [
            {
                hostname: "api.ecr.us-west-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.us-west-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
        signingRegion: "us-west-1",
    },
    "us-west-2": {
        variants: [
            {
                hostname: "api.ecr.us-west-2.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.us-west-2.amazonaws.com",
                tags: ["fips"],
            },
        ],
        signingRegion: "us-west-2",
    },
};
const partitionHash = {
    aws: {
        regions: [
            "af-south-1",
            "ap-east-1",
            "ap-northeast-1",
            "ap-northeast-2",
            "ap-northeast-3",
            "ap-south-1",
            "ap-southeast-1",
            "ap-southeast-2",
            "ca-central-1",
            "dkr-us-east-1",
            "dkr-us-east-2",
            "dkr-us-west-1",
            "dkr-us-west-2",
            "eu-central-1",
            "eu-north-1",
            "eu-south-1",
            "eu-west-1",
            "eu-west-2",
            "eu-west-3",
            "fips-dkr-us-east-1",
            "fips-dkr-us-east-2",
            "fips-dkr-us-west-1",
            "fips-dkr-us-west-2",
            "fips-us-east-1",
            "fips-us-east-2",
            "fips-us-west-1",
            "fips-us-west-2",
            "me-south-1",
            "sa-east-1",
            "us-east-1",
            "us-east-2",
            "us-west-1",
            "us-west-2",
        ],
        regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "api.ecr.{region}.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.{region}.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
    "aws-cn": {
        regions: ["cn-north-1", "cn-northwest-1"],
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "api.ecr.{region}.amazonaws.com.cn",
                tags: [],
            },
            {
                hostname: "api.ecr-fips.{region}.amazonaws.com.cn",
                tags: ["fips"],
            },
            {
                hostname: "api.ecr-fips.{region}.api.amazonwebservices.com.cn",
                tags: ["dualstack", "fips"],
            },
            {
                hostname: "api.ecr.{region}.api.amazonwebservices.com.cn",
                tags: ["dualstack"],
            },
        ],
    },
    "aws-iso": {
        regions: ["us-iso-east-1", "us-iso-west-1"],
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "api.ecr.{region}.c2s.ic.gov",
                tags: [],
            },
        ],
    },
    "aws-iso-b": {
        regions: ["us-isob-east-1"],
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "api.ecr.{region}.sc2s.sgov.gov",
                tags: [],
            },
        ],
    },
    "aws-us-gov": {
        regions: [
            "dkr-us-gov-east-1",
            "dkr-us-gov-west-1",
            "fips-dkr-us-gov-east-1",
            "fips-dkr-us-gov-west-1",
            "fips-us-gov-east-1",
            "fips-us-gov-west-1",
            "us-gov-east-1",
            "us-gov-west-1",
        ],
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "api.ecr.{region}.amazonaws.com",
                tags: [],
            },
            {
                hostname: "ecr-fips.{region}.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
};
const defaultRegionInfoProvider = async (region, options) => config_resolver_1.getRegionInfo(region, {
    ...options,
    signingService: "ecr",
    regionHash,
    partitionHash,
});
exports.defaultRegionInfoProvider = defaultRegionInfoProvider;


/***/ }),
/* 526 */,
/* 527 */,
/* 528 */,
/* 529 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(68), exports);
tslib_1.__exportStar(__webpack_require__(575), exports);
tslib_1.__exportStar(__webpack_require__(543), exports);


/***/ }),
/* 530 */,
/* 531 */,
/* 532 */,
/* 533 */,
/* 534 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateListAccounts = void 0;
const ListAccountsCommand_1 = __webpack_require__(245);
const SSO_1 = __webpack_require__(688);
const SSOClient_1 = __webpack_require__(17);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListAccountsCommand_1.ListAccountsCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.listAccounts(input, ...args);
};
async function* paginateListAccounts(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof SSO_1.SSO) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof SSOClient_1.SSOClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected SSO | SSOClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateListAccounts = paginateListAccounts;


/***/ }),
/* 535 */,
/* 536 */,
/* 537 */,
/* 538 */,
/* 539 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const http = __webpack_require__(605);
const https = __webpack_require__(211);
const pm = __webpack_require__(950);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __webpack_require__(413);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    ...((proxyUrl.username || proxyUrl.password) && {
                        proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                    }),
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),
/* 540 */,
/* 541 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEndpoint = void 0;
const normalizeEndpoint = ({ endpoint, urlParser }) => {
    if (typeof endpoint === "string") {
        const promisified = Promise.resolve(urlParser(endpoint));
        return () => promisified;
    }
    else if (typeof endpoint === "object") {
        const promisified = Promise.resolve(endpoint);
        return () => promisified;
    }
    return endpoint;
};
exports.normalizeEndpoint = normalizeEndpoint;


/***/ }),
/* 542 */,
/* 543 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(889), exports);
tslib_1.__exportStar(__webpack_require__(828), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);


/***/ }),
/* 544 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 545 */,
/* 546 */,
/* 547 */,
/* 548 */,
/* 549 */,
/* 550 */,
/* 551 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateDefaultCredentialProvider = exports.getDefaultRoleAssumerWithWebIdentity = exports.getDefaultRoleAssumer = void 0;
const AssumeRoleCommand_1 = __webpack_require__(378);
const AssumeRoleWithWebIdentityCommand_1 = __webpack_require__(650);
const ASSUME_ROLE_DEFAULT_REGION = "us-east-1";
const decorateDefaultRegion = (region) => {
    if (typeof region !== "function") {
        return region === undefined ? ASSUME_ROLE_DEFAULT_REGION : region;
    }
    return async () => {
        try {
            return await region();
        }
        catch (e) {
            return ASSUME_ROLE_DEFAULT_REGION;
        }
    };
};
const getDefaultRoleAssumer = (stsOptions, stsClientCtor) => {
    let stsClient;
    let closureSourceCreds;
    return async (sourceCreds, params) => {
        closureSourceCreds = sourceCreds;
        if (!stsClient) {
            const { logger, region, requestHandler } = stsOptions;
            stsClient = new stsClientCtor({
                logger,
                credentialDefaultProvider: () => async () => closureSourceCreds,
                region: decorateDefaultRegion(region || stsOptions.region),
                ...(requestHandler ? { requestHandler } : {}),
            });
        }
        const { Credentials } = await stsClient.send(new AssumeRoleCommand_1.AssumeRoleCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRole call with role ${params.RoleArn}`);
        }
        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
        };
    };
};
exports.getDefaultRoleAssumer = getDefaultRoleAssumer;
const getDefaultRoleAssumerWithWebIdentity = (stsOptions, stsClientCtor) => {
    let stsClient;
    return async (params) => {
        if (!stsClient) {
            const { logger, region, requestHandler } = stsOptions;
            stsClient = new stsClientCtor({
                logger,
                region: decorateDefaultRegion(region || stsOptions.region),
                ...(requestHandler ? { requestHandler } : {}),
            });
        }
        const { Credentials } = await stsClient.send(new AssumeRoleWithWebIdentityCommand_1.AssumeRoleWithWebIdentityCommand(params));
        if (!Credentials || !Credentials.AccessKeyId || !Credentials.SecretAccessKey) {
            throw new Error(`Invalid response from STS.assumeRoleWithWebIdentity call with role ${params.RoleArn}`);
        }
        return {
            accessKeyId: Credentials.AccessKeyId,
            secretAccessKey: Credentials.SecretAccessKey,
            sessionToken: Credentials.SessionToken,
            expiration: Credentials.Expiration,
        };
    };
};
exports.getDefaultRoleAssumerWithWebIdentity = getDefaultRoleAssumerWithWebIdentity;
const decorateDefaultCredentialProvider = (provider) => (input) => provider({
    roleAssumer: exports.getDefaultRoleAssumer(input, input.stsClientCtor),
    roleAssumerWithWebIdentity: exports.getDefaultRoleAssumerWithWebIdentity(input, input.stsClientCtor),
    ...input,
});
exports.decorateDefaultCredentialProvider = decorateDefaultCredentialProvider;


/***/ }),
/* 552 */,
/* 553 */,
/* 554 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromEnv = exports.ENV_EXPIRATION = exports.ENV_SESSION = exports.ENV_SECRET = exports.ENV_KEY = void 0;
const property_provider_1 = __webpack_require__(948);
exports.ENV_KEY = "AWS_ACCESS_KEY_ID";
exports.ENV_SECRET = "AWS_SECRET_ACCESS_KEY";
exports.ENV_SESSION = "AWS_SESSION_TOKEN";
exports.ENV_EXPIRATION = "AWS_CREDENTIAL_EXPIRATION";
function fromEnv() {
    return () => {
        const accessKeyId = process.env[exports.ENV_KEY];
        const secretAccessKey = process.env[exports.ENV_SECRET];
        const expiry = process.env[exports.ENV_EXPIRATION];
        if (accessKeyId && secretAccessKey) {
            return Promise.resolve({
                accessKeyId,
                secretAccessKey,
                sessionToken: process.env[exports.ENV_SESSION],
                expiration: expiry ? new Date(expiry) : undefined,
            });
        }
        return Promise.reject(new property_provider_1.CredentialsProviderError("Unable to find environment variable credentials."));
    };
}
exports.fromEnv = fromEnv;


/***/ }),
/* 555 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBodyLength = void 0;
const fs_1 = __webpack_require__(747);
function calculateBodyLength(body) {
    if (!body) {
        return 0;
    }
    if (typeof body === "string") {
        return Buffer.from(body).length;
    }
    else if (typeof body.byteLength === "number") {
        return body.byteLength;
    }
    else if (typeof body.size === "number") {
        return body.size;
    }
    else if (typeof body.path === "string") {
        return fs_1.lstatSync(body.path).size;
    }
}
exports.calculateBodyLength = calculateBodyLength;


/***/ }),
/* 556 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(743);
const Aws_restJson1_1 = __webpack_require__(340);
class LogoutCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "LogoutCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.LogoutRequest.filterSensitiveLog,
            outputFilterSensitiveLog: (output) => output,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_restJson1_1.serializeAws_restJson1LogoutCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_restJson1_1.deserializeAws_restJson1LogoutCommand(output, context);
    }
}
exports.LogoutCommand = LogoutCommand;


/***/ }),
/* 557 */,
/* 558 */,
/* 559 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeAws_json1_1GetAuthorizationTokenCommand = exports.deserializeAws_json1_1DescribeRepositoriesCommand = exports.deserializeAws_json1_1DescribeRegistryCommand = exports.deserializeAws_json1_1DescribeImageScanFindingsCommand = exports.deserializeAws_json1_1DescribeImagesCommand = exports.deserializeAws_json1_1DescribeImageReplicationStatusCommand = exports.deserializeAws_json1_1DeleteRepositoryPolicyCommand = exports.deserializeAws_json1_1DeleteRepositoryCommand = exports.deserializeAws_json1_1DeleteRegistryPolicyCommand = exports.deserializeAws_json1_1DeleteLifecyclePolicyCommand = exports.deserializeAws_json1_1CreateRepositoryCommand = exports.deserializeAws_json1_1CompleteLayerUploadCommand = exports.deserializeAws_json1_1BatchGetImageCommand = exports.deserializeAws_json1_1BatchDeleteImageCommand = exports.deserializeAws_json1_1BatchCheckLayerAvailabilityCommand = exports.serializeAws_json1_1UploadLayerPartCommand = exports.serializeAws_json1_1UntagResourceCommand = exports.serializeAws_json1_1TagResourceCommand = exports.serializeAws_json1_1StartLifecyclePolicyPreviewCommand = exports.serializeAws_json1_1StartImageScanCommand = exports.serializeAws_json1_1SetRepositoryPolicyCommand = exports.serializeAws_json1_1PutReplicationConfigurationCommand = exports.serializeAws_json1_1PutRegistryPolicyCommand = exports.serializeAws_json1_1PutLifecyclePolicyCommand = exports.serializeAws_json1_1PutImageTagMutabilityCommand = exports.serializeAws_json1_1PutImageScanningConfigurationCommand = exports.serializeAws_json1_1PutImageCommand = exports.serializeAws_json1_1ListTagsForResourceCommand = exports.serializeAws_json1_1ListImagesCommand = exports.serializeAws_json1_1InitiateLayerUploadCommand = exports.serializeAws_json1_1GetRepositoryPolicyCommand = exports.serializeAws_json1_1GetRegistryPolicyCommand = exports.serializeAws_json1_1GetLifecyclePolicyPreviewCommand = exports.serializeAws_json1_1GetLifecyclePolicyCommand = exports.serializeAws_json1_1GetDownloadUrlForLayerCommand = exports.serializeAws_json1_1GetAuthorizationTokenCommand = exports.serializeAws_json1_1DescribeRepositoriesCommand = exports.serializeAws_json1_1DescribeRegistryCommand = exports.serializeAws_json1_1DescribeImageScanFindingsCommand = exports.serializeAws_json1_1DescribeImagesCommand = exports.serializeAws_json1_1DescribeImageReplicationStatusCommand = exports.serializeAws_json1_1DeleteRepositoryPolicyCommand = exports.serializeAws_json1_1DeleteRepositoryCommand = exports.serializeAws_json1_1DeleteRegistryPolicyCommand = exports.serializeAws_json1_1DeleteLifecyclePolicyCommand = exports.serializeAws_json1_1CreateRepositoryCommand = exports.serializeAws_json1_1CompleteLayerUploadCommand = exports.serializeAws_json1_1BatchGetImageCommand = exports.serializeAws_json1_1BatchDeleteImageCommand = exports.serializeAws_json1_1BatchCheckLayerAvailabilityCommand = void 0;
exports.deserializeAws_json1_1UploadLayerPartCommand = exports.deserializeAws_json1_1UntagResourceCommand = exports.deserializeAws_json1_1TagResourceCommand = exports.deserializeAws_json1_1StartLifecyclePolicyPreviewCommand = exports.deserializeAws_json1_1StartImageScanCommand = exports.deserializeAws_json1_1SetRepositoryPolicyCommand = exports.deserializeAws_json1_1PutReplicationConfigurationCommand = exports.deserializeAws_json1_1PutRegistryPolicyCommand = exports.deserializeAws_json1_1PutLifecyclePolicyCommand = exports.deserializeAws_json1_1PutImageTagMutabilityCommand = exports.deserializeAws_json1_1PutImageScanningConfigurationCommand = exports.deserializeAws_json1_1PutImageCommand = exports.deserializeAws_json1_1ListTagsForResourceCommand = exports.deserializeAws_json1_1ListImagesCommand = exports.deserializeAws_json1_1InitiateLayerUploadCommand = exports.deserializeAws_json1_1GetRepositoryPolicyCommand = exports.deserializeAws_json1_1GetRegistryPolicyCommand = exports.deserializeAws_json1_1GetLifecyclePolicyPreviewCommand = exports.deserializeAws_json1_1GetLifecyclePolicyCommand = exports.deserializeAws_json1_1GetDownloadUrlForLayerCommand = void 0;
const protocol_http_1 = __webpack_require__(504);
const smithy_client_1 = __webpack_require__(973);
const serializeAws_json1_1BatchCheckLayerAvailabilityCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.BatchCheckLayerAvailability",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1BatchCheckLayerAvailabilityRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1BatchCheckLayerAvailabilityCommand = serializeAws_json1_1BatchCheckLayerAvailabilityCommand;
const serializeAws_json1_1BatchDeleteImageCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.BatchDeleteImage",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1BatchDeleteImageRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1BatchDeleteImageCommand = serializeAws_json1_1BatchDeleteImageCommand;
const serializeAws_json1_1BatchGetImageCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.BatchGetImage",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1BatchGetImageRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1BatchGetImageCommand = serializeAws_json1_1BatchGetImageCommand;
const serializeAws_json1_1CompleteLayerUploadCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.CompleteLayerUpload",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1CompleteLayerUploadRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1CompleteLayerUploadCommand = serializeAws_json1_1CompleteLayerUploadCommand;
const serializeAws_json1_1CreateRepositoryCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.CreateRepository",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1CreateRepositoryRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1CreateRepositoryCommand = serializeAws_json1_1CreateRepositoryCommand;
const serializeAws_json1_1DeleteLifecyclePolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DeleteLifecyclePolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DeleteLifecyclePolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DeleteLifecyclePolicyCommand = serializeAws_json1_1DeleteLifecyclePolicyCommand;
const serializeAws_json1_1DeleteRegistryPolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DeleteRegistryPolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DeleteRegistryPolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DeleteRegistryPolicyCommand = serializeAws_json1_1DeleteRegistryPolicyCommand;
const serializeAws_json1_1DeleteRepositoryCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DeleteRepository",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DeleteRepositoryRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DeleteRepositoryCommand = serializeAws_json1_1DeleteRepositoryCommand;
const serializeAws_json1_1DeleteRepositoryPolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DeleteRepositoryPolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DeleteRepositoryPolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DeleteRepositoryPolicyCommand = serializeAws_json1_1DeleteRepositoryPolicyCommand;
const serializeAws_json1_1DescribeImageReplicationStatusCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DescribeImageReplicationStatus",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DescribeImageReplicationStatusRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DescribeImageReplicationStatusCommand = serializeAws_json1_1DescribeImageReplicationStatusCommand;
const serializeAws_json1_1DescribeImagesCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DescribeImages",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DescribeImagesRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DescribeImagesCommand = serializeAws_json1_1DescribeImagesCommand;
const serializeAws_json1_1DescribeImageScanFindingsCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DescribeImageScanFindings",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DescribeImageScanFindingsRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DescribeImageScanFindingsCommand = serializeAws_json1_1DescribeImageScanFindingsCommand;
const serializeAws_json1_1DescribeRegistryCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DescribeRegistry",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DescribeRegistryRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DescribeRegistryCommand = serializeAws_json1_1DescribeRegistryCommand;
const serializeAws_json1_1DescribeRepositoriesCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.DescribeRepositories",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1DescribeRepositoriesRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1DescribeRepositoriesCommand = serializeAws_json1_1DescribeRepositoriesCommand;
const serializeAws_json1_1GetAuthorizationTokenCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.GetAuthorizationToken",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1GetAuthorizationTokenRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1GetAuthorizationTokenCommand = serializeAws_json1_1GetAuthorizationTokenCommand;
const serializeAws_json1_1GetDownloadUrlForLayerCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.GetDownloadUrlForLayer",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1GetDownloadUrlForLayerRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1GetDownloadUrlForLayerCommand = serializeAws_json1_1GetDownloadUrlForLayerCommand;
const serializeAws_json1_1GetLifecyclePolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.GetLifecyclePolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1GetLifecyclePolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1GetLifecyclePolicyCommand = serializeAws_json1_1GetLifecyclePolicyCommand;
const serializeAws_json1_1GetLifecyclePolicyPreviewCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.GetLifecyclePolicyPreview",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1GetLifecyclePolicyPreviewRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1GetLifecyclePolicyPreviewCommand = serializeAws_json1_1GetLifecyclePolicyPreviewCommand;
const serializeAws_json1_1GetRegistryPolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.GetRegistryPolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1GetRegistryPolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1GetRegistryPolicyCommand = serializeAws_json1_1GetRegistryPolicyCommand;
const serializeAws_json1_1GetRepositoryPolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.GetRepositoryPolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1GetRepositoryPolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1GetRepositoryPolicyCommand = serializeAws_json1_1GetRepositoryPolicyCommand;
const serializeAws_json1_1InitiateLayerUploadCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.InitiateLayerUpload",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1InitiateLayerUploadRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1InitiateLayerUploadCommand = serializeAws_json1_1InitiateLayerUploadCommand;
const serializeAws_json1_1ListImagesCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.ListImages",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1ListImagesRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1ListImagesCommand = serializeAws_json1_1ListImagesCommand;
const serializeAws_json1_1ListTagsForResourceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.ListTagsForResource",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1ListTagsForResourceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1ListTagsForResourceCommand = serializeAws_json1_1ListTagsForResourceCommand;
const serializeAws_json1_1PutImageCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.PutImage",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1PutImageRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1PutImageCommand = serializeAws_json1_1PutImageCommand;
const serializeAws_json1_1PutImageScanningConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.PutImageScanningConfiguration",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1PutImageScanningConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1PutImageScanningConfigurationCommand = serializeAws_json1_1PutImageScanningConfigurationCommand;
const serializeAws_json1_1PutImageTagMutabilityCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.PutImageTagMutability",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1PutImageTagMutabilityRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1PutImageTagMutabilityCommand = serializeAws_json1_1PutImageTagMutabilityCommand;
const serializeAws_json1_1PutLifecyclePolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.PutLifecyclePolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1PutLifecyclePolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1PutLifecyclePolicyCommand = serializeAws_json1_1PutLifecyclePolicyCommand;
const serializeAws_json1_1PutRegistryPolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.PutRegistryPolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1PutRegistryPolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1PutRegistryPolicyCommand = serializeAws_json1_1PutRegistryPolicyCommand;
const serializeAws_json1_1PutReplicationConfigurationCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.PutReplicationConfiguration",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1PutReplicationConfigurationRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1PutReplicationConfigurationCommand = serializeAws_json1_1PutReplicationConfigurationCommand;
const serializeAws_json1_1SetRepositoryPolicyCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.SetRepositoryPolicy",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1SetRepositoryPolicyRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1SetRepositoryPolicyCommand = serializeAws_json1_1SetRepositoryPolicyCommand;
const serializeAws_json1_1StartImageScanCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.StartImageScan",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1StartImageScanRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1StartImageScanCommand = serializeAws_json1_1StartImageScanCommand;
const serializeAws_json1_1StartLifecyclePolicyPreviewCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.StartLifecyclePolicyPreview",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1StartLifecyclePolicyPreviewRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1StartLifecyclePolicyPreviewCommand = serializeAws_json1_1StartLifecyclePolicyPreviewCommand;
const serializeAws_json1_1TagResourceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.TagResource",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1TagResourceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1TagResourceCommand = serializeAws_json1_1TagResourceCommand;
const serializeAws_json1_1UntagResourceCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.UntagResource",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1UntagResourceRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1UntagResourceCommand = serializeAws_json1_1UntagResourceCommand;
const serializeAws_json1_1UploadLayerPartCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-amz-json-1.1",
        "x-amz-target": "AmazonEC2ContainerRegistry_V20150921.UploadLayerPart",
    };
    let body;
    body = JSON.stringify(serializeAws_json1_1UploadLayerPartRequest(input, context));
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_json1_1UploadLayerPartCommand = serializeAws_json1_1UploadLayerPartCommand;
const deserializeAws_json1_1BatchCheckLayerAvailabilityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1BatchCheckLayerAvailabilityCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1BatchCheckLayerAvailabilityResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1BatchCheckLayerAvailabilityCommand = deserializeAws_json1_1BatchCheckLayerAvailabilityCommand;
const deserializeAws_json1_1BatchCheckLayerAvailabilityCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1BatchDeleteImageCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1BatchDeleteImageCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1BatchDeleteImageResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1BatchDeleteImageCommand = deserializeAws_json1_1BatchDeleteImageCommand;
const deserializeAws_json1_1BatchDeleteImageCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1BatchGetImageCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1BatchGetImageCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1BatchGetImageResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1BatchGetImageCommand = deserializeAws_json1_1BatchGetImageCommand;
const deserializeAws_json1_1BatchGetImageCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1CompleteLayerUploadCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1CompleteLayerUploadCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1CompleteLayerUploadResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1CompleteLayerUploadCommand = deserializeAws_json1_1CompleteLayerUploadCommand;
const deserializeAws_json1_1CompleteLayerUploadCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "EmptyUploadException":
        case "com.amazonaws.ecr#EmptyUploadException":
            response = {
                ...(await deserializeAws_json1_1EmptyUploadExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidLayerException":
        case "com.amazonaws.ecr#InvalidLayerException":
            response = {
                ...(await deserializeAws_json1_1InvalidLayerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "KmsException":
        case "com.amazonaws.ecr#KmsException":
            response = {
                ...(await deserializeAws_json1_1KmsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LayerAlreadyExistsException":
        case "com.amazonaws.ecr#LayerAlreadyExistsException":
            response = {
                ...(await deserializeAws_json1_1LayerAlreadyExistsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LayerPartTooSmallException":
        case "com.amazonaws.ecr#LayerPartTooSmallException":
            response = {
                ...(await deserializeAws_json1_1LayerPartTooSmallExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UploadNotFoundException":
        case "com.amazonaws.ecr#UploadNotFoundException":
            response = {
                ...(await deserializeAws_json1_1UploadNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1CreateRepositoryCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1CreateRepositoryCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1CreateRepositoryResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1CreateRepositoryCommand = deserializeAws_json1_1CreateRepositoryCommand;
const deserializeAws_json1_1CreateRepositoryCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidTagParameterException":
        case "com.amazonaws.ecr#InvalidTagParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidTagParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "KmsException":
        case "com.amazonaws.ecr#KmsException":
            response = {
                ...(await deserializeAws_json1_1KmsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LimitExceededException":
        case "com.amazonaws.ecr#LimitExceededException":
            response = {
                ...(await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryAlreadyExistsException":
        case "com.amazonaws.ecr#RepositoryAlreadyExistsException":
            response = {
                ...(await deserializeAws_json1_1RepositoryAlreadyExistsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyTagsException":
        case "com.amazonaws.ecr#TooManyTagsException":
            response = {
                ...(await deserializeAws_json1_1TooManyTagsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DeleteLifecyclePolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DeleteLifecyclePolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DeleteLifecyclePolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DeleteLifecyclePolicyCommand = deserializeAws_json1_1DeleteLifecyclePolicyCommand;
const deserializeAws_json1_1DeleteLifecyclePolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LifecyclePolicyNotFoundException":
        case "com.amazonaws.ecr#LifecyclePolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1LifecyclePolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DeleteRegistryPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DeleteRegistryPolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DeleteRegistryPolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DeleteRegistryPolicyCommand = deserializeAws_json1_1DeleteRegistryPolicyCommand;
const deserializeAws_json1_1DeleteRegistryPolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RegistryPolicyNotFoundException":
        case "com.amazonaws.ecr#RegistryPolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RegistryPolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ValidationException":
        case "com.amazonaws.ecr#ValidationException":
            response = {
                ...(await deserializeAws_json1_1ValidationExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DeleteRepositoryCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DeleteRepositoryCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DeleteRepositoryResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DeleteRepositoryCommand = deserializeAws_json1_1DeleteRepositoryCommand;
const deserializeAws_json1_1DeleteRepositoryCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "KmsException":
        case "com.amazonaws.ecr#KmsException":
            response = {
                ...(await deserializeAws_json1_1KmsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotEmptyException":
        case "com.amazonaws.ecr#RepositoryNotEmptyException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotEmptyExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DeleteRepositoryPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DeleteRepositoryPolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DeleteRepositoryPolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DeleteRepositoryPolicyCommand = deserializeAws_json1_1DeleteRepositoryPolicyCommand;
const deserializeAws_json1_1DeleteRepositoryPolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryPolicyNotFoundException":
        case "com.amazonaws.ecr#RepositoryPolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryPolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DescribeImageReplicationStatusCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DescribeImageReplicationStatusCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DescribeImageReplicationStatusResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DescribeImageReplicationStatusCommand = deserializeAws_json1_1DescribeImageReplicationStatusCommand;
const deserializeAws_json1_1DescribeImageReplicationStatusCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ImageNotFoundException":
        case "com.amazonaws.ecr#ImageNotFoundException":
            response = {
                ...(await deserializeAws_json1_1ImageNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ValidationException":
        case "com.amazonaws.ecr#ValidationException":
            response = {
                ...(await deserializeAws_json1_1ValidationExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DescribeImagesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DescribeImagesCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DescribeImagesResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DescribeImagesCommand = deserializeAws_json1_1DescribeImagesCommand;
const deserializeAws_json1_1DescribeImagesCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ImageNotFoundException":
        case "com.amazonaws.ecr#ImageNotFoundException":
            response = {
                ...(await deserializeAws_json1_1ImageNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DescribeImageScanFindingsCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DescribeImageScanFindingsCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DescribeImageScanFindingsResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DescribeImageScanFindingsCommand = deserializeAws_json1_1DescribeImageScanFindingsCommand;
const deserializeAws_json1_1DescribeImageScanFindingsCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ImageNotFoundException":
        case "com.amazonaws.ecr#ImageNotFoundException":
            response = {
                ...(await deserializeAws_json1_1ImageNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ScanNotFoundException":
        case "com.amazonaws.ecr#ScanNotFoundException":
            response = {
                ...(await deserializeAws_json1_1ScanNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DescribeRegistryCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DescribeRegistryCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DescribeRegistryResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DescribeRegistryCommand = deserializeAws_json1_1DescribeRegistryCommand;
const deserializeAws_json1_1DescribeRegistryCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ValidationException":
        case "com.amazonaws.ecr#ValidationException":
            response = {
                ...(await deserializeAws_json1_1ValidationExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1DescribeRepositoriesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1DescribeRepositoriesCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1DescribeRepositoriesResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1DescribeRepositoriesCommand = deserializeAws_json1_1DescribeRepositoriesCommand;
const deserializeAws_json1_1DescribeRepositoriesCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1GetAuthorizationTokenCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetAuthorizationTokenCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1GetAuthorizationTokenResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1GetAuthorizationTokenCommand = deserializeAws_json1_1GetAuthorizationTokenCommand;
const deserializeAws_json1_1GetAuthorizationTokenCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1GetDownloadUrlForLayerCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetDownloadUrlForLayerCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1GetDownloadUrlForLayerResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1GetDownloadUrlForLayerCommand = deserializeAws_json1_1GetDownloadUrlForLayerCommand;
const deserializeAws_json1_1GetDownloadUrlForLayerCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LayerInaccessibleException":
        case "com.amazonaws.ecr#LayerInaccessibleException":
            response = {
                ...(await deserializeAws_json1_1LayerInaccessibleExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LayersNotFoundException":
        case "com.amazonaws.ecr#LayersNotFoundException":
            response = {
                ...(await deserializeAws_json1_1LayersNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1GetLifecyclePolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetLifecyclePolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1GetLifecyclePolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1GetLifecyclePolicyCommand = deserializeAws_json1_1GetLifecyclePolicyCommand;
const deserializeAws_json1_1GetLifecyclePolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LifecyclePolicyNotFoundException":
        case "com.amazonaws.ecr#LifecyclePolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1LifecyclePolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1GetLifecyclePolicyPreviewCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetLifecyclePolicyPreviewCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1GetLifecyclePolicyPreviewResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1GetLifecyclePolicyPreviewCommand = deserializeAws_json1_1GetLifecyclePolicyPreviewCommand;
const deserializeAws_json1_1GetLifecyclePolicyPreviewCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LifecyclePolicyPreviewNotFoundException":
        case "com.amazonaws.ecr#LifecyclePolicyPreviewNotFoundException":
            response = {
                ...(await deserializeAws_json1_1LifecyclePolicyPreviewNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1GetRegistryPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetRegistryPolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1GetRegistryPolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1GetRegistryPolicyCommand = deserializeAws_json1_1GetRegistryPolicyCommand;
const deserializeAws_json1_1GetRegistryPolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RegistryPolicyNotFoundException":
        case "com.amazonaws.ecr#RegistryPolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RegistryPolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ValidationException":
        case "com.amazonaws.ecr#ValidationException":
            response = {
                ...(await deserializeAws_json1_1ValidationExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1GetRepositoryPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1GetRepositoryPolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1GetRepositoryPolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1GetRepositoryPolicyCommand = deserializeAws_json1_1GetRepositoryPolicyCommand;
const deserializeAws_json1_1GetRepositoryPolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryPolicyNotFoundException":
        case "com.amazonaws.ecr#RepositoryPolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryPolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1InitiateLayerUploadCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1InitiateLayerUploadCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1InitiateLayerUploadResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1InitiateLayerUploadCommand = deserializeAws_json1_1InitiateLayerUploadCommand;
const deserializeAws_json1_1InitiateLayerUploadCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "KmsException":
        case "com.amazonaws.ecr#KmsException":
            response = {
                ...(await deserializeAws_json1_1KmsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1ListImagesCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1ListImagesCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1ListImagesResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1ListImagesCommand = deserializeAws_json1_1ListImagesCommand;
const deserializeAws_json1_1ListImagesCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1ListTagsForResourceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1ListTagsForResourceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1ListTagsForResourceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1ListTagsForResourceCommand = deserializeAws_json1_1ListTagsForResourceCommand;
const deserializeAws_json1_1ListTagsForResourceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1PutImageCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutImageCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1PutImageResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1PutImageCommand = deserializeAws_json1_1PutImageCommand;
const deserializeAws_json1_1PutImageCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ImageAlreadyExistsException":
        case "com.amazonaws.ecr#ImageAlreadyExistsException":
            response = {
                ...(await deserializeAws_json1_1ImageAlreadyExistsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ImageDigestDoesNotMatchException":
        case "com.amazonaws.ecr#ImageDigestDoesNotMatchException":
            response = {
                ...(await deserializeAws_json1_1ImageDigestDoesNotMatchExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ImageTagAlreadyExistsException":
        case "com.amazonaws.ecr#ImageTagAlreadyExistsException":
            response = {
                ...(await deserializeAws_json1_1ImageTagAlreadyExistsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "KmsException":
        case "com.amazonaws.ecr#KmsException":
            response = {
                ...(await deserializeAws_json1_1KmsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LayersNotFoundException":
        case "com.amazonaws.ecr#LayersNotFoundException":
            response = {
                ...(await deserializeAws_json1_1LayersNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LimitExceededException":
        case "com.amazonaws.ecr#LimitExceededException":
            response = {
                ...(await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ReferencedImagesNotFoundException":
        case "com.amazonaws.ecr#ReferencedImagesNotFoundException":
            response = {
                ...(await deserializeAws_json1_1ReferencedImagesNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1PutImageScanningConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutImageScanningConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1PutImageScanningConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1PutImageScanningConfigurationCommand = deserializeAws_json1_1PutImageScanningConfigurationCommand;
const deserializeAws_json1_1PutImageScanningConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1PutImageTagMutabilityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutImageTagMutabilityCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1PutImageTagMutabilityResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1PutImageTagMutabilityCommand = deserializeAws_json1_1PutImageTagMutabilityCommand;
const deserializeAws_json1_1PutImageTagMutabilityCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1PutLifecyclePolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutLifecyclePolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1PutLifecyclePolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1PutLifecyclePolicyCommand = deserializeAws_json1_1PutLifecyclePolicyCommand;
const deserializeAws_json1_1PutLifecyclePolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1PutRegistryPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutRegistryPolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1PutRegistryPolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1PutRegistryPolicyCommand = deserializeAws_json1_1PutRegistryPolicyCommand;
const deserializeAws_json1_1PutRegistryPolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ValidationException":
        case "com.amazonaws.ecr#ValidationException":
            response = {
                ...(await deserializeAws_json1_1ValidationExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1PutReplicationConfigurationCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1PutReplicationConfigurationCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1PutReplicationConfigurationResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1PutReplicationConfigurationCommand = deserializeAws_json1_1PutReplicationConfigurationCommand;
const deserializeAws_json1_1PutReplicationConfigurationCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ValidationException":
        case "com.amazonaws.ecr#ValidationException":
            response = {
                ...(await deserializeAws_json1_1ValidationExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1SetRepositoryPolicyCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1SetRepositoryPolicyCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1SetRepositoryPolicyResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1SetRepositoryPolicyCommand = deserializeAws_json1_1SetRepositoryPolicyCommand;
const deserializeAws_json1_1SetRepositoryPolicyCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1StartImageScanCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1StartImageScanCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1StartImageScanResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1StartImageScanCommand = deserializeAws_json1_1StartImageScanCommand;
const deserializeAws_json1_1StartImageScanCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ImageNotFoundException":
        case "com.amazonaws.ecr#ImageNotFoundException":
            response = {
                ...(await deserializeAws_json1_1ImageNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LimitExceededException":
        case "com.amazonaws.ecr#LimitExceededException":
            response = {
                ...(await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UnsupportedImageTypeException":
        case "com.amazonaws.ecr#UnsupportedImageTypeException":
            response = {
                ...(await deserializeAws_json1_1UnsupportedImageTypeExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1StartLifecyclePolicyPreviewCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1StartLifecyclePolicyPreviewCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1StartLifecyclePolicyPreviewResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1StartLifecyclePolicyPreviewCommand = deserializeAws_json1_1StartLifecyclePolicyPreviewCommand;
const deserializeAws_json1_1StartLifecyclePolicyPreviewCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LifecyclePolicyNotFoundException":
        case "com.amazonaws.ecr#LifecyclePolicyNotFoundException":
            response = {
                ...(await deserializeAws_json1_1LifecyclePolicyNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LifecyclePolicyPreviewInProgressException":
        case "com.amazonaws.ecr#LifecyclePolicyPreviewInProgressException":
            response = {
                ...(await deserializeAws_json1_1LifecyclePolicyPreviewInProgressExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1TagResourceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1TagResourceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1TagResourceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1TagResourceCommand = deserializeAws_json1_1TagResourceCommand;
const deserializeAws_json1_1TagResourceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidTagParameterException":
        case "com.amazonaws.ecr#InvalidTagParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidTagParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyTagsException":
        case "com.amazonaws.ecr#TooManyTagsException":
            response = {
                ...(await deserializeAws_json1_1TooManyTagsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1UntagResourceCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1UntagResourceCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1UntagResourceResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1UntagResourceCommand = deserializeAws_json1_1UntagResourceCommand;
const deserializeAws_json1_1UntagResourceCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidTagParameterException":
        case "com.amazonaws.ecr#InvalidTagParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidTagParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "TooManyTagsException":
        case "com.amazonaws.ecr#TooManyTagsException":
            response = {
                ...(await deserializeAws_json1_1TooManyTagsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1UploadLayerPartCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_json1_1UploadLayerPartCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_json1_1UploadLayerPartResponse(data, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_json1_1UploadLayerPartCommand = deserializeAws_json1_1UploadLayerPartCommand;
const deserializeAws_json1_1UploadLayerPartCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadRestJsonErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidLayerPartException":
        case "com.amazonaws.ecr#InvalidLayerPartException":
            response = {
                ...(await deserializeAws_json1_1InvalidLayerPartExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidParameterException":
        case "com.amazonaws.ecr#InvalidParameterException":
            response = {
                ...(await deserializeAws_json1_1InvalidParameterExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "KmsException":
        case "com.amazonaws.ecr#KmsException":
            response = {
                ...(await deserializeAws_json1_1KmsExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "LimitExceededException":
        case "com.amazonaws.ecr#LimitExceededException":
            response = {
                ...(await deserializeAws_json1_1LimitExceededExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RepositoryNotFoundException":
        case "com.amazonaws.ecr#RepositoryNotFoundException":
            response = {
                ...(await deserializeAws_json1_1RepositoryNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "ServerException":
        case "com.amazonaws.ecr#ServerException":
            response = {
                ...(await deserializeAws_json1_1ServerExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "UploadNotFoundException":
        case "com.amazonaws.ecr#UploadNotFoundException":
            response = {
                ...(await deserializeAws_json1_1UploadNotFoundExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.code || parsedBody.Code || errorCode;
            response = {
                ...parsedBody,
                name: `${errorCode}`,
                message: parsedBody.message || parsedBody.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_json1_1EmptyUploadExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1EmptyUploadException(body, context);
    const contents = {
        name: "EmptyUploadException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ImageAlreadyExistsExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ImageAlreadyExistsException(body, context);
    const contents = {
        name: "ImageAlreadyExistsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ImageDigestDoesNotMatchExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ImageDigestDoesNotMatchException(body, context);
    const contents = {
        name: "ImageDigestDoesNotMatchException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ImageNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ImageNotFoundException(body, context);
    const contents = {
        name: "ImageNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ImageTagAlreadyExistsExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ImageTagAlreadyExistsException(body, context);
    const contents = {
        name: "ImageTagAlreadyExistsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1InvalidLayerExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1InvalidLayerException(body, context);
    const contents = {
        name: "InvalidLayerException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1InvalidLayerPartExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1InvalidLayerPartException(body, context);
    const contents = {
        name: "InvalidLayerPartException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1InvalidParameterExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1InvalidParameterException(body, context);
    const contents = {
        name: "InvalidParameterException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1InvalidTagParameterExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1InvalidTagParameterException(body, context);
    const contents = {
        name: "InvalidTagParameterException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1KmsExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1KmsException(body, context);
    const contents = {
        name: "KmsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LayerAlreadyExistsExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LayerAlreadyExistsException(body, context);
    const contents = {
        name: "LayerAlreadyExistsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LayerInaccessibleExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LayerInaccessibleException(body, context);
    const contents = {
        name: "LayerInaccessibleException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LayerPartTooSmallExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LayerPartTooSmallException(body, context);
    const contents = {
        name: "LayerPartTooSmallException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LayersNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LayersNotFoundException(body, context);
    const contents = {
        name: "LayersNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LifecyclePolicyNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LifecyclePolicyNotFoundException(body, context);
    const contents = {
        name: "LifecyclePolicyNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LifecyclePolicyPreviewInProgressExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LifecyclePolicyPreviewInProgressException(body, context);
    const contents = {
        name: "LifecyclePolicyPreviewInProgressException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LifecyclePolicyPreviewNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LifecyclePolicyPreviewNotFoundException(body, context);
    const contents = {
        name: "LifecyclePolicyPreviewNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1LimitExceededExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1LimitExceededException(body, context);
    const contents = {
        name: "LimitExceededException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ReferencedImagesNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ReferencedImagesNotFoundException(body, context);
    const contents = {
        name: "ReferencedImagesNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1RegistryPolicyNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1RegistryPolicyNotFoundException(body, context);
    const contents = {
        name: "RegistryPolicyNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1RepositoryAlreadyExistsExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1RepositoryAlreadyExistsException(body, context);
    const contents = {
        name: "RepositoryAlreadyExistsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1RepositoryNotEmptyExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1RepositoryNotEmptyException(body, context);
    const contents = {
        name: "RepositoryNotEmptyException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1RepositoryNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1RepositoryNotFoundException(body, context);
    const contents = {
        name: "RepositoryNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1RepositoryPolicyNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1RepositoryPolicyNotFoundException(body, context);
    const contents = {
        name: "RepositoryPolicyNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ScanNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ScanNotFoundException(body, context);
    const contents = {
        name: "ScanNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ServerExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ServerException(body, context);
    const contents = {
        name: "ServerException",
        $fault: "server",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1TooManyTagsExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1TooManyTagsException(body, context);
    const contents = {
        name: "TooManyTagsException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1UnsupportedImageTypeExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1UnsupportedImageTypeException(body, context);
    const contents = {
        name: "UnsupportedImageTypeException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1UploadNotFoundExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1UploadNotFoundException(body, context);
    const contents = {
        name: "UploadNotFoundException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_json1_1ValidationExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_json1_1ValidationException(body, context);
    const contents = {
        name: "ValidationException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const serializeAws_json1_1BatchCheckLayerAvailabilityRequest = (input, context) => {
    return {
        ...(input.layerDigests !== undefined &&
            input.layerDigests !== null && {
            layerDigests: serializeAws_json1_1BatchedOperationLayerDigestList(input.layerDigests, context),
        }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1BatchDeleteImageRequest = (input, context) => {
    return {
        ...(input.imageIds !== undefined &&
            input.imageIds !== null && { imageIds: serializeAws_json1_1ImageIdentifierList(input.imageIds, context) }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1BatchedOperationLayerDigestList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return entry;
    });
};
const serializeAws_json1_1BatchGetImageRequest = (input, context) => {
    return {
        ...(input.acceptedMediaTypes !== undefined &&
            input.acceptedMediaTypes !== null && {
            acceptedMediaTypes: serializeAws_json1_1MediaTypeList(input.acceptedMediaTypes, context),
        }),
        ...(input.imageIds !== undefined &&
            input.imageIds !== null && { imageIds: serializeAws_json1_1ImageIdentifierList(input.imageIds, context) }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1CompleteLayerUploadRequest = (input, context) => {
    return {
        ...(input.layerDigests !== undefined &&
            input.layerDigests !== null && {
            layerDigests: serializeAws_json1_1LayerDigestList(input.layerDigests, context),
        }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
        ...(input.uploadId !== undefined && input.uploadId !== null && { uploadId: input.uploadId }),
    };
};
const serializeAws_json1_1CreateRepositoryRequest = (input, context) => {
    return {
        ...(input.encryptionConfiguration !== undefined &&
            input.encryptionConfiguration !== null && {
            encryptionConfiguration: serializeAws_json1_1EncryptionConfiguration(input.encryptionConfiguration, context),
        }),
        ...(input.imageScanningConfiguration !== undefined &&
            input.imageScanningConfiguration !== null && {
            imageScanningConfiguration: serializeAws_json1_1ImageScanningConfiguration(input.imageScanningConfiguration, context),
        }),
        ...(input.imageTagMutability !== undefined &&
            input.imageTagMutability !== null && { imageTagMutability: input.imageTagMutability }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
        ...(input.tags !== undefined && input.tags !== null && { tags: serializeAws_json1_1TagList(input.tags, context) }),
    };
};
const serializeAws_json1_1DeleteLifecyclePolicyRequest = (input, context) => {
    return {
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1DeleteRegistryPolicyRequest = (input, context) => {
    return {};
};
const serializeAws_json1_1DeleteRepositoryPolicyRequest = (input, context) => {
    return {
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1DeleteRepositoryRequest = (input, context) => {
    return {
        ...(input.force !== undefined && input.force !== null && { force: input.force }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1DescribeImageReplicationStatusRequest = (input, context) => {
    return {
        ...(input.imageId !== undefined &&
            input.imageId !== null && { imageId: serializeAws_json1_1ImageIdentifier(input.imageId, context) }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1DescribeImageScanFindingsRequest = (input, context) => {
    return {
        ...(input.imageId !== undefined &&
            input.imageId !== null && { imageId: serializeAws_json1_1ImageIdentifier(input.imageId, context) }),
        ...(input.maxResults !== undefined && input.maxResults !== null && { maxResults: input.maxResults }),
        ...(input.nextToken !== undefined && input.nextToken !== null && { nextToken: input.nextToken }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1DescribeImagesFilter = (input, context) => {
    return {
        ...(input.tagStatus !== undefined && input.tagStatus !== null && { tagStatus: input.tagStatus }),
    };
};
const serializeAws_json1_1DescribeImagesRequest = (input, context) => {
    return {
        ...(input.filter !== undefined &&
            input.filter !== null && { filter: serializeAws_json1_1DescribeImagesFilter(input.filter, context) }),
        ...(input.imageIds !== undefined &&
            input.imageIds !== null && { imageIds: serializeAws_json1_1ImageIdentifierList(input.imageIds, context) }),
        ...(input.maxResults !== undefined && input.maxResults !== null && { maxResults: input.maxResults }),
        ...(input.nextToken !== undefined && input.nextToken !== null && { nextToken: input.nextToken }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1DescribeRegistryRequest = (input, context) => {
    return {};
};
const serializeAws_json1_1DescribeRepositoriesRequest = (input, context) => {
    return {
        ...(input.maxResults !== undefined && input.maxResults !== null && { maxResults: input.maxResults }),
        ...(input.nextToken !== undefined && input.nextToken !== null && { nextToken: input.nextToken }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryNames !== undefined &&
            input.repositoryNames !== null && {
            repositoryNames: serializeAws_json1_1RepositoryNameList(input.repositoryNames, context),
        }),
    };
};
const serializeAws_json1_1EncryptionConfiguration = (input, context) => {
    return {
        ...(input.encryptionType !== undefined &&
            input.encryptionType !== null && { encryptionType: input.encryptionType }),
        ...(input.kmsKey !== undefined && input.kmsKey !== null && { kmsKey: input.kmsKey }),
    };
};
const serializeAws_json1_1GetAuthorizationTokenRegistryIdList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return entry;
    });
};
const serializeAws_json1_1GetAuthorizationTokenRequest = (input, context) => {
    return {
        ...(input.registryIds !== undefined &&
            input.registryIds !== null && {
            registryIds: serializeAws_json1_1GetAuthorizationTokenRegistryIdList(input.registryIds, context),
        }),
    };
};
const serializeAws_json1_1GetDownloadUrlForLayerRequest = (input, context) => {
    return {
        ...(input.layerDigest !== undefined && input.layerDigest !== null && { layerDigest: input.layerDigest }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1GetLifecyclePolicyPreviewRequest = (input, context) => {
    return {
        ...(input.filter !== undefined &&
            input.filter !== null && { filter: serializeAws_json1_1LifecyclePolicyPreviewFilter(input.filter, context) }),
        ...(input.imageIds !== undefined &&
            input.imageIds !== null && { imageIds: serializeAws_json1_1ImageIdentifierList(input.imageIds, context) }),
        ...(input.maxResults !== undefined && input.maxResults !== null && { maxResults: input.maxResults }),
        ...(input.nextToken !== undefined && input.nextToken !== null && { nextToken: input.nextToken }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1GetLifecyclePolicyRequest = (input, context) => {
    return {
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1GetRegistryPolicyRequest = (input, context) => {
    return {};
};
const serializeAws_json1_1GetRepositoryPolicyRequest = (input, context) => {
    return {
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1ImageIdentifier = (input, context) => {
    return {
        ...(input.imageDigest !== undefined && input.imageDigest !== null && { imageDigest: input.imageDigest }),
        ...(input.imageTag !== undefined && input.imageTag !== null && { imageTag: input.imageTag }),
    };
};
const serializeAws_json1_1ImageIdentifierList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return serializeAws_json1_1ImageIdentifier(entry, context);
    });
};
const serializeAws_json1_1ImageScanningConfiguration = (input, context) => {
    return {
        ...(input.scanOnPush !== undefined && input.scanOnPush !== null && { scanOnPush: input.scanOnPush }),
    };
};
const serializeAws_json1_1InitiateLayerUploadRequest = (input, context) => {
    return {
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1LayerDigestList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return entry;
    });
};
const serializeAws_json1_1LifecyclePolicyPreviewFilter = (input, context) => {
    return {
        ...(input.tagStatus !== undefined && input.tagStatus !== null && { tagStatus: input.tagStatus }),
    };
};
const serializeAws_json1_1ListImagesFilter = (input, context) => {
    return {
        ...(input.tagStatus !== undefined && input.tagStatus !== null && { tagStatus: input.tagStatus }),
    };
};
const serializeAws_json1_1ListImagesRequest = (input, context) => {
    return {
        ...(input.filter !== undefined &&
            input.filter !== null && { filter: serializeAws_json1_1ListImagesFilter(input.filter, context) }),
        ...(input.maxResults !== undefined && input.maxResults !== null && { maxResults: input.maxResults }),
        ...(input.nextToken !== undefined && input.nextToken !== null && { nextToken: input.nextToken }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1ListTagsForResourceRequest = (input, context) => {
    return {
        ...(input.resourceArn !== undefined && input.resourceArn !== null && { resourceArn: input.resourceArn }),
    };
};
const serializeAws_json1_1MediaTypeList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return entry;
    });
};
const serializeAws_json1_1PutImageRequest = (input, context) => {
    return {
        ...(input.imageDigest !== undefined && input.imageDigest !== null && { imageDigest: input.imageDigest }),
        ...(input.imageManifest !== undefined && input.imageManifest !== null && { imageManifest: input.imageManifest }),
        ...(input.imageManifestMediaType !== undefined &&
            input.imageManifestMediaType !== null && { imageManifestMediaType: input.imageManifestMediaType }),
        ...(input.imageTag !== undefined && input.imageTag !== null && { imageTag: input.imageTag }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1PutImageScanningConfigurationRequest = (input, context) => {
    return {
        ...(input.imageScanningConfiguration !== undefined &&
            input.imageScanningConfiguration !== null && {
            imageScanningConfiguration: serializeAws_json1_1ImageScanningConfiguration(input.imageScanningConfiguration, context),
        }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1PutImageTagMutabilityRequest = (input, context) => {
    return {
        ...(input.imageTagMutability !== undefined &&
            input.imageTagMutability !== null && { imageTagMutability: input.imageTagMutability }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1PutLifecyclePolicyRequest = (input, context) => {
    return {
        ...(input.lifecyclePolicyText !== undefined &&
            input.lifecyclePolicyText !== null && { lifecyclePolicyText: input.lifecyclePolicyText }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1PutRegistryPolicyRequest = (input, context) => {
    return {
        ...(input.policyText !== undefined && input.policyText !== null && { policyText: input.policyText }),
    };
};
const serializeAws_json1_1PutReplicationConfigurationRequest = (input, context) => {
    return {
        ...(input.replicationConfiguration !== undefined &&
            input.replicationConfiguration !== null && {
            replicationConfiguration: serializeAws_json1_1ReplicationConfiguration(input.replicationConfiguration, context),
        }),
    };
};
const serializeAws_json1_1ReplicationConfiguration = (input, context) => {
    return {
        ...(input.rules !== undefined &&
            input.rules !== null && { rules: serializeAws_json1_1ReplicationRuleList(input.rules, context) }),
    };
};
const serializeAws_json1_1ReplicationDestination = (input, context) => {
    return {
        ...(input.region !== undefined && input.region !== null && { region: input.region }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
    };
};
const serializeAws_json1_1ReplicationDestinationList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return serializeAws_json1_1ReplicationDestination(entry, context);
    });
};
const serializeAws_json1_1ReplicationRule = (input, context) => {
    return {
        ...(input.destinations !== undefined &&
            input.destinations !== null && {
            destinations: serializeAws_json1_1ReplicationDestinationList(input.destinations, context),
        }),
        ...(input.repositoryFilters !== undefined &&
            input.repositoryFilters !== null && {
            repositoryFilters: serializeAws_json1_1RepositoryFilterList(input.repositoryFilters, context),
        }),
    };
};
const serializeAws_json1_1ReplicationRuleList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return serializeAws_json1_1ReplicationRule(entry, context);
    });
};
const serializeAws_json1_1RepositoryFilter = (input, context) => {
    return {
        ...(input.filter !== undefined && input.filter !== null && { filter: input.filter }),
        ...(input.filterType !== undefined && input.filterType !== null && { filterType: input.filterType }),
    };
};
const serializeAws_json1_1RepositoryFilterList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return serializeAws_json1_1RepositoryFilter(entry, context);
    });
};
const serializeAws_json1_1RepositoryNameList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return entry;
    });
};
const serializeAws_json1_1SetRepositoryPolicyRequest = (input, context) => {
    return {
        ...(input.force !== undefined && input.force !== null && { force: input.force }),
        ...(input.policyText !== undefined && input.policyText !== null && { policyText: input.policyText }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1StartImageScanRequest = (input, context) => {
    return {
        ...(input.imageId !== undefined &&
            input.imageId !== null && { imageId: serializeAws_json1_1ImageIdentifier(input.imageId, context) }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1StartLifecyclePolicyPreviewRequest = (input, context) => {
    return {
        ...(input.lifecyclePolicyText !== undefined &&
            input.lifecyclePolicyText !== null && { lifecyclePolicyText: input.lifecyclePolicyText }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
    };
};
const serializeAws_json1_1Tag = (input, context) => {
    return {
        ...(input.Key !== undefined && input.Key !== null && { Key: input.Key }),
        ...(input.Value !== undefined && input.Value !== null && { Value: input.Value }),
    };
};
const serializeAws_json1_1TagKeyList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return entry;
    });
};
const serializeAws_json1_1TagList = (input, context) => {
    return input
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return serializeAws_json1_1Tag(entry, context);
    });
};
const serializeAws_json1_1TagResourceRequest = (input, context) => {
    return {
        ...(input.resourceArn !== undefined && input.resourceArn !== null && { resourceArn: input.resourceArn }),
        ...(input.tags !== undefined && input.tags !== null && { tags: serializeAws_json1_1TagList(input.tags, context) }),
    };
};
const serializeAws_json1_1UntagResourceRequest = (input, context) => {
    return {
        ...(input.resourceArn !== undefined && input.resourceArn !== null && { resourceArn: input.resourceArn }),
        ...(input.tagKeys !== undefined &&
            input.tagKeys !== null && { tagKeys: serializeAws_json1_1TagKeyList(input.tagKeys, context) }),
    };
};
const serializeAws_json1_1UploadLayerPartRequest = (input, context) => {
    return {
        ...(input.layerPartBlob !== undefined &&
            input.layerPartBlob !== null && { layerPartBlob: context.base64Encoder(input.layerPartBlob) }),
        ...(input.partFirstByte !== undefined && input.partFirstByte !== null && { partFirstByte: input.partFirstByte }),
        ...(input.partLastByte !== undefined && input.partLastByte !== null && { partLastByte: input.partLastByte }),
        ...(input.registryId !== undefined && input.registryId !== null && { registryId: input.registryId }),
        ...(input.repositoryName !== undefined &&
            input.repositoryName !== null && { repositoryName: input.repositoryName }),
        ...(input.uploadId !== undefined && input.uploadId !== null && { uploadId: input.uploadId }),
    };
};
const deserializeAws_json1_1Attribute = (output, context) => {
    return {
        key: smithy_client_1.expectString(output.key),
        value: smithy_client_1.expectString(output.value),
    };
};
const deserializeAws_json1_1AttributeList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1Attribute(entry, context);
    });
};
const deserializeAws_json1_1AuthorizationData = (output, context) => {
    return {
        authorizationToken: smithy_client_1.expectString(output.authorizationToken),
        expiresAt: output.expiresAt !== undefined && output.expiresAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.expiresAt)))
            : undefined,
        proxyEndpoint: smithy_client_1.expectString(output.proxyEndpoint),
    };
};
const deserializeAws_json1_1AuthorizationDataList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1AuthorizationData(entry, context);
    });
};
const deserializeAws_json1_1BatchCheckLayerAvailabilityResponse = (output, context) => {
    return {
        failures: output.failures !== undefined && output.failures !== null
            ? deserializeAws_json1_1LayerFailureList(output.failures, context)
            : undefined,
        layers: output.layers !== undefined && output.layers !== null
            ? deserializeAws_json1_1LayerList(output.layers, context)
            : undefined,
    };
};
const deserializeAws_json1_1BatchDeleteImageResponse = (output, context) => {
    return {
        failures: output.failures !== undefined && output.failures !== null
            ? deserializeAws_json1_1ImageFailureList(output.failures, context)
            : undefined,
        imageIds: output.imageIds !== undefined && output.imageIds !== null
            ? deserializeAws_json1_1ImageIdentifierList(output.imageIds, context)
            : undefined,
    };
};
const deserializeAws_json1_1BatchGetImageResponse = (output, context) => {
    return {
        failures: output.failures !== undefined && output.failures !== null
            ? deserializeAws_json1_1ImageFailureList(output.failures, context)
            : undefined,
        images: output.images !== undefined && output.images !== null
            ? deserializeAws_json1_1ImageList(output.images, context)
            : undefined,
    };
};
const deserializeAws_json1_1CompleteLayerUploadResponse = (output, context) => {
    return {
        layerDigest: smithy_client_1.expectString(output.layerDigest),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
        uploadId: smithy_client_1.expectString(output.uploadId),
    };
};
const deserializeAws_json1_1CreateRepositoryResponse = (output, context) => {
    return {
        repository: output.repository !== undefined && output.repository !== null
            ? deserializeAws_json1_1Repository(output.repository, context)
            : undefined,
    };
};
const deserializeAws_json1_1DeleteLifecyclePolicyResponse = (output, context) => {
    return {
        lastEvaluatedAt: output.lastEvaluatedAt !== undefined && output.lastEvaluatedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.lastEvaluatedAt)))
            : undefined,
        lifecyclePolicyText: smithy_client_1.expectString(output.lifecyclePolicyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1DeleteRegistryPolicyResponse = (output, context) => {
    return {
        policyText: smithy_client_1.expectString(output.policyText),
        registryId: smithy_client_1.expectString(output.registryId),
    };
};
const deserializeAws_json1_1DeleteRepositoryPolicyResponse = (output, context) => {
    return {
        policyText: smithy_client_1.expectString(output.policyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1DeleteRepositoryResponse = (output, context) => {
    return {
        repository: output.repository !== undefined && output.repository !== null
            ? deserializeAws_json1_1Repository(output.repository, context)
            : undefined,
    };
};
const deserializeAws_json1_1DescribeImageReplicationStatusResponse = (output, context) => {
    return {
        imageId: output.imageId !== undefined && output.imageId !== null
            ? deserializeAws_json1_1ImageIdentifier(output.imageId, context)
            : undefined,
        replicationStatuses: output.replicationStatuses !== undefined && output.replicationStatuses !== null
            ? deserializeAws_json1_1ImageReplicationStatusList(output.replicationStatuses, context)
            : undefined,
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1DescribeImageScanFindingsResponse = (output, context) => {
    return {
        imageId: output.imageId !== undefined && output.imageId !== null
            ? deserializeAws_json1_1ImageIdentifier(output.imageId, context)
            : undefined,
        imageScanFindings: output.imageScanFindings !== undefined && output.imageScanFindings !== null
            ? deserializeAws_json1_1ImageScanFindings(output.imageScanFindings, context)
            : undefined,
        imageScanStatus: output.imageScanStatus !== undefined && output.imageScanStatus !== null
            ? deserializeAws_json1_1ImageScanStatus(output.imageScanStatus, context)
            : undefined,
        nextToken: smithy_client_1.expectString(output.nextToken),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1DescribeImagesResponse = (output, context) => {
    return {
        imageDetails: output.imageDetails !== undefined && output.imageDetails !== null
            ? deserializeAws_json1_1ImageDetailList(output.imageDetails, context)
            : undefined,
        nextToken: smithy_client_1.expectString(output.nextToken),
    };
};
const deserializeAws_json1_1DescribeRegistryResponse = (output, context) => {
    return {
        registryId: smithy_client_1.expectString(output.registryId),
        replicationConfiguration: output.replicationConfiguration !== undefined && output.replicationConfiguration !== null
            ? deserializeAws_json1_1ReplicationConfiguration(output.replicationConfiguration, context)
            : undefined,
    };
};
const deserializeAws_json1_1DescribeRepositoriesResponse = (output, context) => {
    return {
        nextToken: smithy_client_1.expectString(output.nextToken),
        repositories: output.repositories !== undefined && output.repositories !== null
            ? deserializeAws_json1_1RepositoryList(output.repositories, context)
            : undefined,
    };
};
const deserializeAws_json1_1EmptyUploadException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1EncryptionConfiguration = (output, context) => {
    return {
        encryptionType: smithy_client_1.expectString(output.encryptionType),
        kmsKey: smithy_client_1.expectString(output.kmsKey),
    };
};
const deserializeAws_json1_1FindingSeverityCounts = (output, context) => {
    return Object.entries(output).reduce((acc, [key, value]) => {
        if (value === null) {
            return acc;
        }
        return {
            ...acc,
            [key]: smithy_client_1.expectInt32(value),
        };
    }, {});
};
const deserializeAws_json1_1GetAuthorizationTokenResponse = (output, context) => {
    return {
        authorizationData: output.authorizationData !== undefined && output.authorizationData !== null
            ? deserializeAws_json1_1AuthorizationDataList(output.authorizationData, context)
            : undefined,
    };
};
const deserializeAws_json1_1GetDownloadUrlForLayerResponse = (output, context) => {
    return {
        downloadUrl: smithy_client_1.expectString(output.downloadUrl),
        layerDigest: smithy_client_1.expectString(output.layerDigest),
    };
};
const deserializeAws_json1_1GetLifecyclePolicyPreviewResponse = (output, context) => {
    return {
        lifecyclePolicyText: smithy_client_1.expectString(output.lifecyclePolicyText),
        nextToken: smithy_client_1.expectString(output.nextToken),
        previewResults: output.previewResults !== undefined && output.previewResults !== null
            ? deserializeAws_json1_1LifecyclePolicyPreviewResultList(output.previewResults, context)
            : undefined,
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
        status: smithy_client_1.expectString(output.status),
        summary: output.summary !== undefined && output.summary !== null
            ? deserializeAws_json1_1LifecyclePolicyPreviewSummary(output.summary, context)
            : undefined,
    };
};
const deserializeAws_json1_1GetLifecyclePolicyResponse = (output, context) => {
    return {
        lastEvaluatedAt: output.lastEvaluatedAt !== undefined && output.lastEvaluatedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.lastEvaluatedAt)))
            : undefined,
        lifecyclePolicyText: smithy_client_1.expectString(output.lifecyclePolicyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1GetRegistryPolicyResponse = (output, context) => {
    return {
        policyText: smithy_client_1.expectString(output.policyText),
        registryId: smithy_client_1.expectString(output.registryId),
    };
};
const deserializeAws_json1_1GetRepositoryPolicyResponse = (output, context) => {
    return {
        policyText: smithy_client_1.expectString(output.policyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1Image = (output, context) => {
    return {
        imageId: output.imageId !== undefined && output.imageId !== null
            ? deserializeAws_json1_1ImageIdentifier(output.imageId, context)
            : undefined,
        imageManifest: smithy_client_1.expectString(output.imageManifest),
        imageManifestMediaType: smithy_client_1.expectString(output.imageManifestMediaType),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1ImageAlreadyExistsException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ImageDetail = (output, context) => {
    return {
        artifactMediaType: smithy_client_1.expectString(output.artifactMediaType),
        imageDigest: smithy_client_1.expectString(output.imageDigest),
        imageManifestMediaType: smithy_client_1.expectString(output.imageManifestMediaType),
        imagePushedAt: output.imagePushedAt !== undefined && output.imagePushedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.imagePushedAt)))
            : undefined,
        imageScanFindingsSummary: output.imageScanFindingsSummary !== undefined && output.imageScanFindingsSummary !== null
            ? deserializeAws_json1_1ImageScanFindingsSummary(output.imageScanFindingsSummary, context)
            : undefined,
        imageScanStatus: output.imageScanStatus !== undefined && output.imageScanStatus !== null
            ? deserializeAws_json1_1ImageScanStatus(output.imageScanStatus, context)
            : undefined,
        imageSizeInBytes: smithy_client_1.expectLong(output.imageSizeInBytes),
        imageTags: output.imageTags !== undefined && output.imageTags !== null
            ? deserializeAws_json1_1ImageTagList(output.imageTags, context)
            : undefined,
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1ImageDetailList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ImageDetail(entry, context);
    });
};
const deserializeAws_json1_1ImageDigestDoesNotMatchException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ImageFailure = (output, context) => {
    return {
        failureCode: smithy_client_1.expectString(output.failureCode),
        failureReason: smithy_client_1.expectString(output.failureReason),
        imageId: output.imageId !== undefined && output.imageId !== null
            ? deserializeAws_json1_1ImageIdentifier(output.imageId, context)
            : undefined,
    };
};
const deserializeAws_json1_1ImageFailureList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ImageFailure(entry, context);
    });
};
const deserializeAws_json1_1ImageIdentifier = (output, context) => {
    return {
        imageDigest: smithy_client_1.expectString(output.imageDigest),
        imageTag: smithy_client_1.expectString(output.imageTag),
    };
};
const deserializeAws_json1_1ImageIdentifierList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ImageIdentifier(entry, context);
    });
};
const deserializeAws_json1_1ImageList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1Image(entry, context);
    });
};
const deserializeAws_json1_1ImageNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ImageReplicationStatus = (output, context) => {
    return {
        failureCode: smithy_client_1.expectString(output.failureCode),
        region: smithy_client_1.expectString(output.region),
        registryId: smithy_client_1.expectString(output.registryId),
        status: smithy_client_1.expectString(output.status),
    };
};
const deserializeAws_json1_1ImageReplicationStatusList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ImageReplicationStatus(entry, context);
    });
};
const deserializeAws_json1_1ImageScanFinding = (output, context) => {
    return {
        attributes: output.attributes !== undefined && output.attributes !== null
            ? deserializeAws_json1_1AttributeList(output.attributes, context)
            : undefined,
        description: smithy_client_1.expectString(output.description),
        name: smithy_client_1.expectString(output.name),
        severity: smithy_client_1.expectString(output.severity),
        uri: smithy_client_1.expectString(output.uri),
    };
};
const deserializeAws_json1_1ImageScanFindingList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ImageScanFinding(entry, context);
    });
};
const deserializeAws_json1_1ImageScanFindings = (output, context) => {
    return {
        findingSeverityCounts: output.findingSeverityCounts !== undefined && output.findingSeverityCounts !== null
            ? deserializeAws_json1_1FindingSeverityCounts(output.findingSeverityCounts, context)
            : undefined,
        findings: output.findings !== undefined && output.findings !== null
            ? deserializeAws_json1_1ImageScanFindingList(output.findings, context)
            : undefined,
        imageScanCompletedAt: output.imageScanCompletedAt !== undefined && output.imageScanCompletedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.imageScanCompletedAt)))
            : undefined,
        vulnerabilitySourceUpdatedAt: output.vulnerabilitySourceUpdatedAt !== undefined && output.vulnerabilitySourceUpdatedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.vulnerabilitySourceUpdatedAt)))
            : undefined,
    };
};
const deserializeAws_json1_1ImageScanFindingsSummary = (output, context) => {
    return {
        findingSeverityCounts: output.findingSeverityCounts !== undefined && output.findingSeverityCounts !== null
            ? deserializeAws_json1_1FindingSeverityCounts(output.findingSeverityCounts, context)
            : undefined,
        imageScanCompletedAt: output.imageScanCompletedAt !== undefined && output.imageScanCompletedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.imageScanCompletedAt)))
            : undefined,
        vulnerabilitySourceUpdatedAt: output.vulnerabilitySourceUpdatedAt !== undefined && output.vulnerabilitySourceUpdatedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.vulnerabilitySourceUpdatedAt)))
            : undefined,
    };
};
const deserializeAws_json1_1ImageScanningConfiguration = (output, context) => {
    return {
        scanOnPush: smithy_client_1.expectBoolean(output.scanOnPush),
    };
};
const deserializeAws_json1_1ImageScanStatus = (output, context) => {
    return {
        description: smithy_client_1.expectString(output.description),
        status: smithy_client_1.expectString(output.status),
    };
};
const deserializeAws_json1_1ImageTagAlreadyExistsException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ImageTagList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return smithy_client_1.expectString(entry);
    });
};
const deserializeAws_json1_1InitiateLayerUploadResponse = (output, context) => {
    return {
        partSize: smithy_client_1.expectLong(output.partSize),
        uploadId: smithy_client_1.expectString(output.uploadId),
    };
};
const deserializeAws_json1_1InvalidLayerException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1InvalidLayerPartException = (output, context) => {
    return {
        lastValidByteReceived: smithy_client_1.expectLong(output.lastValidByteReceived),
        message: smithy_client_1.expectString(output.message),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
        uploadId: smithy_client_1.expectString(output.uploadId),
    };
};
const deserializeAws_json1_1InvalidParameterException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1InvalidTagParameterException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1KmsException = (output, context) => {
    return {
        kmsError: smithy_client_1.expectString(output.kmsError),
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1Layer = (output, context) => {
    return {
        layerAvailability: smithy_client_1.expectString(output.layerAvailability),
        layerDigest: smithy_client_1.expectString(output.layerDigest),
        layerSize: smithy_client_1.expectLong(output.layerSize),
        mediaType: smithy_client_1.expectString(output.mediaType),
    };
};
const deserializeAws_json1_1LayerAlreadyExistsException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LayerFailure = (output, context) => {
    return {
        failureCode: smithy_client_1.expectString(output.failureCode),
        failureReason: smithy_client_1.expectString(output.failureReason),
        layerDigest: smithy_client_1.expectString(output.layerDigest),
    };
};
const deserializeAws_json1_1LayerFailureList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1LayerFailure(entry, context);
    });
};
const deserializeAws_json1_1LayerInaccessibleException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LayerList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1Layer(entry, context);
    });
};
const deserializeAws_json1_1LayerPartTooSmallException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LayersNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LifecyclePolicyNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LifecyclePolicyPreviewInProgressException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LifecyclePolicyPreviewNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1LifecyclePolicyPreviewResult = (output, context) => {
    return {
        action: output.action !== undefined && output.action !== null
            ? deserializeAws_json1_1LifecyclePolicyRuleAction(output.action, context)
            : undefined,
        appliedRulePriority: smithy_client_1.expectInt32(output.appliedRulePriority),
        imageDigest: smithy_client_1.expectString(output.imageDigest),
        imagePushedAt: output.imagePushedAt !== undefined && output.imagePushedAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.imagePushedAt)))
            : undefined,
        imageTags: output.imageTags !== undefined && output.imageTags !== null
            ? deserializeAws_json1_1ImageTagList(output.imageTags, context)
            : undefined,
    };
};
const deserializeAws_json1_1LifecyclePolicyPreviewResultList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1LifecyclePolicyPreviewResult(entry, context);
    });
};
const deserializeAws_json1_1LifecyclePolicyPreviewSummary = (output, context) => {
    return {
        expiringImageTotalCount: smithy_client_1.expectInt32(output.expiringImageTotalCount),
    };
};
const deserializeAws_json1_1LifecyclePolicyRuleAction = (output, context) => {
    return {
        type: smithy_client_1.expectString(output.type),
    };
};
const deserializeAws_json1_1LimitExceededException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ListImagesResponse = (output, context) => {
    return {
        imageIds: output.imageIds !== undefined && output.imageIds !== null
            ? deserializeAws_json1_1ImageIdentifierList(output.imageIds, context)
            : undefined,
        nextToken: smithy_client_1.expectString(output.nextToken),
    };
};
const deserializeAws_json1_1ListTagsForResourceResponse = (output, context) => {
    return {
        tags: output.tags !== undefined && output.tags !== null
            ? deserializeAws_json1_1TagList(output.tags, context)
            : undefined,
    };
};
const deserializeAws_json1_1PutImageResponse = (output, context) => {
    return {
        image: output.image !== undefined && output.image !== null
            ? deserializeAws_json1_1Image(output.image, context)
            : undefined,
    };
};
const deserializeAws_json1_1PutImageScanningConfigurationResponse = (output, context) => {
    return {
        imageScanningConfiguration: output.imageScanningConfiguration !== undefined && output.imageScanningConfiguration !== null
            ? deserializeAws_json1_1ImageScanningConfiguration(output.imageScanningConfiguration, context)
            : undefined,
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1PutImageTagMutabilityResponse = (output, context) => {
    return {
        imageTagMutability: smithy_client_1.expectString(output.imageTagMutability),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1PutLifecyclePolicyResponse = (output, context) => {
    return {
        lifecyclePolicyText: smithy_client_1.expectString(output.lifecyclePolicyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1PutRegistryPolicyResponse = (output, context) => {
    return {
        policyText: smithy_client_1.expectString(output.policyText),
        registryId: smithy_client_1.expectString(output.registryId),
    };
};
const deserializeAws_json1_1PutReplicationConfigurationResponse = (output, context) => {
    return {
        replicationConfiguration: output.replicationConfiguration !== undefined && output.replicationConfiguration !== null
            ? deserializeAws_json1_1ReplicationConfiguration(output.replicationConfiguration, context)
            : undefined,
    };
};
const deserializeAws_json1_1ReferencedImagesNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1RegistryPolicyNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ReplicationConfiguration = (output, context) => {
    return {
        rules: output.rules !== undefined && output.rules !== null
            ? deserializeAws_json1_1ReplicationRuleList(output.rules, context)
            : undefined,
    };
};
const deserializeAws_json1_1ReplicationDestination = (output, context) => {
    return {
        region: smithy_client_1.expectString(output.region),
        registryId: smithy_client_1.expectString(output.registryId),
    };
};
const deserializeAws_json1_1ReplicationDestinationList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ReplicationDestination(entry, context);
    });
};
const deserializeAws_json1_1ReplicationRule = (output, context) => {
    return {
        destinations: output.destinations !== undefined && output.destinations !== null
            ? deserializeAws_json1_1ReplicationDestinationList(output.destinations, context)
            : undefined,
        repositoryFilters: output.repositoryFilters !== undefined && output.repositoryFilters !== null
            ? deserializeAws_json1_1RepositoryFilterList(output.repositoryFilters, context)
            : undefined,
    };
};
const deserializeAws_json1_1ReplicationRuleList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1ReplicationRule(entry, context);
    });
};
const deserializeAws_json1_1Repository = (output, context) => {
    return {
        createdAt: output.createdAt !== undefined && output.createdAt !== null
            ? smithy_client_1.expectNonNull(smithy_client_1.parseEpochTimestamp(smithy_client_1.expectNumber(output.createdAt)))
            : undefined,
        encryptionConfiguration: output.encryptionConfiguration !== undefined && output.encryptionConfiguration !== null
            ? deserializeAws_json1_1EncryptionConfiguration(output.encryptionConfiguration, context)
            : undefined,
        imageScanningConfiguration: output.imageScanningConfiguration !== undefined && output.imageScanningConfiguration !== null
            ? deserializeAws_json1_1ImageScanningConfiguration(output.imageScanningConfiguration, context)
            : undefined,
        imageTagMutability: smithy_client_1.expectString(output.imageTagMutability),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryArn: smithy_client_1.expectString(output.repositoryArn),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
        repositoryUri: smithy_client_1.expectString(output.repositoryUri),
    };
};
const deserializeAws_json1_1RepositoryAlreadyExistsException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1RepositoryFilter = (output, context) => {
    return {
        filter: smithy_client_1.expectString(output.filter),
        filterType: smithy_client_1.expectString(output.filterType),
    };
};
const deserializeAws_json1_1RepositoryFilterList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1RepositoryFilter(entry, context);
    });
};
const deserializeAws_json1_1RepositoryList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1Repository(entry, context);
    });
};
const deserializeAws_json1_1RepositoryNotEmptyException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1RepositoryNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1RepositoryPolicyNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ScanNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ServerException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1SetRepositoryPolicyResponse = (output, context) => {
    return {
        policyText: smithy_client_1.expectString(output.policyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1StartImageScanResponse = (output, context) => {
    return {
        imageId: output.imageId !== undefined && output.imageId !== null
            ? deserializeAws_json1_1ImageIdentifier(output.imageId, context)
            : undefined,
        imageScanStatus: output.imageScanStatus !== undefined && output.imageScanStatus !== null
            ? deserializeAws_json1_1ImageScanStatus(output.imageScanStatus, context)
            : undefined,
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
    };
};
const deserializeAws_json1_1StartLifecyclePolicyPreviewResponse = (output, context) => {
    return {
        lifecyclePolicyText: smithy_client_1.expectString(output.lifecyclePolicyText),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
        status: smithy_client_1.expectString(output.status),
    };
};
const deserializeAws_json1_1Tag = (output, context) => {
    return {
        Key: smithy_client_1.expectString(output.Key),
        Value: smithy_client_1.expectString(output.Value),
    };
};
const deserializeAws_json1_1TagList = (output, context) => {
    return (output || [])
        .filter((e) => e != null)
        .map((entry) => {
        if (entry === null) {
            return null;
        }
        return deserializeAws_json1_1Tag(entry, context);
    });
};
const deserializeAws_json1_1TagResourceResponse = (output, context) => {
    return {};
};
const deserializeAws_json1_1TooManyTagsException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1UnsupportedImageTypeException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1UntagResourceResponse = (output, context) => {
    return {};
};
const deserializeAws_json1_1UploadLayerPartResponse = (output, context) => {
    return {
        lastByteReceived: smithy_client_1.expectLong(output.lastByteReceived),
        registryId: smithy_client_1.expectString(output.registryId),
        repositoryName: smithy_client_1.expectString(output.repositoryName),
        uploadId: smithy_client_1.expectString(output.uploadId),
    };
};
const deserializeAws_json1_1UploadNotFoundException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeAws_json1_1ValidationException = (output, context) => {
    return {
        message: smithy_client_1.expectString(output.message),
    };
};
const deserializeMetadata = (output) => {
    var _a;
    return ({
        httpStatusCode: output.statusCode,
        requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"],
    });
};
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (resolvedHostname !== undefined) {
        contents.hostname = resolvedHostname;
    }
    if (body !== undefined) {
        contents.body = body;
    }
    return new protocol_http_1.HttpRequest(contents);
};
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        return JSON.parse(encoded);
    }
    return {};
});
const loadRestJsonErrorCode = (output, data) => {
    const findKey = (object, key) => Object.keys(object).find((k) => k.toLowerCase() === key.toLowerCase());
    const sanitizeErrorCode = (rawValue) => {
        let cleanValue = rawValue;
        if (cleanValue.indexOf(":") >= 0) {
            cleanValue = cleanValue.split(":")[0];
        }
        if (cleanValue.indexOf("#") >= 0) {
            cleanValue = cleanValue.split("#")[1];
        }
        return cleanValue;
    };
    const headerKey = findKey(output.headers, "x-amzn-errortype");
    if (headerKey !== undefined) {
        return sanitizeErrorCode(output.headers[headerKey]);
    }
    if (data.code !== undefined) {
        return sanitizeErrorCode(data.code);
    }
    if (data["__type"] !== undefined) {
        return sanitizeErrorCode(data["__type"]);
    }
    return "";
};


/***/ }),
/* 560 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromImdsCredentials = exports.isImdsCredentials = void 0;
const isImdsCredentials = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.AccessKeyId === "string" &&
    typeof arg.SecretAccessKey === "string" &&
    typeof arg.Token === "string" &&
    typeof arg.Expiration === "string";
exports.isImdsCredentials = isImdsCredentials;
const fromImdsCredentials = (creds) => ({
    accessKeyId: creds.AccessKeyId,
    secretAccessKey: creds.SecretAccessKey,
    sessionToken: creds.Token,
    expiration: new Date(creds.Expiration),
});
exports.fromImdsCredentials = fromImdsCredentials;


/***/ }),
/* 561 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TagResourceCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class TagResourceCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "TagResourceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.TagResourceRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.TagResourceResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1TagResourceCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1TagResourceCommand(output, context);
    }
}
exports.TagResourceCommand = TagResourceCommand;


/***/ }),
/* 562 */,
/* 563 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchGetImageCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class BatchGetImageCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "BatchGetImageCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.BatchGetImageRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.BatchGetImageResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1BatchGetImageCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1BatchGetImageCommand(output, context);
    }
}
exports.BatchGetImageCommand = BatchGetImageCommand;


/***/ }),
/* 564 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getSkewCorrectedDate = void 0;
const getSkewCorrectedDate = (systemClockOffset) => new Date(Date.now() + systemClockOffset);
exports.getSkewCorrectedDate = getSkewCorrectedDate;


/***/ }),
/* 565 */
/***/ (function(module) {

module.exports = require("http2");

/***/ }),
/* 566 */,
/* 567 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRegionInfoProvider = void 0;
const config_resolver_1 = __webpack_require__(529);
const regionHash = {
    "aws-global": {
        variants: [
            {
                hostname: "sts.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "us-east-1",
    },
    "us-east-1": {
        variants: [
            {
                hostname: "sts.us-east-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts-fips.us-east-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
    "us-east-2": {
        variants: [
            {
                hostname: "sts.us-east-2.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts-fips.us-east-2.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
    "us-gov-east-1": {
        variants: [
            {
                hostname: "sts.us-gov-east-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts.us-gov-east-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
    "us-gov-west-1": {
        variants: [
            {
                hostname: "sts.us-gov-west-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts.us-gov-west-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
    "us-west-1": {
        variants: [
            {
                hostname: "sts.us-west-1.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts-fips.us-west-1.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
    "us-west-2": {
        variants: [
            {
                hostname: "sts.us-west-2.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts-fips.us-west-2.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
};
const partitionHash = {
    aws: {
        regions: [
            "af-south-1",
            "ap-east-1",
            "ap-northeast-1",
            "ap-northeast-2",
            "ap-northeast-3",
            "ap-south-1",
            "ap-southeast-1",
            "ap-southeast-2",
            "aws-global",
            "ca-central-1",
            "eu-central-1",
            "eu-north-1",
            "eu-south-1",
            "eu-west-1",
            "eu-west-2",
            "eu-west-3",
            "me-south-1",
            "sa-east-1",
            "us-east-1",
            "us-east-1-fips",
            "us-east-2",
            "us-east-2-fips",
            "us-west-1",
            "us-west-1-fips",
            "us-west-2",
            "us-west-2-fips",
        ],
        regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "sts.{region}.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts-fips.{region}.amazonaws.com",
                tags: ["fips"],
            },
            {
                hostname: "sts-fips.{region}.api.aws",
                tags: ["dualstack", "fips"],
            },
            {
                hostname: "sts.{region}.api.aws",
                tags: ["dualstack"],
            },
        ],
    },
    "aws-cn": {
        regions: ["cn-north-1", "cn-northwest-1"],
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "sts.{region}.amazonaws.com.cn",
                tags: [],
            },
            {
                hostname: "sts-fips.{region}.amazonaws.com.cn",
                tags: ["fips"],
            },
            {
                hostname: "sts-fips.{region}.api.amazonwebservices.com.cn",
                tags: ["dualstack", "fips"],
            },
            {
                hostname: "sts.{region}.api.amazonwebservices.com.cn",
                tags: ["dualstack"],
            },
        ],
    },
    "aws-iso": {
        regions: ["us-iso-east-1", "us-iso-west-1"],
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "sts.{region}.c2s.ic.gov",
                tags: [],
            },
        ],
    },
    "aws-iso-b": {
        regions: ["us-isob-east-1"],
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "sts.{region}.sc2s.sgov.gov",
                tags: [],
            },
        ],
    },
    "aws-us-gov": {
        regions: ["us-gov-east-1", "us-gov-east-1-fips", "us-gov-west-1", "us-gov-west-1-fips"],
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "sts.{region}.amazonaws.com",
                tags: [],
            },
            {
                hostname: "sts.{region}.amazonaws.com",
                tags: ["fips"],
            },
        ],
    },
};
const defaultRegionInfoProvider = async (region, options) => config_resolver_1.getRegionInfo(region, {
    ...options,
    signingService: "sts",
    regionHash,
    partitionHash,
});
exports.defaultRegionInfoProvider = defaultRegionInfoProvider;


/***/ }),
/* 568 */,
/* 569 */,
/* 570 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.STSClient = void 0;
const config_resolver_1 = __webpack_require__(529);
const middleware_content_length_1 = __webpack_require__(988);
const middleware_host_header_1 = __webpack_require__(795);
const middleware_logger_1 = __webpack_require__(263);
const middleware_retry_1 = __webpack_require__(286);
const middleware_sdk_sts_1 = __webpack_require__(122);
const middleware_user_agent_1 = __webpack_require__(105);
const smithy_client_1 = __webpack_require__(973);
const runtimeConfig_1 = __webpack_require__(228);
class STSClient extends smithy_client_1.Client {
    constructor(configuration) {
        const _config_0 = runtimeConfig_1.getRuntimeConfig(configuration);
        const _config_1 = config_resolver_1.resolveRegionConfig(_config_0);
        const _config_2 = config_resolver_1.resolveEndpointsConfig(_config_1);
        const _config_3 = middleware_retry_1.resolveRetryConfig(_config_2);
        const _config_4 = middleware_host_header_1.resolveHostHeaderConfig(_config_3);
        const _config_5 = middleware_sdk_sts_1.resolveStsAuthConfig(_config_4, { stsClientCtor: STSClient });
        const _config_6 = middleware_user_agent_1.resolveUserAgentConfig(_config_5);
        super(_config_6);
        this.config = _config_6;
        this.middlewareStack.use(middleware_retry_1.getRetryPlugin(this.config));
        this.middlewareStack.use(middleware_content_length_1.getContentLengthPlugin(this.config));
        this.middlewareStack.use(middleware_host_header_1.getHostHeaderPlugin(this.config));
        this.middlewareStack.use(middleware_logger_1.getLoggerPlugin(this.config));
        this.middlewareStack.use(middleware_user_agent_1.getUserAgentPlugin(this.config));
    }
    destroy() {
        super.destroy();
    }
}
exports.STSClient = STSClient;


/***/ }),
/* 571 */,
/* 572 */,
/* 573 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSessionTokenCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const middleware_signing_1 = __webpack_require__(307);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class GetSessionTokenCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetSessionTokenCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetSessionTokenRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetSessionTokenResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryGetSessionTokenCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryGetSessionTokenCommand(output, context);
    }
}
exports.GetSessionTokenCommand = GetSessionTokenCommand;


/***/ }),
/* 574 */,
/* 575 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(657), exports);
tslib_1.__exportStar(__webpack_require__(376), exports);


/***/ }),
/* 576 */,
/* 577 */,
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */,
/* 582 */,
/* 583 */,
/* 584 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolvedHostname = void 0;
const getResolvedHostname = (resolvedRegion, { regionHostname, partitionHostname }) => regionHostname
    ? regionHostname
    : partitionHostname
        ? partitionHostname.replace("{region}", resolvedRegion)
        : undefined;
exports.getResolvedHostname = getResolvedHostname;


/***/ }),
/* 585 */,
/* 586 */,
/* 587 */,
/* 588 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.retry = void 0;
const retry = (toRetry, maxRetries) => {
    let promise = toRetry();
    for (let i = 0; i < maxRetries; i++) {
        promise = promise.catch(toRetry);
    }
    return promise;
};
exports.retry = retry;


/***/ }),
/* 589 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.booleanSelector = exports.SelectorType = void 0;
var SelectorType;
(function (SelectorType) {
    SelectorType["ENV"] = "env";
    SelectorType["CONFIG"] = "shared config entry";
})(SelectorType = exports.SelectorType || (exports.SelectorType = {}));
const booleanSelector = (obj, key, type) => {
    if (!(key in obj))
        return undefined;
    if (obj[key] === "true")
        return true;
    if (obj[key] === "false")
        return false;
    throw new Error(`Cannot load ${type} "${key}". Expected "true" or "false", got ${obj[key]}.`);
};
exports.booleanSelector = booleanSelector;


/***/ }),
/* 590 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(110), exports);
tslib_1.__exportStar(__webpack_require__(408), exports);


/***/ }),
/* 591 */,
/* 592 */,
/* 593 */,
/* 594 */,
/* 595 */,
/* 596 */,
/* 597 */,
/* 598 */,
/* 599 */,
/* 600 */,
/* 601 */,
/* 602 */,
/* 603 */,
/* 604 */,
/* 605 */
/***/ (function(module) {

module.exports = require("http");

/***/ }),
/* 606 */,
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */,
/* 611 */,
/* 612 */,
/* 613 */,
/* 614 */
/***/ (function(module) {

module.exports = require("events");

/***/ }),
/* 615 */,
/* 616 */,
/* 617 */,
/* 618 */,
/* 619 */,
/* 620 */,
/* 621 */,
/* 622 */
/***/ (function(module) {

module.exports = require("path");

/***/ }),
/* 623 */,
/* 624 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.moveHeadersToQuery = void 0;
const cloneRequest_1 = __webpack_require__(57);
const moveHeadersToQuery = (request, options = {}) => {
    var _a;
    const { headers, query = {} } = typeof request.clone === "function" ? request.clone() : cloneRequest_1.cloneRequest(request);
    for (const name of Object.keys(headers)) {
        const lname = name.toLowerCase();
        if (lname.substr(0, 6) === "x-amz-" && !((_a = options.unhoistableHeaders) === null || _a === void 0 ? void 0 : _a.has(lname))) {
            query[name] = headers[name];
            delete headers[name];
        }
    }
    return {
        ...request,
        headers,
        query,
    };
};
exports.moveHeadersToQuery = moveHeadersToQuery;


/***/ }),
/* 625 */,
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFederationTokenCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const middleware_signing_1 = __webpack_require__(307);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class GetFederationTokenCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        this.middlewareStack.use(middleware_signing_1.getAwsAuthPlugin(configuration));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "GetFederationTokenCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetFederationTokenRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetFederationTokenResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryGetFederationTokenCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryGetFederationTokenCommand(output, context);
    }
}
exports.GetFederationTokenCommand = GetFederationTokenCommand;


/***/ }),
/* 630 */,
/* 631 */
/***/ (function(module) {

module.exports = require("net");

/***/ }),
/* 632 */,
/* 633 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.emitWarningIfUnsupportedVersion = void 0;
let warningEmitted = false;
const emitWarningIfUnsupportedVersion = (version) => {
    if (version && !warningEmitted && parseInt(version.substring(1, version.indexOf("."))) < 12) {
        warningEmitted = true;
        process.emitWarning(`The AWS SDK for JavaScript (v3) will\n` +
            `no longer support Node.js ${version} as of January 1, 2022.\n` +
            `To continue receiving updates to AWS services, bug fixes, and security\n` +
            `updates please upgrade to Node.js 12.x or later.\n\n` +
            `More information can be found at: https://a.co/1l6FLnu`, `NodeDeprecationWarning`);
    }
};
exports.emitWarningIfUnsupportedVersion = emitWarningIfUnsupportedVersion;


/***/ }),
/* 634 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const middleware_stack_1 = __webpack_require__(349);
class Client {
    constructor(config) {
        this.middlewareStack = middleware_stack_1.constructStack();
        this.config = config;
    }
    send(command, optionsOrCb, cb) {
        const options = typeof optionsOrCb !== "function" ? optionsOrCb : undefined;
        const callback = typeof optionsOrCb === "function" ? optionsOrCb : cb;
        const handler = command.resolveMiddleware(this.middlewareStack, this.config, options);
        if (callback) {
            handler(command)
                .then((result) => callback(null, result.output), (err) => callback(err))
                .catch(() => { });
        }
        else {
            return handler(command).then((result) => result.output);
        }
    }
    destroy() {
        if (this.config.requestHandler.destroy)
            this.config.requestHandler.destroy();
    }
}
exports.Client = Client;


/***/ }),
/* 635 */,
/* 636 */,
/* 637 */,
/* 638 */,
/* 639 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UntagResourceCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class UntagResourceCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "UntagResourceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.UntagResourceRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.UntagResourceResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1UntagResourceCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1UntagResourceCommand(output, context);
    }
}
exports.UntagResourceCommand = UntagResourceCommand;


/***/ }),
/* 640 */,
/* 641 */,
/* 642 */,
/* 643 */,
/* 644 */,
/* 645 */,
/* 646 */,
/* 647 */,
/* 648 */,
/* 649 */,
/* 650 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AssumeRoleWithWebIdentityCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(37);
const Aws_query_1 = __webpack_require__(963);
class AssumeRoleWithWebIdentityCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "STSClient";
        const commandName = "AssumeRoleWithWebIdentityCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.AssumeRoleWithWebIdentityRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.AssumeRoleWithWebIdentityResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_query_1.serializeAws_queryAssumeRoleWithWebIdentityCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_query_1.deserializeAws_queryAssumeRoleWithWebIdentityCommand(output, context);
    }
}
exports.AssumeRoleWithWebIdentityCommand = AssumeRoleWithWebIdentityCommand;


/***/ }),
/* 651 */,
/* 652 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ListImagesCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class ListImagesCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "ListImagesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.ListImagesRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.ListImagesResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1ListImagesCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1ListImagesCommand(output, context);
    }
}
exports.ListImagesCommand = ListImagesCommand;


/***/ }),
/* 653 */,
/* 654 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadLayerPartCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class UploadLayerPartCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "UploadLayerPartCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.UploadLayerPartRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.UploadLayerPartResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1UploadLayerPartCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1UploadLayerPartCommand(output, context);
    }
}
exports.UploadLayerPartCommand = UploadLayerPartCommand;


/***/ }),
/* 655 */,
/* 656 */,
/* 657 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_REGION_CONFIG_FILE_OPTIONS = exports.NODE_REGION_CONFIG_OPTIONS = exports.REGION_INI_NAME = exports.REGION_ENV_NAME = void 0;
exports.REGION_ENV_NAME = "AWS_REGION";
exports.REGION_INI_NAME = "region";
exports.NODE_REGION_CONFIG_OPTIONS = {
    environmentVariableSelector: (env) => env[exports.REGION_ENV_NAME],
    configFileSelector: (profile) => profile[exports.REGION_INI_NAME],
    default: () => {
        throw new Error("Region is missing");
    },
};
exports.NODE_REGION_CONFIG_FILE_OPTIONS = {
    preferredFile: "credentials",
};


/***/ }),
/* 658 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDownloadUrlForLayerCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class GetDownloadUrlForLayerCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "GetDownloadUrlForLayerCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetDownloadUrlForLayerRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetDownloadUrlForLayerResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1GetDownloadUrlForLayerCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1GetDownloadUrlForLayerCommand(output, context);
    }
}
exports.GetDownloadUrlForLayerCommand = GetDownloadUrlForLayerCommand;


/***/ }),
/* 659 */,
/* 660 */,
/* 661 */,
/* 662 */,
/* 663 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidHostname = void 0;
function isValidHostname(hostname) {
    const hostPattern = /^[a-z0-9][a-z0-9\.\-]*[a-z0-9]$/;
    return hostPattern.test(hostname);
}
exports.isValidHostname = isValidHostname;


/***/ }),
/* 664 */,
/* 665 */,
/* 666 */,
/* 667 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWaiterOptions = void 0;
const validateWaiterOptions = (options) => {
    if (options.maxWaitTime < 1) {
        throw new Error(`WaiterConfiguration.maxWaitTime must be greater than 0`);
    }
    else if (options.minDelay < 1) {
        throw new Error(`WaiterConfiguration.minDelay must be greater than 0`);
    }
    else if (options.maxDelay < 1) {
        throw new Error(`WaiterConfiguration.maxDelay must be greater than 0`);
    }
    else if (options.maxWaitTime <= options.minDelay) {
        throw new Error(`WaiterConfiguration.maxWaitTime [${options.maxWaitTime}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
    }
    else if (options.maxDelay < options.minDelay) {
        throw new Error(`WaiterConfiguration.maxDelay [${options.maxDelay}] must be greater than WaiterConfiguration.minDelay [${options.minDelay}] for this waiter`);
    }
};
exports.validateWaiterOptions = validateWaiterOptions;


/***/ }),
/* 668 */,
/* 669 */
/***/ (function(module) {

module.exports = require("util");

/***/ }),
/* 670 */,
/* 671 */,
/* 672 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCmdPath = exports.tryGetExecutablePath = exports.isRooted = exports.isDirectory = exports.exists = exports.IS_WINDOWS = exports.unlink = exports.symlink = exports.stat = exports.rmdir = exports.rename = exports.readlink = exports.readdir = exports.mkdir = exports.lstat = exports.copyFile = exports.chmod = void 0;
const fs = __importStar(__webpack_require__(747));
const path = __importStar(__webpack_require__(622));
_a = fs.promises, exports.chmod = _a.chmod, exports.copyFile = _a.copyFile, exports.lstat = _a.lstat, exports.mkdir = _a.mkdir, exports.readdir = _a.readdir, exports.readlink = _a.readlink, exports.rename = _a.rename, exports.rmdir = _a.rmdir, exports.stat = _a.stat, exports.symlink = _a.symlink, exports.unlink = _a.unlink;
exports.IS_WINDOWS = process.platform === 'win32';
function exists(fsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield exports.stat(fsPath);
        }
        catch (err) {
            if (err.code === 'ENOENT') {
                return false;
            }
            throw err;
        }
        return true;
    });
}
exports.exists = exists;
function isDirectory(fsPath, useStat = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = useStat ? yield exports.stat(fsPath) : yield exports.lstat(fsPath);
        return stats.isDirectory();
    });
}
exports.isDirectory = isDirectory;
/**
 * On OSX/Linux, true if path starts with '/'. On Windows, true for paths like:
 * \, \hello, \\hello\share, C:, and C:\hello (and corresponding alternate separator cases).
 */
function isRooted(p) {
    p = normalizeSeparators(p);
    if (!p) {
        throw new Error('isRooted() parameter "p" cannot be empty');
    }
    if (exports.IS_WINDOWS) {
        return (p.startsWith('\\') || /^[A-Z]:/i.test(p) // e.g. \ or \hello or \\hello
        ); // e.g. C: or C:\hello
    }
    return p.startsWith('/');
}
exports.isRooted = isRooted;
/**
 * Best effort attempt to determine whether a file exists and is executable.
 * @param filePath    file path to check
 * @param extensions  additional file extensions to try
 * @return if file exists and is executable, returns the file path. otherwise empty string.
 */
function tryGetExecutablePath(filePath, extensions) {
    return __awaiter(this, void 0, void 0, function* () {
        let stats = undefined;
        try {
            // test file exists
            stats = yield exports.stat(filePath);
        }
        catch (err) {
            if (err.code !== 'ENOENT') {
                // eslint-disable-next-line no-console
                console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
            }
        }
        if (stats && stats.isFile()) {
            if (exports.IS_WINDOWS) {
                // on Windows, test for valid extension
                const upperExt = path.extname(filePath).toUpperCase();
                if (extensions.some(validExt => validExt.toUpperCase() === upperExt)) {
                    return filePath;
                }
            }
            else {
                if (isUnixExecutable(stats)) {
                    return filePath;
                }
            }
        }
        // try each extension
        const originalFilePath = filePath;
        for (const extension of extensions) {
            filePath = originalFilePath + extension;
            stats = undefined;
            try {
                stats = yield exports.stat(filePath);
            }
            catch (err) {
                if (err.code !== 'ENOENT') {
                    // eslint-disable-next-line no-console
                    console.log(`Unexpected error attempting to determine if executable file exists '${filePath}': ${err}`);
                }
            }
            if (stats && stats.isFile()) {
                if (exports.IS_WINDOWS) {
                    // preserve the case of the actual file (since an extension was appended)
                    try {
                        const directory = path.dirname(filePath);
                        const upperName = path.basename(filePath).toUpperCase();
                        for (const actualName of yield exports.readdir(directory)) {
                            if (upperName === actualName.toUpperCase()) {
                                filePath = path.join(directory, actualName);
                                break;
                            }
                        }
                    }
                    catch (err) {
                        // eslint-disable-next-line no-console
                        console.log(`Unexpected error attempting to determine the actual case of the file '${filePath}': ${err}`);
                    }
                    return filePath;
                }
                else {
                    if (isUnixExecutable(stats)) {
                        return filePath;
                    }
                }
            }
        }
        return '';
    });
}
exports.tryGetExecutablePath = tryGetExecutablePath;
function normalizeSeparators(p) {
    p = p || '';
    if (exports.IS_WINDOWS) {
        // convert slashes on Windows
        p = p.replace(/\//g, '\\');
        // remove redundant slashes
        return p.replace(/\\\\+/g, '\\');
    }
    // remove redundant slashes
    return p.replace(/\/\/+/g, '/');
}
// on Mac/Linux, test the execute bit
//     R   W  X  R  W X R W X
//   256 128 64 32 16 8 4 2 1
function isUnixExecutable(stats) {
    return ((stats.mode & 1) > 0 ||
        ((stats.mode & 8) > 0 && stats.gid === process.getgid()) ||
        ((stats.mode & 64) > 0 && stats.uid === process.getuid()));
}
// Get the path of cmd.exe in windows
function getCmdPath() {
    var _a;
    return (_a = process.env['COMSPEC']) !== null && _a !== void 0 ? _a : `cmd.exe`;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=io-util.js.map

/***/ }),
/* 673 */,
/* 674 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ListTagsForResourceCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class ListTagsForResourceCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "ListTagsForResourceCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.ListTagsForResourceRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.ListTagsForResourceResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1ListTagsForResourceCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1ListTagsForResourceCommand(output, context);
    }
}
exports.ListTagsForResourceCommand = ListTagsForResourceCommand;


/***/ }),
/* 675 */,
/* 676 */,
/* 677 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeConfig = void 0;
const tslib_1 = __webpack_require__(422);
const package_json_1 = tslib_1.__importDefault(__webpack_require__(144));
const client_sts_1 = __webpack_require__(840);
const config_resolver_1 = __webpack_require__(529);
const credential_provider_node_1 = __webpack_require__(125);
const hash_node_1 = __webpack_require__(145);
const middleware_retry_1 = __webpack_require__(286);
const node_config_provider_1 = __webpack_require__(519);
const node_http_handler_1 = __webpack_require__(953);
const util_base64_node_1 = __webpack_require__(203);
const util_body_length_node_1 = __webpack_require__(555);
const util_user_agent_node_1 = __webpack_require__(96);
const util_utf8_node_1 = __webpack_require__(841);
const runtimeConfig_shared_1 = __webpack_require__(13);
const smithy_client_1 = __webpack_require__(973);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    smithy_client_1.emitWarningIfUnsupportedVersion(process.version);
    const clientSharedValues = runtimeConfig_shared_1.getRuntimeConfig(config);
    return {
        ...clientSharedValues,
        ...config,
        runtime: "node",
        base64Decoder: (_a = config === null || config === void 0 ? void 0 : config.base64Decoder) !== null && _a !== void 0 ? _a : util_base64_node_1.fromBase64,
        base64Encoder: (_b = config === null || config === void 0 ? void 0 : config.base64Encoder) !== null && _b !== void 0 ? _b : util_base64_node_1.toBase64,
        bodyLengthChecker: (_c = config === null || config === void 0 ? void 0 : config.bodyLengthChecker) !== null && _c !== void 0 ? _c : util_body_length_node_1.calculateBodyLength,
        credentialDefaultProvider: (_d = config === null || config === void 0 ? void 0 : config.credentialDefaultProvider) !== null && _d !== void 0 ? _d : client_sts_1.decorateDefaultCredentialProvider(credential_provider_node_1.defaultProvider),
        defaultUserAgentProvider: (_e = config === null || config === void 0 ? void 0 : config.defaultUserAgentProvider) !== null && _e !== void 0 ? _e : util_user_agent_node_1.defaultUserAgent({ serviceId: clientSharedValues.serviceId, clientVersion: package_json_1.default.version }),
        maxAttempts: (_f = config === null || config === void 0 ? void 0 : config.maxAttempts) !== null && _f !== void 0 ? _f : node_config_provider_1.loadConfig(middleware_retry_1.NODE_MAX_ATTEMPT_CONFIG_OPTIONS),
        region: (_g = config === null || config === void 0 ? void 0 : config.region) !== null && _g !== void 0 ? _g : node_config_provider_1.loadConfig(config_resolver_1.NODE_REGION_CONFIG_OPTIONS, config_resolver_1.NODE_REGION_CONFIG_FILE_OPTIONS),
        requestHandler: (_h = config === null || config === void 0 ? void 0 : config.requestHandler) !== null && _h !== void 0 ? _h : new node_http_handler_1.NodeHttpHandler(),
        retryMode: (_j = config === null || config === void 0 ? void 0 : config.retryMode) !== null && _j !== void 0 ? _j : node_config_provider_1.loadConfig(middleware_retry_1.NODE_RETRY_MODE_CONFIG_OPTIONS),
        sha256: (_k = config === null || config === void 0 ? void 0 : config.sha256) !== null && _k !== void 0 ? _k : hash_node_1.Hash.bind(null, "sha256"),
        streamCollector: (_l = config === null || config === void 0 ? void 0 : config.streamCollector) !== null && _l !== void 0 ? _l : node_http_handler_1.streamCollector,
        useDualstackEndpoint: (_m = config === null || config === void 0 ? void 0 : config.useDualstackEndpoint) !== null && _m !== void 0 ? _m : node_config_provider_1.loadConfig(config_resolver_1.NODE_USE_DUALSTACK_ENDPOINT_CONFIG_OPTIONS),
        useFipsEndpoint: (_o = config === null || config === void 0 ? void 0 : config.useFipsEndpoint) !== null && _o !== void 0 ? _o : node_config_provider_1.loadConfig(config_resolver_1.NODE_USE_FIPS_ENDPOINT_CONFIG_OPTIONS),
        utf8Decoder: (_p = config === null || config === void 0 ? void 0 : config.utf8Decoder) !== null && _p !== void 0 ? _p : util_utf8_node_1.fromUtf8,
        utf8Encoder: (_q = config === null || config === void 0 ? void 0 : config.utf8Encoder) !== null && _q !== void 0 ? _q : util_utf8_node_1.toUtf8,
    };
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),
/* 678 */,
/* 679 */,
/* 680 */,
/* 681 */,
/* 682 */,
/* 683 */,
/* 684 */,
/* 685 */,
/* 686 */,
/* 687 */,
/* 688 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SSO = void 0;
const GetRoleCredentialsCommand_1 = __webpack_require__(879);
const ListAccountRolesCommand_1 = __webpack_require__(790);
const ListAccountsCommand_1 = __webpack_require__(245);
const LogoutCommand_1 = __webpack_require__(556);
const SSOClient_1 = __webpack_require__(17);
class SSO extends SSOClient_1.SSOClient {
    getRoleCredentials(args, optionsOrCb, cb) {
        const command = new GetRoleCredentialsCommand_1.GetRoleCredentialsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listAccountRoles(args, optionsOrCb, cb) {
        const command = new ListAccountRolesCommand_1.ListAccountRolesCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    listAccounts(args, optionsOrCb, cb) {
        const command = new ListAccountsCommand_1.ListAccountsCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    logout(args, optionsOrCb, cb) {
        const command = new LogoutCommand_1.LogoutCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.SSO = SSO;


/***/ }),
/* 689 */,
/* 690 */,
/* 691 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getOmitRetryHeadersPlugin = exports.omitRetryHeadersMiddlewareOptions = exports.omitRetryHeadersMiddleware = void 0;
const protocol_http_1 = __webpack_require__(504);
const constants_1 = __webpack_require__(373);
const omitRetryHeadersMiddleware = () => (next) => async (args) => {
    const { request } = args;
    if (protocol_http_1.HttpRequest.isInstance(request)) {
        delete request.headers[constants_1.INVOCATION_ID_HEADER];
        delete request.headers[constants_1.REQUEST_HEADER];
    }
    return next(args);
};
exports.omitRetryHeadersMiddleware = omitRetryHeadersMiddleware;
exports.omitRetryHeadersMiddlewareOptions = {
    name: "omitRetryHeadersMiddleware",
    tags: ["RETRY", "HEADERS", "OMIT_RETRY_HEADERS"],
    relation: "before",
    toMiddleware: "awsAuthMiddleware",
    override: true,
};
const getOmitRetryHeadersPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.addRelativeTo(exports.omitRetryHeadersMiddleware(), exports.omitRetryHeadersMiddlewareOptions);
    },
});
exports.getOmitRetryHeadersPlugin = getOmitRetryHeadersPlugin;


/***/ }),
/* 692 */,
/* 693 */,
/* 694 */,
/* 695 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _validate = _interopRequireDefault(__webpack_require__(78));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports.default = _default;

/***/ }),
/* 696 */,
/* 697 */,
/* 698 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCredentialCache = exports.getSigningKey = exports.createScope = void 0;
const util_hex_encoding_1 = __webpack_require__(754);
const constants_1 = __webpack_require__(84);
const signingKeyCache = {};
const cacheQueue = [];
const createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${constants_1.KEY_TYPE_IDENTIFIER}`;
exports.createScope = createScope;
const getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
    const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
    const cacheKey = `${shortDate}:${region}:${service}:${util_hex_encoding_1.toHex(credsHash)}:${credentials.sessionToken}`;
    if (cacheKey in signingKeyCache) {
        return signingKeyCache[cacheKey];
    }
    cacheQueue.push(cacheKey);
    while (cacheQueue.length > constants_1.MAX_CACHE_SIZE) {
        delete signingKeyCache[cacheQueue.shift()];
    }
    let key = `AWS4${credentials.secretAccessKey}`;
    for (const signable of [shortDate, region, service, constants_1.KEY_TYPE_IDENTIFIER]) {
        key = await hmac(sha256Constructor, key, signable);
    }
    return (signingKeyCache[cacheKey] = key);
};
exports.getSigningKey = getSigningKey;
const clearCredentialCache = () => {
    cacheQueue.length = 0;
    Object.keys(signingKeyCache).forEach((cacheKey) => {
        delete signingKeyCache[cacheKey];
    });
};
exports.clearCredentialCache = clearCredentialCache;
const hmac = (ctor, secret, data) => {
    const hash = new ctor(secret);
    hash.update(data);
    return hash.digest();
};


/***/ }),
/* 699 */,
/* 700 */,
/* 701 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RETRY_MODE = exports.DEFAULT_MAX_ATTEMPTS = exports.RETRY_MODES = void 0;
var RETRY_MODES;
(function (RETRY_MODES) {
    RETRY_MODES["STANDARD"] = "standard";
    RETRY_MODES["ADAPTIVE"] = "adaptive";
})(RETRY_MODES = exports.RETRY_MODES || (exports.RETRY_MODES = {}));
exports.DEFAULT_MAX_ATTEMPTS = 3;
exports.DEFAULT_RETRY_MODE = RETRY_MODES.STANDARD;


/***/ }),
/* 702 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NODEJS_TIMEOUT_ERROR_CODES = void 0;
exports.NODEJS_TIMEOUT_ERROR_CODES = ["ECONNRESET", "EPIPE", "ETIMEDOUT"];


/***/ }),
/* 703 */,
/* 704 */,
/* 705 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.serializerMiddleware = void 0;
const serializerMiddleware = (options, serializer) => (next, context) => async (args) => {
    const request = await serializer(args.input, options);
    return next({
        ...args,
        request,
    });
};
exports.serializerMiddleware = serializerMiddleware;


/***/ }),
/* 706 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAgentPlugin = exports.getUserAgentMiddlewareOptions = exports.userAgentMiddleware = void 0;
const protocol_http_1 = __webpack_require__(504);
const constants_1 = __webpack_require__(813);
const userAgentMiddleware = (options) => (next, context) => async (args) => {
    var _a, _b;
    const { request } = args;
    if (!protocol_http_1.HttpRequest.isInstance(request))
        return next(args);
    const { headers } = request;
    const userAgent = ((_a = context === null || context === void 0 ? void 0 : context.userAgent) === null || _a === void 0 ? void 0 : _a.map(escapeUserAgent)) || [];
    const defaultUserAgent = (await options.defaultUserAgentProvider()).map(escapeUserAgent);
    const customUserAgent = ((_b = options === null || options === void 0 ? void 0 : options.customUserAgent) === null || _b === void 0 ? void 0 : _b.map(escapeUserAgent)) || [];
    const sdkUserAgentValue = [...defaultUserAgent, ...userAgent, ...customUserAgent].join(constants_1.SPACE);
    const normalUAValue = [
        ...defaultUserAgent.filter((section) => section.startsWith("aws-sdk-")),
        ...customUserAgent,
    ].join(constants_1.SPACE);
    if (options.runtime !== "browser") {
        if (normalUAValue) {
            headers[constants_1.X_AMZ_USER_AGENT] = headers[constants_1.X_AMZ_USER_AGENT]
                ? `${headers[constants_1.USER_AGENT]} ${normalUAValue}`
                : normalUAValue;
        }
        headers[constants_1.USER_AGENT] = sdkUserAgentValue;
    }
    else {
        headers[constants_1.X_AMZ_USER_AGENT] = sdkUserAgentValue;
    }
    return next({
        ...args,
        request,
    });
};
exports.userAgentMiddleware = userAgentMiddleware;
const escapeUserAgent = ([name, version]) => {
    const prefixSeparatorIndex = name.indexOf("/");
    const prefix = name.substring(0, prefixSeparatorIndex);
    let uaName = name.substring(prefixSeparatorIndex + 1);
    if (prefix === "api") {
        uaName = uaName.toLowerCase();
    }
    return [prefix, uaName, version]
        .filter((item) => item && item.length > 0)
        .map((item) => item === null || item === void 0 ? void 0 : item.replace(constants_1.UA_ESCAPE_REGEX, "_"))
        .join("/");
};
exports.getUserAgentMiddlewareOptions = {
    name: "getUserAgentMiddleware",
    step: "build",
    priority: "low",
    tags: ["SET_USER_AGENT", "USER_AGENT"],
    override: true,
};
const getUserAgentPlugin = (config) => ({
    applyToStack: (clientStack) => {
        clientStack.add(exports.userAgentMiddleware(config), exports.getUserAgentMiddlewareOptions);
    },
});
exports.getUserAgentPlugin = getUserAgentPlugin;


/***/ }),
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getArrayIfSingleItem = void 0;
const getArrayIfSingleItem = (mayBeArray) => Array.isArray(mayBeArray) ? mayBeArray : [mayBeArray];
exports.getArrayIfSingleItem = getArrayIfSingleItem;


/***/ }),
/* 711 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateDescribeImageScanFindings = void 0;
const DescribeImageScanFindingsCommand_1 = __webpack_require__(981);
const ECR_1 = __webpack_require__(410);
const ECRClient_1 = __webpack_require__(429);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new DescribeImageScanFindingsCommand_1.DescribeImageScanFindingsCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.describeImageScanFindings(input, ...args);
};
async function* paginateDescribeImageScanFindings(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof ECR_1.ECR) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof ECRClient_1.ECRClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected ECR | ECRClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateDescribeImageScanFindings = paginateDescribeImageScanFindings;


/***/ }),
/* 712 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAuthorizationTokenCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class GetAuthorizationTokenCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "GetAuthorizationTokenCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetAuthorizationTokenRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetAuthorizationTokenResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1GetAuthorizationTokenCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1GetAuthorizationTokenCommand(output, context);
    }
}
exports.GetAuthorizationTokenCommand = GetAuthorizationTokenCommand;


/***/ }),
/* 713 */,
/* 714 */,
/* 715 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 716 */,
/* 717 */,
/* 718 */,
/* 719 */,
/* 720 */,
/* 721 */,
/* 722 */,
/* 723 */,
/* 724 */,
/* 725 */,
/* 726 */,
/* 727 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(839);

const convertToJson = function(node, options, parentTagName) {
  const jObj = {};

  // when no child node or attr is present
  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  }

  // otherwise create a textnode if node has some text
  if (util.isExist(node.val) && !(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
    const asArray = util.isTagNameInArrayMode(node.tagname, options.arrayMode, parentTagName)
    jObj[options.textNodeName] = asArray ? [node.val] : node.val;
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    const tagName = keys[index];
    if (node.child[tagName] && node.child[tagName].length > 1) {
      jObj[tagName] = [];
      for (let tag in node.child[tagName]) {
        if (node.child[tagName].hasOwnProperty(tag)) {
          jObj[tagName].push(convertToJson(node.child[tagName][tag], options, tagName));
        }
      }
    } else {
      const result = convertToJson(node.child[tagName][0], options, tagName);
      const asArray = (options.arrayMode === true && typeof result === 'object') || util.isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
      jObj[tagName] = asArray ? [result] : result;
    }
  }

  //add value
  return jObj;
};

exports.convertToJson = convertToJson;


/***/ }),
/* 728 */
/***/ (function(module) {

module.exports = {"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376};

/***/ }),
/* 729 */,
/* 730 */,
/* 731 */,
/* 732 */,
/* 733 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(__webpack_require__(844));

var _stringify = _interopRequireDefault(__webpack_require__(411));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports.default = _default;

/***/ }),
/* 734 */,
/* 735 */,
/* 736 */,
/* 737 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(__webpack_require__(417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports.default = _default;

/***/ }),
/* 738 */,
/* 739 */,
/* 740 */,
/* 741 */,
/* 742 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OidcClient = void 0;
const http_client_1 = __webpack_require__(539);
const auth_1 = __webpack_require__(226);
const core_1 = __webpack_require__(470);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),
/* 743 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutRequest = exports.ListAccountsResponse = exports.ListAccountsRequest = exports.ListAccountRolesResponse = exports.RoleInfo = exports.ListAccountRolesRequest = exports.UnauthorizedException = exports.TooManyRequestsException = exports.ResourceNotFoundException = exports.InvalidRequestException = exports.GetRoleCredentialsResponse = exports.RoleCredentials = exports.GetRoleCredentialsRequest = exports.AccountInfo = void 0;
const smithy_client_1 = __webpack_require__(973);
var AccountInfo;
(function (AccountInfo) {
    AccountInfo.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(AccountInfo = exports.AccountInfo || (exports.AccountInfo = {}));
var GetRoleCredentialsRequest;
(function (GetRoleCredentialsRequest) {
    GetRoleCredentialsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
    });
})(GetRoleCredentialsRequest = exports.GetRoleCredentialsRequest || (exports.GetRoleCredentialsRequest = {}));
var RoleCredentials;
(function (RoleCredentials) {
    RoleCredentials.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.secretAccessKey && { secretAccessKey: smithy_client_1.SENSITIVE_STRING }),
        ...(obj.sessionToken && { sessionToken: smithy_client_1.SENSITIVE_STRING }),
    });
})(RoleCredentials = exports.RoleCredentials || (exports.RoleCredentials = {}));
var GetRoleCredentialsResponse;
(function (GetRoleCredentialsResponse) {
    GetRoleCredentialsResponse.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.roleCredentials && { roleCredentials: RoleCredentials.filterSensitiveLog(obj.roleCredentials) }),
    });
})(GetRoleCredentialsResponse = exports.GetRoleCredentialsResponse || (exports.GetRoleCredentialsResponse = {}));
var InvalidRequestException;
(function (InvalidRequestException) {
    InvalidRequestException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(InvalidRequestException = exports.InvalidRequestException || (exports.InvalidRequestException = {}));
var ResourceNotFoundException;
(function (ResourceNotFoundException) {
    ResourceNotFoundException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ResourceNotFoundException = exports.ResourceNotFoundException || (exports.ResourceNotFoundException = {}));
var TooManyRequestsException;
(function (TooManyRequestsException) {
    TooManyRequestsException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(TooManyRequestsException = exports.TooManyRequestsException || (exports.TooManyRequestsException = {}));
var UnauthorizedException;
(function (UnauthorizedException) {
    UnauthorizedException.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(UnauthorizedException = exports.UnauthorizedException || (exports.UnauthorizedException = {}));
var ListAccountRolesRequest;
(function (ListAccountRolesRequest) {
    ListAccountRolesRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
    });
})(ListAccountRolesRequest = exports.ListAccountRolesRequest || (exports.ListAccountRolesRequest = {}));
var RoleInfo;
(function (RoleInfo) {
    RoleInfo.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(RoleInfo = exports.RoleInfo || (exports.RoleInfo = {}));
var ListAccountRolesResponse;
(function (ListAccountRolesResponse) {
    ListAccountRolesResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListAccountRolesResponse = exports.ListAccountRolesResponse || (exports.ListAccountRolesResponse = {}));
var ListAccountsRequest;
(function (ListAccountsRequest) {
    ListAccountsRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
    });
})(ListAccountsRequest = exports.ListAccountsRequest || (exports.ListAccountsRequest = {}));
var ListAccountsResponse;
(function (ListAccountsResponse) {
    ListAccountsResponse.filterSensitiveLog = (obj) => ({
        ...obj,
    });
})(ListAccountsResponse = exports.ListAccountsResponse || (exports.ListAccountsResponse = {}));
var LogoutRequest;
(function (LogoutRequest) {
    LogoutRequest.filterSensitiveLog = (obj) => ({
        ...obj,
        ...(obj.accessToken && { accessToken: smithy_client_1.SENSITIVE_STRING }),
    });
})(LogoutRequest = exports.LogoutRequest || (exports.LogoutRequest = {}));


/***/ }),
/* 744 */,
/* 745 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getInstanceMetadataEndpoint = void 0;
const node_config_provider_1 = __webpack_require__(519);
const url_parser_1 = __webpack_require__(187);
const Endpoint_1 = __webpack_require__(467);
const EndpointConfigOptions_1 = __webpack_require__(322);
const EndpointMode_1 = __webpack_require__(750);
const EndpointModeConfigOptions_1 = __webpack_require__(361);
const getInstanceMetadataEndpoint = async () => url_parser_1.parseUrl((await getFromEndpointConfig()) || (await getFromEndpointModeConfig()));
exports.getInstanceMetadataEndpoint = getInstanceMetadataEndpoint;
const getFromEndpointConfig = async () => node_config_provider_1.loadConfig(EndpointConfigOptions_1.ENDPOINT_CONFIG_OPTIONS)();
const getFromEndpointModeConfig = async () => {
    const endpointMode = await node_config_provider_1.loadConfig(EndpointModeConfigOptions_1.ENDPOINT_MODE_CONFIG_OPTIONS)();
    switch (endpointMode) {
        case EndpointMode_1.EndpointMode.IPv4:
            return Endpoint_1.Endpoint.IPv4;
        case EndpointMode_1.EndpointMode.IPv6:
            return Endpoint_1.Endpoint.IPv6;
        default:
            throw new Error(`Unsupported endpoint mode: ${endpointMode}.` + ` Select from ${Object.values(EndpointMode_1.EndpointMode)}`);
    }
};


/***/ }),
/* 746 */,
/* 747 */
/***/ (function(module) {

module.exports = require("fs");

/***/ }),
/* 748 */,
/* 749 */,
/* 750 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointMode = void 0;
var EndpointMode;
(function (EndpointMode) {
    EndpointMode["IPv4"] = "IPv4";
    EndpointMode["IPv6"] = "IPv6";
})(EndpointMode = exports.EndpointMode || (exports.EndpointMode = {}));


/***/ }),
/* 751 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRegionInfoProvider = void 0;
const config_resolver_1 = __webpack_require__(529);
const regionHash = {
    "ap-northeast-1": {
        variants: [
            {
                hostname: "portal.sso.ap-northeast-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-northeast-1",
    },
    "ap-northeast-2": {
        variants: [
            {
                hostname: "portal.sso.ap-northeast-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-northeast-2",
    },
    "ap-south-1": {
        variants: [
            {
                hostname: "portal.sso.ap-south-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-south-1",
    },
    "ap-southeast-1": {
        variants: [
            {
                hostname: "portal.sso.ap-southeast-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-southeast-1",
    },
    "ap-southeast-2": {
        variants: [
            {
                hostname: "portal.sso.ap-southeast-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ap-southeast-2",
    },
    "ca-central-1": {
        variants: [
            {
                hostname: "portal.sso.ca-central-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "ca-central-1",
    },
    "eu-central-1": {
        variants: [
            {
                hostname: "portal.sso.eu-central-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-central-1",
    },
    "eu-north-1": {
        variants: [
            {
                hostname: "portal.sso.eu-north-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-north-1",
    },
    "eu-west-1": {
        variants: [
            {
                hostname: "portal.sso.eu-west-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-west-1",
    },
    "eu-west-2": {
        variants: [
            {
                hostname: "portal.sso.eu-west-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-west-2",
    },
    "eu-west-3": {
        variants: [
            {
                hostname: "portal.sso.eu-west-3.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "eu-west-3",
    },
    "sa-east-1": {
        variants: [
            {
                hostname: "portal.sso.sa-east-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "sa-east-1",
    },
    "us-east-1": {
        variants: [
            {
                hostname: "portal.sso.us-east-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "us-east-1",
    },
    "us-east-2": {
        variants: [
            {
                hostname: "portal.sso.us-east-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "us-east-2",
    },
    "us-gov-west-1": {
        variants: [
            {
                hostname: "portal.sso.us-gov-west-1.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "us-gov-west-1",
    },
    "us-west-2": {
        variants: [
            {
                hostname: "portal.sso.us-west-2.amazonaws.com",
                tags: [],
            },
        ],
        signingRegion: "us-west-2",
    },
};
const partitionHash = {
    aws: {
        regions: [
            "af-south-1",
            "ap-east-1",
            "ap-northeast-1",
            "ap-northeast-2",
            "ap-northeast-3",
            "ap-south-1",
            "ap-southeast-1",
            "ap-southeast-2",
            "ca-central-1",
            "eu-central-1",
            "eu-north-1",
            "eu-south-1",
            "eu-west-1",
            "eu-west-2",
            "eu-west-3",
            "me-south-1",
            "sa-east-1",
            "us-east-1",
            "us-east-2",
            "us-west-1",
            "us-west-2",
        ],
        regionRegex: "^(us|eu|ap|sa|ca|me|af)\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "portal.sso.{region}.amazonaws.com",
                tags: [],
            },
            {
                hostname: "portal.sso-fips.{region}.amazonaws.com",
                tags: ["fips"],
            },
            {
                hostname: "portal.sso-fips.{region}.api.aws",
                tags: ["dualstack", "fips"],
            },
            {
                hostname: "portal.sso.{region}.api.aws",
                tags: ["dualstack"],
            },
        ],
    },
    "aws-cn": {
        regions: ["cn-north-1", "cn-northwest-1"],
        regionRegex: "^cn\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "portal.sso.{region}.amazonaws.com.cn",
                tags: [],
            },
            {
                hostname: "portal.sso-fips.{region}.amazonaws.com.cn",
                tags: ["fips"],
            },
            {
                hostname: "portal.sso-fips.{region}.api.amazonwebservices.com.cn",
                tags: ["dualstack", "fips"],
            },
            {
                hostname: "portal.sso.{region}.api.amazonwebservices.com.cn",
                tags: ["dualstack"],
            },
        ],
    },
    "aws-iso": {
        regions: ["us-iso-east-1", "us-iso-west-1"],
        regionRegex: "^us\\-iso\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "portal.sso.{region}.c2s.ic.gov",
                tags: [],
            },
        ],
    },
    "aws-iso-b": {
        regions: ["us-isob-east-1"],
        regionRegex: "^us\\-isob\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "portal.sso.{region}.sc2s.sgov.gov",
                tags: [],
            },
        ],
    },
    "aws-us-gov": {
        regions: ["us-gov-east-1", "us-gov-west-1"],
        regionRegex: "^us\\-gov\\-\\w+\\-\\d+$",
        variants: [
            {
                hostname: "portal.sso.{region}.amazonaws.com",
                tags: [],
            },
            {
                hostname: "portal.sso-fips.{region}.amazonaws.com",
                tags: ["fips"],
            },
            {
                hostname: "portal.sso-fips.{region}.api.aws",
                tags: ["dualstack", "fips"],
            },
            {
                hostname: "portal.sso.{region}.api.aws",
                tags: ["dualstack"],
            },
        ],
    },
};
const defaultRegionInfoProvider = async (region, options) => config_resolver_1.getRegionInfo(region, {
    ...options,
    signingService: "awsssoportal",
    regionHash,
    partitionHash,
});
exports.defaultRegionInfoProvider = defaultRegionInfoProvider;


/***/ }),
/* 752 */,
/* 753 */,
/* 754 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toHex = exports.fromHex = void 0;
const SHORT_TO_HEX = {};
const HEX_TO_SHORT = {};
for (let i = 0; i < 256; i++) {
    let encodedByte = i.toString(16).toLowerCase();
    if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
    }
    SHORT_TO_HEX[i] = encodedByte;
    HEX_TO_SHORT[encodedByte] = i;
}
function fromHex(encoded) {
    if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
    }
    const out = new Uint8Array(encoded.length / 2);
    for (let i = 0; i < encoded.length; i += 2) {
        const encodedByte = encoded.substr(i, 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
            out[i / 2] = HEX_TO_SHORT[encodedByte];
        }
        else {
            throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
        }
    }
    return out;
}
exports.fromHex = fromHex;
function toHex(bytes) {
    let out = "";
    for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
    }
    return out;
}
exports.toHex = toHex;


/***/ }),
/* 755 */,
/* 756 */,
/* 757 */
/***/ (function(module) {

module.exports = eval("require")("aws-crt");


/***/ }),
/* 758 */,
/* 759 */,
/* 760 */,
/* 761 */,
/* 762 */,
/* 763 */,
/* 764 */,
/* 765 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyJsonString = exports.StringWrapper = void 0;
const StringWrapper = function () {
    const Class = Object.getPrototypeOf(this).constructor;
    const Constructor = Function.bind.apply(String, [null, ...arguments]);
    const instance = new Constructor();
    Object.setPrototypeOf(instance, Class.prototype);
    return instance;
};
exports.StringWrapper = StringWrapper;
exports.StringWrapper.prototype = Object.create(String.prototype, {
    constructor: {
        value: exports.StringWrapper,
        enumerable: false,
        writable: true,
        configurable: true,
    },
});
Object.setPrototypeOf(exports.StringWrapper, String);
class LazyJsonString extends exports.StringWrapper {
    deserializeJSON() {
        return JSON.parse(super.toString());
    }
    toJSON() {
        return super.toString();
    }
    static fromObject(object) {
        if (object instanceof LazyJsonString) {
            return object;
        }
        else if (object instanceof String || typeof object === "string") {
            return new LazyJsonString(object);
        }
        return new LazyJsonString(JSON.stringify(object));
    }
}
exports.LazyJsonString = LazyJsonString;


/***/ }),
/* 766 */,
/* 767 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateDescribeRepositories = void 0;
const DescribeRepositoriesCommand_1 = __webpack_require__(287);
const ECR_1 = __webpack_require__(410);
const ECRClient_1 = __webpack_require__(429);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new DescribeRepositoriesCommand_1.DescribeRepositoriesCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.describeRepositories(input, ...args);
};
async function* paginateDescribeRepositories(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof ECR_1.ECR) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof ECRClient_1.ECRClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected ECR | ECRClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateDescribeRepositories = paginateDescribeRepositories;


/***/ }),
/* 768 */,
/* 769 */,
/* 770 */,
/* 771 */,
/* 772 */,
/* 773 */,
/* 774 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRepositoryPolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class GetRepositoryPolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "GetRepositoryPolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetRepositoryPolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetRepositoryPolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1GetRepositoryPolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1GetRepositoryPolicyCommand(output, context);
    }
}
exports.GetRepositoryPolicyCommand = GetRepositoryPolicyCommand;


/***/ }),
/* 775 */,
/* 776 */,
/* 777 */,
/* 778 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteRepositoryCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DeleteRepositoryCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DeleteRepositoryCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DeleteRepositoryRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DeleteRepositoryResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DeleteRepositoryCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DeleteRepositoryCommand(output, context);
    }
}
exports.DeleteRepositoryCommand = DeleteRepositoryCommand;


/***/ }),
/* 779 */,
/* 780 */,
/* 781 */,
/* 782 */,
/* 783 */,
/* 784 */,
/* 785 */,
/* 786 */,
/* 787 */,
/* 788 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(688), exports);
tslib_1.__exportStar(__webpack_require__(17), exports);
tslib_1.__exportStar(__webpack_require__(363), exports);
tslib_1.__exportStar(__webpack_require__(808), exports);
tslib_1.__exportStar(__webpack_require__(789), exports);


/***/ }),
/* 789 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(715), exports);
tslib_1.__exportStar(__webpack_require__(842), exports);
tslib_1.__exportStar(__webpack_require__(534), exports);


/***/ }),
/* 790 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.ListAccountRolesCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(743);
const Aws_restJson1_1 = __webpack_require__(340);
class ListAccountRolesCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "ListAccountRolesCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.ListAccountRolesRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.ListAccountRolesResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_restJson1_1.serializeAws_restJson1ListAccountRolesCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_restJson1_1.deserializeAws_restJson1ListAccountRolesCommand(output, context);
    }
}
exports.ListAccountRolesCommand = ListAccountRolesCommand;


/***/ }),
/* 791 */,
/* 792 */,
/* 793 */,
/* 794 */
/***/ (function(module) {

module.exports = require("stream");

/***/ }),
/* 795 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getHostHeaderPlugin = exports.hostHeaderMiddlewareOptions = exports.hostHeaderMiddleware = exports.resolveHostHeaderConfig = void 0;
const protocol_http_1 = __webpack_require__(504);
function resolveHostHeaderConfig(input) {
    return input;
}
exports.resolveHostHeaderConfig = resolveHostHeaderConfig;
const hostHeaderMiddleware = (options) => (next) => async (args) => {
    if (!protocol_http_1.HttpRequest.isInstance(args.request))
        return next(args);
    const { request } = args;
    const { handlerProtocol = "" } = options.requestHandler.metadata || {};
    if (handlerProtocol.indexOf("h2") >= 0 && !request.headers[":authority"]) {
        delete request.headers["host"];
        request.headers[":authority"] = "";
    }
    else if (!request.headers["host"]) {
        request.headers["host"] = request.hostname;
    }
    return next(args);
};
exports.hostHeaderMiddleware = hostHeaderMiddleware;
exports.hostHeaderMiddlewareOptions = {
    name: "hostHeaderMiddleware",
    step: "build",
    priority: "low",
    tags: ["HOST"],
    override: true,
};
const getHostHeaderPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(exports.hostHeaderMiddleware(options), exports.hostHeaderMiddlewareOptions);
    },
});
exports.getHostHeaderPlugin = getHostHeaderPlugin;


/***/ }),
/* 796 */,
/* 797 */,
/* 798 */,
/* 799 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.createWaiter = void 0;
const poller_1 = __webpack_require__(275);
const utils_1 = __webpack_require__(241);
const waiter_1 = __webpack_require__(916);
const abortTimeout = async (abortSignal) => {
    return new Promise((resolve) => {
        abortSignal.onabort = () => resolve({ state: waiter_1.WaiterState.ABORTED });
    });
};
const createWaiter = async (options, input, acceptorChecks) => {
    const params = {
        ...waiter_1.waiterServiceDefaults,
        ...options,
    };
    utils_1.validateWaiterOptions(params);
    const exitConditions = [poller_1.runPolling(params, input, acceptorChecks)];
    if (options.abortController) {
        exitConditions.push(abortTimeout(options.abortController.signal));
    }
    if (options.abortSignal) {
        exitConditions.push(abortTimeout(options.abortSignal));
    }
    return Promise.race(exitConditions);
};
exports.createWaiter = createWaiter;


/***/ }),
/* 800 */,
/* 801 */,
/* 802 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PutReplicationConfigurationCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class PutReplicationConfigurationCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "PutReplicationConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.PutReplicationConfigurationRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.PutReplicationConfigurationResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1PutReplicationConfigurationCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1PutReplicationConfigurationCommand(output, context);
    }
}
exports.PutReplicationConfigurationCommand = PutReplicationConfigurationCommand;


/***/ }),
/* 803 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(__webpack_require__(417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports.default = _default;

/***/ }),
/* 804 */,
/* 805 */,
/* 806 */,
/* 807 */,
/* 808 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(743), exports);


/***/ }),
/* 809 */,
/* 810 */,
/* 811 */,
/* 812 */,
/* 813 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UA_ESCAPE_REGEX = exports.SPACE = exports.X_AMZ_USER_AGENT = exports.USER_AGENT = void 0;
exports.USER_AGENT = "user-agent";
exports.X_AMZ_USER_AGENT = "x-amz-user-agent";
exports.SPACE = " ";
exports.UA_ESCAPE_REGEX = /[^\!\#\$\%\&\'\*\+\-\.\^\_\`\|\~\d\w]/g;


/***/ }),
/* 814 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultRetryQuota = void 0;
const constants_1 = __webpack_require__(373);
const getDefaultRetryQuota = (initialRetryTokens, options) => {
    var _a, _b, _c;
    const MAX_CAPACITY = initialRetryTokens;
    const noRetryIncrement = (_a = options === null || options === void 0 ? void 0 : options.noRetryIncrement) !== null && _a !== void 0 ? _a : constants_1.NO_RETRY_INCREMENT;
    const retryCost = (_b = options === null || options === void 0 ? void 0 : options.retryCost) !== null && _b !== void 0 ? _b : constants_1.RETRY_COST;
    const timeoutRetryCost = (_c = options === null || options === void 0 ? void 0 : options.timeoutRetryCost) !== null && _c !== void 0 ? _c : constants_1.TIMEOUT_RETRY_COST;
    let availableCapacity = initialRetryTokens;
    const getCapacityAmount = (error) => (error.name === "TimeoutError" ? timeoutRetryCost : retryCost);
    const hasRetryTokens = (error) => getCapacityAmount(error) <= availableCapacity;
    const retrieveRetryTokens = (error) => {
        if (!hasRetryTokens(error)) {
            throw new Error("No retry token available");
        }
        const capacityAmount = getCapacityAmount(error);
        availableCapacity -= capacityAmount;
        return capacityAmount;
    };
    const releaseRetryTokens = (capacityReleaseAmount) => {
        availableCapacity += capacityReleaseAmount !== null && capacityReleaseAmount !== void 0 ? capacityReleaseAmount : noRetryIncrement;
        availableCapacity = Math.min(availableCapacity, MAX_CAPACITY);
    };
    return Object.freeze({
        hasRetryTokens,
        retrieveRetryTokens,
        releaseRetryTokens,
    });
};
exports.getDefaultRetryQuota = getDefaultRetryQuota;


/***/ }),
/* 815 */,
/* 816 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.strictParseByte = exports.strictParseShort = exports.strictParseInt32 = exports.strictParseInt = exports.strictParseLong = exports.limitedParseFloat32 = exports.limitedParseFloat = exports.handleFloat = exports.limitedParseDouble = exports.strictParseFloat32 = exports.strictParseFloat = exports.strictParseDouble = exports.expectUnion = exports.expectString = exports.expectObject = exports.expectNonNull = exports.expectByte = exports.expectShort = exports.expectInt32 = exports.expectInt = exports.expectLong = exports.expectFloat32 = exports.expectNumber = exports.expectBoolean = exports.parseBoolean = void 0;
const parseBoolean = (value) => {
    switch (value) {
        case "true":
            return true;
        case "false":
            return false;
        default:
            throw new Error(`Unable to parse boolean value "${value}"`);
    }
};
exports.parseBoolean = parseBoolean;
const expectBoolean = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "boolean") {
        return value;
    }
    throw new TypeError(`Expected boolean, got ${typeof value}`);
};
exports.expectBoolean = expectBoolean;
const expectNumber = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "number") {
        return value;
    }
    throw new TypeError(`Expected number, got ${typeof value}`);
};
exports.expectNumber = expectNumber;
const MAX_FLOAT = Math.ceil(2 ** 127 * (2 - 2 ** -23));
const expectFloat32 = (value) => {
    const expected = exports.expectNumber(value);
    if (expected !== undefined && !Number.isNaN(expected) && expected !== Infinity && expected !== -Infinity) {
        if (Math.abs(expected) > MAX_FLOAT) {
            throw new TypeError(`Expected 32-bit float, got ${value}`);
        }
    }
    return expected;
};
exports.expectFloat32 = expectFloat32;
const expectLong = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (Number.isInteger(value) && !Number.isNaN(value)) {
        return value;
    }
    throw new TypeError(`Expected integer, got ${typeof value}`);
};
exports.expectLong = expectLong;
exports.expectInt = exports.expectLong;
const expectInt32 = (value) => expectSizedInt(value, 32);
exports.expectInt32 = expectInt32;
const expectShort = (value) => expectSizedInt(value, 16);
exports.expectShort = expectShort;
const expectByte = (value) => expectSizedInt(value, 8);
exports.expectByte = expectByte;
const expectSizedInt = (value, size) => {
    const expected = exports.expectLong(value);
    if (expected !== undefined && castInt(expected, size) !== expected) {
        throw new TypeError(`Expected ${size}-bit integer, got ${value}`);
    }
    return expected;
};
const castInt = (value, size) => {
    switch (size) {
        case 32:
            return Int32Array.of(value)[0];
        case 16:
            return Int16Array.of(value)[0];
        case 8:
            return Int8Array.of(value)[0];
    }
};
const expectNonNull = (value, location) => {
    if (value === null || value === undefined) {
        if (location) {
            throw new TypeError(`Expected a non-null value for ${location}`);
        }
        throw new TypeError("Expected a non-null value");
    }
    return value;
};
exports.expectNonNull = expectNonNull;
const expectObject = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "object" && !Array.isArray(value)) {
        return value;
    }
    throw new TypeError(`Expected object, got ${typeof value}`);
};
exports.expectObject = expectObject;
const expectString = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    if (typeof value === "string") {
        return value;
    }
    throw new TypeError(`Expected string, got ${typeof value}`);
};
exports.expectString = expectString;
const expectUnion = (value) => {
    if (value === null || value === undefined) {
        return undefined;
    }
    const asObject = exports.expectObject(value);
    const setKeys = Object.entries(asObject)
        .filter(([_, v]) => v !== null && v !== undefined)
        .map(([k, _]) => k);
    if (setKeys.length === 0) {
        throw new TypeError(`Unions must have exactly one non-null member`);
    }
    if (setKeys.length > 1) {
        throw new TypeError(`Unions must have exactly one non-null member. Keys ${setKeys} were not null.`);
    }
    return asObject;
};
exports.expectUnion = expectUnion;
const strictParseDouble = (value) => {
    if (typeof value == "string") {
        return exports.expectNumber(parseNumber(value));
    }
    return exports.expectNumber(value);
};
exports.strictParseDouble = strictParseDouble;
exports.strictParseFloat = exports.strictParseDouble;
const strictParseFloat32 = (value) => {
    if (typeof value == "string") {
        return exports.expectFloat32(parseNumber(value));
    }
    return exports.expectFloat32(value);
};
exports.strictParseFloat32 = strictParseFloat32;
const NUMBER_REGEX = /(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(-?Infinity)|(NaN)/g;
const parseNumber = (value) => {
    const matches = value.match(NUMBER_REGEX);
    if (matches === null || matches[0].length !== value.length) {
        throw new TypeError(`Expected real number, got implicit NaN`);
    }
    return parseFloat(value);
};
const limitedParseDouble = (value) => {
    if (typeof value == "string") {
        return parseFloatString(value);
    }
    return exports.expectNumber(value);
};
exports.limitedParseDouble = limitedParseDouble;
exports.handleFloat = exports.limitedParseDouble;
exports.limitedParseFloat = exports.limitedParseDouble;
const limitedParseFloat32 = (value) => {
    if (typeof value == "string") {
        return parseFloatString(value);
    }
    return exports.expectFloat32(value);
};
exports.limitedParseFloat32 = limitedParseFloat32;
const parseFloatString = (value) => {
    switch (value) {
        case "NaN":
            return NaN;
        case "Infinity":
            return Infinity;
        case "-Infinity":
            return -Infinity;
        default:
            throw new Error(`Unable to parse float value: ${value}`);
    }
};
const strictParseLong = (value) => {
    if (typeof value === "string") {
        return exports.expectLong(parseNumber(value));
    }
    return exports.expectLong(value);
};
exports.strictParseLong = strictParseLong;
exports.strictParseInt = exports.strictParseLong;
const strictParseInt32 = (value) => {
    if (typeof value === "string") {
        return exports.expectInt32(parseNumber(value));
    }
    return exports.expectInt32(value);
};
exports.strictParseInt32 = strictParseInt32;
const strictParseShort = (value) => {
    if (typeof value === "string") {
        return exports.expectShort(parseNumber(value));
    }
    return exports.expectShort(value);
};
exports.strictParseShort = strictParseShort;
const strictParseByte = (value) => {
    if (typeof value === "string") {
        return exports.expectByte(parseNumber(value));
    }
    return exports.expectByte(value);
};
exports.strictParseByte = strictParseByte;


/***/ }),
/* 817 */,
/* 818 */,
/* 819 */,
/* 820 */,
/* 821 */,
/* 822 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Collector = void 0;
const stream_1 = __webpack_require__(794);
class Collector extends stream_1.Writable {
    constructor() {
        super(...arguments);
        this.bufferedBytes = [];
    }
    _write(chunk, encoding, callback) {
        this.bufferedBytes.push(chunk);
        callback();
    }
}
exports.Collector = Collector;


/***/ }),
/* 823 */,
/* 824 */
/***/ (function(module) {

module.exports = {"_from":"@aws-sdk/client-sts@3.40.0","_id":"@aws-sdk/client-sts@3.40.0","_inBundle":false,"_integrity":"sha512-7jBlb1uyq2c0bFqi4ZVnEMNzLTodvIZKoxjh1LYA8OZISbMsDjTxFOYOmuyOhuPy0fLfLL3KRLtengJ23zs3QQ==","_location":"/@aws-sdk/client-sts","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"@aws-sdk/client-sts@3.40.0","name":"@aws-sdk/client-sts","escapedName":"@aws-sdk%2fclient-sts","scope":"@aws-sdk","rawSpec":"3.40.0","saveSpec":null,"fetchSpec":"3.40.0"},"_requiredBy":["/@aws-sdk/client-ecr"],"_resolved":"https://registry.npmjs.org/@aws-sdk/client-sts/-/client-sts-3.40.0.tgz","_shasum":"bcc5c7fb59afc88d2123e18166747ac25f71ccba","_spec":"@aws-sdk/client-sts@3.40.0","_where":"/Users/lior.kuperiu/lemonade/amazon-ecr-login/node_modules/@aws-sdk/client-ecr","author":{"name":"AWS SDK for JavaScript Team","url":"https://aws.amazon.com/javascript/"},"browser":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.browser"},"bugs":{"url":"https://github.com/aws/aws-sdk-js-v3/issues"},"bundleDependencies":false,"dependencies":{"@aws-crypto/sha256-browser":"2.0.0","@aws-crypto/sha256-js":"2.0.0","@aws-sdk/config-resolver":"3.40.0","@aws-sdk/credential-provider-node":"3.40.0","@aws-sdk/fetch-http-handler":"3.40.0","@aws-sdk/hash-node":"3.40.0","@aws-sdk/invalid-dependency":"3.40.0","@aws-sdk/middleware-content-length":"3.40.0","@aws-sdk/middleware-host-header":"3.40.0","@aws-sdk/middleware-logger":"3.40.0","@aws-sdk/middleware-retry":"3.40.0","@aws-sdk/middleware-sdk-sts":"3.40.0","@aws-sdk/middleware-serde":"3.40.0","@aws-sdk/middleware-signing":"3.40.0","@aws-sdk/middleware-stack":"3.40.0","@aws-sdk/middleware-user-agent":"3.40.0","@aws-sdk/node-config-provider":"3.40.0","@aws-sdk/node-http-handler":"3.40.0","@aws-sdk/protocol-http":"3.40.0","@aws-sdk/smithy-client":"3.40.0","@aws-sdk/types":"3.40.0","@aws-sdk/url-parser":"3.40.0","@aws-sdk/util-base64-browser":"3.37.0","@aws-sdk/util-base64-node":"3.37.0","@aws-sdk/util-body-length-browser":"3.37.0","@aws-sdk/util-body-length-node":"3.37.0","@aws-sdk/util-user-agent-browser":"3.40.0","@aws-sdk/util-user-agent-node":"3.40.0","@aws-sdk/util-utf8-browser":"3.37.0","@aws-sdk/util-utf8-node":"3.37.0","entities":"2.2.0","fast-xml-parser":"3.19.0","tslib":"^2.3.0"},"deprecated":false,"description":"AWS SDK for JavaScript Sts Client for Node.js, Browser and React Native","devDependencies":{"@aws-sdk/service-client-documentation-generator":"3.38.0","@types/node":"^12.7.5","downlevel-dts":"0.7.0","jest":"^26.1.0","rimraf":"^3.0.0","ts-jest":"^26.4.1","typedoc":"^0.19.2","typescript":"~4.3.5"},"engines":{"node":">=10.0.0"},"files":["dist-*"],"homepage":"https://github.com/aws/aws-sdk-js-v3/tree/main/clients/client-sts","license":"Apache-2.0","main":"./dist-cjs/index.js","module":"./dist-es/index.js","name":"@aws-sdk/client-sts","react-native":{"./dist-es/runtimeConfig":"./dist-es/runtimeConfig.native"},"repository":{"type":"git","url":"git+https://github.com/aws/aws-sdk-js-v3.git","directory":"clients/client-sts"},"scripts":{"build":"yarn build:cjs && yarn build:es && yarn build:types","build:cjs":"tsc -p tsconfig.json","build:docs":"yarn clean:docs && typedoc ./","build:es":"tsc -p tsconfig.es.json","build:types":"tsc -p tsconfig.types.json","clean":"yarn clean:dist && yarn clean:docs","clean:dist":"rimraf ./dist","clean:docs":"rimraf ./docs","downlevel-dts":"downlevel-dts dist-types dist-types/ts3.4","test":"exit 0"},"sideEffects":false,"types":"./dist-types/index.d.ts","typesVersions":{"<4.0":{"dist-types/*":["dist-types/ts3.4/*"]}},"version":"3.40.0"};

/***/ }),
/* 825 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PutImageScanningConfigurationCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class PutImageScanningConfigurationCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "PutImageScanningConfigurationCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.PutImageScanningConfigurationRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.PutImageScanningConfigurationResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1PutImageScanningConfigurationCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1PutImageScanningConfigurationCommand(output, context);
    }
}
exports.PutImageScanningConfigurationCommand = PutImageScanningConfigurationCommand;


/***/ }),
/* 826 */,
/* 827 */,
/* 828 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 829 */,
/* 830 */,
/* 831 */,
/* 832 */,
/* 833 */,
/* 834 */,
/* 835 */
/***/ (function(module) {

module.exports = require("url");

/***/ }),
/* 836 */,
/* 837 */,
/* 838 */,
/* 839 */
/***/ (function(__unusedmodule, exports) {

"use strict";


const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*'
const regexName = new RegExp('^' + nameRegexp + '$');

const getAllMatches = function(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
};

const isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === 'undefined');
};

exports.isExist = function(v) {
  return typeof v !== 'undefined';
};

exports.isEmptyObject = function(obj) {
  return Object.keys(obj).length === 0;
};

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
exports.merge = function(target, a, arrayMode) {
  if (a) {
    const keys = Object.keys(a); // will return an array of own properties
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      if (arrayMode === 'strict') {
        target[keys[i]] = [ a[keys[i]] ];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

exports.getValue = function(v) {
  if (exports.isExist(v)) {
    return v;
  } else {
    return '';
  }
};

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};

exports.buildOptions = function(options, defaultOptions, props) {
  var newOptions = {};
  if (!options) {
    return defaultOptions; //if there are not options
  }

  for (let i = 0; i < props.length; i++) {
    if (options[props[i]] !== undefined) {
      newOptions[props[i]] = options[props[i]];
    } else {
      newOptions[props[i]] = defaultOptions[props[i]];
    }
  }
  return newOptions;
};

/**
 * Check if a tag name should be treated as array
 *
 * @param tagName the node tagname
 * @param arrayMode the array mode option
 * @param parentTagName the parent tag name
 * @returns {boolean} true if node should be parsed as array
 */
exports.isTagNameInArrayMode = function (tagName, arrayMode, parentTagName) {
  if (arrayMode === false) {
    return false;
  } else if (arrayMode instanceof RegExp) {
    return arrayMode.test(tagName);
  } else if (typeof arrayMode === 'function') {
    return !!arrayMode(tagName, parentTagName);
  }

  return arrayMode === "strict";
}

exports.isName = isName;
exports.getAllMatches = getAllMatches;
exports.nameRegexp = nameRegexp;


/***/ }),
/* 840 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(907), exports);
tslib_1.__exportStar(__webpack_require__(570), exports);
tslib_1.__exportStar(__webpack_require__(227), exports);
tslib_1.__exportStar(__webpack_require__(337), exports);
tslib_1.__exportStar(__webpack_require__(508), exports);


/***/ }),
/* 841 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.toUtf8 = exports.fromUtf8 = void 0;
const util_buffer_from_1 = __webpack_require__(59);
const fromUtf8 = (input) => {
    const buf = util_buffer_from_1.fromString(input, "utf8");
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
};
exports.fromUtf8 = fromUtf8;
const toUtf8 = (input) => util_buffer_from_1.fromArrayBuffer(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
exports.toUtf8 = toUtf8;


/***/ }),
/* 842 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateListAccountRoles = void 0;
const ListAccountRolesCommand_1 = __webpack_require__(790);
const SSO_1 = __webpack_require__(688);
const SSOClient_1 = __webpack_require__(17);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new ListAccountRolesCommand_1.ListAccountRolesCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.listAccountRoles(input, ...args);
};
async function* paginateListAccountRoles(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof SSO_1.SSO) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof SSOClient_1.SSOClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected SSO | SSOClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateListAccountRoles = paginateListAccountRoles;


/***/ }),
/* 843 */,
/* 844 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = rng;

var _crypto = _interopRequireDefault(__webpack_require__(417));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),
/* 845 */,
/* 846 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.providerConfigFromInit = exports.DEFAULT_MAX_RETRIES = exports.DEFAULT_TIMEOUT = void 0;
exports.DEFAULT_TIMEOUT = 1000;
exports.DEFAULT_MAX_RETRIES = 0;
const providerConfigFromInit = ({ maxRetries = exports.DEFAULT_MAX_RETRIES, timeout = exports.DEFAULT_TIMEOUT, }) => ({ maxRetries, timeout });
exports.providerConfigFromInit = providerConfigFromInit;


/***/ }),
/* 847 */,
/* 848 */,
/* 849 */,
/* 850 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromIni = void 0;
const credential_provider_env_1 = __webpack_require__(554);
const credential_provider_imds_1 = __webpack_require__(146);
const credential_provider_sso_1 = __webpack_require__(168);
const credential_provider_web_identity_1 = __webpack_require__(590);
const property_provider_1 = __webpack_require__(948);
const util_credentials_1 = __webpack_require__(339);
const isStaticCredsProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.aws_access_key_id === "string" &&
    typeof arg.aws_secret_access_key === "string" &&
    ["undefined", "string"].indexOf(typeof arg.aws_session_token) > -1;
const isWebIdentityProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.web_identity_token_file === "string" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1;
const isAssumeRoleProfile = (arg) => Boolean(arg) &&
    typeof arg === "object" &&
    typeof arg.role_arn === "string" &&
    ["undefined", "string"].indexOf(typeof arg.role_session_name) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.external_id) > -1 &&
    ["undefined", "string"].indexOf(typeof arg.mfa_serial) > -1;
const isAssumeRoleWithSourceProfile = (arg) => isAssumeRoleProfile(arg) && typeof arg.source_profile === "string" && typeof arg.credential_source === "undefined";
const isAssumeRoleWithProviderProfile = (arg) => isAssumeRoleProfile(arg) && typeof arg.credential_source === "string" && typeof arg.source_profile === "undefined";
const fromIni = (init = {}) => async () => {
    const profiles = await util_credentials_1.parseKnownFiles(init);
    return resolveProfileData(util_credentials_1.getMasterProfileName(init), profiles, init);
};
exports.fromIni = fromIni;
const resolveProfileData = async (profileName, profiles, options, visitedProfiles = {}) => {
    const data = profiles[profileName];
    if (Object.keys(visitedProfiles).length > 0 && isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data);
    }
    if (isAssumeRoleWithSourceProfile(data) || isAssumeRoleWithProviderProfile(data)) {
        const { external_id: ExternalId, mfa_serial, role_arn: RoleArn, role_session_name: RoleSessionName = "aws-sdk-js-" + Date.now(), source_profile, credential_source, } = data;
        if (!options.roleAssumer) {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} requires a role to be assumed, but no` + ` role assumption callback was provided.`, false);
        }
        if (source_profile && source_profile in visitedProfiles) {
            throw new property_provider_1.CredentialsProviderError(`Detected a cycle attempting to resolve credentials for profile` +
                ` ${util_credentials_1.getMasterProfileName(options)}. Profiles visited: ` +
                Object.keys(visitedProfiles).join(", "), false);
        }
        const sourceCreds = source_profile
            ? resolveProfileData(source_profile, profiles, options, {
                ...visitedProfiles,
                [source_profile]: true,
            })
            : resolveCredentialSource(credential_source, profileName)();
        const params = { RoleArn, RoleSessionName, ExternalId };
        if (mfa_serial) {
            if (!options.mfaCodeProvider) {
                throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} requires multi-factor authentication,` + ` but no MFA code callback was provided.`, false);
            }
            params.SerialNumber = mfa_serial;
            params.TokenCode = await options.mfaCodeProvider(mfa_serial);
        }
        return options.roleAssumer(await sourceCreds, params);
    }
    if (isStaticCredsProfile(data)) {
        return resolveStaticCredentials(data);
    }
    if (isWebIdentityProfile(data)) {
        return resolveWebIdentityCredentials(data, options);
    }
    if (credential_provider_sso_1.isSsoProfile(data)) {
        const { sso_start_url, sso_account_id, sso_region, sso_role_name } = credential_provider_sso_1.validateSsoProfile(data);
        return credential_provider_sso_1.fromSSO({
            ssoStartUrl: sso_start_url,
            ssoAccountId: sso_account_id,
            ssoRegion: sso_region,
            ssoRoleName: sso_role_name,
        })();
    }
    throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} could not be found or parsed in shared` + ` credentials file.`);
};
const resolveCredentialSource = (credentialSource, profileName) => {
    const sourceProvidersMap = {
        EcsContainer: credential_provider_imds_1.fromContainerMetadata,
        Ec2InstanceMetadata: credential_provider_imds_1.fromInstanceMetadata,
        Environment: credential_provider_env_1.fromEnv,
    };
    if (credentialSource in sourceProvidersMap) {
        return sourceProvidersMap[credentialSource]();
    }
    else {
        throw new property_provider_1.CredentialsProviderError(`Unsupported credential source in profile ${profileName}. Got ${credentialSource}, ` +
            `expected EcsContainer or Ec2InstanceMetadata or Environment.`);
    }
};
const resolveStaticCredentials = (profile) => Promise.resolve({
    accessKeyId: profile.aws_access_key_id,
    secretAccessKey: profile.aws_secret_access_key,
    sessionToken: profile.aws_session_token,
});
const resolveWebIdentityCredentials = async (profile, options) => credential_provider_web_identity_1.fromTokenFile({
    webIdentityTokenFile: profile.web_identity_token_file,
    roleArn: profile.role_arn,
    roleSessionName: profile.role_session_name,
    roleAssumerWithWebIdentity: options.roleAssumerWithWebIdentity,
})();


/***/ }),
/* 851 */,
/* 852 */,
/* 853 */,
/* 854 */,
/* 855 */,
/* 856 */,
/* 857 */,
/* 858 */,
/* 859 */,
/* 860 */,
/* 861 */,
/* 862 */,
/* 863 */,
/* 864 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRegistryPolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class GetRegistryPolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "GetRegistryPolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetRegistryPolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetRegistryPolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1GetRegistryPolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1GetRegistryPolicyCommand(output, context);
    }
}
exports.GetRegistryPolicyCommand = GetRegistryPolicyCommand;


/***/ }),
/* 865 */,
/* 866 */,
/* 867 */,
/* 868 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SENSITIVE_STRING = void 0;
exports.SENSITIVE_STRING = "***SensitiveInformation***";


/***/ }),
/* 869 */,
/* 870 */,
/* 871 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.streamCollector = void 0;
const collector_1 = __webpack_require__(822);
const streamCollector = (stream) => new Promise((resolve, reject) => {
    const collector = new collector_1.Collector();
    stream.pipe(collector);
    stream.on("error", (err) => {
        collector.end();
        reject(err);
    });
    collector.on("error", reject);
    collector.on("finish", function () {
        const bytes = new Uint8Array(Buffer.concat(this.bufferedBytes));
        resolve(bytes);
    });
});
exports.streamCollector = streamCollector;


/***/ }),
/* 872 */,
/* 873 */,
/* 874 */,
/* 875 */,
/* 876 */,
/* 877 */,
/* 878 */,
/* 879 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetRoleCredentialsCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(743);
const Aws_restJson1_1 = __webpack_require__(340);
class GetRoleCredentialsCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "SSOClient";
        const commandName = "GetRoleCredentialsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetRoleCredentialsRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetRoleCredentialsResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_restJson1_1.serializeAws_restJson1GetRoleCredentialsCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_restJson1_1.deserializeAws_restJson1GetRoleCredentialsCommand(output, context);
    }
}
exports.GetRoleCredentialsCommand = GetRoleCredentialsCommand;


/***/ }),
/* 880 */,
/* 881 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isClockSkewed = void 0;
const getSkewCorrectedDate_1 = __webpack_require__(564);
const isClockSkewed = (clockTime, systemClockOffset) => Math.abs(getSkewCorrectedDate_1.getSkewCorrectedDate(systemClockOffset).getTime() - clockTime) >= 300000;
exports.isClockSkewed = isClockSkewed;


/***/ }),
/* 882 */,
/* 883 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRateLimiter = void 0;
const service_error_classification_1 = __webpack_require__(223);
class DefaultRateLimiter {
    constructor(options) {
        var _a, _b, _c, _d, _e;
        this.currentCapacity = 0;
        this.enabled = false;
        this.lastMaxRate = 0;
        this.measuredTxRate = 0;
        this.requestCount = 0;
        this.lastTimestamp = 0;
        this.timeWindow = 0;
        this.beta = (_a = options === null || options === void 0 ? void 0 : options.beta) !== null && _a !== void 0 ? _a : 0.7;
        this.minCapacity = (_b = options === null || options === void 0 ? void 0 : options.minCapacity) !== null && _b !== void 0 ? _b : 1;
        this.minFillRate = (_c = options === null || options === void 0 ? void 0 : options.minFillRate) !== null && _c !== void 0 ? _c : 0.5;
        this.scaleConstant = (_d = options === null || options === void 0 ? void 0 : options.scaleConstant) !== null && _d !== void 0 ? _d : 0.4;
        this.smooth = (_e = options === null || options === void 0 ? void 0 : options.smooth) !== null && _e !== void 0 ? _e : 0.8;
        const currentTimeInSeconds = this.getCurrentTimeInSeconds();
        this.lastThrottleTime = currentTimeInSeconds;
        this.lastTxRateBucket = Math.floor(this.getCurrentTimeInSeconds());
        this.fillRate = this.minFillRate;
        this.maxCapacity = this.minCapacity;
    }
    getCurrentTimeInSeconds() {
        return Date.now() / 1000;
    }
    async getSendToken() {
        return this.acquireTokenBucket(1);
    }
    async acquireTokenBucket(amount) {
        if (!this.enabled) {
            return;
        }
        this.refillTokenBucket();
        if (amount > this.currentCapacity) {
            const delay = ((amount - this.currentCapacity) / this.fillRate) * 1000;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
        this.currentCapacity = this.currentCapacity - amount;
    }
    refillTokenBucket() {
        const timestamp = this.getCurrentTimeInSeconds();
        if (!this.lastTimestamp) {
            this.lastTimestamp = timestamp;
            return;
        }
        const fillAmount = (timestamp - this.lastTimestamp) * this.fillRate;
        this.currentCapacity = Math.min(this.maxCapacity, this.currentCapacity + fillAmount);
        this.lastTimestamp = timestamp;
    }
    updateClientSendingRate(response) {
        let calculatedRate;
        this.updateMeasuredRate();
        if (service_error_classification_1.isThrottlingError(response)) {
            const rateToUse = !this.enabled ? this.measuredTxRate : Math.min(this.measuredTxRate, this.fillRate);
            this.lastMaxRate = rateToUse;
            this.calculateTimeWindow();
            this.lastThrottleTime = this.getCurrentTimeInSeconds();
            calculatedRate = this.cubicThrottle(rateToUse);
            this.enableTokenBucket();
        }
        else {
            this.calculateTimeWindow();
            calculatedRate = this.cubicSuccess(this.getCurrentTimeInSeconds());
        }
        const newRate = Math.min(calculatedRate, 2 * this.measuredTxRate);
        this.updateTokenBucketRate(newRate);
    }
    calculateTimeWindow() {
        this.timeWindow = this.getPrecise(Math.pow((this.lastMaxRate * (1 - this.beta)) / this.scaleConstant, 1 / 3));
    }
    cubicThrottle(rateToUse) {
        return this.getPrecise(rateToUse * this.beta);
    }
    cubicSuccess(timestamp) {
        return this.getPrecise(this.scaleConstant * Math.pow(timestamp - this.lastThrottleTime - this.timeWindow, 3) + this.lastMaxRate);
    }
    enableTokenBucket() {
        this.enabled = true;
    }
    updateTokenBucketRate(newRate) {
        this.refillTokenBucket();
        this.fillRate = Math.max(newRate, this.minFillRate);
        this.maxCapacity = Math.max(newRate, this.minCapacity);
        this.currentCapacity = Math.min(this.currentCapacity, this.maxCapacity);
    }
    updateMeasuredRate() {
        const t = this.getCurrentTimeInSeconds();
        const timeBucket = Math.floor(t * 2) / 2;
        this.requestCount++;
        if (timeBucket > this.lastTxRateBucket) {
            const currentRate = this.requestCount / (timeBucket - this.lastTxRateBucket);
            this.measuredTxRate = this.getPrecise(currentRate * this.smooth + this.measuredTxRate * (1 - this.smooth));
            this.requestCount = 0;
            this.lastTxRateBucket = timeBucket;
        }
    }
    getPrecise(num) {
        return parseFloat(num.toFixed(8));
    }
}
exports.DefaultRateLimiter = DefaultRateLimiter;


/***/ }),
/* 884 */,
/* 885 */,
/* 886 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoggerPlugin = exports.loggerMiddlewareOptions = exports.loggerMiddleware = void 0;
const loggerMiddleware = () => (next, context) => async (args) => {
    const { clientName, commandName, inputFilterSensitiveLog, logger, outputFilterSensitiveLog } = context;
    const response = await next(args);
    if (!logger) {
        return response;
    }
    if (typeof logger.info === "function") {
        const { $metadata, ...outputWithoutMetadata } = response.output;
        logger.info({
            clientName,
            commandName,
            input: inputFilterSensitiveLog(args.input),
            output: outputFilterSensitiveLog(outputWithoutMetadata),
            metadata: $metadata,
        });
    }
    return response;
};
exports.loggerMiddleware = loggerMiddleware;
exports.loggerMiddlewareOptions = {
    name: "loggerMiddleware",
    tags: ["LOGGER"],
    step: "initialize",
    override: true,
};
const getLoggerPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(exports.loggerMiddleware(), exports.loggerMiddlewareOptions);
    },
});
exports.getLoggerPlugin = getLoggerPlugin;


/***/ }),
/* 887 */,
/* 888 */,
/* 889 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),
/* 890 */,
/* 891 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.serializeFloat = void 0;
const serializeFloat = (value) => {
    if (value !== value) {
        return "NaN";
    }
    switch (value) {
        case Infinity:
            return "Infinity";
        case -Infinity:
            return "-Infinity";
        default:
            return value;
    }
};
exports.serializeFloat = serializeFloat;


/***/ }),
/* 892 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRuntimeConfig = void 0;
const url_parser_1 = __webpack_require__(187);
const endpoints_1 = __webpack_require__(751);
const getRuntimeConfig = (config) => {
    var _a, _b, _c, _d, _e;
    return ({
        apiVersion: "2019-06-10",
        disableHostPrefix: (_a = config === null || config === void 0 ? void 0 : config.disableHostPrefix) !== null && _a !== void 0 ? _a : false,
        logger: (_b = config === null || config === void 0 ? void 0 : config.logger) !== null && _b !== void 0 ? _b : {},
        regionInfoProvider: (_c = config === null || config === void 0 ? void 0 : config.regionInfoProvider) !== null && _c !== void 0 ? _c : endpoints_1.defaultRegionInfoProvider,
        serviceId: (_d = config === null || config === void 0 ? void 0 : config.serviceId) !== null && _d !== void 0 ? _d : "SSO",
        urlParser: (_e = config === null || config === void 0 ? void 0 : config.urlParser) !== null && _e !== void 0 ? _e : url_parser_1.parseUrl,
    });
};
exports.getRuntimeConfig = getRuntimeConfig;


/***/ }),
/* 893 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rng = _interopRequireDefault(__webpack_require__(844));

var _stringify = _interopRequireDefault(__webpack_require__(411));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports.default = _default;

/***/ }),
/* 894 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getRetryPlugin = exports.retryMiddlewareOptions = exports.retryMiddleware = void 0;
const retryMiddleware = (options) => (next, context) => async (args) => {
    const retryStrategy = await options.retryStrategy();
    if (retryStrategy === null || retryStrategy === void 0 ? void 0 : retryStrategy.mode)
        context.userAgent = [...(context.userAgent || []), ["cfg/retry-mode", retryStrategy.mode]];
    return retryStrategy.retry(next, args);
};
exports.retryMiddleware = retryMiddleware;
exports.retryMiddlewareOptions = {
    name: "retryMiddleware",
    tags: ["RETRY"],
    step: "finalizeRequest",
    priority: "high",
    override: true,
};
const getRetryPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(exports.retryMiddleware(options), exports.retryMiddlewareOptions);
    },
});
exports.getRetryPlugin = getRetryPlugin;


/***/ }),
/* 895 */,
/* 896 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchCheckLayerAvailabilityCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class BatchCheckLayerAvailabilityCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "BatchCheckLayerAvailabilityCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.BatchCheckLayerAvailabilityRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.BatchCheckLayerAvailabilityResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1BatchCheckLayerAvailabilityCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1BatchCheckLayerAvailabilityCommand(output, context);
    }
}
exports.BatchCheckLayerAvailabilityCommand = BatchCheckLayerAvailabilityCommand;


/***/ }),
/* 897 */,
/* 898 */,
/* 899 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const property_provider_1 = __webpack_require__(948);
const fromEnv_1 = __webpack_require__(252);
const fromSharedConfigFiles_1 = __webpack_require__(389);
const fromStatic_1 = __webpack_require__(448);
const loadConfig = ({ environmentVariableSelector, configFileSelector, default: defaultValue }, configuration = {}) => property_provider_1.memoize(property_provider_1.chain(fromEnv_1.fromEnv(environmentVariableSelector), fromSharedConfigFiles_1.fromSharedConfigFiles(configFileSelector, configuration), fromStatic_1.fromStatic(defaultValue)));
exports.loadConfig = loadConfig;


/***/ }),
/* 900 */,
/* 901 */,
/* 902 */,
/* 903 */,
/* 904 */,
/* 905 */,
/* 906 */,
/* 907 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.STS = void 0;
const AssumeRoleCommand_1 = __webpack_require__(378);
const AssumeRoleWithSAMLCommand_1 = __webpack_require__(28);
const AssumeRoleWithWebIdentityCommand_1 = __webpack_require__(650);
const DecodeAuthorizationMessageCommand_1 = __webpack_require__(491);
const GetAccessKeyInfoCommand_1 = __webpack_require__(439);
const GetCallerIdentityCommand_1 = __webpack_require__(133);
const GetFederationTokenCommand_1 = __webpack_require__(629);
const GetSessionTokenCommand_1 = __webpack_require__(573);
const STSClient_1 = __webpack_require__(570);
class STS extends STSClient_1.STSClient {
    assumeRole(args, optionsOrCb, cb) {
        const command = new AssumeRoleCommand_1.AssumeRoleCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    assumeRoleWithSAML(args, optionsOrCb, cb) {
        const command = new AssumeRoleWithSAMLCommand_1.AssumeRoleWithSAMLCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    assumeRoleWithWebIdentity(args, optionsOrCb, cb) {
        const command = new AssumeRoleWithWebIdentityCommand_1.AssumeRoleWithWebIdentityCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    decodeAuthorizationMessage(args, optionsOrCb, cb) {
        const command = new DecodeAuthorizationMessageCommand_1.DecodeAuthorizationMessageCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getAccessKeyInfo(args, optionsOrCb, cb) {
        const command = new GetAccessKeyInfoCommand_1.GetAccessKeyInfoCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getCallerIdentity(args, optionsOrCb, cb) {
        const command = new GetCallerIdentityCommand_1.GetCallerIdentityCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getFederationToken(args, optionsOrCb, cb) {
        const command = new GetFederationTokenCommand_1.GetFederationTokenCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
    getSessionToken(args, optionsOrCb, cb) {
        const command = new GetSessionTokenCommand_1.GetSessionTokenCommand(args);
        if (typeof optionsOrCb === "function") {
            this.send(command, optionsOrCb);
        }
        else if (typeof cb === "function") {
            if (typeof optionsOrCb !== "object")
                throw new Error(`Expect http options but get ${typeof optionsOrCb}`);
            this.send(command, optionsOrCb || {}, cb);
        }
        else {
            return this.send(command, optionsOrCb);
        }
    }
}
exports.STS = STS;


/***/ }),
/* 908 */,
/* 909 */,
/* 910 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isArrayBuffer = void 0;
const isArrayBuffer = (arg) => (typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer) ||
    Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
exports.isArrayBuffer = isArrayBuffer;


/***/ }),
/* 911 */,
/* 912 */,
/* 913 */,
/* 914 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.CompleteLayerUploadCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class CompleteLayerUploadCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "CompleteLayerUploadCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.CompleteLayerUploadRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.CompleteLayerUploadResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1CompleteLayerUploadCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1CompleteLayerUploadCommand(output, context);
    }
}
exports.CompleteLayerUploadCommand = CompleteLayerUploadCommand;


/***/ }),
/* 915 */,
/* 916 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.checkExceptions = exports.WaiterState = exports.waiterServiceDefaults = void 0;
exports.waiterServiceDefaults = {
    minDelay: 2,
    maxDelay: 120,
};
var WaiterState;
(function (WaiterState) {
    WaiterState["ABORTED"] = "ABORTED";
    WaiterState["FAILURE"] = "FAILURE";
    WaiterState["SUCCESS"] = "SUCCESS";
    WaiterState["RETRY"] = "RETRY";
    WaiterState["TIMEOUT"] = "TIMEOUT";
})(WaiterState = exports.WaiterState || (exports.WaiterState = {}));
const checkExceptions = (result) => {
    if (result.state === WaiterState.ABORTED) {
        const abortError = new Error(`${JSON.stringify({
            ...result,
            reason: "Request was aborted",
        })}`);
        abortError.name = "AbortError";
        throw abortError;
    }
    else if (result.state === WaiterState.TIMEOUT) {
        const timeoutError = new Error(`${JSON.stringify({
            ...result,
            reason: "Waiter has timed out",
        })}`);
        timeoutError.name = "TimeoutError";
        throw timeoutError;
    }
    else if (result.state !== WaiterState.SUCCESS) {
        throw new Error(`${JSON.stringify({ result })}`);
    }
    return result;
};
exports.checkExceptions = checkExceptions;


/***/ }),
/* 917 */,
/* 918 */,
/* 919 */,
/* 920 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.waitUntilImageScanComplete = exports.waitForImageScanComplete = void 0;
const util_waiter_1 = __webpack_require__(513);
const DescribeImageScanFindingsCommand_1 = __webpack_require__(981);
const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new DescribeImageScanFindingsCommand_1.DescribeImageScanFindingsCommand(input));
        reason = result;
        try {
            const returnComparator = () => {
                return result.imageScanStatus.status;
            };
            if (returnComparator() === "COMPLETE") {
                return { state: util_waiter_1.WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                return result.imageScanStatus.status;
            };
            if (returnComparator() === "FAILED") {
                return { state: util_waiter_1.WaiterState.FAILURE, reason };
            }
        }
        catch (e) { }
    }
    catch (exception) {
        reason = exception;
    }
    return { state: util_waiter_1.WaiterState.RETRY, reason };
};
const waitForImageScanComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 5, maxDelay: 120 };
    return util_waiter_1.createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
exports.waitForImageScanComplete = waitForImageScanComplete;
const waitUntilImageScanComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 5, maxDelay: 120 };
    const result = await util_waiter_1.createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return util_waiter_1.checkExceptions(result);
};
exports.waitUntilImageScanComplete = waitUntilImageScanComplete;


/***/ }),
/* 921 */,
/* 922 */,
/* 923 */,
/* 924 */,
/* 925 */,
/* 926 */,
/* 927 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBoolean = void 0;
const normalizeBoolean = (value) => {
    if (typeof value === "boolean") {
        const promisified = Promise.resolve(value);
        return () => promisified;
    }
    return value;
};
exports.normalizeBoolean = normalizeBoolean;


/***/ }),
/* 928 */,
/* 929 */,
/* 930 */,
/* 931 */,
/* 932 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultRetryDecider = void 0;
const service_error_classification_1 = __webpack_require__(223);
const defaultRetryDecider = (error) => {
    if (!error) {
        return false;
    }
    return service_error_classification_1.isRetryableByTrait(error) || service_error_classification_1.isClockSkewError(error) || service_error_classification_1.isThrottlingError(error) || service_error_classification_1.isTransientError(error);
};
exports.defaultRetryDecider = defaultRetryDecider;


/***/ }),
/* 933 */,
/* 934 */,
/* 935 */,
/* 936 */,
/* 937 */,
/* 938 */,
/* 939 */,
/* 940 */,
/* 941 */,
/* 942 */,
/* 943 */,
/* 944 */,
/* 945 */,
/* 946 */,
/* 947 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateGetLifecyclePolicyPreview = void 0;
const GetLifecyclePolicyPreviewCommand_1 = __webpack_require__(25);
const ECR_1 = __webpack_require__(410);
const ECRClient_1 = __webpack_require__(429);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new GetLifecyclePolicyPreviewCommand_1.GetLifecyclePolicyPreviewCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.getLifecyclePolicyPreview(input, ...args);
};
async function* paginateGetLifecyclePolicyPreview(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof ECR_1.ECR) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof ECRClient_1.ECRClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected ECR | ECRClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateGetLifecyclePolicyPreview = paginateGetLifecyclePolicyPreview;


/***/ }),
/* 948 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(396), exports);
tslib_1.__exportStar(__webpack_require__(359), exports);
tslib_1.__exportStar(__webpack_require__(409), exports);
tslib_1.__exportStar(__webpack_require__(351), exports);


/***/ }),
/* 949 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
var decode_1 = __webpack_require__(253);
var encode_1 = __webpack_require__(306);
/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeXML` or `decodeHTML` directly.
 */
function decode(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
}
exports.decode = decode;
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
 */
function decodeStrict(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
}
exports.decodeStrict = decodeStrict;
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
 */
function encode(data, level) {
    return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
}
exports.encode = encode;
var encode_2 = __webpack_require__(306);
Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function () { return encode_2.encodeXML; } });
Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function () { return encode_2.encodeNonAsciiHTML; } });
Object.defineProperty(exports, "escape", { enumerable: true, get: function () { return encode_2.escape; } });
Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function () { return encode_2.escapeUTF8; } });
// Legacy aliases (deprecated)
Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function () { return encode_2.encodeHTML; } });
var decode_2 = __webpack_require__(253);
Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function () { return decode_2.decodeXML; } });
Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
// Legacy aliases (deprecated)
Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function () { return decode_2.decodeHTML; } });
Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } });
Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function () { return decode_2.decodeXML; } });


/***/ }),
/* 950 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),
/* 951 */,
/* 952 */,
/* 953 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(490), exports);
tslib_1.__exportStar(__webpack_require__(11), exports);
tslib_1.__exportStar(__webpack_require__(871), exports);


/***/ }),
/* 954 */,
/* 955 */,
/* 956 */,
/* 957 */,
/* 958 */,
/* 959 */,
/* 960 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isFipsRegion = void 0;
const isFipsRegion = (region) => typeof region === "string" && (region.startsWith("fips-") || region.endsWith("-fips"));
exports.isFipsRegion = isFipsRegion;


/***/ }),
/* 961 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

const char = function(a) {
  return String.fromCharCode(a);
};

const chars = {
  nilChar: char(176),
  missingChar: char(201),
  nilPremitive: char(175),
  missingPremitive: char(200),

  emptyChar: char(178),
  emptyValue: char(177), //empty Premitive

  boundryChar: char(179),

  objStart: char(198),
  arrStart: char(204),
  arrayEnd: char(185),
};

const charsArr = [
  chars.nilChar,
  chars.nilPremitive,
  chars.missingChar,
  chars.missingPremitive,
  chars.boundryChar,
  chars.emptyChar,
  chars.emptyValue,
  chars.arrayEnd,
  chars.objStart,
  chars.arrStart,
];

const _e = function(node, e_schema, options) {
  if (typeof e_schema === 'string') {
    //premitive
    if (node && node[0] && node[0].val !== undefined) {
      return getValue(node[0].val, e_schema);
    } else {
      return getValue(node, e_schema);
    }
  } else {
    const hasValidData = hasData(node);
    if (hasValidData === true) {
      let str = '';
      if (Array.isArray(e_schema)) {
        //attributes can't be repeated. hence check in children tags only
        str += chars.arrStart;
        const itemSchema = e_schema[0];
        //var itemSchemaType = itemSchema;
        const arr_len = node.length;

        if (typeof itemSchema === 'string') {
          for (let arr_i = 0; arr_i < arr_len; arr_i++) {
            const r = getValue(node[arr_i].val, itemSchema);
            str = processValue(str, r);
          }
        } else {
          for (let arr_i = 0; arr_i < arr_len; arr_i++) {
            const r = _e(node[arr_i], itemSchema, options);
            str = processValue(str, r);
          }
        }
        str += chars.arrayEnd; //indicates that next item is not array item
      } else {
        //object
        str += chars.objStart;
        const keys = Object.keys(e_schema);
        if (Array.isArray(node)) {
          node = node[0];
        }
        for (let i in keys) {
          const key = keys[i];
          //a property defined in schema can be present either in attrsMap or children tags
          //options.textNodeName will not present in both maps, take it's value from val
          //options.attrNodeName will be present in attrsMap
          let r;
          if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
            r = _e(node.attrsMap[key], e_schema[key], options);
          } else if (key === options.textNodeName) {
            r = _e(node.val, e_schema[key], options);
          } else {
            r = _e(node.child[key], e_schema[key], options);
          }
          str = processValue(str, r);
        }
      }
      return str;
    } else {
      return hasValidData;
    }
  }
};

const getValue = function(a /*, type*/) {
  switch (a) {
    case undefined:
      return chars.missingPremitive;
    case null:
      return chars.nilPremitive;
    case '':
      return chars.emptyValue;
    default:
      return a;
  }
};

const processValue = function(str, r) {
  if (!isAppChar(r[0]) && !isAppChar(str[str.length - 1])) {
    str += chars.boundryChar;
  }
  return str + r;
};

const isAppChar = function(ch) {
  return charsArr.indexOf(ch) !== -1;
};

function hasData(jObj) {
  if (jObj === undefined) {
    return chars.missingChar;
  } else if (jObj === null) {
    return chars.nilChar;
  } else if (
    jObj.child &&
    Object.keys(jObj.child).length === 0 &&
    (!jObj.attrsMap || Object.keys(jObj.attrsMap).length === 0)
  ) {
    return chars.emptyChar;
  } else {
    return true;
  }
}

const x2j = __webpack_require__(170);
const buildOptions = __webpack_require__(839).buildOptions;

const convert2nimn = function(node, e_schema, options) {
  options = buildOptions(options, x2j.defaultOptions, x2j.props);
  return _e(node, e_schema, options);
};

exports.convert2nimn = convert2nimn;


/***/ }),
/* 962 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLifecyclePolicyCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class GetLifecyclePolicyCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "GetLifecyclePolicyCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.GetLifecyclePolicyRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.GetLifecyclePolicyResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1GetLifecyclePolicyCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1GetLifecyclePolicyCommand(output, context);
    }
}
exports.GetLifecyclePolicyCommand = GetLifecyclePolicyCommand;


/***/ }),
/* 963 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeAws_queryGetSessionTokenCommand = exports.deserializeAws_queryGetFederationTokenCommand = exports.deserializeAws_queryGetCallerIdentityCommand = exports.deserializeAws_queryGetAccessKeyInfoCommand = exports.deserializeAws_queryDecodeAuthorizationMessageCommand = exports.deserializeAws_queryAssumeRoleWithWebIdentityCommand = exports.deserializeAws_queryAssumeRoleWithSAMLCommand = exports.deserializeAws_queryAssumeRoleCommand = exports.serializeAws_queryGetSessionTokenCommand = exports.serializeAws_queryGetFederationTokenCommand = exports.serializeAws_queryGetCallerIdentityCommand = exports.serializeAws_queryGetAccessKeyInfoCommand = exports.serializeAws_queryDecodeAuthorizationMessageCommand = exports.serializeAws_queryAssumeRoleWithWebIdentityCommand = exports.serializeAws_queryAssumeRoleWithSAMLCommand = exports.serializeAws_queryAssumeRoleCommand = void 0;
const protocol_http_1 = __webpack_require__(504);
const smithy_client_1 = __webpack_require__(973);
const entities_1 = __webpack_require__(949);
const fast_xml_parser_1 = __webpack_require__(989);
const serializeAws_queryAssumeRoleCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryAssumeRoleRequest(input, context),
        Action: "AssumeRole",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryAssumeRoleCommand = serializeAws_queryAssumeRoleCommand;
const serializeAws_queryAssumeRoleWithSAMLCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryAssumeRoleWithSAMLRequest(input, context),
        Action: "AssumeRoleWithSAML",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryAssumeRoleWithSAMLCommand = serializeAws_queryAssumeRoleWithSAMLCommand;
const serializeAws_queryAssumeRoleWithWebIdentityCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryAssumeRoleWithWebIdentityRequest(input, context),
        Action: "AssumeRoleWithWebIdentity",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryAssumeRoleWithWebIdentityCommand = serializeAws_queryAssumeRoleWithWebIdentityCommand;
const serializeAws_queryDecodeAuthorizationMessageCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryDecodeAuthorizationMessageRequest(input, context),
        Action: "DecodeAuthorizationMessage",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryDecodeAuthorizationMessageCommand = serializeAws_queryDecodeAuthorizationMessageCommand;
const serializeAws_queryGetAccessKeyInfoCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryGetAccessKeyInfoRequest(input, context),
        Action: "GetAccessKeyInfo",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryGetAccessKeyInfoCommand = serializeAws_queryGetAccessKeyInfoCommand;
const serializeAws_queryGetCallerIdentityCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryGetCallerIdentityRequest(input, context),
        Action: "GetCallerIdentity",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryGetCallerIdentityCommand = serializeAws_queryGetCallerIdentityCommand;
const serializeAws_queryGetFederationTokenCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryGetFederationTokenRequest(input, context),
        Action: "GetFederationToken",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryGetFederationTokenCommand = serializeAws_queryGetFederationTokenCommand;
const serializeAws_queryGetSessionTokenCommand = async (input, context) => {
    const headers = {
        "content-type": "application/x-www-form-urlencoded",
    };
    let body;
    body = buildFormUrlencodedString({
        ...serializeAws_queryGetSessionTokenRequest(input, context),
        Action: "GetSessionToken",
        Version: "2011-06-15",
    });
    return buildHttpRpcRequest(context, headers, "/", undefined, body);
};
exports.serializeAws_queryGetSessionTokenCommand = serializeAws_queryGetSessionTokenCommand;
const deserializeAws_queryAssumeRoleCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryAssumeRoleCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryAssumeRoleResponse(data.AssumeRoleResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryAssumeRoleCommand = deserializeAws_queryAssumeRoleCommand;
const deserializeAws_queryAssumeRoleCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            response = {
                ...(await deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            response = {
                ...(await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            response = {
                ...(await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            response = {
                ...(await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryAssumeRoleWithSAMLCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryAssumeRoleWithSAMLCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryAssumeRoleWithSAMLResponse(data.AssumeRoleWithSAMLResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryAssumeRoleWithSAMLCommand = deserializeAws_queryAssumeRoleWithSAMLCommand;
const deserializeAws_queryAssumeRoleWithSAMLCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            response = {
                ...(await deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "IDPRejectedClaimException":
        case "com.amazonaws.sts#IDPRejectedClaimException":
            response = {
                ...(await deserializeAws_queryIDPRejectedClaimExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidIdentityTokenException":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
            response = {
                ...(await deserializeAws_queryInvalidIdentityTokenExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            response = {
                ...(await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            response = {
                ...(await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            response = {
                ...(await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryAssumeRoleWithWebIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryAssumeRoleWithWebIdentityCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryAssumeRoleWithWebIdentityResponse(data.AssumeRoleWithWebIdentityResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryAssumeRoleWithWebIdentityCommand = deserializeAws_queryAssumeRoleWithWebIdentityCommand;
const deserializeAws_queryAssumeRoleWithWebIdentityCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "ExpiredTokenException":
        case "com.amazonaws.sts#ExpiredTokenException":
            response = {
                ...(await deserializeAws_queryExpiredTokenExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "IDPCommunicationErrorException":
        case "com.amazonaws.sts#IDPCommunicationErrorException":
            response = {
                ...(await deserializeAws_queryIDPCommunicationErrorExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "IDPRejectedClaimException":
        case "com.amazonaws.sts#IDPRejectedClaimException":
            response = {
                ...(await deserializeAws_queryIDPRejectedClaimExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "InvalidIdentityTokenException":
        case "com.amazonaws.sts#InvalidIdentityTokenException":
            response = {
                ...(await deserializeAws_queryInvalidIdentityTokenExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            response = {
                ...(await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            response = {
                ...(await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            response = {
                ...(await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryDecodeAuthorizationMessageCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryDecodeAuthorizationMessageCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryDecodeAuthorizationMessageResponse(data.DecodeAuthorizationMessageResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryDecodeAuthorizationMessageCommand = deserializeAws_queryDecodeAuthorizationMessageCommand;
const deserializeAws_queryDecodeAuthorizationMessageCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "InvalidAuthorizationMessageException":
        case "com.amazonaws.sts#InvalidAuthorizationMessageException":
            response = {
                ...(await deserializeAws_queryInvalidAuthorizationMessageExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryGetAccessKeyInfoCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryGetAccessKeyInfoCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryGetAccessKeyInfoResponse(data.GetAccessKeyInfoResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryGetAccessKeyInfoCommand = deserializeAws_queryGetAccessKeyInfoCommand;
const deserializeAws_queryGetAccessKeyInfoCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryGetCallerIdentityCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryGetCallerIdentityCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryGetCallerIdentityResponse(data.GetCallerIdentityResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryGetCallerIdentityCommand = deserializeAws_queryGetCallerIdentityCommand;
const deserializeAws_queryGetCallerIdentityCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryGetFederationTokenCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryGetFederationTokenCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryGetFederationTokenResponse(data.GetFederationTokenResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryGetFederationTokenCommand = deserializeAws_queryGetFederationTokenCommand;
const deserializeAws_queryGetFederationTokenCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "MalformedPolicyDocumentException":
        case "com.amazonaws.sts#MalformedPolicyDocumentException":
            response = {
                ...(await deserializeAws_queryMalformedPolicyDocumentExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "PackedPolicyTooLargeException":
        case "com.amazonaws.sts#PackedPolicyTooLargeException":
            response = {
                ...(await deserializeAws_queryPackedPolicyTooLargeExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            response = {
                ...(await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryGetSessionTokenCommand = async (output, context) => {
    if (output.statusCode >= 300) {
        return deserializeAws_queryGetSessionTokenCommandError(output, context);
    }
    const data = await parseBody(output.body, context);
    let contents = {};
    contents = deserializeAws_queryGetSessionTokenResponse(data.GetSessionTokenResult, context);
    const response = {
        $metadata: deserializeMetadata(output),
        ...contents,
    };
    return Promise.resolve(response);
};
exports.deserializeAws_queryGetSessionTokenCommand = deserializeAws_queryGetSessionTokenCommand;
const deserializeAws_queryGetSessionTokenCommandError = async (output, context) => {
    const parsedOutput = {
        ...output,
        body: await parseBody(output.body, context),
    };
    let response;
    let errorCode = "UnknownError";
    errorCode = loadQueryErrorCode(output, parsedOutput.body);
    switch (errorCode) {
        case "RegionDisabledException":
        case "com.amazonaws.sts#RegionDisabledException":
            response = {
                ...(await deserializeAws_queryRegionDisabledExceptionResponse(parsedOutput, context)),
                name: errorCode,
                $metadata: deserializeMetadata(output),
            };
            break;
        default:
            const parsedBody = parsedOutput.body;
            errorCode = parsedBody.Error.code || parsedBody.Error.Code || errorCode;
            response = {
                ...parsedBody.Error,
                name: `${errorCode}`,
                message: parsedBody.Error.message || parsedBody.Error.Message || errorCode,
                $fault: "client",
                $metadata: deserializeMetadata(output),
            };
    }
    const message = response.message || response.Message || errorCode;
    response.message = message;
    delete response.Message;
    return Promise.reject(Object.assign(new Error(message), response));
};
const deserializeAws_queryExpiredTokenExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryExpiredTokenException(body.Error, context);
    const contents = {
        name: "ExpiredTokenException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryIDPCommunicationErrorExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryIDPCommunicationErrorException(body.Error, context);
    const contents = {
        name: "IDPCommunicationErrorException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryIDPRejectedClaimExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryIDPRejectedClaimException(body.Error, context);
    const contents = {
        name: "IDPRejectedClaimException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryInvalidAuthorizationMessageExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryInvalidAuthorizationMessageException(body.Error, context);
    const contents = {
        name: "InvalidAuthorizationMessageException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryInvalidIdentityTokenExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryInvalidIdentityTokenException(body.Error, context);
    const contents = {
        name: "InvalidIdentityTokenException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryMalformedPolicyDocumentExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryMalformedPolicyDocumentException(body.Error, context);
    const contents = {
        name: "MalformedPolicyDocumentException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryPackedPolicyTooLargeExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryPackedPolicyTooLargeException(body.Error, context);
    const contents = {
        name: "PackedPolicyTooLargeException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const deserializeAws_queryRegionDisabledExceptionResponse = async (parsedOutput, context) => {
    const body = parsedOutput.body;
    const deserialized = deserializeAws_queryRegionDisabledException(body.Error, context);
    const contents = {
        name: "RegionDisabledException",
        $fault: "client",
        $metadata: deserializeMetadata(parsedOutput),
        ...deserialized,
    };
    return contents;
};
const serializeAws_queryAssumeRoleRequest = (input, context) => {
    const entries = {};
    if (input.RoleArn !== undefined && input.RoleArn !== null) {
        entries["RoleArn"] = input.RoleArn;
    }
    if (input.RoleSessionName !== undefined && input.RoleSessionName !== null) {
        entries["RoleSessionName"] = input.RoleSessionName;
    }
    if (input.PolicyArns !== undefined && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.Policy !== undefined && input.Policy !== null) {
        entries["Policy"] = input.Policy;
    }
    if (input.DurationSeconds !== undefined && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    if (input.Tags !== undefined && input.Tags !== null) {
        const memberEntries = serializeAws_querytagListType(input.Tags, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    if (input.TransitiveTagKeys !== undefined && input.TransitiveTagKeys !== null) {
        const memberEntries = serializeAws_querytagKeyListType(input.TransitiveTagKeys, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `TransitiveTagKeys.${key}`;
            entries[loc] = value;
        });
    }
    if (input.ExternalId !== undefined && input.ExternalId !== null) {
        entries["ExternalId"] = input.ExternalId;
    }
    if (input.SerialNumber !== undefined && input.SerialNumber !== null) {
        entries["SerialNumber"] = input.SerialNumber;
    }
    if (input.TokenCode !== undefined && input.TokenCode !== null) {
        entries["TokenCode"] = input.TokenCode;
    }
    if (input.SourceIdentity !== undefined && input.SourceIdentity !== null) {
        entries["SourceIdentity"] = input.SourceIdentity;
    }
    return entries;
};
const serializeAws_queryAssumeRoleWithSAMLRequest = (input, context) => {
    const entries = {};
    if (input.RoleArn !== undefined && input.RoleArn !== null) {
        entries["RoleArn"] = input.RoleArn;
    }
    if (input.PrincipalArn !== undefined && input.PrincipalArn !== null) {
        entries["PrincipalArn"] = input.PrincipalArn;
    }
    if (input.SAMLAssertion !== undefined && input.SAMLAssertion !== null) {
        entries["SAMLAssertion"] = input.SAMLAssertion;
    }
    if (input.PolicyArns !== undefined && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.Policy !== undefined && input.Policy !== null) {
        entries["Policy"] = input.Policy;
    }
    if (input.DurationSeconds !== undefined && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    return entries;
};
const serializeAws_queryAssumeRoleWithWebIdentityRequest = (input, context) => {
    const entries = {};
    if (input.RoleArn !== undefined && input.RoleArn !== null) {
        entries["RoleArn"] = input.RoleArn;
    }
    if (input.RoleSessionName !== undefined && input.RoleSessionName !== null) {
        entries["RoleSessionName"] = input.RoleSessionName;
    }
    if (input.WebIdentityToken !== undefined && input.WebIdentityToken !== null) {
        entries["WebIdentityToken"] = input.WebIdentityToken;
    }
    if (input.ProviderId !== undefined && input.ProviderId !== null) {
        entries["ProviderId"] = input.ProviderId;
    }
    if (input.PolicyArns !== undefined && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.Policy !== undefined && input.Policy !== null) {
        entries["Policy"] = input.Policy;
    }
    if (input.DurationSeconds !== undefined && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    return entries;
};
const serializeAws_queryDecodeAuthorizationMessageRequest = (input, context) => {
    const entries = {};
    if (input.EncodedMessage !== undefined && input.EncodedMessage !== null) {
        entries["EncodedMessage"] = input.EncodedMessage;
    }
    return entries;
};
const serializeAws_queryGetAccessKeyInfoRequest = (input, context) => {
    const entries = {};
    if (input.AccessKeyId !== undefined && input.AccessKeyId !== null) {
        entries["AccessKeyId"] = input.AccessKeyId;
    }
    return entries;
};
const serializeAws_queryGetCallerIdentityRequest = (input, context) => {
    const entries = {};
    return entries;
};
const serializeAws_queryGetFederationTokenRequest = (input, context) => {
    const entries = {};
    if (input.Name !== undefined && input.Name !== null) {
        entries["Name"] = input.Name;
    }
    if (input.Policy !== undefined && input.Policy !== null) {
        entries["Policy"] = input.Policy;
    }
    if (input.PolicyArns !== undefined && input.PolicyArns !== null) {
        const memberEntries = serializeAws_querypolicyDescriptorListType(input.PolicyArns, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `PolicyArns.${key}`;
            entries[loc] = value;
        });
    }
    if (input.DurationSeconds !== undefined && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    if (input.Tags !== undefined && input.Tags !== null) {
        const memberEntries = serializeAws_querytagListType(input.Tags, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            const loc = `Tags.${key}`;
            entries[loc] = value;
        });
    }
    return entries;
};
const serializeAws_queryGetSessionTokenRequest = (input, context) => {
    const entries = {};
    if (input.DurationSeconds !== undefined && input.DurationSeconds !== null) {
        entries["DurationSeconds"] = input.DurationSeconds;
    }
    if (input.SerialNumber !== undefined && input.SerialNumber !== null) {
        entries["SerialNumber"] = input.SerialNumber;
    }
    if (input.TokenCode !== undefined && input.TokenCode !== null) {
        entries["TokenCode"] = input.TokenCode;
    }
    return entries;
};
const serializeAws_querypolicyDescriptorListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = serializeAws_queryPolicyDescriptorType(entry, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const serializeAws_queryPolicyDescriptorType = (input, context) => {
    const entries = {};
    if (input.arn !== undefined && input.arn !== null) {
        entries["arn"] = input.arn;
    }
    return entries;
};
const serializeAws_queryTag = (input, context) => {
    const entries = {};
    if (input.Key !== undefined && input.Key !== null) {
        entries["Key"] = input.Key;
    }
    if (input.Value !== undefined && input.Value !== null) {
        entries["Value"] = input.Value;
    }
    return entries;
};
const serializeAws_querytagKeyListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        entries[`member.${counter}`] = entry;
        counter++;
    }
    return entries;
};
const serializeAws_querytagListType = (input, context) => {
    const entries = {};
    let counter = 1;
    for (const entry of input) {
        if (entry === null) {
            continue;
        }
        const memberEntries = serializeAws_queryTag(entry, context);
        Object.entries(memberEntries).forEach(([key, value]) => {
            entries[`member.${counter}.${key}`] = value;
        });
        counter++;
    }
    return entries;
};
const deserializeAws_queryAssumedRoleUser = (output, context) => {
    const contents = {
        AssumedRoleId: undefined,
        Arn: undefined,
    };
    if (output["AssumedRoleId"] !== undefined) {
        contents.AssumedRoleId = smithy_client_1.expectString(output["AssumedRoleId"]);
    }
    if (output["Arn"] !== undefined) {
        contents.Arn = smithy_client_1.expectString(output["Arn"]);
    }
    return contents;
};
const deserializeAws_queryAssumeRoleResponse = (output, context) => {
    const contents = {
        Credentials: undefined,
        AssumedRoleUser: undefined,
        PackedPolicySize: undefined,
        SourceIdentity: undefined,
    };
    if (output["Credentials"] !== undefined) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
    }
    if (output["AssumedRoleUser"] !== undefined) {
        contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = smithy_client_1.strictParseInt32(output["PackedPolicySize"]);
    }
    if (output["SourceIdentity"] !== undefined) {
        contents.SourceIdentity = smithy_client_1.expectString(output["SourceIdentity"]);
    }
    return contents;
};
const deserializeAws_queryAssumeRoleWithSAMLResponse = (output, context) => {
    const contents = {
        Credentials: undefined,
        AssumedRoleUser: undefined,
        PackedPolicySize: undefined,
        Subject: undefined,
        SubjectType: undefined,
        Issuer: undefined,
        Audience: undefined,
        NameQualifier: undefined,
        SourceIdentity: undefined,
    };
    if (output["Credentials"] !== undefined) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
    }
    if (output["AssumedRoleUser"] !== undefined) {
        contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = smithy_client_1.strictParseInt32(output["PackedPolicySize"]);
    }
    if (output["Subject"] !== undefined) {
        contents.Subject = smithy_client_1.expectString(output["Subject"]);
    }
    if (output["SubjectType"] !== undefined) {
        contents.SubjectType = smithy_client_1.expectString(output["SubjectType"]);
    }
    if (output["Issuer"] !== undefined) {
        contents.Issuer = smithy_client_1.expectString(output["Issuer"]);
    }
    if (output["Audience"] !== undefined) {
        contents.Audience = smithy_client_1.expectString(output["Audience"]);
    }
    if (output["NameQualifier"] !== undefined) {
        contents.NameQualifier = smithy_client_1.expectString(output["NameQualifier"]);
    }
    if (output["SourceIdentity"] !== undefined) {
        contents.SourceIdentity = smithy_client_1.expectString(output["SourceIdentity"]);
    }
    return contents;
};
const deserializeAws_queryAssumeRoleWithWebIdentityResponse = (output, context) => {
    const contents = {
        Credentials: undefined,
        SubjectFromWebIdentityToken: undefined,
        AssumedRoleUser: undefined,
        PackedPolicySize: undefined,
        Provider: undefined,
        Audience: undefined,
        SourceIdentity: undefined,
    };
    if (output["Credentials"] !== undefined) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
    }
    if (output["SubjectFromWebIdentityToken"] !== undefined) {
        contents.SubjectFromWebIdentityToken = smithy_client_1.expectString(output["SubjectFromWebIdentityToken"]);
    }
    if (output["AssumedRoleUser"] !== undefined) {
        contents.AssumedRoleUser = deserializeAws_queryAssumedRoleUser(output["AssumedRoleUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = smithy_client_1.strictParseInt32(output["PackedPolicySize"]);
    }
    if (output["Provider"] !== undefined) {
        contents.Provider = smithy_client_1.expectString(output["Provider"]);
    }
    if (output["Audience"] !== undefined) {
        contents.Audience = smithy_client_1.expectString(output["Audience"]);
    }
    if (output["SourceIdentity"] !== undefined) {
        contents.SourceIdentity = smithy_client_1.expectString(output["SourceIdentity"]);
    }
    return contents;
};
const deserializeAws_queryCredentials = (output, context) => {
    const contents = {
        AccessKeyId: undefined,
        SecretAccessKey: undefined,
        SessionToken: undefined,
        Expiration: undefined,
    };
    if (output["AccessKeyId"] !== undefined) {
        contents.AccessKeyId = smithy_client_1.expectString(output["AccessKeyId"]);
    }
    if (output["SecretAccessKey"] !== undefined) {
        contents.SecretAccessKey = smithy_client_1.expectString(output["SecretAccessKey"]);
    }
    if (output["SessionToken"] !== undefined) {
        contents.SessionToken = smithy_client_1.expectString(output["SessionToken"]);
    }
    if (output["Expiration"] !== undefined) {
        contents.Expiration = smithy_client_1.expectNonNull(smithy_client_1.parseRfc3339DateTime(output["Expiration"]));
    }
    return contents;
};
const deserializeAws_queryDecodeAuthorizationMessageResponse = (output, context) => {
    const contents = {
        DecodedMessage: undefined,
    };
    if (output["DecodedMessage"] !== undefined) {
        contents.DecodedMessage = smithy_client_1.expectString(output["DecodedMessage"]);
    }
    return contents;
};
const deserializeAws_queryExpiredTokenException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryFederatedUser = (output, context) => {
    const contents = {
        FederatedUserId: undefined,
        Arn: undefined,
    };
    if (output["FederatedUserId"] !== undefined) {
        contents.FederatedUserId = smithy_client_1.expectString(output["FederatedUserId"]);
    }
    if (output["Arn"] !== undefined) {
        contents.Arn = smithy_client_1.expectString(output["Arn"]);
    }
    return contents;
};
const deserializeAws_queryGetAccessKeyInfoResponse = (output, context) => {
    const contents = {
        Account: undefined,
    };
    if (output["Account"] !== undefined) {
        contents.Account = smithy_client_1.expectString(output["Account"]);
    }
    return contents;
};
const deserializeAws_queryGetCallerIdentityResponse = (output, context) => {
    const contents = {
        UserId: undefined,
        Account: undefined,
        Arn: undefined,
    };
    if (output["UserId"] !== undefined) {
        contents.UserId = smithy_client_1.expectString(output["UserId"]);
    }
    if (output["Account"] !== undefined) {
        contents.Account = smithy_client_1.expectString(output["Account"]);
    }
    if (output["Arn"] !== undefined) {
        contents.Arn = smithy_client_1.expectString(output["Arn"]);
    }
    return contents;
};
const deserializeAws_queryGetFederationTokenResponse = (output, context) => {
    const contents = {
        Credentials: undefined,
        FederatedUser: undefined,
        PackedPolicySize: undefined,
    };
    if (output["Credentials"] !== undefined) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
    }
    if (output["FederatedUser"] !== undefined) {
        contents.FederatedUser = deserializeAws_queryFederatedUser(output["FederatedUser"], context);
    }
    if (output["PackedPolicySize"] !== undefined) {
        contents.PackedPolicySize = smithy_client_1.strictParseInt32(output["PackedPolicySize"]);
    }
    return contents;
};
const deserializeAws_queryGetSessionTokenResponse = (output, context) => {
    const contents = {
        Credentials: undefined,
    };
    if (output["Credentials"] !== undefined) {
        contents.Credentials = deserializeAws_queryCredentials(output["Credentials"], context);
    }
    return contents;
};
const deserializeAws_queryIDPCommunicationErrorException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryIDPRejectedClaimException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryInvalidAuthorizationMessageException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryInvalidIdentityTokenException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryMalformedPolicyDocumentException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryPackedPolicyTooLargeException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeAws_queryRegionDisabledException = (output, context) => {
    const contents = {
        message: undefined,
    };
    if (output["message"] !== undefined) {
        contents.message = smithy_client_1.expectString(output["message"]);
    }
    return contents;
};
const deserializeMetadata = (output) => {
    var _a;
    return ({
        httpStatusCode: output.statusCode,
        requestId: (_a = output.headers["x-amzn-requestid"]) !== null && _a !== void 0 ? _a : output.headers["x-amzn-request-id"],
        extendedRequestId: output.headers["x-amz-id-2"],
        cfId: output.headers["x-amz-cf-id"],
    });
};
const collectBody = (streamBody = new Uint8Array(), context) => {
    if (streamBody instanceof Uint8Array) {
        return Promise.resolve(streamBody);
    }
    return context.streamCollector(streamBody) || Promise.resolve(new Uint8Array());
};
const collectBodyString = (streamBody, context) => collectBody(streamBody, context).then((body) => context.utf8Encoder(body));
const buildHttpRpcRequest = async (context, headers, path, resolvedHostname, body) => {
    const { hostname, protocol = "https", port, path: basePath } = await context.endpoint();
    const contents = {
        protocol,
        hostname,
        port,
        method: "POST",
        path: basePath.endsWith("/") ? basePath.slice(0, -1) + path : basePath + path,
        headers,
    };
    if (resolvedHostname !== undefined) {
        contents.hostname = resolvedHostname;
    }
    if (body !== undefined) {
        contents.body = body;
    }
    return new protocol_http_1.HttpRequest(contents);
};
const parseBody = (streamBody, context) => collectBodyString(streamBody, context).then((encoded) => {
    if (encoded.length) {
        const parsedObj = fast_xml_parser_1.parse(encoded, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseNodeValue: false,
            trimValues: false,
            tagValueProcessor: (val) => (val.trim() === "" && val.includes("\n") ? "" : entities_1.decodeHTML(val)),
        });
        const textNodeName = "#text";
        const key = Object.keys(parsedObj)[0];
        const parsedObjToReturn = parsedObj[key];
        if (parsedObjToReturn[textNodeName]) {
            parsedObjToReturn[key] = parsedObjToReturn[textNodeName];
            delete parsedObjToReturn[textNodeName];
        }
        return smithy_client_1.getValueFromTextNode(parsedObjToReturn);
    }
    return {};
});
const buildFormUrlencodedString = (formEntries) => Object.entries(formEntries)
    .map(([key, value]) => smithy_client_1.extendedEncodeURIComponent(key) + "=" + smithy_client_1.extendedEncodeURIComponent(value))
    .join("&");
const loadQueryErrorCode = (output, data) => {
    if (data.Error.Code !== undefined) {
        return data.Error.Code;
    }
    if (output.statusCode == 404) {
        return "NotFound";
    }
    return "";
};


/***/ }),
/* 964 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fromProcess = exports.ENV_PROFILE = void 0;
const property_provider_1 = __webpack_require__(948);
const util_credentials_1 = __webpack_require__(339);
const child_process_1 = __webpack_require__(129);
exports.ENV_PROFILE = "AWS_PROFILE";
const fromProcess = (init = {}) => async () => {
    const profiles = await util_credentials_1.parseKnownFiles(init);
    return resolveProcessCredentials(util_credentials_1.getMasterProfileName(init), profiles);
};
exports.fromProcess = fromProcess;
const resolveProcessCredentials = async (profileName, profiles) => {
    const profile = profiles[profileName];
    if (profiles[profileName]) {
        const credentialProcess = profile["credential_process"];
        if (credentialProcess !== undefined) {
            return await execPromise(credentialProcess)
                .then((processResult) => {
                let data;
                try {
                    data = JSON.parse(processResult);
                }
                catch (_a) {
                    throw Error(`Profile ${profileName} credential_process returned invalid JSON.`);
                }
                const { Version: version, AccessKeyId: accessKeyId, SecretAccessKey: secretAccessKey, SessionToken: sessionToken, Expiration: expiration, } = data;
                if (version !== 1) {
                    throw Error(`Profile ${profileName} credential_process did not return Version 1.`);
                }
                if (accessKeyId === undefined || secretAccessKey === undefined) {
                    throw Error(`Profile ${profileName} credential_process returned invalid credentials.`);
                }
                let expirationUnix;
                if (expiration) {
                    const currentTime = new Date();
                    const expireTime = new Date(expiration);
                    if (expireTime < currentTime) {
                        throw Error(`Profile ${profileName} credential_process returned expired credentials.`);
                    }
                    expirationUnix = Math.floor(new Date(expiration).valueOf() / 1000);
                }
                return {
                    accessKeyId,
                    secretAccessKey,
                    sessionToken,
                    expirationUnix,
                };
            })
                .catch((error) => {
                throw new property_provider_1.CredentialsProviderError(error.message);
            });
        }
        else {
            throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} did not contain credential_process.`);
        }
    }
    else {
        throw new property_provider_1.CredentialsProviderError(`Profile ${profileName} could not be found in shared credentials file.`);
    }
};
const execPromise = (command) => new Promise(function (resolve, reject) {
    child_process_1.exec(command, (error, stdout) => {
        if (error) {
            reject(error);
            return;
        }
        resolve(stdout.trim());
    });
});


/***/ }),
/* 965 */,
/* 966 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(163), exports);


/***/ }),
/* 967 */,
/* 968 */,
/* 969 */,
/* 970 */,
/* 971 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const util = __webpack_require__(839);

const defaultOptions = {
  allowBooleanAttributes: false, //A tag can have attributes without any value
};

const props = ['allowBooleanAttributes'];

//const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function (xmlData, options) {
  options = util.buildOptions(options, defaultOptions, props);

  //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE
  const tags = [];
  let tagFound = false;

  //indicates that the root tag has been closed (aka. depth 0 has been reached)
  let reachedRoot = false;

  if (xmlData[0] === '\ufeff') {
    // check for byte order mark (BOM)
    xmlData = xmlData.substr(1);
  }

  for (let i = 0; i < xmlData.length; i++) {

    if (xmlData[i] === '<' && xmlData[i+1] === '?') {
      i+=2;
      i = readPI(xmlData,i);
      if (i.err) return i;
    }else if (xmlData[i] === '<') {
      //starting of tag
      //read until you reach to '>' avoiding any '>' in attribute value

      i++;
      
      if (xmlData[i] === '!') {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        let closingTag = false;
        if (xmlData[i] === '/') {
          //closing tag
          closingTag = true;
          i++;
        }
        //read tagname
        let tagName = '';
        for (; i < xmlData.length &&
          xmlData[i] !== '>' &&
          xmlData[i] !== ' ' &&
          xmlData[i] !== '\t' &&
          xmlData[i] !== '\n' &&
          xmlData[i] !== '\r'; i++
        ) {
          tagName += xmlData[i];
        }
        tagName = tagName.trim();
        //console.log(tagName);

        if (tagName[tagName.length - 1] === '/') {
          //self closing tag without attributes
          tagName = tagName.substring(0, tagName.length - 1);
          //continue;
          i--;
        }
        if (!validateTagName(tagName)) {
          let msg;
          if (tagName.trim().length === 0) {
            msg = "There is an unnecessary space between tag name and backward slash '</ ..'.";
          } else {
            msg = "Tag '"+tagName+"' is an invalid name.";
          }
          return getErrorObject('InvalidTag', msg, getLineNumberForPosition(xmlData, i));
        }

        const result = readAttributeStr(xmlData, i);
        if (result === false) {
          return getErrorObject('InvalidAttr', "Attributes for '"+tagName+"' have open quote.", getLineNumberForPosition(xmlData, i));
        }
        let attrStr = result.value;
        i = result.index;

        if (attrStr[attrStr.length - 1] === '/') {
          //self closing tag
          attrStr = attrStr.substring(0, attrStr.length - 1);
          const isValid = validateAttributeString(attrStr, options);
          if (isValid === true) {
            tagFound = true;
            //continue; //text may presents after self closing tag
          } else {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
          } else if (attrStr.trim().length > 0) {
            return getErrorObject('InvalidTag', "Closing tag '"+tagName+"' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, i));
          } else {
            const otg = tags.pop();
            if (tagName !== otg) {
              return getErrorObject('InvalidTag', "Closing tag '"+otg+"' is expected inplace of '"+tagName+"'.", getLineNumberForPosition(xmlData, i));
            }

            //when there are no more tags, we reached the root level.
            if (tags.length == 0) {
              reachedRoot = true;
            }
          }
        } else {
          const isValid = validateAttributeString(attrStr, options);
          if (isValid !== true) {
            //the result from the nested function returns the position of the error within the attribute
            //in order to get the 'true' error line, we need to calculate the position where the attribute begins (i - attrStr.length) and then add the position within the attribute
            //this gives us the absolute index in the entire xml, which we can use to find the line at last
            return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
          }

          //if the root level has been reached before ...
          if (reachedRoot === true) {
            return getErrorObject('InvalidXml', 'Multiple possible root nodes found.', getLineNumberForPosition(xmlData, i));
          } else {
            tags.push(tagName);
          }
          tagFound = true;
        }

        //skip tag text value
        //It may include comments and CDATA value
        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === '<') {
            if (xmlData[i + 1] === '!') {
              //comment or CADATA
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else if (xmlData[i+1] === '?') {
              i = readPI(xmlData, ++i);
              if (i.err) return i;
            } else{
              break;
            }
          } else if (xmlData[i] === '&') {
            const afterAmp = validateAmpersand(xmlData, i);
            if (afterAmp == -1)
              return getErrorObject('InvalidChar', "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
            i = afterAmp;
          }
        } //end of reading tag text value
        if (xmlData[i] === '<') {
          i--;
        }
      }
    } else {
      if (xmlData[i] === ' ' || xmlData[i] === '\t' || xmlData[i] === '\n' || xmlData[i] === '\r') {
        continue;
      }
      return getErrorObject('InvalidChar', "char '"+xmlData[i]+"' is not expected.", getLineNumberForPosition(xmlData, i));
    }
  }

  if (!tagFound) {
    return getErrorObject('InvalidXml', 'Start tag expected.', 1);
  } else if (tags.length > 0) {
    return getErrorObject('InvalidXml', "Invalid '"+JSON.stringify(tags, null, 4).replace(/\r?\n/g, '')+"' found.", 1);
  }

  return true;
};

/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */
function readPI(xmlData, i) {
  var start = i;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] == '?' || xmlData[i] == ' ') {
      //tagname
      var tagname = xmlData.substr(start, i - start);
      if (i > 5 && tagname === 'xml') {
        return getErrorObject('InvalidXml', 'XML declaration allowed only at the start of the document.', getLineNumberForPosition(xmlData, i));
      } else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
        //check if valid attribut string
        i++;
        break;
      } else {
        continue;
      }
    }
  }
  return i;
}

function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
    //comment
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  } else if (
    xmlData.length > i + 8 &&
    xmlData[i + 1] === 'D' &&
    xmlData[i + 2] === 'O' &&
    xmlData[i + 3] === 'C' &&
    xmlData[i + 4] === 'T' &&
    xmlData[i + 5] === 'Y' &&
    xmlData[i + 6] === 'P' &&
    xmlData[i + 7] === 'E'
  ) {
    let angleBracketsCount = 1;
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === '<') {
        angleBracketsCount++;
      } else if (xmlData[i] === '>') {
        angleBracketsCount--;
        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (
    xmlData.length > i + 9 &&
    xmlData[i + 1] === '[' &&
    xmlData[i + 2] === 'C' &&
    xmlData[i + 3] === 'D' &&
    xmlData[i + 4] === 'A' &&
    xmlData[i + 5] === 'T' &&
    xmlData[i + 6] === 'A' &&
    xmlData[i + 7] === '['
  ) {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  }

  return i;
}

var doubleQuote = '"';
var singleQuote = "'";

/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */
function readAttributeStr(xmlData, i) {
  let attrStr = '';
  let startChar = '';
  let tagClosed = false;
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === '') {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
        //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
        continue;
      } else {
        startChar = '';
      }
    } else if (xmlData[i] === '>') {
      if (startChar === '') {
        tagClosed = true;
        break;
      }
    }
    attrStr += xmlData[i];
  }
  if (startChar !== '') {
    return false;
  }

  return {
    value: attrStr,
    index: i,
    tagClosed: tagClosed
  };
}

/**
 * Select all the attributes whether valid or invalid.
 */
const validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g');

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr, options) {
  //console.log("start:"+attrStr+":end");

  //if(attrStr.trim().length === 0) return true; //empty string

  const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
  const attrNames = {};

  for (let i = 0; i < matches.length; i++) {
    if (matches[i][1].length === 0) {
      //nospace before attribute name: a="sd"b="saf"
      return getErrorObject('InvalidAttr', "Attribute '"+matches[i][2]+"' has no space in starting.", getPositionFromMatch(attrStr, matches[i][0]))
    } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
      //independent attribute: ab
      return getErrorObject('InvalidAttr', "boolean attribute '"+matches[i][2]+"' is not allowed.", getPositionFromMatch(attrStr, matches[i][0]));
    }
    /* else if(matches[i][6] === undefined){//attribute without value: ab=
                    return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
                } */
    const attrName = matches[i][2];
    if (!validateAttrName(attrName)) {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is an invalid name.", getPositionFromMatch(attrStr, matches[i][0]));
    }
    if (!attrNames.hasOwnProperty(attrName)) {
      //check for duplicate attribute.
      attrNames[attrName] = 1;
    } else {
      return getErrorObject('InvalidAttr', "Attribute '"+attrName+"' is repeated.", getPositionFromMatch(attrStr, matches[i][0]));
    }
  }

  return true;
}

function validateNumberAmpersand(xmlData, i) {
  let re = /\d/;
  if (xmlData[i] === 'x') {
    i++;
    re = /[\da-fA-F]/;
  }
  for (; i < xmlData.length; i++) {
    if (xmlData[i] === ';')
      return i;
    if (!xmlData[i].match(re))
      break;
  }
  return -1;
}

function validateAmpersand(xmlData, i) {
  // https://www.w3.org/TR/xml/#dt-charref
  i++;
  if (xmlData[i] === ';')
    return -1;
  if (xmlData[i] === '#') {
    i++;
    return validateNumberAmpersand(xmlData, i);
  }
  let count = 0;
  for (; i < xmlData.length; i++, count++) {
    if (xmlData[i].match(/\w/) && count < 20)
      continue;
    if (xmlData[i] === ';')
      break;
    return -1;
  }
  return i;
}

function getErrorObject(code, message, lineNumber) {
  return {
    err: {
      code: code,
      msg: message,
      line: lineNumber,
    },
  };
}

function validateAttrName(attrName) {
  return util.isName(attrName);
}

// const startsWithXML = /^xml/i;

function validateTagName(tagname) {
  return util.isName(tagname) /* && !tagname.match(startsWithXML) */;
}

//this function returns the line number for the character at the given index
function getLineNumberForPosition(xmlData, index) {
  var lines = xmlData.substring(0, index).split(/\r?\n/);
  return lines.length;
}

//this function returns the position of the last character of match within attrStr
function getPositionFromMatch(attrStr, match) {
  return attrStr.indexOf(match) + match.length;
}


/***/ }),
/* 972 */,
/* 973 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(634), exports);
tslib_1.__exportStar(__webpack_require__(118), exports);
tslib_1.__exportStar(__webpack_require__(868), exports);
tslib_1.__exportStar(__webpack_require__(62), exports);
tslib_1.__exportStar(__webpack_require__(633), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(710), exports);
tslib_1.__exportStar(__webpack_require__(333), exports);
tslib_1.__exportStar(__webpack_require__(765), exports);
tslib_1.__exportStar(__webpack_require__(816), exports);
tslib_1.__exportStar(__webpack_require__(891), exports);
tslib_1.__exportStar(__webpack_require__(461), exports);


/***/ }),
/* 974 */,
/* 975 */,
/* 976 */,
/* 977 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = __webpack_require__(422);
tslib_1.__exportStar(__webpack_require__(896), exports);
tslib_1.__exportStar(__webpack_require__(61), exports);
tslib_1.__exportStar(__webpack_require__(563), exports);
tslib_1.__exportStar(__webpack_require__(914), exports);
tslib_1.__exportStar(__webpack_require__(44), exports);
tslib_1.__exportStar(__webpack_require__(395), exports);
tslib_1.__exportStar(__webpack_require__(317), exports);
tslib_1.__exportStar(__webpack_require__(778), exports);
tslib_1.__exportStar(__webpack_require__(229), exports);
tslib_1.__exportStar(__webpack_require__(296), exports);
tslib_1.__exportStar(__webpack_require__(981), exports);
tslib_1.__exportStar(__webpack_require__(174), exports);
tslib_1.__exportStar(__webpack_require__(446), exports);
tslib_1.__exportStar(__webpack_require__(287), exports);
tslib_1.__exportStar(__webpack_require__(712), exports);
tslib_1.__exportStar(__webpack_require__(658), exports);
tslib_1.__exportStar(__webpack_require__(962), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(864), exports);
tslib_1.__exportStar(__webpack_require__(774), exports);
tslib_1.__exportStar(__webpack_require__(79), exports);
tslib_1.__exportStar(__webpack_require__(652), exports);
tslib_1.__exportStar(__webpack_require__(674), exports);
tslib_1.__exportStar(__webpack_require__(434), exports);
tslib_1.__exportStar(__webpack_require__(825), exports);
tslib_1.__exportStar(__webpack_require__(511), exports);
tslib_1.__exportStar(__webpack_require__(179), exports);
tslib_1.__exportStar(__webpack_require__(98), exports);
tslib_1.__exportStar(__webpack_require__(802), exports);
tslib_1.__exportStar(__webpack_require__(50), exports);
tslib_1.__exportStar(__webpack_require__(401), exports);
tslib_1.__exportStar(__webpack_require__(991), exports);
tslib_1.__exportStar(__webpack_require__(561), exports);
tslib_1.__exportStar(__webpack_require__(639), exports);
tslib_1.__exportStar(__webpack_require__(654), exports);


/***/ }),
/* 978 */,
/* 979 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.buildQueryString = void 0;
const util_uri_escape_1 = __webpack_require__(392);
function buildQueryString(query) {
    const parts = [];
    for (let key of Object.keys(query).sort()) {
        const value = query[key];
        key = util_uri_escape_1.escapeUri(key);
        if (Array.isArray(value)) {
            for (let i = 0, iLen = value.length; i < iLen; i++) {
                parts.push(`${key}=${util_uri_escape_1.escapeUri(value[i])}`);
            }
        }
        else {
            let qsEntry = key;
            if (value || typeof value === "string") {
                qsEntry += `=${util_uri_escape_1.escapeUri(value)}`;
            }
            parts.push(qsEntry);
        }
    }
    return parts.join("&");
}
exports.buildQueryString = buildQueryString;


/***/ }),
/* 980 */,
/* 981 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DescribeImageScanFindingsCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class DescribeImageScanFindingsCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "DescribeImageScanFindingsCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.DescribeImageScanFindingsRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.DescribeImageScanFindingsResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1DescribeImageScanFindingsCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1DescribeImageScanFindingsCommand(output, context);
    }
}
exports.DescribeImageScanFindingsCommand = DescribeImageScanFindingsCommand;


/***/ }),
/* 982 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateDescribeImages = void 0;
const DescribeImagesCommand_1 = __webpack_require__(174);
const ECR_1 = __webpack_require__(410);
const ECRClient_1 = __webpack_require__(429);
const makePagedClientRequest = async (client, input, ...args) => {
    return await client.send(new DescribeImagesCommand_1.DescribeImagesCommand(input), ...args);
};
const makePagedRequest = async (client, input, ...args) => {
    return await client.describeImages(input, ...args);
};
async function* paginateDescribeImages(config, input, ...additionalArguments) {
    let token = config.startingToken || undefined;
    let hasNext = true;
    let page;
    while (hasNext) {
        input.nextToken = token;
        input["maxResults"] = config.pageSize;
        if (config.client instanceof ECR_1.ECR) {
            page = await makePagedRequest(config.client, input, ...additionalArguments);
        }
        else if (config.client instanceof ECRClient_1.ECRClient) {
            page = await makePagedClientRequest(config.client, input, ...additionalArguments);
        }
        else {
            throw new Error("Invalid client, expected ECR | ECRClient");
        }
        yield page;
        token = page.nextToken;
        hasNext = !!token;
    }
    return undefined;
}
exports.paginateDescribeImages = paginateDescribeImages;


/***/ }),
/* 983 */,
/* 984 */,
/* 985 */,
/* 986 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExecOutput = exports.exec = void 0;
const string_decoder_1 = __webpack_require__(304);
const tr = __importStar(__webpack_require__(9));
/**
 * Exec a command.
 * Output will be streamed to the live console.
 * Returns promise with return code
 *
 * @param     commandLine        command to execute (can include additional args). Must be correctly escaped.
 * @param     args               optional arguments for tool. Escaping is handled by the lib.
 * @param     options            optional exec options.  See ExecOptions
 * @returns   Promise<number>    exit code
 */
function exec(commandLine, args, options) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandArgs = tr.argStringToArray(commandLine);
        if (commandArgs.length === 0) {
            throw new Error(`Parameter 'commandLine' cannot be null or empty.`);
        }
        // Path to tool to execute should be first arg
        const toolPath = commandArgs[0];
        args = commandArgs.slice(1).concat(args || []);
        const runner = new tr.ToolRunner(toolPath, args, options);
        return runner.exec();
    });
}
exports.exec = exec;
/**
 * Exec a command and get the output.
 * Output will be streamed to the live console.
 * Returns promise with the exit code and collected stdout and stderr
 *
 * @param     commandLine           command to execute (can include additional args). Must be correctly escaped.
 * @param     args                  optional arguments for tool. Escaping is handled by the lib.
 * @param     options               optional exec options.  See ExecOptions
 * @returns   Promise<ExecOutput>   exit code, stdout, and stderr
 */
function getExecOutput(commandLine, args, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let stdout = '';
        let stderr = '';
        //Using string decoder covers the case where a mult-byte character is split
        const stdoutDecoder = new string_decoder_1.StringDecoder('utf8');
        const stderrDecoder = new string_decoder_1.StringDecoder('utf8');
        const originalStdoutListener = (_a = options === null || options === void 0 ? void 0 : options.listeners) === null || _a === void 0 ? void 0 : _a.stdout;
        const originalStdErrListener = (_b = options === null || options === void 0 ? void 0 : options.listeners) === null || _b === void 0 ? void 0 : _b.stderr;
        const stdErrListener = (data) => {
            stderr += stderrDecoder.write(data);
            if (originalStdErrListener) {
                originalStdErrListener(data);
            }
        };
        const stdOutListener = (data) => {
            stdout += stdoutDecoder.write(data);
            if (originalStdoutListener) {
                originalStdoutListener(data);
            }
        };
        const listeners = Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.listeners), { stdout: stdOutListener, stderr: stdErrListener });
        const exitCode = yield exec(commandLine, args, Object.assign(Object.assign({}, options), { listeners }));
        //flush any remaining characters
        stdout += stdoutDecoder.end();
        stderr += stderrDecoder.end();
        return {
            exitCode,
            stdout,
            stderr
        };
    });
}
exports.getExecOutput = getExecOutput;
//# sourceMappingURL=exec.js.map

/***/ }),
/* 987 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteHeader = exports.getHeaderValue = exports.hasHeader = void 0;
const hasHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            return true;
        }
    }
    return false;
};
exports.hasHeader = hasHeader;
const getHeaderValue = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            return headers[headerName];
        }
    }
    return undefined;
};
exports.getHeaderValue = getHeaderValue;
const deleteHeader = (soughtHeader, headers) => {
    soughtHeader = soughtHeader.toLowerCase();
    for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
            delete headers[headerName];
        }
    }
};
exports.deleteHeader = deleteHeader;


/***/ }),
/* 988 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentLengthPlugin = exports.contentLengthMiddlewareOptions = exports.contentLengthMiddleware = void 0;
const protocol_http_1 = __webpack_require__(504);
const CONTENT_LENGTH_HEADER = "content-length";
function contentLengthMiddleware(bodyLengthChecker) {
    return (next) => async (args) => {
        const request = args.request;
        if (protocol_http_1.HttpRequest.isInstance(request)) {
            const { body, headers } = request;
            if (body &&
                Object.keys(headers)
                    .map((str) => str.toLowerCase())
                    .indexOf(CONTENT_LENGTH_HEADER) === -1) {
                const length = bodyLengthChecker(body);
                if (length !== undefined) {
                    request.headers = {
                        ...request.headers,
                        [CONTENT_LENGTH_HEADER]: String(length),
                    };
                }
            }
        }
        return next({
            ...args,
            request,
        });
    };
}
exports.contentLengthMiddleware = contentLengthMiddleware;
exports.contentLengthMiddlewareOptions = {
    step: "build",
    tags: ["SET_CONTENT_LENGTH", "CONTENT_LENGTH"],
    name: "contentLengthMiddleware",
    override: true,
};
const getContentLengthPlugin = (options) => ({
    applyToStack: (clientStack) => {
        clientStack.add(contentLengthMiddleware(options.bodyLengthChecker), exports.contentLengthMiddlewareOptions);
    },
});
exports.getContentLengthPlugin = getContentLengthPlugin;


/***/ }),
/* 989 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


const nodeToJson = __webpack_require__(727);
const xmlToNodeobj = __webpack_require__(170);
const x2xmlnode = __webpack_require__(170);
const buildOptions = __webpack_require__(839).buildOptions;
const validator = __webpack_require__(971);

exports.parse = function(xmlData, options, validationOption) {
  if( validationOption){
    if(validationOption === true) validationOption = {}
    
    const result = validator.validate(xmlData, validationOption);
    if (result !== true) {
      throw Error( result.err.msg)
    }
  }
  options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
  const traversableObj = xmlToNodeobj.getTraversalObj(xmlData, options)
  //print(traversableObj, "  ");
  return nodeToJson.convertToJson(traversableObj, options);
};
exports.convertTonimn = __webpack_require__(961).convert2nimn;
exports.getTraversalObj = xmlToNodeobj.getTraversalObj;
exports.convertToJson = nodeToJson.convertToJson;
exports.convertToJsonString = __webpack_require__(207).convertToJsonString;
exports.validate = validator.validate;
exports.j2xParser = __webpack_require__(200);
exports.parseToNimn = function(xmlData, schema, options) {
  return exports.convertTonimn(exports.getTraversalObj(xmlData, options), schema, options);
};


function print(xmlNode, indentation){
  if(xmlNode){
    console.log(indentation + "{")
    console.log(indentation + "  \"tagName\": \"" + xmlNode.tagname + "\", ");
    if(xmlNode.parent){
      console.log(indentation + "  \"parent\": \"" + xmlNode.parent.tagname  + "\", ");
    }
    console.log(indentation + "  \"val\": \"" + xmlNode.val  + "\", ");
    console.log(indentation + "  \"attrs\": " + JSON.stringify(xmlNode.attrsMap,null,4)  + ", ");

    if(xmlNode.child){
      console.log(indentation + "\"child\": {")
      const indentation2 = indentation + indentation;
      Object.keys(xmlNode.child).forEach( function(key) {
        const node = xmlNode.child[key];

        if(Array.isArray(node)){
          console.log(indentation +  "\""+key+"\" :[")
          node.forEach( function(item,index) {
            //console.log(indentation + " \""+index+"\" : [")
            print(item, indentation2);
          })
          console.log(indentation + "],")  
        }else{
          console.log(indentation + " \""+key+"\" : {")
          print(node, indentation2);
          console.log(indentation + "},")  
        }
      });
      console.log(indentation + "},")
    }
    console.log(indentation + "},")
  }
}


/***/ }),
/* 990 */,
/* 991 */
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.StartLifecyclePolicyPreviewCommand = void 0;
const middleware_serde_1 = __webpack_require__(347);
const smithy_client_1 = __webpack_require__(973);
const models_0_1 = __webpack_require__(163);
const Aws_json1_1_1 = __webpack_require__(559);
class StartLifecyclePolicyPreviewCommand extends smithy_client_1.Command {
    constructor(input) {
        super();
        this.input = input;
    }
    resolveMiddleware(clientStack, configuration, options) {
        this.middlewareStack.use(middleware_serde_1.getSerdePlugin(configuration, this.serialize, this.deserialize));
        const stack = clientStack.concat(this.middlewareStack);
        const { logger } = configuration;
        const clientName = "ECRClient";
        const commandName = "StartLifecyclePolicyPreviewCommand";
        const handlerExecutionContext = {
            logger,
            clientName,
            commandName,
            inputFilterSensitiveLog: models_0_1.StartLifecyclePolicyPreviewRequest.filterSensitiveLog,
            outputFilterSensitiveLog: models_0_1.StartLifecyclePolicyPreviewResponse.filterSensitiveLog,
        };
        const { requestHandler } = configuration;
        return stack.resolve((request) => requestHandler.handle(request.request, options || {}), handlerExecutionContext);
    }
    serialize(input, context) {
        return Aws_json1_1_1.serializeAws_json1_1StartLifecyclePolicyPreviewCommand(input, context);
    }
    deserialize(output, context) {
        return Aws_json1_1_1.deserializeAws_json1_1StartLifecyclePolicyPreviewCommand(output, context);
    }
}
exports.StartLifecyclePolicyPreviewCommand = StartLifecyclePolicyPreviewCommand;


/***/ }),
/* 992 */,
/* 993 */
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveUserAgentConfig = void 0;
function resolveUserAgentConfig(input) {
    return {
        ...input,
        customUserAgent: typeof input.customUserAgent === "string" ? [[input.customUserAgent]] : input.customUserAgent,
    };
}
exports.resolveUserAgentConfig = resolveUserAgentConfig;


/***/ })
/******/ ]);