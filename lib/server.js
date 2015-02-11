import http from 'http';
import path from 'path';
import fs from 'fs';

import pushover from 'pushover';
import _gitEmit from 'git-emit';
import PromiseProxy from 'proxied-promise-object';
import Git from 'git-wrapper';
import _temp from 'temp';

import Runner from './runner.js';

const temp = PromiseProxy(Promise, _temp);

const gitEmit = function(path) {
  return new Promise((resolve, reject) => {
    _gitEmit(path, (err, emitter) => {
      if (err) {
        reject(err);
      } else {
        resolve(emitter);
      }
    });
  });
}

const REPOS_DIR = 'repos';

var repos = pushover(REPOS_DIR);
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

repos.on('push', function (push) {
  var repoPath = path.join(REPOS_DIR, push.repo + '.git');
  setupHooks(push.repo, repoPath)
  .then(() => {
    push.accept();
  })
  .catch((err) => {
    console.log('err', err);
    push.reject();
  });
});

function onUpdate(repoPath, update) {
  var git;
  var commit = update.arguments[2];
  var repoName = path.basename(repoPath);
  var checkoutPath;
  var runner;

  temp.mkdir('riddler')
  .then((tmpDir) => {
    checkoutPath = tmpDir;
    git = new PromiseProxy(Promise, new Git({'git-dir': repoPath, 'work-tree': checkoutPath}));
    return git.exec('checkout', [commit]);
  })
  .then(() => {
    runner = new Runner(checkoutPath);
    return runner.build();
  })
  .then(() => runner.run())
  .then((result) => update.output(result.trim()))
  .then(() => update.accept())
  .catch((err) => {
    update.output('Error!');
    console.error(err.stack || err.trace || err);
    update.reject();
  });
}


var server = http.createServer(repos.handle.bind(repos));
server.listen(7000, () => {
  console.log('Listening on 127.0.0.1:7000.');
});