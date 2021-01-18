#! /usr/bin/env node

import { Command } from 'commander';
import packInfo from '../package.json';
import assert from 'assert';
import path from 'path';
import { normalizeDtsUrl } from './util';
import mkdirp from 'mkdirp';
import fs from 'fs';
import { create, CreateDtsFlags } from './';

let baseDir: string;
// d.ts dir
let dTsDir: string;
// program.args[0] file param is dir
let isDir: boolean;

function handleDirFile(file: string) {
    // is dir
    if (fs.statSync(file).isDirectory()) {
        const files = fs.readdirSync(file);
        files.forEach((filePath) => {
            filePath = path.isAbsolute(filePath)
                ? filePath
                : path.resolve(process.cwd(), file, filePath);
            console.log(filePath);
            handleDirFile(filePath);
        });
    } else {
        // is file
        file = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
        assert(fs.existsSync(file), `${file} not found`);

        // handle dist option
        let dist = program.dist;
        if (dist) {
            if (dist.endsWith('/')) {
                // dir
                dist += path.basename(file, path.extname(file));
            }
            dist = normalizeDtsUrl(dist);
            dist = path.isAbsolute(dist)
                ? dist
                : path.resolve(process.cwd(), dist);
            if (isDir) {
                dist = file
                    .replace(baseDir, dTsDir)
                    .replace(
                        path.basename(file),
                        path.basename(file, '.js') + '.d.ts'
                    );
            }
            mkdirp.sync(path.dirname(dist));
        }

        // handle flag option
        let flags = CreateDtsFlags.None;
        if (program.ignorePrivate) {
            flags |= CreateDtsFlags.IgnorePrivate;
        }

        // create dts env
        const env = create(file, {
            dist,
            flags,
        });

        if (program.terminal) {
            console.log(env.toString());
        } else {
            env.write(
                program.noPrefix
                    ? ''
                    : `// Generate by [${packInfo.name}@${packInfo.version}](${packInfo.homepage})`
            );
        }
    }
}

const program = new Command()
    .version(packInfo.version, '-v, --version')
    .usage('[options] <file>')
    .option(
        '-d, --dist [path]',
        'Create dts to giving path (default to the same dir as file)'
    )
    .option(
        '-t, --terminal',
        'Output the result to terminal instead of writing file to disk'
    )
    .option('--no-prefix', 'The generated code will has no prefix')
    .option('--ignore-private', 'Private properties are also being export');

program.parse(process.argv);

const file = program.args[0];
assert(file, 'file can not be empty');

if (fs.statSync(file).isDirectory()) {
    isDir = true;
    baseDir = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
    dTsDir = path.isAbsolute(program.dist)
        ? program.dist
        : path.resolve(process.cwd(), program.dist);
}

handleDirFile(file);
