import http from 'http';
import path from 'path';

import pushover from 'pushover';
import Git from 'git-wrapper';

import PromiseProxy from 'proxied-promise-object';
import _fs from 'fs';
import _gitEmit from 'git-emit';
import _temp from 'temp';
import _rimraf from 'rimraf';

import Runner from './runner';
import middleware from './middleware';

const fs = PromiseProxy(_fs);
const temp = PromiseProxy(_temp);

function PromiseWrap(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  };
}

let gitEmit = PromiseWrap(_gitEmit);
let rimraf = PromiseWrap(_rimraf);


const REPOS_DIR = 'repo';

var gitServer = pushover(REPOS_DIR);
var repoHooks = {};
var repoGits = {};

function setupHooks(repoName, repoPath) {
  if (!(repoName in repoHooks)) {
    return gitEmit(repoPath)
    .then((emitter) => {
      repoHooks[repoName] = emitter;
      emitter.on('update', (update) => onUpdate(repoPath, update));
      return emitter;
    });
  } else {
    return Promise.resolve(repoHooks[repoName]);
  }
}

gitServer.on('push', function (push) {
  var repoPath = path.join(REPOS_DIR, push.repo + '.git');
  setupHooks(push.repo, repoPath)
  .then(() => {
    push.accept();
  })
  .catch((err) => {
    console.log('err', err.stack || err);
    push.reject();
  });
});

function onUpdate(repoPath, update) {
  var git;
  var commit = update.arguments[2];
  var repoName = path.basename(repoPath);
  var checkoutPath;
  var runner;

  var output = (msg) => {
    if (update.output) {
      update.output(msg);
    }
    console.log(msg);
  };


  temp.mkdir('riddler')
  .then((tmpDir) => {
    checkoutPath = tmpDir;
    console.log(`checkoutPath = ${checkoutPath}, repoPath = ${repoPath}`);
    git = new PromiseProxy(Promise, new Git({
      'git-dir': repoPath,
      'work-tree': checkoutPath,
    }));
    return git.exec('checkout', [commit]);
  })
  .then(() => fs.readdir(checkoutPath))
  .then((dirList) => {
    if (dirList.indexOf('Dockerfile') === -1) {
      output('Error: No Dockerfile found. Aborting.');
      throw 'No Dockerfile found. Aborting';
    }
  })
  .then(() => {
    output('Building...');
    runner = new Runner(checkoutPath);
    return runner.build();
  })
  .then(() => {
    output('Running...');
    return runner.run();
  })
  .then((result) => output(`Result: ${result.trim()}`))
  .then(() => update.accept())
  .catch((err) => {
    console.error(err.stack || err);
    update.reject();
  })
  .then(() => {
    return rimraf(checkoutPath);
  });
}


var server = http.createServer(repos.handle.bind(repos));
server.listen(7000, () => {
  console.log('Listening on 127.0.0.1:7000.');
});
