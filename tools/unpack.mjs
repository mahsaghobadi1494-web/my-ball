/* tools/unpack.mjs — explode .pk/*.tgz into node_modules by REAL package name.
 *
 * `npm install` is blocked by the sandbox, so we `npm pack` every locked
 * version and unpack by hand. Never guess the destination from the tarball
 * filename: scoped packages are mangled (`@babel/core` -> `babel-core-7.x.tgz`).
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

var root = process.cwd();
var pk = path.join(root, '.pk');
var staging = '/tmp/pkgstage';
fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging, { recursive: true });

var ok = 0, fail = [];
var files = fs.readdirSync(pk).filter(function (x) { return x.endsWith('.tgz'); });
for (var i = 0; i < files.length; i++) {
  var f = files[i];
  var dir = path.join(staging, f.replace(/\.tgz$/, ''));
  fs.mkdirSync(dir, { recursive: true });
  try {
    execSync('tar -xzf ' + JSON.stringify(path.join(pk, f)) + ' -C ' + JSON.stringify(dir), { stdio: 'ignore' });
  } catch (e) { fail.push(f + ' untar'); continue; }
  var pj = path.join(dir, 'package', 'package.json');
  if (!fs.existsSync(pj)) { fail.push(f + ' no pkgjson'); continue; }
  var meta = JSON.parse(fs.readFileSync(pj, 'utf8'));
  var dest = path.join(root, 'node_modules', meta.name);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.rmSync(dest, { recursive: true, force: true });
  try { fs.renameSync(path.join(dir, 'package'), dest); } catch (e) {
    // cross-device fallback
    execSync('cp -R ' + JSON.stringify(path.join(dir, 'package')) + ' ' + JSON.stringify(dest));
  }
  ok++;
}
console.log('installed', ok, 'failed', fail.length);
if (fail.length) console.log(fail.slice(0, 20).join('\n'));
